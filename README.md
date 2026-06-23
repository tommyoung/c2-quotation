# C2 Quotation Generator

AI-powered quotation generator for Content Collision (C2). Built on React + Vite. Uses OpenAI GPT to interpret a brief and generate a formatted, exportable quotation.

---

## Quick answer: Cloudflare free vs. Vercel?

**Both are free and both work.** Choose based on what's easier for you:

| | Vercel (recommended) | Cloudflare Pages |
|---|---|---|
| Setup effort | ★★★★★ Simplest | ★★★★ Very easy |
| Deployment | Connect GitHub → auto-deploy | Drag & drop build folder |
| API function | Included automatically | Included via `functions/` folder |
| Free limits | 100 GB-hrs/month (plenty) | 100,000 req/day (plenty) |
| Performance | Fast globally | Faster globally (edge network) |

**Recommendation: Vercel.** Zero configuration, GitHub integration, works out of the box.

---

## Before you start

You need:
1. A [GitHub](https://github.com) account (free)
2. An [OpenAI API key](https://platform.openai.com/api-keys)
3. Either a [Vercel](https://vercel.com) account or [Cloudflare](https://cloudflare.com) account (both free)

You do NOT need Node.js or any terminal access for the Vercel path.

---

## Option A: Deploy to Vercel (Recommended)

### Step 1 — Put the code on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository called `c2-quotation` (set to **Private**)
3. Upload all the files from this folder to that repository
   - Click **Add file → Upload files** in GitHub
   - Drag the entire contents of this folder in
   - Make sure the folder structure is preserved:
     ```
     /api/generate.js
     /functions/api/generate.js
     /src/main.jsx
     /src/App.jsx
     /src/pricing.js
     /index.html
     /package.json
     /vite.config.js
     /vercel.json
     ```
   - Click **Commit changes**

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Select your `c2-quotation` repository
4. Vercel will auto-detect it as a Vite project. **Do not change any settings.**
5. Click **Deploy**
6. Wait ~60 seconds. You'll get a URL like `c2-quotation-xxx.vercel.app`

### Step 3 — Add your OpenAI API key

1. In Vercel, go to your project → **Settings → Environment Variables**
2. Add these variables:

| Key | Value |
|---|---|
| `OPENAI_API_KEY` | `sk-...` (your key from platform.openai.com) |
| `OPENAI_MODEL` | `gpt-4o-mini` |
| `VITE_ADMIN_CODE` | Your chosen admin password (e.g. `c2secure2026`) |

3. Click **Save**
4. Go to **Deployments** → click the three dots on the latest deployment → **Redeploy**

### Step 4 — Test it

Open your Vercel URL. The app should load. Try:
1. Enter a client name and select a market
2. Type a brief in the box
3. Click **Generate Quotation**

Done. Share the URL with your team.

### Optional: Custom domain

In Vercel → **Settings → Domains**, add your own domain (e.g. `quotation.contentcollision.co`).

---

## Option B: Deploy to Cloudflare Pages

### Step 1 — Build the app locally

You need Node.js for this step only (one time).

```bash
# Install Node.js from nodejs.org if you don't have it
# Then in terminal, navigate to this folder:

npm install
npm run build
```

This creates a `dist/` folder.

### Step 2 — Deploy to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages**
2. Click **Create a project → Direct Upload**
3. Name your project `c2-quotation`
4. Upload the `dist/` folder AND the `functions/` folder
   - Important: the `functions/` folder must be at the root of your upload, not inside `dist/`
5. Click **Deploy site**

### Step 3 — Add environment variables

1. In Cloudflare Pages → your project → **Settings → Environment Variables**
2. Add:
   - `OPENAI_API_KEY` = your OpenAI key
   - `OPENAI_MODEL` = `gpt-4o-mini`
   - `VITE_ADMIN_CODE` = your admin password
3. **Redeploy** after saving

> **Note for Cloudflare:** Every time you update `src/App.jsx` or `src/pricing.js`, you need to run `npm run build` again and re-upload the `dist/` folder. Vercel does this automatically from GitHub.

---

## OpenAI model options

| Model | Cost | Quality | Recommendation |
|---|---|---|---|
| `gpt-4o-mini` | ~$0.001/quotation | Great | Start here |
| `gpt-4o` | ~$0.015/quotation | Best | Upgrade if output needs refinement |

Change the model in your environment variables anytime.

---

## How to use the app

### Generating a quotation

1. **Client Details** — fill in name, ID, date, period
2. **Markets** — click the country chips to select markets
   - Selecting only Indonesia → quotation in IDR
   - Any other market → quotation in USD
3. **Brief** — paste the client email, list of requirements, or type what they need
   - Example: *"3-month PR retainer in SG. 5 coverages/month. 1 media roundtable in month 2."*
4. **Discount** — enter percentage if needed
5. Click **Generate Quotation**
6. Review the output on the right
7. Click **Download Excel** or **Print / Save as PDF**

### Editing a generated quotation

The AI output is a first draft. If something is wrong:
- Adjust the brief and click Generate again
- Or download the Excel and edit manually

### Updating prices (Admin panel)

1. Click **Admin / Pricing** in the top nav
2. Enter the admin code (default: `c2admin`, change in env variables)
3. Select a market tab
4. Edit any prices
5. Click **Save Prices** — saves to your browser
6. Click **Export Config (JSON)** to share the updated prices with team members
7. Team members click **Import Config** to load the same prices

> **Note:** Admin edits save to your browser's local storage. They don't sync automatically across devices. Use Export/Import to share with team.

To permanently update the default prices (so everyone gets them without importing):
1. Edit `src/pricing.js` directly
2. Push to GitHub (or re-upload to Cloudflare)
3. Vercel will auto-redeploy

---

## How to add a new service

Edit `src/pricing.js`. Each service entry looks like:

```javascript
{ 
  id: 'unique_id',          // Must be unique across all markets
  cat: 'PR',                // Category: PR | Content | Video | KOL | Paid Ads
  sub: 'Campaign',          // Subcategory
  name: 'Service name as it appears in the app and quotation',
  price: 3000,              // Numeric price (IDR or USD depending on market)
  unit: 'campaign',         // Unit label (campaign, month, piece, coverage, etc.)
  note: 'Optional note'     // Shows in admin panel and as quotation note
}
```

After editing `src/pricing.js`, push to GitHub and Vercel will redeploy automatically.

---

## Quotation format reference

The generated quotation matches C2's standard format:
- Company header (PT Konten Global Adikarya)
- Client details grid (Date, Quote #, Customer ID, Period)
- Service table with No / Service / Qty / Price Per Unit / Total / Notes
- Subtotal → Discount → PPh23 Tax (2%) → Grand Total
- Down payment amount
- Payment terms and standard notes
- Signature block (Tommy Prayoga or Dinda Anandita)

PPh23 tax formula used: `Grand Total = (Subtotal - Discount) / 0.98`
This matches all historical C2 quotations.

---

## Troubleshooting

**"Generation failed" error**
- Check that `OPENAI_API_KEY` is set in your environment variables
- Check that you redeployed after adding the key
- Check your OpenAI account has credits at platform.openai.com/usage

**Quotation is missing a service I expected**
- The AI interprets the brief and selects services from the pricing database
- Be more specific in the brief, e.g. "3 nano KOL activations on TikTok"
- Or adjust pricing in Admin panel to make sure the service exists for that market

**Prices look wrong**
- Go to Admin panel and verify the prices for the selected market
- The AI uses prices from the database — if a price is wrong in the DB, the quotation will reflect that

**Excel download doesn't work**
- Make sure you're using a modern browser (Chrome, Firefox, Edge)

---

## File structure

```
c2-quotation/
├── api/
│   └── generate.js          ← OpenAI proxy for Vercel
├── functions/
│   └── api/
│       └── generate.js      ← OpenAI proxy for Cloudflare Pages
├── src/
│   ├── main.jsx             ← React entry point
│   ├── App.jsx              ← Full application (all components)
│   └── pricing.js           ← Pricing database (edit this to update defaults)
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── .env.example             ← Environment variable template
```

---

## Security

- Your OpenAI API key is **never** exposed to the browser. It lives only in Vercel/Cloudflare environment variables and is called server-side.
- The admin panel uses a simple password stored as an environment variable. This is sufficient for an internal tool not exposed to public sign-up.
- The app URL is unguessable by default (Vercel subdomain). Add a custom domain with Cloudflare Access or Vercel password protection if you need additional security.
