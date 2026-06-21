import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Store, Tag } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';

const PublicBlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicDetail = async () => {
      try {
        const response = await api.get(`/public-blogs/${id}`);
        if (response.data.success) {
          setBlog(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching public blog detail');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicDetail();
  }, [id]);

  if (loading) return <LoadingSpinner className="h-screen" />;
  if (!blog) return (
    <div className="text-center py-20">
      <p className="text-gray-500 font-medium italic">Cerita tidak ditemukan.</p>
      <Link to="/public-blogs" className="text-primary-600 font-bold hover:underline mt-4 inline-block">Kembali ke Daftar Cerita</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 animate-in fade-in pb-20">
      {/* Navigation Tracking Header */}
      <div className="mb-10 space-y-6">
        <Link to="/public-blogs" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-primary-600 transition-colors group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Kembali ke Cerita Usaha
        </Link>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
          {blog.judul_blog}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-b border-gray-100 pb-6">
          <div className="flex items-center font-bold text-primary-600">
            <Store className="h-4 w-4 mr-2" />
            <span>{blog.nama_usaha}</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" /> 
            {new Date(blog.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <Badge variant="success" className="text-[10px] px-2 py-0.5 font-bold uppercase">{blog.kategori_usaha || 'UMKM'}</Badge>
        </div>
      </div>

      {/* Hero View Banner Section */}
      {blog.gambar_blog && (
        <div className="mb-10 rounded-2xl overflow-hidden shadow-md border border-gray-100">
          <img 
            src={`${import.meta.env.VITE_BASE_URL}/api/uploads/blogs/${blog.gambar_blog}`} 
            className="w-full h-64 md:h-[380px] object-cover" 
            alt={blog.judul_blog} 
          />
        </div>
      )}

      {/* Longform Main Content Area */}
      <article className="prose prose-lg prose-primary max-w-none">
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-serif text-xl">
          {blog.isi_blog}
        </div>
      </article>
    </div>
  );
};

export default PublicBlogDetailPage;