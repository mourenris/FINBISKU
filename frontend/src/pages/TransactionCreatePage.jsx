import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../services/api';
import { useBusiness } from '../contexts/BusinessContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import Toast from '../components/Toast';

const TransactionCreatePage = () => {
  const { activeBusiness } = useBusiness();
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    jenis_transaksi: 'Pemasukan',
    kategori: '',
    nominal: '',
    keterangan: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const jenisOptions = [
    { label: 'Pemasukan', value: 'Pemasukan' },
    { label: 'Pengeluaran', value: 'Pengeluaran' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeBusiness) return;

    setLoading(true);
    try {
      const response = await api.post('/transaksi', {
        ...formData,
        usaha_id: activeBusiness.id
      });
      if (response.data.success) {
        setToast({ type: 'success', message: 'Transaksi berhasil dicatat' });
        setTimeout(() => navigate('/transactions'), 1500);
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Gagal mencatat transaksi' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/transactions" className="p-2 bg-white rounded-lg border hover:bg-gray-50">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Catat Transaksi</h1>
      </div>

      <Card title={`Bisnis: ${activeBusiness?.nama_usaha}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="tanggal" label="Tanggal" type="date" value={formData.tanggal} onChange={handleChange} required />
            <Select id="jenis_transaksi" label="Jenis" options={jenisOptions} value={formData.jenis_transaksi} onChange={handleChange} required />
          </div>
          
          <Input id="kategori" label="Kategori" placeholder="Contoh: Penjualan Produk, Sewa Tempat" value={formData.kategori} onChange={handleChange} required />
          <Input id="nominal" label="Nominal (Rp)" type="number" placeholder="0" value={formData.nominal} onChange={handleChange} required />
          <Textarea id="keterangan" label="Keterangan (Opsional)" value={formData.keterangan} onChange={handleChange} />

          <div className="flex justify-end space-x-3 pt-4">
            <Link to="/transactions">
              <Button variant="secondary">Batal</Button>
            </Link>
            <Button type="submit" loading={loading}><Save className="h-4 w-4 mr-2" /> Simpan Transaksi</Button>
          </div>
        </form>
      </Card>
      
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default TransactionCreatePage;
