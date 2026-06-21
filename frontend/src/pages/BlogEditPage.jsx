import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const BlogEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({ judul_blog: '', isi_blog: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/blog/${id}`);
        if (response.data.success) {
          const b = response.data.data;
          setFormData({ judul_blog: b.judul_blog, isi_blog: b.isi_blog });
          setCurrentImage(b.gambar_blog);
        }
      } catch (error) {
        setToast({ type: 'error', message: 'Gagal memuat blog' });
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
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    data.append('judul_blog', formData.judul_blog);
    data.append('isi_blog', formData.isi_blog);
    if (image) data.append('gambar_blog', image);

    try {
      const response = await api.post(`/blog/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setToast({ type: 'success', message: 'Blog berhasil diperbarui' });
        setTimeout(() => navigate('/blogs'), 1500);
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Gagal memperbarui blog' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner className="h-screen" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/blogs" className="p-2 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Postingan</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card title="Gambar Utama">
            <div className="flex flex-col items-center">
              <div className="w-full aspect-video rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group">
                {(preview || currentImage) ? (
                  <>
                    <img 
                      src={preview || `${import.meta.env.VITE_BASE_URL}/api/uploads/blogs/${currentImage}`} 
                      className="w-full h-full object-cover" 
                      alt="" 
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
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="space-y-4">
              <Input id="judul_blog" label="Judul Blog" value={formData.judul_blog} onChange={handleChange} required />
              <Textarea id="isi_blog" label="Isi Blog" rows={12} value={formData.isi_blog} onChange={handleChange} required />
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <Link to="/blogs">
                <Button variant="secondary">Batal</Button>
              </Link>
              <Button type="submit" loading={submitting}>Simpan Perubahan</Button>
            </div>
          </Card>
        </div>
      </form>
      
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default BlogEditPage;
