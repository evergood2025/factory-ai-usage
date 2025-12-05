import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "title": "Factory AI Usage",
            "subtitle": "Usage Overview",
            "currentPeriod": "Current Period",
            "remaining": "Remaining",
            "days": "Days",
            "standardPlan": "Standard Plan",
            "premiumPlan": "Premium Plan",
            "nearLimit": "Near Limit",
            "healthy": "Healthy",
            "tokensUsed": "Tokens Used",
            "allowance": "Allowance",
            "overage": "Overage",
            "refreshData": "Refresh Data",
            "fetchError": "Failed to fetch data",
            "loading": "Loading...",
            "settings": "Settings",
            "manageKeys": "Manage API Keys",
            "enterKey": "Enter API Key",
            "add": "Add",
            "noKeys": "No API keys saved. Please add one.",
            "addKeyHint": "Click here to add your API Key",
            "active": "Active",
            "delete": "Delete",
            "use": "Use",
            "keyPlaceholder": "sk-..."
        }
    },
    zh: {
        translation: {
            "title": "Factory AI 用量统计",
            "subtitle": "用量概览",
            "currentPeriod": "当前周期",
            "remaining": "剩余时间",
            "days": "天",
            "standardPlan": "标准版套餐",
            "premiumPlan": "高级版套餐",
            "nearLimit": "即将耗尽",
            "healthy": "状态良好",
            "tokensUsed": "已用 Tokens",
            "allowance": "总额度",
            "overage": "超额使用",
            "refreshData": "刷新数据",
            "fetchError": "获取数据失败",
            "loading": "加载中...",
            "settings": "设置",
            "manageKeys": "管理 API 密钥",
            "enterKey": "输入 API 密钥",
            "add": "添加",
            "noKeys": "暂无保存的密钥，请添加。",
            "addKeyHint": "点击这里添加 API 密钥",
            "active": "使用中",
            "delete": "删除",
            "use": "切换",
            "keyPlaceholder": "sk-..."
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
