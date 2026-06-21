import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, ShieldCheck, Newspaper, Users, Zap } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const LandingPage = () => {
  const [latestArticles, setLatestArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/artikel?limit=3');
        if (response.data.success) {
          setLatestArticles(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const features = [
    {
      title: 'Manajemen Bisnis',
      description: 'Kelola berbagai profil usaha Anda dalam satu dashboard terintegrasi.',
      icon: <BarChart3 className="h-6 w-6 text-primary-600" />
    },
    {
      title: 'Catatan Keuangan',
      description: 'Pantau arus kas (Pemasukan & Pengeluaran) secara real-time dan mudah.',
      icon: <Zap className="h-6 w-6 text-primary-600" />
    },
    {
      title: 'Literasi Finansial',
      description: 'Akses artikel edukasi resmi untuk mengembangkan kemampuan bisnis Anda.',
      icon: <Newspaper className="h-6 w-6 text-primary-600" />
    },
    {
      title: 'Keamanan Data',
      description: 'Data keuangan dan bisnis Anda tersimpan aman dengan enkripsi terkini.',
      icon: <ShieldCheck className="h-6 w-6 text-primary-600" />
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Kelola UMKM Anda dengan <span className="text-primary-600">FINBISKU</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Sistem Informasi Keuangan dan Bisnis terpadu untuk membantu pengusaha UMKM Indonesia mengelola profil, transaksi, Blogs, dan literasi finansial.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
                  Mulai Sekarang Gratis
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
                  Masuk ke Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Fitur Utama</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Dirancang khusus untuk kebutuhan operasional harian pengusaha UMKM.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <div className="mb-4 p-3 bg-primary-50 rounded-xl inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Literasi Finansial Terkini</h2>
              <p className="text-gray-600">Yukk pelajari tips dan trik mengelola bisnis dengan artikel kami.</p>
            </div>
            <Link to="/articles" className="mt-4 md:mt-0 text-primary-600 font-semibold flex items-center hover:underline">
              Lihat Semua Artikel <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner className="py-20" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestArticles.map((article) => (
                <Link key={article.id} to={`/articles/${article.id}`}>
                  <Card noPadding className="h-full hover:translate-y-[-4px] transition-transform duration-300 border-none bg-white overflow-hidden rounded-2xl">
                    <img 
                      src={`${import.meta.env.VITE_BASE_URL}/api/uploads/articles/${article.thumbnail_artikel}`} 
                      alt={article.judul_artikel}
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                    <div className="p-6">
                      <span className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-2 block">{article.kategori_artikel}</span>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{article.judul_artikel}</h3>
                      <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                        {article.isi_artikel.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                      </p>
                      <div className="flex items-center text-xs text-gray-400">
                        <Users className="h-3 w-3 mr-1" /> {article.author_name}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Siap Mengembangkan Bisnis Anda?</h2>
          <p className="text-primary-100 mb-10 max-w-2xl mx-auto">Gabung dengan ribuan UMKM lainnya yang telah menggunakan FINBISKU untuk pertumbuhan bisnis yang lebih terukur.</p>
          <Link to="/register">
            <button className="bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
              Daftar Sekarang
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
