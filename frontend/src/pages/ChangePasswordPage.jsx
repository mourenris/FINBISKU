import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Key, Save } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Toast from '../components/Toast';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      setToast({ type: 'error', message: 'Konfirmasi password baru tidak cocok' });
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/profile/password', {
        old_password: formData.old_password,
        new_password: formData.new_password
      });
      if (response.data.success) {
        setToast({ type: 'success', message: 'Password berhasil diubah' });
        setTimeout(() => navigate('/profile'), 1500);
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Gagal mengubah password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/profile" className="p-2 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Ubah Kata Sandi</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-primary-50 rounded-xl flex items-center space-x-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Key className="h-6 w-6 text-primary-600" />
            </div>
            <p className="text-sm text-primary-800 leading-relaxed font-medium">Pastikan kata sandi baru Anda kuat dan mudah diingat.</p>
          </div>

          <div className="space-y-4">
            <Input 
              id="old_password" 
              label="Kata Sandi Lama" 
              type="password" 
              placeholder="••••••••"
              value={formData.old_password}
              onChange={handleChange}
              required 
            />
            <hr className="border-gray-100" />
            <Input 
              id="new_password" 
              label="Kata Sandi Baru" 
              type="password" 
              placeholder="Min. 8 karakter (alphanumeric)"
              value={formData.new_password}
              onChange={handleChange}
              required 
            />
            <Input 
              id="confirm_password" 
              label="Ulangi Kata Sandi Baru" 
              type="password" 
              placeholder="••••••••"
              value={formData.confirm_password}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" loading={loading} className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" /> Perbarui Kata Sandi
            </Button>
          </div>
        </form>
      </Card>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ChangePasswordPage;
