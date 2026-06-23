// C2 Pricing Database — calibrated from actual client quotations
// Edit prices here directly, then redeploy, OR use the Admin panel in the app (saves to your browser).
// Currency: IDR for Indonesia, USD for all international markets.

const PRICING = {
  indonesia: {
    label: 'Indonesia 🇮🇩', currency: 'IDR',
    services: [
      // ── PR ──────────────────────────────────────────────────────────────────
      { id:'id_pr_consult_s',   cat:'PR', sub:'Consultation',  name:'PR Consultation (per session)',                          price:3000000,   unit:'session' },
      { id:'id_pr_consult_m',   cat:'PR', sub:'Consultation',  name:'PR Consultation (monthly retainer)',                     price:7500000,   unit:'month' },
      { id:'id_pr_release',     cat:'PR', sub:'Press Release', name:'Press Release Creation (ID + EN versions)',               price:5000000,   unit:'release' },
      { id:'id_pr_monitoring',  cat:'PR', sub:'Monitoring',    name:'Media Monitoring (monthly)',                              price:5000000,   unit:'month' },
      { id:'id_pr_dist_nat',    cat:'PR', sub:'Distribution',  name:'PR Campaign – National Media',                           price:20000000,  unit:'campaign',  note:'~10 Tier 1 national coverages' },
      { id:'id_pr_dist_intl',   cat:'PR', sub:'Distribution',  name:'PR Campaign – International Media',                      price:30000000,  unit:'campaign',  note:'~5 international coverages' },
      { id:'id_pr_coverage',    cat:'PR', sub:'Distribution',  name:'Press Coverage (per coverage obtained)',                  price:2000000,   unit:'coverage',  note:'Performance-based — billed per coverage achieved' },
      { id:'id_pr_pitching',    cat:'PR', sub:'Pitching',      name:'Media Pitching (per campaign)',                          price:5000000,   unit:'campaign' },
      { id:'id_pr_int_nat',     cat:'PR', sub:'Interview',     name:'Exclusive Interview – National Media',                   price:15000000,  unit:'interview' },
      { id:'id_pr_int_intl',    cat:'PR', sub:'Interview',     name:'Exclusive Interview – International Media',              price:20000000,  unit:'interview' },
      { id:'id_pr_oped_nat',    cat:'PR', sub:'Op-Ed',         name:'Op-Ed – National Media (creation + placement)',          price:10000000,  unit:'piece' },
      { id:'id_pr_oped_intl',   cat:'PR', sub:'Op-Ed',         name:'Op-Ed – International Media (creation + placement)',     price:12500000,  unit:'piece' },
      { id:'id_pr_invite',      cat:'PR', sub:'Media Invite',  name:'Media Invite (per media outlet)',                        price:2000000,   unit:'media' },
      { id:'id_pr_roundtable',  cat:'PR', sub:'Event',         name:'Media Roundtable (5+ Tier 1 media)',                     price:25000000,  unit:'event',     note:'Includes briefing, Q&A moderation, post-event report' },
      { id:'id_pr_event',       cat:'PR', sub:'Event',         name:'Event / Activity Attendance',                            price:5000000,   unit:'event' },
      { id:'id_pr_podcast',     cat:'PR', sub:'Podcast',       name:'Podcast Coordination',                                   price:10000000,  unit:'session',   note:'Excludes paid partnership fee if applicable' },
      { id:'id_pr_whitepaper',  cat:'PR', sub:'Written',       name:'Whitepaper Creation',                                    price:100000000, unit:'piece' },
      // ── Content ─────────────────────────────────────────────────────────────
      { id:'id_cnt_art_s',      cat:'Content', sub:'Written',       name:'Blog / Article – Short (600–800 words)',             price:2500000,   unit:'piece' },
      { id:'id_cnt_art_l',      cat:'Content', sub:'Written',       name:'Blog / Article – Long (1,000–1,500 words)',          price:4000000,   unit:'piece' },
      { id:'id_cnt_report_b',   cat:'Content', sub:'Report',        name:'Research Report – Basic (<30 pages, incl. design)',  price:50000000,  unit:'report' },
      { id:'id_cnt_report_s',   cat:'Content', sub:'Report',        name:'Research Report – Standard (30–50 pages, incl. design)', price:100000000, unit:'report' },
      { id:'id_cnt_report_p',   cat:'Content', sub:'Report',        name:'Research Report – Premium (50+ pages, incl. design)', price:160000000, unit:'report' },
      { id:'id_cnt_soc_static', cat:'Content', sub:'Social Media',  name:'Social Media – Static / Single Image',               price:1500000,   unit:'post' },
      { id:'id_cnt_soc_carousel',cat:'Content',sub:'Social Media',  name:'Social Media – Carousel',                            price:2500000,   unit:'post' },
      { id:'id_cnt_soc_motion', cat:'Content', sub:'Social Media',  name:'Social Media – Motion Graphics',                     price:4000000,   unit:'post' },
      { id:'id_cnt_soc_video',  cat:'Content', sub:'Social Media',  name:'Social Media – Reels / Short Video',                 price:5000000,   unit:'post' },
      { id:'id_cnt_channel',    cat:'Content', sub:'Channel Mgmt',  name:'Channel Management (12 content/month)',               price:30000000,  unit:'month' },
      { id:'id_cnt_pkg_full',   cat:'Content', sub:'Channel Mgmt',  name:'Social Media Full Package (12 content, 50% motion)', price:65000000,  unit:'month' },
      // ── Video ───────────────────────────────────────────────────────────────
      { id:'id_vid_reels15',    cat:'Video', sub:'Social',      name:'Social Media Reels (15–30 sec)',                         price:5000000,   unit:'video' },
      { id:'id_vid_reels60',    cat:'Video', sub:'Social',      name:'Social Media Reels (30–60 sec)',                         price:8000000,   unit:'video' },
      { id:'id_vid_short90',    cat:'Video', sub:'Short-form',  name:'Short-form Video (60–90 sec)',                           price:12000000,  unit:'video' },
      { id:'id_vid_anim60',     cat:'Video', sub:'Animation',   name:'2D Animation / Explainer (60 sec)',                      price:15000000,  unit:'video',     note:'Unlimited storyboard revisions, 2x video revisions. Voiceover charge may apply.' },
      { id:'id_vid_profile',    cat:'Video', sub:'Corporate',   name:'Company Profile Video (90–180 sec)',                     price:35000000,  unit:'video' },
      { id:'id_vid_minidoc',    cat:'Video', sub:'Documentary', name:'Mini Documentary (3–5 min)',                             price:75000000,  unit:'video' },
      { id:'id_vid_ad15',       cat:'Video', sub:'Commercial',  name:'Advertisement / Advert (15 sec)',                        price:20000000,  unit:'video' },
      { id:'id_vid_ad30',       cat:'Video', sub:'Commercial',  name:'Advertisement / Advert (30 sec)',                        price:35000000,  unit:'video' },
      { id:'id_vid_ad60',       cat:'Video', sub:'Commercial',  name:'Advertisement / Advert (60 sec)',                        price:55000000,  unit:'video' },
      { id:'id_vid_ad240',      cat:'Video', sub:'Commercial',  name:'Long-form Ad / Mini-doc (180–240 sec)',                  price:100000000, unit:'video' },
      // ── KOL ────────────────────────────────────────────────────────────────
      { id:'id_kol_mgmt',       cat:'KOL', sub:'Management',   name:'KOL Campaign Management (monthly)',                       price:8000000,   unit:'month',     note:'End-to-end coordination. Excludes KOL fee.' },
      { id:'id_kol_affiliate',  cat:'KOL', sub:'Management',   name:'Affiliate Management (monthly)',                          price:15000000,  unit:'month',     note:'15% management fee. Excludes affiliate commissions.' },
      { id:'id_kol_nano',       cat:'KOL', sub:'Activation',   name:'Nano KOL – ID (3K–10K followers)',                        price:1500000,   unit:'activation',note:'Includes sourcing, briefing, coordination, 1 revision, reporting' },
      { id:'id_kol_micro',      cat:'KOL', sub:'Activation',   name:'Micro KOL – ID (10K–100K followers)',                     price:5000000,   unit:'activation' },
      { id:'id_kol_macro',      cat:'KOL', sub:'Activation',   name:'Macro KOL – ID (100K–1M followers)',                      price:15000000,  unit:'activation' },
      { id:'id_kol_mega',       cat:'KOL', sub:'Activation',   name:'Mega KOL – ID (1M+ followers)',                           price:50000000,  unit:'activation',note:'Negotiated case by case; this is a reference rate.' },
      // ── Paid Ads ─────────────────────────────────────────────────────────────
      { id:'id_ads_setup',      cat:'Paid Ads', sub:'Setup',    name:'Ad Account Setup (one-time)',                             price:3000000,   unit:'one-time' },
      { id:'id_ads_mgmt',       cat:'Paid Ads', sub:'Management',name:'Ad Campaign Management (monthly)',                       price:7500000,   unit:'month',     note:'Excludes ad spend' },
      { id:'id_ads_creative',   cat:'Paid Ads', sub:'Creative',  name:'Ad Creative Production (per set)',                       price:5000000,   unit:'set' },
    ],
  },

  singapore: {
    label: 'Singapore 🇸🇬', currency: 'USD',
    services: [
      { id:'sg_pr_campaign',    cat:'PR', sub:'Campaign',     name:'PR Campaign (SG)',                                          price:3000,  unit:'campaign',   note:'Includes strategy, release creation, distribution, monitoring, report. 3–5 coverages.' },
      { id:'sg_pr_coverage',    cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, SG)',                             price:440,   unit:'coverage' },
      { id:'sg_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (SG)',                                       price:700,   unit:'interview' },
      { id:'sg_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (SG)',                                       price:1000,  unit:'piece' },
      { id:'sg_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, SG)',                               price:300,   unit:'media' },
      { id:'sg_pr_consult',     cat:'PR', sub:'Consultation', name:'PR Consultation & Campaign Management (SG)',                 price:500,   unit:'month' },
      { id:'sg_pr_event_coord', cat:'PR', sub:'Event',        name:'Media Coordination at Event (SG)',                           price:1500,  unit:'event' },
      { id:'sg_adv_cna',        cat:'PR', sub:'Advertorial',  name:'Advertorial – Mainstream EN (CNA-level)',                    price:10000, unit:'placement',  note:'Subject to final media-kit confirmation.' },
      { id:'sg_adv_lhzb',       cat:'PR', sub:'Advertorial',  name:'Advertorial – Mainstream Mandarin (Lianhe Zaobao)',          price:12500, unit:'placement',  note:'Subject to final media-kit confirmation.' },
      { id:'sg_adv_bt',         cat:'PR', sub:'Advertorial',  name:'Advertorial – Business EN (Business Times)',                 price:13500, unit:'placement',  note:'Subject to final media-kit confirmation.' },
      { id:'sg_adv_st',         cat:'PR', sub:'Advertorial',  name:'Advertorial – Flagship (Straits Times)',                     price:17000, unit:'placement',  note:'Subject to final media-kit confirmation.' },
      { id:'sg_adv_edge',       cat:'PR', sub:'Advertorial',  name:'Advertorial – Sector-specific (Edge SG)',                    price:10000, unit:'placement',  note:'Subject to final media-kit confirmation.' },
      { id:'sg_kol_mgmt',       cat:'KOL', sub:'Management',  name:'KOL Campaign Management (SG)',                               price:800,   unit:'campaign' },
      { id:'sg_kol_mega',       cat:'KOL', sub:'Activation',  name:'KOL 500K+ TikTok (SG)',                                      price:13550, unit:'activation' },
      { id:'sg_kol_macro',      cat:'KOL', sub:'Activation',  name:'KOL 100K+ Video hosting (SG)',                               price:6500,  unit:'activation' },
      { id:'sg_kol_micro_v',    cat:'KOL', sub:'Activation',  name:'KOL 50K+ Video / Microblog (SG)',                            price:3500,  unit:'activation' },
      { id:'sg_kol_micro_i',    cat:'KOL', sub:'Activation',  name:'KOL 50K+ Image / Microblog (SG)',                            price:1825,  unit:'activation' },
    ],
  },

  thailand: {
    label: 'Thailand 🇹🇭', currency: 'USD',
    services: [
      { id:'th_pr_campaign',    cat:'PR', sub:'Campaign',     name:'PR Campaign (TH)',                                           price:3000,  unit:'campaign',   note:'~5 coverages' },
      { id:'th_pr_coverage',    cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, TH)',                              price:225,   unit:'coverage' },
      { id:'th_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (TH)',                                        price:500,   unit:'interview' },
      { id:'th_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (TH)',                                        price:800,   unit:'piece' },
      { id:'th_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, TH)',                                price:250,   unit:'media' },
      { id:'th_pr_event_coord', cat:'PR', sub:'Event',        name:'Media Coordination at Event (TH)',                            price:2050,  unit:'event' },
      { id:'th_pr_dist_m',      cat:'PR', sub:'Distribution', name:'Press Material Distribution (monthly, TH)',                   price:2500,  unit:'month',      note:'Up to 5 items/month. Guaranteed minimum 2 unique placements.' },
      { id:'th_adv_bp',         cat:'PR', sub:'Advertorial',  name:'Advertorial – Bangkok Post (EN)',                             price:3200,  unit:'placement' },
      { id:'th_adv_nation',     cat:'PR', sub:'Advertorial',  name:'Advertorial – Nation Thailand (EN)',                          price:2500,  unit:'placement' },
      { id:'th_adv_sanook',     cat:'PR', sub:'Advertorial',  name:'Advertorial – Sanook.com (TH)',                               price:2200,  unit:'placement' },
      { id:'th_adv_thairath',   cat:'PR', sub:'Advertorial',  name:'Advertorial – Thai Rath (TH)',                                price:3000,  unit:'placement' },
      { id:'th_adv_khaosod',    cat:'PR', sub:'Advertorial',  name:'Advertorial – Khaosod (TH)',                                  price:2250,  unit:'placement' },
      { id:'th_adv_soc_en',     cat:'PR', sub:'Advertorial',  name:'Advertorial – Socio-political EN (5M+ reach)',                price:3075,  unit:'placement' },
      { id:'th_adv_soc_th',     cat:'PR', sub:'Advertorial',  name:'Advertorial – Socio-political TH (15M+ reach)',               price:4500,  unit:'placement' },
      { id:'th_adv_biz_en',     cat:'PR', sub:'Advertorial',  name:'Advertorial – Business EN (1M+ reach)',                       price:2825,  unit:'placement' },
      { id:'th_adv_biz_th',     cat:'PR', sub:'Advertorial',  name:'Advertorial – Business TH (5M+ reach)',                       price:3500,  unit:'placement' },
      { id:'th_adv_sector',     cat:'PR', sub:'Advertorial',  name:'Advertorial – Sector-specific TH (500K+ reach)',              price:2000,  unit:'placement' },
      { id:'th_kol_mgmt',       cat:'KOL', sub:'Management',  name:'KOL Campaign Management (TH)',                                price:500,   unit:'campaign' },
      { id:'th_kol_mega',       cat:'KOL', sub:'Activation',  name:'KOL 500K+ TikTok (TH)',                                       price:4250,  unit:'activation' },
      { id:'th_kol_macro',      cat:'KOL', sub:'Activation',  name:'KOL 100K+ Video hosting (TH)',                                price:2250,  unit:'activation' },
      { id:'th_kol_micro_v',    cat:'KOL', sub:'Activation',  name:'KOL 50K+ Video / Microblog (TH)',                             price:1050,  unit:'activation' },
      { id:'th_kol_micro_i',    cat:'KOL', sub:'Activation',  name:'KOL 50K+ Image / Microblog (TH)',                             price:525,   unit:'activation' },
    ],
  },

  malaysia: {
    label: 'Malaysia 🇲🇾', currency: 'USD',
    services: [
      { id:'my_pr_campaign',    cat:'PR', sub:'Campaign',     name:'PR Campaign (MY)',                                           price:3500,  unit:'campaign' },
      { id:'my_pr_coverage',    cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, MY)',                              price:350,   unit:'coverage' },
      { id:'my_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (MY)',                                        price:600,   unit:'interview' },
      { id:'my_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (MY)',                                        price:900,   unit:'piece' },
      { id:'my_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, MY)',                                price:250,   unit:'media' },
      { id:'my_pr_event_coord', cat:'PR', sub:'Event',        name:'Media Coordination at Event (MY)',                            price:3500,  unit:'event' },
      { id:'my_pr_dist_m',      cat:'PR', sub:'Distribution', name:'Press Material Distribution (monthly, MY)',                   price:3500,  unit:'month' },
      { id:'my_adv_edge',       cat:'PR', sub:'Advertorial',  name:'Advertorial – Edge Malaysia (EN)',                            price:4500,  unit:'placement' },
      { id:'my_adv_hm',         cat:'PR', sub:'Advertorial',  name:'Advertorial – Harian Metro (BM)',                             price:6500,  unit:'placement' },
      { id:'my_adv_star',       cat:'PR', sub:'Advertorial',  name:'Advertorial – The Star (business EN)',                        price:7000,  unit:'placement' },
      { id:'my_adv_bh',         cat:'PR', sub:'Advertorial',  name:'Advertorial – Berita Harian (BM)',                            price:6500,  unit:'placement' },
      { id:'my_adv_nst',        cat:'PR', sub:'Advertorial',  name:'Advertorial – NST (EN)',                                      price:7500,  unit:'placement' },
      { id:'my_adv_mk',         cat:'PR', sub:'Advertorial',  name:'Advertorial – Malaysiakini (BM)',                             price:6500,  unit:'placement' },
      { id:'my_adv_fmt',        cat:'PR', sub:'Advertorial',  name:'Advertorial – Free Malaysia Today / sector-specific (EN)',    price:4000,  unit:'placement' },
      { id:'my_kol_mgmt',       cat:'KOL', sub:'Management',  name:'KOL Campaign Management (MY)',                                price:500,   unit:'campaign' },
      { id:'my_kol_mega',       cat:'KOL', sub:'Activation',  name:'KOL 500K+ TikTok (MY)',                                       price:11550, unit:'activation' },
      { id:'my_kol_macro',      cat:'KOL', sub:'Activation',  name:'KOL 100K+ Video hosting (MY)',                                price:6000,  unit:'activation' },
      { id:'my_kol_micro_v',    cat:'KOL', sub:'Activation',  name:'KOL 50K+ Video / Microblog (MY)',                             price:3200,  unit:'activation' },
      { id:'my_kol_micro_i',    cat:'KOL', sub:'Activation',  name:'KOL 50K+ Image / Microblog (MY)',                             price:1525,  unit:'activation' },
    ],
  },

  vietnam: {
    label: 'Vietnam 🇻🇳', currency: 'USD',
    services: [
      { id:'vn_pr_campaign',    cat:'PR', sub:'Campaign',     name:'PR Campaign (VN)',                                           price:2500,  unit:'campaign' },
      { id:'vn_pr_cov_strat',   cat:'PR', sub:'Distribution', name:'Strategic PR Coverage (top media, VN)',                       price:225,   unit:'coverage' },
      { id:'vn_pr_cov_tact',    cat:'PR', sub:'Distribution', name:'Tactical PR Coverage (VN)',                                   price:325,   unit:'coverage' },
      { id:'vn_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (VN)',                                        price:400,   unit:'interview' },
      { id:'vn_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (VN)',                                        price:700,   unit:'piece' },
      { id:'vn_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, VN)',                                price:200,   unit:'media' },
      { id:'vn_kol_mgmt',       cat:'KOL', sub:'Management',  name:'KOL Campaign Management (VN)',                                price:400,   unit:'campaign' },
      { id:'vn_kol_mega',       cat:'KOL', sub:'Activation',  name:'KOL 500K+ (VN)',                                              price:2000,  unit:'activation' },
      { id:'vn_kol_macro',      cat:'KOL', sub:'Activation',  name:'KOL 100K+ (VN)',                                              price:800,   unit:'activation' },
      { id:'vn_kol_micro',      cat:'KOL', sub:'Activation',  name:'KOL 50K+ (VN)',                                               price:300,   unit:'activation' },
    ],
  },

  philippines: {
    label: 'Philippines 🇵🇭', currency: 'USD',
    services: [
      { id:'ph_pr_campaign',    cat:'PR', sub:'Campaign',     name:'PR Campaign (PH)',                                           price:2500,  unit:'campaign' },
      { id:'ph_pr_coverage',    cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, PH)',                              price:350,   unit:'coverage' },
      { id:'ph_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (PH)',                                        price:450,   unit:'interview' },
      { id:'ph_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (PH)',                                        price:700,   unit:'piece' },
      { id:'ph_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, PH)',                                price:200,   unit:'media' },
      { id:'ph_kol_mgmt',       cat:'KOL', sub:'Management',  name:'KOL Campaign Management (PH)',                                price:400,   unit:'campaign' },
      { id:'ph_kol_mega',       cat:'KOL', sub:'Activation',  name:'KOL 500K+ (PH)',                                              price:2500,  unit:'activation' },
      { id:'ph_kol_macro',      cat:'KOL', sub:'Activation',  name:'KOL 100K+ (PH)',                                              price:900,   unit:'activation' },
      { id:'ph_kol_micro',      cat:'KOL', sub:'Activation',  name:'KOL 50K+ (PH)',                                               price:350,   unit:'activation' },
    ],
  },

  japan: {
    label: 'Japan 🇯🇵', currency: 'USD',
    services: [
      { id:'jp_pr_campaign',    cat:'PR', sub:'Campaign',     name:'PR Campaign (JP)',                                           price:4000,  unit:'campaign',   note:'Includes JP translation, distribution, monitoring. 5+ coverages.' },
      { id:'jp_pr_newswire',    cat:'PR', sub:'Campaign',     name:'PR via Newswire (JP)',                                        price:2000,  unit:'campaign',   note:'Via JP newswire. 10+ coverages target.' },
      { id:'jp_pr_coverage',    cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, JP)',                              price:370,   unit:'coverage' },
      { id:'jp_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (JP)',                                        price:700,   unit:'interview' },
      { id:'jp_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (JP)',                                        price:1200,  unit:'piece' },
      { id:'jp_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, JP)',                                price:400,   unit:'media' },
    ],
  },

  korea: {
    label: 'Korea 🇰🇷', currency: 'USD',
    services: [
      { id:'kr_pr_newswire',    cat:'PR', sub:'Campaign',     name:'PR via Newswire (KR)',                                       price:2500,  unit:'campaign',   note:'Via KR newswire. 20 coverages target.' },
      { id:'kr_pr_coverage',    cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, KR)',                              price:125,   unit:'coverage' },
      { id:'kr_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (KR)',                                        price:600,   unit:'interview' },
      { id:'kr_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (KR)',                                        price:1000,  unit:'piece' },
      { id:'kr_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, KR)',                                price:300,   unit:'media' },
    ],
  },

  china: {
    label: 'China 🇨🇳', currency: 'USD',
    services: [
      { id:'cn_pr_campaign',    cat:'PR', sub:'Campaign',     name:'PR Campaign (CN)',                                           price:2500,  unit:'campaign',   note:'1–3 coverages.' },
      { id:'cn_pr_coverage',    cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, CN)',                              price:500,   unit:'coverage' },
      { id:'cn_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (CN)',                                        price:800,   unit:'interview' },
      { id:'cn_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (CN)',                                        price:1500,  unit:'piece' },
      { id:'cn_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, CN)',                                price:500,   unit:'media' },
    ],
  },

  australia: {
    label: 'Australia 🇦🇺', currency: 'USD',
    services: [
      { id:'au_pr_campaign',    cat:'PR', sub:'Campaign',     name:'PR Campaign (AU)',                                           price:3500,  unit:'campaign',   note:'2+ coverages.' },
      { id:'au_pr_coverage',    cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, AU)',                              price:440,   unit:'coverage' },
      { id:'au_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (AU)',                                        price:700,   unit:'interview' },
      { id:'au_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (AU)',                                        price:1200,  unit:'piece' },
      { id:'au_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, AU)',                                price:400,   unit:'media' },
    ],
  },

  emea: {
    label: 'EMEA / UAE 🌍', currency: 'USD',
    services: [
      { id:'emea_pr_campaign',  cat:'PR', sub:'Campaign',     name:'PR Campaign (UAE / EMEA)',                                   price:3000,  unit:'campaign',   note:'1–3 coverages.' },
      { id:'emea_pr_coverage',  cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, EMEA)',                            price:600,   unit:'coverage' },
      { id:'emea_pr_interview', cat:'PR', sub:'Interview',    name:'Media Interview (UAE / EMEA)',                                price:900,   unit:'interview' },
      { id:'emea_pr_oped',      cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (UAE / EMEA)',                                price:1800,  unit:'piece' },
      { id:'emea_pr_invite',    cat:'PR', sub:'Media Invite', name:'Media Invite (per media, EMEA)',                              price:500,   unit:'media' },
    ],
  },
}

export default PRICING
