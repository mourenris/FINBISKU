import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Badge from '../components/Badge';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
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

const AdminArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setKategori] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);

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
          search,
          kategori: category
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
  }, [page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchArticles();
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/artikel/${confirmDelete}`);
      if (response.data.success) {
        setToast({ type: 'success', message: 'Artikel berhasil dihapus' });
        setConfirmDelete(null);
        fetchArticles();
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Gagal menghapus artikel' });
    }
  };

  const columns = [
    { header: 'Thumbnail', key: 'thumbnail_artikel', render: (val) => (
      <img src={`${import.meta.env.VITE_BASE_URL}/api/uploads/articles/${val}`} className="w-16 h-10 object-cover rounded-md border border-neutral-250" alt="" />
    )},
    { header: 'Judul', key: 'judul_artikel', render: (val) => <span className="font-bold text-neutral-800 font-display max-w-xs truncate block">{val}</span> },
    { header: 'Kategori', key: 'kategori_artikel', render: (val) => <Badge variant={getCategoryVariant(val)}>{val}</Badge> },
    { header: 'Penulis', key: 'author_name', render: (val) => <span className="font-semibold text-neutral-700 font-body">{val}</span> },
    { header: 'Dibuat Pada', key: 'created_at', render: (val) => <span className="font-semibold text-neutral-500 font-body">{new Date(val).toLocaleDateString('id-ID')}</span> },
    { 
      header: 'Aksi', 
      key: 'id', 
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Link to={`/admin/articles/${row.id}`}>
            <button className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-[#1a5c38] transition-colors" title="Lihat">
              <Eye className="h-4 w-4" />
            </button>
          </Link>
          <Link to={`/admin/articles/${row.id}/edit`}>
            <button className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-[#1a5c38] transition-colors" title="Edit">
              <Edit className="h-4 w-4" />
            </button>
          </Link>
          <button 
            onClick={() => setConfirmDelete(row.id)}
            className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-red-600 transition-colors"
            title="Hapus"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) 
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 font-display">Manajemen Artikel</h1>
          <p className="text-neutral-500 font-body text-sm">Buat dan kelola konten edukasi finansial untuk UMKM.</p>
        </div>
        <Link to="/admin/articles/add">
          <Button className="bg-[#1a5c38] hover:bg-[#0f3d2b] rounded-btn font-extrabold font-display flex items-center shadow-md">
            <Plus className="h-4 w-4 mr-2 stroke-[3]" /> Artikel Baru
          </Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-card border border-neutral-200 shadow-sm">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6">
            <Input label="Cari Artikel" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Judul..." />
          </div>
          <div className="md:col-span-4">
            <Select label="Kategori" options={categories} value={category} onChange={(e) => setKategori(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-[#1a5c38] text-white px-4 py-2.5 rounded-btn font-extrabold font-display hover:bg-[#0f3d2b] transition-all hover:shadow-md">
              Filter
            </button>
          </div>
        </form>
      </div>

      <Card className="border border-neutral-200">
        <Table columns={columns} data={articles} loading={loading} />
        <div className="mt-4">
          <Pagination page={page} limit={10} total={total} onPageChange={setPage} />
        </div>
      </Card>

      <ConfirmDialog 
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Hapus Artikel?"
        message="Artikel akan dihapus permanen dan tidak dapat diakses oleh publik."
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminArticleListPage;
