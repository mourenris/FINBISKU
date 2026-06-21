import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { useBusiness } from '../contexts/BusinessContext';

const BusinessCreatePage = () => {
  const [formData, setFormData] = useState({
    nama_usaha: '',
    jenis_usaha: '',
    alamat: '',
    deskripsi_usaha: '',
    tahun_berdiri: new Date().getFullYear().toString(),
    status_umkm: 'Mikro',
    kontak_usaha: '',
    media_sosial: ''
  });
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const { fetchBusinesses } = useBusiness();

  const statusOptions = [
    { label: 'Mikro', value: 'Mikro' },
    { label: 'Kecil', value: 'Kecil' },
    { label: 'Menengah', value: 'Menengah' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setToast({ type: 'error', message: 'Ukuran file maksimal 2MB' });
        return;
      }
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (logo) data.append('logo_usaha', logo);

    try {
      const response = await api.post('/usaha', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setToast({ type: 'success', message: 'Bisnis berhasil ditambahkan' });
        await fetchBusinesses();
        setTimeout(() => navigate('/business'), 1500);
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Gagal menambahkan bisnis' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/business" className="p-2 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Bisnis Baru</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card title="Logo Usaha">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group">
                  {preview ? (
                    <>
                      <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                      <button 
                        type="button"
                        onClick={() => { setLogo(null); setPreview(null); }}
                        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-6 w-6 text-white" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <span className="text-[10px] text-gray-400 font-medium">Klik untuk upload</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <p className="mt-4 text-[10px] text-gray-400 text-center leading-relaxed">
                  Format: JPG, PNG. <br/>Maksimal 2MB.
                </p>
              </div>
            </Card>
            
            <Card title="Status & Waktu">
              <Select 
                id="status_umkm"
                label="Skala UMKM"
                options={statusOptions}
                value={formData.status_umkm}
                onChange={handleChange}
              />
              <div className="mt-4">
                <Input 
                  id="tahun_berdiri"
                  label="Tahun Berdiri"
                  type="number"
                  placeholder="Contoh: 2020"
                  value={formData.tahun_berdiri}
                  onChange={handleChange}
                  required
                />
              </div>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card title="Informasi Bisnis">
              <div className="space-y-4">
                <Input 
                  id="nama_usaha"
                  label="Nama Bisnis"
                  placeholder="Masukkan nama bisnis Anda"
                  value={formData.nama_usaha}
                  onChange={handleChange}
                  required
                />
                <Input 
                  id="jenis_usaha"
                  label="Jenis Usaha"
                  placeholder="Contoh: Kuliner, Fashion, Jasa"
                  value={formData.jenis_usaha}
                  onChange={handleChange}
                  required
                />
                <Textarea 
                  id="deskripsi_usaha"
                  label="Deskripsi"
                  placeholder="Ceritakan sedikit tentang bisnis Anda"
                  value={formData.deskripsi_usaha}
                  onChange={handleChange}
                  required
                />
              </div>
            </Card>

            <Card title="Kontak & Lokasi">
              <div className="space-y-4">
                <Input 
                  id="kontak_usaha"
                  label="Nomor WhatsApp/Telepon"
                  placeholder="Contoh: 08123456789"
                  value={formData.kontak_usaha}
                  onChange={handleChange}
                  required
                />
                <Input 
                  id="media_sosial"
                  label="Media Sosial (Opsional)"
                  placeholder="Contoh: @bisnis_saya"
                  value={formData.media_sosial}
                  onChange={handleChange}
                />
                <Textarea 
                  id="alamat"
                  label="Alamat Lengkap"
                  placeholder="Lokasi operasional bisnis"
                  rows={3}
                  value={formData.alamat}
                  onChange={handleChange}
                  required
                />
              </div>
            </Card>

            <div className="flex justify-end space-x-3">
              <Link to="/business">
                <Button variant="secondary" disabled={loading}>Batal</Button>
              </Link>
              <Button type="submit" loading={loading}>
                <Save className="h-4 w-4 mr-2" /> Simpan Bisnis
              </Button>
            </div>
          </div>
        </div>
      </form>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default BusinessCreatePage;
