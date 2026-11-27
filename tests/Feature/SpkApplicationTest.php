<?php

namespace Tests\Feature;

use App\Models\Kriteria;
use App\Models\Pelamar;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SpkApplicationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get('/')->assertRedirect('/login');
        $this->get('/login')->assertStatus(200)->assertSee('SPK');
    }

    public function test_all_six_modules_render_for_authenticated_user(): void
    {
        $superadmin = User::where('email', 'superadmin@bpssubang.go.id')->firstOrFail();

        $this->actingAs($superadmin);

        $this->get(route('dashboard'))->assertOk()->assertSee('Sistem Pendukung Keputusan');
        $this->get(route('kriteria.index'))->assertOk()->assertSee('Manajemen Kriteria');
        $this->get(route('pelamar.index'))->assertOk()->assertSee('Asep Saepuloh');
        $this->get(route('dapur.index'))->assertOk()->assertSee('Tabel 1: Data Mentah');
        $this->get(route('ranking.index'))->assertOk()->assertSee('Leaderboard Hasil Perangkingan');
        $this->get(route('laporan.index'))->assertOk()->assertSee('BERITA ACARA PENETAPAN HASIL SELEKSI');
    }

    public function test_rbac_blocks_panitia_from_superadmin_actions(): void
    {
        $panitia = User::where('email', 'panitia@bpssubang.go.id')->firstOrFail();
        $kriteria = Kriteria::where('kode', 'C1')->firstOrFail();

        $this->actingAs($panitia);

        // Panitia cannot update kriteria weights
        $this->put(route('kriteria.update', $kriteria), ['tingkat_kepentingan' => 1])
            ->assertRedirect();
        $this->assertSame(5, $kriteria->fresh()->tingkat_kepentingan);

        // Panitia cannot update SK settings
        $this->put(route('laporan.pengaturan'), [
            'nomor_sk' => 'HACKED-SK',
            'nama_periode' => 'Test',
            'tanggal_sk' => '2026-11-27',
            'ketua_panitia_nama' => 'X',
            'kepala_bps_nama' => 'Y',
            'kepala_bps_nip' => '123',
        ])->assertRedirect();

        // Panitia sees read-only notice on Kriteria page
        $this->get(route('kriteria.index'))->assertSee('Read-Only');
    }

    public function test_superadmin_can_update_kriteria_and_auto_normalize_weights(): void
    {
        $superadmin = User::where('email', 'superadmin@bpssubang.go.id')->firstOrFail();
        $c5 = Kriteria::where('kode', 'C5')->firstOrFail();

        $this->actingAs($superadmin);

        $this->put(route('kriteria.update', $c5), ['tingkat_kepentingan' => 4])
            ->assertRedirect(route('kriteria.index'));

        // Total kepentingan becomes 5+4+4+3+4 = 20, so C5 bobot = 4/20 = 0.2000
        $this->assertSame(4, $c5->fresh()->tingkat_kepentingan);
        $this->assertEquals(0.2000, $c5->fresh()->bobot);
    }

    public function test_pelamar_crud_and_excel_exports_work(): void
    {
        $panitia = User::where('email', 'panitia@bpssubang.go.id')->firstOrFail();
        $this->actingAs($panitia);

        // Create
        $this->post(route('pelamar.store'), [
            'nik' => '3213999988887777',
            'nama' => 'Ujang Subang',
            'jenis_kelamin' => 'L',
            'no_hp' => '081200001111',
            'kecamatan' => 'Subang Kota',
            'c1_mentah' => 90,
            'c2_mentah' => 4,
            'c3_mentah' => 88,
            'c4_mentah' => 'S1',
            'c5_mentah' => 2.5,
        ])->assertRedirect(route('pelamar.index'));

        $pelamar = Pelamar::where('nik', '3213999988887777')->firstOrFail();
        $this->assertSame('Ujang Subang', $pelamar->nama);

        // Export Excel endpoints
        $this->get(route('pelamar.export'))
            ->assertOk()
            ->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        $this->get(route('ranking.export'))
            ->assertOk()
            ->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Delete
        $this->delete(route('pelamar.destroy', $pelamar))->assertRedirect(route('pelamar.index'));
        $this->assertDatabaseMissing('pelamars', ['id' => $pelamar->id]);
    }
}
