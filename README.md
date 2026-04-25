# NextLife v2.2.1

> **Aim for the future** — A personal finance and life-tracking desktop application.

NextLife helps you monitor your net worth, investments, businesses, trading activity, goals, and skills all in one place. It runs as an Electron desktop app backed by a local SQLite database.

---

## Features

### Dashboard
- View total net worth, monthly income, investment profit, and monthly profit at a glance
- Record snapshots over time and visualize them on a graph

### Net Worth
- View net worth broken down by platform
- Add, edit, or delete platforms
- Track each platform's name, current value, base value, linked goal, and type

### Investment
- View investment platform value, capital, and profit
- Record investment snapshots (total, capital, profit, profit %)

### Trading
- Track trading performance over time
- Record snapshots with total, profit %, total profit, previous profit, and averages

### Business
- View businesses with revenue, capital, and status
- Add, edit, or delete business entries
- Record business performance snapshots (profit, revenue, capital, profit %)

### Goal
- **Ultimate Goals** — long-term goals with a target value, current value, image, and completion status
- **Other Goals** — simple checklist-style goals with a completion toggle

### Skill
- Organize skills into categories (skill types)
- Add, delete, and track individual skills with a completion status

### Settings
- **Reset** — clear all data across every table
- **Backup** — export all data as a JSON file
- **Restore** — import a previously exported backup

---

## Project Structure

```
NextLife/
├── server.js            # Express API server entry point
├── package.json         # Back-end dependencies
├── db/
│   └── index.js         # SQLite database setup & schema
├── routes/
│   ├── index.js         # Route registration
│   ├── networth.js      # /networth routes
│   ├── business.js      # /business routes
│   ├── investment.js    # /investment routes
│   ├── trading.js       # /trading routes
│   ├── goal.js          # /goal routes
│   ├── skill.js         # /skill routes
│   └── settings.js      # /settings routes
└── ui/
    ├── package.json     # Front-end dependencies
    ├── electron/        # Electron main & preload scripts
    └── src/
        ├── App.tsx      # React Router setup
        └── Components/  # Page components (Dashboard, Networth, etc.)
```

---

## API Reference

All endpoints return JSON in the format `{ "status": "success", "data": { ... } }`.  
The server runs on **port 4001** by default (configurable via `PORT` env variable).

### `/networth`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/networth` | Get all net worth entries |
| `POST` | `/networth` | Create a net worth entry |
| `PUT` | `/networth` | Update a net worth entry |
| `DELETE` | `/networth/:id` | Delete a net worth entry |
| `GET` | `/networth/time` | Get all net worth snapshots |
| `POST` | `/networth/time` | Create a net worth snapshot |

### `/business`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/business` | Get all businesses |
| `POST` | `/business` | Create a business |
| `PUT` | `/business` | Update a business |
| `DELETE` | `/business/:id` | Delete a business |
| `GET` | `/business/time` | Get all business snapshots |
| `POST` | `/business/time` | Create a business snapshot |

### `/investment`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/investment/time` | Get all investment snapshots |
| `POST` | `/investment/time` | Create an investment snapshot |

### `/trading`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/trading/time` | Get all trading snapshots |
| `POST` | `/trading/time` | Create a trading snapshot |

### `/goal`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/goal/ultimate` | Get all ultimate goals |
| `POST` | `/goal/ultimate` | Create an ultimate goal |
| `PUT` | `/goal/ultimate` | Update an ultimate goal |
| `PUT` | `/goal/ultimate/target` | Update an ultimate goal's target value |
| `DELETE` | `/goal/ultimate/:id` | Delete an ultimate goal |
| `GET` | `/goal/other` | Get all other goals |
| `POST` | `/goal/other` | Create an other goal |
| `DELETE` | `/goal/other/:id` | Delete an other goal |

### `/skill`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/skill` | Get all skills |
| `POST` | `/skill` | Create a skill |
| `DELETE` | `/skill/:id` | Delete a skill |
| `GET` | `/skill/type` | Get all skill types |
| `POST` | `/skill/type` | Create a skill type |
| `PUT` | `/skill/type` | Update a skill type |
| `DELETE` | `/skill/type/:id` | Delete a skill type |

### `/settings`

| Method | Path | Description |
|--------|------|-------------|
| `DELETE` | `/settings/reset` | Reset all data (clears every table) |
| `GET` | `/settings/backup` | Export all data as JSON |
| `POST` | `/settings/restore` | Restore data from a backup JSON |

---

## Database Schema (SQLite)

| Table | Key Columns |
|-------|-------------|
| `networth` | `id`, `name`, `value`, `base_value`, `goal_ultimate_id`, `type` |
| `networth_time` | `id`, `total_networth`, `monthly_income`, `investment_profit`, `monthly_profit`, `date` |
| `business` | `id`, `name`, `revenue`, `capital`, `status` |
| `business_time` | `id`, `business_profit`, `total_revenue`, `total_capital`, `profit_percentage`, `date` |
| `investment_time` | `id`, `investment_profit`, `total`, `capital`, `profit_percentage`, `date` |
| `trading_time` | `id`, `total`, `profit_percentage`, `total_profit`, `prev_profit`, `avg_profit`, `avg_profit_percent`, `date` |
| `goal_ultimate` | `id`, `name`, `target_value`, `current_value`, `image_source`, `status` |
| `goal_other` | `id`, `name`, `complete_status` |
| `asset` | `id`, `name`, `value`, `type`, `status` |
| `skill_type` | `id`, `name` |
| `skill` | `id`, `name`, `complete_status`, `skill_type_id` (FK → `skill_type`) |

---

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Front-End** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Radix UI, Recharts, Lucide Icons |
| **Desktop** | Electron 29, electron-builder (NSIS installer) |
| **Back-End** | Node.js, Express 4 |
| **Database** | SQLite via better-sqlite3 (WAL mode) |
| **Dev Tools** | nodemon, ESLint, Prettier |

---

## Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm**

### Installation

```bash
# Install back-end dependencies
npm install

# Install front-end dependencies
cd ui
npm install
```

### Development

```bash
# Start the API server (from project root)
npm start

# Start the Electron + Vite dev server (from ui/)
cd ui
npm run dev
```

### Build Installer (Windows)

```bash
cd ui
npm run build:installer
```

The installer will be output to `ui/installer/`.

---

## Author

**Fortune04**