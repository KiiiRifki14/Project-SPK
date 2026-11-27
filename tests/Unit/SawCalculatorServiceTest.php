<?php

namespace Tests\Unit;

use App\Services\SawCalculatorService;
use PHPUnit\Framework\TestCase;

class SawCalculatorServiceTest extends TestCase
{
    private SawCalculatorService $service;

    /** @var array<int, array<string, mixed>> */
    private array $dummyCriteria;

    /** @var array<int, array<string, mixed>> */
    private array $dummyApplicants;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new SawCalculatorService();

        $this->dummyCriteria = [
            ['kode' => 'C1', 'sifat' => 'benefit', 'tingkat_kepentingan' => 5, 'bobot' => 0.2778],
            ['kode' => 'C2', 'sifat' => 'benefit', 'tingkat_kepentingan' => 4, 'bobot' => 0.2222],
            ['kode' => 'C3', 'sifat' => 'benefit', 'tingkat_kepentingan' => 4, 'bobot' => 0.2222],
            ['kode' => 'C4', 'sifat' => 'benefit', 'tingkat_kepentingan' => 3, 'bobot' => 0.1667],
            ['kode' => 'C5', 'sifat' => 'cost', 'tingkat_kepentingan' => 2, 'bobot' => 0.1111],
        ];

        $this->dummyApplicants = [
            [
                'id' => 1,
                'nama' => 'Asep Saepuloh',
                'c1_mentah' => 88.5,
                'c2_mentah' => 4,
                'c3_mentah' => 92.0,
                'c4_mentah' => 'S1',
                'c5_mentah' => 3.2,
            ],
            [
                'id' => 2,
                'nama' => 'Siti Nurhaliza',
                'c1_mentah' => 95.0,
                'c2_mentah' => 2,
                'c3_mentah' => 85.0,
                'c4_mentah' => 'S1',
                'c5_mentah' => 1.5,
            ],
            [
                'id' => 3,
                'nama' => 'Dadan Ramdani',
                'c1_mentah' => 74.0,
                'c2_mentah' => 5,
                'c3_mentah' => 80.0,
                'c4_mentah' => 'D3',
                'c5_mentah' => 8.5,
            ],
        ];
    }

    public function test_converts_raw_data_to_crisp_scale_1_to_5(): void
    {
        $this->assertSame(['C1' => 5, 'C2' => 4, 'C3' => 5, 'C4' => 5, 'C5' => 2], $this->service->convertRawToCrisp($this->dummyApplicants[0]));
        $this->assertSame(['C1' => 5, 'C2' => 3, 'C3' => 5, 'C4' => 5, 'C5' => 1], $this->service->convertRawToCrisp($this->dummyApplicants[1]));
        $this->assertSame(['C1' => 3, 'C2' => 5, 'C3' => 4, 'C4' => 3, 'C5' => 3], $this->service->convertRawToCrisp($this->dummyApplicants[2]));
    }

    public function test_calculates_weights_from_priority_correctly(): void
    {
        $calculated = $this->service->calculateWeightsFromPriority($this->dummyCriteria);

        $this->assertSame(0.2778, $calculated[0]['bobot']);
        $this->assertSame(0.2222, $calculated[1]['bobot']);
        $this->assertSame(0.2222, $calculated[2]['bobot']);
        $this->assertSame(0.1667, $calculated[3]['bobot']);
        $this->assertSame(0.1111, $calculated[4]['bobot']);
        $this->assertTrue($this->service->validateBobot($calculated)['isValid']);
    }

    public function test_calculates_extremes_and_normalizes_benefit_and_cost(): void
    {
        $result = $this->service->calculate($this->dummyApplicants, $this->dummyCriteria);

        $this->assertEquals(5, $result['extremes']['C1']['max']);
        $this->assertEquals(3, $result['extremes']['C1']['min']);
        $this->assertEquals(1, $result['extremes']['C5']['min']);
        $this->assertEquals(3, $result['extremes']['C5']['max']);

        $rowAsep = collect($result['matrixR'])->firstWhere('id', 1);
        $rowSiti = collect($result['matrixR'])->firstWhere('id', 2);
        $rowDadan = collect($result['matrixR'])->firstWhere('id', 3);

        $this->assertEquals(1.0, $rowAsep['R']['C1']);
        $this->assertEquals(1.0, $rowSiti['R']['C1']);
        $this->assertEquals(0.6, $rowDadan['R']['C1']);

        $this->assertEquals(1.0, $rowSiti['R']['C5']);
        $this->assertEquals(0.5, $rowAsep['R']['C5']);
        $this->assertEquals(0.3333, $rowDadan['R']['C5']);
    }

    public function test_applies_tie_breaker_c1_then_c2_then_c5(): void
    {
        $tieApplicants = [
            ['id' => 10, 'nama' => 'Kandidat A', 'c1_mentah' => 80, 'c2_mentah' => 3, 'c3_mentah' => 80, 'c4_mentah' => 'D3', 'c5_mentah' => 5.0],
            ['id' => 11, 'nama' => 'Kandidat B', 'c1_mentah' => 84, 'c2_mentah' => 3, 'c3_mentah' => 80, 'c4_mentah' => 'D3', 'c5_mentah' => 5.0],
        ];

        $result = $this->service->calculate($tieApplicants, $this->dummyCriteria);

        $this->assertSame(11, $result['ranking'][0]['id']);
        $this->assertTrue($result['ranking'][0]['isTie']);
    }

    public function test_assigns_status_based_on_kuota_lolos_and_cadangan(): void
    {
        $result = $this->service->calculate($this->dummyApplicants, $this->dummyCriteria, 1, 1);

        $this->assertSame('Lolos', $result['ranking'][0]['status']);
        $this->assertSame('Cadangan', $result['ranking'][1]['status']);
        $this->assertSame('Tidak Lolos', $result['ranking'][2]['status']);
    }
}
