import React, { useState } from 'react';
import { X, Plus, Trash2, Check, Key } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export const KeyManagerModal = ({ isOpen, onClose, keys, activeKey, onAddKey, onDeleteKey, onSelectKey }) => {
    const { t } = useTranslation();
    const [newKey, setNewKey] = useState('');

    const handleAdd = () => {
        if (newKey.trim()) {
            onAddKey(newKey.trim());
            setNewKey('');
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
                    className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Key size={20} className="text-blue-400" />
                            {t('manageKeys')}
                        </h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">

                        {/* Add Key Input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newKey}
                                onChange={(e) => setNewKey(e.target.value)}
                                placeholder={t('keyPlaceholder')}
                                className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            />
                            <button
                                onClick={handleAdd}
                                disabled={!newKey.trim()}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                            >
                                <Plus size={16} />
                                {t('add')}
                            </button>
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
                                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${key === activeKey
                                                ? 'bg-blue-500/10 border-blue-500/30'
                                                : 'bg-slate-700/30 border-slate-700/50 hover:bg-slate-700/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className={`w-2 h-2 rounded-full ${key === activeKey ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]' : 'bg-slate-600'}`} />
                                            <span className="text-sm font-mono text-slate-300 truncate" title={key}>
                                                {maskKey(key)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {key === activeKey ? (
                                                <span className="text-xs font-medium text-blue-400 px-2 py-1 bg-blue-400/10 rounded">
                                                    {t('active')}
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => onSelectKey(key)}
                                                    className="text-xs font-medium text-slate-400 hover:text-white px-2 py-1 hover:bg-slate-600 rounded transition-colors"
                                                >
                                                    {t('use')}
                                                </button>
                                            )}

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
