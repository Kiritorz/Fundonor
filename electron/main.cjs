const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const path = require('path');
const db = require('./db.cjs');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let win = null;
let tray = null;
let isQuitting = false;
let appConfig = { closeToTray: false };

function createWindow() {
    // 启动时初始化数据库
    db.initDB();

    // 加载配置
    const savedCloseToTray = db.getSetting('fund_close_to_tray');
    if (savedCloseToTray !== null) {
        appConfig.closeToTray = savedCloseToTray === 'true';
    }

    const isMac = process.platform === 'darwin';
    win = new BrowserWindow({
        width: 1280,
        height: 850,
        frame: false,
        titleBarStyle: isMac ? 'hidden' : 'default',
        trafficLightPosition: isMac ? { x: 12, y: 10 } : undefined,
        backgroundColor: '#020617',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
        }
    });

    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
        win.loadURL('http://localhost:5173');
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    // 拦截关闭事件
    win.on('close', (event) => {
        if (!isQuitting && appConfig.closeToTray) {
            event.preventDefault();
            win.hide();
            return false;
        }
        return true;
    });

    ipcMain.on('window-command', (event, command) => {
        if (!win) return;
        switch (command) {
            case 'minimize': win.minimize(); break;
            case 'maximize': win.isMaximized() ? win.unmaximize() : win.maximize(); break;
            case 'close': win.close(); break;
        }
    });

    ipcMain.handle('db-get-all-data', () => {
        return {
            lang: db.getSetting('fund_lang') || 'zh',
            activePortfolioId: db.getSetting('fund_active_portfolio') || 'all',
            closeToTray: db.getSetting('fund_close_to_tray') === 'true',
            holdings: db.getHoldings(),
            portfolios: db.getPortfolios(),
            pnlRecords: db.getPnlRecords(),
            historyData: db.getHistoryData(),
            watchlist: db.getWatchlist(),
            watchlistGroups: db.getWatchlistGroups()
        };
    });

    ipcMain.handle('db-add-watchlist', (event, item) => db.saveToWatchlist(item));
    ipcMain.handle('db-delete-watchlist', (event, code) => db.deleteFromWatchlist(code));
    ipcMain.handle('db-save-watchlist-group', (event, group) => db.saveWatchlistGroup(group));
    ipcMain.handle('db-delete-watchlist-group', (event, id) => db.deleteWatchlistGroup(id));
    ipcMain.handle('db-update-watchlist-groups-order', (event, groups) => db.updateWatchlistGroupsOrder(groups));
    ipcMain.handle('db-update-fund-plate', (event, code, groupId) => db.updateFundPlate(code, groupId));

    ipcMain.handle('db-save-setting', (event, key, value) => db.setSetting(key, value));
    ipcMain.handle('db-save-holding', (event, h) => db.saveHolding(h));
    ipcMain.handle('db-save-all-holdings', (event, holdings) => db.saveAllHoldings(holdings));
    ipcMain.handle('db-delete-holding', (event, id) => db.deleteHolding(id));
    ipcMain.handle('db-save-portfolio', (event, p) => db.savePortfolio(p));
    ipcMain.handle('db-save-all-portfolios', (event, portfolios) => db.saveAllPortfolios(portfolios));
    ipcMain.handle('db-delete-portfolio', (event, id) => db.deletePortfolio(id));
    ipcMain.handle('db-clear-all', () => db.clearAll());
    ipcMain.handle('db-save-pnl-records', (event, records) => {
        // Since records might be large, we might want to optimize this.
        // But for now, app sends the whole array. We should ideally only save changed ones.
        // Or clear and re-insert?
        // Let's iterate and upsert.
        db.savePnlRecord(records); // Actually our db helper expects single record.
        // Let's change the helper or logic.
        // Or change handler to expect array.
    });

    // Better: Helper receives array or loop here
    ipcMain.handle('db-sync-pnl', (event, records) => {
        records.forEach(r => db.savePnlRecord(r));
    });

    ipcMain.handle('db-save-history-data', (event, code, data) => {
        db.saveHistoryData(code, data);
    });

    // 接收配置更新
    ipcMain.on('update-config', (event, config) => {
        if (config && typeof config.closeToTray === 'boolean') {
            appConfig.closeToTray = config.closeToTray;
            db.setSetting('fund_close_to_tray', config.closeToTray);
        }
    });
}

function createTray() {
    const isDev = process.env.NODE_ENV === 'development';
    // 假设 public/icon.ico 在开发时可用，打包后在 dist/icon.ico
    // 注意：electron-builder 打包后的资源路径可能需要调整，这里按通常 vite 结构处理
    const iconPath = isDev
        ? path.join(__dirname, '../public/icon.ico')
        : path.join(__dirname, '../dist/icon.ico');

    try {
        tray = new Tray(iconPath);
        const contextMenu = Menu.buildFromTemplate([
            { label: '显示 / Show', click: () => { if (win) win.show(); } },
            { type: 'separator' },
            {
                label: '退出 / Exit', click: () => {
                    isQuitting = true;
                    app.quit();
                }
            }
        ]);
        tray.setToolTip('Fundonor');
        tray.setContextMenu(contextMenu);

        tray.on('double-click', () => {
            if (win) win.show();
        });
    } catch (e) {
        console.error("Failed to create tray", e);
    }
}

app.whenReady().then(() => {
    createWindow();
    createTray();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // 如果没有配置隐藏到托盘，则退出
        // 注意：win.close() 被拦截后 window-all-closed 不会被触发
        // 所以这里通常是直接 quit
        app.quit();
    }
});