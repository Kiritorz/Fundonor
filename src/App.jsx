import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Activity, Wallet, Plus, Trash2, Clock,
  X, Save, RefreshCw, Minus, Square, Maximize2,
  ChevronLeft, ChevronRight, BarChart3, TrendingUp, TrendingDown, ShieldAlert,
  Search, Settings, Calendar, Coins, Globe,
  CheckCircle, AlertCircle, LayoutGrid, FolderOpen,
  AudioLines, LineChart as LucideLineChart, History, PieChart, Layers, ArrowUpRight, ArrowDownRight,
  Languages, Edit3, Repeat, PencilLine, Check, ChevronUp, ChevronDown, HelpCircle, ToggleLeft, ToggleRight, Eye, Star
} from 'lucide-react';

import logoIcon from './assets/icon-outline.png';

// --- 多语言配置 ---
const LANGUAGES = {
  zh: {
    portfolio: '我的持仓',
    watchlist: '自选基金', // [Change]
    settings: '偏好设置',
    totalValue: '总资产',
    principal: '持有本金',
    todayPnl: '当日盈亏',
    latestPnl: '最新盈亏',
    totalYield: '持有收益',
    day: '日',
    month: '月',
    year: '年',
    addAsset: '添加基金',
    addFund: '添加基金',
    portfolioDetails: '持仓明细',
    estimate: '当日涨幅',
    realtime: '实时估值',
    settled: '已结算',
    costPrice: '累计投入',
    costNav: '成本净值',
    currentPrice: '当前净值',
    holdingAmt: '持有金额',
    holdingShares: '持有份额',
    holdingReturn: '持有收益',
    holdingRate: '持有收益率',
    todayProfit: '当日收益',
    holdingDays: '持有天数',
    editHoldings: '修改持仓',
    investPlan: '定投计划',
    delete: '删除',
    fundCode: '基金代码',
    buyAmount: '买入金额',
    searchPlaceholder: '输入代码',
    confirmImport: '确认导入',
    searching: '查询中...',
    notFound: '未找到',
    language: '界面语言',
    dataSource: '数据来源: 天天基金 · 实时估算仅供参考',
    noData: '暂无数据',
    createPortfolio: '新建持仓',
    renamePortfolio: '重命名持仓',
    create: '创建',
    update: '更新',
    cancel: '取消',
    confirm: '确认',
    general: '总览',
    autoPlan: '自动定投计划',
    daily: '每日',
    weekly: '每周',
    save: '保存设置',
    intraday: '分时走势',
    perfHistory: '历史业绩 (近10日)',
    navDate: '净值日期',
    defaultPortfolio: '默认',
    shareCalcNote: '根据当前净值自动计算份额',
    manageAccounts: '管理账户',
    exitManage: '退出管理',
    placeholderPortfolio: '持仓名称',
    clearCache: '清除所有数据',
    cacheNote: '这将重置所有持仓、账户和盈亏记录',
    langSettings: '界面语言',
    confirmDeleteTitle: '确认删除',
    confirmDeleteMsg: '此操作无法撤销，确定要删除吗？',
    confirmClearTitle: '清除数据',
    confirmClearMsg: '这将清除所有本地缓存数据，确定继续吗？',
    successAdd: '添加成功',
    weekDays: ['一', '二', '三', '四', '五'],
    returnPlaceholder: '0', // [Modified] Simplified placeholder
    calcTodayProfit: '计算当日收益',
    calcTodayProfitNote: '今日新买入建议关闭',
    closeToTray: '关闭时隐藏到托盘',
    closeToTrayNote: '保持后台运行以实时获取数据',
  },
  en: {
    portfolio: 'Portfolio',
    watchlist: 'Watchlist', // [Change]
    settings: 'Preferences',
    totalValue: 'Total Value',
    principal: 'Principal',
    todayPnl: "Today's P/L",
    latestPnl: "Latest P/L",
    totalYield: 'Total Return',
    day: 'Day',
    month: 'Month',
    year: 'Year',
    addAsset: 'Add Asset',
    addFund: 'Add Fund',
    portfolioDetails: 'Details',
    estimate: 'Today Est. Change',
    realtime: 'Realtime',
    settled: 'Settled',
    costPrice: 'Total Invested',
    costNav: 'Avg Cost',
    currentPrice: 'Current NAV',
    holdingAmt: 'Value',
    holdingShares: 'Shares',
    holdingReturn: 'Return',
    holdingRate: 'Return %',
    todayProfit: "Today's P/L",
    holdingDays: 'Days',
    editHoldings: 'Edit Holdings',
    investPlan: 'Invest Plan',
    delete: 'Delete',
    fundCode: 'Fund Code',
    buyAmount: 'Investment',
    searchPlaceholder: 'Enter Code',
    confirmImport: 'Import',
    searching: 'Searching...',
    notFound: 'Not Found',
    language: 'Language',
    dataSource: 'Source: TianTian Fund',
    noData: 'No Data',
    createPortfolio: 'New Holding',
    renamePortfolio: 'Rename Holding',
    create: 'Create',
    update: 'Update',
    cancel: 'Cancel',
    confirm: 'Confirm',
    general: 'All',
    autoPlan: 'Auto-Invest Plan',
    daily: 'Daily',
    weekly: 'Weekly',
    save: 'Save',
    intraday: 'Intraday Trend',
    perfHistory: 'History (Last 10 Days)',
    navDate: 'NAV Date',
    defaultPortfolio: 'Default',
    shareCalcNote: 'Auto-calculate shares based on NAV',
    manageAccounts: 'Manage Accounts',
    exitManage: 'Done',
    placeholderPortfolio: 'Portfolio Name',
    clearCache: 'Clear All Data',
    cacheNote: 'This will reset all data',
    langSettings: 'Language',
    confirmDeleteTitle: 'Confirm Delete',
    confirmDeleteMsg: 'This action cannot be undone. Are you sure?',
    confirmClearTitle: 'Clear Data',
    confirmClearMsg: 'This will wipe all local data. Continue?',
    successAdd: 'Added Successfully',
    weekDays: ['M', 'T', 'W', 'T', 'F'],
    returnPlaceholder: '0', // [Modified] Simplified placeholder
    calcTodayProfit: "Calc Today's P/L",
    calcTodayProfitNote: 'Turn off for new buy-ins',
    closeToTray: 'Minimize to Tray',
    closeToTrayNote: 'Keep running in background',
  }
};

// --- 全局样式 ---
const GlobalStyles = () => (
  <style>{`
    ::-webkit-scrollbar { display: none; }
    body { 
      -ms-overflow-style: none; 
      scrollbar-width: none; 
      background-color: #000000; 
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    }
    .drag-region { -webkit-app-region: drag; }
    .no-drag { -webkit-app-region: no-drag; }
    
    @keyframes modal-scale {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slide-down {
      from { opacity: 0; transform: translateY(-15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-modal-scale { animation: modal-scale 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
    .animate-slide-down { animation: slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    
    .font-money { font-feature-settings: "tnum"; letter-spacing: -0.02em; }
    .no-scrollbar::-webkit-scrollbar { display: none; }

    /* Tab 切换过渡动画 */
    .tab-content-enter {
      animation: fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    /* 紧凑化调整 */
    .compact-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.75rem; }
    
    /* 数字滚动动画 */
    @keyframes number-roll-up {
      0% { transform: translateY(0); opacity: 1; }
      100% { transform: translateY(-20px); opacity: 0; filter: blur(4px); }
    }
    @keyframes number-roll-down {
      0% { transform: translateY(20px); opacity: 0; filter: blur(4px); }
      100% { transform: translateY(0); opacity: 1; filter: blur(0); }
    }
    @keyframes number-roll-down-negative {
      0% { transform: translateY(0); opacity: 1; }
      100% { transform: translateY(20px); opacity: 0; filter: blur(4px); }
    }
    @keyframes number-roll-up-negative {
      0% { transform: translateY(-20px); opacity: 0; filter: blur(4px); }
      100% { transform: translateY(0); opacity: 1; filter: blur(0); }
    }
    
    .number-rolling-up { animation: number-roll-up 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .number-rolling-down { animation: number-roll-down 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .number-rolling-down-neg { animation: number-roll-down-negative 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .number-rolling-up-neg { animation: number-roll-up-negative 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  `}</style>
);

// --- 单字符滚动组件 ---
const RollingDigit = ({ char }) => {
  const [displayChar, setDisplayChar] = useState(char);
  const [animClass, setAnimClass] = useState('');
  const prevCharRef = React.useRef(char);
  const isAnimatingRef = React.useRef(false);

  useEffect(() => {
    // 如果字符没变，什么都不做
    if (char === prevCharRef.current) return;

    const prev = prevCharRef.current;

    // 简单的方向逻辑：如果是数字且变大，向上滚；否则向下滚 (或者统一一种效果)
    // 这里使用：
    // 新值 > 旧值 => 向上滚 (Old Up, New enter from Down)
    // 新值 < 旧值 => 向下滚 (Old Down, New enter from Up)
    // 非数字 => 默认向上滚
    let isUp = true;
    if (!isNaN(parseInt(char)) && !isNaN(parseInt(prev))) {
      isUp = parseInt(char) > parseInt(prev);
    } else {
      // 特殊字符变化，或者 9->0 (进位) 视为向上
      if (prev === '9' && char === '0') isUp = true;
      else if (prev === '0' && char === '9') isUp = false;
    }

    // 1. 退出动画
    setAnimClass(isUp ? 'number-rolling-up' : 'number-rolling-down-negative');
    isAnimatingRef.current = true;

    // 2. 切换值并进入动画
    const timeout1 = setTimeout(() => {
      setDisplayChar(char);
      setAnimClass(isUp ? 'number-rolling-down' : 'number-rolling-up-negative');

      // 3. 动画结束清理
      const timeout2 = setTimeout(() => {
        setAnimClass('');
        isAnimatingRef.current = false;
      }, 300);
      return () => clearTimeout(timeout2);
    }, 300);

    prevCharRef.current = char;
    return () => clearTimeout(timeout1);
  }, [char]);

  return <span className={`inline-block ${animClass}`}>{displayChar}</span>;
}

// --- 数字滚动动画组件 (按位独立) ---
const AnimatedNumber = ({ value, className = '', formatFn = (v) => v }) => {
  // 获取格式化后的字符串
  const formatted = formatFn(value).toString();
  const chars = formatted.split('');

  return (
    // 使用 tabular-nums 确保数字等宽，防止抖动; inline-flex 保持行内布局
    <span className={`inline-flex font-money ${className}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {chars.map((c, i) => (
        // 使用 index 作为 key，让相同位置的字符进行对比
        // 这样 5000 -> 5010，只有 index=2 的 '0'->'1' 会触发 RollingDigit 的 useEffect
        <RollingDigit key={i} char={c} />
      ))}
    </span>
  );
};

const COLORS = {
  up: 'text-rose-500',
  down: 'text-emerald-500',
  strokeUp: '#f43f5e',
  strokeDown: '#10b981',
  axis: '#475569'
};

const formatMoney = (num) => {
  const formatted = new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(num || 0);
  return formatted.replace(/\s/g, '');
};

const formatPercent = (num) => {
  const n = parseFloat(num) || 0;
  return (n >= 0 ? `+${n.toFixed(2)}%` : `${n.toFixed(2)}%`);
};

const CardTexture = ({ isDown }) => (
  <div
    className="absolute inset-0 z-0 pointer-events-none opacity-10 mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 60 L15 45 L45 45 L60 30' stroke='white' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M0 30 L15 15 L45 15 L60 0' stroke='white' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
      backgroundSize: '40px 40px', // Smaller pattern
      transform: isDown ? 'scaleY(-1)' : 'none'
    }}
  ></div>
);

// --- 分时走势图组件 ---
const IntradayChart = ({ data, height = 300, loading = false }) => {
  const width = 800;
  const paddingL = 40; const paddingR = 40; const paddingT = 20; const paddingB = 20; // Expanded padding for labels
  const [hoverData, setHoverData] = useState(null);

  const chartPoints = useMemo(() => {
    const points = Array(241).fill(null);
    if (data) {
      Object.keys(data).forEach(idx => {
        const i = parseInt(idx);
        if (i >= 0 && i <= 240) points[i] = data[idx];
      });
    }
    return points;
  }, [data]);

  const validValues = chartPoints.filter(v => v !== null);
  const latestValue = validValues.length > 0 ? validValues[validValues.length - 1] : 0;
  // 2. 如果当前涨幅小于零，则曲线为绿色，否则是红色
  const isUpColor = latestValue >= 0;

  const realMax = validValues.length > 0 ? Math.max(...validValues) : 0;
  const realMin = validValues.length > 0 ? Math.min(...validValues) : 0;
  const absMax = Math.max(Math.abs(realMax), Math.abs(realMin), 0.15);
  const range = (absMax * 2.2) || 1;
  const bottom = -absMax * 1.1;

  const getX = (i) => (i / 240) * (width - paddingL - paddingR) + paddingL;
  const getY = (v) => height - ((v - bottom) / range) * (height - paddingT - paddingB) - paddingB;

  let pathD = "";
  let startX = null;
  let endX = null;
  chartPoints.forEach((val, i) => {
    if (val !== null) {
      const x = getX(i);
      const y = getY(val);
      if (startX === null) startX = x;
      endX = x;
      pathD += (pathD === "" ? `M ${x} ${y}` : ` L ${x} ${y}`);
    }
  });
  const zeroY = getY(0);

  // 3. 鼠标悬浮交互
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const chartAreaW = rect.width;
    const scale = width / chartAreaW; // SVG to DOM Ratio
    const svgX = x * scale;

    if (svgX < paddingL || svgX > width - paddingR) {
      setHoverData(null);
      return;
    }

    const dataW = width - paddingL - paddingR;
    const ratio = (svgX - paddingL) / dataW;
    let idx = Math.round(ratio * 240);
    if (idx < 0) idx = 0;
    if (idx > 240) idx = 240;

    const val = chartPoints[idx];
    if (val !== null) {
      setHoverData({ idx, val, x: getX(idx), y: getY(val) });
    } else {
      setHoverData(null);
    }
  };

  const getHoverTime = (idx) => {
    let mTotal = 0;
    if (idx <= 120) mTotal = 570 + idx; // 9:30 base
    else mTotal = 780 + (idx - 120); // 13:00 base
    const h = Math.floor(mTotal / 60);
    const m = mTotal % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="w-full overflow-hidden bg-white/[0.02] p-2 rounded-2xl border border-white/5 relative backdrop-blur-sm h-full cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverData(null)}
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible pointer-events-none">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isUpColor ? COLORS.strokeUp : COLORS.strokeDown} stopOpacity="0.2" />
            <stop offset="100%" stopColor={isUpColor ? COLORS.strokeUp : COLORS.strokeDown} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Axes */}
        <line x1={paddingL} y1={paddingT} x2={paddingL} y2={height - paddingB} stroke={COLORS.axis} strokeWidth="1" opacity="0.1" />
        <line x1={paddingL} y1={height - paddingB} x2={width - paddingR} y2={height - paddingB} stroke={COLORS.axis} strokeWidth="1" opacity="0.1" />
        <line x1={paddingL} y1={zeroY} x2={width - paddingR} y2={zeroY} stroke={COLORS.axis} strokeDasharray="3" opacity="0.3" strokeWidth="1" />

        {/* Scale Labels (Left) */}
        <text x={paddingL - 6} y={getY(absMax)} fill="#64748b" fontSize="10" textAnchor="end">+{absMax.toFixed(2)}%</text>
        <text x={paddingL - 6} y={zeroY + 3} fill="#64748b" fontSize="10" textAnchor="end">0.00%</text>
        <text x={paddingL - 6} y={getY(-absMax)} fill="#64748b" fontSize="10" textAnchor="end">-{absMax.toFixed(2)}%</text>

        {/* 4. Min/Max Lines & Labels (Right) */}
        {!loading && validValues.length > 0 && (
          <>
            {/* Max Line */}
            <line x1={paddingL} y1={getY(realMax)} x2={width - paddingR} y2={getY(realMax)}
              stroke={COLORS.strokeUp} strokeDasharray="2" opacity="0.4" strokeWidth="1" />
            <text x={width - paddingR + 6} y={getY(realMax) + 3} fill={COLORS.strokeUp} fontSize="10" textAnchor="start">{realMax >= 0 ? '+' : ''}{realMax.toFixed(2)}%</text>

            {/* Min Line */}
            <line x1={paddingL} y1={getY(realMin)} x2={width - paddingR} y2={getY(realMin)}
              stroke={COLORS.strokeDown} strokeDasharray="2" opacity="0.4" strokeWidth="1" />
            <text x={width - paddingR + 6} y={getY(realMin) + 3} fill={COLORS.strokeDown} fontSize="10" textAnchor="start">{realMin >= 0 ? '+' : ''}{realMin.toFixed(2)}%</text>
          </>
        )}

        {/* Chart Curve */}
        {pathD && !loading && (
          <>
            <path d={`${pathD} L ${endX} ${zeroY} L ${startX} ${zeroY} Z`} fill="url(#lineGrad)" />
            <path d={pathD} fill="none" stroke={isUpColor ? COLORS.strokeUp : COLORS.strokeDown} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {/* 3. Hover Tooltip */}
        {hoverData && (
          <g>
            <line x1={hoverData.x} y1={paddingT} x2={hoverData.x} y2={height - paddingB} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
            <circle cx={hoverData.x} cy={hoverData.y} r="4" fill={hoverData.val >= 0 ? COLORS.strokeUp : COLORS.strokeDown} stroke="#121212" strokeWidth="2" />
            <g transform={`translate(${hoverData.x < width * 0.7 ? hoverData.x + 12 : hoverData.x - 92}, ${paddingT + 10})`}>
              <rect width="80" height="42" rx="6" fill="#1e293b" stroke="rgba(255,255,255,0.1)" strokeWidth="1" className="shadow-2xl" />
              <text x="40" y="16" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="500">{getHoverTime(hoverData.idx)}</text>
              <text x="40" y="32" fill={hoverData.val >= 0 ? COLORS.strokeUp : COLORS.strokeDown} fontSize="13" fontWeight="bold" textAnchor="middle" className="font-money">
                {hoverData.val >= 0 ? '+' : ''}{hoverData.val.toFixed(2)}%
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

// --- 通用确认弹窗 ---
const ConfirmDialog = ({ isOpen, title, msg, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onCancel} />
      <div className="bg-[#121212] border border-white/10 w-full max-w-xs rounded-3xl shadow-2xl p-6 relative animate-modal-scale z-10 ring-1 ring-white/10">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-white/5 hover:bg-white/10 transition-colors">取消</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-900/20 transition-all">确认</button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // --- 状态定义 ---
  const [view, setView] = useState('portfolio');
  const [dataLoaded, setDataLoaded] = useState(false); // [New] New loading state

  const [lang, setLang] = useState('zh');
  const [closeToTray, setCloseToTray] = useState(false);
  const [activeFundId, setActiveFundId] = useState(null);

  // 记忆当前选中的持仓账户
  const [activePortfolioId, setActivePortfolioId] = useState('all');

  const [realtimeData, setRealtimeData] = useState({});
  const [historyData, setHistoryData] = useState({});
  const [portfolios, setPortfolios] = useState([{ id: 'default', name: '默认' }]);
  const [myHoldings, setMyHoldings] = useState([]);
  const [watchlist, setWatchlist] = useState([]); // [Change] Add Watchlist state
  const [watchlistGroups, setWatchlistGroups] = useState([]);
  const [activeWatchlistGroup, setActiveWatchlistGroup] = useState('all');
  const [isMac] = useState(() => {
    try {
      return window.require && window.require('os').platform() === 'darwin';
    } catch (e) {
      return false;
    }
  });
  const [watchlistSort, setWatchlistSort] = useState('default'); // default, asc, desc
  const [showWatchlistGroupModal, setShowWatchlistGroupModal] = useState(false);
  const [watchlistGroupAction, setWatchlistGroupAction] = useState({ type: 'create', id: null, name: '' });
  const [pnlRecords, setPnlRecords] = useState([]); // Add this for consistency

  // [New] Initial Data Load
  useEffect(() => {
    (async () => {
      try {
        if (window.require) {
          const { ipcRenderer } = window.require('electron');
          const data = await ipcRenderer.invoke('db-get-all-data');

          setLang(data.lang);
          setActivePortfolioId(data.activePortfolioId);
          setCloseToTray(data.closeToTray);
          setMyHoldings(data.holdings || []);
          if (data.portfolios && data.portfolios.length > 0) {
            setPortfolios(data.portfolios);
          }
          setPnlRecords(data.pnlRecords || []);
          setHistoryData(data.historyData || {});
          setWatchlist(data.watchlist || []); // [Change] Load watchlist
          setWatchlistGroups(data.watchlistGroups || []);
          setDataLoaded(true);
        }
      } catch (e) {
        console.error("DB Load failed", e);
        setDataLoaded(true);
      }
    })();
  }, []);

  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [addLoading, setAddLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMode, setEditMode] = useState('holdings'); // 'holdings' or 'plan'
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [portfolioAction, setPortfolioAction] = useState({ type: 'create', id: null });
  // [Modified] 增加 return 字段 和 calcToday 字段
  const [newFund, setNewFund] = useState({ code: '', investment: '', return: '', calcToday: true });
  const [editForm, setEditForm] = useState({ id: '', investment: '', planEnabled: false, planAmount: '', planFreq: 'daily', planDays: [] });
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [notification, setNotification] = useState(null);
  const [isManagingAccounts, setIsManagingAccounts] = useState(false);
  const [isSearchingFund, setIsSearchingFund] = useState(false);
  const [foundFundName, setFoundFundName] = useState(null);
  // 缓存完整的基金信息
  const [foundFundInfo, setFoundFundInfo] = useState(null);
  // 历史业绩数据
  const [historyPerfConfig, setHistoryPerfConfig] = useState({ code: null, data: [] });

  // 确认弹窗状态
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', msg: '', onConfirm: () => { } });

  // --- 派生状态 ---
  const t = useCallback((key) => LANGUAGES[lang][key] || key, [lang]);

  const currentViewHoldings = useMemo(() => {
    if (activePortfolioId === 'all') return myHoldings;
    return myHoldings.filter(h => h.portfolioId === activePortfolioId);
  }, [activePortfolioId, myHoldings]);

  // 修正收益统计逻辑
  const stats = useMemo(() => {
    let totalPrincipal = 0; let totalValue = 0; let todayPnL = 0;
    currentViewHoldings.forEach(h => {
      const live = realtimeData[h.code];
      const principal = parseFloat(h.investment) || 0;
      totalPrincipal += principal;
      if (live) {
        const shares = parseFloat(h.shares) || (principal / live.dwjz);
        const shouldCalcToday = h.calcToday !== false;

        // [Fix] 关键修正：如果不计算当日收益（即新买入），则强制使用昨日净值 (dwjz) 计算当前价值
        // 这样可以避免因今日估值 (gsz) 波动导致的总资产和持有收益的虚假波动
        const currentPrice = (live.isReal || !shouldCalcToday) ? live.dwjz : live.gsz;
        const currentVal = shares * currentPrice;

        if (shouldCalcToday) {
          todayPnL += currentVal * ((live.gszzl || 0) / (100 + (live.gszzl || 0)));
        }
        totalValue += currentVal;
      } else { totalValue += principal; }
    });
    // 当日盈亏率计算：当日盈亏 / 昨日收盘资产
    const yesterdayValue = totalValue - todayPnL;
    const totalYieldRate = yesterdayValue > 0 ? (todayPnL / yesterdayValue) * 100 : 0;
    return { totalValue, todayPnL, totalPrincipal, totalYieldRate };
  }, [currentViewHoldings, realtimeData]);

  // 计算数据更新日期
  const updateDateLabel = useMemo(() => {
    const times = Object.values(realtimeData)
      .map(d => d.gztime)
      .filter(t => t && typeof t === 'string' && t.trim().length > 0);

    if (times.length > 0) {
      // 取最新的时间作为显示
      times.sort();
      const last = times[times.length - 1]; // "2023-10-27 15:00"
      const parts = last.split(' ');
      if (parts.length >= 2) {
        const d = parts[0];
        const t = parts[1];
        const dateStr = d.substring(5);

        // 只要小时 >= 15 就显示已收盘
        const hour = parseInt(t.split(':')[0], 10);
        if (!isNaN(hour) && hour >= 15) {
          return `${dateStr} ${lang === 'en' ? 'Closed' : '已收盘'}`;
        }
        return dateStr;
      }
    }
    // 默认显示今天日期
    return new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  }, [realtimeData, lang]);

  const activeFund = useMemo(() =>
    activeFundId ? myHoldings.find(h => h.id === activeFundId) : null
    , [activeFundId, myHoldings]);

  // 当进入详情页时，获取历史业绩数据
  useEffect(() => {
    if (activeFund && activeFund.code !== historyPerfConfig.code) {
      const fetchHistory = async () => {
        try {
          // 使用天天基金 pingzhongdata 接口获取完整历史净值
          // 这是一个静态 JS 文件，包含 Data_netWorthTrend 变量
          const res = await fetch(`https://fund.eastmoney.com/pingzhongdata/${activeFund.code}.js?v=${Date.now()}`);
          const text = await res.text();

          // 提取 Data_netWorthTrend = [...] 数据
          // 格式: {x: 1698249600000, y: 0.8252, equityReturn: 1.05, unitMoney: ""}
          const match = text.match(/Data_netWorthTrend\s*=\s*(\[[\s\S]*?\]);/);

          if (match) {
            const list = JSON.parse(match[1]);
            // 取最后 10 条数据并倒序 (最新的在上面)
            const last10 = list.slice(-10).reverse();

            const formattedData = last10.map(item => {
              const date = new Date(item.x);
              const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
              return {
                FSRQ: dateStr,
                JZZZL: item.equityReturn // 涨跌幅字段
              };
            });

            setHistoryPerfConfig({ code: activeFund.code, data: formattedData });
          } else {
            setHistoryPerfConfig({ code: activeFund.code, data: [] });
          }
        } catch (e) {
          console.error('Failed to fetch history perf', e);
          setHistoryPerfConfig({ code: activeFund.code, data: [] });
        }
      };

      // 先清空避免显示旧数据
      setHistoryPerfConfig({ code: activeFund.code, data: [] });
      fetchHistory();
    }
  }, [activeFund, historyPerfConfig.code]);

  // --- Electron 窗口操作支持 ---
  const handleWindowCommand = (cmd) => {
    try {
      if (window.require) {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('window-command', cmd);
      }
    } catch (e) {
      console.warn('IPC Send failed:', e);
    }
  };

  // --- 录入预览监听 ---
  useEffect(() => {
    if (newFund.code.length === 6) {
      setIsSearchingFund(true);
      fetchFundData(newFund.code).then(info => {
        if (info) {
          setFoundFundName(info.name);
          setFoundFundInfo(info); // 缓存数据
        } else {
          setFoundFundName(false);
          setFoundFundInfo(null);
        }
        setIsSearchingFund(false);
      });
    } else {
      setFoundFundName(null);
      setFoundFundInfo(null);
    }
  }, [newFund.code]);

  // --- 全局键盘监听 (Esc 返回) ---
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (showAddModal || showEditModal || showPortfolioModal || confirmState.isOpen) {
          setShowAddModal(false); setShowEditModal(false); setShowPortfolioModal(false); setConfirmState(prev => ({ ...prev, isOpen: false }));
        } else if (activeFundId) {
          setActiveFundId(null);
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [activeFundId, showAddModal, showEditModal, showPortfolioModal, confirmState.isOpen]);

  // --- 数据获取方法 ---
  const fetchFundData = useCallback(async (code) => {
    const cleanCode = code.trim().padStart(6, '0');
    try {
      const res = await fetch(`https://fundgz.1234567.com.cn/js/${cleanCode}.js?rt=${Date.now()}`);
      const text = await res.text();
      const match = text.match(/jsonpgz\((.*)\)/);
      if (match) {
        const json = JSON.parse(match[1]);
        return { code: json.fundcode, name: json.name, dwjz: parseFloat(json.dwjz), gsz: parseFloat(json.gsz), gszzl: parseFloat(json.gszzl), gztime: json.gztime, isReal: json.jzrq === json.gztime?.split(' ')[0], jzrq: json.jzrq };
      }
    } catch (e) { }
    try {
      const res = await fetch(`https://fundmobapi.1234567.com.cn/FundMApi/FundVarietieValuationDetail.ashx?FCODE=${cleanCode}&deviceid=Wap&plat=Wap&product=EFund&version=6.0.0`);
      const json = await res.json();
      if (json && json.Datas) {
        const d = json.Datas;
        return { code: cleanCode, name: d.SHORTNAME, dwjz: parseFloat(d.DWJZ), gsz: parseFloat(d.GSZ), gszzl: parseFloat(d.GSZZL), gztime: d.GZTIME, isReal: d.JZRQ === d.GZTIME?.split(' ')[0], jzrq: d.JZRQ };
      }
    } catch (e) { }
    return null;
  }, []);

  const updateRealtime = useCallback(async () => {
    // [Change] Also update watchlist funds
    const allCodes = [...new Set([
      ...myHoldings.map(h => h.code),
      ...watchlist.map(w => w.code)
    ])];

    if (allCodes.length === 0) return;

    const results = await Promise.all(allCodes.map(c => fetchFundData(c)));

    // [Fix] 使用函数式更新避免依赖 realtimeData 导致的死循环
    setRealtimeData(prev => {
      // 简单的浅比较，如果数据没变就不更新 state，避免触发重渲染
      const hasChanges = results.some(r => {
        if (!r) return false;
        const prevR = prev[r.code];
        // 如果之前没有数据，或者 gztime/gszzl 变了，才认为有变化
        return !prevR || prevR.gztime !== r.gztime || prevR.gszzl !== r.gszzl;
      });

      if (!hasChanges) return prev;

      const newData = { ...prev };
      results.forEach(r => { if (r) newData[r.code] = r; });
      return newData;
    });

    try {
      setHistoryData(prevHistory => {
        const nextHistory = { ...prevHistory };
        let historyChanged = false;

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;

        results.forEach(r => {
          if (r && r.gztime) {
            // Ensure deep clone for modification
            if (!nextHistory[r.code]) nextHistory[r.code] = {};
            else nextHistory[r.code] = { ...nextHistory[r.code] };

            if (!nextHistory[r.code][today]) nextHistory[r.code][today] = {};
            else nextHistory[r.code][today] = { ...nextHistory[r.code][today] };

            const timeMatch = r.gztime.match(/(\d{2}):(\d{2})/);
            if (timeMatch) {
              const hour = parseInt(timeMatch[1]);
              const minute = parseInt(timeMatch[2]);
              let index = -1;

              if (hour === 9 && minute >= 30) index = minute - 30;
              else if (hour === 10) index = 30 + minute;
              else if (hour === 11 && minute <= 30) index = 90 + minute;
              else if (hour === 13) index = 120 + minute;
              else if (hour === 14) index = 180 + minute;
              else if (hour === 15 && minute === 0) index = 240;

              if (index >= 0 && index <= 240) {
                if (nextHistory[r.code][today][index] !== r.gszzl) {
                  nextHistory[r.code][today][index] = r.gszzl;
                  historyChanged = true;
                }
              }
            }
          }
        });

        if (historyChanged) {
          // Clean up old data (keep last 30 days)
          Object.keys(nextHistory).forEach(code => {
            // We need to re-read keys because we might have added new ones above
            // Actually iterating all keys in nextHistory is safe
            const dates = Object.keys(nextHistory[code]);
            if (dates.length > 30) {
              dates.sort();
              const newFundData = { ...nextHistory[code] };
              dates.slice(0, dates.length - 30).forEach(oldDate => delete newFundData[oldDate]);
              nextHistory[code] = newFundData;
            }
          });
          return nextHistory;
        }
        return prevHistory;
      });
    } catch (e) {
      console.error('Error updating history:', e);
    }

    setLastUpdated(new Date());
  }, [myHoldings, watchlist, fetchFundData]); // [Change] Add watchlist to dependency

  useEffect(() => {
    updateRealtime();
    const timer = setInterval(updateRealtime, 30000);
    return () => clearInterval(timer);
  }, [updateRealtime]);

  // --- 操作交互逻辑 ---
  const openEditModal = (fund, mode) => {
    if (!fund) return;
    setEditForm({
      id: fund.id,
      investment: fund.investment,
      planEnabled: fund.plan?.enabled || false,
      planAmount: fund.plan?.amount || '',
      planFreq: fund.plan?.freq || 'daily',
      planDays: fund.plan?.days || [] // 初始化选中的日期
    });
    setEditMode(mode);
    setShowEditModal(true);
  };

  const handleEditFund = () => {
    const updated = myHoldings.map(h => h.id === editForm.id ? {
      ...h,
      investment: parseFloat(editForm.investment),
      plan: {
        enabled: editForm.planEnabled,
        amount: parseFloat(editForm.planAmount),
        freq: editForm.planFreq,
        days: editForm.planDays
      }
    } : h);
    setMyHoldings(updated);
    setShowEditModal(false);
    setNotification({ msg: '保存成功', type: 'success' });
    setTimeout(() => setNotification(null), 2000);
  };

  const handlePortfolioAction = () => {
    if (!newPortfolioName.trim()) return;
    if (portfolioAction.type === 'create') {
      const newP = { id: crypto.randomUUID(), name: newPortfolioName };
      setPortfolios([...portfolios, newP]);
      setActivePortfolioId(newP.id);
    } else {
      setPortfolios(portfolios.map(p => p.id === portfolioAction.id ? { ...p, name: newPortfolioName } : p));
    }
    setNewPortfolioName('');
    setShowPortfolioModal(false);
  };

  const handleDeleteFund = (id) => {
    setConfirmState({
      isOpen: true,
      title: t('confirmDeleteTitle'),
      msg: t('confirmDeleteMsg'),
      onConfirm: () => {
        setMyHoldings(prev => prev.filter(h => h.id !== id));
        if (activeFundId === id) setActiveFundId(null);
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        setShowEditModal(false); // 确保详情编辑弹窗也关闭
      }
    });
  };

  const handleClearCache = () => {
    setConfirmState({
      isOpen: true,
      title: t('confirmClearTitle'),
      msg: t('confirmClearMsg'),
      onConfirm: async () => {
        if (window.require) {
          try {
            await window.require('electron').ipcRenderer.invoke('db-clear-all');
          } catch (e) { console.error(e); }
        }
        localStorage.clear();
        window.location.reload();
      }
    });
  };

  const handleDeletePortfolio = (pid) => {
    if (pid === 'default') return;
    setMyHoldings(myHoldings.map(h => h.portfolioId === pid ? { ...h, portfolioId: 'default' } : h));
    setPortfolios(portfolios.filter(p => p.id !== pid));
    if (activePortfolioId === pid) setActivePortfolioId('all');
  };

  const handleWatchlistGroupAction = async () => {
    if (!watchlistGroupAction.name.trim()) return;
    const { ipcRenderer } = window.require('electron');

    if (watchlistGroupAction.type === 'create') {
      const newGroup = { id: crypto.randomUUID(), name: watchlistGroupAction.name };
      await ipcRenderer.invoke('db-save-watchlist-group', newGroup);
      setWatchlistGroups([...watchlistGroups, newGroup]);
    } else {
      const group = { id: watchlistGroupAction.id, name: watchlistGroupAction.name };
      await ipcRenderer.invoke('db-save-watchlist-group', group);
      setWatchlistGroups(watchlistGroups.map(g => g.id === group.id ? group : g));
    }
    setShowWatchlistGroupModal(false);
  };

  const handleDeleteWatchlistGroup = async (id) => {
    const { ipcRenderer } = window.require('electron');
    await ipcRenderer.invoke('db-delete-watchlist-group', id);
    setWatchlistGroups(watchlistGroups.filter(g => g.id !== id));
    setWatchlist(watchlist.map(w => w.groupId === id ? { ...w, groupId: null } : w));
    if (activeWatchlistGroup === id) setActiveWatchlistGroup('all');
  };

  const handleUpdateFundPlate = async (code, groupId) => {
    const { ipcRenderer } = window.require('electron');
    await ipcRenderer.invoke('db-update-fund-plate', code, groupId);
    setWatchlist(watchlist.map(w => w.code === code ? { ...w, groupId } : w));
  };

  // --- Watchlist Group Drag & Drop ---
  const [draggedGroup, setDraggedGroup] = useState(null);
  const tabsContainerRef = React.useRef(null);

  const handleTabsWheel = (e) => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  const handleGroupDragStart = (e, group) => {
    setDraggedGroup(group);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'group', id: group.id }));
  };

  const handleGroupDrop = async (e, targetGroup) => {
    // Check if it's a group reorder
    if (draggedGroup) {
      e.preventDefault();
      e.stopPropagation();

      if (draggedGroup.id === targetGroup.id) {
        setDraggedGroup(null);
        return;
      }

      const newGroups = [...watchlistGroups];
      const fromIndex = newGroups.findIndex(g => g.id === draggedGroup.id);
      const toIndex = newGroups.findIndex(g => g.id === targetGroup.id);

      if (fromIndex !== -1 && toIndex !== -1) {
        newGroups.splice(fromIndex, 1);
        newGroups.splice(toIndex, 0, draggedGroup);
        // Optimistic update
        setWatchlistGroups(newGroups);

        try {
          if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('db-update-watchlist-groups-order', newGroups);
          }
        } catch (err) {
          console.error("Sort update failed", err);
        }
      }
      setDraggedGroup(null);
    }
  };


  // --- 数据持久化 ---
  useEffect(() => {
    if (!dataLoaded) return;
    if (window.require) {
      window.require('electron').ipcRenderer.invoke('db-save-all-holdings', myHoldings);
    }
  }, [myHoldings, dataLoaded]);

  useEffect(() => {
    if (!dataLoaded) return;
    if (window.require) {
      window.require('electron').ipcRenderer.invoke('db-save-all-portfolios', portfolios);
    }
  }, [portfolios, dataLoaded]);

  useEffect(() => {
    if (!dataLoaded) return;
    if (window.require) {
      window.require('electron').ipcRenderer.invoke('db-save-setting', 'fund_lang', lang);
    }
  }, [lang, dataLoaded]);

  useEffect(() => {
    if (!dataLoaded) return;
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.invoke('db-save-setting', 'fund_close_to_tray', closeToTray);
      ipcRenderer.send('update-config', { closeToTray });
    }
  }, [closeToTray, dataLoaded]);

  // 持久化 activePortfolioId
  useEffect(() => {
    if (!dataLoaded) return;
    if (window.require) {
      window.require('electron').ipcRenderer.invoke('db-save-setting', 'fund_active_portfolio', activePortfolioId);
    }
  }, [activePortfolioId, dataLoaded]);

  // Persist History Data
  useEffect(() => {
    if (!dataLoaded) return;
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      // Save each fund's history individually
      Object.entries(historyData).forEach(([code, data]) => {
        ipcRenderer.invoke('db-save-history-data', code, data);
      });
    }
  }, [historyData, dataLoaded]);

  const canAddFund = newFund.code.length === 6 && newFund.investment && !isSearchingFund && foundFundName !== false;

  // 判断是否为周末
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;

  return (
    <div className="min-h-screen bg-[#000000] text-slate-200 flex flex-col select-none overflow-hidden text-sm relative">
      <GlobalStyles />
      <ConfirmDialog {...confirmState} onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))} />

      {/* 消息提示 */}
      {notification && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[250] bg-slate-800/90 border border-white/10 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 animate-slide-down backdrop-blur-md">
          {notification.type === 'success' ? <CheckCircle size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-rose-500" />}
          <span className="text-xs font-bold">{notification.msg}</span>
        </div>
      )}

      {/* 顶栏 */}
      <div className={`h-9 bg-[#000000]/80 border-b border-white/10 flex items-center justify-between px-3 shrink-0 drag-region backdrop-blur-md z-50 ${isMac ? 'pl-20' : ''}`}>
        <div className="flex items-center gap-2">
          {/* [Modified] 使用本地图片 */}
          <img
            src={logoIcon}
            alt="Logo"
            className="w-6 h-6 object-contain"
          />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase">Fundonor</span>
          </div>
        </div>
        <div className="flex items-center gap-3 font-money no-drag">
          <div className="flex items-center gap-2 bg-white/5 px-2 py-0.5 rounded text-[9px] text-slate-400 font-bold border border-white/5">
            <Clock size={9} />
            {lastUpdated.toLocaleTimeString()}
          </div>
          {!isMac && (
            <div className="flex items-center gap-1 border-l border-white/10 pl-2">
              <button onClick={() => handleWindowCommand('minimize')} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"><Minus size={12} /></button>
              <button onClick={() => handleWindowCommand('maximize')} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"><Square size={10} /></button>
              <button onClick={() => handleWindowCommand('close')} className="p-1 hover:bg-rose-500 hover:text-white text-slate-400 rounded transition-colors"><X size={12} /></button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* 左侧导航栏 - 更紧凑 */}
        <nav className="w-12 bg-[#000000]/50 border-r border-white/10 flex flex-col py-4 items-center gap-4 shrink-0 backdrop-blur-sm z-20">
          <button onClick={() => { setView('portfolio'); setActiveFundId(null); }} className={`p-2.5 rounded-xl transition-all ${view === 'portfolio' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}><Wallet size={18} /></button>
          <button onClick={() => { setView('watchlist'); setActiveFundId(null); }} className={`p-2.5 rounded-xl transition-all ${view === 'watchlist' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}><Eye size={18} /></button>
          <button onClick={() => { setView('settings'); setActiveFundId(null); }} className={`p-2.5 rounded-xl mt-auto transition-all ${view === 'settings' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}><Settings size={18} /></button>
        </nav>

        <main className="flex-1 overflow-hidden relative">

          {/* --- 持仓主视图 (高度紧凑化) --- */}
          <div className={`absolute inset-0 p-4 overflow-y-auto no-scrollbar transition-all duration-300 ${view === 'portfolio' && !activeFundId ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <div className="max-w-full mx-auto space-y-4 tab-content-enter h-full flex flex-col">

              {/* 账户 Tab 栏 */}
              <div className="flex items-center justify-between h-9 shrink-0">
                <nav className="flex items-center bg-white/5 p-0.5 rounded-xl border border-white/5 overflow-x-auto no-scrollbar max-w-[80%] h-full">
                  <button
                    onClick={() => { setActivePortfolioId('all'); setIsManagingAccounts(false); }}
                    className={`px-4 h-full rounded-lg text-[11px] font-bold transition-all shrink-0 ${activePortfolioId === 'all' ? 'bg-white/10 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {t('general')}
                  </button>
                  {portfolios.map(p => (
                    <div key={p.id} className="flex items-center h-full shrink-0 transition-all duration-300">
                      <button
                        onClick={() => setActivePortfolioId(p.id)}
                        className={`px-4 h-full rounded-lg text-[11px] font-bold transition-all flex items-center gap-2 ${activePortfolioId === p.id ? 'bg-white/10 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {p.name}
                        {isManagingAccounts && p.id !== 'default' && (
                          <div className="flex gap-2 animate-fade-in border-l border-white/10 pl-2 ml-1">
                            <PencilLine size={12} className="hover:text-blue-400 transition-colors" onClick={(e) => { e.stopPropagation(); setPortfolioAction({ type: 'rename', id: p.id }); setNewPortfolioName(p.name); setShowPortfolioModal(true); }} />
                            <Trash2 size={12} className="hover:text-rose-500 transition-colors" onClick={(e) => { e.stopPropagation(); handleDeletePortfolio(p.id); }} />
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
                  <button onClick={() => { setPortfolioAction({ type: 'create' }); setNewPortfolioName(''); setShowPortfolioModal(true); }} className="px-3 h-full flex items-center text-slate-600 hover:text-white"><Plus size={14} /></button>
                </nav>
                <button
                  onClick={() => setIsManagingAccounts(!isManagingAccounts)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${isManagingAccounts ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-white/5 border-white/10 text-slate-500'}`}
                >
                  {isManagingAccounts ? t('exitManage') : t('manageAccounts')}
                </button>
              </div>

              {/* 核心资产卡片 - 极度压缩 & 固定最小高度 */}
              <div className={`rounded-3xl p-5 shadow-2xl relative overflow-hidden group ring-1 ring-white/10 transition-all duration-700 shrink-0 min-h-[140px] flex flex-col justify-center ${currentViewHoldings.length === 0 ? 'bg-gradient-to-br from-slate-800 to-slate-900' : stats.todayPnL >= 0 ? 'bg-gradient-to-br from-rose-600 to-red-950' : 'bg-gradient-to-br from-emerald-600 to-green-950'}`}>
                <CardTexture isDown={stats.todayPnL < 0} />
                <div className="relative z-10 font-money flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 opacity-70 mb-1">
                      {/* 显示数据更新日期 */}
                      <span className="text-[9px] font-black uppercase tracking-widest text-white">
                        {isWeekend ? t('latestPnl') : t('todayPnl')}
                        <span className="ml-1 opacity-60 font-mono">({updateDateLabel})</span>
                      </span>
                      {currentViewHoldings.length > 0 && (
                        <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-md border border-white/10 bg-black/20 text-white flex items-center gap-1`}>
                          {stats.todayPnL >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          <AnimatedNumber value={stats.totalYieldRate} formatFn={formatPercent} />
                        </div>
                      )}
                    </div>
                    <div className="text-4xl font-black text-white tracking-tight drop-shadow-xl">
                      <AnimatedNumber value={stats.todayPnL} formatFn={(v) => (v >= 0 ? '+' : '') + formatMoney(v)} />
                    </div>
                  </div>

                  <div className="flex gap-8 text-right">
                    <div>
                      <p className="text-[9px] font-black text-white/50 uppercase mb-0.5 tracking-widest">{t('totalValue')}</p>
                      <p className="text-xl font-black text-white">
                        <AnimatedNumber value={stats.totalValue} formatFn={formatMoney} />
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-white/50 uppercase mb-0.5 tracking-widest">{t('principal')}</p>
                      <p className="text-xl font-black text-white">{formatMoney(stats.totalPrincipal)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 持仓列表 - 紧凑列表模式 (单列网格布局) */}
              <div className="bg-white/[0.02] rounded-3xl border border-white/10 shadow-xl overflow-hidden backdrop-blur-md flex-1 flex flex-col min-h-0">
                <div className="px-5 py-3 border-b border-white/10 flex justify-between items-center bg-white/[0.02] shrink-0">
                  <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><BarChart3 size={12} /> {t('portfolioDetails')}</h2>
                  <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-lg transition-all font-bold text-[9px] uppercase tracking-widest"><Plus size={10} /> {t('addAsset')}</button>
                </div>
                <div className="overflow-y-auto flex-1 no-scrollbar p-1">
                  {/* 这是一个单列的列表，每一项都是一个Grid */}
                  <div className="flex flex-col gap-1">
                    {currentViewHoldings.length === 0 ? <div className="p-12 text-center text-slate-600 italic text-xs">{t('noData')}</div> :
                      currentViewHoldings.map((fund) => {
                        const live = realtimeData[fund.code];
                        const isUp = (live?.gszzl || 0) >= 0;
                        const actualShares = parseFloat(fund.shares) || (fund.investment / live.dwjz);

                        // [Fix] 列表中的数据也需要应用同样的逻辑
                        const shouldCalcToday = fund.calcToday !== false;
                        const currentPrice = (live?.isReal || !shouldCalcToday) ? live.dwjz : (live?.gsz || 1);

                        const currentVal = actualShares * currentPrice;
                        const totalPnl = currentVal - fund.investment;
                        const totalPnlRate = (totalPnl / fund.investment) * 100;

                        // [Modified] 单项收益计算逻辑
                        const todayProfit = shouldCalcToday ? currentVal * ((live?.gszzl || 0) / (100 + (live?.gszzl || 0))) : 0;

                        return (
                          <div key={fund.id} onClick={() => setActiveFundId(fund.id)} className="px-4 py-1.5 hover:bg-white/[0.04] rounded-xl transition-all cursor-pointer group font-money border border-transparent hover:border-white/5">
                            {/* 4列 Grid 布局: 名称/金额 | 涨幅 | 当日收益 | 总收益/率 */}
                            <div className="grid grid-cols-4 items-center gap-2">
                              {/* Col 1: Name & Amount */}
                              <div className="min-w-0 translate-y-0.5">
                                <div className="flex items-center gap-2">
                                  <h4 className="font text-xs text-slate-300 group-hover:text-white transition-colors truncate">{fund.name}</h4>
                                  {live?.isReal && <span className="text-[7px] bg-white/10 text-slate-300 px-1 py-px rounded uppercase font-bold border border-white/10">R</span>}
                                  {!shouldCalcToday && <span className="text-[7px] bg-white/10 text-slate-500 px-1 py-px rounded uppercase font-bold border border-white/10">T+1</span>}
                                </div>
                                <p className="text-[11px] text-slate-500 font-mono tracking-wider uppercase opacity-60">{formatMoney(currentVal)}</p>
                              </div>

                              {/* Col 2: Growth Rate */}
                              <div className="text-center">
                                <span className={`text-base font-black ${isUp ? COLORS.up : COLORS.down}`}>{formatPercent(live?.gszzl)}</span>
                                {/* 增加估算涨幅小字 */}
                                <p className="text-[10px] text-slate-600">{t('estimate')}</p>
                              </div>

                              {/* Col 3: Today Profit */}
                              <div className="text-center">
                                <p className={`text-base font-bold ${todayProfit >= 0 ? (shouldCalcToday ? COLORS.up : 'text-slate-500') : COLORS.down}`}>
                                  <AnimatedNumber
                                    value={todayProfit}
                                    formatFn={(v) => ((v > 0 && shouldCalcToday) ? '+' : '') + formatMoney(v)}
                                  />
                                </p>
                                <p className="text-[10px] text-slate-600">{t('todayProfit')}</p>
                              </div>

                              {/* Col 4: Total Return - 百分比和数额放在一起，注释单独放 */}
                              <div className="text-right">
                                <p className={`text-base font-bold ${totalPnl >= 0 ? COLORS.up : COLORS.down}`}>
                                  <AnimatedNumber value={totalPnl} formatFn={(v) => (v > 0 ? '+' : '') + formatMoney(v)} />
                                  <span className="text-[11px] ml-1.5">
                                    <AnimatedNumber value={totalPnlRate} formatFn={formatPercent} />
                                  </span>
                                </p>
                                <p className="text-[10px] text-slate-600">{t('totalYield')}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- 设置页 --- */}
          <div className={`absolute inset-0 p-6 overflow-y-auto no-scrollbar transition-all duration-300 ${view === 'settings' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <div className="max-w-2xl mx-auto space-y-8 tab-content-enter">
              <h1 className="text-2xl font-black text-white tracking-tight">{t('settings')}</h1>

              <section className="space-y-4">
                <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2"><Settings size={12} /> {t('settings')}</h3>

                {/* [New] 隐藏到托盘开关 */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{t('closeToTray')}</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">{t('closeToTrayNote')}</span>
                  </div>
                  <button onClick={() => setCloseToTray(!closeToTray)} className={`w-10 h-5 rounded-full transition-all relative ${closeToTray ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                    <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${closeToTray ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2"><Globe size={12} /> {t('langSettings')}</h3>
                <div className="flex gap-3">
                  <button onClick={() => setLang('zh')} className={`flex-1 p-4 rounded-xl border transition-all flex items-center justify-between ${lang === 'zh' ? 'bg-white/10 border-white/20 text-white font-bold' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                    <span className="text-xs">简体中文</span>
                    {lang === 'zh' && <CheckCircle size={14} />}
                  </button>
                  <button onClick={() => setLang('en')} className={`flex-1 p-4 rounded-xl border transition-all flex items-center justify-between ${lang === 'en' ? 'bg-white/10 border-white/20 text-white font-bold' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                    <span className="text-xs">English</span>
                    {lang === 'en' && <CheckCircle size={14} />}
                  </button>
                </div>
              </section>

              <section className="space-y-4 pt-6 border-t border-white/10">
                <h3 className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] flex items-center gap-2"><Trash2 size={12} /> Danger Zone</h3>
                <button
                  onClick={handleClearCache}
                  className="w-full p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl font-black text-xs hover:bg-rose-500 hover:text-white transition-all flex items-center justify-between group"
                >
                  <div className="text-left">
                    <p>{t('clearCache')}</p>
                    <p className="text-[9px] font-normal opacity-60 mt-0.5 uppercase tracking-widest">{t('cacheNote')}</p>
                  </div>
                  <ShieldAlert size={18} className="opacity-40 group-hover:opacity-100" />
                </button>
              </section>
            </div>
          </div>

          {/* --- 基金详情视图 (紧凑化) --- */}
          <div className={`absolute inset-0 bg-[#000000] p-4 overflow-y-auto no-scrollbar transition-all duration-500 z-[80] ${activeFund ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
            {activeFund && (
              <div className="max-w-6xl mx-auto space-y-4 tab-content-enter h-full flex flex-col">
                <div className="flex items-center gap-4 shrink-0">
                  <button onClick={() => setActiveFundId(null)} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-slate-400 hover:text-white"><ChevronLeft size={18} /></button>
                  <div className="flex-1">
                    <h1 className="text-xl font-black text-white flex items-center gap-3">{activeFund.name} <span className="text-[9px] font-mono px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-slate-500 uppercase">{activeFund.code}</span></h1>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(activeFund, 'holdings')} className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded-xl transition-all font-bold text-[10px] flex items-center gap-1.5"><Edit3 size={12} /> {t('editHoldings')}</button>
                    <button onClick={() => openEditModal(activeFund, 'plan')} className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded-xl transition-all font-bold text-[10px] flex items-center gap-1.5"><Repeat size={12} /> {t('investPlan')}</button>
                    <button onClick={() => handleDeleteFund(activeFund.id)} className="px-3 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all text-[10px] font-bold">{t('delete')}</button>
                  </div>
                </div>

                {/* 核心详情卡片 */}
                {(() => {
                  const live = realtimeData[activeFund.code];
                  const isUp = (live?.gszzl || 0) >= 0;
                  const currentPrice = live?.isReal ? live.dwjz : (live?.gsz || 1);
                  const actualShares = parseFloat(activeFund.shares) || (activeFund.investment / currentPrice);
                  const currentVal = actualShares * currentPrice;
                  const totalPnl = currentVal - activeFund.investment;
                  const costNav = activeFund.investment / actualShares;

                  // [Modified] 详情页收益计算逻辑
                  const shouldCalcToday = activeFund.calcToday !== false;
                  const todayProfit = shouldCalcToday ? currentVal * ((live?.gszzl || 0) / (100 + (live?.gszzl || 0))) : 0;

                  return (
                    <div className="bg-white/[0.02] rounded-3xl border border-white/10 shadow-2xl backdrop-blur-3xl overflow-hidden font-money shrink-0">
                      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                        <div className="flex items-center gap-4">
                          <span className={`text-4xl font-black tracking-tighter ${isUp ? COLORS.up : COLORS.down}`}>
                            <AnimatedNumber value={live?.gszzl || 0} formatFn={formatPercent} />
                          </span>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{t('estimate')}</span>
                            <span className="text-[10px] text-slate-600 font-mono">{live?.gztime}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-white">
                            <AnimatedNumber value={live?.gsz || 0} formatFn={(v) => v > 0 ? v.toFixed(4) : '--'} />
                          </div>
                          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{t('currentPrice')}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-white/5 border-b border-white/5">
                        {[
                          { label: t('holdingAmt'), value: currentVal, formatFn: formatMoney, cls: 'text-white' },
                          { label: t('holdingShares'), value: actualShares, formatFn: (v) => v.toLocaleString(undefined, { maximumFractionDigits: 2 }), cls: 'text-slate-300' },
                          { label: t('costPrice'), value: activeFund.investment, formatFn: formatMoney, cls: 'text-slate-400' },
                          { label: t('costNav'), value: costNav, formatFn: (v) => v.toFixed(4), cls: 'text-slate-400' },
                          { label: t('holdingReturn'), value: totalPnl, formatFn: (v) => (v >= 0 ? '+' : '') + formatMoney(v), cls: totalPnl >= 0 ? COLORS.up : COLORS.down },
                          { label: t('holdingRate'), value: (totalPnl / activeFund.investment) * 100, formatFn: formatPercent, cls: totalPnl >= 0 ? COLORS.up : COLORS.down },
                          { label: t('todayProfit'), value: todayProfit, formatFn: (v) => (v >= 0 ? '+' : '') + formatMoney(v), cls: (isUp && shouldCalcToday) ? COLORS.up : (shouldCalcToday ? COLORS.down : 'text-slate-500') },
                          { label: t('holdingDays'), value: activeFund.createdAt ? Math.floor((Date.now() - activeFund.createdAt) / (1000 * 60 * 60 * 24)) : 0, formatFn: (v) => v + ' ' + t('day'), cls: 'text-slate-300' },
                        ].map((item, idx) => (
                          <div key={idx} className="p-4 px-6 hover:bg-white/[0.02] transition-colors">
                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">{item.label}</p>
                            <p className={`text-lg font-black tracking-tight ${item.cls}`}>
                              <AnimatedNumber value={item.value} formatFn={item.formatFn} />
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
                  <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-3xl p-5 shadow-2xl backdrop-blur-3xl relative h-full flex flex-col">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><LucideLineChart size={12} /> {t('intraday')}</h3>
                    <div className="flex-1 min-h-0">
                      <IntradayChart
                        data={(() => {
                          // 获取今天的数据
                          const today = new Date().toISOString().split('T')[0];
                          const fundHistory = historyData[activeFund.code];
                          return fundHistory?.[today] || {};
                        })()}
                        height={300}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-4 bg-white/[0.02] border border-white/10 rounded-3xl p-5 shadow-2xl backdrop-blur-3xl flex flex-col h-full overflow-hidden">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><History size={12} /> {t('perfHistory')}</h3>
                    <div className="flex-1 overflow-y-auto no-scrollbar font-money pr-2">
                      {/* 表头 */}
                      <div className="flex justify-between items-center px-2 py-2 mb-1 text-[8px] font-black text-slate-600 uppercase tracking-widest border-b border-white/5">
                        <span>{t('navDate')}</span>
                        <span>{t('holdingRate')}</span>
                      </div>

                      {historyPerfConfig.code === activeFund.code && historyPerfConfig.data.length > 0 ? (
                        <div className="space-y-1">
                          {historyPerfConfig.data.map((item, idx) => {
                            const rate = parseFloat(item.JZZZL);
                            const isUp = rate >= 0;
                            return (
                              <div key={idx} className="flex justify-between items-center group hover:bg-white/5 px-2 py-2.5 rounded-lg transition-colors">
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors">{item.FSRQ}</span>
                                </div>
                                <div className="text-right flex items-center gap-2">
                                  <span className={`text-[11px] font-black ${isUp ? COLORS.up : COLORS.down}`}>
                                    {rate >= 0 ? '+' : ''}{rate.toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="text-center text-slate-600 text-[10px] mt-10">{t('noData')}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- All Funds Watchlist View --- */}
          < div className={`absolute inset-0 p-4 transition-all duration-300 ${view === 'watchlist' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`
          }>
            <div className="h-full flex flex-col bg-white/[0.02] rounded-3xl border border-white/10 shadow-xl overflow-hidden backdrop-blur-md">
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02] shrink-0">
                <div className="flex items-center gap-4">
                  <h2 className="text-sm font-black text-slate-200 uppercase tracking-widest flex items-center gap-2">
                    <Eye size={16} /> {t('watchlist')}
                  </h2>
                  <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                    <button onClick={() => setWatchlistSort('default')} className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${watchlistSort === 'default' ? 'bg-white/10 text-white' : 'text-slate-500'}`}>默认</button>
                    <button onClick={() => setWatchlistSort('asc')} className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${watchlistSort === 'asc' ? 'bg-white/10 text-white' : 'text-slate-500'}`}>涨幅↑</button>
                    <button onClick={() => setWatchlistSort('desc')} className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${watchlistSort === 'desc' ? 'bg-white/10 text-white' : 'text-slate-500'}`}>涨幅↓</button>
                  </div>
                </div>
                <button onClick={() => { setShowAddModal(true); setIsSearchingFund(false); setFoundFundName(null); setNewFund({ code: '', investment: '', return: '', calcToday: true }); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-lg transition-all font-bold text-[9px] uppercase tracking-widest"><Plus size={10} /> {t('addAsset')}</button>
              </div>

              {/* Group Tabs */}
              <div
                ref={tabsContainerRef}
                onWheel={handleTabsWheel}
                className="px-6 py-2 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar items-center shrink-0 scroll-smooth"
              >
                {/* All Tab */}
                <button
                  onClick={() => setActiveWatchlistGroup('all')}
                  onDragOver={(e) => {
                    // Only allow drop if it's NOT a group reorder
                    if (!draggedGroup) e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedGroup) return;
                    const code = e.dataTransfer.getData('text/plain');
                    if (code) handleUpdateFundPlate(code, null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 flex items-center gap-2 ${activeWatchlistGroup === 'all' ? 'bg-white/10 text-white border-white/10 shadow-lg' : 'bg-transparent text-slate-500 border-transparent hover:bg-white/5'}`}
                >
                  全部
                  <span className={`text-[10px] font-black ${(() => {
                    let total = 0, count = 0;
                    watchlist.forEach(f => {
                      const r = realtimeData[f.code];
                      if (r && typeof r.gszzl === 'number') { total += r.gszzl; count++; }
                    });
                    const avg = count > 0 ? total / count : 0;
                    return avg >= 0 ? COLORS.up : COLORS.down;
                  })()}`}>
                    {(() => {
                      let total = 0, count = 0;
                      watchlist.forEach(f => {
                        const r = realtimeData[f.code];
                        if (r && typeof r.gszzl === 'number') { total += r.gszzl; count++; }
                      });
                      const avg = count > 0 ? total / count : 0;
                      return (avg >= 0 ? '+' : '') + avg.toFixed(2) + '%';
                    })()}
                  </span>
                </button>

                {watchlistGroups.map(g => {
                  const avg = (() => {
                    const funds = watchlist.filter(w => w.groupId === g.id);
                    let total = 0, count = 0;
                    funds.forEach(f => {
                      const r = realtimeData[f.code];
                      if (r && typeof r.gszzl === 'number') { total += r.gszzl; count++; }
                    });
                    return count > 0 ? total / count : 0;
                  })();
                  const isUp = avg >= 0;

                  return (
                    <button
                      key={g.id}
                      draggable
                      onDragStart={(e) => handleGroupDragStart(e, g)}
                      onClick={() => setActiveWatchlistGroup(g.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        if (draggedGroup) {
                          handleGroupDrop(e, g);
                        } else {
                          e.preventDefault();
                          const code = e.dataTransfer.getData('text/plain');
                          if (code) handleUpdateFundPlate(code, g.id);
                        }
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setWatchlistGroupAction({ type: 'rename', id: g.id, name: g.name });
                        setShowWatchlistGroupModal(true);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 flex items-center gap-2 group ${activeWatchlistGroup === g.id ? 'bg-white/10 text-white border-white/10 shadow-lg' : 'bg-transparent text-slate-500 border-transparent hover:bg-white/5'} ${draggedGroup?.id === g.id ? 'opacity-50 border-dashed border-white/40' : ''}`}
                    >
                      {g.name}
                      <span className={`text-[10px] font-black ${isUp ? COLORS.up : COLORS.down}`}>
                        {(isUp ? '+' : '') + avg.toFixed(2) + '%'}
                      </span>
                      {activeWatchlistGroup === g.id && (
                        <div
                          className="ml-1 w-4 h-4 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmState({
                              isOpen: true,
                              title: '删除板块',
                              msg: '确定要删除该自选板块吗？板块内的基金将不再归属任何板块。',
                              onConfirm: () => {
                                handleDeleteWatchlistGroup(g.id);
                                setConfirmState(prev => ({ ...prev, isOpen: false }));
                              }
                            });
                          }}
                        >
                          <X size={10} />
                        </div>
                      )}
                    </button>
                  );
                })}

                <button
                  onClick={() => { setWatchlistGroupAction({ type: 'create', id: null, name: '' }); setShowWatchlistGroupModal(true); }}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all shrink-0"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                {watchlist.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50 gap-4">
                    <Eye size={48} strokeWidth={1} />
                    <span className="text-xs">暂无自选基金</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {(() => {
                      let filtered = activeWatchlistGroup === 'all' ? watchlist : watchlist.filter(w => w.groupId === activeWatchlistGroup);

                      if (watchlistSort !== 'default') {
                        filtered = [...filtered].sort((a, b) => {
                          const ra = realtimeData[a.code]?.gszzl || -999;
                          const rb = realtimeData[b.code]?.gszzl || -999;
                          return watchlistSort === 'asc' ? ra - rb : rb - ra;
                        });
                      }

                      if (filtered.length === 0 && activeWatchlistGroup !== 'all') {
                        return <div className="col-span-full text-center text-slate-500 text-xs py-10 opacity-50">拖拽基金到此板块添加</div>;
                      }

                      return filtered.map(item => {
                        const r = realtimeData[item.code];
                        if (!r) {
                          return (
                            <div key={item.code} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between animate-pulse">
                              <div><div className="h-4 w-24 bg-white/10 rounded mb-2"></div><div className="h-3 w-16 bg-white/10 rounded"></div></div>
                            </div>
                          );
                        }
                        const rate = r.gszzl;
                        const isUp = rate >= 0;
                        const colorClass = isUp ? 'text-rose-500' : 'text-emerald-500';

                        return (
                          <div
                            key={item.code}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', item.code);
                            }}
                            className="bg-[#111] border border-white/10 rounded-2xl p-4 relative group hover:border-white/30 transition-all flex flex-col h-full cursor-move select-none"
                          >
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmState({
                                    isOpen: true,
                                    title: '确认移除',
                                    msg: `确定要移除 ${item.name} 吗？`,
                                    onConfirm: () => {
                                      const newList = watchlist.filter(w => w.code !== item.code);
                                      setWatchlist(newList);
                                      if (window.require) {
                                        window.require('electron').ipcRenderer.invoke('db-delete-watchlist', item.code);
                                      }
                                      setConfirmState(prev => ({ ...prev, isOpen: false }));
                                    }
                                  });
                                }}
                                className="text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <div className="flex justify-between items-start mb-4 pr-6">
                              <div>
                                <h3 className="font-bold text-slate-200 text-sm leading-tight mb-1 line-clamp-2" title={item.name}>{item.name}</h3>
                                <span className="text-[10px] text-slate-500 font-mono tracking-wider">{item.code}</span>
                              </div>
                            </div>

                            <div className="flex items-end justify-between font-money mt-auto">
                              <div>
                                <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">实时估值</div>
                                <div className="text-xl font-bold text-slate-300">
                                  <AnimatedNumber value={r.gsz} />
                                </div>
                              </div>
                              <div className={`${colorClass} font-black text-3xl flex items-center gap-1`}>
                                {isUp ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                <AnimatedNumber value={rate} formatFn={v => (v > 0 ? '+' : '') + v + '%'} />
                              </div>
                            </div>

                            <div className="mt-2 pt-3 border-t border-white/5 flex justify-between text-[10px] text-slate-600 font-mono">
                              <span>{r.gztime}</span>
                              {item.groupId && (
                                <span className="text-slate-500 px-1.5 py-0.5 bg-white/5 rounded">
                                  {watchlistGroups.find(g => g.id === item.groupId)?.name}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
        {/* 自选板块管理弹窗 */}
        {showWatchlistGroupModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={() => setShowWatchlistGroupModal(false)} />
            <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-xs rounded-3xl shadow-2xl p-6 relative animate-modal-scale z-10">
              <h2 className="text-base font-black text-white mb-6 uppercase tracking-widest text-center">
                {watchlistGroupAction.type === 'create' ? '新建自选板块' : '重命名板块'}
              </h2>
              <input
                type="text"
                value={watchlistGroupAction.name}
                onChange={e => setWatchlistGroupAction({ ...watchlistGroupAction, name: e.target.value })}
                placeholder="板块名称"
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-center outline-none focus:border-white/40 mb-6"
                onKeyDown={(e) => { if (e.key === 'Enter') handleWatchlistGroupAction(); }}
              />
              <div className="flex gap-3">
                <button onClick={() => setShowWatchlistGroupModal(false)} className="flex-1 py-3 rounded-xl font-bold text-xs text-slate-500 border border-white/5 hover:bg-white/5 transition-all">{t('cancel')}</button>
                <button onClick={handleWatchlistGroupAction} className="flex-1 bg-white hover:bg-slate-200 py-3 rounded-xl font-black text-xs text-black transition-all shadow-lg active:scale-95">{t('confirm')}</button>
              </div>
            </div>
          </div>
        )}

        {/* --- 全局交互弹窗 --- */}

        {/* 录入弹窗 */}
        {
          showAddModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={() => !addLoading && setShowAddModal(false)} />
              <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative animate-modal-scale z-10 ring-1 ring-white/5">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.01]">
                  <h2 className="text-xl font-black text-white flex items-center gap-3"><Plus className="p-1.5 bg-white/10 rounded-lg" size={28} />{t('addAsset')}</h2>
                  <button onClick={() => !addLoading && setShowAddModal(false)} className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5"><X size={20} /></button>
                </div>
                <div className="p-8 space-y-6 font-money">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('fundCode')}</label>
                    <div className="relative">
                      <input type="text" value={newFund.code} onChange={e => setNewFund({ ...newFund, code: e.target.value })} placeholder={t('searchPlaceholder')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-white/40 transition-all placeholder:text-slate-700" autoFocus />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {isSearchingFund && <RefreshCw size={12} className="animate-spin text-slate-500" />}
                        {foundFundName === false && <span className="text-[9px] text-rose-500 font-bold uppercase">{t('notFound')}</span>}
                        {typeof foundFundName === 'string' && <span className="text-[9px] text-slate-400 font-bold truncate max-w-[150px]">{foundFundName}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('buyAmount')}</label>
                    <input type="number" value={newFund.investment} onChange={e => setNewFund({ ...newFund, investment: e.target.value })} placeholder="10000" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-white/40 transition-all" />
                  </div>
                  {/* [Modified] 增加持有收益输入框 */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('holdingReturn')}</label>
                    <input type="number" value={newFund.return} onChange={e => setNewFund({ ...newFund, return: e.target.value })} placeholder={t('returnPlaceholder')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-white/40 transition-all" />
                  </div>

                  {/* [New] 是否计算当日收益开关 */}
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs font-bold text-slate-300 block">{t('calcTodayProfit')}</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">{t('calcTodayProfitNote')}</span>
                    </div>
                    <button onClick={() => setNewFund({ ...newFund, calcToday: !newFund.calcToday })} className={`w-10 h-5 rounded-full transition-all relative ${newFund.calcToday ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                      <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${newFund.calcToday ? 'left-6' : 'left-0.5'}`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={async () => {
                        if (!foundFundInfo) return;
                        if (watchlist.some(w => w.code === foundFundInfo.code)) {
                          setNotification({ msg: '已存在于自选列表', type: 'error' });
                          return;
                        }
                        const newItem = { code: foundFundInfo.code, name: foundFundInfo.name, addedAt: Date.now() };
                        setWatchlist([...watchlist, newItem]);
                        // Persist immediately via IPC if possible, or useEffect will catch it if we add dependency
                        if (window.require) {
                          window.require('electron').ipcRenderer.invoke('db-add-watchlist', newItem);
                        }

                        setNotification({ msg: '已添加至自选', type: 'success' });
                        setTimeout(() => {
                          setShowAddModal(false);
                          setNewFund({ code: '', investment: '', return: '', calcToday: true });
                          setNotification(null);
                        }, 500);
                      }}
                      className={`py-4 rounded-xl font-black text-xs shadow-xl transition-all flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 ${!foundFundInfo ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!foundFundInfo}
                    >
                      <Eye size={16} /> 加入自选
                    </button>
                    <button
                      onClick={async () => {
                        // 直接使用已缓存的foundFundInfo，不再重复请求
                        if (!canAddFund || addLoading) return;
                        if (foundFundInfo) {
                          setAddLoading(true);
                          // 仅用于展示加载动画，提升体验
                          await new Promise(r => setTimeout(r, 500));
                          const info = foundFundInfo;
                          const target = activePortfolioId === 'all' ? 'default' : activePortfolioId;

                          // [Modified] 计算逻辑更新：根据 (本金 + 收益) / 净值 计算份额
                          const principal = parseFloat(newFund.investment);
                          const accumulatedReturn = parseFloat(newFund.return) || 0;
                          const currentShares = (principal + accumulatedReturn) / info.dwjz;

                          setMyHoldings([...myHoldings, {
                            id: crypto.randomUUID(),
                            ...info,
                            investment: principal,
                            shares: currentShares,
                            portfolioId: target,
                            createdAt: Date.now(),
                            calcToday: newFund.calcToday // [New] 保存是否计算当日收益
                          }]);
                          setNotification({ msg: t('successAdd'), type: 'success' });

                          setTimeout(() => {
                            setShowAddModal(false);
                            setNewFund({ code: '', investment: '', return: '', calcToday: true }); // [Modified] Reset form
                            setAddLoading(false);
                            setNotification(null);
                          }, 500);
                        }
                      }}
                      disabled={!canAddFund || addLoading}
                      className={`py-4 rounded-xl font-black text-xs shadow-xl transition-all flex items-center justify-center gap-2 ${canAddFund && !addLoading ? 'bg-white hover:bg-slate-200 text-black active:scale-[0.98]' : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'}`}
                    >
                      {addLoading ? <><RefreshCw className="animate-spin" size={16} /> ...</> : <><Check size={16} /> {t('confirmImport')}</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {/* 修改持仓 / 定投弹窗 */}
        {
          showEditModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={() => setShowEditModal(false)} />
              <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-sm rounded-3xl shadow-2xl p-6 relative animate-modal-scale z-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-widest">
                    {editMode === 'holdings' ? <Edit3 size={18} className="text-white" /> : <Repeat size={18} className="text-white" />}
                    {editMode === 'holdings' ? t('editHoldings') : t('investPlan')}
                  </h2>
                  <button onClick={() => setShowEditModal(false)} className="text-slate-500 hover:text-white p-1"><X size={18} /></button>
                </div>
                <div className="space-y-6">
                  {editMode === 'holdings' ? (
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">投入总额 (¥)</label>
                      <input type="number" value={editForm.investment} onChange={e => setEditForm({ ...editForm, investment: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold font-money outline-none focus:border-white/40" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-xs font-bold text-slate-300">启用定投计划</span>
                        <button onClick={() => setEditForm({ ...editForm, planEnabled: !editForm.planEnabled })} className={`w-10 h-5 rounded-full transition-all relative ${editForm.planEnabled ? 'bg-rose-500' : 'bg-slate-700'}`}>
                          <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${editForm.planEnabled ? 'left-6' : 'left-0.5'}`} />
                        </button>
                      </div>
                      {editForm.planEnabled && (
                        <div className="space-y-4 animate-fade-in">
                          <input type="number" value={editForm.planAmount} onChange={e => setEditForm({ ...editForm, planAmount: e.target.value })} placeholder="每期金额" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold" />
                          <div className="flex gap-2">
                            {['daily', 'weekly'].map(f => (
                              <button key={f} onClick={() => setEditForm({ ...editForm, planFreq: f })} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${editForm.planFreq === f ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-slate-500'}`}>{t(f)}</button>
                            ))}
                          </div>
                          {/* 如果选择每周，显示周一到周五的日期多选 */}
                          {editForm.planFreq === 'weekly' && (
                            <div className="flex gap-2 animate-fade-in">
                              {t('weekDays').map((day, idx) => {
                                const dayNum = idx + 1;
                                const isSelected = editForm.planDays.includes(dayNum);
                                return (
                                  <button
                                    key={dayNum}
                                    onClick={() => {
                                      const newDays = isSelected
                                        ? editForm.planDays.filter(d => d !== dayNum)
                                        : [...editForm.planDays, dayNum];
                                      setEditForm({ ...editForm, planDays: newDays });
                                    }}
                                    className={`flex-1 py-2 rounded-lg text-[9px] font-black border transition-all ${isSelected ? 'bg-rose-500 text-white border-rose-500' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                                  >
                                    {day}
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  <button onClick={handleEditFund} className="w-full py-3.5 bg-white hover:bg-slate-200 text-black rounded-xl font-black text-xs transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
                    <Check size={16} /> {t('save')}
                  </button>
                </div>
              </div>
            </div>
          )
        }

        {/* 账户切换管理弹窗 */}
        {
          showPortfolioModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={() => setShowPortfolioModal(false)} />
              <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-xs rounded-3xl shadow-2xl p-6 relative animate-modal-scale z-10">
                <h2 className="text-base font-black text-white mb-6 uppercase tracking-widest text-center">{portfolioAction.type === 'create' ? t('createPortfolio') : t('renamePortfolio')}</h2>
                <input type="text" value={newPortfolioName} onChange={e => setNewPortfolioName(e.target.value)} placeholder={t('placeholderPortfolio')} autoFocus className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-center outline-none focus:border-white/40 mb-6" />
                <div className="flex gap-3">
                  <button onClick={() => setShowPortfolioModal(false)} className="flex-1 py-3 rounded-xl font-bold text-xs text-slate-500 border border-white/5 hover:bg-white/5 transition-all">{t('cancel')}</button>
                  <button onClick={handlePortfolioAction} className="flex-1 bg-white hover:bg-slate-200 py-3 rounded-xl font-black text-xs text-black transition-all shadow-lg active:scale-95">{t('confirm')}</button>
                </div>
              </div>
            </div>
          )
        }
      </div>

      {/* 页脚数据源声明 */}
      <div className="h-6 bg-[#000000] border-t border-white/5 flex items-center justify-center gap-6 px-6 shrink-0 z-10">
        <div className="text-[8px] font-black text-slate-700 uppercase tracking-[0.3em]">{t('dataSource')}</div>
      </div>
    </div>
  );
}