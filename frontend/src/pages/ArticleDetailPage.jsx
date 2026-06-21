import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Bookmark, User, Calendar, Tag, ArrowLeft, CheckCircle, Share2, Copy, Send } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';
import Toast from '../components/Toast';

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

const ArticleDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAdmin = location.pathname.startsWith('/admin');

  const getBackPath = () => {
    if (isAdmin) return "/admin/articles";
    if (isDashboard) return "/dashboard/articles";
    return "/articles";
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/artikel/${id}`);
        if (response.data.success) {
          setArticle(response.data.data);
          
          // Check if already bookmarked if logged in
          if (isAuthenticated) {
            const bResponse = await api.get('/bookmarks');
            if (bResponse.data.success) {
              const found = bResponse.data.data.find(b => b.id === parseInt(id));
              setIsBookmarked(!!found);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching article');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, isAuthenticated]);

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      setToast({ type: 'info', message: 'Silakan login untuk menyimpan artikel' });
      return;
    }

    try {
      const response = await api.post('/bookmarks', { artikel_id: id });
      if (response.data.success) {
        setIsBookmarked(true);
        setToast({ type: 'success', message: 'Artikel berhasil disimpan ke bookmark' });
      }
    } catch (error) {
      setToast({ 
        type: 'error', 
        message: error.response?.data?.message || 'Gagal menyimpan bookmark' 
      });
    }
  };

  const shareArticle = (platform) => {
    const url = window.location.href;
    const title = article?.judul_artikel;
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setToast({ type: 'success', message: 'Link berhasil disalin!' });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) return <LoadingSpinner className="h-screen" />;
  if (!article) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h2>
      <Link to={getBackPath()} className="text-primary-600 hover:underline">Kembali ke daftar artikel</Link>
    </div>
  );

  return (
    <div className={(isDashboard || isAdmin) ? 'pb-20 animate-in fade-in' : 'bg-gray-50 min-h-screen pb-20'}>
      {/* Header Image */}
      <div className="w-full h-[320px] md:h-[400px] relative overflow-hidden rounded-2xl mb-8">
        <img 
          src={`${import.meta.env.VITE_BASE_URL}/api/uploads/articles/${article.thumbnail_artikel}`} 
          alt={article.judul_artikel}
          className="w-full h-full object-cover blur-[2px] scale-105 opacity-50 absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-end pb-12">
          <Link to={getBackPath()} className="text-white/80 hover:text-white flex items-center mb-6 transition-colors w-fit">
            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
          </Link>
          <div className="max-w-4xl">
            <Badge variant={getCategoryVariant(article.kategori_artikel)} className="mb-4 text-sm px-4 py-1">{article.kategori_artikel}</Badge>
            <h1 className="text-2xl md:text-5xl font-bold text-white leading-tight mb-6">{article.judul_artikel}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
              <div className="flex items-center"><User className="h-4 w-4 mr-2 text-primary-400" /> {article.author_name}</div>
              <div className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-primary-400" /> {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={(isDashboard || isAdmin) ? '' : 'container mx-auto px-4 -mt-8 relative z-20'}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className={isAdmin ? 'lg:col-span-12' : 'lg:col-span-8'}>
            <Card className="prose prose-primary max-w-none shadow-xl border-none bg-white">
              <div 
                className="text-gray-700 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: article.isi_artikel }} 
              />
            </Card>
          </div>

          {!isAdmin && (
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <Card title="Tindakan" className="bg-white border-none shadow-sm">
                  {isBookmarked ? (
                    <div className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-xl border border-green-100">
                      <CheckCircle className="h-5 w-5 mr-2" /> Tersimpan di Bookmark
                    </div>
                  ) : (
                    <Button 
                      className="w-full py-4 text-base rounded-xl"
                      onClick={handleBookmark}
                    >
                      <Bookmark className="h-5 w-5 mr-2" /> Simpan Artikel
                    </Button>
                  )}
                  <p className="mt-4 text-xs text-center text-gray-500 leading-relaxed">
                    Simpan artikel ini untuk membacanya kembali di kemudian hari melalui menu Bookmark di dashboard Anda.
                  </p>
                </Card>

                <Card title="Bagikan Artikel">
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => shareArticle('facebook')}
                      className="flex items-center justify-center py-2 px-3 rounded-xl bg-[#1877F2] text-white text-xs font-bold hover:opacity-90 transition-opacity"
                    >
                      Facebook
                    </button>
                    <button 
                      onClick={() => shareArticle('twitter')}
                      className="flex items-center justify-center py-2 px-3 rounded-xl bg-[#000000] text-white text-xs font-bold hover:opacity-90 transition-opacity"
                    >
                      Twitter / X
                    </button>
                    <button 
                      onClick={() => shareArticle('whatsapp')}
                      className="flex items-center justify-center py-2 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:opacity-90 transition-opacity"
                    >
                      WhatsApp
                    </button>
                    <button 
                      onClick={() => shareArticle('copy')}
                      className="flex items-center justify-center py-2 px-3 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-colors"
                    >
                      <Copy className="h-3 w-3 mr-2" /> Salin Link
                    </button>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <Toast 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default ArticleDetailPage;
