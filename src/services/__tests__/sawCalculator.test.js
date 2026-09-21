import { describe, it, expect } from 'vitest';
import { 
  calculateSAW, 
  validateBobot, 
  convertRawToCrisp, 
  calculateWeightsFromPriority 
} from '../sawCalculator.js';

describe('sawCalculator - PRD Final v2.0.0 Specifications', () => {
  const dummyCriteria = [
    { kode: 'C1', sifat: 'benefit', tingkatKepentingan: 5, bobot: 0.2778 },
    { kode: 'C2', sifat: 'benefit', tingkatKepentingan: 4, bobot: 0.2222 },
    { kode: 'C3', sifat: 'benefit', tingkatKepentingan: 4, bobot: 0.2222 },
    { kode: 'C4', sifat: 'benefit', tingkatKepentingan: 3, bobot: 0.1667 },
    { kode: 'C5', sifat: 'cost', tingkatKepentingan: 2, bobot: 0.1111 }
  ];

  const dummyApplicants = [
    {
      id: 1,
      nama: 'Asep Saepuloh',
      pendidikan: 'S1',
      C1: 88.5, // >=85 -> Crisp 5
      C2: 4,    // 3-4  -> Crisp 4
      C3: 92.0, // >=85 -> Crisp 5
      C4: 5,    // S1   -> Crisp 5
      C5: 3.2   // 3.1-7 -> Crisp 2
    },
    {
      id: 2,
      nama: 'Siti Nurhaliza',
      pendidikan: 'S1',
      C1: 95.0, // >=85 -> Crisp 5
      C2: 2,    // 1-2  -> Crisp 3
      C3: 85.0, // >=85 -> Crisp 5
      C4: 5,    // S1   -> Crisp 5
      C5: 1.5   // <=3  -> Crisp 1
    },
    {
      id: 3,
      nama: 'Dadan Ramdani',
      pendidikan: 'D3',
      C1: 74.0, // 65-74.9 -> Crisp 3
      C2: 5,    // >=5     -> Crisp 5
      C3: 80.0, // 75-84.9 -> Crisp 4
      C4: 3,    // D3      -> Crisp 3
      C5: 8.5   // 7.1-15  -> Crisp 3
    }
  ];

  it('should convert raw data to crisp (1 - 5) based on Section 2.2', () => {
    const crispAsep = convertRawToCrisp(dummyApplicants[0]);
    expect(crispAsep).toEqual({
      C1: 5,
      C2: 4,
      C3: 5,
      C4: 5,
      C5: 2
    });

    const crispSiti = convertRawToCrisp(dummyApplicants[1]);
    expect(crispSiti).toEqual({
      C1: 5,
      C2: 3,
      C3: 5,
      C4: 5,
      C5: 1
    });

    const crispDadan = convertRawToCrisp(dummyApplicants[2]);
    expect(crispDadan).toEqual({
      C1: 3,
      C2: 5,
      C3: 4,
      C4: 3,
      C5: 3
    });
  });

  it('should calculate weights w_j from tingkatKepentingan based on Section 2.1', () => {
    const calculated = calculateWeightsFromPriority(dummyCriteria);
    expect(calculated[0].bobot).toBe(0.2778); // 5/18
    expect(calculated[1].bobot).toBe(0.2222); // 4/18
    expect(calculated[2].bobot).toBe(0.2222); // 4/18
    expect(calculated[3].bobot).toBe(0.1667); // 3/18
    expect(calculated[4].bobot).toBe(0.1111); // 2/18
    expect(validateBobot(calculated).isValid).toBe(true);
  });

  it('should correctly calculate extremes on crisp matrix X (Benefit: Max, Cost: Min)', () => {
    const result = calculateSAW(dummyApplicants, dummyCriteria);
    // Benefit C1 crisp values: Asep=5, Siti=5, Dadan=3. Max = 5, Min = 3
    expect(result.extremes.C1.max).toBe(5);
    expect(result.extremes.C1.min).toBe(3);

    // Cost C5 crisp values: Asep=2, Siti=1, Dadan=3. Min = 1, Max = 3
    expect(result.extremes.C5.min).toBe(1);
    expect(result.extremes.C5.max).toBe(3);
  });

  it('should correctly normalize Benefit (x_ij / max) and Cost (min / x_ij) on crisp values', () => {
    const result = calculateSAW(dummyApplicants, dummyCriteria);
    const rowAsep = result.matrixR.find(r => r.id === 1);
    const rowSiti = result.matrixR.find(r => r.id === 2);
    const rowDadan = result.matrixR.find(r => r.id === 3);

    // C1 Benefit: Max is 5
    expect(rowAsep.R.C1).toBe(1); // 5/5
    expect(rowSiti.R.C1).toBe(1); // 5/5
    expect(rowDadan.R.C1).toBe(0.6); // 3/5

    // C5 Cost: Min is 1 (Siti)
    expect(rowSiti.R.C5).toBe(1); // 1/1 = 1.0
    expect(rowAsep.R.C5).toBe(0.5); // 1/2 = 0.5
    expect(rowDadan.R.C5).toBeCloseTo(1 / 3, 4); // 1/3 = 0.3333
  });

  it('should provide both raw data and crisp matrix X in the result', () => {
    const result = calculateSAW(dummyApplicants, dummyCriteria);
    expect(result.matrixRaw).toBeDefined();
    expect(result.matrixRaw.length).toBe(3);
    expect(result.matrixRaw[0].C1).toBe(88.5);

    expect(result.matrixX).toBeDefined();
    expect(result.matrixX.length).toBe(3);
    expect(result.matrixX[0].C1).toBe(5);
  });

  it('should apply tie-breaker rules (C1 then C2 then C5) when scoreV is identical', () => {
    const tieApplicants = [
      { id: 10, nama: 'Kandidat A', C1: 80, C2: 3, C3: 80, C4: 'D3', C5: 5.0 },
      { id: 11, nama: 'Kandidat B', C1: 84, C2: 3, C3: 80, C4: 'D3', C5: 5.0 }
    ];
    // Both C1 are in range 75 - 84.9 -> Crisp 4, so their V scores will be identical
    const result = calculateSAW(tieApplicants, dummyCriteria);
    expect(result.ranking[0].id).toBe(11); // Kandidat B ranks higher due to higher raw C1 (84 > 80)
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
