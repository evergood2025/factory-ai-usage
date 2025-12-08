import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, RefreshCw, AlertCircle, Trash2, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const KeyUsageRow = ({ apiKey, data, loading, error, onDelete, onRefresh }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const maskKey = (key) => {
        if (key.length <= 10) return key;
        return `${key.substring(0, 8)}...${key.substring(key.length - 6)}`;
    };

    const formatNumber = (num) => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const formatDate = (dateStr) => {
        try {
            return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        } catch (e) {
            return dateStr;
        }
    };

    // Calculate days remaining
    let daysRemaining = null;
    if (data?.usage?.endDate) {
        daysRemaining = Math.max(0, Math.ceil((new Date(data.usage.endDate) - new Date()) / (1000 * 60 * 60 * 24)));
    }

    const renderUsageBar = (usage, type, defaultColorClass) => {
        if (!usage || usage.totalAllowance <= 0) return null;
        const percentage = Math.min(100, (usage.usedRatio || 0) * 100);

        let colorClass = defaultColorClass;
        if (percentage > 90) colorClass = "bg-red-500";
        else if (percentage > 75) colorClass = "bg-amber-500";

        return (
            <div className="flex flex-col gap-1 min-w-[140px]">
                <div className="flex justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                        {type === 'standard' ? <ShieldCheck size={12} /> : <Zap size={12} />}
                        {type === 'standard' ? t('standard') : t('premium')}
                    </span>
                    <span className={percentage > 90 ? "text-red-400 font-medium" : ""}>{percentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full ${colorClass}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="text-[10px] text-slate-500 text-right">
                    {formatNumber(usage.userTokens)} / {formatNumber(usage.totalAllowance)}
                </div>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800/60 transition-colors gap-4"
        >
            {/* Key Info */}
            <div className="flex items-center gap-3 min-w-[200px]">
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <code className="text-sm font-mono text-slate-300">{maskKey(apiKey)}</code>
                        <button
                            onClick={handleCopy}
                            className="text-slate-500 hover:text-blue-400 p-1 rounded transition-colors"
                        >
                            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        </button>
                    </div>
                    {daysRemaining !== null && (
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <span>{daysRemaining} {t('days')} left</span>
                            <span className="text-slate-600">•</span>
                            <span>{formatDate(data.usage.startDate)} - {formatDate(data.usage.endDate)}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Status / Loading / Usage */}
            <div className="flex-1 w-full md:w-auto flex flex-col md:flex-row items-center gap-6 justify-end">
                {loading ? (
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <RefreshCw size={14} className="animate-spin" />
                        <span>{t('loading')}...</span>
                    </div>
                ) : error ? (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-3 py-1.5 rounded-lg">
                        <AlertCircle size={14} />
                        <span>{t('fetchError')}</span>
                    </div>
                ) : data ? (
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full md:w-auto">
                        {renderUsageBar(data.usage.standard, 'standard', 'bg-blue-500')}
                        {renderUsageBar(data.usage.premium, 'premium', 'bg-purple-500')}
                    </div>
                ) : (
                    <span className="text-slate-600 text-sm">-</span>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-700/50">
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors disabled:opacity-50"
                    title={t('refreshData')}
                >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title={t('delete')}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </motion.div>
    );
};
