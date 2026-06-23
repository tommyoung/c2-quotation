import { useState, useEffect, useCallback } from 'react'
import * as XLSX from 'xlsx'
import DEFAULT_PRICING from './pricing.js'

// ── Constants ─────────────────────────────────────────────────────────────────
const MONTHS      = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
const ADMIN_CODE  = import.meta.env.VITE_ADMIN_CODE || 'c2admin'
const TEAM_CODE   = import.meta.env.VITE_TEAM_CODE  || 'c2team'
const STORAGE_KEY = 'c2_pricing_db_v2'
const PREP_KEY    = 'c2_preparers_v1'
const AUTH_KEY    = 'c2_team_auth'

const DEFAULT_PREPARERS = [
  { name: 'Tommy Prayoga',   title: 'Head of Agency' },
  { name: 'Dinda Anandita',  title: 'Account Director' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(v, cur) {
  if (!v && v !== 0) return '—'
  const n = Math.round(Number(v))
  if (cur === 'IDR') return 'Rp ' + n.toLocaleString('id-ID')
  return '$' + n.toLocaleString('en-US')
}
function fmtDate(d) {
  try { return new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' }) }
  catch { return d }
}
function autoQuoteNo(dateStr, code) {
  const d  = new Date(dateStr || Date.now())
  const mo = MONTHS[d.getMonth()]
  const yr = d.getFullYear()
  const cl = (code || 'CLT').toUpperCase().replace(/\s+/g,'').slice(0,6)
  return `001/${mo}/${cl}/${yr}`
}
function calcGrand(sub, disc) { return (sub - (disc||0)) / 0.98 }
function calcTax(sub, disc)   { return calcGrand(sub,disc) - (sub-(disc||0)) }

// ── Inline styles ─────────────────────────────────────────────────────────────
const S = {
  app:     { fontFamily:"'Inter',system-ui,sans-serif", background:'#0d0d0d', minHeight:'100vh', color:'#e0e0e0' },
  nav:     { background:'#111', borderBottom:'1px solid #222', padding:'11px 24px', display:'flex', alignItems:'center', gap:20 },
  navTit:  { fontWeight:800, fontSize:15, color:'#D4AF37', letterSpacing:'0.06em' },
  cols:    { display:'grid', gridTemplateColumns:'360px 1fr', minHeight:'calc(100vh - 50px)' },
  left:    { padding:20, borderRight:'1px solid #1a1a1a', overflowY:'auto', maxHeight:'calc(100vh - 50px)', background:'#0f0f0f' },
  right:   { background:'#f2f2f2', overflowY:'auto', maxHeight:'calc(100vh - 50px)' },
  sec:     { fontSize:11, fontWeight:700, color:'#D4AF37', letterSpacing:'0.1em', marginBottom:12, marginTop:4 },
  field:   { marginBottom:13 },
  label:   { fontSize:11, color:'#888', display:'block', marginBottom:4 },
  hr:      { border:'none', borderTop:'1px solid #1e1e1e', margin:'16px 0' },
  chip:    { display:'inline-block', padding:'4px 10px', borderRadius:99, fontSize:11, cursor:'pointer', margin:'2px 3px', border:'1px solid #333', background:'#161616', color:'#999', userSelect:'none' },
  chipOn:  { background:'#D4AF37', color:'#000', border:'1px solid #D4AF37', fontWeight:600 },
  empty:   { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'#999', fontSize:14, gap:10 },
}
const btnP  = { cursor:'pointer', border:'none', borderRadius:5, padding:'9px 18px', fontSize:13, fontFamily:'inherit', background:'#D4AF37', color:'#000', fontWeight:700 }
const btnG  = { cursor:'pointer', borderRadius:5, padding:'8px 16px', fontSize:13, fontFamily:'inherit', background:'#2a2a2a', color:'#ccc', border:'1px solid #3a3a3a' }
const btnGr = { cursor:'pointer', border:'none', borderRadius:5, padding:'7px 14px', fontSize:12, fontFamily:'inherit', background:'#1c4a2a', color:'#7fd9a0', fontWeight:600 }
const btnPr = { cursor:'pointer', border:'1px solid #ccc', borderRadius:5, padding:'7px 14px', fontSize:12, fontFamily:'inherit', background:'#fff', color:'#333' }
const btnRd = { cursor:'pointer', border:'1px solid #5a1a1a', borderRadius:5, padding:'6px 12px', fontSize:12, fontFamily:'inherit', background:'transparent', color:'#f88' }

function Inp({ label, ...p }) {
  return (
    <div style={S.field}>
      {label && <label style={S.label}>{label}</label>}
      <input {...p} style={{ background:'#1a1a1a', color:'#e0e0e0', border:'1px solid #2e2e2e', borderRadius:4, padding:'7px 10px', fontSize:13, width:'100%', boxSizing:'border-box', outline:'none', fontFamily:'inherit', ...p.style }} />
    </div>
  )
}
function Txt({ label, ...p }) {
  return (
    <div style={S.field}>
      {label && <label style={S.label}>{label}</label>}
      <textarea {...p} style={{ background:'#1a1a1a', color:'#e0e0e0', border:'1px solid #2e2e2e', borderRadius:4, padding:'7px 10px', fontSize:13, width:'100%', boxSizing:'border-box', resize:'vertical', outline:'none', fontFamily:'inherit', ...p.style }} />
    </div>
  )
}

// ── Team Gate ─────────────────────────────────────────────────────────────────
function TeamGate({ onAuth }) {
  const [code, setCode]   = useState('')
  const [shake, setShake] = useState(false)
  function attempt() {
    if (code === TEAM_CODE) { onAuth() }
    else { setShake(true); setTimeout(()=>setShake(false),500); setCode('') }
  }
  return (
    <div style={{ minHeight:'100vh', background:'#0d0d0d', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
      <div style={{ background:'#131313', border:'1px solid #222', borderRadius:12, padding:'40px 44px', width:340, animation: shake ? 'shake 0.4s' : 'none' }}>
        <div style={{ fontWeight:800, fontSize:20, color:'#D4AF37', letterSpacing:'0.06em', marginBottom:6 }}>C2 QUOTATION</div>
        <div style={{ fontSize:13, color:'#666', marginBottom:28 }}>Enter your team code to continue</div>
        <label style={S.label}>Team Code</label>
        <input type="password" value={code}
          onChange={e=>setCode(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&attempt()}
          placeholder="••••••••"
          style={{ background:'#1a1a1a', color:'#e0e0e0', border:'1px solid #333', borderRadius:5, padding:'10px 12px', fontSize:14, width:'100%', boxSizing:'border-box', outline:'none', fontFamily:'inherit', marginBottom:14 }} />
        <button style={{ ...btnP, width:'100%', padding:'11px' }} onClick={attempt}>Enter</button>
        <div style={{ marginTop:16, fontSize:11, color:'#444', textAlign:'center' }}>Content Collision — Internal Use Only</div>
      </div>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [teamAuth, setTeamAuth] = useState(false)
  const [view, setView]         = useState('gen')
  const [db, setDb]             = useState(DEFAULT_PRICING)
  const [preparers, setPreparers] = useState(DEFAULT_PREPARERS)

  // form
  const [clientName, setClientName] = useState('')
  const [custId, setCustId]         = useState('')
  const [period, setPeriod]         = useState('')
  const [date, setDate]             = useState(new Date().toISOString().slice(0,10))
  const [prepIdx, setPrepIdx]       = useState(0)
  const [markets, setMarkets]       = useState([])
  const [brief, setBrief]           = useState('')
  const [discPct, setDiscPct]       = useState(0)
  const [discNote, setDiscNote]     = useState('')
  const [quoteNo, setQuoteNo]       = useState('')

  // output
  const [quot, setQuot]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // admin
  const [adminInput, setAdminInput] = useState('')
  const [adminAuth, setAdminAuth]   = useState(false)
  const [adminTab, setAdminTab]     = useState('pricing')
  const [adminMkt, setAdminMkt]     = useState('indonesia')
  const [editPrices, setEditPrices] = useState({})
  const [editPreparers, setEditPreparers] = useState(DEFAULT_PREPARERS)
  const [newPrepName, setNewPrepName] = useState('')
  const [newPrepTitle, setNewPrepTitle] = useState('')

  // load from localStorage on mount
  useEffect(() => {
    try {
      if (localStorage.getItem(AUTH_KEY) === 'true') setTeamAuth(true)
      const savedDb   = localStorage.getItem(STORAGE_KEY)
      const savedPrep = localStorage.getItem(PREP_KEY)
      if (savedDb)   setDb(JSON.parse(savedDb))
      if (savedPrep) { const p = JSON.parse(savedPrep); setPreparers(p); setEditPreparers(p) }
    } catch {}
  }, [])

  useEffect(() => { setQuoteNo(autoQuoteNo(date, custId || clientName)) }, [date, custId, clientName])

  const saveDb = useCallback((newDb) => {
    setDb(newDb)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newDb)) } catch {}
  }, [])

  function savePreparers(list) {
    setPreparers(list)
    try { localStorage.setItem(PREP_KEY, JSON.stringify(list)) } catch {}
  }

  function handleTeamAuth() { localStorage.setItem(AUTH_KEY,'true'); setTeamAuth(true) }

  const currency = markets.length===1 && markets[0]==='indonesia' ? 'IDR' : 'USD'
  function toggleMarket(m) { setMarkets(prev=>prev.includes(m)?prev.filter(x=>x!==m):[...prev,m]) }

  // ── Generate ───────────────────────────────────────────────────────────────
  async function generate() {
    if (!brief.trim()) { setError('Enter a brief first.'); return }
    if (markets.length===0) { setError('Select at least one market.'); return }
    setLoading(true); setError(''); setQuot(null)

    const pricingRef = markets.map(m => {
      const mkt = db[m]; if (!mkt) return ''
      return `=== ${mkt.label} (${mkt.currency}) ===\n` +
        mkt.services.map(s=>`• ${s.name}: ${s.price.toLocaleString()} ${mkt.currency}/${s.unit}${s.note?' ('+s.note+')':''}`).join('\n')
    }).join('\n\n')

    const systemPrompt = `You are a senior account director at Content Collision (C2), a B2B PR and content marketing agency in Southeast Asia and the Middle East.

From a client brief, generate a professional quotation in JSON format.

PRICING DATABASE (use these prices only — do not invent prices):
${pricingRef}

RULES:
- Currency: ${currency}
- PR distribution is always PERFORMANCE-BASED — billed per coverage achieved, never guaranteed
- Media invite = per media outlet (not per event)
- Group multi-market items by market with sub-numbering (1.0, 1.1, 2.0, etc.)
- Retainer = monthly structure; one-off = single line items
- DP: 50% for IDR, 30% for USD
- Notes should match professional agency language

RETURN VALID JSON ONLY — no markdown, no explanation, raw JSON:
{
  "lineItems": [
    { "no":"1.0", "service":"Service label", "description":"2–3 lines of scope detail", "qty":1, "unit":"campaign", "unitPrice":3000000, "total":3000000, "notes":"Performance-based" }
  ],
  "subtotal": 3000000,
  "dpPct": 50,
  "paymentTerms": "50% down payment when project begins, remaining 50% upon completion",
  "notes": ["Press releases are provided free of charge.", "A 2% charge applies for late payments."]
}`

    try {
      const res  = await fetch('/api/generate', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ systemPrompt, messages:[{ role:'user', content:`Client: ${clientName||'TBD'}\nID: ${custId||'TBD'}\nPeriod: ${period||'TBD'}\nMarkets: ${markets.map(m=>db[m]?.label||m).join(', ')}\n\nBrief:\n${brief}` }] }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const raw  = data.choices?.[0]?.message?.content
      if (!raw)  throw new Error('No response from OpenAI. Check your API key.')
      const parsed = JSON.parse(raw)
      const discAmt  = discPct>0 ? Math.round(parsed.subtotal*discPct/100) : 0
      const discTxt  = discPct>0 ? `${discPct}% discount${discNote?' — '+discNote:''}` : ''
      const grand    = calcGrand(parsed.subtotal, discAmt)
      const taxAmt   = calcTax(parsed.subtotal, discAmt)
      setQuot({ ...parsed, currency, discount:discAmt, discountNote:discTxt, taxAmt, grand, dpAmt:grand*(parsed.dpPct/100) })
    } catch(e) { setError('Generation failed: '+e.message) }
    setLoading(false)
  }

  // ── Excel export ───────────────────────────────────────────────────────────
  function exportExcel() {
    if (!quot) return
    const prep = preparers[prepIdx] || preparers[0] || { name:'Tommy Prayoga', title:'Head of Agency' }
    const cur  = quot.currency
    const rows = [
      ['CONTENT COLLISION (C2)'], [],
      ['PT Konten Global Adikarya','','','Date:', fmtDate(date)],
      ['APL Office Tower Lantai 16 Unit 9','','','Quote #:', quoteNo],
      ['Jalan Letjen. S. Parman Kav. 28 Jakarta 11470','','','Prepared by:','Content Collision'],
      ['Phone: +62 812 7765 7773','','','Customer ID:', custId||clientName||'—'],
      ['Email: young@contentcollision.co','','','Period:', period||'—'],
      ['NPWP: 82.351.078.9-036.000'], [],
      ['No','Main Service','Qty',`Price Per Unit (${cur})`,`Total (${cur})`,'Notes'],
      ...quot.lineItems.map(it=>[it.no, it.service+(it.description?'\n'+it.description:''), it.qty, it.unitPrice, it.total, it.notes||'']),
      [],
      ['','','','Sub Total', quot.subtotal,''],
      ...(quot.discount>0?[['','','',quot.discountNote||'Discount',-quot.discount,'']]:[]),
      ['','','','PPh23 Tax (2%)', Math.round(quot.taxAmt),''],
      ['','','','Grand Total', Math.round(quot.grand),''],
      [],
      [`*C2 will begin after client pays ${quot.dpPct}% down payment.`],
      [`*${quot.paymentTerms}`],
      ...(quot.notes||[]).map(n=>[`*${n}`]),
      ['*A 2% charge applies for late payments.'], [],
      ['Quotation Prepared By:'], [],
      [prep.name], [prep.title], ['PT Konten Global Adikarya (C2)'], [fmtDate(date)],
    ]
    const ws = XLSX.utils.aoa_to_sheet(rows)
    ws['!cols'] = [{wch:46},{wch:50},{wch:8},{wch:22},{wch:22},{wch:34}]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Quotation - Confidential')
    XLSX.writeFile(wb, `C2_Quotation_${(clientName||'Client').replace(/\s+/g,'_')}_${date}.xlsx`)
  }

  // ── Admin helpers ──────────────────────────────────────────────────────────
  function startEditMkt(m) {
    setAdminMkt(m)
    const init={}; (db[m]?.services||[]).forEach(s=>{init[s.id]=s.price}); setEditPrices(init)
  }
  function saveAdminPrices() {
    const newDb={...db,[adminMkt]:{...db[adminMkt],services:db[adminMkt].services.map(s=>({...s,price:Number(editPrices[s.id]??s.price)}))}}
    saveDb(newDb); alert('✓ Prices saved.')
  }
  function addPreparer() {
    if (!newPrepName.trim()) return
    const list=[...editPreparers,{name:newPrepName.trim(),title:newPrepTitle.trim()||'Team Member'}]
    setEditPreparers(list); savePreparers(list); setNewPrepName(''); setNewPrepTitle('')
  }
  function removePreparer(i) {
    if (editPreparers.length<=1) { alert('You need at least one team member.'); return }
    const list=editPreparers.filter((_,idx)=>idx!==i); setEditPreparers(list); savePreparers(list)
  }
  function exportConfig() {
    const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'})
    const url=URL.createObjectURL(blob); const a=document.createElement('a')
    a.href=url; a.download='c2-pricing-config.json'; a.click(); URL.revokeObjectURL(url)
  }
  function importConfig(e) {
    const file=e.target.files[0]; if(!file) return
    const r=new FileReader(); r.onload=ev=>{ try{ saveDb(JSON.parse(ev.target.result)); startEditMkt(adminMkt); alert('✓ Config imported.') } catch{ alert('Invalid file.') } }; r.readAsText(file)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!teamAuth) return <TeamGate onAuth={handleTeamAuth} />

  return (
    <div style={S.app}>
      <style>{`
        @media print { .no-print{display:none!important} .print-area{max-height:none!important;overflow:visible!important;background:white!important} body{background:white} @page{margin:14mm} }
        *{box-sizing:border-box} ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:#111} ::-webkit-scrollbar-thumb{background:#333;border-radius:3px}
      `}</style>

      {/* Nav */}
      <div className="no-print" style={S.nav}>
        <span style={S.navTit}>C2 QUOTATION GENERATOR</span>
        <div style={{display:'flex',gap:8}}>
          <button style={view==='gen'?btnP:btnG} onClick={()=>setView('gen')}>Generator</button>
          <button style={view==='admin'?btnP:btnG} onClick={()=>setView('admin')}>Admin / Pricing</button>
        </div>
        {quot && <span style={{marginLeft:'auto',fontSize:12,color:'#666'}}>Draft: {quoteNo}</span>}
        <button style={{...btnG, marginLeft: quot?0:'auto', padding:'6px 12px', fontSize:12, color:'#888'}}
          onClick={()=>{localStorage.removeItem(AUTH_KEY);window.location.reload()}}>Sign Out</button>
      </div>

      {/* Generator */}
      {view==='gen' && (
        <div style={S.cols}>
          {/* Left */}
          <div className="no-print" style={S.left}>
            <div style={S.sec}>CLIENT DETAILS</div>
            <Inp label="Client Name" value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="e.g. Agora.io" />
            <Inp label="Customer ID / Code" value={custId} onChange={e=>setCustId(e.target.value)} placeholder="e.g. AGR" />
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <Inp label="Date" type="date" value={date} onChange={e=>setDate(e.target.value)} />
              <Inp label="Period" value={period} onChange={e=>setPeriod(e.target.value)} placeholder="Jun–Aug 2026" />
            </div>
            <Inp label="Quote Number (auto, editable)" value={quoteNo} onChange={e=>setQuoteNo(e.target.value)} />
            <div style={S.field}>
              <label style={S.label}>Prepared / Signed By</label>
              <select value={prepIdx} onChange={e=>setPrepIdx(Number(e.target.value))}
                style={{background:'#1a1a1a',color:'#e0e0e0',border:'1px solid #2e2e2e',borderRadius:4,padding:'7px 10px',fontSize:13,width:'100%',outline:'none',fontFamily:'inherit'}}>
                {preparers.map((p,i)=><option key={i} value={i}>{p.name} — {p.title}</option>)}
              </select>
            </div>
            <hr style={S.hr}/>
            <div style={S.sec}>MARKETS</div>
            <div style={{marginBottom:10}}>
              {Object.entries(db).map(([k,m])=>(
                <span key={k} style={{...S.chip,...(markets.includes(k)?S.chipOn:{})}} onClick={()=>toggleMarket(k)}>{m.label}</span>
              ))}
            </div>
            {markets.length>0 && <div style={{fontSize:11,color:'#888',marginBottom:4}}>Currency: <strong style={{color:'#D4AF37'}}>{currency}</strong></div>}
            <hr style={S.hr}/>
            <div style={S.sec}>BRIEF / REQUIREMENTS</div>
            <Txt rows={8} value={brief} onChange={e=>setBrief(e.target.value)}
              placeholder={"Paste the client brief, email, or list what they need.\n\nExamples:\n• 3-month PR retainer in SG and MY, 5 coverages/month, media roundtable in month 2\n• 10 coverages in national ID media, 1 op-ed, 40-page research report\n• KOL campaign: 5 nano + 2 micro KOL for Indonesia, TikTok + IG"} />
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <Inp label="Discount %" type="number" min={0} max={100} value={discPct} onChange={e=>setDiscPct(Number(e.target.value))} />
              <Inp label="Discount Label" value={discNote} onChange={e=>setDiscNote(e.target.value)} placeholder="e.g. Pilot discount" />
            </div>
            <button style={{...btnP,width:'100%',padding:12,fontSize:14,marginTop:4}} onClick={generate} disabled={loading}>
              {loading?'⏳  Generating…':'✦  Generate Quotation'}
            </button>
            {error && <div style={{marginTop:12,padding:12,background:'#2a0d0d',borderRadius:6,color:'#f88',fontSize:12,lineHeight:1.5}}>{error}</div>}
          </div>
          {/* Right */}
          <div className="print-area" style={S.right}>
            {!quot
              ? <div style={S.empty}><div style={{fontSize:48}}>📄</div><div>Fill in the details and click Generate</div><div style={{fontSize:12,color:'#bbb'}}>The formatted quotation will appear here ready to export.</div></div>
              : <QuotationDoc quot={quot} clientName={clientName} custId={custId} period={period} date={date} quoteNo={quoteNo} prep={preparers[prepIdx]||preparers[0]} onExcel={exportExcel} onPrint={()=>window.print()} />
            }
          </div>
        </div>
      )}

      {/* Admin */}
      {view==='admin' && (
        <div style={{padding:28,maxWidth:1100,margin:'0 auto'}}>
          {!adminAuth ? (
            <div style={{maxWidth:340,margin:'80px auto',background:'#161616',padding:28,borderRadius:10,border:'1px solid #2a2a2a'}}>
              <div style={{fontWeight:700,fontSize:17,marginBottom:20,color:'#D4AF37'}}>Admin Access</div>
              <Inp label="Admin Code" type="password" value={adminInput} onChange={e=>setAdminInput(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter'){if(adminInput===ADMIN_CODE){setAdminAuth(true);setAdminInput('');startEditMkt('indonesia');setEditPreparers(preparers)}else alert('Incorrect code.')}}} />
              <button style={{...btnP,width:'100%'}} onClick={()=>{if(adminInput===ADMIN_CODE){setAdminAuth(true);setAdminInput('');startEditMkt('indonesia');setEditPreparers(preparers)}else alert('Incorrect code.')}}>Enter</button>
            </div>
          ) : (
            <>
              {/* Admin tabs */}
              <div style={{display:'flex',gap:8,marginBottom:24,borderBottom:'1px solid #222',paddingBottom:16}}>
                <div style={{fontWeight:700,fontSize:18,color:'#D4AF37',marginRight:'auto'}}>Admin Panel</div>
                <button style={adminTab==='pricing'?{...btnP,padding:'6px 16px',fontSize:13}:{...btnG,padding:'6px 16px',fontSize:13}} onClick={()=>setAdminTab('pricing')}>Pricing</button>
                <button style={adminTab==='team'?{...btnP,padding:'6px 16px',fontSize:13}:{...btnG,padding:'6px 16px',fontSize:13}} onClick={()=>setAdminTab('team')}>Team Members</button>
              </div>

              {/* Pricing tab */}
              {adminTab==='pricing' && (
                <>
                  <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
                    <button style={btnP} onClick={saveAdminPrices}>💾 Save Prices</button>
                    <button style={btnG} onClick={exportConfig}>⬇ Export Config</button>
                    <label style={{...btnG,display:'inline-block',cursor:'pointer'}}>⬆ Import Config<input type="file" accept=".json" style={{display:'none'}} onChange={importConfig}/></label>
                    <button style={btnRd} onClick={()=>{if(confirm('Reset all prices to defaults?')){saveDb(DEFAULT_PRICING);startEditMkt(adminMkt);alert('✓ Reset.')}}}>↩ Reset Defaults</button>
                  </div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:20}}>
                    {Object.entries(db).map(([k,m])=>(
                      <button key={k} style={adminMkt===k?{...btnP,padding:'5px 13px',fontSize:12}:{...btnG,padding:'5px 13px',fontSize:12}} onClick={()=>startEditMkt(k)}>{m.label}</button>
                    ))}
                  </div>
                  {db[adminMkt] && (
                    <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                      <thead>
                        <tr style={{background:'#111'}}>
                          {['Service Name','Category','Unit',`Price (${db[adminMkt].currency})`,'Note'].map(h=>(
                            <th key={h} style={{padding:'8px 10px',textAlign:'left',color:'#888',fontWeight:600,borderBottom:'1px solid #222'}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {db[adminMkt].services.map((s,i)=>(
                          <tr key={s.id} style={{background:i%2===0?'#0f0f0f':'#131313'}}>
                            <td style={{padding:'7px 10px',color:'#ddd'}}>{s.name}</td>
                            <td style={{padding:'7px 10px',color:'#888',whiteSpace:'nowrap'}}>{s.cat}/{s.sub}</td>
                            <td style={{padding:'7px 10px',color:'#888',whiteSpace:'nowrap'}}>{s.unit}</td>
                            <td style={{padding:'7px 10px',minWidth:140}}>
                              <input type="number" value={editPrices[s.id]??s.price}
                                onChange={e=>setEditPrices(p=>({...p,[s.id]:e.target.value}))}
                                style={{background:'#1e1e1e',color:'#e0e0e0',border:'1px solid #333',borderRadius:4,padding:'5px 8px',fontSize:12,width:'100%',textAlign:'right',fontFamily:'inherit',outline:'none'}} />
                            </td>
                            <td style={{padding:'7px 10px',color:'#666',fontSize:11}}>{s.note||'—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}

              {/* Team Members tab */}
              {adminTab==='team' && (
                <div style={{maxWidth:600}}>
                  <div style={{fontSize:12,color:'#888',marginBottom:20,background:'#161616',padding:14,borderRadius:6}}>
                    These are the names that appear in the "Prepared / Signed By" dropdown when generating a quotation. Add or remove team members here.
                  </div>
                  {/* Current members */}
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:13,marginBottom:24}}>
                    <thead>
                      <tr style={{background:'#111'}}>
                        {['Name','Title',''].map(h=><th key={h} style={{padding:'8px 12px',textAlign:'left',color:'#888',fontWeight:600,borderBottom:'1px solid #222'}}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {editPreparers.map((p,i)=>(
                        <tr key={i} style={{background:i%2===0?'#0f0f0f':'#131313',borderBottom:'1px solid #1a1a1a'}}>
                          <td style={{padding:'10px 12px',color:'#ddd',fontWeight:500}}>{p.name}</td>
                          <td style={{padding:'10px 12px',color:'#999'}}>{p.title}</td>
                          <td style={{padding:'10px 12px',textAlign:'right'}}>
                            <button style={btnRd} onClick={()=>removePreparer(i)}>Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Add new member */}
                  <div style={{background:'#161616',padding:20,borderRadius:8,border:'1px solid #222'}}>
                    <div style={{fontWeight:600,fontSize:13,color:'#D4AF37',marginBottom:14}}>Add Team Member</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                      <Inp label="Full Name" value={newPrepName} onChange={e=>setNewPrepName(e.target.value)} placeholder="e.g. Siti Rahma" />
                      <Inp label="Title / Role" value={newPrepTitle} onChange={e=>setNewPrepTitle(e.target.value)} placeholder="e.g. Account Manager" />
                    </div>
                    <button style={btnP} onClick={addPreparer}>+ Add Member</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ── Quotation Document ────────────────────────────────────────────────────────
function QuotationDoc({ quot, clientName, custId, period, date, quoteNo, prep, onExcel, onPrint }) {
  const cur = quot.currency
  return (
    <div>
      <div className="no-print" style={{background:'#fff',borderBottom:'1px solid #e0e0e0',padding:'10px 32px',display:'flex',gap:10,alignItems:'center'}}>
        <span style={{fontSize:12,color:'#777',fontFamily:'monospace'}}>Draft — {quoteNo}</span>
        <button style={btnPr} onClick={onPrint}>🖨 Print / Save as PDF</button>
        <button style={{...btnGr,padding:'7px 16px'}} onClick={onExcel}>⬇ Download Excel</button>
        <span style={{marginLeft:'auto',fontSize:11,color:'#aaa'}}>Review before sending.</span>
      </div>
      <div style={{padding:'44px 52px',maxWidth:920,margin:'0 auto',fontFamily:'Arial,Helvetica,sans-serif',fontSize:12,color:'#000',background:'#fff'}}>
        <div style={{fontWeight:900,fontSize:22,letterSpacing:'0.07em'}}>CONTENT COLLISION (C2)</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 270px',gap:28,marginTop:18}}>
          <div style={{lineHeight:1.75,color:'#333'}}>
            <div style={{fontWeight:600}}>PT Konten Global Adikarya</div>
            <div>APL Office Tower Lantai 16 Unit 9</div>
            <div>Jalan Letjen. S. Parman Kav. 28 Jakarta 11470</div>
            <div>Phone: +62 812 7765 7773</div>
            <div>Email: young@contentcollision.co</div>
            <div>NPWP: 82.351.078.9-036.000</div>
          </div>
          <div>
            {[['Date',fmtDate(date)],['Quote #',quoteNo],['Prepared by','Content Collision'],['Customer ID',custId||clientName||'—'],['Period',period||'—']].map(([k,v])=>(
              <div key={k} style={{display:'grid',gridTemplateColumns:'100px 1fr',lineHeight:2.1}}>
                <span style={{color:'#555'}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{borderTop:'2px solid #000',marginTop:22}}/>
        <table style={{width:'100%',borderCollapse:'collapse',marginTop:14,fontSize:12}}>
          <thead>
            <tr style={{background:'#000',color:'#fff'}}>
              {['No','Main Service','Qty','Price Per Unit','Total','Notes'].map((h,i)=>(
                <th key={h} style={{padding:'8px 10px',textAlign:i>=2&&i<=4?'right':'left',fontWeight:700,whiteSpace:'nowrap',fontSize:11}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quot.lineItems.map((it,i)=>(
              <tr key={i} style={{borderBottom:'1px solid #ebebeb',background:i%2===0?'#fff':'#fafafa'}}>
                <td style={{padding:'9px 10px',color:'#666',whiteSpace:'nowrap',verticalAlign:'top'}}>{it.no}</td>
                <td style={{padding:'9px 10px',verticalAlign:'top'}}>
                  <div style={{fontWeight:600}}>{it.service}</div>
                  {it.description&&<div style={{color:'#555',marginTop:3,lineHeight:1.55}}>{it.description}</div>}
                </td>
                <td style={{padding:'9px 10px',verticalAlign:'top',textAlign:'right',whiteSpace:'nowrap'}}>{it.qty}</td>
                <td style={{padding:'9px 10px',verticalAlign:'top',textAlign:'right',whiteSpace:'nowrap'}}>{fmt(it.unitPrice,cur)}</td>
                <td style={{padding:'9px 10px',verticalAlign:'top',textAlign:'right',whiteSpace:'nowrap',fontWeight:600}}>{fmt(it.total,cur)}</td>
                <td style={{padding:'9px 10px',verticalAlign:'top',color:'#666',fontSize:11,lineHeight:1.4}}>{it.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:18}}>
          <table style={{fontSize:12,borderCollapse:'collapse',minWidth:320}}>
            <tbody>
              <tr><td style={{padding:'5px 14px',color:'#555'}}>Sub Total</td><td style={{padding:'5px 14px',textAlign:'right',fontWeight:600}}>{fmt(quot.subtotal,cur)}</td></tr>
              {quot.discount>0&&<tr><td style={{padding:'5px 14px',color:'#555'}}>{quot.discountNote||'Discount'}</td><td style={{padding:'5px 14px',textAlign:'right',color:'#b00'}}>({fmt(quot.discount,cur)})</td></tr>}
              <tr><td style={{padding:'5px 14px',color:'#555'}}>PPh23 Tax (2%)</td><td style={{padding:'5px 14px',textAlign:'right'}}>{fmt(quot.taxAmt,cur)}</td></tr>
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
        <div style={{marginTop:26,lineHeight:1.75,color:'#444',fontSize:11}}>
          <div>*C2 will begin the project after client has paid <strong>{quot.dpPct}%</strong> of the total fee as down payment.</div>
          <div>*{quot.paymentTerms}</div>
          {(quot.notes||[]).map((n,i)=><div key={i}>*{n}</div>)}
          {cur==='USD'&&<div>*Price excludes Indonesian Corporate Income Tax (PPh 2%). Gross amount invoiced: {fmt(Math.round(quot.grand),cur)}.</div>}
        </div>
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
  )
}
