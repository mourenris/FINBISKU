import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminArticleEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    judul_artikel: '',
    kategori_artikel: '',
    isi_artikel: ''
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentThumbnail, setCurrentThumbnail] = useState(null);

  const categories = [
    { label: 'Perencanaan Keuangan', value: 'Perencanaan Keuangan' },
    { label: 'Permodalan & Investasi', value: 'Permodalan & Investasi' },
    { label: 'Pemasaran & Digitalisasi', value: 'Pemasaran & Digitalisasi' },
    { label: 'Legalitas & Perizinan', value: 'Legalitas & Perizinan' },
    { label: 'Pengembangan Produk', value: 'Pengembangan Produk' },
  ];

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/artikel/${id}`);
        if (response.data.success) {
          const a = response.data.data;
          setFormData({
            judul_artikel: a.judul_artikel,
            kategori_artikel: a.kategori_artikel,
            isi_artikel: a.isi_artikel
          });
          setCurrentThumbnail(a.thumbnail_artikel);
        }
      } catch (error) {
        setToast({ type: 'error', message: 'Gagal memuat artikel' });
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append('judul_artikel', formData.judul_artikel);
    data.append('kategori_artikel', formData.kategori_artikel);
    data.append('isi_artikel', formData.isi_artikel);
    if (thumbnail) data.append('thumbnail_artikel', thumbnail);

    try {
      const response = await api.post(`/artikel/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setToast({ type: 'success', message: 'Artikel berhasil diperbarui' });
        setTimeout(() => navigate('/admin/articles'), 1500);
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Gagal memperbarui artikel' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner className="h-screen" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/admin/articles" className="p-2 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Artikel</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card title="Thumbnail">
            <div className="flex flex-col items-center">
              <div className="w-full aspect-video rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group">
                {(preview || currentThumbnail) ? (
                  <>
                    <img 
                      src={preview || `${import.meta.env.VITE_BASE_URL}/api/uploads/articles/${currentThumbnail}`} 
                      className="w-full h-full object-cover" 
                      alt="" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                  </>
                ) : (
                  <Upload className="h-8 w-8 text-gray-300" />
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
              </div>
              <p className="mt-4 text-[10px] text-gray-400 text-center">Klik untuk ganti thumbnail.</p>
            </div>
          </Card>

          <Card title="Kategori">
            <Select id="kategori_artikel" label="Pilih Kategori" options={categories} value={formData.kategori_artikel} onChange={handleChange} />
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="space-y-4">
              <Input id="judul_artikel" label="Judul Artikel" value={formData.judul_artikel} onChange={handleChange} required />
              <Textarea id="isi_artikel" label="Konten Artikel" rows={20} value={formData.isi_artikel} onChange={handleChange} required />
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <Link to="/admin/articles">
                <Button variant="secondary">Batal</Button>
              </Link>
              <Button type="submit" loading={submitting}><Save className="h-4 w-4 mr-2" /> Simpan Perubahan</Button>
            </div>
          </Card>
        </div>
      </form>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminArticleEditPage;
