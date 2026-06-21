import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Eye, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useBusiness } from '../contexts/BusinessContext';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';

const BlogListPage = () => {
  const { activeBusiness } = useBusiness();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchBlogs = async () => {
    if (!activeBusiness) return;
    setLoading(true);
    try {
      const response = await api.get(`/blog?usaha_id=${activeBusiness.id}`);
      if (response.data.success) {
        setBlogs(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [activeBusiness]);

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/blog/${confirmDelete}`);
      if (response.data.success) {
        setToast({ type: 'success', message: 'Blog berhasil dihapus' });
        setConfirmDelete(null);
        fetchBlogs();
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Gagal menghapus blog' });
    }
  };

  if (!activeBusiness) return (
    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
      <MessageSquare className="h-12 w-12 text-gray-200 mx-auto mb-4" />
      <h3 className="text-lg font-bold">Pilih Bisnis</h3>
      <p className="text-gray-500">Silakan pilih bisnis untuk mengelola blog.</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Bisnis</h1>
          <p className="text-gray-500">Bagikan cerita dan promo untuk {activeBusiness.nama_usaha}</p>
        </div>
        <Link to="/blogs/add">
          <Button><Plus className="h-4 w-4 mr-2" /> Buat Blog Baru</Button>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card key={blog.id} noPadding className="h-full flex flex-col group border-none shadow-md overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                {blog.gambar_blog ? (
                  <img src={`${import.meta.env.VITE_BASE_URL}/api/uploads/blogs/${blog.gambar_blog}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <MessageSquare className="h-12 w-12" />
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{blog.judul_blog}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">{blog.isi_blog.replace(/<[^>]*>?/gm, '')}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xs text-gray-400">{new Date(blog.created_at).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-2">
                    <Link to={`/blogs/${blog.id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link to={`/blogs/${blog.id}/edit`} className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button onClick={() => setConfirmDelete(blog.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {blogs.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500 italic">Belum ada blog yang dipublikasikan.</div>
          )}
        </div>
      )}

      <ConfirmDialog 
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Hapus Blog?"
        message="Postingan blog akan dihapus permanen dari publik."
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default BlogListPage;
