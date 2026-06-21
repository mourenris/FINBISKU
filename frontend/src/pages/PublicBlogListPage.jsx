import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Store, MessageSquare, ArrowRight } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';

const PublicBlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicBlogs = async () => {
      try {
        const response = await api.get('/public-blogs');
        if (response.data.success) {
          setBlogs(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load public stories');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicBlogs();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <Badge variant="primary" className="mb-3 px-3 py-1 text-xs">Kisah Sukses UMKM</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cerita Usaha & Promo</h1>
          <p className="text-gray-600 text-lg">Ikuti cerita perjuangan, tips, dan penawaran menarik langsung dari pelaku UMKM terbaik.</p>
        </div>

        {loading ? (
          <LoadingSpinner className="py-20" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link key={blog.id} to={`/public-blogs/${blog.id}`}>
                  <Card noPadding className="h-full group flex flex-col hover:shadow-md transition-all duration-300 border-none bg-white overflow-hidden">
                    <div className="relative h-52 bg-gray-100 overflow-hidden">
                      {blog.gambar_blog ? (
                        <img 
                          src={`${import.meta.env.VITE_BASE_URL}/api/uploads/blogs/${blog.gambar_blog}`} 
                          alt={blog.judul_blog}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <MessageSquare className="h-12 w-12" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge variant="success" className="shadow-sm">{blog.kategori_usaha || 'UMKM'}</Badge>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center text-xs text-primary-600 font-bold space-x-1.5 mb-2">
                          <Store className="h-3.5 w-3.5" />
                          <span>{blog.nama_usaha}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                          {blog.judul_blog}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-3 mb-6">
                          {blog.isi_blog.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50 mt-auto">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" /> 
                          {new Date(blog.created_at).toLocaleDateString('id-ID')}
                        </div>
                        <span className="text-primary-600 font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                          Baca <ArrowRight className="h-3 w-3 ml-1" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {blogs.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium italic">Belum ada cerita usaha yang dipublikasikan.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PublicBlogListPage;