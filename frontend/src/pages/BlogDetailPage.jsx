import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/blog/${id}`);
        if (response.data.success) {
          setBlog(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching blog');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <LoadingSpinner className="h-screen" />;
  if (!blog) return <div className="text-center py-20 italic">Blog tidak ditemukan.</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 animate-in fade-in pb-20">
      {/* Navigation and Metadata */}
      <div className="mb-10 space-y-6">
        <Link to="/blogs" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-primary-600 transition-colors group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Kembali ke Daftar Blog
        </Link>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
          {blog.judul_blog}
        </h1>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 border-b border-gray-100 pb-6">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary-500" /> 
            {new Date(blog.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center italic text-gray-400">
            Kategori: Bisnis & UMKM
          </div>
        </div>
      </div>

      {/* Hero Image - Fixed Height & Content First */}
      {blog.gambar_blog && (
        <div className="mb-10 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <img 
            src={`${import.meta.env.VITE_BASE_URL}/api/uploads/blogs/${blog.gambar_blog}`} 
            className="w-full h-64 md:h-[400px] object-cover" 
            alt={blog.judul_blog} 
          />
        </div>
      )}

      {/* Blog Content */}
      <article className="prose prose-lg prose-primary max-w-none">
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-serif text-xl">
          {blog.isi_blog}
        </div>
      </article>

      {/* Footer / Author Box Placeholder */}
      <div className="mt-16 pt-8 border-t border-gray-100">
        <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-2xl">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Dipublikasikan oleh</p>
            <p className="font-bold text-gray-900">Pemilik Bisnis FINBISKU</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
