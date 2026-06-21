import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, AlertCircle } from 'lucide-react';
import api from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Toast from '../components/Toast';
import Logo from '../components/Logo';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/forgot-password', { email });
      if (response.data.success) {
        setToast({ type: 'success', message: response.data.message });
        setEmail('');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal mengirim instruksi reset password');
    } finally {
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
          <h1 className="text-3xl font-extrabold text-neutral-800 font-display">Lupa Kata Sandi?</h1>
          <p className="text-neutral-500 font-body text-sm mt-2">Jangan khawatir, kami akan mengirimkan instruksi ke email Anda.</p>
        </div>

        <Card className="shadow-xl border border-neutral-200 rounded-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="relative">
              <Mail className="absolute top-10 right-3 h-5 w-5 text-neutral-400" />
              <Input 
                id="email"
                type="email"
                label="Alamat Email Terdaftar"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-3.5 rounded-btn text-base font-extrabold font-display bg-[#1a5c38] text-white hover:bg-[#0f3d2b] hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 border-none shadow-md"
              loading={loading}
            >
              <Send className="h-5 w-5" /> Kirim Instruksi
            </Button>

            <Link to="/login" className="flex items-center justify-center text-sm font-extrabold text-[#1a5c38] hover:text-[#0f3d2b] font-display">
              <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Login
            </Link>
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

export default ForgotPasswordPage;
