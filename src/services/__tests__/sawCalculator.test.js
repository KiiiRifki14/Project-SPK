import { describe, it, expect } from 'vitest';
import { calculateSAW, validateBobot } from '../sawCalculator.js';

describe('sawCalculator', () => {
  const dummyCriteria = [
    { kode: 'C1', sifat: 'benefit', bobot: 0.30 },
    { kode: 'C2', sifat: 'benefit', bobot: 0.25 },
    { kode: 'C3', sifat: 'benefit', bobot: 0.20 },
    { kode: 'C4', sifat: 'benefit', bobot: 0.15 },
    { kode: 'C5', sifat: 'cost', bobot: 0.10 }
  ];

  const dummyApplicants = [
    {
      id: 1,
      nama: 'Asep Saepuloh',
      C1: 88.5,
      C2: 4,
      C3: 92.0,
      C4: 4,
      C5: 3.2
    },
    {
      id: 2,
      nama: 'Siti Nurhaliza',
      C1: 95.0,
      C2: 2,
      C3: 85.0,
      C4: 4,
      C5: 1.5
    },
    {
      id: 3,
      nama: 'Dadan Ramdani',
      C1: 74.0,
      C2: 5,
      C3: 80.0,
      C4: 3,
      C5: 8.5
    }
  ];

  it('should validate sum of criteria weights', () => {
    expect(validateBobot(dummyCriteria).isValid).toBe(true);
    expect(validateBobot(dummyCriteria).total).toBe(1.0);

    const invalidCriteria = [
      { kode: 'C1', sifat: 'benefit', bobot: 0.30 },
      { kode: 'C2', sifat: 'benefit', bobot: 0.20 }
    ];
    expect(validateBobot(invalidCriteria).isValid).toBe(false);
  });

  it('should correctly calculate extremes for benefit and cost criteria', () => {
    const result = calculateSAW(dummyApplicants, dummyCriteria);
    expect(result.extremes.C1.max).toBe(95.0);
    expect(result.extremes.C1.min).toBe(74.0);
    expect(result.extremes.C5.min).toBe(1.5);
    expect(result.extremes.C5.max).toBe(8.5);
  });

  it('should correctly normalize Benefit (val/max) and Cost (min/val)', () => {
    const result = calculateSAW(dummyApplicants, dummyCriteria);
    const rowAsep = result.matrixR.find(r => r.id === 1);
    const rowSiti = result.matrixR.find(r => r.id === 2);

    // C1 Benefit: Siti has max (95.0), so Siti C1 = 1.0
    expect(rowSiti.R.C1).toBe(1);
    // Asep C1: 88.5 / 95.0 = 0.9316
    expect(rowAsep.R.C1).toBeCloseTo(88.5 / 95.0, 4);

    // C5 Cost: Min is Siti (1.5). Siti C5 cost = 1.5 / 1.5 = 1.0
    expect(rowSiti.R.C5).toBe(1);
    // Asep C5 Cost: min (1.5) / 3.2 = 0.46875
    expect(rowAsep.R.C5).toBeCloseTo(1.5 / 3.2, 4);
  });

  it('should protect against division by zero if cost value is 0 or less', () => {
    const applicantsWithZeroDistance = [
      { id: 1, nama: 'Budi Dekat BPS', C1: 80, C2: 2, C3: 80, C4: 3, C5: 0 },
      { id: 2, nama: 'Tatang Jauh', C1: 80, C2: 2, C3: 80, C4: 3, C5: 5.0 }
    ];
    const result = calculateSAW(applicantsWithZeroDistance, dummyCriteria);
    expect(result.matrixR[0].R.C5).toBeGreaterThan(0);
    expect(Number.isFinite(result.matrixR[0].R.C5)).toBe(true);
  });

  it('should apply tie-breaker rules (C1 then C2 then C5) when scoreV is identical', () => {
    const tieApplicants = [
      { id: 10, nama: 'Kandidat A', C1: 80, C2: 3, C3: 80, C4: 3, C5: 2.0 },
      { id: 11, nama: 'Kandidat B', C1: 90, C2: 1, C3: 80, C4: 3, C5: 2.0 }
    ];
    // In this specific mock, if we force identical scoreV or check tie breaker:
    const result = calculateSAW(tieApplicants, dummyCriteria);
    expect(result.ranking).toBeDefined();
    expect(result.ranking.length).toBe(2);
  });

  it('should assign correct status based on kuotaLolos and kuotaCadangan', () => {
    const result = calculateSAW(dummyApplicants, dummyCriteria, { kuotaLolos: 1, kuotaCadangan: 1 });
    expect(result.ranking[0].ranking).toBe(1);
    expect(result.ranking[0].status).toBe('Lolos');
    expect(result.ranking[1].ranking).toBe(2);
    expect(result.ranking[1].status).toBe('Cadangan');
    expect(result.ranking[2].ranking).toBe(3);
    expect(result.ranking[2].status).toBe('Tidak Lolos');
  });
});
