import React, { useState, useEffect } from 'react';
import { Bookmark as BookmarkIcon, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import Badge from '../components/Badge';

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

const BookmarkListPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookmarks');
      if (response.data.success) {
        setBookmarks(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/bookmarks/${confirmDelete}`);
      if (response.data.success) {
        setToast({ type: 'success', message: 'Bookmark dihapus' });
        setConfirmDelete(null);
        fetchBookmarks();
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Gagal menghapus bookmark' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800 flex items-center font-display">
          <BookmarkIcon className="h-6 w-6 mr-2.5 text-[#1a5c38]" /> Bookmark Saya
        </h1>
      </div>

      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((b) => (
            <Card key={b.bookmark_id} noPadding className="flex flex-col border border-neutral-200 shadow-md overflow-hidden rounded-card relative group">
              <button 
                onClick={() => setConfirmDelete(b.bookmark_id)}
                className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm z-10"
                title="Hapus Bookmark"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="relative overflow-hidden">
                <img 
                  src={`${import.meta.env.VITE_BASE_URL}/api/uploads/articles/${b.thumbnail_artikel}`} 
                  className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt="" 
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="mb-3">
                    <Badge variant={getCategoryVariant(b.kategori_artikel)}>{b.kategori_artikel}</Badge>
                  </div>
                  <h3 className="font-bold text-neutral-855 text-neutral-800 mb-4 line-clamp-2 font-display group-hover:text-[#1a5c38] transition-colors">{b.judul_artikel}</h3>
                </div>
                <Link to={`/dashboard/articles/${b.id}`} className="mt-2 w-full block">
                  <Button variant="secondary" size="sm" className="w-full flex items-center justify-center gap-1.5 bg-[#1a5c38] hover:bg-[#0f3d2b]">
                    Baca Artikel <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
          {bookmarks.length === 0 && (
            <div className="col-span-full py-20 text-center text-neutral-500 bg-white rounded-card border border-neutral-350 border-dashed font-body">
              Belum ada artikel yang disimpan.
            </div>
          )}
        </div>
      )}

      <ConfirmDialog 
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Hapus Bookmark?"
        message="Artikel ini akan dihapus dari daftar simpanan Anda."
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default BookmarkListPage;
