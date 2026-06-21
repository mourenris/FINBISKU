import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, ArrowUpCircle, ArrowDownCircle, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useBusiness } from '../contexts/BusinessContext';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';

const TransactionListPage = () => {
  const { activeBusiness } = useBusiness();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchTransactions = async () => {
    if (!activeBusiness) return;
    setLoading(true);
    try {
      const response = await api.get(`/transaksi?usaha_id=${activeBusiness.id}&page=${page}`);
      if (response.data.success) {
        setTransactions(response.data.data);
        if (response.data.pagination) {
          setTotal(response.data.pagination.total);
        }
        const dashboardRes = await api.get(`/dashboard/user?usaha_id=${activeBusiness.id}`);
        if (dashboardRes.data.success) {
          const d = dashboardRes.data.data;
          setSummary({ income: d.total_pemasukan, expense: d.total_pengeluaran, balance: d.saldo });
        }
      }
    } catch (error) {
      console.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [activeBusiness, page]);

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/transaksi/${confirmDelete}`);
      if (response.data.success) {
        setToast({ type: 'success', message: 'Transaksi berhasil dihapus' });
        setConfirmDelete(null);
        fetchTransactions();
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Gagal menghapus transaksi' });
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  const columns = [
    { header: 'Tanggal', key: 'tanggal', render: (val) => <span className="font-semibold text-neutral-600 font-body">{new Date(val).toLocaleDateString('id-ID')}</span> },
    { header: 'Kategori', key: 'kategori', render: (val) => <span className="font-bold text-neutral-800 font-display">{val}</span> },
    { header: 'Keterangan', key: 'keterangan', render: (val) => <span className="text-neutral-450 italic max-w-[200px] truncate block font-body">{val || '-'}</span> },
    { 
      header: 'Jenis', 
      key: 'jenis_transaksi', 
      render: (val) => (
        <Badge variant={val === 'Pemasukan' ? 'success' : 'danger'}>{val}</Badge>
      ) 
    },
    { header: 'Nominal', key: 'nominal', render: (val) => <span className="font-bold text-neutral-800 font-display">{formatCurrency(val)}</span> },
    { 
      header: 'Aksi', 
      key: 'id', 
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Link to={`/transactions/${row.id}/edit`}>
            <button className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-[#1a5c38] transition-colors">
              <Edit className="h-4 w-4" />
            </button>
          </Link>
          <button 
            onClick={() => setConfirmDelete(row.id)}
            className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-[#dc2626] transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) 
    }
  ];

  if (!activeBusiness) return (
    <div className="text-center py-20 bg-white rounded-card shadow-sm border border-neutral-200 font-body">
      <Filter className="h-12 w-12 text-[#1a5c38]/40 mx-auto mb-4" />
      <h3 className="text-lg font-bold font-display text-neutral-800">Pilih Bisnis</h3>
      <p className="text-neutral-500 max-w-sm mx-auto mt-1">Silakan pilih bisnis terlebih dahulu di menu header untuk melihat transaksi.</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 font-display">Riwayat Transaksi</h1>
          <p className="text-neutral-500 font-body text-sm">Buku kas untuk {activeBusiness.nama_usaha}</p>
        </div>
        <Link to="/transactions/add">
          <Button className="bg-[#1a5c38] hover:bg-[#0f3d2b] rounded-btn font-extrabold font-display shadow-md flex items-center">
            <Plus className="h-4.5 w-4.5 mr-2 stroke-[3]" /> Catat Transaksi
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#1a5c38]/5 border-[#1a5c38]/10 hover:shadow-lg transition-all duration-200">
          <p className="text-[10px] font-bold text-[#1a5c38] uppercase tracking-wider mb-1 font-display">Total Pemasukan</p>
          <h4 className="text-2xl font-extrabold text-[#1a5c38] font-display tracking-tight">{formatCurrency(summary.income)}</h4>
        </Card>
        <Card className="bg-red-50/40 border-red-100 hover:shadow-lg transition-all duration-200">
          <p className="text-[10px] font-bold text-[#dc2626] uppercase tracking-wider mb-1 font-display">Total Pengeluaran</p>
          <h4 className="text-2xl font-extrabold text-[#dc2626] font-display tracking-tight">{formatCurrency(summary.expense)}</h4>
        </Card>
        <Card className="bg-[#d4a830]/5 border-[#d4a830]/10 hover:shadow-lg transition-all duration-200">
          <p className="text-[10px] font-bold text-[#8b6820] uppercase tracking-wider mb-1 font-display">Saldo Saat Ini</p>
          <h4 className="text-2xl font-extrabold text-[#8b6820] font-display tracking-tight">{formatCurrency(summary.balance)}</h4>
        </Card>
      </div>

      <Card className="border border-neutral-200">
        <Table columns={columns} data={transactions} loading={loading} />
        <div className="mt-4">
          <Pagination page={page} limit={10} total={total} onPageChange={setPage} />
        </div>
      </Card>

      <ConfirmDialog 
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Hapus Transaksi?"
        message="Data transaksi yang dihapus tidak dapat dikembalikan."
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default TransactionListPage;
