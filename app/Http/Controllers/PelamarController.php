<?php

namespace App\Http\Controllers;

use App\Models\Pelamar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PelamarController extends Controller
{
    public function index(Request $request): View
    {
        $search = trim((string) $request->query('search', ''));
        $selectedKecamatan = (string) $request->query('kecamatan', 'Semua');

        $query = Pelamar::query()->orderBy('id');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%")
                    ->orWhere('no_hp', 'like', "%{$search}%");
            });
        }

        if ($selectedKecamatan !== '' && $selectedKecamatan !== 'Semua') {
            $query->where('kecamatan', $selectedKecamatan);
        }

        return view('pages.pelamar', [
            'pelamar' => $query->get(),
            'totalPelamar' => Pelamar::query()->count(),
            'search' => $search,
            'selectedKecamatan' => $selectedKecamatan,
            'kecamatanList' => config('spk.kecamatan_subang'),
            'pendidikanOptions' => config('spk.pendidikan_options'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatePelamar($request);

        $nextNum = ((int) Pelamar::query()->max('id')) + 1;
        $data['kode_pelamar'] = 'PLM-'.str_pad((string) $nextNum, 3, '0', STR_PAD_LEFT).'-'.substr((string) time(), -3);

        Pelamar::query()->create($data);

        return redirect()->route('pelamar.index')->with('alert', [
            'type' => 'success',
            'message' => "Pelamar baru \"{$data['nama']}\" berhasil ditambahkan dan dihitung SAW!",
        ]);
    }

    public function update(Request $request, Pelamar $pelamar): RedirectResponse
    {
        $data = $this->validatePelamar($request);
        $pelamar->update($data);

        return redirect()->route('pelamar.index')->with('alert', [
            'type' => 'success',
            'message' => "Data pelamar \"{$pelamar->nama}\" berhasil diperbarui!",
        ]);
    }

    public function destroy(Pelamar $pelamar): RedirectResponse
    {
        $nama = $pelamar->nama;
        $pelamar->delete();

        return redirect()->route('pelamar.index')->with('alert', [
            'type' => 'info',
            'message' => "Data pelamar \"{$nama}\" telah dihapus.",
        ]);
    }

    public function exportExcel(): StreamedResponse
    {
        $pelamars = Pelamar::query()->orderBy('id')->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Data Pelamar BPS');

        $headers = [
            'No',
            'NIK',
            'Nama Lengkap',
            'Jenis Kelamin',
            'Nomor HP',
            'Kecamatan',
            'Pendidikan Terakhir',
            'C1 (Nilai Ujian)',
            'C2 (Riwayat Survei)',
            'C3 (Skor CAPI)',
            'C5 (Jarak Wilayah KM)',
        ];

        $sheet->fromArray($headers, null, 'A1');

        foreach ($pelamars as $idx => $p) {
            $sheet->fromArray([
                $idx + 1,
                (string) $p->nik,
                $p->nama,
                $p->jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
                $p->no_hp ?: '-',
                $p->kecamatan,
                $p->c4_mentah,
                $p->c1_mentah,
                $p->c2_mentah,
                $p->c3_mentah,
                $p->c5_mentah,
            ], null, 'A'.($idx + 2));
        }

        $filename = 'Data_Pelamar_Mitra_BPS_Subang_'.now()->format('Y-m-d').'.xlsx';

        return response()->streamDownload(function () use ($spreadsheet): void {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    public function importExcel(Request $request): RedirectResponse
    {
        $request->validate([
            'excel_file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:5120'],
        ], [
            'excel_file.required' => 'Pilih file Excel (.xlsx / .xls / .csv) terlebih dahulu.',
            'excel_file.mimes' => 'Format file harus .xlsx, .xls, atau .csv.',
        ]);

        try {
            $spreadsheet = IOFactory::load($request->file('excel_file')->getRealPath());
            $rows = $spreadsheet->getActiveSheet()->toArray(null, true, true, false);

            if (count($rows) < 2) {
                return redirect()->route('pelamar.index')->with('alert', [
                    'type' => 'error',
                    'message' => 'File Excel kosong atau tidak memiliki baris data pelamar.',
                ]);
            }

            $headers = array_map(fn ($h) => strtolower(trim((string) $h)), $rows[0]);
            $importedCount = 0;

            foreach (array_slice($rows, 1) as $idx => $row) {
                $mapped = [];
                foreach ($headers as $colIdx => $headerName) {
                    $mapped[$headerName] = $row[$colIdx] ?? null;
                }

                $nama = trim((string) ($mapped['nama lengkap'] ?? $mapped['nama'] ?? ''));
                if ($nama === '') {
                    continue;
                }

                $rawGender = strtoupper(trim((string) ($mapped['jenis kelamin'] ?? $mapped['kelamin'] ?? 'L')));
                $rawPendidikan = strtoupper(trim((string) ($mapped['pendidikan terakhir'] ?? $mapped['pendidikan'] ?? $mapped['c4'] ?? 'SMA/SMK')));
                $pendidikan = match (true) {
                    str_contains($rawPendidikan, 'S1') || str_contains($rawPendidikan, 'D4') => 'S1',
                    str_contains($rawPendidikan, 'D3') => 'D3',
                    default => 'SMA/SMK',
                };

                $c1 = (float) ($mapped['c1 (nilai ujian)'] ?? $mapped['c1'] ?? 75);
                $c2 = (int) ($mapped['c2 (riwayat survei)'] ?? $mapped['c2'] ?? 1);
                $c3 = (float) ($mapped['c3 (skor capi)'] ?? $mapped['c3'] ?? 80);
                $c5 = max(0.1, (float) ($mapped['c5 (jarak wilayah km)'] ?? $mapped['c5'] ?? 5.0));

                Pelamar::query()->create([
                    'kode_pelamar' => 'IMP-'.substr((string) time(), -4).'-'.($idx + 1).'-'.random_int(10, 99),
                    'nik' => trim((string) ($mapped['nik'] ?? '321300000000000'.($idx + 1))),
                    'nama' => $nama,
                    'jenis_kelamin' => str_starts_with($rawGender, 'P') ? 'P' : 'L',
                    'no_hp' => trim((string) ($mapped['nomor hp'] ?? $mapped['no hp'] ?? $mapped['no_hp'] ?? '-')),
                    'kecamatan' => trim((string) ($mapped['kecamatan'] ?? 'Subang Kota')) ?: 'Subang Kota',
                    'c1_mentah' => min(100, max(0, $c1)),
                    'c2_mentah' => max(0, $c2),
                    'c3_mentah' => min(100, max(0, $c3)),
                    'c4_mentah' => $pendidikan,
                    'c5_mentah' => $c5,
                ]);
                $importedCount++;
            }

            return redirect()->route('pelamar.index')->with('alert', [
                'type' => 'success',
                'message' => "Berhasil mengimpor {$importedCount} data pelamar dari file Excel!",
            ]);
        } catch (\Throwable $e) {
            return redirect()->route('pelamar.index')->with('alert', [
                'type' => 'error',
                'message' => 'Gagal membaca file Excel. Pastikan format kolom sesuai template ekspor.',
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function validatePelamar(Request $request): array
    {
        $validated = $request->validate([
            'nik' => ['required', 'string', 'max:20'],
            'nama' => ['required', 'string', 'max:120'],
            'jenis_kelamin' => ['required', 'in:L,P'],
            'no_hp' => ['nullable', 'string', 'max:25'],
            'kecamatan' => ['required', 'string', 'max:80'],
            'c1_mentah' => ['required', 'numeric', 'min:0', 'max:100'],
            'c2_mentah' => ['required', 'integer', 'min:0', 'max:50'],
            'c3_mentah' => ['required', 'numeric', 'min:0', 'max:100'],
            'c4_mentah' => ['required', 'in:S1,D3,SMA/SMK'],
            'c5_mentah' => ['required', 'numeric', 'min:0.1', 'max:200'],
        ]);

        $validated['c5_mentah'] = max(0.1, (float) $validated['c5_mentah']);

        return $validated;
    }
}
