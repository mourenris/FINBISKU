import React, { useState } from 'react';
import { User, Shield, Key, Save, Calendar, Mail, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Toast from '../components/Toast';
import Badge from '../components/Badge';

const AdminProfilePage = () => {
  const { user, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'password'
  const [profileData, setProfileData] = useState({
    nama: user?.nama || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.id]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.id]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put('/profile', profileData);
      if (response.data.success) {
        setToast({ type: 'success', message: 'Profil admin berhasil diperbarui' });
        await checkAuth();
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Gagal memperbarui profil' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setToast({ type: 'error', message: 'Konfirmasi password baru tidak cocok' });
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/profile/password', {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      });
      if (response.data.success) {
        setToast({ type: 'success', message: 'Password berhasil diubah' });
        setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Gagal mengubah password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800 font-display">Profil Admin</h1>
        <p className="text-neutral-500 font-body text-sm">Kelola informasi akun dan keamanan administrator.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Account Summary Card */}
        <div className="lg:col-span-4">
          <Card className="text-center border border-neutral-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-24 bg-[#0f3d2b]"></div>
            <div className="relative pt-12">
              <div className="w-28 h-28 mx-auto rounded-full bg-white p-1 shadow-md mb-4">
                <div className="w-full h-full rounded-full bg-[#1a5c38]/10 flex items-center justify-center border border-[#1a5c38]/20">
                  <User className="h-12 w-12 text-[#1a5c38]" />
                </div>
              </div>
              <h3 className="font-bold text-lg text-neutral-800 font-display">{user?.nama}</h3>
              <div className="flex items-center justify-center space-x-1.5 mt-1.5">
                <Shield className="h-4 w-4 text-[#d4a830]" />
                <span className="text-xs font-bold text-[#1a5c38] uppercase tracking-wider font-display">Administrator</span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-neutral-100 text-left space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-neutral-450">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="font-body">Email</span>
                </div>
                <span className="font-bold text-neutral-800 font-display">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-neutral-450">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="font-body">Status</span>
                </div>
                <Badge variant={user?.status === 'active' ? 'success' : 'warning'} className="text-[10px] uppercase">
                  {user?.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-neutral-450">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="font-body">Bergabung</span>
                </div>
                <span className="font-semibold text-neutral-800 font-body">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Settings Tabs */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-card shadow-sm border border-neutral-200 overflow-hidden">
            <div className="flex border-b border-neutral-200">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 px-6 py-4 text-sm font-bold font-display transition-colors ${activeTab === 'info' ? 'text-[#1a5c38] border-b-2 border-[#1a5c38] bg-[#1a5c38]/5' : 'text-neutral-450 hover:text-neutral-800 hover:bg-neutral-50'}`}
              >
                Informasi Akun
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 px-6 py-4 text-sm font-bold font-display transition-colors ${activeTab === 'password' ? 'text-[#1a5c38] border-b-2 border-[#1a5c38] bg-[#1a5c38]/5' : 'text-neutral-450 hover:text-neutral-800 hover:bg-neutral-50'}`}
              >
                Ubah Kata Sandi
              </button>
            </div>

            <div className="p-6 md:p-8">
              {activeTab === 'info' ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      id="nama" 
                      label="Nama Lengkap" 
                      value={profileData.nama} 
                      onChange={handleProfileChange} 
                      required 
                    />
                    <Input 
                      id="email" 
                      type="email" 
                      label="Alamat Email" 
                      value={profileData.email} 
                      onChange={handleProfileChange} 
                      required 
                    />
                  </div>
                  <div className="flex justify-end pt-4 border-t border-neutral-100">
                    <Button type="submit" loading={loading} className="bg-[#1a5c38] hover:bg-[#0f3d2b]">
                      <Save className="h-4 w-4 mr-2" /> Simpan Perubahan
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="p-4 bg-[#1a5c38]/5 border border-[#1a5c38]/10 rounded-xl flex items-start space-x-3 mb-4">
                    <Info className="h-5 w-5 text-[#1a5c38] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[#0f3d2b] leading-relaxed font-semibold font-body">
                      Gunakan kata sandi yang kompleks dan ganti secara berkala untuk menjaga keamanan akses panel administrator.
                    </p>
                  </div>

                  <div className="p-4 bg-[#d4a830]/5 border border-[#d4a830]/10 rounded-xl flex items-start space-x-3 mb-6">
                    <Key className="h-5 w-5 text-[#8b6820] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[#8b6820] leading-relaxed font-semibold font-body">
                      Kata sandi harus mengandung minimal 8 karakter dengan kombinasi huruf dan angka.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Input 
                      id="old_password" 
                      label="Kata Sandi Lama" 
                      type="password" 
                      placeholder="••••••••"
                      value={passwordData.old_password}
                      onChange={handlePasswordChange}
                      required 
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
                      <Input 
                        id="new_password" 
                        label="Kata Sandi Baru" 
                        type="password" 
                        placeholder="••••••••"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        required 
                      />
                      <Input 
                        id="confirm_password" 
                        label="Konfirmasi Kata Sandi" 
                        type="password" 
                        placeholder="••••••••"
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-neutral-100">
                    <Button type="submit" loading={loading} className="bg-[#1a5c38] hover:bg-[#0f3d2b]">
                      <Key className="h-4 w-4 mr-2" /> Perbarui Kata Sandi
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminProfilePage;
