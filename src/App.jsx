import { useState, useEffect, useCallback, useRef, forwardRef } from 'react'
import * as XLSX from 'xlsx'
import DEFAULT_PRICING from './pricing.js'

// ── Constants ─────────────────────────────────────────────────────────────────
const MONTHS     = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
const ADMIN_CODE = import.meta.env.VITE_ADMIN_CODE || 'c2admin'
const TEAM_CODE  = import.meta.env.VITE_TEAM_CODE  || 'c2team'
const DB_KEY     = 'c2_pricing_db_v2'
const PREP_KEY   = 'c2_preparers_v1'
const AUTH_KEY   = 'c2_team_auth'
const LOG_KEY    = 'c2_quotation_log'
const C2_LOGO    = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQahQ15JxgwEv7pQYAJZjVwRFgrWarY7nLEL2AEojc3WA&s=10'

const DEFAULT_PREPARERS = [
  { name:'Tommy Prayoga',  title:'Head of Agency' },
  { name:'Dinda Anandita', title:'Account Director' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(v, cur) {
  if (!v && v !== 0) return '—'
  const n = Math.round(Number(v))
  if (cur==='IDR') return 'Rp\u00A0' + n.toLocaleString('id-ID')
  return '$' + n.toLocaleString('en-US')
}
function fmtDate(d) {
  try { return new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'}) }
  catch { return d }
}
function fmtDateTime(iso) {
  try { return new Date(iso).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) }
  catch { return iso }
}
function autoQuoteNo(dateStr, code) {
  const d = new Date(dateStr||Date.now())
  return `001/${MONTHS[d.getMonth()]}/${(code||'CLT').toUpperCase().replace(/\s+/g,'').slice(0,6)}/${d.getFullYear()}`
}
function fmtPriceAdmin(price, cur) {
  return cur==='IDR' ? Math.round(price).toLocaleString('id-ID') : price.toString()
}
function parseAdminPrice(str) {
  return Number(String(str).replace(/\./g,'').replace(/,/g,'.')) || 0
}
function calcGrand(sub, disc, cur) {
  const net = sub-(disc||0); return cur==='IDR' ? net/0.98 : net
}
function calcTax(sub, disc, cur) {
  return cur==='IDR' ? calcGrand(sub,disc,cur)-(sub-(disc||0)) : 0
}

// ── PDF libs (lazy) ───────────────────────────────────────────────────────────
let _h2c=null, _jsPDF=null
async function loadPDFLibs() {
  if (!_h2c) {
    const [a,b]=await Promise.all([import('html2canvas'),import('jspdf')])
    _h2c=a.default; _jsPDF=b.jsPDF
  }
}
async function domToPDF(element, filename) {
  await loadPDFLibs()
  const clone = element.cloneNode(true)
  clone.style.cssText='position:fixed;left:-9999px;top:0;width:920px;background:white;z-index:-999;'
  clone.querySelectorAll('.no-print').forEach(el=>el.remove())
  document.body.appendChild(clone)
  const canvas = await _h2c(clone,{scale:2,useCORS:true,allowTaint:true,backgroundColor:'#ffffff',width:920,windowWidth:920})
  document.body.removeChild(clone)
  const imgData = canvas.toDataURL('image/jpeg',0.93)
  const pdf = new _jsPDF({orientation:'portrait',unit:'mm',format:'a4'})
  const pw=pdf.internal.pageSize.getWidth(), ph=pdf.internal.pageSize.getHeight()
  const ih=(canvas.height*pw)/canvas.width
  let pos=0,left=ih
  pdf.addImage(imgData,'JPEG',0,pos,pw,ih)
  left-=ph
  while(left>0){pos-=ph;pdf.addPage();pdf.addImage(imgData,'JPEG',0,pos,pw,ih);left-=ph}
  pdf.save(filename)
}

// ── Totals recalculator ───────────────────────────────────────────────────────
function recalcQuot(quot) {
  const subtotal = (quot.lineItems||[]).reduce((s,it)=>s+(Number(it.total)||0),0)
  const disc     = quot.discount||0
  const cur      = quot.currency
  const grand    = calcGrand(subtotal,disc,cur)
  const taxAmt   = calcTax(subtotal,disc,cur)
  const dpAmt    = grand*((quot.dpPct||50)/100)
  return {...quot,subtotal,grand,taxAmt,dpAmt}
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S={
  app:  {fontFamily:"'Inter',system-ui,sans-serif",background:'#0d0d0d',minHeight:'100vh',color:'#e0e0e0'},
  nav:  {background:'#111',borderBottom:'1px solid #222',padding:'11px 24px',display:'flex',alignItems:'center',gap:20},
  navT: {fontWeight:800,fontSize:15,color:'#D4AF37',letterSpacing:'0.06em'},
  cols: {display:'grid',gridTemplateColumns:'360px 1fr',minHeight:'calc(100vh - 50px)'},
  left: {padding:20,borderRight:'1px solid #1a1a1a',overflowY:'auto',maxHeight:'calc(100vh - 50px)',background:'#0f0f0f'},
  right:{background:'#f2f2f2',overflowY:'auto',maxHeight:'calc(100vh - 50px)'},
  sec:  {fontSize:11,fontWeight:700,color:'#D4AF37',letterSpacing:'0.1em',marginBottom:12,marginTop:4},
  field:{marginBottom:13},
  lbl:  {fontSize:11,color:'#888',display:'block',marginBottom:4},
  hr:   {border:'none',borderTop:'1px solid #1e1e1e',margin:'16px 0'},
  chip: {display:'inline-block',padding:'4px 10px',borderRadius:99,fontSize:11,cursor:'pointer',margin:'2px 3px',border:'1px solid #333',background:'#161616',color:'#999',userSelect:'none'},
  chipA:{background:'#D4AF37',color:'#000',border:'1px solid #D4AF37',fontWeight:600},
  empty:{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',color:'#999',fontSize:14,gap:10},
}
const bP={cursor:'pointer',border:'none',borderRadius:5,padding:'9px 18px',fontSize:13,fontFamily:'inherit',background:'#D4AF37',color:'#000',fontWeight:700}
const bG={cursor:'pointer',borderRadius:5,padding:'8px 16px',fontSize:13,fontFamily:'inherit',background:'#2a2a2a',color:'#ccc',border:'1px solid #3a3a3a'}
const bGr={cursor:'pointer',border:'none',borderRadius:5,padding:'7px 14px',fontSize:12,fontFamily:'inherit',background:'#1c4a2a',color:'#7fd9a0',fontWeight:600}
const bBl={cursor:'pointer',border:'none',borderRadius:5,padding:'7px 14px',fontSize:12,fontFamily:'inherit',background:'#1a2a4a',color:'#7ab0f0',fontWeight:600}
const bPr={cursor:'pointer',border:'1px solid #ccc',borderRadius:5,padding:'7px 14px',fontSize:12,fontFamily:'inherit',background:'#fff',color:'#333'}
const bRd={cursor:'pointer',border:'1px solid #5a1a1a',borderRadius:5,padding:'6px 12px',fontSize:12,fontFamily:'inherit',background:'transparent',color:'#f88'}
const bOr={cursor:'pointer',border:'none',borderRadius:5,padding:'7px 14px',fontSize:12,fontFamily:'inherit',background:'#3a2200',color:'#f5a623',fontWeight:600}

function Inp({label,...p}) {
  return <div style={S.field}>
    {label&&<label style={S.lbl}>{label}</label>}
    <input {...p} style={{background:'#1a1a1a',color:'#e0e0e0',border:'1px solid #2e2e2e',borderRadius:4,padding:'7px 10px',fontSize:13,width:'100%',boxSizing:'border-box',outline:'none',fontFamily:'inherit',...p.style}}/>
  </div>
}
function Txt({label,...p}) {
  return <div style={S.field}>
    {label&&<label style={S.lbl}>{label}</label>}
    <textarea {...p} style={{background:'#1a1a1a',color:'#e0e0e0',border:'1px solid #2e2e2e',borderRadius:4,padding:'7px 10px',fontSize:13,width:'100%',boxSizing:'border-box',resize:'vertical',outline:'none',fontFamily:'inherit',...p.style}}/>
  </div>
}

// ── Team Gate ─────────────────────────────────────────────────────────────────
function TeamGate({onAuth}) {
  const [code,setCode]=useState('');const [shake,setShake]=useState(false)
  function attempt(){if(code===TEAM_CODE)onAuth();else{setShake(true);setTimeout(()=>setShake(false),500);setCode('')}}
  return <div style={{minHeight:'100vh',background:'#0d0d0d',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Inter',system-ui,sans-serif"}}>
    <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
    <div style={{background:'#131313',border:'1px solid #222',borderRadius:12,padding:'40px 44px',width:340,animation:shake?'shake 0.4s':'none'}}>
      <div style={{fontWeight:800,fontSize:20,color:'#D4AF37',letterSpacing:'0.06em',marginBottom:6}}>C2 QUOTATION</div>
      <div style={{fontSize:13,color:'#666',marginBottom:28}}>Enter your team code to continue</div>
      <label style={S.lbl}>Team Code</label>
      <input type="password" value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==='Enter'&&attempt()} placeholder="••••••••"
        style={{background:'#1a1a1a',color:'#e0e0e0',border:'1px solid #333',borderRadius:5,padding:'10px 12px',fontSize:14,width:'100%',boxSizing:'border-box',outline:'none',fontFamily:'inherit',marginBottom:14}}/>
      <button style={{...bP,width:'100%',padding:11}} onClick={attempt}>Enter</button>
      <div style={{marginTop:16,fontSize:11,color:'#444',textAlign:'center'}}>Content Collision — Internal Use Only</div>
    </div>
  </div>
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [teamAuth,setTeamAuth]=useState(false)
  const [view,setView]=useState('gen')
  const [db,setDb]=useState(DEFAULT_PRICING)
  const [preparers,setPreparers]=useState(DEFAULT_PREPARERS)
  const quotDocRef=useRef(null)
  const logDocRef=useRef(null)

  // Generator form
  const [clientName,setClientName]=useState('')
  const [custId,setCustId]=useState('')
  const [period,setPeriod]=useState('')
  const [date,setDate]=useState(new Date().toISOString().slice(0,10))
  const [prepIdx,setPrepIdx]=useState(0)
  const [markets,setMarkets]=useState([])
  const [brief,setBrief]=useState('')
  const [discPct,setDiscPct]=useState(0)
  const [discNote,setDiscNote]=useState('')
  const [quoteNo,setQuoteNo]=useState('')

  // Output
  const [quot,setQuot]=useState(null)
  const [loading,setLoading]=useState(false)
  const [pdfBusy,setPdfBusy]=useState(false)
  const [error,setError]=useState('')
  const [editMode,setEditMode]=useState(false)

  // Log viewer
  const [viewingLog,setViewingLog]=useState(null)
  const [logPdfBusy,setLogPdfBusy]=useState(false)

  // Admin
  const [adminInput,setAdminInput]=useState('')
  const [adminAuth,setAdminAuth]=useState(false)
  const [adminTab,setAdminTab]=useState('pricing')
  const [adminMkt,setAdminMkt]=useState('indonesia')
  const [editRows,setEditRows]=useState([])
  const [editPreparers,setEditPreparers]=useState(DEFAULT_PREPARERS)
  const [newPrepName,setNewPrepName]=useState('')
  const [newPrepTitle,setNewPrepTitle]=useState('')
  const [log,setLog]=useState([])
  const [newSvc,setNewSvc]=useState({name:'',cat:'PR',sub:'',price:'',unit:'campaign',note:''})

  useEffect(()=>{
    try{
      if(localStorage.getItem(AUTH_KEY)==='true')setTeamAuth(true)
      const sd=localStorage.getItem(DB_KEY); if(sd)setDb(JSON.parse(sd))
      const sp=localStorage.getItem(PREP_KEY); if(sp){const p=JSON.parse(sp);setPreparers(p);setEditPreparers(p)}
      const sl=localStorage.getItem(LOG_KEY); if(sl)setLog(JSON.parse(sl))
    }catch{}
  },[])

  useEffect(()=>{ setQuoteNo(autoQuoteNo(date,custId||clientName)) },[date,custId,clientName])

  const saveDb=useCallback((d)=>{ setDb(d); try{localStorage.setItem(DB_KEY,JSON.stringify(d))}catch{} },[])
  function savePreparers(list){ setPreparers(list); try{localStorage.setItem(PREP_KEY,JSON.stringify(list))}catch{} }

  function addToLog(q,overrideQuoteNo){
    const prep=preparers[prepIdx]||preparers[0]
    const entry={
      id:Date.now().toString(),
      quoteNo:overrideQuoteNo||quoteNo,
      clientName:clientName||'—',
      custId:custId||'—',
      period:period||'—',
      date,
      preparedBy:prep.name,
      prepTitle:prep.title,
      prepIdx,
      markets:markets.map(m=>db[m]?.label||m),
      currency:q.currency,
      total:Math.round(q.grand),
      createdAt:new Date().toISOString(),
      quotData:q,
      formData:{clientName,custId,period,date,quoteNo:overrideQuoteNo||quoteNo}
    }
    const updated=[entry,...log].slice(0,200)
    setLog(updated)
    try{localStorage.setItem(LOG_KEY,JSON.stringify(updated))}catch{}
  }

  function handleTeamAuth(){localStorage.setItem(AUTH_KEY,'true');setTeamAuth(true)}
  const currency=markets.length===1&&markets[0]==='indonesia'?'IDR':'USD'
  function toggleMarket(m){setMarkets(prev=>prev.includes(m)?prev.filter(x=>x!==m):[...prev,m])}

  // ── Inline editing helpers ────────────────────────────────────────────────
  function updateLineItem(idx,field,val){
    setQuot(prev=>{
      if(!prev)return prev
      const items=prev.lineItems.map((it,i)=>{
        if(i!==idx)return it
        const u={...it,[field]:val}
        if(field==='qty'||field==='unitPrice')
          u.total=Number(field==='qty'?val:it.qty)*Number(field==='unitPrice'?val:it.unitPrice)
        return u
      })
      return recalcQuot({...prev,lineItems:items})
    })
  }

  function deleteLineItem(idx){
    setQuot(prev=>{
      if(!prev)return prev
      const items=prev.lineItems.filter((_,i)=>i!==idx).map((it,i)=>({...it,no:i+1}))
      return recalcQuot({...prev,lineItems:items})
    })
  }

  function addLineItem(){
    setQuot(prev=>{
      if(!prev)return prev
      const maxNo=Math.max(...(prev.lineItems||[]).map(it=>Number(it.no)||0),0)
      const blank={no:maxNo+1,category:'Additional',service:'New Service',description:'',qty:1,unit:'item',unitPrice:0,total:0,notes:''}
      const items=[...(prev.lineItems||[]),blank]
      return recalcQuot({...prev,lineItems:items})
    })
  }

  function saveRevision(){
    // Save the edited quotation back to the log as a new revision entry
    if(!quot)return
    addToLog(quot,quoteNo+'-REV')
    alert('✓ Revision saved to log.')
  }

  // ── Generate ──────────────────────────────────────────────────────────────
  async function generate(){
    if(!brief.trim()){setError('Enter a brief first.');return}
    if(markets.length===0){setError('Select at least one market.');return}
    setLoading(true);setError('');setQuot(null);setEditMode(false)

    const pricingRef=markets.map(m=>{
      const mkt=db[m];if(!mkt)return''
      return `=== ${mkt.label} (${mkt.currency}) ===\n`+mkt.services.map(s=>`• ${s.name}: ${s.price.toLocaleString()} ${mkt.currency}/${s.unit}${s.note?' ('+s.note+')':''}`).join('\n')
    }).join('\n\n')

    const systemPrompt=`You are a senior account director at Content Collision (C2), a B2B PR and content marketing agency in Southeast Asia.

Generate a professional quotation in JSON from the client brief below.

PRICING DATABASE:
${pricingRef}

CRITICAL RULES:
- Currency: ${currency}
- RETAINER / MANAGEMENT / CAMPAIGN FEES: qty = 1. unitPrice = the full rate. Never multiply by coverage count.
- COVERAGE (per coverage obtained): qty = number of coverages. unitPrice = per-coverage rate.
- NEVER include both a PR Campaign package AND separate coverage lines for the same campaign. Choose one.
- Media invite: qty = number of media outlets. unitPrice = per-media rate.
- DP: 50% for IDR, 30% for USD.
- Sequential numbers (1, 2, 3...) — no sub-numbering like 1.1.
- Each item must have a "category" field: "Public Relations", "Content Marketing", "KOL / Influencer", "Video Production", or "Paid Advertising".
- Descriptions: 2–3 lines of clear scope.

RETURN VALID JSON ONLY:
{"lineItems":[{"no":1,"category":"Public Relations","service":"PR Campaign – National Media","description":"End-to-end PR campaign targeting Tier 1 national media. Includes strategy, release creation, media outreach, and monthly reporting.","qty":1,"unit":"campaign","unitPrice":20000000,"total":20000000,"notes":"Performance-based"}],"subtotal":20000000,"dpPct":50,"paymentTerms":"50% down payment when project begins, remaining 50% upon completion","notes":["Press releases created for any campaign are provided free of charge."]}`

    try{
      const res=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({systemPrompt,messages:[{role:'user',content:`Client: ${clientName||'TBD'}\nPeriod: ${period||'TBD'}\nMarkets: ${markets.map(m=>db[m]?.label||m).join(', ')}\n\nBrief:\n${brief}`}]})})
      const data=await res.json()
      if(data.error)throw new Error(data.error)
      const raw=data.choices?.[0]?.message?.content
      if(!raw)throw new Error('No response from OpenAI. Check your API key.')
      const parsed=JSON.parse(raw)
      const discAmt=discPct>0?Math.round(parsed.subtotal*discPct/100):0
      const discTxt=discPct>0?`${discPct}% discount${discNote?' — '+discNote:''}`:''
      const q=recalcQuot({...parsed,currency,discount:discAmt,discountNote:discTxt})
      setQuot(q)
      addToLog(q)
    }catch(e){setError('Generation failed: '+e.message)}
    setLoading(false)
  }

  // ── PDF / Excel for current quotation ────────────────────────────────────
  async function exportPDF(){
    if(!quot||!quotDocRef.current)return
    setPdfBusy(true)
    try{await domToPDF(quotDocRef.current,`C2_Quotation_${(clientName||'Client').replace(/\s+/g,'_')}_${date}.pdf`)}
    catch(e){alert('PDF failed: '+e.message+'\n\nUse Print as fallback.')}
    setPdfBusy(false)
  }

  function buildExcelRows(q,qNo,cl,cId,per,dt,prep){
    const cur=q.currency
    const rows=[['CONTENT COLLISION (C2)'],[],
      ['PT Konten Global Adikarya','','','Date:',fmtDate(dt)],
      ['APL Office Tower Lantai 16 Unit 9','','','Quote #:',qNo],
      ['Jalan Letjen. S. Parman Kav. 28 Jakarta 11470','','','Prepared by:','Content Collision'],
      ['Phone: +62 812 7765 7773','','','Customer ID:',cId||cl||'—'],
      ['Email: young@contentcollision.co','','','Period:',per||'—'],
      ['NPWP: 82.351.078.9-036.000'],[],
      ['No','Main Service / Description','Qty','Price Per Unit','Total','Notes']]
    let lastCat=null
    ;(q.lineItems||[]).forEach(it=>{
      if(it.category!==lastCat){rows.push(['',`— ${it.category} —`,'','','','']);lastCat=it.category}
      rows.push([it.no,it.service+(it.description?'\n'+it.description:''),it.qty,it.unitPrice,it.total,it.notes||''])
    })
    rows.push([],['','','','Sub Total',q.subtotal,''])
    if(q.discount>0)rows.push(['','','',q.discountNote||'Discount',-q.discount,''])
    if(cur==='IDR')rows.push(['','','','PPh23 Tax (2%)',Math.round(q.taxAmt),''])
    rows.push(['','','','Grand Total',Math.round(q.grand),''])
    rows.push([],[`*C2 will begin after client pays ${q.dpPct}% down payment.`],[`*${q.paymentTerms}`])
    ;(q.notes||[]).forEach(n=>rows.push([`*${n}`]))
    if(cur==='IDR')rows.push(['*A 2% charge applies for late payments.'])
    rows.push([],['Quotation Prepared By:'],[],[prep.name],[prep.title],['PT Konten Global Adikarya (C2)'],[fmtDate(dt)])
    return rows
  }

  function exportExcel(){
    if(!quot)return
    const prep=preparers[prepIdx]||preparers[0]
    const rows=buildExcelRows(quot,quoteNo,clientName,custId,period,date,prep)
    const ws=XLSX.utils.aoa_to_sheet(rows)
    ws['!cols']=[{wch:6},{wch:55},{wch:8},{wch:22},{wch:22},{wch:34}]
    const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'Quotation')
    XLSX.writeFile(wb,`C2_Quotation_${(clientName||'Client').replace(/\s+/g,'_')}_${date}.xlsx`)
  }

  // ── Log viewer ────────────────────────────────────────────────────────────
  async function exportLogPDF(){
    if(!logDocRef.current||!viewingLog)return
    setLogPdfBusy(true)
    try{await domToPDF(logDocRef.current,`C2_Quotation_${viewingLog.clientName.replace(/\s+/g,'_')}_${viewingLog.date}.pdf`)}
    catch(e){alert('PDF failed: '+e.message)}
    setLogPdfBusy(false)
  }

  function exportLogExcel(){
    if(!viewingLog?.quotData)return
    const v=viewingLog
    const prep={name:v.preparedBy,title:v.prepTitle}
    const rows=buildExcelRows(v.quotData,v.quoteNo,v.clientName,v.custId,v.period,v.date,prep)
    const ws=XLSX.utils.aoa_to_sheet(rows)
    ws['!cols']=[{wch:6},{wch:55},{wch:8},{wch:22},{wch:22},{wch:34}]
    const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'Quotation')
    XLSX.writeFile(wb,`C2_Quotation_${v.clientName.replace(/\s+/g,'_')}_${v.date}.xlsx`)
  }

  // ── Admin helpers ─────────────────────────────────────────────────────────
  function startEditMkt(m){setAdminMkt(m);setEditRows(JSON.parse(JSON.stringify(db[m]?.services||[])))}
  function saveAdminPrices(){const nd={...db,[adminMkt]:{...db[adminMkt],services:editRows}};saveDb(nd);alert('✓ Saved.')}
  function updateRow(i,f,v){setEditRows(r=>{const a=[...r];a[i]={...a[i],[f]:f==='price'?parseAdminPrice(v):v};return a})}
  function deleteRow(i){if(!confirm('Delete this service?'))return;setEditRows(r=>r.filter((_,idx)=>idx!==i))}
  function addService(){
    if(!newSvc.name.trim()||!newSvc.price){alert('Name and price required.');return}
    const s={id:`c_${Date.now()}`,cat:newSvc.cat,sub:newSvc.sub||newSvc.cat,name:newSvc.name.trim(),price:parseAdminPrice(newSvc.price),unit:newSvc.unit,note:newSvc.note}
    setEditRows(r=>[...r,s]); setNewSvc({name:'',cat:'PR',sub:'',price:'',unit:'campaign',note:''})
  }
  function addPreparer(){
    if(!newPrepName.trim())return
    const l=[...editPreparers,{name:newPrepName.trim(),title:newPrepTitle.trim()||'Team Member'}]
    setEditPreparers(l);savePreparers(l);setNewPrepName('');setNewPrepTitle('')
  }
  function removePreparer(i){
    if(editPreparers.length<=1){alert('Need at least one.');return}
    const l=editPreparers.filter((_,idx)=>idx!==i);setEditPreparers(l);savePreparers(l)
  }
  function exportConfig(){const bl=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});const u=URL.createObjectURL(bl);const a=document.createElement('a');a.href=u;a.download='c2-pricing.json';a.click();URL.revokeObjectURL(u)}
  function importConfig(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{try{saveDb(JSON.parse(ev.target.result));startEditMkt(adminMkt);alert('✓ Imported.')}catch{alert('Invalid file.')}};r.readAsText(f)}

  // ─────────────────────────────────────────────────────────────────────────
  if(!teamAuth)return <TeamGate onAuth={handleTeamAuth}/>

  const currentPrep=preparers[prepIdx]||preparers[0]

  return <div style={S.app}>
    <style>{`
      @media print{.no-print{display:none!important}.print-area{max-height:none!important;overflow:visible!important}@page{margin:14mm}}
      *{box-sizing:border-box}
      ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#111}::-webkit-scrollbar-thumb{background:#333;border-radius:3px}
    `}</style>

    {/* ── Nav ───────────────────────────────────────────────────────────── */}
    <div className="no-print" style={S.nav}>
      <span style={S.navT}>C2 QUOTATION GENERATOR</span>
      <div style={{display:'flex',gap:8}}>
        <button style={view==='gen'?{...bP,padding:'6px 16px'}:{...bG,padding:'6px 16px'}} onClick={()=>setView('gen')}>Generator</button>
        <button style={view==='admin'?{...bP,padding:'6px 16px'}:{...bG,padding:'6px 16px'}} onClick={()=>setView('admin')}>Admin</button>
      </div>
      {quot&&<span style={{marginLeft:'auto',fontSize:12,color:'#666'}}>Draft: {quoteNo}</span>}
      <button style={{...bG,marginLeft:quot?0:'auto',padding:'6px 12px',fontSize:12,color:'#888'}} onClick={()=>{localStorage.removeItem(AUTH_KEY);window.location.reload()}}>Sign Out</button>
    </div>

    {/* ── Generator ─────────────────────────────────────────────────────── */}
    {view==='gen'&&<div style={S.cols}>
      {/* Left */}
      <div className="no-print" style={S.left}>
        <div style={S.sec}>CLIENT DETAILS</div>
        <Inp label="Client Name" value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="e.g. Agora.io"/>
        <Inp label="Customer ID / Code" value={custId} onChange={e=>setCustId(e.target.value)} placeholder="e.g. AGR"/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <Inp label="Date" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
          <Inp label="Period" value={period} onChange={e=>setPeriod(e.target.value)} placeholder="Jun–Aug 2026"/>
        </div>
        <Inp label="Quote Number" value={quoteNo} onChange={e=>setQuoteNo(e.target.value)}/>
        <div style={S.field}>
          <label style={S.lbl}>Prepared / Signed By</label>
          <select value={prepIdx} onChange={e=>setPrepIdx(Number(e.target.value))} style={{background:'#1a1a1a',color:'#e0e0e0',border:'1px solid #2e2e2e',borderRadius:4,padding:'7px 10px',fontSize:13,width:'100%',outline:'none',fontFamily:'inherit'}}>
            {preparers.map((p,i)=><option key={i} value={i}>{p.name} — {p.title}</option>)}
          </select>
        </div>
        <hr style={S.hr}/>
        <div style={S.sec}>MARKETS</div>
        <div style={{marginBottom:10}}>{Object.entries(db).map(([k,m])=>(
          <span key={k} style={{...S.chip,...(markets.includes(k)?S.chipA:{})}} onClick={()=>toggleMarket(k)}>{m.label}</span>
        ))}</div>
        {markets.length>0&&<div style={{fontSize:11,color:'#888',marginBottom:4}}>Currency: <strong style={{color:'#D4AF37'}}>{currency}</strong>{currency==='IDR'&&' — PPh23 (2%) applies'}</div>}
        <hr style={S.hr}/>
        <div style={S.sec}>BRIEF / REQUIREMENTS</div>
        <Txt rows={7} value={brief} onChange={e=>setBrief(e.target.value)}
          placeholder={"Paste brief, email, or list requirements.\n\nExamples:\n• 3-month PR retainer in SG and MY, 5 coverages/month\n• 10 ID national coverages + 1 op-ed\n• KOL: 5 nano + 2 micro in Indonesia, TikTok + IG"}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <Inp label="Discount %" type="number" min={0} max={100} value={discPct} onChange={e=>setDiscPct(Number(e.target.value))}/>
          <Inp label="Discount Label" value={discNote} onChange={e=>setDiscNote(e.target.value)} placeholder="e.g. Pilot discount"/>
        </div>
        <button style={{...bP,width:'100%',padding:12,fontSize:14,marginTop:4}} onClick={generate} disabled={loading}>
          {loading?'⏳  Generating…':'✦  Generate Quotation'}
        </button>
        {error&&<div style={{marginTop:12,padding:12,background:'#2a0d0d',borderRadius:6,color:'#f88',fontSize:12,lineHeight:1.5}}>{error}</div>}
        {quot&&<div style={{marginTop:12,padding:10,background:'#0a1a0a',borderRadius:6,fontSize:11,color:'#7fd9a0',lineHeight:1.6}}>
          ✓ Quotation generated. You can <strong>edit it directly</strong> using the Edit Mode button in the toolbar, then download.
        </div>}
      </div>

      {/* Right */}
      <div className="print-area" style={S.right}>
        {!quot
          ? <div style={S.empty}><div style={{fontSize:48}}>📄</div><div>Fill in the brief and click Generate</div><div style={{fontSize:12,color:'#bbb'}}>You can edit any line item after generation without regenerating.</div></div>
          : <QuotationDoc ref={quotDocRef} quot={quot} clientName={clientName} custId={custId} period={period} date={date} quoteNo={quoteNo} prep={currentPrep}
              editMode={editMode} onToggleEdit={()=>setEditMode(e=>!e)}
              onUpdateItem={updateLineItem} onDeleteItem={deleteLineItem} onAddItem={addLineItem}
              onSaveRevision={saveRevision}
              onPDF={exportPDF} onExcel={exportExcel} onPrint={()=>window.print()} pdfBusy={pdfBusy}/>
        }
      </div>
    </div>}

    {/* ── Admin ─────────────────────────────────────────────────────────── */}
    {view==='admin'&&<div style={{padding:28,maxWidth:1200,margin:'0 auto'}}>
      {!adminAuth
        ?<div style={{maxWidth:340,margin:'80px auto',background:'#161616',padding:28,borderRadius:10,border:'1px solid #2a2a2a'}}>
          <div style={{fontWeight:700,fontSize:17,marginBottom:20,color:'#D4AF37'}}>Admin Access</div>
          <Inp label="Admin Code" type="password" value={adminInput} onChange={e=>setAdminInput(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter'){if(adminInput===ADMIN_CODE){setAdminAuth(true);setAdminInput('');startEditMkt('indonesia')}else alert('Wrong code.')}}}/>
          <button style={{...bP,width:'100%'}} onClick={()=>{if(adminInput===ADMIN_CODE){setAdminAuth(true);setAdminInput('');startEditMkt('indonesia')}else alert('Wrong code.')}}>Enter</button>
         </div>
        :<>
          {/* Admin tabs */}
          <div style={{display:'flex',gap:8,marginBottom:24,borderBottom:'1px solid #222',paddingBottom:16,alignItems:'center'}}>
            <div style={{fontWeight:700,fontSize:18,color:'#D4AF37',marginRight:'auto'}}>Admin Panel</div>
            {[['pricing','Pricing'],['team','Team Members'],['log','Quotation Log']].map(([t,l])=>(
              <button key={t} style={adminTab===t?{...bP,padding:'6px 16px',fontSize:12}:{...bG,padding:'6px 16px',fontSize:12}} onClick={()=>setAdminTab(t)}>{l}</button>
            ))}
          </div>

          {/* Pricing */}
          {adminTab==='pricing'&&<>
            <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
              <button style={bP} onClick={saveAdminPrices}>💾 Save Changes</button>
              <button style={bG} onClick={exportConfig}>⬇ Export Config</button>
              <label style={{...bG,cursor:'pointer'}}>⬆ Import Config<input type="file" accept=".json" style={{display:'none'}} onChange={importConfig}/></label>
              <button style={bRd} onClick={()=>{if(confirm('Reset all prices?')){saveDb(DEFAULT_PRICING);startEditMkt(adminMkt)}}}>↩ Reset Defaults</button>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:20}}>
              {Object.entries(db).map(([k,m])=>(
                <button key={k} style={adminMkt===k?{...bP,padding:'5px 13px',fontSize:12}:{...bG,padding:'5px 13px',fontSize:12}} onClick={()=>startEditMkt(k)}>{m.label}</button>
              ))}
            </div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                <thead><tr style={{background:'#111'}}>
                  {['Service Name','Category','Sub','Unit',`Price (${db[adminMkt]?.currency})`,'Note',''].map(h=>(
                    <th key={h} style={{padding:'8px 10px',textAlign:'left',color:'#888',fontWeight:600,borderBottom:'1px solid #222',whiteSpace:'nowrap'}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{editRows.map((s,i)=>(
                  <tr key={s.id||i} style={{background:i%2===0?'#0f0f0f':'#131313',borderBottom:'1px solid #1a1a1a'}}>
                    {[['name',180],['cat',90],['sub',90],['unit',80]].map(([f,w])=>(
                      <td key={f} style={{padding:'6px 8px'}}>
                        <input value={s[f]||''} onChange={e=>updateRow(i,f,e.target.value)}
                          style={{background:'#1e1e1e',color:'#ddd',border:'1px solid #2a2a2a',borderRadius:3,padding:'4px 7px',fontSize:12,width:w,outline:'none',fontFamily:'inherit'}}/>
                      </td>
                    ))}
                    <td style={{padding:'6px 8px'}}>
                      <input value={fmtPriceAdmin(s.price,db[adminMkt]?.currency)} onChange={e=>updateRow(i,'price',e.target.value)}
                        style={{background:'#1e1e1e',color:'#e0e0e0',border:'1px solid #2a2a2a',borderRadius:3,padding:'4px 7px',fontSize:12,width:120,textAlign:'right',outline:'none',fontFamily:'inherit'}}/>
                    </td>
                    <td style={{padding:'6px 8px'}}>
                      <input value={s.note||''} onChange={e=>updateRow(i,'note',e.target.value)}
                        style={{background:'#1e1e1e',color:'#888',border:'1px solid #2a2a2a',borderRadius:3,padding:'4px 7px',fontSize:11,width:'100%',outline:'none',fontFamily:'inherit'}}/>
                    </td>
                    <td style={{padding:'6px 8px'}}><button style={bRd} onClick={()=>deleteRow(i)}>✕</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div style={{marginTop:20,background:'#161616',padding:18,borderRadius:8,border:'1px solid #222'}}>
              <div style={{fontWeight:600,fontSize:13,color:'#D4AF37',marginBottom:14}}>+ Add New Service</div>
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 2fr',gap:10,marginBottom:10}}>
                {[['name','Service Name'],['cat','Category'],['sub','Sub'],['unit','Unit'],['price',`Price (${db[adminMkt]?.currency})`]].map(([k,l])=>(
                  <div key={k}><label style={{...S.lbl,marginBottom:3}}>{l}</label>
                    <input value={newSvc[k]} onChange={e=>setNewSvc(s=>({...s,[k]:e.target.value}))}
                      style={{background:'#1a1a1a',color:'#e0e0e0',border:'1px solid #2e2e2e',borderRadius:4,padding:'6px 8px',fontSize:12,width:'100%',outline:'none',fontFamily:'inherit'}}/>
                  </div>
                ))}
                <div><label style={{...S.lbl,marginBottom:3}}>Note</label>
                  <input value={newSvc.note} onChange={e=>setNewSvc(s=>({...s,note:e.target.value}))}
                    style={{background:'#1a1a1a',color:'#e0e0e0',border:'1px solid #2e2e2e',borderRadius:4,padding:'6px 8px',fontSize:12,width:'100%',outline:'none',fontFamily:'inherit'}}/>
                </div>
              </div>
              <button style={bP} onClick={addService}>+ Add Service</button>
              <div style={{marginTop:8,fontSize:11,color:'#666'}}>Click "Save Changes" after adding to persist.</div>
            </div>
          </>}

          {/* Team */}
          {adminTab==='team'&&<div style={{maxWidth:600}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13,marginBottom:24}}>
              <thead><tr style={{background:'#111'}}>{['Name','Title',''].map(h=><th key={h} style={{padding:'8px 12px',textAlign:'left',color:'#888',fontWeight:600,borderBottom:'1px solid #222'}}>{h}</th>)}</tr></thead>
              <tbody>{editPreparers.map((p,i)=>(
                <tr key={i} style={{background:i%2===0?'#0f0f0f':'#131313',borderBottom:'1px solid #1a1a1a'}}>
                  <td style={{padding:'10px 12px',color:'#ddd',fontWeight:500}}>{p.name}</td>
                  <td style={{padding:'10px 12px',color:'#999'}}>{p.title}</td>
                  <td style={{padding:'10px 12px',textAlign:'right'}}><button style={bRd} onClick={()=>removePreparer(i)}>Remove</button></td>
                </tr>
              ))}</tbody>
            </table>
            <div style={{background:'#161616',padding:20,borderRadius:8,border:'1px solid #222'}}>
              <div style={{fontWeight:600,fontSize:13,color:'#D4AF37',marginBottom:14}}>Add Team Member</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <Inp label="Full Name" value={newPrepName} onChange={e=>setNewPrepName(e.target.value)} placeholder="e.g. Siti Rahma"/>
                <Inp label="Title / Role" value={newPrepTitle} onChange={e=>setNewPrepTitle(e.target.value)} placeholder="e.g. Account Manager"/>
              </div>
              <button style={bP} onClick={addPreparer}>+ Add Member</button>
            </div>
          </div>}

          {/* Log */}
          {adminTab==='log'&&<>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
              <div style={{fontSize:13,color:'#888'}}>{log.length} quotation{log.length!==1?'s':''} in log</div>
              <button style={bRd} onClick={()=>{if(confirm('Clear all log entries?')){setLog([]);try{localStorage.removeItem(LOG_KEY)}catch{}}}}>Clear Log</button>
              <button style={bG} onClick={()=>{
                const csv=['Quote No,Client,Customer ID,Prepared By,Markets,Currency,Total,Created At']
                  .concat(log.map(e=>`${e.quoteNo},"${e.clientName}",${e.custId},"${e.preparedBy}","${(e.markets||[]).join(' + ')}",${e.currency},${e.total},${e.createdAt}`))
                  .join('\n')
                const bl=new Blob([csv],{type:'text/csv'});const u=URL.createObjectURL(bl);const a=document.createElement('a');a.href=u;a.download='c2-quotation-log.csv';a.click();URL.revokeObjectURL(u)
              }}>⬇ Export CSV</button>
            </div>
            {log.length===0
              ?<div style={{color:'#666',fontSize:13}}>No quotations generated yet.</div>
              :<table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                <thead><tr style={{background:'#111'}}>{['Quote #','Client','Prepared By','Markets','Currency','Total','Created At',''].map(h=>(
                  <th key={h} style={{padding:'8px 10px',textAlign:'left',color:'#888',fontWeight:600,borderBottom:'1px solid #222',whiteSpace:'nowrap'}}>{h}</th>
                ))}</tr></thead>
                <tbody>{log.map((e,i)=>(
                  <tr key={e.id} style={{background:i%2===0?'#0f0f0f':'#131313',borderBottom:'1px solid #1a1a1a'}}>
                    <td style={{padding:'8px 10px',color:'#D4AF37',fontFamily:'monospace',fontSize:11}}>{e.quoteNo}</td>
                    <td style={{padding:'8px 10px',color:'#ddd',fontWeight:500}}>{e.clientName}</td>
                    <td style={{padding:'8px 10px',color:'#ccc'}}>{e.preparedBy}</td>
                    <td style={{padding:'8px 10px',color:'#888',fontSize:11}}>{(e.markets||[]).join(', ')}</td>
                    <td style={{padding:'8px 10px',color:'#888'}}>{e.currency}</td>
                    <td style={{padding:'8px 10px',color:'#ccc',fontWeight:600}}>{(e.total||0).toLocaleString(e.currency==='IDR'?'id-ID':'en-US')}</td>
                    <td style={{padding:'8px 10px',color:'#666',fontSize:11,whiteSpace:'nowrap'}}>{fmtDateTime(e.createdAt)}</td>
                    <td style={{padding:'8px 10px'}}>
                      {e.quotData
                        ?<button style={{...bBl,padding:'5px 12px',fontSize:11}} onClick={()=>setViewingLog(e)}>View / Download</button>
                        :<span style={{fontSize:11,color:'#555'}}>No data</span>}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            }
          </>}
        </>
      }
    </div>}

    {/* ── Log Viewer Modal ──────────────────────────────────────────────── */}
    {viewingLog&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:1000,overflowY:'auto',display:'flex',flexDirection:'column'}}>
      <div className="no-print" style={{background:'#111',borderBottom:'1px solid #222',padding:'12px 28px',display:'flex',alignItems:'center',gap:16,flexShrink:0}}>
        <div style={{fontWeight:700,color:'#D4AF37',fontFamily:'monospace'}}>{viewingLog.quoteNo}</div>
        <div style={{color:'#888',fontSize:13}}>{viewingLog.clientName} — {fmtDateTime(viewingLog.createdAt)}</div>
        <div style={{marginLeft:'auto',display:'flex',gap:10}}>
          <button style={bBl} onClick={exportLogPDF} disabled={logPdfBusy}>{logPdfBusy?'⏳ Generating…':'⬇ Download PDF'}</button>
          <button style={bGr} onClick={exportLogExcel}>⬇ Download Excel</button>
          <button style={bG} onClick={()=>setViewingLog(null)}>✕ Close</button>
        </div>
      </div>
      <div style={{background:'#f2f2f2',flexGrow:1}}>
        <QuotationDoc
          ref={logDocRef}
          quot={viewingLog.quotData}
          clientName={viewingLog.clientName}
          custId={viewingLog.custId}
          period={viewingLog.period}
          date={viewingLog.date}
          quoteNo={viewingLog.quoteNo}
          prep={{name:viewingLog.preparedBy,title:viewingLog.prepTitle}}
          editMode={false}
          onPDF={exportLogPDF}
          onExcel={exportLogExcel}
          onPrint={()=>window.print()}
          pdfBusy={logPdfBusy}
          hideToolbar={true}
        />
      </div>
    </div>}
  </div>
}

// ── Quotation Document ────────────────────────────────────────────────────────
const QuotationDoc=forwardRef(function QuotationDoc({
  quot,clientName,custId,period,date,quoteNo,prep,
  editMode,onToggleEdit,onUpdateItem,onDeleteItem,onAddItem,onSaveRevision,
  onPDF,onExcel,onPrint,pdfBusy,hideToolbar
},ref){
  const cur=quot.currency
  const grouped=[];let lastCat=null
  ;(quot.lineItems||[]).forEach((it,i)=>{
    if(it.category!==lastCat){grouped.push({type:'hdr',label:it.category});lastCat=it.category}
    grouped.push({type:'row',...it,_idx:i})
  })

  // Inline input style
  const iS={background:'#f9f9e8',border:'1px solid #ccc',borderRadius:3,padding:'3px 6px',fontSize:11,outline:'none',fontFamily:'Arial,Helvetica,sans-serif',width:'100%',boxSizing:'border-box'}

  return <div ref={ref}>
    {/* Toolbar */}
    {!hideToolbar&&<div className="no-print" style={{background:'#fff',borderBottom:'1px solid #e0e0e0',padding:'10px 32px',display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
      <span style={{fontSize:12,color:'#777',fontFamily:'monospace'}}>Draft — {quoteNo}</span>
      {onToggleEdit&&<button style={editMode?{...bP,padding:'7px 14px',fontSize:12}:{...bOr,padding:'7px 14px',fontSize:12}} onClick={onToggleEdit}>
        {editMode?'✓ Done Editing':'✏️ Edit Quotation'}
      </button>}
      {editMode&&onAddItem&&<button style={{...bG,padding:'7px 14px',fontSize:12}} onClick={onAddItem}>+ Add Row</button>}
      {editMode&&onSaveRevision&&<button style={{...bG,padding:'7px 14px',fontSize:12,color:'#aaa'}} onClick={onSaveRevision}>💾 Save Revision to Log</button>}
      {!editMode&&<>
        <button style={{...bBl,padding:'7px 14px'}} onClick={onPDF} disabled={pdfBusy}>{pdfBusy?'⏳ Generating PDF…':'⬇ Download PDF'}</button>
        <button style={bGr} onClick={onExcel}>⬇ Download Excel</button>
        <button style={bPr} onClick={onPrint}>🖨 Print</button>
      </>}
      {editMode&&<span style={{fontSize:11,color:'#f5a623',marginLeft:'auto'}}>⚡ Edit mode — changes apply immediately. Click Done Editing to return to normal view.</span>}
    </div>}

    {/* Document body */}
    <div style={{padding:'44px 52px',maxWidth:920,margin:'0 auto',fontFamily:'Arial,Helvetica,sans-serif',fontSize:12,color:'#000',background:'#fff'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div style={{fontWeight:900,fontSize:22,letterSpacing:'0.07em'}}>CONTENT COLLISION (C2)</div>
        <img src={C2_LOGO} alt="C2" crossOrigin="anonymous" style={{height:52,width:'auto',objectFit:'contain',marginLeft:16}} onError={e=>e.target.style.display='none'}/>
      </div>

      {/* Company + Quote details */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 270px',gap:28,marginTop:16}}>
        <div style={{lineHeight:1.75,color:'#333'}}>
          <div style={{fontWeight:600}}>PT Konten Global Adikarya</div>
          <div>APL Office Tower Lantai 16 Unit 9</div>
          <div>Jalan Letjen. S. Parman Kav. 28 Jakarta 11470</div>
          <div>Phone: +62 812 7765 7773</div>
          <div>Email: young@contentcollision.co</div>
          <div>NPWP: 82.351.078.9-036.000</div>
        </div>
        <div>{[['Date',fmtDate(date)],['Quote #',quoteNo],['Prepared by','Content Collision'],['Customer ID',custId||clientName||'—'],['Period',period||'—']].map(([k,v])=>(
          <div key={k} style={{display:'grid',gridTemplateColumns:'100px 1fr',lineHeight:2.1}}>
            <span style={{color:'#555'}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
          </div>
        ))}</div>
      </div>

      <div style={{borderTop:'2px solid #000',marginTop:20}}/>

      {/* Table */}
      <table style={{width:'100%',borderCollapse:'collapse',marginTop:14,fontSize:12}}>
        <thead>
          <tr style={{background:'#000',color:'#fff'}}>
            {['No','Main Service / Description','Qty','Price Per Unit','Total','Notes'].map((h,i)=>(
              <th key={h} style={{padding:'8px 10px',textAlign:i>=2&&i<=4?'right':'left',fontWeight:700,whiteSpace:'nowrap',fontSize:11}}>{h}</th>
            ))}
            {editMode&&<th style={{padding:'8px 6px',width:28}}></th>}
          </tr>
        </thead>
        <tbody>
          {grouped.map((row,gi)=>row.type==='hdr'
            ?<tr key={`h${gi}`}>
               <td colSpan={editMode?7:6} style={{padding:`${gi>0?14:8}px 10px 4px`,fontWeight:700,fontSize:10,color:'#555',textTransform:'uppercase',letterSpacing:'0.08em',borderTop:gi>0?'1px solid #e0e0e0':'none'}}>
                 {row.label}
               </td>
             </tr>
            :<tr key={`r${gi}`} style={{borderBottom:'1px solid #ebebeb',background:row._idx%2===0?'#fff':'#fafafa'}}>
               <td style={{padding:'7px 10px',color:'#666',whiteSpace:'nowrap',verticalAlign:'top',width:28}}>{row.no}</td>
               <td style={{padding:'7px 10px',verticalAlign:'top'}}>
                 {editMode
                   ?<><input value={row.service||''} onChange={e=>onUpdateItem(row._idx,'service',e.target.value)} style={{...iS,fontWeight:600,marginBottom:4}}/>
                     <textarea value={row.description||''} rows={2} onChange={e=>onUpdateItem(row._idx,'description',e.target.value)} style={{...iS,resize:'vertical'}}/></>
                   :<><div style={{fontWeight:600}}>{row.service}</div>
                     {row.description&&<div style={{color:'#555',marginTop:3,lineHeight:1.55}}>{row.description}</div>}</>
                 }
               </td>
               <td style={{padding:'7px 10px',verticalAlign:'top',textAlign:'right',whiteSpace:'nowrap',width:50}}>
                 {editMode
                   ?<input type="number" value={row.qty} onChange={e=>onUpdateItem(row._idx,'qty',e.target.value)} style={{...iS,width:50,textAlign:'right'}}/>
                   :row.qty}
               </td>
               <td style={{padding:'7px 10px',verticalAlign:'top',textAlign:'right',whiteSpace:'nowrap',width:100}}>
                 {editMode
                   ?<input type="number" value={row.unitPrice} onChange={e=>onUpdateItem(row._idx,'unitPrice',e.target.value)} style={{...iS,width:100,textAlign:'right'}}/>
                   :fmt(row.unitPrice,cur)}
               </td>
               <td style={{padding:'7px 10px',verticalAlign:'top',textAlign:'right',whiteSpace:'nowrap',fontWeight:600,width:100}}>
                 {fmt(row.total,cur)}
               </td>
               <td style={{padding:'7px 10px',verticalAlign:'top',color:'#666',fontSize:11,lineHeight:1.4}}>
                 {editMode
                   ?<input value={row.notes||''} onChange={e=>onUpdateItem(row._idx,'notes',e.target.value)} style={{...iS}}/>
                   :row.notes}
               </td>
               {editMode&&<td style={{padding:'7px 6px',verticalAlign:'top'}}>
                 <button onClick={()=>onDeleteItem(row._idx)} style={{cursor:'pointer',background:'#fee',border:'1px solid #fcc',borderRadius:3,color:'#c00',fontSize:11,padding:'2px 6px',fontFamily:'inherit'}}>✕</button>
               </td>}
             </tr>
          )}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{display:'flex',justifyContent:'flex-end',marginTop:18}}>
        <table style={{fontSize:12,borderCollapse:'collapse',minWidth:320}}>
          <tbody>
            <tr><td style={{padding:'5px 14px',color:'#555'}}>Sub Total</td><td style={{padding:'5px 14px',textAlign:'right',fontWeight:600}}>{fmt(quot.subtotal,cur)}</td></tr>
            {quot.discount>0&&<tr><td style={{padding:'5px 14px',color:'#555'}}>{quot.discountNote||'Discount'}</td><td style={{padding:'5px 14px',textAlign:'right',color:'#b00'}}>({fmt(quot.discount,cur)})</td></tr>}
            {cur==='IDR'&&<tr><td style={{padding:'5px 14px',color:'#555'}}>PPh23 Tax (2%)</td><td style={{padding:'5px 14px',textAlign:'right'}}>{fmt(quot.taxAmt,cur)}</td></tr>}
            <tr style={{borderTop:'2.5px solid #000'}}>
              <td style={{padding:'9px 14px',fontWeight:700,fontSize:13}}>Grand Total</td>
              <td style={{padding:'9px 14px',fontWeight:700,fontSize:13,textAlign:'right'}}>{fmt(quot.grand,cur)}</td>
            </tr>
            <tr style={{borderTop:'1px solid #e8e8e8'}}>
              <td style={{padding:'5px 14px',color:'#777',fontSize:11}}>Down Payment ({quot.dpPct}%)</td>
              <td style={{padding:'5px 14px',textAlign:'right',color:'#777',fontSize:11}}>{fmt(quot.dpAmt,cur)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <div style={{marginTop:26,lineHeight:1.75,color:'#444',fontSize:11}}>
        <div>*C2 will begin the project after client has paid <strong>{quot.dpPct}%</strong> of the total fee as down payment.</div>
        <div>*{quot.paymentTerms}</div>
        {(quot.notes||[]).map((n,i)=><div key={i}>*{n}</div>)}
        {cur==='IDR'&&<div>*A 2% charge will apply for late payments.</div>}
        {cur==='USD'&&<div>*Price excludes Indonesian Corporate Income Tax. Gross amount invoiced: {fmt(Math.round(quot.grand),cur)}.</div>}
      </div>

      {/* Signature */}
      <div style={{marginTop:44}}>
        <div style={{fontWeight:600,marginBottom:44,color:'#333'}}>Quotation Prepared By:</div>
        <div style={{fontWeight:700,fontSize:13}}>{prep?.name||'Tommy Prayoga'}</div>
        <div style={{color:'#444'}}>{prep?.title||'Head of Agency'}</div>
        <div style={{color:'#444'}}>PT Konten Global Adikarya (C2)</div>
        <div style={{color:'#888',marginTop:4,fontSize:11}}>{fmtDate(date)}</div>
      </div>
      <div style={{marginTop:36,borderTop:'1px solid #e0e0e0',paddingTop:12,fontSize:10,color:'#bbb',textAlign:'center'}}>
        CONFIDENTIAL — PT KONTEN GLOBAL ADIKARYA (C2) — young@contentcollision.co
      </div>
    </div>
  </div>
})
