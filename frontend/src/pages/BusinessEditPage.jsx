import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Trash2 } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { useBusiness } from '../contexts/BusinessContext';

const BusinessEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchBusinesses } = useBusiness();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    nama_usaha: '',
    jenis_usaha: '',
    alamat: '',
    deskripsi_usaha: '',
    tahun_berdiri: '',
    status_umkm: '',
    kontak_usaha: '',
    media_sosial: ''
  });
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentLogo, setCurrentLogo] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/usaha/${id}`);
        if (response.data.success) {
          const b = response.data.data;
          setFormData({
            nama_usaha: b.nama_usaha,
            jenis_usaha: b.jenis_usaha,
            alamat: b.alamat,
            deskripsi_usaha: b.deskripsi_usaha,
            tahun_berdiri: b.tahun_berdiri,
            status_umkm: b.status_umkm,
            kontak_usaha: b.kontak_usaha,
            media_sosial: b.media_sosial || ''
          });
          setCurrentLogo(b.logo_usaha);
        }
      } catch (error) {
        setToast({ type: 'error', message: 'Gagal memuat data bisnis' });
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (logo) data.append('logo_usaha', logo);
    
    // PHP Native usually needs a workaround for PUT with FormData
    // We used POST in Controller for simplicity with _method or just POST
    try {
      const response = await api.post(`/usaha/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setToast({ type: 'success', message: 'Bisnis berhasil diperbarui' });
        await fetchBusinesses();
        setTimeout(() => navigate('/business'), 1500);
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Gagal memperbarui bisnis' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner className="h-screen" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/business" className="p-2 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Bisnis</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card title="Logo Usaha">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group">
                  {(preview || currentLogo) ? (
                    <>
                      <img 
                        src={preview || `${import.meta.env.VITE_BASE_URL}/api/uploads/logos/${currentLogo}`} 
                        className="w-full h-full object-cover" 
                        alt="Logo" 
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <p className="mt-4 text-[10px] text-gray-400 text-center">Klik gambar untuk mengganti logo.</p>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card title="Informasi Utama">
              <div className="space-y-4">
                <Input id="nama_usaha" label="Nama Bisnis" value={formData.nama_usaha} onChange={handleChange} required />
                <Input id="jenis_usaha" label="Jenis Usaha" value={formData.jenis_usaha} onChange={handleChange} required />
                <Textarea id="deskripsi_usaha" label="Deskripsi" value={formData.deskripsi_usaha} onChange={handleChange} required />
              </div>
            </Card>

            <Card title="Kontak & Lainnya">
              <div className="space-y-4">
                <Input id="kontak_usaha" label="WhatsApp/Telepon" value={formData.kontak_usaha} onChange={handleChange} required />
                <Input id="media_sosial" label="Media Sosial" value={formData.media_sosial} onChange={handleChange} />
                <Textarea id="alamat" label="Alamat" value={formData.alamat} onChange={handleChange} required />
              </div>
            </Card>

            <div className="flex justify-end space-x-3">
              <Link to="/business">
                <Button variant="secondary" disabled={submitting}>Batal</Button>
              </Link>
              <Button type="submit" loading={submitting}>
                <Save className="h-4 w-4 mr-2" /> Simpan Perubahan
              </Button>
            </div>
          </div>
        </div>
      </form>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default BusinessEditPage;
