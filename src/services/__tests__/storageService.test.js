import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../storageService.js';
import { INITIAL_KRITERIA } from '../../data/initialKriteria.js';
import { INITIAL_PELAMAR } from '../../data/initialPelamar.js';

describe('storageService', () => {
  it('should return initial criteria and applicants in non-browser/default environment', () => {
    const kriteria = storageService.getKriteria();
    expect(kriteria).toBeDefined();
    expect(kriteria.length).toBe(5);
    expect(kriteria[0].kode).toBe('C1');

    const pelamar = storageService.getPelamar();
    expect(pelamar).toBeDefined();
    expect(pelamar.length).toBe(8);
    expect(pelamar[0].nama).toBe('Asep Saepuloh');
  });

  it('should return reset default object', () => {
    const result = storageService.resetToDefault();
    expect(result.kriteria.length).toBe(5);
    expect(result.pelamar.length).toBe(8);
  });
});
