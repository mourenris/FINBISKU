import React, { useState } from 'react';
import { User, Mail, Shield, Trash2, Save, AlertTriangle, Briefcase, Bookmark, Newspaper, Key, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBusiness } from '../contexts/BusinessContext';
import api from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, checkAuth } = useAuth();
  const { businesses } = useBusiness();
  const [formData, setFormData] = useState({
    nama: user?.nama || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put('/profile', formData);
      if (response.data.success) {
        setToast({ type: 'success', message: 'Profil Anda berhasil diperbarui' });
        await checkAuth();
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Gagal memperbarui profil' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await api.delete('/profile', { data: { password } });
      if (response.data.success) {
        window.location.href = '/';
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Gagal menghapus akun' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Akun</h1>
        <p className="text-gray-500 text-sm">Kelola informasi pribadi, metrik bisnis, dan pengaturan keamanan Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side Column: Summaries & Widgets */}
        <div className="lg:col-span-4 space-y-6">
          {/* SECTION 1: PROFILE OVERVIEW CARD */}
          <Card className="text-center border-none shadow-md overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-primary-500 to-primary-600"></div>
            <div className="relative pt-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-white p-1 shadow-md mb-3">
                <div className="w-full h-full rounded-full bg-primary-50 flex items-center justify-center border border-primary-100 font-extrabold text-xl text-primary-600">
                  {user?.nama?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-900">{user?.nama}</h3>
              <p className="text-xs text-gray-400 font-medium lowercase">{user?.email}</p>
              
              <div className="flex items-center justify-center space-x-2 mt-3">
                <span className="px-2.5 py-0.5 bg-primary-50 text-primary-600 text-[10px] font-bold rounded-full uppercase border border-primary-100">
                  {user?.role || 'UMKM Member'}
                </span>
                <span className="px-2.5 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase border border-green-100">
                  {user?.status || 'Active'}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50 text-left space-y-2 text-xs text-gray-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" /> <span>Bergabung</span></div>
                <span className="font-semibold text-gray-700">{user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' }) : '-'}</span>
              </div>
            </div>
          </Card>

          {/* SECTION 3: BUSINESS SUMMARY */}
          <Card title="Statistik Akun UMKM" className="border-none shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100/50">
                <Briefcase className="h-5 w-5 text-blue-500 mb-2" />
                <p className="text-xs font-semibold text-gray-400 uppercase">Total Usaha</p>
                <h4 className="text-xl font-extrabold text-gray-900 mt-0.5">{businesses?.length || 0}</h4>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100/50">
                <Newspaper className="h-5 w-5 text-green-500 mb-2" />
                <p className="text-xs font-semibold text-gray-400 uppercase">Usaha Aktif</p>
                <h4 className="text-xl font-extrabold text-gray-900 mt-0.5">{businesses?.length > 0 ? 1 : 0}</h4>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side Column: Detailed Action Configurations */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 2: ACCOUNT INFORMATION */}
          <Card title="Informasi Personal">
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input id="nama" label="Nama Lengkap" value={formData.nama} onChange={handleChange} required />
                <Input id="email" type="email" label="Alamat Email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" loading={loading}><Save className="h-4 w-4 mr-2" /> Simpan Perubahan</Button>
              </div>
            </form>
          </Card>

          {/* SECTION 4: SECURITY SECTION */}
          <Card title="Kredensial & Keamanan">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100/50">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-primary-600">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Kata Sandi Akun</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Ganti kata sandi secara periodik untuk memperkuat sistem data keuangan.</p>
                </div>
              </div>
              <Link to="/profile/password" className="w-full sm:w-auto">
                <Button variant="secondary" size="sm" className="w-full sm:w-auto">Ubah Password</Button>
              </Link>
            </div>
          </Card>

          {/* SECTION 5: DANGER ZONE */}
          <Card title="Zona Berbahaya" className="border border-red-100 shadow-sm shadow-red-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-gray-900">Penghapusan Akun Permanen</h4>
                <p className="text-xs text-gray-500 max-w-xl mt-1 leading-relaxed">
                  Tindakan ini bersifat permanen. Seluruh data profile usaha, log pencatatan transaksi keuangan, beserta postingan cerita blog akan dihapus selamanya dari database sistem.
                </p>
              </div>
              <button 
                onClick={() => setConfirmDelete(true)}
                className="w-full sm:w-auto py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-colors text-center"
              >
                Hapus Akun
              </button>
            </div>
          </Card>
        </div>

      </div>

      <ConfirmDialog 
        isOpen={confirmDelete}
        onClose={() => { setConfirmDelete(false); setPassword(''); }}
        onConfirm={handleDeleteAccount}
        variant="danger"
        title="Konfirmasi Hapus Akun"
        message="Masukkan password akun Anda untuk mengonfirmasi proses penghapusan profile secara permanen."
      >
        <div className="mt-4 w-full text-left">
          <Input 
            id="password-confirm"
            label="Password Konfirmasi"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <p className="text-[10px] text-yellow-700 leading-relaxed">Peringatan: Seluruh data yang terkait dengan akun ini tidak dapat dipulihkan kembali setelah dihapus.</p>
          </div>
        </div>
      </ConfirmDialog>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ProfilePage;
