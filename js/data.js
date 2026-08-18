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
        url: '/api/download/v1/main', // 🔴 لینک V1 را اینجا جایگزین کنید
        recommended: true, 
        enabled: true 
      },
      { 
        id: 'v1-mirror1', 
        name: 'Mirror 1', 
        type: 'Direct', 
        url: '/api/download/v1/main', // 🔴 لینک میرror V1 را اینجا جایگزین کنید
        recommended: false, 
        enabled: true 
      },
      { 
        id: 'v1-mirror2', 
        name: 'Mirror 2', 
        type: 'Direct', 
        url: '/api/download/v1/main', // 🔴 غیرفعال - با # بماند یا لینک واقعی جایگزین شود
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
        url: '/api/download/v2/main', // 🔴 لینک V2 را اینجا جایگزین کنید
        recommended: true, 
        enabled: true 
      },
      { 
        id: 'v2-mirror1', 
        name: 'Mirror 1', 
        type: 'Direct', 
        url: '/api/download/v2/main', // 🔴 لینک میرror V2 را اینجا جایگزین کنید
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
        url: '/api/download/v3/main', // 🔴 لینک V3 را اینجا جایگزین کنید
        recommended: true, 
        enabled: true 
      },
      { 
        id: 'v3-mirror1', 
        name: 'Mirror 1', 
        type: 'Direct', 
        url: '/api/download/v3/main', // 🔴 لینک میرror V3 را اینجا جایگزین کنید
        recommended: false, 
        enabled: true 
      },
      { 
        id: 'v3-mirror2', 
        name: 'Mirror 2', 
        type: 'Direct', 
        url: '#', // 🔴 غیرفعال - لینک واقعی را جایگزین کنید
        recommended: false, 
        enabled: false 
      }
    ]
  }
};

// For adding new versions easily
const VERSION_KEYS = ['v1', 'v2', 'v3'];

// Load from localStorage or use defaults
let launcherData = {};

function loadData() {
  const defaults = JSON.parse(JSON.stringify(DEFAULT_LAUNCHER_DATA));

  try {
    const stored = localStorage.getItem('cs_launcher_data');
    if (!stored) {
      launcherData = defaults;
      return launcherData;
    }

    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Invalid saved data');
    }

    launcherData = {};
    for (const key of VERSION_KEYS) {
      const saved = parsed[key];
      const base = defaults[key];

      if (!saved || typeof saved !== 'object' || Array.isArray(saved)) {
        launcherData[key] = base;
        continue;
      }

      launcherData[key] = { ...base, ...saved };

      // Downloads must always be an array.
      launcherData[key].downloads = Array.isArray(saved.downloads)
        ? saved.downloads.filter(d => d && typeof d === 'object').map((d, i) => ({
            id: String(d.id || `dl-${key}-${i}`),
            name: String(d.name || `لینک ${i + 1}`),
            type: String(d.type || 'Direct'),
            url: typeof d.url === 'string' ? d.url : '#',
            recommended: d.recommended === true,
            enabled: d.enabled !== false
          }))
        : base.downloads;

      // Keep these fields safe for rendering.
      launcherData[key].features = Array.isArray(saved.features)
        ? saved.features.map(String).filter(Boolean)
        : base.features;
    }

    return launcherData;
  } catch (e) {
    console.warn('Failed to load data from localStorage, using defaults', e);
    launcherData = defaults;
    return launcherData;
  }
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