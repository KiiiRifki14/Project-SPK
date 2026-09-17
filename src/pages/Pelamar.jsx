import React, { useState, useRef } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Sparkles, 
  Edit, 
  Trash2, 
  FileSpreadsheet,
  RotateCcw,
  X,
  AlertCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import Modal from '../components/Modal.jsx';
import { KECAMATAN_SUBANG, PENDIDIKAN_OPTIONS } from '../data/initialKriteria.js';

export default function Pelamar({ 
  pelamar = [], 
  onSavePelamar, 
  onLoadSample, 
  onResetData, 
  onShowAlert 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPelamar, setEditingPelamar] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const fileInputRef = useRef(null);

  // Form State
  const initialFormState = {
    nik: '',
    nama: '',
    jenisKelamin: 'L',
    noHp: '',
    kecamatan: 'Subang Kota',
    pendidikan: 'S1',
    C1: 80,
    C2: 2,
    C3: 85,
    C4: 4,
    C5: 3.5
  };
  const [formData, setFormData] = useState(initialFormState);

  // Filter & Search
  const filteredPelamar = pelamar.filter(p => {
    const matchSearch = 
      (p.nama && p.nama.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.nik && p.nik.includes(searchTerm)) ||
      (p.noHp && p.noHp.includes(searchTerm));
    const matchKecamatan = selectedKecamatan === 'Semua' || p.kecamatan === selectedKecamatan;
    return matchSearch && matchKecamatan;
  });

  const handleOpenAddModal = () => {
    setEditingPelamar(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingPelamar(p);
    setFormData({
      nik: p.nik || '',
      nama: p.nama || '',
      jenisKelamin: p.jenisKelamin || 'L',
      noHp: p.noHp || '',
      kecamatan: p.kecamatan || 'Subang Kota',
      pendidikan: p.pendidikan || 'S1',
      C1: p.C1 ?? 80,
      C2: p.C2 ?? 2,
      C3: p.C3 ?? 85,
      C4: p.C4 ?? 4,
      C5: p.C5 ?? 3.5
    });
    setIsModalOpen(true);
  };

  const handlePendidikanChange = (val) => {
    const opt = PENDIDIKAN_OPTIONS.find(o => o.value === val);
    setFormData(prev => ({
      ...prev,
      pendidikan: val,
      C4: opt ? opt.bobot : 2
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.nama.trim()) {
      onShowAlert('Nama lengkap wajib diisi!', 'error');
      return;
    }
    if (!formData.nik.trim() || formData.nik.length < 10) {
      onShowAlert('NIK harus berupa nomor identitas yang valid!', 'error');
      return;
    }

    const c5Val = parseFloat(formData.C5);
    if (isNaN(c5Val) || c5Val <= 0) {
      onShowAlert('Jarak domisili (C5) harus lebih besar dari 0 km (minimal 0.1 km)!', 'error');
      return;
    }

    let updatedList = [];
    if (editingPelamar) {
      updatedList = pelamar.map(p => 
        p.id === editingPelamar.id ? { ...p, ...formData, C5: c5Val } : p
      );
      onShowAlert(`Data pelamar "${formData.nama}" berhasil diperbarui`, 'success');
    } else {
      if (pelamar.some(p => p.nik === formData.nik)) {
        onShowAlert(`Pelamar dengan NIK ${formData.nik} sudah terdaftar!`, 'error');
        return;
      }
      const newPelamar = {
        ...formData,
        id: `PLM-${Date.now().toString().slice(-4)}`,
        C5: c5Val
      };
      updatedList = [newPelamar, ...pelamar];
      onShowAlert(`Pelamar "${formData.nama}" berhasil ditambahkan`, 'success');
    }

    onSavePelamar(updatedList);
    setIsModalOpen(false);
  };

  const handleDeletePelamar = (id) => {
    const updatedList = pelamar.filter(p => p.id !== id);
    onSavePelamar(updatedList);
    setDeleteConfirmId(null);
    onShowAlert('Data pelamar berhasil dihapus', 'info');
  };

  const handleExportExcel = () => {
    if (pelamar.length === 0) {
      onShowAlert('Tidak ada data pelamar untuk diekspor!', 'warning');
      return;
    }

    const exportData = pelamar.map((p, idx) => ({
      No: idx + 1,
      NIK: p.nik,
      'Nama Lengkap': p.nama,
      'Jenis Kelamin': p.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
      'Nomor HP': p.noHp,
      Kecamatan: p.kecamatan,
      'Pendidikan Terakhir': p.pendidikan,
      'C1 (Nilai Ujian)': p.C1,
      'C2 (Riwayat Survei)': p.C2,
      'C3 (Skor CAPI)': p.C3,
      'C4 (Skor Pendidikan)': p.C4,
      'C5 (Jarak Wilayah KM)': p.C5
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Pelamar BPS');
    
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Data_Pelamar_Mitra_BPS_Subang_${dateStr}.xlsx`);
    onShowAlert('File Excel data pelamar berhasil diunduh', 'success');
  };

  const handleImportExcel = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (!data || data.length === 0) {
          onShowAlert('File Excel kosong atau format tidak sesuai!', 'error');
          return;
        }

        const imported = data.map((row, idx) => {
          const pend = row['Pendidikan Terakhir'] || row['Pendidikan'] || row['pendidikan'] || 'S1';
          const opt = PENDIDIKAN_OPTIONS.find(o => o.value === pend);
          return {
            id: `IMP-${Date.now().toString().slice(-4)}-${idx + 1}`,
            nik: String(row['NIK'] || row['nik'] || `321300000000000${idx + 1}`),
            nama: String(row['Nama Lengkap'] || row['Nama'] || row['nama'] || `Kandidat ${idx + 1}`),
            jenisKelamin: row['Jenis Kelamin']?.toString().toUpperCase().startsWith('P') ? 'P' : 'L',
            noHp: String(row['Nomor HP'] || row['No HP'] || row['noHp'] || '-'),
            kecamatan: String(row['Kecamatan'] || row['kecamatan'] || 'Subang Kota'),
            pendidikan: pend,
            C1: Number(row['C1 (Nilai Ujian)'] || row['C1'] || 75),
            C2: Number(row['C2 (Riwayat Survei)'] || row['C2'] || 1),
            C3: Number(row['C3 (Skor CAPI)'] || row['C3'] || 80),
            C4: opt ? opt.bobot : Number(row['C4 (Skor Pendidikan)'] || row['C4'] || 3),
            C5: Math.max(0.1, Number(row['C5 (Jarak Wilayah KM)'] || row['C5'] || 5.0))
          };
        });

        onSavePelamar([...imported, ...pelamar]);
        onShowAlert(`Berhasil mengimpor ${imported.length} data pelamar dari Excel!`, 'success');
      } catch (err) {
        console.error('Import error:', err);
        onShowAlert('Gagal membaca file Excel. Pastikan format kolom sesuai.', 'error');
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Halaman & Action Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card">
        <div>
          <div className="flex items-center gap-2 text-bps-navy">
            <Users className="w-5 h-5 text-bps-blue" />
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Manajemen Data Calon Mitra Statistik
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data pelamar sensus lapangan BPS Subang, input nilai seleksi C1 - C5, dan impor/ekspor spreadsheet.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-bps-navy text-white hover:bg-bps-navy-light shadow-md shadow-bps-navy/20 transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4 text-bps-blue" />
            Tambah Pelamar
          </button>

          <button
            onClick={onLoadSample}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-bps-navy bg-bps-blue-light hover:bg-blue-100 border border-bps-blue/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-bps-blue" />
            Muat Sampel Subang
          </button>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Excel
          </button>

          <label className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import Excel</span>
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .xls, .csv"
              onChange={handleImportExcel}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama pelamar atau NIK..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-bps-blue transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Kecamatan Subang */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-xs text-slate-500 font-medium hidden md:inline">Kecamatan:</span>
          <select
            value={selectedKecamatan}
            onChange={(e) => setSelectedKecamatan(e.target.value)}
            className="w-full sm:w-52 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-bps-blue"
          >
            <option value="Semua">Semua Kecamatan ({pelamar.length})</option>
            {KECAMATAN_SUBANG.map(kec => (
              <option key={kec} value={kec}>{kec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Data Pelamar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs text-slate-500 font-medium">
            Menampilkan <strong>{filteredPelamar.length}</strong> dari total {pelamar.length} pelamar
          </div>
          {searchTerm && (
            <span className="text-xs text-bps-blue font-semibold">
              Filter aktif: "{searchTerm}"
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama & NIK</th>
                <th className="py-3 px-4">Kecamatan</th>
                <th className="py-3 px-4 text-center">Pendidikan</th>
                <th className="py-3 px-4 text-center" title="Nilai Ujian (0-100)">C1 (Ujian)</th>
                <th className="py-3 px-4 text-center" title="Pengalaman Survei (kali)">C2 (Survei)</th>
                <th className="py-3 px-4 text-center" title="Uji CAPI (0-100)">C3 (CAPI)</th>
                <th className="py-3 px-4 text-center" title="Skor Pendidikan (2-4)">C4 (Skor)</th>
                <th className="py-3 px-4 text-center" title="Jarak ke Wilayah (KM)">C5 (Jarak)</th>
                <th className="py-3 px-4 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPelamar.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ditemukan data pelamar yang cocok.
                  </td>
                </tr>
              ) : (
                filteredPelamar.map((p, idx) => {
                  const initials = p.nama?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'PL';

                  return (
                    <tr key={p.id || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center text-xs text-slate-400 font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 text-bps-navy font-bold text-[10px] flex items-center justify-center flex-shrink-0 border border-slate-200">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{p.nama}</p>
                            <p className="text-[11px] text-slate-400 font-mono">NIK: {p.nik}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {p.kecamatan}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {p.pendidikan}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800 font-mono">
                        {p.C1}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-700 font-mono">
                        {p.C2}x
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800 font-mono">
                        {p.C3}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-bps-navy font-mono">
                        {p.C4}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-amber-700 font-bold">
                        {p.C5} km
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-slate-400 hover:text-bps-blue hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPelamar ? `Edit Data Pelamar: ${editingPelamar.nama}` : 'Tambah Calon Mitra Statistik Baru'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Induk Kependudukan (NIK) *
              </label>
              <input
                type="text"
                required
                maxLength={16}
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                placeholder="3213xxxxxxxxxxxx"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap *
              </label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Nama pelamar..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jenis Kelamin
              </label>
              <select
                value={formData.jenisKelamin}
                onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor HP / WhatsApp
              </label>
              <input
                type="text"
                value={formData.noHp}
                onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                placeholder="0812xxxxxxxx"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kecamatan Domisili Subang *
              </label>
              <select
                value={formData.kecamatan}
                onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue"
              >
                {KECAMATAN_SUBANG.map(kec => (
                  <option key={kec} value={kec}>{kec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pendidikan Terakhir * (C4 Otomatis)
              </label>
              <select
                value={formData.pendidikan}
                onChange={(e) => handlePendidikanChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue"
              >
                {PENDIDIKAN_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} (Bobot C4 = {opt.bobot})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-bps-navy mb-3">
              Parameter Penilaian Kriteria (C1 - C5)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  C1: Nilai Ujian (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  value={formData.C1}
                  onChange={(e) => setFormData({ ...formData, C1: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  C2: Riwayat Survei (Kali)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  required
                  value={formData.C2}
                  onChange={(e) => setFormData({ ...formData, C2: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  C3: Skor Uji CAPI (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  value={formData.C3}
                  onChange={(e) => setFormData({ ...formData, C3: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  C4: Bobot Pendidikan (Skala 2 - 4)
                </label>
                <input
                  type="number"
                  readOnly
                  value={formData.C4}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  C5: Jarak Domisili ke Wilayah (KM) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={formData.C5}
                  onChange={(e) => setFormData({ ...formData, C5: parseFloat(e.target.value) || 0.1 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue font-mono"
                />
                <p className="text-[10px] text-amber-600 mt-0.5">Kriteria Cost: minimal 0.1 km</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-bps-navy text-white hover:bg-bps-navy-light transition-all shadow-md"
            >
              {editingPelamar ? 'Simpan Perubahan' : 'Tambahkan Pelamar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      {deleteConfirmId && (
        <Modal
          isOpen={Boolean(deleteConfirmId)}
          onClose={() => setDeleteConfirmId(null)}
          title="Konfirmasi Hapus Data Pelamar"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-slate-600 text-sm">
            <p>
              Apakah Anda yakin ingin menghapus data pelamar ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeletePelamar(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-md"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
