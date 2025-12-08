import React, { useState, useEffect, useCallback } from 'react';
import { UsageCard } from './components/UsageCard';
import { KeyManagerModal } from './components/KeyManagerModal';
import { KeyUsageRow } from './components/KeyUsageRow';
import { RefreshCw, ShieldCheck, Globe, AlertCircle, Settings, Github, LayoutGrid, List } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { FactoryLogo } from './components/FactoryLogo';

function App() {
  const { t, i18n } = useTranslation();

  // State for Keys
  const [keys, setKeys] = useState(() => {
    const saved = localStorage.getItem('api_keys');
    return saved ? JSON.parse(saved) : [];
  });

  // State for Data: { [key]: { status: 'idle'|'loading'|'success'|'error', data: null, error: null } }
  const [results, setResults] = useState({});
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'

  // Persist Keys
  useEffect(() => {
    localStorage.setItem('api_keys', JSON.stringify(keys));
  }, [keys]);

  // Initial Fetch & Sync Results Map
  useEffect(() => {
    // initialize results for new keys
    setResults(prev => {
      const next = { ...prev };
      let changed = false;
      keys.forEach(key => {
        if (!next[key]) {
          next[key] = { status: 'idle', data: null, error: null };
          changed = true;
        }
      });
      // Remove deleted keys
      Object.keys(next).forEach(key => {
        if (!keys.includes(key)) {
          delete next[key];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [keys]);

  // Trigger fetch for idle keys (e.g. on load)
  useEffect(() => {
    keys.forEach(key => {
      if (results[key]?.status === 'idle') {
        fetchUsageForKey(key);
      }
    });
  }, [keys, results]);

  const fetchUsageForKey = async (key) => {
    setResults(prev => ({
      ...prev,
      [key]: { ...(prev[key] || {}), status: 'loading', error: null }
    }));

    try {
      const response = await fetch('/api/organization/members/chat-usage', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${key}`,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setResults(prev => ({
        ...prev,
        [key]: { status: 'success', data: result, error: null }
      }));
    } catch (err) {
      console.warn(`Fetch failed for key ${key}:`, err);
      setResults(prev => ({
        ...prev,
        [key]: { status: 'error', data: null, error: err.message || 'Failed to fetch data' }
      }));
    }
  };

  const refreshAll = useCallback(() => {
    keys.forEach(key => fetchUsageForKey(key));
  }, [keys]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  // Key Management Handlers
  const handleAddKeys = (newKeysList) => {
    // Filter duplicates
    const uniqueNewKeys = newKeysList.filter(k => !keys.includes(k));
    if (uniqueNewKeys.length > 0) {
      setKeys(prev => [...prev, ...uniqueNewKeys]);
      // Trigger fetch immediately handled by effect, or we can force it here?
      // Effect 'results' sync will set them to idle, then separate effect will fetch.
    }
    setIsKeyModalOpen(false);
  };

  const handleDeleteKey = (keyToDelete) => {
    setKeys(prev => prev.filter(k => k !== keyToDelete));
  };

  const maskKey = (key) => {
    if (key.length <= 8) return key;
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 border-b border-slate-800/50 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <FactoryLogo className="h-8 text-blue-400" />
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t('title')}
              </h1>
            </div>
            <p className="text-slate-400 mt-2 flex items-center gap-2 text-sm">
              <ShieldCheck size={16} className="text-blue-500" />
              {t('subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            {keys.length > 0 && (
              <div className="bg-slate-800/50 p-1 rounded-lg border border-slate-700/50 flex">
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'card' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  title="Card View"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  title="List View"
                >
                  <List size={18} />
                </button>
              </div>
            )}

            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/50 transition-colors text-slate-400 hover:text-white"
              title={t('manageKeys')}
            >
              <Settings size={18} />
            </button>

            <button
              onClick={refreshAll}
              className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/50 transition-colors text-slate-400 hover:text-white"
              title={t('refreshData')}
            >
              <RefreshCw size={18} />
            </button>

            <button
              onClick={toggleLanguage}
              className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/50 transition-colors text-slate-400 hover:text-white"
            >
              <Globe size={18} />
            </button>

            <a
              href="https://github.com/evergood2025/factory-ai-usage"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/50 transition-colors text-slate-400 hover:text-white"
            >
              <Github size={18} />
            </a>
          </div>
        </header>

        {/* Key Manager Modal */}
        <KeyManagerModal
          isOpen={isKeyModalOpen}
          onClose={() => setIsKeyModalOpen(false)}
          keys={keys}
          onAddKeys={handleAddKeys}
          onDeleteKey={handleDeleteKey}
        />

        {/* Empty State */}
        {keys.length === 0 && (
          <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-500 space-y-4 bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-700/50">
            <ShieldCheck size={48} className="opacity-20" />
            <p>{t('noKeys')}</p>
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              {t('addKeyHint')}
            </button>
          </div>
        )}

        {/* Content */}
        {keys.length > 0 && (
          <div className="space-y-8 animate-in fade-in duration-500">

            {/* List View */}
            {viewMode === 'list' && (
              <div className="flex flex-col gap-3">
                {keys.map(key => (
                  <KeyUsageRow
                    key={key}
                    apiKey={key}
                    data={results[key]?.data}
                    loading={results[key]?.status === 'loading' || results[key]?.status === 'idle'}
                    error={results[key]?.error}
                    onDelete={() => handleDeleteKey(key)}
                    onRefresh={() => fetchUsageForKey(key)}
                  />
                ))}
              </div>
            )}

            {/* Card View */}
            {viewMode === 'card' && (
              <div className="flex flex-wrap justify-center items-start gap-6">
                {keys.map(key => {
                  const result = results[key];
                  const data = result?.data;
                  const loading = result?.status === 'loading' || result?.status === 'idle';
                  const error = result?.error;

                  if (loading) {
                    return (
                      <div key={key} className="w-full max-w-md min-h-[300px] bg-slate-800/30 rounded-2xl border border-slate-700/30 flex items-center justify-center animate-pulse">
                        <div className="flex flex-col items-center gap-3">
                          <RefreshCw className="animate-spin text-slate-500" size={24} />
                          <span className="text-slate-500 text-sm font-mono">{maskKey(key)}</span>
                        </div>
                      </div>
                    );
                  }

                  if (error) {
                    return (
                      <div key={key} className="w-full max-w-md min-h-[200px] bg-slate-800/30 rounded-2xl border border-red-500/30 p-6 flex flex-col items-center justify-center text-center gap-3">
                        <AlertCircle className="text-red-400" size={32} />
                        <span className="text-slate-400 text-sm font-mono">{maskKey(key)}</span>
                        <span className="text-red-400 text-sm">{t('fetchError')}</span>
                        <button
                          onClick={() => fetchUsageForKey(key)}
                          className="text-blue-400 hover:underline text-sm"
                        >
                          Try Again
                        </button>
                      </div>
                    );
                  }

                  if (!data) return null;

                  // If multiple plans, rendering multiple cards feels redundant in terms of "UsageCard" size, 
                  // but necessary to show details. We keep them adjacent.
                  const showStandard = data.usage.standard.totalAllowance > 0;
                  const showPremium = data.usage.premium.totalAllowance > 0;
                  const dateRange = { startDate: data.usage.startDate, endDate: data.usage.endDate };

                  return (
                    <React.Fragment key={key}>
                      {showStandard && (
                        <div className="relative group w-full max-w-md">
                          <div className="absolute -top-3 left-4 px-2 bg-slate-900 border border-slate-700 rounded text-xs text-slate-400 font-mono z-10">
                            {maskKey(key)}
                          </div>
                          <UsageCard
                            title={t('standardPlan')}
                            usage={data.usage.standard}
                            type="standard"
                            dateRange={dateRange}
                          />
                        </div>
                      )}
                      {showPremium && (
                        <div className="relative group w-full max-w-md">
                          <div className="absolute -top-3 left-4 px-2 bg-slate-900 border border-slate-700 rounded text-xs text-slate-400 font-mono z-10">
                            {maskKey(key)}
                          </div>
                          <UsageCard
                            title={t('premiumPlan')}
                            usage={data.usage.premium}
                            type="premium"
                            dateRange={dateRange}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
