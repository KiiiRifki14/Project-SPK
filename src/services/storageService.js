import { INITIAL_KRITERIA } from '../data/initialKriteria.js';
import { INITIAL_PELAMAR, INITIAL_PENGATURAN } from '../data/initialPelamar.js';

const STORAGE_KEYS = {
  KRITERIA: 'spk_bps_kriteria',
  PELAMAR: 'spk_bps_pelamar',
  PENGATURAN: 'spk_bps_pengaturan'
};

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
  // Inisialisasi awal jika localStorage masih kosong
  initStorage() {
    if (!isBrowser) return;
    if (!window.localStorage.getItem(STORAGE_KEYS.KRITERIA)) {
      this.saveKriteria(INITIAL_KRITERIA);
    }
    if (!window.localStorage.getItem(STORAGE_KEYS.PELAMAR)) {
      this.savePelamar(INITIAL_PELAMAR);
    }
    if (!window.localStorage.getItem(STORAGE_KEYS.PENGATURAN)) {
      this.savePengaturan(INITIAL_PENGATURAN);
    }
  },

  // Kriteria
  getKriteria() {
    return getStorageItem(STORAGE_KEYS.KRITERIA, INITIAL_KRITERIA);
  },
  saveKriteria(kriteria) {
    setStorageItem(STORAGE_KEYS.KRITERIA, kriteria);
    return kriteria;
  },

  // Pelamar
  getPelamar() {
    return getStorageItem(STORAGE_KEYS.PELAMAR, INITIAL_PELAMAR);
  },
  savePelamar(pelamar) {
    setStorageItem(STORAGE_KEYS.PELAMAR, pelamar);
    return pelamar;
  },

  // Pengaturan
  getPengaturan() {
    return getStorageItem(STORAGE_KEYS.PENGATURAN, INITIAL_PENGATURAN);
  },
  savePengaturan(pengaturan) {
    setStorageItem(STORAGE_KEYS.PENGATURAN, pengaturan);
    return pengaturan;
  },

  // Muat ulang 8 data sampel Subang saja (tanpa mereset bobot kriteria)
  loadSampleSubang() {
    return this.savePelamar(INITIAL_PELAMAR);
  },

  // Reset total seluruh sistem ke kondisi default pabrik
  resetToDefault() {
    this.saveKriteria(INITIAL_KRITERIA);
    this.savePelamar(INITIAL_PELAMAR);
    this.savePengaturan(INITIAL_PENGATURAN);
    return {
      kriteria: INITIAL_KRITERIA,
      pelamar: INITIAL_PELAMAR,
      pengaturan: INITIAL_PENGATURAN
    };
  }
};
