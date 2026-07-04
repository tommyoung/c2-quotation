// C2 Pricing Database — calibrated from actual client quotations
// Edit prices here directly, then redeploy, OR use the Admin panel in the app (saves to your browser).
// Currency: IDR for Indonesia, USD for all international markets.
//
// `key` = canonical service concept, used by the "Sync from Indonesia" admin feature to figure out
//         which services a market is missing. Only Indonesia services carry a full authored `key` list —
//         it's the master template. Existing market-specific services (e.g. named local advertorials,
//         follower-tier KOL activations) intentionally have NO key, so sync never touches or duplicates
//         them — those stay hand-curated per market.
// `internalNotes` = admin-only context fed to the AI to help it price/scope accurately
//         (e.g. "price scales ~linearly above 5 coverages/month"). Never shown on the client-facing document.

const PRICING = {
  indonesia: {
    label: 'Indonesia 🇮🇩', currency: 'IDR',
    services: [
      // ── PR ──────────────────────────────────────────────────────────────────
      { id:'id_pr_consult_s',   key:'pr_consult_session',      cat:'PR', sub:'Consultation',  name:'PR Consultation (per session)',                          price:3000000,   unit:'session', internalNotes:'' },
      { id:'id_pr_consult_m',   key:'pr_consult_retainer',     cat:'PR', sub:'Consultation',  name:'PR Consultation (monthly retainer)',                     price:7500000,   unit:'month', internalNotes:'' },
      { id:'id_pr_release',     key:'pr_release',              cat:'PR', sub:'Press Release', name:'Press Release Creation (ID + EN versions)',               price:5000000,   unit:'release', internalNotes:'' },
      { id:'id_pr_monitoring',  key:'pr_monitoring',           cat:'PR', sub:'Monitoring',    name:'Media Monitoring (monthly)',                              price:5000000,   unit:'month', internalNotes:'' },
      { id:'id_pr_dist_nat',    key:'pr_campaign_national',    cat:'PR', sub:'Distribution',  name:'PR Campaign – National Media',                           price:20000000,  unit:'campaign',  note:'~10 Tier 1 national coverages', internalNotes:'Baseline package assumes ~10 coverages/month. If the brief states a different monthly coverage target, scale qty and price up or down from this baseline rather than using the flat package fee.' },
      { id:'id_pr_dist_intl',   key:'pr_campaign_international',cat:'PR', sub:'Distribution', name:'PR Campaign – International Media',                      price:30000000,  unit:'campaign',  note:'~5 international coverages', internalNotes:'Baseline assumes ~5 coverages/month. Scale with stated targets.' },
      { id:'id_pr_coverage',    key:'pr_coverage',             cat:'PR', sub:'Distribution',  name:'Press Coverage (per coverage obtained)',                  price:2000000,   unit:'coverage',  note:'Performance-based — billed per coverage achieved', internalNotes:'This is the per-unit rate. If brief specifies N coverages/month over M months, qty = N × M unless brief says otherwise.' },
      { id:'id_pr_pitching',    key:'pr_pitching',             cat:'PR', sub:'Pitching',      name:'Media Pitching (per campaign)',                          price:5000000,   unit:'campaign', internalNotes:'' },
      { id:'id_pr_int_nat',     key:'pr_interview_national',   cat:'PR', sub:'Interview',     name:'Exclusive Interview – National Media',                   price:15000000,  unit:'interview', internalNotes:'' },
      { id:'id_pr_int_intl',    key:'pr_interview_international',cat:'PR', sub:'Interview',   name:'Exclusive Interview – International Media',              price:20000000,  unit:'interview', internalNotes:'' },
      { id:'id_pr_oped_nat',    key:'pr_oped_national',        cat:'PR', sub:'Op-Ed',         name:'Op-Ed – National Media (creation + placement)',          price:10000000,  unit:'piece', internalNotes:'' },
      { id:'id_pr_oped_intl',   key:'pr_oped_international',   cat:'PR', sub:'Op-Ed',         name:'Op-Ed – International Media (creation + placement)',     price:12500000,  unit:'piece', internalNotes:'' },
      { id:'id_pr_invite',      key:'pr_media_invite',         cat:'PR', sub:'Media Invite',  name:'Media Invite (per media outlet)',                        price:2000000,   unit:'media', internalNotes:'qty = number of outlets invited, not number of events.' },
      { id:'id_pr_roundtable',  key:'pr_media_roundtable',     cat:'PR', sub:'Event',         name:'Media Roundtable (5+ Tier 1 media)',                     price:25000000,  unit:'event',     note:'Includes briefing, Q&A moderation, post-event report', internalNotes:'' },
      { id:'id_pr_event',       key:'pr_event_attendance',     cat:'PR', sub:'Event',         name:'Event / Activity Attendance',                            price:5000000,   unit:'event', internalNotes:'' },
      { id:'id_pr_podcast',     key:'pr_podcast',              cat:'PR', sub:'Podcast',       name:'Podcast Coordination',                                   price:10000000,  unit:'session',   note:'Excludes paid partnership fee if applicable', internalNotes:'' },
      { id:'id_pr_whitepaper',  key:'pr_whitepaper',           cat:'PR', sub:'Written',       name:'Whitepaper Creation',                                    price:100000000, unit:'piece', internalNotes:'' },
      // ── Content ─────────────────────────────────────────────────────────────
      { id:'id_cnt_art_s',      key:'content_article_short',   cat:'Content', sub:'Written',       name:'Blog / Article – Short (600–800 words)',             price:2500000,   unit:'piece', internalNotes:'' },
      { id:'id_cnt_art_l',      key:'content_article_long',    cat:'Content', sub:'Written',       name:'Blog / Article – Long (1,000–1,500 words)',          price:4000000,   unit:'piece', internalNotes:'' },
      { id:'id_cnt_report_b',   key:'content_report_basic',    cat:'Content', sub:'Report',        name:'Research Report – Basic (<30 pages, incl. design)',  price:50000000,  unit:'report', internalNotes:'' },
      { id:'id_cnt_report_s',   key:'content_report_standard', cat:'Content', sub:'Report',        name:'Research Report – Standard (30–50 pages, incl. design)', price:100000000, unit:'report', internalNotes:'' },
      { id:'id_cnt_report_p',   key:'content_report_premium',  cat:'Content', sub:'Report',        name:'Research Report – Premium (50+ pages, incl. design)', price:160000000, unit:'report', internalNotes:'' },
      { id:'id_cnt_soc_static', key:'content_social_static',   cat:'Content', sub:'Social Media',  name:'Social Media – Static / Single Image',               price:1500000,   unit:'post', internalNotes:'' },
      { id:'id_cnt_soc_carousel',key:'content_social_carousel',cat:'Content',sub:'Social Media',  name:'Social Media – Carousel',                            price:2500000,   unit:'post', internalNotes:'' },
      { id:'id_cnt_soc_motion', key:'content_social_motion',   cat:'Content', sub:'Social Media',  name:'Social Media – Motion Graphics',                     price:4000000,   unit:'post', internalNotes:'' },
      { id:'id_cnt_soc_video',  key:'content_social_video',    cat:'Content', sub:'Social Media',  name:'Social Media – Reels / Short Video',                 price:5000000,   unit:'post', internalNotes:'' },
      { id:'id_cnt_channel',    key:'content_channel_mgmt',    cat:'Content', sub:'Channel Mgmt',  name:'Channel Management (12 content/month)',               price:30000000,  unit:'month', internalNotes:'Baseline is 12 pieces/month. Scale price if brief states a different monthly volume.' },
      { id:'id_cnt_pkg_full',   key:'content_full_package',    cat:'Content', sub:'Channel Mgmt',  name:'Social Media Full Package (12 content, 50% motion)', price:65000000,  unit:'month', internalNotes:'' },
      // ── Video ───────────────────────────────────────────────────────────────
      { id:'id_vid_reels15',    key:'video_reels_short',       cat:'Video', sub:'Social',      name:'Social Media Reels (15–30 sec)',                         price:5000000,   unit:'video', internalNotes:'' },
      { id:'id_vid_reels60',    key:'video_reels_long',        cat:'Video', sub:'Social',      name:'Social Media Reels (30–60 sec)',                         price:8000000,   unit:'video', internalNotes:'' },
      { id:'id_vid_short90',    key:'video_shortform',         cat:'Video', sub:'Short-form',  name:'Short-form Video (60–90 sec)',                           price:12000000,  unit:'video', internalNotes:'' },
      { id:'id_vid_anim60',     key:'video_animation',         cat:'Video', sub:'Animation',   name:'2D Animation / Explainer (60 sec)',                      price:15000000,  unit:'video',     note:'Unlimited storyboard revisions, 2x video revisions. Voiceover charge may apply.', internalNotes:'' },
      { id:'id_vid_profile',    key:'video_company_profile',   cat:'Video', sub:'Corporate',   name:'Company Profile Video (90–180 sec)',                     price:35000000,  unit:'video', internalNotes:'' },
      { id:'id_vid_minidoc',    key:'video_minidoc',           cat:'Video', sub:'Documentary', name:'Mini Documentary (3–5 min)',                             price:75000000,  unit:'video', internalNotes:'' },
      { id:'id_vid_ad15',       key:'video_ad_15',             cat:'Video', sub:'Commercial',  name:'Advertisement / Advert (15 sec)',                        price:20000000,  unit:'video', internalNotes:'' },
      { id:'id_vid_ad30',       key:'video_ad_30',             cat:'Video', sub:'Commercial',  name:'Advertisement / Advert (30 sec)',                        price:35000000,  unit:'video', internalNotes:'' },
      { id:'id_vid_ad60',       key:'video_ad_60',             cat:'Video', sub:'Commercial',  name:'Advertisement / Advert (60 sec)',                        price:55000000,  unit:'video', internalNotes:'' },
      { id:'id_vid_ad240',      key:'video_ad_long',           cat:'Video', sub:'Commercial',  name:'Long-form Ad / Mini-doc (180–240 sec)',                  price:100000000, unit:'video', internalNotes:'' },
      // ── KOL ────────────────────────────────────────────────────────────────
      { id:'id_kol_mgmt',       key:'kol_campaign_mgmt',       cat:'KOL', sub:'Management',   name:'KOL Campaign Management (monthly)',                       price:8000000,   unit:'month',     note:'End-to-end coordination. Excludes KOL fee.', internalNotes:'' },
      { id:'id_kol_affiliate',  key:'kol_affiliate_mgmt',      cat:'KOL', sub:'Management',   name:'Affiliate Management (monthly)',                          price:15000000,  unit:'month',     note:'15% management fee. Excludes affiliate commissions.', internalNotes:'' },
      // Follower-tier activations intentionally have NO key — bands genuinely differ by market
      // (e.g. Singapore's tiers are follower/format-based, not a 1:1 match to Indonesia's bands).
      // Sync will never touch these; keep them hand-curated per market.
      { id:'id_kol_nano',       cat:'KOL', sub:'Activation',   name:'Nano KOL – ID (3K–10K followers)',                        price:1500000,   unit:'activation',note:'Includes sourcing, briefing, coordination, 1 revision, reporting', internalNotes:'' },
      { id:'id_kol_micro',      cat:'KOL', sub:'Activation',   name:'Micro KOL – ID (10K–100K followers)',                     price:5000000,   unit:'activation', internalNotes:'' },
      { id:'id_kol_macro',      cat:'KOL', sub:'Activation',   name:'Macro KOL – ID (100K–1M followers)',                      price:15000000,  unit:'activation', internalNotes:'' },
      { id:'id_kol_mega',       cat:'KOL', sub:'Activation',   name:'Mega KOL – ID (1M+ followers)',                           price:50000000,  unit:'activation',note:'Negotiated case by case; this is a reference rate.', internalNotes:'' },
      // ── Paid Ads ─────────────────────────────────────────────────────────────
      { id:'id_ads_setup',      key:'ads_setup',               cat:'Paid Ads', sub:'Setup',    name:'Ad Account Setup (one-time)',                             price:3000000,   unit:'one-time', internalNotes:'' },
      { id:'id_ads_mgmt',       key:'ads_mgmt',                cat:'Paid Ads', sub:'Management',name:'Ad Campaign Management (monthly)',                       price:7500000,   unit:'month',     note:'Excludes ad spend', internalNotes:'' },
      { id:'id_ads_creative',   key:'ads_creative',            cat:'Paid Ads', sub:'Creative',  name:'Ad Creative Production (per set)',                       price:5000000,   unit:'set', internalNotes:'' },
    ],
  },

  singapore: {
    label: 'Singapore 🇸🇬', currency: 'USD',
    services: [
      { id:'sg_pr_campaign',    cat:'PR', sub:'Campaign',     name:'PR Campaign (SG)',                                          price:3000,  unit:'campaign',   note:'Includes strategy, release creation, distribution, monitoring, report. 3–5 coverages.', internalNotes:'Baseline ~3-5 coverages/month. Scale if brief states a different target.' },
      { id:'sg_pr_coverage',    cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, SG)',                             price:440,   unit:'coverage', internalNotes:'' },
      { id:'sg_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (SG)',                                       price:700,   unit:'interview', internalNotes:'' },
      { id:'sg_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (SG)',                                       price:1000,  unit:'piece', internalNotes:'' },
      { id:'sg_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, SG)',                               price:300,   unit:'media', internalNotes:'' },
      { id:'sg_pr_consult',     cat:'PR', sub:'Consultation', name:'PR Consultation & Campaign Management (SG)',                 price:500,   unit:'month', internalNotes:'' },
      { id:'sg_pr_event_coord', cat:'PR', sub:'Event',        name:'Media Coordination at Event (SG)',                           price:1500,  unit:'event', internalNotes:'' },
      { id:'sg_adv_cna',        cat:'PR', sub:'Advertorial',  name:'Advertorial – Mainstream EN (CNA-level)',                    price:10000, unit:'placement',  note:'Subject to final media-kit confirmation.', internalNotes:'' },
      { id:'sg_adv_lhzb',       cat:'PR', sub:'Advertorial',  name:'Advertorial – Mainstream Mandarin (Lianhe Zaobao)',          price:12500, unit:'placement',  note:'Subject to final media-kit confirmation.', internalNotes:'' },
      { id:'sg_adv_bt',         cat:'PR', sub:'Advertorial',  name:'Advertorial – Business EN (Business Times)',                 price:13500, unit:'placement',  note:'Subject to final media-kit confirmation.', internalNotes:'' },
      { id:'sg_adv_st',         cat:'PR', sub:'Advertorial',  name:'Advertorial – Flagship (Straits Times)',                     price:17000, unit:'placement',  note:'Subject to final media-kit confirmation.', internalNotes:'' },
      { id:'sg_adv_edge',       cat:'PR', sub:'Advertorial',  name:'Advertorial – Sector-specific (Edge SG)',                    price:10000, unit:'placement',  note:'Subject to final media-kit confirmation.', internalNotes:'' },
      { id:'sg_kol_mgmt',       cat:'KOL', sub:'Management',  name:'KOL Campaign Management (SG)',                               price:800,   unit:'campaign', internalNotes:'' },
      { id:'sg_kol_mega',       cat:'KOL', sub:'Activation',  name:'KOL 500K+ TikTok (SG)',                                      price:13550, unit:'activation', internalNotes:'' },
      { id:'sg_kol_macro',      cat:'KOL', sub:'Activation',  name:'KOL 100K+ Video hosting (SG)',                               price:6500,  unit:'activation', internalNotes:'' },
      { id:'sg_kol_micro_v',    cat:'KOL', sub:'Activation',  name:'KOL 50K+ Video / Microblog (SG)',                            price:3500,  unit:'activation', internalNotes:'' },
      { id:'sg_kol_micro_i',    cat:'KOL', sub:'Activation',  name:'KOL 50K+ Image / Microblog (SG)',                            price:1825,  unit:'activation', internalNotes:'' },
    ],
  },

  thailand: {
    label: 'Thailand 🇹🇭', currency: 'USD',
    services: [
      { id:'th_pr_campaign',    cat:'PR', sub:'Campaign',     name:'PR Campaign (TH)',                                           price:3000,  unit:'campaign',   note:'~5 coverages', internalNotes:'Baseline ~5 coverages/month. Scale if brief states a different target.' },
      { id:'th_pr_coverage',    cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, TH)',                              price:225,   unit:'coverage', internalNotes:'' },
      { id:'th_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (TH)',                                        price:500,   unit:'interview', internalNotes:'' },
      { id:'th_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (TH)',                                        price:800,   unit:'piece', internalNotes:'' },
      { id:'th_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, TH)',                                price:250,   unit:'media', internalNotes:'' },
      { id:'th_pr_event_coord', cat:'PR', sub:'Event',        name:'Media Coordination at Event (TH)',                            price:2050,  unit:'event', internalNotes:'' },
      { id:'th_pr_dist_m',      cat:'PR', sub:'Distribution', name:'Press Material Distribution (monthly, TH)',                   price:2500,  unit:'month',      note:'Up to 5 items/month. Guaranteed minimum 2 unique placements.', internalNotes:'' },
      { id:'th_adv_bp',         cat:'PR', sub:'Advertorial',  name:'Advertorial – Bangkok Post (EN)',                             price:3200,  unit:'placement', internalNotes:'' },
      { id:'th_adv_nation',     cat:'PR', sub:'Advertorial',  name:'Advertorial – Nation Thailand (EN)',                          price:2500,  unit:'placement', internalNotes:'' },
      { id:'th_adv_sanook',     cat:'PR', sub:'Advertorial',  name:'Advertorial – Sanook.com (TH)',                               price:2200,  unit:'placement', internalNotes:'' },
      { id:'th_adv_thairath',   cat:'PR', sub:'Advertorial',  name:'Advertorial – Thai Rath (TH)',                                price:3000,  unit:'placement', internalNotes:'' },
      { id:'th_adv_khaosod',    cat:'PR', sub:'Advertorial',  name:'Advertorial – Khaosod (TH)',                                  price:2250,  unit:'placement', internalNotes:'' },
      { id:'th_adv_soc_en',     cat:'PR', sub:'Advertorial',  name:'Advertorial – Socio-political EN (5M+ reach)',                price:3075,  unit:'placement', internalNotes:'' },
      { id:'th_adv_soc_th',     cat:'PR', sub:'Advertorial',  name:'Advertorial – Socio-political TH (15M+ reach)',               price:4500,  unit:'placement', internalNotes:'' },
      { id:'th_adv_biz_en',     cat:'PR', sub:'Advertorial',  name:'Advertorial – Business EN (1M+ reach)',                       price:2825,  unit:'placement', internalNotes:'' },
      { id:'th_adv_biz_th',     cat:'PR', sub:'Advertorial',  name:'Advertorial – Business TH (5M+ reach)',                       price:3500,  unit:'placement', internalNotes:'' },
      { id:'th_adv_sector',     cat:'PR', sub:'Advertorial',  name:'Advertorial – Sector-specific TH (500K+ reach)',              price:2000,  unit:'placement', internalNotes:'' },
      { id:'th_kol_mgmt',       cat:'KOL', sub:'Management',  name:'KOL Campaign Management (TH)',                                price:500,   unit:'campaign', internalNotes:'' },
      { id:'th_kol_mega',       cat:'KOL', sub:'Activation',  name:'KOL 500K+ TikTok (TH)',                                       price:4250,  unit:'activation', internalNotes:'' },
      { id:'th_kol_macro',      cat:'KOL', sub:'Activation',  name:'KOL 100K+ Video hosting (TH)',                                price:2250,  unit:'activation', internalNotes:'' },
      { id:'th_kol_micro_v',    cat:'KOL', sub:'Activation',  name:'KOL 50K+ Video / Microblog (TH)',                             price:1050,  unit:'activation', internalNotes:'' },
      { id:'th_kol_micro_i',    cat:'KOL', sub:'Activation',  name:'KOL 50K+ Image / Microblog (TH)',                             price:525,   unit:'activation', internalNotes:'' },
    ],
  },

  malaysia: {
    label: 'Malaysia 🇲🇾', currency: 'USD',
    services: [
      { id:'my_pr_campaign',    cat:'PR', sub:'Campaign',     name:'PR Campaign (MY)',                                           price:3500,  unit:'campaign', internalNotes:'' },
      { id:'my_pr_coverage',    cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, MY)',                              price:350,   unit:'coverage', internalNotes:'' },
      { id:'my_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (MY)',                                        price:600,   unit:'interview', internalNotes:'' },
      { id:'my_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (MY)',                                        price:900,   unit:'piece', internalNotes:'' },
      { id:'my_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, MY)',                                price:250,   unit:'media', internalNotes:'' },
      { id:'my_pr_event_coord', cat:'PR', sub:'Event',        name:'Media Coordination at Event (MY)',                            price:3500,  unit:'event', internalNotes:'' },
      { id:'my_pr_dist_m',      cat:'PR', sub:'Distribution', name:'Press Material Distribution (monthly, MY)',                   price:3500,  unit:'month', internalNotes:'' },
      { id:'my_adv_edge',       cat:'PR', sub:'Advertorial',  name:'Advertorial – Edge Malaysia (EN)',                            price:4500,  unit:'placement', internalNotes:'' },
      { id:'my_adv_hm',         cat:'PR', sub:'Advertorial',  name:'Advertorial – Harian Metro (BM)',                             price:6500,  unit:'placement', internalNotes:'' },
      { id:'my_adv_star',       cat:'PR', sub:'Advertorial',  name:'Advertorial – The Star (business EN)',                        price:7000,  unit:'placement', internalNotes:'' },
      { id:'my_adv_bh',         cat:'PR', sub:'Advertorial',  name:'Advertorial – Berita Harian (BM)',                            price:6500,  unit:'placement', internalNotes:'' },
      { id:'my_adv_nst',        cat:'PR', sub:'Advertorial',  name:'Advertorial – NST (EN)',                                      price:7500,  unit:'placement', internalNotes:'' },
      { id:'my_adv_mk',         cat:'PR', sub:'Advertorial',  name:'Advertorial – Malaysiakini (BM)',                             price:6500,  unit:'placement', internalNotes:'' },
      { id:'my_adv_fmt',        cat:'PR', sub:'Advertorial',  name:'Advertorial – Free Malaysia Today / sector-specific (EN)',    price:4000,  unit:'placement', internalNotes:'' },
      { id:'my_kol_mgmt',       cat:'KOL', sub:'Management',  name:'KOL Campaign Management (MY)',                                price:500,   unit:'campaign', internalNotes:'' },
      { id:'my_kol_mega',       cat:'KOL', sub:'Activation',  name:'KOL 500K+ TikTok (MY)',                                       price:11550, unit:'activation', internalNotes:'' },
      { id:'my_kol_macro',      cat:'KOL', sub:'Activation',  name:'KOL 100K+ Video hosting (MY)',                                price:6000,  unit:'activation', internalNotes:'' },
      { id:'my_kol_micro_v',    cat:'KOL', sub:'Activation',  name:'KOL 50K+ Video / Microblog (MY)',                             price:3200,  unit:'activation', internalNotes:'' },
      { id:'my_kol_micro_i',    cat:'KOL', sub:'Activation',  name:'KOL 50K+ Image / Microblog (MY)',                             price:1525,  unit:'activation', internalNotes:'' },
    ],
  },

  vietnam: {
    label: 'Vietnam 🇻🇳', currency: 'USD',
    services: [
      { id:'vn_pr_campaign',    cat:'PR', sub:'Campaign',     name:'PR Campaign (VN)',                                           price:2500,  unit:'campaign', internalNotes:'' },
      { id:'vn_pr_cov_strat',   cat:'PR', sub:'Distribution', name:'Strategic PR Coverage (top media, VN)',                       price:225,   unit:'coverage', internalNotes:'' },
      { id:'vn_pr_cov_tact',    cat:'PR', sub:'Distribution', name:'Tactical PR Coverage (VN)',                                   price:325,   unit:'coverage', internalNotes:'' },
      { id:'vn_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (VN)',                                        price:400,   unit:'interview', internalNotes:'' },
      { id:'vn_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (VN)',                                        price:700,   unit:'piece', internalNotes:'' },
      { id:'vn_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, VN)',                                price:200,   unit:'media', internalNotes:'' },
      { id:'vn_kol_mgmt',       cat:'KOL', sub:'Management',  name:'KOL Campaign Management (VN)',                                price:400,   unit:'campaign', internalNotes:'' },
      { id:'vn_kol_mega',       cat:'KOL', sub:'Activation',  name:'KOL 500K+ (VN)',                                              price:2000,  unit:'activation', internalNotes:'' },
      { id:'vn_kol_macro',      cat:'KOL', sub:'Activation',  name:'KOL 100K+ (VN)',                                              price:800,   unit:'activation', internalNotes:'' },
      { id:'vn_kol_micro',      cat:'KOL', sub:'Activation',  name:'KOL 50K+ (VN)',                                               price:300,   unit:'activation', internalNotes:'' },
    ],
  },

  philippines: {
    label: 'Philippines 🇵🇭', currency: 'USD',
    services: [
      { id:'ph_pr_campaign',    cat:'PR', sub:'Campaign',     name:'PR Campaign (PH)',                                           price:2500,  unit:'campaign', internalNotes:'' },
      { id:'ph_pr_coverage',    cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, PH)',                              price:350,   unit:'coverage', internalNotes:'' },
      { id:'ph_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (PH)',                                        price:450,   unit:'interview', internalNotes:'' },
      { id:'ph_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (PH)',                                        price:700,   unit:'piece', internalNotes:'' },
      { id:'ph_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, PH)',                                price:200,   unit:'media', internalNotes:'' },
      { id:'ph_kol_mgmt',       cat:'KOL', sub:'Management',  name:'KOL Campaign Management (PH)',                                price:400,   unit:'campaign', internalNotes:'' },
      { id:'ph_kol_mega',       cat:'KOL', sub:'Activation',  name:'KOL 500K+ (PH)',                                              price:2500,  unit:'activation', internalNotes:'' },
      { id:'ph_kol_macro',      cat:'KOL', sub:'Activation',  name:'KOL 100K+ (PH)',                                              price:900,   unit:'activation', internalNotes:'' },
      { id:'ph_kol_micro',      cat:'KOL', sub:'Activation',  name:'KOL 50K+ (PH)',                                               price:350,   unit:'activation', internalNotes:'' },
    ],
  },

  japan: {
    label: 'Japan 🇯🇵', currency: 'USD',
    services: [
      { id:'jp_pr_campaign',    cat:'PR', sub:'Campaign',     name:'PR Campaign (JP)',                                           price:4000,  unit:'campaign',   note:'Includes JP translation, distribution, monitoring. 5+ coverages.', internalNotes:'' },
      { id:'jp_pr_newswire',    cat:'PR', sub:'Campaign',     name:'PR via Newswire (JP)',                                        price:2000,  unit:'campaign',   note:'Via JP newswire. 10+ coverages target.', internalNotes:'' },
      { id:'jp_pr_coverage',    cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, JP)',                              price:370,   unit:'coverage', internalNotes:'' },
      { id:'jp_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (JP)',                                        price:700,   unit:'interview', internalNotes:'' },
      { id:'jp_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (JP)',                                        price:1200,  unit:'piece', internalNotes:'' },
      { id:'jp_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, JP)',                                price:400,   unit:'media', internalNotes:'' },
    ],
  },

  korea: {
    label: 'Korea 🇰🇷', currency: 'USD',
    services: [
      { id:'kr_pr_newswire',    cat:'PR', sub:'Campaign',     name:'PR via Newswire (KR)',                                       price:2500,  unit:'campaign',   note:'Via KR newswire. 20 coverages target.', internalNotes:'' },
      { id:'kr_pr_coverage',    cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, KR)',                              price:125,   unit:'coverage', internalNotes:'' },
      { id:'kr_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (KR)',                                        price:600,   unit:'interview', internalNotes:'' },
      { id:'kr_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (KR)',                                        price:1000,  unit:'piece', internalNotes:'' },
      { id:'kr_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, KR)',                                price:300,   unit:'media', internalNotes:'' },
    ],
  },

  china: {
    label: 'China 🇨🇳', currency: 'USD',
    services: [
      { id:'cn_pr_campaign',    cat:'PR', sub:'Campaign',     name:'PR Campaign (CN)',                                           price:2500,  unit:'campaign',   note:'1–3 coverages.', internalNotes:'' },
      { id:'cn_pr_coverage',    cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, CN)',                              price:500,   unit:'coverage', internalNotes:'' },
      { id:'cn_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (CN)',                                        price:800,   unit:'interview', internalNotes:'' },
      { id:'cn_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (CN)',                                        price:1500,  unit:'piece', internalNotes:'' },
      { id:'cn_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, CN)',                                price:500,   unit:'media', internalNotes:'' },
    ],
  },

  australia: {
    label: 'Australia 🇦🇺', currency: 'USD',
    services: [
      { id:'au_pr_campaign',    cat:'PR', sub:'Campaign',     name:'PR Campaign (AU)',                                           price:3500,  unit:'campaign',   note:'2+ coverages.', internalNotes:'' },
      { id:'au_pr_coverage',    cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, AU)',                              price:440,   unit:'coverage', internalNotes:'' },
      { id:'au_pr_interview',   cat:'PR', sub:'Interview',    name:'Media Interview (AU)',                                        price:700,   unit:'interview', internalNotes:'' },
      { id:'au_pr_oped',        cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (AU)',                                        price:1200,  unit:'piece', internalNotes:'' },
      { id:'au_pr_invite',      cat:'PR', sub:'Media Invite', name:'Media Invite (per media, AU)',                                price:400,   unit:'media', internalNotes:'' },
    ],
  },

  emea: {
    label: 'EMEA / UAE 🌍', currency: 'USD',
    services: [
      { id:'emea_pr_campaign',  cat:'PR', sub:'Campaign',     name:'PR Campaign (UAE / EMEA)',                                   price:3000,  unit:'campaign',   note:'1–3 coverages.', internalNotes:'' },
      { id:'emea_pr_coverage',  cat:'PR', sub:'Distribution', name:'PR Coverage (per coverage, EMEA)',                            price:600,   unit:'coverage', internalNotes:'' },
      { id:'emea_pr_interview', cat:'PR', sub:'Interview',    name:'Media Interview (UAE / EMEA)',                                price:900,   unit:'interview', internalNotes:'' },
      { id:'emea_pr_oped',      cat:'PR', sub:'Op-Ed',        name:'Op-Ed Placement (UAE / EMEA)',                                price:1800,  unit:'piece', internalNotes:'' },
      { id:'emea_pr_invite',    cat:'PR', sub:'Media Invite', name:'Media Invite (per media, EMEA)',                              price:500,   unit:'media', internalNotes:'' },
    ],
  },
}

// Best-effort mapping of EXISTING non-Indonesia service ids to a canonical key, so the
// "Sync from Indonesia" feature doesn't create duplicates of things markets already have
// under a locally-named service. These are inferred equivalences, not exact 1:1 matches
// (e.g. Singapore's single "PR Campaign" folds together what Indonesia splits into
// national/international) — sanity-check after first sync if a market's mix looks off.
export const LEGACY_KEY_MAP = {
  sg_pr_campaign:'pr_campaign_national', sg_pr_coverage:'pr_coverage', sg_pr_interview:'pr_interview_national', sg_pr_oped:'pr_oped_national', sg_pr_invite:'pr_media_invite', sg_pr_consult:'pr_consult_retainer', sg_pr_event_coord:'pr_event_attendance', sg_kol_mgmt:'kol_campaign_mgmt',
  th_pr_campaign:'pr_campaign_national', th_pr_coverage:'pr_coverage', th_pr_interview:'pr_interview_national', th_pr_oped:'pr_oped_national', th_pr_invite:'pr_media_invite', th_pr_event_coord:'pr_event_attendance', th_kol_mgmt:'kol_campaign_mgmt',
  my_pr_campaign:'pr_campaign_national', my_pr_coverage:'pr_coverage', my_pr_interview:'pr_interview_national', my_pr_oped:'pr_oped_national', my_pr_invite:'pr_media_invite', my_pr_event_coord:'pr_event_attendance', my_kol_mgmt:'kol_campaign_mgmt',
  vn_pr_campaign:'pr_campaign_national', vn_pr_cov_strat:'pr_coverage', vn_pr_interview:'pr_interview_national', vn_pr_oped:'pr_oped_national', vn_pr_invite:'pr_media_invite', vn_kol_mgmt:'kol_campaign_mgmt',
  ph_pr_campaign:'pr_campaign_national', ph_pr_coverage:'pr_coverage', ph_pr_interview:'pr_interview_national', ph_pr_oped:'pr_oped_national', ph_pr_invite:'pr_media_invite', ph_kol_mgmt:'kol_campaign_mgmt',
  jp_pr_campaign:'pr_campaign_national', jp_pr_coverage:'pr_coverage', jp_pr_interview:'pr_interview_national', jp_pr_oped:'pr_oped_national', jp_pr_invite:'pr_media_invite',
  kr_pr_coverage:'pr_coverage', kr_pr_interview:'pr_interview_national', kr_pr_oped:'pr_oped_national', kr_pr_invite:'pr_media_invite',
  cn_pr_campaign:'pr_campaign_national', cn_pr_coverage:'pr_coverage', cn_pr_interview:'pr_interview_national', cn_pr_oped:'pr_oped_national', cn_pr_invite:'pr_media_invite',
  au_pr_campaign:'pr_campaign_national', au_pr_coverage:'pr_coverage', au_pr_interview:'pr_interview_national', au_pr_oped:'pr_oped_national', au_pr_invite:'pr_media_invite',
  emea_pr_campaign:'pr_campaign_national', emea_pr_coverage:'pr_coverage', emea_pr_interview:'pr_interview_national', emea_pr_oped:'pr_oped_national', emea_pr_invite:'pr_media_invite',
}

export function getServiceKey(svc) {
  return svc.key || LEGACY_KEY_MAP[svc.id] || null
}

export default PRICING
