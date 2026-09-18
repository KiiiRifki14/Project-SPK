import React, { useState, useMemo } from 'react';
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
import { calculateSAW, validateBobot } from './services/sawCalculator.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeRole, setActiveRole] = useState('panitia');
  const [alert, setAlert] = useState(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // State Data Tersimpan di LocalStorage
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

  // Notifikasi Helper
  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
  };

  // Validasi Bobot
  const bobotValidation = useMemo(() => {
    return validateBobot(kriteria);
  }, [kriteria]);

  // Kalkulasi Live Reactive SAW
  const sawResult = useMemo(() => {
    return calculateSAW(pelamar, kriteria, {
      kuotaLolos: pengaturan?.kuotaLolos ?? 5,
      kuotaCadangan: pengaturan?.kuotaCadangan ?? 2
    });
  }, [pelamar, kriteria, pengaturan?.kuotaLolos, pengaturan?.kuotaCadangan]);

  // Handlers
  const handleUpdateKriteria = (newKriteria) => {
    setKriteria(newKriteria);
    storageService.saveKriteria(newKriteria);
  };

  const handleSavePelamar = (newPelamar) => {
    setPelamar(newPelamar);
    storageService.savePelamar(newPelamar);
  };

  const handleUpdatePengaturan = (newPengaturan) => {
    setPengaturan(newPengaturan);
    storageService.savePengaturan(newPengaturan);
  };

  const handleLoadSample = () => {
    const sample = storageService.loadSampleSubang();
    setPelamar(sample);
    showAlert('8 data kandidat pelamar asli Kabupaten Subang berhasil dimuat kembali!', 'success');
  };

  const handleConfirmReset = () => {
    const resetData = storageService.resetToDefault();
    setKriteria(resetData.kriteria);
    setPelamar(resetData.pelamar);
    setPengaturan(resetData.pengaturan);
    setIsResetModalOpen(false);
    showAlert('Seluruh data kriteria, pelamar, dan pengaturan berhasil di-reset ke kondisi awal!', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans selection:bg-bps-blue selection:text-white relative w-full max-w-full overflow-x-hidden">
      {/* Toast Alert Pop-up */}
      <Alert alert={alert} onClose={() => setAlert(null)} />

      {/* Sidebar (Desktop Docked + Mobile Off-Canvas Drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsMobileNavOpen(false);
        }}
        pelamarCount={pelamar.length}
        kriteriaCount={kriteria.length}
        bobotValid={bobotValidation.isValid}
        isMobileNavOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Right Canvas: Navbar + Main Dynamic Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        <Navbar
          activeTab={activeTab}
          onResetData={() => setIsResetModalOpen(true)}
          onLoadSample={handleLoadSample}
          activeRole={activeRole}
          onChangeRole={(role) => {
            setActiveRole(role);
            showAlert(`Mode beralih ke peran: ${role === 'superadmin' ? 'Superadmin BPS' : 'Panitia Seleksi'}`, 'info');
          }}
          summary={sawResult?.summary}
          onToggleMobileNav={() => setIsMobileNavOpen(prev => !prev)}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-[1500px] w-full mx-auto min-w-0">
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
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmReset}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-md transition-all"
            >
              Ya, Reset ke Data Awal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
