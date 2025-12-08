import React from 'react';
import { CircularProgress } from './CircularProgress';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const UsageCard = ({ title, usage, type, dateRange }) => {
    const { t, i18n } = useTranslation();
    const isStandard = type === 'standard';
    const percentage = usage.usedRatio * 100;

    // Determine color based on usage
    let color = "#3b82f6"; // Blue default
    if (percentage > 90) color = "#ef4444"; // Red
    else if (percentage > 75) color = "#f59e0b"; // Amber

    // Format numbers
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    // Date formatting helper
    const formatDate = (dateStr) => {
        try {
            return new Date(dateStr).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return dateStr;
        }
    };

    const daysRemaining = dateRange ? Math.ceil((new Date(dateRange.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

    return (
        <motion.div
            className={`relative overflow-hidden rounded-2xl bg-slate-800/50 p-6 backdrop-blur-xl border border-slate-700/50 shadow-xl flex flex-col h-full ${percentage > 90 ? 'shadow-red-900/20 border-red-500/30' : ''}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-200">{title}</h3>
                {percentage > 90 ? (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-3 py-1 rounded-full">
                        <AlertCircle size={16} />
                        <span>{t('nearLimit')}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-400/10 px-3 py-1 rounded-full">
                        <CheckCircle2 size={16} />
                        <span>{t('healthy')}</span>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center py-2 flex-grow">
                <CircularProgress percentage={percentage} color={color} size={180} />

                <div className="mt-6 text-center space-y-1">
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">{t('tokensUsed')}</p>
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-bold text-white">{formatNumber(usage.userTokens)}</span>
                        <span className="text-slate-500">/</span>
                        <span className="text-lg text-slate-400">{formatNumber(usage.totalAllowance)}</span>
                    </div>
                </div>
            </div>

            {/* Date Period Info (Similar to User Image) */}
            {dateRange && (
                <div className="mt-6 pt-4 border-t border-slate-700/50">
                    <div className="bg-slate-900/40 rounded-xl p-3 flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">{t('currentPeriod')}</span>
                            <div className="text-slate-300 font-medium whitespace-nowrap">
                                {formatDate(dateRange.startDate)} <span className="text-slate-600 px-1">→</span> {formatDate(dateRange.endDate)}
                            </div>
                        </div>
                        <div className="h-8 w-px bg-slate-700/50 mx-2"></div>
                        <div className="flex flex-col gap-1 text-right min-w-[60px]">
                            <span className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">{t('remaining')}</span>
                            <span className={`font-bold ${daysRemaining < 3 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {daysRemaining} {t('days')}
                            </span>
                        </div>
                    </div>
                </div>
            )}

        </motion.div>
    );
};
