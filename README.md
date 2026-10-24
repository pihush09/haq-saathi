# Haq Saathi (हक़ साथी) — “Government support, explained simply.”

> **Independent Public Good Prototype — Not an official government service.**  
> Helping Indian informal workers discover potentially relevant government welfare schemes, documents to verify, and official next steps without middlemen.

---

## 🌟 What is Haq Saathi?

India has over 400 million informal and unorganised workers — construction workers, street vendors, domestic maids, cooks, delivery riders, farm hands, and daily-wage labourers. While dozens of central and state welfare programs exist, workers often struggle with:
1. **Legal jargon and bureaucratic language**
2. **Fraudulent agents and corrupt middlemen charging fees**
3. **Confusion between screening relevance and guaranteed approval**
4. **Lack of simple Hindi and mobile-first access**

**Haq Saathi** is a worker-first, privacy-respecting full-stack web application designed for a first-time smartphone user. It replaces generic chatbots with a structured 5-step screening interview, visual occupation cards, plain-language Hindi and English explanations, official readiness checklists, and deterministic matching directly mapped to verified government rules.

---

## 🚀 Key Features

- **Worker-First Guided Screening**: 5 simple questions (occupation, age, state, approximate income, exclusion checks). Explains why each question is asked.
- **Visual Occupation Cards**: Large touch-friendly cards with icons and descriptions covering 8 unorganised labour sectors.
- **Deterministic Matching Engine**: 100% rule-based matching derived directly from official government schemes. Never relies on unpredictable AI to decide eligibility.
- **Explain Like I’m New (Gemma AI + Offline Fallback)**:
  - Powered by Google AI Studio Gemini API with configurable `GEMMA_MODEL` (e.g. `gemini-1.5-flash`, `gemma-2-9b-it`).
  - Strict guardrails: strictly confined to verified catalogue facts, never hallucinates rules or amounts.
  - **Works 100% offline / without API key**: If no key is set or the API times out, it gracefully falls back to verified catalogue explanations.
- **Readiness Checklist**:
  - Interactive checkboxes to track original documents and application steps.
  - One-click copy/share to clipboard for easy WhatsApp/SMS sharing.
  - Clean printable view (`window.print()`).
- **First-Class Hindi (हिंदी)**: Instant toggle between English and Hindi across all UI labels, questions, badges, and scheme details.
- **Zero Sensitive Data Storage**: Never asks for Aadhaar numbers, OTPs, bank account numbers, or passwords. No login required.
- **Judge Demo Profiles**: One-click test profiles (Ramesh the street vendor, Sunita the construction worker) with fictional sample data.
- **Fallback to myScheme**: When no specific scheme matches, directly connects users to the official 500+ scheme database on `myScheme.gov.in`.

---

## 📚 Curated & Verified Schemes (Catalogue)

All schemes are manually verified against published central gazettes and official ministry portals:

| Scheme ID | Scheme Name & Official Portal | Target Workers | Key Verified Benefit |
| :--- | :--- | :--- | :--- |
| **`eshram`** | [e-Shram Portal](https://eshram.gov.in/) | All unorganised workers (16–59 yrs) | 12-digit national UAN card, single registry for social security delivery |
| **`pmsym`** | [PM-SYM Pension](https://maandhan.in/) | Unorganised workers (18–40 yrs, income ≤ ₹15k) | ₹3,000/month assured pension after age 60 with 50% govt co-contribution |
| **`pmsvanidhi`** | [PM SVANidhi Loan](https://pmsvanidhi.mohua.gov.in/) | Urban/semi-urban street vendors & hawkers | ₹10k, ₹20k & ₹50k collateral-free working capital loan with 7% interest subsidy |
| **`pmsby`** | [PMSBY Accident Cover](https://www.jansuraksha.gov.in/) | Bank account holders (18–70 yrs) | ₹2 Lakh accidental death / total disability cover for ₹20/year |
| **`pmjjby`** | [PMJJBY Life Insurance](https://www.jansuraksha.gov.in/) | Bank account holders (18–50 yrs) | ₹2 Lakh term life insurance for death due to any reason for ₹436/year |
| **`bocw`** | [BoCW Construction Board](https://www.myscheme.gov.in/schemes/bocwwb) | Building & construction site workers (18–60 yrs, 90+ days work) | State board grants (tool aid, children scholarships, accident relief) |
| **`pmjay`** | [Ayushman Bharat PM-JAY](https://pmjay.gov.in/) | Low-income unorganised families | Up to ₹5 Lakh/family/year cashless hospital cover across empaneled hospitals |

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React Icons.
- **Backend**: Node.js 20+, Express, TypeScript, Express Rate Limit, CORS.
- **AI Integration**: Server-side Google Gemini / Gemma API with configurable model (`GEMMA_MODEL`) and offline verified fallback.
- **Automated Tests**: Native Node test runner (`node:test` + `node:assert/strict`) for instant execution without bulky test dependencies.

---

## 💻 Beginner-Friendly Commands (Windows / PowerShell)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended). Check with:
  ```powershell
  node --version
  npm --version
  ```

### 2. Install Dependencies
Run a single command from the project root:
```powershell
npm install
```

### 3. Configure Environment (Optional)
The application works immediately in **Verified Demo/Fallback mode** without any API key.

If you wish to enable live AI-generated plain language explanations:
1. Copy the example file in the `server` folder:
   ```powershell
   Copy-Item server/.env.example server/.env
   ```
2. Open `server/.env` and insert your Google AI Studio API key:
   ```env
   PORT=5000
   GEMINI_API_KEY=AIzaSy...your_actual_key_here
   GEMMA_MODEL=gemini-1.5-flash
   ```

### 4. Run Automated Tests
Execute the full test suite (matching rules, catalog schema verification, API endpoints, and sensitive-data rejection):
```powershell
npm test
```
*Expected: 14 passing tests in ~2 seconds.*

### 5. Build for Production
Build both the frontend client and the backend server:
```powershell
npm run build
```

### 6. Start the Application

#### Option A: Development Mode (Hot Reloading for Client & Server)
```powershell
npm run dev
```
- Frontend will open at: `http://localhost:5173`
- Backend API runs at: `http://localhost:5000`

#### Option B: Production Server (Single Port Serving Full Stack)
```powershell
npm start
```
- Open your browser to: `http://localhost:5000`

---

## 🎬 2-Minute Judge Demo Script

1. **Open the Homepage** (`http://localhost:5000` or `http://localhost:5173`):
   - Notice the visual identity: deep forest green, warm cream backgrounds, readable typography, and the independent prototype badge.
   - Click the language toggle button in the top right to switch between **English** and **हिंदी** — all labels and buttons translate immediately.
2. **Instant Judge Demo Profile**:
   - On the homepage, tap **"🛒 Ramesh (Street Vendor, Delhi, ₹12k)"**.
   - Watch the screen transition directly to the **Results page**.
   - See how **PM SVANidhi**, **e-Shram**, **PM-SYM**, and **PMSBY** are flagged as `Potential match — check the full rules`.
   - See how **BoCW Construction Card** is flagged as `Does not match stated criteria` because Ramesh is a street vendor, not a construction worker.
3. **Explore Explain Like I’m New**:
   - On the PM SVANidhi card, click **"Explain in simple English"** (or **"सरल हिंदी में समझाइए"**).
   - A modal opens showing what the scheme actually does, why it matters for Ramesh, what to verify, and official next steps.
   - If an API key is configured, the badge shows `Gemma AI Active`; if not, it shows `Verified Offline Catalogue Mode` with 100% accurate facts.
4. **Check Readiness & Copy Checklist**:
   - Click **"What should I do next?"** or **"Copy checklist"**.
   - In the checklist modal, notice interactive checkboxes for original documents (Vending certificate, Aadhaar, Bank passbook).
   - Tap **"Copy checklist"** to copy the formatted text ready for SMS or WhatsApp sharing.
5. **Worker-First Guided Screening**:
   - Click **"Start New Screening"**.
   - Walk through the 5 steps: Occupation -> Age -> State -> Income -> Exclusion questions.
   - Notice the helpful *"Why we ask this"* explanation under every question.
   - Notice that sensitive identifiers (Aadhaar number, OTP, bank account number) are never requested.
6. **Browse Curated Catalogue**:
   - Click **"Explore"** in the top navigation to view the full search & category filter of all 7 verified schemes.

---

## 🛡️ Security, Privacy & Accuracy Principles

1. **No Sensitive Identifiers**: Haq Saathi will reject any request containing Aadhaar numbers, OTPs, or bank account numbers.
2. **Local Session State**: Screening answers exist only in the user's browser memory for the duration of the screening session.
3. **No Hallucinations**: AI models are never allowed to invent benefit amounts, deadlines, or URLs. Official links strictly originate from the local verified JSON catalogue.
4. **Rate Limiting**: AI endpoints are rate-limited to 30 requests/min per IP to prevent quote exhaustion.
5. **Independent Prototype Notice**: Displayed clearly in the header, hero, and footer: *"Independent prototype — not an official government service."*

---

## 📄 License
MIT License. Created as an independent open public good prototype to empower Indian unorganised workers.
