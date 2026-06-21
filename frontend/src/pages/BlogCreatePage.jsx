import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import api from '../services/api';
import { useBusiness } from '../contexts/BusinessContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import Toast from '../components/Toast';

const BlogCreatePage = () => {
  const { activeBusiness } = useBusiness();
  const [formData, setFormData] = useState({
    judul_blog: '',
    isi_blog: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeBusiness) return;

    setLoading(true);
    const data = new FormData();
    data.append('usaha_id', activeBusiness.id);
    data.append('judul_blog', formData.judul_blog);
    data.append('isi_blog', formData.isi_blog);
    if (image) data.append('gambar_blog', image);

    try {
      const response = await api.post('/blog', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setToast({ type: 'success', message: 'Blog berhasil dipublikasikan' });
        setTimeout(() => navigate('/blogs'), 1500);
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Gagal membuat blog' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/blogs" className="p-2 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Buat Postingan Baru</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card title="Gambar Utama">
            <div className="flex flex-col items-center">
              <div className="w-full aspect-video rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group">
                {preview ? (
                  <>
                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                    <button type="button" onClick={() => { setImage(null); setPreview(null); }} className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-gray-500 hover:text-red-500"><X className="h-4 w-4" /></button>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <span className="text-[10px] text-gray-400 font-medium">Klik untuk upload</span>
                  </div>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
              </div>
              <p className="mt-4 text-[10px] text-gray-400 text-center">Format: JPG, PNG. Maksimal 2MB.</p>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="space-y-4">
              <Input id="judul_blog" label="Judul Blog" placeholder="Masukkan judul yang menarik" value={formData.judul_blog} onChange={handleChange} required />
              <Textarea id="isi_blog" label="Isi Blog" placeholder="Tulis cerita atau promo Anda di sini..." rows={12} value={formData.isi_blog} onChange={handleChange} required />
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <Link to="/blogs">
                <Button variant="secondary">Batal</Button>
              </Link>
              <Button type="submit" loading={loading}>Publikasikan Sekarang</Button>
            </div>
          </Card>
        </div>
      </form>
      
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default BlogCreatePage;
