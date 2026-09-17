import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Alert from './components/Alert.jsx';
import Modal from './components/Modal.jsx';

import Dashboard from './pages/Dashboard.jsx';
import Kriteria from './pages/Kriteria.jsx';
import Pelamar from './pages/Pelamar.jsx';
import DapurSAW from './pages/DapurSAW.jsx';
import Ranking from './pages/Ranking.jsx';
import Laporan from './pages/Laporan.jsx';

import { storageService } from './services/storageService.js';
import { calculateSAW } from './services/sawCalculator.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeRole, setActiveRole] = useState('panitia');
  const [alert, setAlert] = useState(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // State Data Tersimpan
  const [kriteria, setKriteria] = useState(() => {
    storageService.initStorage();
    return storageService.getKriteria();
  });

  const [pelamar, setPelamar] = useState(() => {
    return storageService.getPelamar();
  });

  const [pengaturan, setPengaturan] = useState(() => {
    return storageService.getPengaturan();
  });

  // Notifikasi helper
  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
  };

  // Kalkulasi Live Reactive SAW (Otomatis terhitung seketika tanpa delay saat data/bobot/kuota berubah)
  const sawResult = useMemo(() => {
    return calculateSAW(pelamar, kriteria, {
      kuotaLolos: pengaturan?.kuotaLolos ?? 5,
      kuotaCadangan: pengaturan?.kuotaCadangan ?? 2
    });
  }, [pelamar, kriteria, pengaturan?.kuotaLolos, pengaturan?.kuotaCadangan]);

  // Handler Update Kriteria
  const handleUpdateKriteria = (newKriteria) => {
    setKriteria(newKriteria);
    storageService.saveKriteria(newKriteria);
  };

  // Handler Update Pelamar
  const handleSavePelamar = (newPelamar) => {
    setPelamar(newPelamar);
    storageService.savePelamar(newPelamar);
  };

  // Handler Update Pengaturan
  const handleUpdatePengaturan = (newPengaturan) => {
    setPengaturan(newPengaturan);
    storageService.savePengaturan(newPengaturan);
  };

  // Muat Ulang 8 Data Sampel Subang
  const handleLoadSample = () => {
    const sample = storageService.loadSampleSubang();
    setPelamar(sample);
    showAlert('8 data kandidat pelamar asli Kabupaten Subang berhasil dimuat kembali!', 'success');
  };

  // Reset Total Sistem
  const handleConfirmReset = () => {
    const resetData = storageService.resetToDefault();
    setKriteria(resetData.kriteria);
    setPelamar(resetData.pelamar);
    setPengaturan(resetData.pengaturan);
    setIsResetModalOpen(false);
    showAlert('Seluruh data kriteria, pelamar, dan pengaturan berhasil di-reset ke kondisi awal!', 'info');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Toast Alert */}
      <Alert alert={alert} onClose={() => setAlert(null)} />

      {/* Header Navbar */}
      <Navbar
        onResetData={() => setIsResetModalOpen(true)}
        onLoadSample={handleLoadSample}
        activeRole={activeRole}
        onChangeRole={(role) => {
          setActiveRole(role);
          showAlert(`Mode beralih ke peran: ${role === 'superadmin' ? 'Superadmin BPS' : 'Panitia Seleksi'}`, 'info');
        }}
        summary={sawResult?.summary}
      />

      {/* Konten Utama: Sidebar + Page Container */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Sidebar Navigasi */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pelamarCount={pelamar.length}
          kriteriaCount={kriteria.length}
        />

        {/* Dynamic Page Viewer */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'dashboard' && (
            <Dashboard
              pelamar={pelamar}
              kriteria={kriteria}
              sawResult={sawResult}
              pengaturan={pengaturan}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'kriteria' && (
            <Kriteria
              kriteria={kriteria}
              onUpdateKriteria={handleUpdateKriteria}
              onShowAlert={showAlert}
            />
          )}

          {activeTab === 'pelamar' && (
            <Pelamar
              pelamar={pelamar}
              onSavePelamar={handleSavePelamar}
              onLoadSample={handleLoadSample}
              onResetData={() => setIsResetModalOpen(true)}
              onShowAlert={showAlert}
            />
          )}

          {activeTab === 'dapur' && (
            <DapurSAW
              sawResult={sawResult}
              kriteria={kriteria}
            />
          )}

          {activeTab === 'ranking' && (
            <Ranking
              sawResult={sawResult}
              pengaturan={pengaturan}
              onUpdatePengaturan={handleUpdatePengaturan}
              onNavigate={setActiveTab}
              onShowAlert={showAlert}
            />
          )}

          {activeTab === 'laporan' && (
            <Laporan
              sawResult={sawResult}
              pengaturan={pengaturan}
              onUpdatePengaturan={handleUpdatePengaturan}
              onShowAlert={showAlert}
            />
          )}
        </main>
      </div>

      {/* Modal Dialog Konfirmasi Reset */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Konfirmasi Reset Data Sistem"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-slate-600 text-sm">
          <p>
            Apakah Anda yakin ingin mengembalikan seluruh data (kriteria, bobot, dan data pelamar) ke konfigurasi bawaan awal Kabupaten Subang?
          </p>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
            <p className="font-bold">Perhatian:</p>
            <p>Data pelamar yang Anda tambahkan secara manual akan digantikan dengan 8 data sampel asli Subang.</p>
          </div>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmReset}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-md"
            >
              Ya, Reset ke Data Awal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
