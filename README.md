# 🌿 AssetFlow — Finance & Assets Manager

A personal finance tracker built with React Native (Expo). Track your assets, log income and expenses, set savings goals, and get smart insights — all stored locally on your device with no backend required.

---

## Features

### 📊 Dashboard
- Live **net worth** hero card (total assets)
- **Monthly summary** — income, expenses, and savings for the current month
- Quick-glance top 3 assets and goals with progress
- Recent 5 transactions
- One-tap shortcut to log a transaction

### 📈 Assets
- Track **Mutual Funds, ETFs, Stocks, Real Estate, Crypto, and Other**
- Per-asset: units, buy price, current price → auto-calculated current value & P&L
- Filter by asset type, search by name or ticker
- Detail view with a performance chart (invested vs. current)

### 💸 Transactions
- Log **income and expenses** across 20 categories
- Month navigator to browse history
- Filter by All / Income / Expense
- Edit and delete with swipe-style confirmation

### 🎯 Goals
- Create savings goals with a target amount, deadline, icon, and colour
- Link goals to **assets**, **transaction categories**, or a **manual amount**
- SVG progress ring with days-left countdown
- Progress computed live from linked assets/transactions

### 🛡 Essentials
- Track your **Emergency Fund**, **Term Insurance**, and **Health Insurance**
- Coverage bar with status (Good / Partial / Low)
- Renewal date reminders

### 💡 Insights
- **Spending breakdown** by category (donut chart)
- **Income vs. Expense** bar chart across the last 6 months
- **Net worth trend** line chart from daily snapshots
- **Smart tips** — personalised alerts for savings rate, emergency fund, insurance gaps

### ⚙️ Settings
- **Light / Dark / System** theme toggle
- Profile & currency preferences *(coming soon)*
- Data export *(coming soon)*

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.83 via **Expo SDK 55** |
| Router | **expo-router** v3 (file-based tabs + stack) |
| Database | **expo-sqlite** — fully local, no internet needed |
| State | **Zustand** v5 (4 domain stores) |
| Charts | **react-native-gifted-charts** (Pie, Bar, Line) |
| SVG | **react-native-svg** (progress rings) |
| Animations | **expo-linear-gradient**, **react-native-reanimated** |
| Date | **date-fns** v4 |
| Language | **TypeScript** 5.9 — strict mode |

---

## Project Structure

```
app/                        # expo-router file-based routes
  (tabs)/
    index.tsx               # Dashboard
    assets/                 # Asset list, add/edit, detail
    transactions/           # Transaction list, add/edit
    goals/                  # Goals list, add/edit, detail
    essentials/             # Essentials (inline bottom-sheet form)
    insights/               # Charts & tips
    settings.tsx            # Settings page
    more.tsx                # Phantom route for the More tab button

src/
  components/               # UI components (ui/, dashboard/, assets/, goals/, …)
  constants/                # Asset types, transaction categories, essential types
  db/                       # SQLite client, migrations, CRUD query files
  store/                    # Zustand stores (assets, transactions, goals, essentials)
  theme/                    # Colors, typography, spacing, ThemeContext
  utils/                    # calculations, currency formatting, date helpers
```

---

## Database

All data lives in a local SQLite file (`finsh.db`) — nothing leaves your device.

| Table | Purpose |
|---|---|
| `assets` | Investment assets with buy/current price |
| `transactions` | Income and expense entries |
| `goals` | Savings goals |
| `goal_links` | Links between goals and assets / categories |
| `essentials` | Emergency fund, term & health insurance records |
| `net_worth_snapshots` | Daily net worth history for trend chart |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Expo Go](https://expo.dev/go) app on your phone, **or** an iOS/Android simulator

### Install

```bash
git clone <repo-url>
cd finsh
npm install
```

### Run

```bash
npx expo start          # opens dev server — scan QR with Expo Go
npx expo start --ios    # iOS simulator
npx expo start --android
```

No environment variables, no API keys, no backend setup required.

---

## Architecture Notes

- **No hardcoded colors** — every color token goes through `theme.colors.*`
- **No network calls** — 100% offline, SQLite sync API only
- **Stores reload from DB** after every mutation via `get().load()` — single source of truth
- **Goal links are lazy-loaded** — `links[goalId]` is populated on app init and whenever goals change (prevents the 0% progress bug on cold start)
- Currency is **INR (₹)** by default; compact formatting: `₹1.23L`, `₹12.5K`, `₹1.23Cr`

---

## Roadmap

- [ ] iCloud / Google Drive backup
- [ ] CSV / JSON export
- [ ] Multiple currencies per asset
- [ ] Recurring transaction templates
- [ ] Widget for net worth (iOS / Android)
- [ ] Profile & display name customisation

---

## License

Personal use. Not published to any app store.

