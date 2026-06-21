import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Phone, Calendar, Eye, Edit, Trash2, Briefcase } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';

const BusinessListPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/usaha');
      if (response.data.success) {
        setBusinesses(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch businesses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleDelete = async () => {
    if (!password) {
      setToast({ type: 'error', message: 'Konfirmasi password diperlukan' });
      return;
    }

    try {
      const response = await api.delete(`/usaha/${confirmDelete}`, {
        data: { password }
      });
      if (response.data.success) {
        setToast({ type: 'success', message: 'Bisnis berhasil dihapus' });
        setConfirmDelete(null);
        setPassword('');
        fetchBusinesses();
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Gagal menghapus bisnis' });
    }
  };

  if (loading && businesses.length === 0) return <LoadingSpinner className="h-screen" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bisnis Saya</h1>
          <p className="text-gray-500">Kelola profil usaha UMKM Anda.</p>
        </div>
        <Link to="/business/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Tambah Bisnis
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <Card key={business.id} className="relative group hover:shadow-lg transition-shadow border-none shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 overflow-hidden border border-primary-100">
                {business.logo_usaha ? (
                  <img 
                    src={`${import.meta.env.VITE_BASE_URL}/api/uploads/logos/${business.logo_usaha}`} 
                    className="w-full h-full object-cover"
                    alt={business.nama_usaha}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary-600 font-bold text-xl">
                    {business.nama_usaha.charAt(0)}
                  </div>
                )}
              </div>
              <Badge variant="primary">{business.status_umkm}</Badge>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">{business.nama_usaha}</h3>
            <p className="text-primary-600 text-sm font-semibold mb-4">{business.jenis_usaha}</p>
            
            <div className="space-y-2 text-sm text-gray-500 mb-6">
              <div className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> {business.alamat}</div>
              <div className="flex items-center"><Phone className="h-4 w-4 mr-2" /> {business.kontak_usaha}</div>
              <div className="flex items-center"><Calendar className="h-4 w-4 mr-2" /> Berdiri: {business.tahun_berdiri}</div>
            </div>

            <div className="flex items-center space-x-2 pt-4 border-t border-gray-50">
              <Link to={`/business/${business.id}`} className="flex-1">
                <Button variant="secondary" size="sm" className="w-full"><Eye className="h-3 w-3 mr-1" /> Detail</Button>
              </Link>
              <Link to={`/business/${business.id}/edit`}>
                <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
              </Link>
              <button 
                onClick={() => setConfirmDelete(business.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {businesses.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
          <Briefcase className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">Belum ada bisnis</h3>
          <p className="text-gray-500 mb-6">Mulai perjalanan bisnis Anda dengan mendaftarkan usaha pertama.</p>
          <Link to="/business/add">
            <Button variant="secondary">Daftar Bisnis Sekarang</Button>
          </Link>
        </div>
      )}

      <ConfirmDialog 
        isOpen={!!confirmDelete}
        onClose={() => { setConfirmDelete(null); setPassword(''); }}
        onConfirm={handleDelete}
        title="Hapus Bisnis?"
        message="Tindakan ini permanen. Seluruh transaksi dan blog terkait akan ikut terhapus. Masukkan password untuk konfirmasi."
        confirmText="Hapus Selamanya"
      >
        <div className="mt-4 w-full">
          <input 
            type="password" 
            placeholder="Konfirmasi Password" 
            className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </ConfirmDialog>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default BusinessListPage;
