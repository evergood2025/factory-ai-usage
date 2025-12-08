import React, { useState } from 'react';
import { X, Plus, Trash2, Check, Key, Copy, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export const KeyManagerModal = ({ isOpen, onClose, keys, onAddKeys, onDeleteKey }) => {
    const { t } = useTranslation();
    const [inputKeys, setInputKeys] = useState('');
    const [copiedKey, setCopiedKey] = useState(null);

    const handleCopy = async (key) => {
        await navigator.clipboard.writeText(key);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleExport = () => {
        const content = keys.join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factory-ai-keys-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleAdd = () => {
        if (!inputKeys.trim()) return;

        // Split by newline or comma, trim whitespace, remove empty strings
        const newKeys = inputKeys
            .split(/[\n,]+/)
            .map(k => k.trim())
            .filter(k => k.length > 0);

        if (newKeys.length > 0) {
            onAddKeys(newKeys);
            setInputKeys('');
        }
    };

    // Mask key for display (e.g., "sk-1234...5678")
    const maskKey = (key) => {
        if (key.length <= 10) return key;
        return `${key.substring(0, 8)}...${key.substring(key.length - 6)}`;
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Key size={20} className="text-blue-400" />
                            {t('manageKeys')}
                        </h2>
                        <div className="flex items-center gap-2">
                            {keys.length > 0 && (
                                <button
                                    onClick={handleExport}
                                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors flex items-center gap-2"
                                    title={t('exportKeys')}
                                >
                                    <Download size={18} />
                                    <span className="text-sm font-medium">{t('export')}</span>
                                </button>
                            )}
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">

                        {/* Security Notice */}
                        <p className="text-xs text-slate-400">{t('keySecurityNotice')}</p>

                        {/* Add Key Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300">
                                {t('addKeysLabel')}
                            </label>
                            <textarea
                                value={inputKeys}
                                onChange={(e) => setInputKeys(e.target.value)}
                                placeholder={t('keyPlaceholder')}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[100px] resize-none font-mono"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handleAdd}
                                    disabled={!inputKeys.trim()}
                                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                                >
                                    <Plus size={16} />
                                    {t('add')}
                                </button>
                            </div>
                        </div>

                        {/* Key List */}
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                            {keys.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 text-sm">
                                    {t('noKeys')}
                                </div>
                            ) : (
                                keys.map((key, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-lg border bg-slate-700/30 border-slate-700/50 hover:bg-slate-700/50 transition-all"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-2 h-2 rounded-full bg-slate-600" />
                                            <span className="text-sm font-mono text-slate-300 truncate" title={key}>
                                                {maskKey(key)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleCopy(key)}
                                                className="text-slate-500 hover:text-blue-400 p-1.5 hover:bg-blue-400/10 rounded transition-colors"
                                                title={t('copy')}
                                            >
                                                {copiedKey === key ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                            </button>

                                            <button
                                                onClick={() => onDeleteKey(key)}
                                                className="text-slate-500 hover:text-red-400 p-1.5 hover:bg-red-400/10 rounded transition-colors"
                                                title={t('delete')}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
