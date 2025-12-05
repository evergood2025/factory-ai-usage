import React, { useState, useEffect } from 'react';
import { UsageCard } from './components/UsageCard';
import { KeyManagerModal } from './components/KeyManagerModal';
import { RefreshCw, Calendar, ShieldCheck, Zap, Globe, AlertCircle, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();

  // State for Data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for Keys
  const [keys, setKeys] = useState(() => {
    const saved = localStorage.getItem('api_keys');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeKey, setActiveKey] = useState(() => {
    return localStorage.getItem('active_key') || '';
  });
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  // Persist Keys
  useEffect(() => {
    localStorage.setItem('api_keys', JSON.stringify(keys));
    if (keys.length > 0 && !keys.includes(activeKey)) {
      // If active key was deleted, switch to the first one or empty
      setActiveKey(keys[0]);
    } else if (keys.length === 0) {
      setActiveKey('');
    }
  }, [keys]);

  useEffect(() => {
    if (activeKey) {
      localStorage.setItem('active_key', activeKey);
      fetchData(); // Fetch when active key changes
    } else {
      setData(null); // No key, no data
    }
  }, [activeKey]);

  const fetchData = async () => {
    if (!activeKey) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/organization/members/chat-usage', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${activeKey}`,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.warn("Fetch failed:", err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  // Key Management Handlers
  const handleAddKey = (key) => {
    if (!keys.includes(key)) {
      const newKeys = [...keys, key];
      setKeys(newKeys);
      if (!activeKey) setActiveKey(key); // Auto select if it's the first one
    }
  };

  const handleDeleteKey = (keyToDelete) => {
    const newKeys = keys.filter(k => k !== keyToDelete);
    setKeys(newKeys);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-slate-400 mt-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-500" />
              {t('subtitle')}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {data && (
              <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t('currentPeriod')}</span>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-200 mt-1">
                    <Calendar size={16} className="text-slate-400" />
                    <span>{format(new Date(data.usage.startDate), 'MMM d, yyyy')}</span>
                    <span className="text-slate-600">→</span>
                    <span>{format(new Date(data.usage.endDate), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-700 mx-2"></div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t('remaining')}</span>
                  <p className="text-sm font-medium text-emerald-400 mt-1">
                    {Math.ceil((new Date(data.usage.endDate) - new Date()) / (1000 * 60 * 60 * 24))} {t('days')}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={() => setIsKeyModalOpen(true)}
                  className="p-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/50 transition-colors text-slate-400 hover:text-white flex items-center gap-2"
                  title={t('manageKeys')}
                >
                  <Settings size={20} />
                  <span className="md:hidden">{t('settings')}</span>
                </button>
                {keys.length === 0 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap z-20">
                    <div className="relative bg-blue-500 text-white text-sm px-3 py-2 rounded-lg shadow-lg animate-pulse">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-blue-500"></div>
                      {t('addKeyHint')}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={toggleLanguage}
                className="p-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/50 transition-colors text-slate-400 hover:text-white"
                title="Switch Language"
              >
                <Globe size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Key Manager Modal */}
        <KeyManagerModal
          isOpen={isKeyModalOpen}
          onClose={() => setIsKeyModalOpen(false)}
          keys={keys}
          activeKey={activeKey}
          onAddKey={handleAddKey}
          onDeleteKey={handleDeleteKey}
          onSelectKey={(k) => {
            setActiveKey(k);
            // setIsKeyModalOpen(false); // Optional: close on select
          }}
        />

        {/* Error Notification */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{t('fetchError')}: {error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && !data && (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* No Data / No Key State */}
        {!loading && !data && (
          <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-500 space-y-4">
            <ShieldCheck size={48} className="opacity-20" />
            <p>{keys.length === 0 ? t('noKeys') : "Select a key to view usage"}</p>
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {t('manageKeys')}
            </button>
          </div>
        )}

        {/* Cards Grid */}
        {data && (
          <>
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="bg-slate-900/80 p-4 rounded-full backdrop-blur-sm border border-slate-700/50 shadow-2xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                </div>
              )}

              <div className={loading ? "opacity-40 blur-sm transition-all duration-500" : "transition-all duration-500"}>
                {/* Cards Grid */}
                {(() => {
                  const showStandard = data.usage.standard.totalAllowance > 0;
                  const showPremium = data.usage.premium.totalAllowance > 0;
                  const singleCard = showStandard !== showPremium; // XOR, true if only one is shown

                  return (
                    <div className={singleCard ? "flex justify-center" : "grid grid-cols-1 md:grid-cols-2 gap-8"}>
                      {showStandard && (
                        <div className={singleCard ? "w-full max-w-[500px]" : ""}>
                          <UsageCard
                            title={t('standardPlan')}
                            usage={data.usage.standard}
                            type="standard"
                          />
                        </div>
                      )}
                      {showPremium && (
                        <div className={singleCard ? "w-full max-w-[500px]" : ""}>
                          <UsageCard
                            title={t('premiumPlan')}
                            usage={data.usage.premium}
                            type="premium"
                          />
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-12 flex justify-center">
              <button
                onClick={fetchData}
                disabled={loading}
                className={`group flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 active:scale-95 ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                <RefreshCw size={18} className={`group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
                {t('refreshData')}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default App;
