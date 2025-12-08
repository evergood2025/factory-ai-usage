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
            "keySecurityNotice": "Your API keys are stored locally in your browser and never uploaded to any server.",
            "active": "Active",
            "delete": "Delete",
            "copy": "Copy",
            "use": "Use",
            "keyPlaceholder": "sk-...",
            "addKeysLabel": "Enter API Keys (one per line or comma-separated)",
            "standard": "Standard",
            "premium": "Premium",
            "export": "Export",
            "exportKeys": "Export All Keys"
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
            "keySecurityNotice": "API 密钥仅保存在本地浏览器，不会上传到任何服务器。",
            "active": "使用中",
            "delete": "删除",
            "copy": "复制",
            "use": "切换",
            "keyPlaceholder": "sk-...",
            "addKeysLabel": "输入 API 密钥 (支持换行或逗号分隔)",
            "standard": "标准",
            "premium": "高级",
            "export": "导出",
            "exportKeys": "导出所有密钥"
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
