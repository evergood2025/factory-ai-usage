import React from 'react';
import { CircularProgress } from './CircularProgress';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const UsageCard = ({ title, usage, type }) => {
    const { t } = useTranslation();
    const isStandard = type === 'standard';
    const percentage = usage.usedRatio * 100;

    // Determine color based on usage
    let color = "#3b82f6"; // Blue default
    if (percentage > 90) color = "#ef4444"; // Red
    else if (percentage > 75) color = "#f59e0b"; // Amber

    // Format numbers (e.g., 38905906 -> 38.9M)
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <motion.div
            className={`relative overflow-hidden rounded-2xl bg-slate-800/50 p-6 backdrop-blur-xl border border-slate-700/50 shadow-xl ${percentage > 90 ? 'shadow-red-900/20 border-red-500/30' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
            <div className="flex flex-col items-center justify-center py-4">
                <CircularProgress percentage={percentage} color={color} size={220} />

                <div className="mt-8 text-center space-y-1">
                    <p className="text-slate-400 text-sm uppercase tracking-wider font-medium">{t('tokensUsed')}</p>
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-bold text-white">{formatNumber(usage.userTokens)}</span>
                        <span className="text-slate-500">/</span>
                        <span className="text-lg text-slate-400">{formatNumber(usage.totalAllowance)}</span>
                    </div>
                </div>
            </div>

            {/* Footer / Details */}
            <div className="mt-6 pt-6 border-t border-slate-700/50 grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-xs text-slate-500 mb-1">{t('allowance')}</p>
                    <p className="text-sm font-medium text-slate-300">{formatNumber(usage.basicAllowance)}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 mb-1">{t('overage')}</p>
                    <p className="text-sm font-medium text-slate-300">{usage.orgOverageUsed}</p>
                </div>
            </div>
        </motion.div>
    );
};
