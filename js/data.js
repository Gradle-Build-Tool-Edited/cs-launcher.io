/* js/data.js */
const DEFAULT_LAUNCHER_DATA = {
  v1: {
    id: 'v1',
    name: 'CS Launcher V1',
    version: '1.0.0',
    status: 'Stable',
    size: '18.4 MB',
    release: '2025-02-10',
    updated: '2025-03-01',
    desc: 'نسخه پایه با عملکرد عالی برای ماینکرفت ۱.۱۷ تا ۱.۱۹',
    features: ['پشتیبانی از ۱.۱۷ تا ۱.۱۹', 'رابط ساده', 'مصرف کم منابع'],
    mcVersions: '۱.۱۷ — ۱.۱۹',
    androidMin: 'Android 8.0',
    performance: 'عالی · ۶۰ فریم',
    preview: '🎮',
    downloads: [
      { 
        id: 'v1-main', 
        name: 'سرور اصلی', 
        type: 'Direct', 
        url: 'https://github.com/Mineradi/CS-LAUNCHER/releases/download/v.1.0.0/CSLauncher.apk', // 🔴 لینک V1 را اینجا جایگزین کنید
        recommended: true, 
        enabled: true 
      },
      { 
        id: 'v1-mirror1', 
        name: 'Mirror 1', 
        type: 'Direct', 
        url: 'https://github.com/Mineradi/CS-LAUNCHER/releases/download/v.1.0.0/CSLauncher.apk', // 🔴 لینک میرror V1 را اینجا جایگزین کنید
        recommended: false, 
        enabled: true 
      },
      { 
        id: 'v1-mirror2', 
        name: 'Mirror 2', 
        type: 'Direct', 
        url: 'https://github.com/Mineradi/CS-LAUNCHER/releases/download/v.1.0.0/CSLauncher.apk', // 🔴 غیرفعال - با # بماند یا لینک واقعی جایگزین شود
        recommended: false, 
        enabled: true 
      }
    ]
  },
  v2: {
    id: 'v2',
    name: 'CS Launcher V2',
    version: '2.0.0',
    status: 'Beta',
    size: '22.1 MB',
    release: '2025-01-20',
    updated: '2025-02-28',
    desc: 'نسخه بهبودیافته با قابلیت‌های جدید و پشتیبانی از نسخه‌های جدیدتر',
    features: ['پشتیبانی ۱.۱۸ تا ۱.۲۰', 'حالت عملکرد', 'شخصی‌سازی'],
    mcVersions: '۱.۱۸ — ۱.۲۰',
    androidMin: 'Android 9.0',
    performance: 'خوب · ۵۵ فریم',
    preview: '⚡',
    downloads: [
      { 
        id: 'v2-main', 
        name: 'سرور اصلی', 
        type: 'Direct', 
        url: 'https://github.com/craftstudioteam/CS-LAUNCHER-v2/releases/download/v2.10/CS-LAUNCHER-V2.apk', // 🔴 لینک V2 را اینجا جایگزین کنید
        recommended: true, 
        enabled: true 
      },
      { 
        id: 'v2-mirror1', 
        name: 'Mirror 1', 
        type: 'Direct', 
        url: 'https://github.com/craftstudioteam/CS-LAUNCHER-v2/releases/download/v2.10/CS-LAUNCHER-V2.apk', // 🔴 لینک میرror V2 را اینجا جایگزین کنید
        recommended: false, 
        enabled: true 
      }
    ]
  },
  v3: {
    id: 'v3',
    name: 'CS Launcher V3',
    version: '3.0.0',
    status: 'Development',
    size: '26.8 MB',
    release: '2025-03-15',
    updated: '2025-03-20',
    desc: 'جدیدترین نسخه با هسته بهینه و پشتیبانی از آخرین آپدیت‌های ماینکرفت',
    features: ['پشتیبانی ۱.۱۹ تا ۱.۲۱', 'رابط گیمینگ', 'بهینه‌سازی باتری'],
    mcVersions: '۱.۱۹ — ۱.۲۱',
    androidMin: 'Android 10',
    performance: 'فوق‌العاده · ۷۰ فریم',
    preview: '🔥',
    downloads: [
      { 
        id: 'v3-main', 
        name: 'سرور اصلی', 
        type: 'Direct', 
        url: 'https://github.com/craftstudioteam/CS-LAUNCHER-v3/releases/download/v3/CS-LAUNCHER-V3.apk', // 🔴 لینک V3 را اینجا جایگزین کنید
        recommended: true, 
        enabled: true 
      },
      { 
        id: 'v3-mirror1', 
        name: 'Mirror 1', 
        type: 'Direct', 
        url: 'https://github.com/craftstudioteam/CS-LAUNCHER-v3/releases/download/v3/CS-LAUNCHER-V3.apk', // 🔴 لینک میرror V3 را اینجا جایگزین کنید
        recommended: false, 
        enabled: true 
      },
      { 
        id: 'v3-mirror2', 
        name: 'Mirror 2', 
        type: 'Direct', 
        url: '#', // 🔴 غیرفعال - با # بماند یا لینک واقعی جایگزین شود
        recommended: false, 
        enabled: true 
      }
    ]
  }
};

// For adding new versions easily
const VERSION_KEYS = ['v1', 'v2', 'v3'];

// Load from localStorage or use defaults
let launcherData = {};

function loadData() {
  try {
    const stored = localStorage.getItem('cs_launcher_data');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all fields exist
      for (const key of VERSION_KEYS) {
        if (parsed[key]) {
          launcherData[key] = { ...DEFAULT_LAUNCHER_DATA[key], ...parsed[key] };
          // Deep merge downloads
          if (parsed[key].downloads) {
            launcherData[key].downloads = parsed[key].downloads;
          }
        } else {
          launcherData[key] = JSON.parse(JSON.stringify(DEFAULT_LAUNCHER_DATA[key]));
        }
      }
    } else {
      launcherData = JSON.parse(JSON.stringify(DEFAULT_LAUNCHER_DATA));
    }
  } catch (e) {
    console.warn('Failed to load data from localStorage, using defaults');
    launcherData = JSON.parse(JSON.stringify(DEFAULT_LAUNCHER_DATA));
  }
  return launcherData;
}

function saveData() {
  try {
    localStorage.setItem('cs_launcher_data', JSON.stringify(launcherData));
  } catch (e) {
    console.warn('Failed to save data to localStorage');
  }
}

function resetData() {
  launcherData = JSON.parse(JSON.stringify(DEFAULT_LAUNCHER_DATA));
  saveData();
  return launcherData;
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getLauncher(id) {
  return launcherData[id] || null;
}

function getLauncherByVersion(version) {
  for (const key of VERSION_KEYS) {
    if (launcherData[key] && launcherData[key].name === version) {
      return launcherData[key];
    }
  }
  return null;
}

// Initialize data
loadData();