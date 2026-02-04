const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

let db;

function initDB() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'fundonor.db');

    // console.log("Database path:", dbPath);

    db = new Database(dbPath);

    // Enable WAL mode for better performance
    db.pragma('journal_mode = WAL');

    // Create tables
    db.prepare(`
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY, 
            value TEXT
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS portfolios (
            id TEXT PRIMARY KEY,
            name TEXT
        )
    `).run();

    // Holdings: Store complex objects. 
    // To simplify migration and flexibility, we can store JSON for optional fields like 'plan',
    // but keep queryable fields as columns if needed.
    // For now, mirroring the JS object structure.
    db.prepare(`
        CREATE TABLE IF NOT EXISTS holdings (
            id TEXT PRIMARY KEY,
            code TEXT,
            name TEXT,
            investment REAL,
            shares REAL,
            portfolioId TEXT,
            createdAt INTEGER,
            plan TEXT,        -- JSON string
            calcToday INTEGER, -- 1 or 0
            other_data TEXT   -- JSON string for any extra fields
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS pnl_records (
            date TEXT PRIMARY KEY,
            pnl REAL
        )
    `).run();

    // History data cache: Keyed by fund code
    db.prepare(`
        CREATE TABLE IF NOT EXISTS history_data (
            code TEXT PRIMARY KEY,
            json_data TEXT
        )
    `).run();

    // Watchlist
    db.prepare(`
        CREATE TABLE IF NOT EXISTS watchlist (
            code TEXT PRIMARY KEY,
            name TEXT,
            addedAt INTEGER
        )
    `).run();

    // Watchlist Groups (Plates)
    db.prepare(`
        CREATE TABLE IF NOT EXISTS watchlist_groups (
            id TEXT PRIMARY KEY,
            name TEXT,
            sortOrder INTEGER DEFAULT 0
        )
    `).run();

    // Add sortOrder to watchlist_groups if not exists
    const groupColumns = db.prepare('PRAGMA table_info(watchlist_groups)').all();
    if (!groupColumns.find(c => c.name === 'sortOrder')) {
        db.prepare('ALTER TABLE watchlist_groups ADD COLUMN sortOrder INTEGER DEFAULT 0').run();
    }

    // Add groupId to watchlist if not exists
    const watchlistColumns = db.prepare('PRAGMA table_info(watchlist)').all();
    if (!watchlistColumns.find(c => c.name === 'groupId')) {
        db.prepare('ALTER TABLE watchlist ADD COLUMN groupId TEXT').run();
    }
}

// --- Helpers ---

// Settings
const getSetting = (key) => {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
    return row ? row.value : null;
};
const setSetting = (key, value) => {
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, String(value));
};

// Portfolios
const getPortfolios = () => db.prepare('SELECT * FROM portfolios').all();
const savePortfolio = (p) => db.prepare('INSERT OR REPLACE INTO portfolios (id, name) VALUES (@id, @name)').run(p);
const deletePortfolio = (id) => db.prepare('DELETE FROM portfolios WHERE id = ?').run(id);

// Holdings
const getHoldings = () => {
    const rows = db.prepare('SELECT * FROM holdings').all();
    return rows.map(r => ({
        id: r.id,
        code: r.code,
        name: r.name,
        investment: r.investment,
        shares: r.shares,
        portfolioId: r.portfolioId,
        createdAt: r.createdAt,
        plan: JSON.parse(r.plan || '{}'),
        calcToday: r.calcToday === 1,
        ...JSON.parse(r.other_data || '{}')
    }));
};
const saveHolding = (h) => {
    // Extract known fields, put rest in other_data
    const { id, code, name, investment, shares, portfolioId, createdAt, plan, calcToday, ...rest } = h;
    db.prepare(`
        INSERT OR REPLACE INTO holdings (id, code, name, investment, shares, portfolioId, createdAt, plan, calcToday, other_data)
        VALUES (@id, @code, @name, @investment, @shares, @portfolioId, @createdAt, @plan, @calcToday, @other_data)
    `).run({
        id, code, name, investment, shares, portfolioId, createdAt,
        plan: JSON.stringify(plan),
        calcToday: calcToday ? 1 : 0,
        other_data: JSON.stringify(rest)
    });
};
const deleteHolding = (id) => db.prepare('DELETE FROM holdings WHERE id = ?').run(id);

// PnL Records
const getPnlRecords = () => db.prepare('SELECT * FROM pnl_records').all();
const savePnlRecord = (r) => db.prepare('INSERT OR REPLACE INTO pnl_records (date, pnl) VALUES (@date, @pnl)').run(r);

// History Data
const getHistoryData = () => {
    const rows = db.prepare('SELECT * FROM history_data').all();
    const result = {};
    rows.forEach(r => {
        result[r.code] = JSON.parse(r.json_data || '{}');
    });
    return result;
};
const saveHistoryData = (code, data) => {
    db.prepare('INSERT OR REPLACE INTO history_data (code, json_data) VALUES (?, ?)').run(code, JSON.stringify(data));
};

// Watchlist
const getWatchlist = () => db.prepare('SELECT * FROM watchlist ORDER BY addedAt DESC').all();
const saveToWatchlist = (item) => {
    const existing = db.prepare('SELECT groupId FROM watchlist WHERE code = ?').get(item.code);
    const groupId = item.groupId !== undefined ? item.groupId : (existing ? existing.groupId : null);

    db.prepare('INSERT OR REPLACE INTO watchlist (code, name, addedAt, groupId) VALUES (@code, @name, @addedAt, @groupId)').run({
        ...item,
        groupId
    });
};
const deleteFromWatchlist = (code) => db.prepare('DELETE FROM watchlist WHERE code = ?').run(code);

// Watchlist Groups
const getWatchlistGroups = () => db.prepare('SELECT * FROM watchlist_groups ORDER BY sortOrder ASC').all();
const saveWatchlistGroup = (g) => {
    // If new, put at end
    if (g.sortOrder === undefined) {
        const last = db.prepare('SELECT MAX(sortOrder) as maxOrder FROM watchlist_groups').get();
        g.sortOrder = (last.maxOrder !== null ? last.maxOrder : -1) + 1;
    }
    db.prepare('INSERT OR REPLACE INTO watchlist_groups (id, name, sortOrder) VALUES (@id, @name, @sortOrder)').run(g);
};
const deleteWatchlistGroup = (id) => {
    const transaction = db.transaction(() => {
        db.prepare('DELETE FROM watchlist_groups WHERE id = ?').run(id);
        db.prepare('UPDATE watchlist SET groupId = NULL WHERE groupId = ?').run(id);
    });
    transaction();
};
const updateWatchlistGroupsOrder = (groups) => {
    const transaction = db.transaction((items) => {
        const stmt = db.prepare('UPDATE watchlist_groups SET sortOrder = @sortOrder WHERE id = @id');
        items.forEach((g, index) => {
            stmt.run({ id: g.id, sortOrder: index });
        });
    });
    transaction(groups);
};
const updateFundPlate = (code, groupId) => db.prepare('UPDATE watchlist SET groupId = ? WHERE code = ?').run(groupId, code);


const saveAllHoldings = (holdings) => {
    const insert = db.prepare(`
        INSERT INTO holdings (id, code, name, investment, shares, portfolioId, createdAt, plan, calcToday, other_data)
        VALUES (@id, @code, @name, @investment, @shares, @portfolioId, @createdAt, @plan, @calcToday, @other_data)
    `);
    const deleteAll = db.prepare('DELETE FROM holdings');

    const transaction = db.transaction((items) => {
        deleteAll.run();
        for (const h of items) {
            const { id, code, name, investment, shares, portfolioId, createdAt, plan, calcToday, ...rest } = h;
            insert.run({
                id, code, name, investment, shares, portfolioId, createdAt,
                plan: JSON.stringify(plan || {}),
                calcToday: calcToday ? 1 : 0,
                other_data: JSON.stringify(rest)
            });
        }
    });

    transaction(holdings);
};

const saveAllPortfolios = (portfolios) => {
    const insert = db.prepare('INSERT INTO portfolios (id, name) VALUES (@id, @name)');
    const deleteAll = db.prepare('DELETE FROM portfolios');

    const transaction = db.transaction((items) => {
        deleteAll.run();
        for (const p of items) {
            insert.run(p);
        }
    });

    transaction(portfolios);
};

const clearAll = () => {
    const tables = ['settings', 'portfolios', 'holdings', 'pnl_records', 'history_data', 'watchlist'];
    const transaction = db.transaction(() => {
        tables.forEach(t => db.prepare(`DELETE FROM ${t}`).run());
    });
    transaction();
};

module.exports = {
    initDB,
    getSetting, setSetting,
    getPortfolios, savePortfolio, deletePortfolio, saveAllPortfolios,
    getHoldings, saveHolding, deleteHolding, saveAllHoldings,
    getPnlRecords, savePnlRecord, clearAll,
    getHistoryData, saveHistoryData,
    getWatchlist, saveToWatchlist, deleteFromWatchlist,
    getWatchlistGroups, saveWatchlistGroup, deleteWatchlistGroup, updateFundPlate, updateWatchlistGroupsOrder
};
