import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Toast from '../components/Toast';
import Logo from '../components/Logo';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      setLoading(false);
      return;
    }

    const result = await register({
      nama: formData.nama,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      setToast({ type: 'success', message: 'Registrasi berhasil! Silakan login.' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brandBg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
            <Logo className="h-10 w-10 text-[#d4a830] transition-transform duration-200 group-hover:scale-105" />
            <span className="text-2xl font-extrabold font-display text-neutral-800 tracking-tight hover:text-[#d4a830] transition-colors">FINBISKU</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-neutral-800 font-display">Buat Akun Baru</h1>
          <p className="text-neutral-500 font-body text-sm mt-2">Gabung dengan komunitas UMKM Indonesia</p>
        </div>

        <Card className="shadow-xl border border-neutral-200 rounded-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="relative">
              <User className="absolute top-10 right-3 h-5 w-5 text-neutral-400" />
              <Input 
                id="nama"
                type="text"
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap Anda"
                value={formData.nama}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute top-10 right-3 h-5 w-5 text-neutral-400" />
              <Input 
                id="email"
                type="email"
                label="Alamat Email"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute top-10 right-3 h-5 w-5 text-neutral-400" />
              <Input 
                id="password"
                type="password"
                label="Kata Sandi"
                placeholder="Min. 8 karakter (alphanumeric)"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute top-10 right-3 h-5 w-5 text-neutral-400" />
              <Input 
                id="confirmPassword"
                type="password"
                label="Konfirmasi Kata Sandi"
                placeholder="Ulangi kata sandi Anda"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-3.5 rounded-btn text-base font-extrabold font-display mt-4 bg-[#1a5c38] text-white hover:bg-[#0f3d2b] hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 border-none shadow-md"
              loading={loading}
            >
              <UserPlus className="h-5 w-5" /> Daftar Akun
            </Button>

            <p className="text-center text-sm text-neutral-500 font-body pt-2">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-extrabold text-[#1a5c38] hover:text-[#0f3d2b] hover:underline font-display">
                Masuk Sekarang
              </Link>
            </p>
          </form>
        </Card>
      </div>

      {toast && (
        <Toast 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default RegisterPage;
