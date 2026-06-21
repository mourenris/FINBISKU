import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Filter, Calendar, User } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(6);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  const getCategoryVariant = (category) => {
    switch (category) {
      case 'Perencanaan Keuangan':
        return 'gold-solid';
      case 'Permodalan & Investasi':
        return 'green-solid';
      case 'Pemasaran & Digitalisasi':
        return 'blue-solid';
      case 'Legalitas & Perizinan':
        return 'amber-solid';
      case 'Pengembangan Produk':
        return 'purple-solid';
      default:
        return 'primary';
    }
  };

  const categories = [
    { label: 'Semua Kategori', value: '' },
    { label: 'Perencanaan Keuangan', value: 'Perencanaan Keuangan' },
    { label: 'Permodalan & Investasi', value: 'Permodalan & Investasi' },
    { label: 'Pemasaran & Digitalisasi', value: 'Pemasaran & Digitalisasi' },
    { label: 'Legalitas & Perizinan', value: 'Legalitas & Perizinan' },
    { label: 'Pengembangan Produk', value: 'Pengembangan Produk' },
  ];

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await api.get('/artikel', {
        params: {
          page,
          limit,
          search,
          kategori
        }
      });
      if (response.data.success) {
        setArticles(response.data.data);
        setTotal(response.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, kategori, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchArticles();
  };

  return (
    <div className={isDashboard ? 'space-y-6 animate-in fade-in' : 'bg-gray-50 min-h-screen py-12'}>
      <div className={isDashboard ? '' : 'container mx-auto px-4'}>
        <div className={isDashboard ? 'mb-6' : 'max-w-4xl mx-auto text-center mb-12'}>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            {isDashboard ? 'Edukasi & Literasi Finansial' : 'Literasi Finansial & Bisnis'}
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Kumpulan artikel edukatif untuk membantu Anda membangun bisnis yang berkelanjutan.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-6">
              <Input 
                label="Cari Artikel" 
                placeholder="Judul atau isi artikel..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="md:col-span-4">
              <Select 
                label="Kategori" 
                options={categories}
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <button 
                type="submit"
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                <Search className="h-4 w-4 mr-2" /> Cari
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <LoadingSpinner className="py-20" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link key={article.id} to={isDashboard ? `/dashboard/articles/${article.id}` : `/articles/${article.id}`}>
                  <Card noPadding className="h-full group hover:shadow-md transition-all duration-300 border-none bg-white overflow-hidden rounded-2xl">
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <img 
                        src={`${import.meta.env.VITE_BASE_URL}/api/uploads/articles/${article.thumbnail_artikel}`} 
                        alt={article.judul_artikel}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant={getCategoryVariant(article.kategori_artikel)} className="shadow-sm">{article.kategori_artikel}</Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {article.judul_artikel}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-3 mb-6">
                        {article.isi_artikel.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1 text-primary-400" /> {article.author_name}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-primary-400" /> {new Date(article.created_at).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {articles.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 italic">Tidak ada artikel yang ditemukan.</p>
              </div>
            )}

            <div className="mt-12">
              <Pagination 
                total={total} 
                page={page} 
                limit={limit} 
                onPageChange={(p) => setPage(p)} 
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ArticleListPage;
