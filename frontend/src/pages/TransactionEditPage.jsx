import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const TransactionEditPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    tanggal: '',
    jenis_transaksi: '',
    kategori: '',
    nominal: '',
    keterangan: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const jenisOptions = [
    { label: 'Pemasukan', value: 'Pemasukan' },
    { label: 'Pengeluaran', value: 'Pengeluaran' }
  ];

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/transaksi/${id}`);
        if (response.data.success) {
          const t = response.data.data;
          setFormData({
            tanggal: t.tanggal,
            jenis_transaksi: t.jenis_transaksi,
            kategori: t.kategori,
            nominal: t.nominal,
            keterangan: t.keterangan || ''
          });
        }
      } catch (error) {
        setToast({ type: 'error', message: 'Gagal memuat data' });
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.put(`/transaksi/${id}`, formData);
      if (response.data.success) {
        setToast({ type: 'success', message: 'Transaksi diperbarui' });
        setTimeout(() => navigate('/transactions'), 1500);
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Gagal memperbarui' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner className="h-screen" />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/transactions" className="p-2 bg-white rounded-lg border hover:bg-gray-50">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Transaksi</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="tanggal" label="Tanggal" type="date" value={formData.tanggal} onChange={handleChange} required />
            <Select id="jenis_transaksi" label="Jenis" options={jenisOptions} value={formData.jenis_transaksi} onChange={handleChange} required />
          </div>
          
          <Input id="kategori" label="Kategori" value={formData.kategori} onChange={handleChange} required />
          <Input id="nominal" label="Nominal (Rp)" type="number" value={formData.nominal} onChange={handleChange} required />
          <Textarea id="keterangan" label="Keterangan" value={formData.keterangan} onChange={handleChange} />

          <div className="flex justify-end space-x-3 pt-4">
            <Link to="/transactions">
              <Button variant="secondary">Batal</Button>
            </Link>
            <Button type="submit" loading={submitting}><Save className="h-4 w-4 mr-2" /> Simpan Perubahan</Button>
          </div>
        </form>
      </Card>
      
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default TransactionEditPage;
