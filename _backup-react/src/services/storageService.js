import { INITIAL_KRITERIA } from '../data/initialKriteria.js';
import { INITIAL_PELAMAR, INITIAL_PENGATURAN, INITIAL_CONFIG } from '../data/initialPelamar.js';

// Schema Keys PRD Final v2.0
const STORAGE_KEYS = {
  KRITERIA: 'spk_kriteria',
  PELAMAR: 'spk_pelamar',
  CONFIG: 'spk_config'
};

// Legacy Keys (v1.0) for Migration Guard
const LEGACY_KEYS = [
  'spk_bps_kriteria',
  'spk_bps_pelamar',
  'spk_bps_pengaturan',
  'spk_bps_config'
];

// Helper internal untuk akses localStorage aman (mendukung node/test environment)
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function getStorageItem(key, defaultValue) {
  if (!isBrowser) return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function setStorageItem(key, value) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

export const storageService = {
  // Migration Guard: Jika ditemukan key lama (spk_bps_*), bersihkan dan reinisialisasi schema baru v2.0
  checkAndMigrateLegacyKeys() {
    if (!isBrowser) return;
    let foundLegacy = false;
    LEGACY_KEYS.forEach(legacyKey => {
      if (window.localStorage.getItem(legacyKey) !== null) {
        window.localStorage.removeItem(legacyKey);
        foundLegacy = true;
      }
    });

    if (foundLegacy) {
      console.info('[StorageService] Legacy keys (spk_bps_*) detected and wiped. Re-initializing to PRD v2.0 schema.');
      window.localStorage.removeItem(STORAGE_KEYS.KRITERIA);
      window.localStorage.removeItem(STORAGE_KEYS.PELAMAR);
      window.localStorage.removeItem(STORAGE_KEYS.CONFIG);
      this.saveKriteria(INITIAL_KRITERIA);
      this.savePelamar(INITIAL_PELAMAR);
      this.saveConfig(INITIAL_CONFIG);
    }
  },

  // Inisialisasi awal jika localStorage masih kosong atau belum dimigrasi
  initStorage() {
    if (!isBrowser) return;
    this.checkAndMigrateLegacyKeys();

    if (!window.localStorage.getItem(STORAGE_KEYS.KRITERIA)) {
      this.saveKriteria(INITIAL_KRITERIA);
    } else {
      this.getKriteria();
    }
    if (!window.localStorage.getItem(STORAGE_KEYS.PELAMAR)) {
      this.savePelamar(INITIAL_PELAMAR);
    } else {
      this.getPelamar();
    }
    if (!window.localStorage.getItem(STORAGE_KEYS.CONFIG)) {
      this.saveConfig(INITIAL_CONFIG);
    }
  },

  // Kriteria (PRD v2.0: memuat tingkatKepentingan skala 1-5 & bobot w_j)
  getKriteria() {
    this.checkAndMigrateLegacyKeys();
    const raw = getStorageItem(STORAGE_KEYS.KRITERIA, INITIAL_KRITERIA);
    if (!Array.isArray(raw)) return INITIAL_KRITERIA;
    
    // Migrasi data kriteria lama jika belum memiliki tingkatKepentingan
    const hasTingkatKepentingan = raw.every(c => c.tingkatKepentingan !== undefined);
    if (!hasTingkatKepentingan) {
      this.saveKriteria(INITIAL_KRITERIA);
      return INITIAL_KRITERIA;
    }
    return raw;
  },
  saveKriteria(kriteria) {
    setStorageItem(STORAGE_KEYS.KRITERIA, kriteria);
    return kriteria;
  },

  // Pelamar (PRD v2.0: memuat c1_mentah s.d. c5_mentah tanpa C4 numerik)
  getPelamar() {
    this.checkAndMigrateLegacyKeys();
    const raw = getStorageItem(STORAGE_KEYS.PELAMAR, INITIAL_PELAMAR);
    if (!Array.isArray(raw)) return INITIAL_PELAMAR;

    // Normalisasi/sanitasi jika data pelamar masih berformat lama (C1..C5)
    let needsResave = false;
    const sanitized = raw.map(p => {
      const c1 = p.c1_mentah !== undefined ? Number(p.c1_mentah) : (p.C1 !== undefined ? Number(p.C1) : 75);
      const c2 = p.c2_mentah !== undefined ? Number(p.c2_mentah) : (p.C2 !== undefined ? Number(p.C2) : 1);
      const c3 = p.c3_mentah !== undefined ? Number(p.c3_mentah) : (p.C3 !== undefined ? Number(p.C3) : 80);
      const c4 = p.c4_mentah || p.pendidikan || 'SMA/SMK';
      const c5 = p.c5_mentah !== undefined ? Number(p.c5_mentah) : (p.C5 !== undefined ? Number(p.C5) : 5.0);

      if (p.c1_mentah === undefined || p.c4_mentah === undefined) {
        needsResave = true;
      }

      return {
        ...p,
        c1_mentah: c1,
        c2_mentah: c2,
        c3_mentah: c3,
        c4_mentah: c4,
        c5_mentah: c5,
        // Backward-compatible getters
        pendidikan: c4,
        C1: c1,
        C2: c2,
        C3: c3,
        C5: c5
      };
    });

    if (needsResave) {
      this.savePelamar(sanitized);
    }
    return sanitized;
  },
  savePelamar(pelamar) {
    setStorageItem(STORAGE_KEYS.PELAMAR, pelamar);
    return pelamar;
  },

  // Pengaturan / Config (spk_config)
  getConfig() {
    this.checkAndMigrateLegacyKeys();
    return getStorageItem(STORAGE_KEYS.CONFIG, INITIAL_CONFIG);
  },
  saveConfig(config) {
    setStorageItem(STORAGE_KEYS.CONFIG, config);
    return config;
  },

  // Aliases for compatibility
  getPengaturan() {
    return this.getConfig();
  },
  savePengaturan(pengaturan) {
    return this.saveConfig(pengaturan);
  },

  // Muat ulang 8 data sampel Subang saja (tanpa mereset bobot kriteria)
  loadSampleSubang() {
    return this.savePelamar(INITIAL_PELAMAR);
  },

  // Reset total seluruh sistem ke kondisi default pabrik PRD v2.0
  resetToDefault() {
    this.saveKriteria(INITIAL_KRITERIA);
    this.savePelamar(INITIAL_PELAMAR);
    this.saveConfig(INITIAL_CONFIG);
    return {
      kriteria: INITIAL_KRITERIA,
      pelamar: INITIAL_PELAMAR,
      config: INITIAL_CONFIG,
      pengaturan: INITIAL_CONFIG
    };
  }
};
