import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, UserCheck, UserX, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';
import Input from '../components/Input';
import Select from '../components/Select';
import Badge from '../components/Badge';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';

const UserListPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirmStatus, setConfirmStatus] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/users?page=${page}&search=${search}&status=${status}`);
      if (response.data.success) {
        setUsers(response.data.data);
        setTotal(response.data.total || response.data.data.length); 
      }
    } catch (error) {
      console.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const toggleUserStatus = async () => {
    const { id, currentStatus } = confirmStatus;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const response = await api.patch(`/admin/users/${id}/status`, { status: newStatus });
      if (response.data.success) {
        setToast({ type: 'success', message: `User berhasil ${newStatus === 'active' ? 'diaktifkan' : 'dinonaktifkan'}` });
        setConfirmStatus(null);
        fetchUsers();
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Gagal mengubah status' });
    }
  };

  const columns = [
    { header: 'Nama', key: 'nama', render: (val, row) => (
      <div className="flex flex-col">
        <span className="font-bold text-neutral-800 font-display">{val}</span>
        <span className="text-xs text-neutral-450 font-body">{row.email}</span>
      </div>
    )},
    { header: 'Role', key: 'role', render: (val) => <span className="capitalize font-semibold text-neutral-700 font-body">{val}</span> },
    { 
      header: 'Status', 
      key: 'status', 
      render: (val) => (
        <Badge variant={val === 'active' ? 'success' : 'danger'}>
          {val === 'active' ? 'Aktif' : 'Inaktif'}
        </Badge>
      ) 
    },
    { header: 'Tgl Daftar', key: 'created_at', render: (val) => <span className="font-semibold text-neutral-500 font-body">{new Date(val).toLocaleDateString('id-ID')}</span> },
    { 
      header: 'Aksi', 
      key: 'id', 
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Link to={`/admin/users/${row.id}`}>
            <button className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-[#1a5c38] transition-colors" title="Lihat Profil">
              <Eye className="h-4 w-4" />
            </button>
          </Link>
          {row.id !== currentUser.id && (
            <button 
              onClick={() => setConfirmStatus({ id: row.id, currentStatus: row.status })}
              className={`p-1.5 hover:bg-neutral-100 rounded-lg transition-colors ${row.status === 'active' ? 'text-neutral-400 hover:text-[#dc2626]' : 'text-neutral-450 hover:text-[#1a5c38]'}`}
              title={row.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
            >
              {row.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
            </button>
          )}
        </div>
      ) 
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800 font-display">Manajemen Pengguna</h1>
        <p className="text-neutral-500 font-body text-sm">Pantau dan kelola akses pengguna FINBISKU.</p>
      </div>

      <div className="bg-white p-6 rounded-card border border-neutral-200 shadow-sm">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6">
            <Input 
              label="Cari User" 
              placeholder="Nama atau email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="md:col-span-4">
            <Select 
              label="Status" 
              options={[
                { label: 'Semua Status', value: '' },
                { label: 'Aktif', value: 'active' },
                { label: 'Inaktif', value: 'inactive' }
              ]}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-[#1a5c38] text-white px-4 py-2.5 rounded-btn font-extrabold font-display hover:bg-[#0f3d2b] transition-all hover:shadow-md">
              Filter
            </button>
          </div>
        </form>
      </div>

      <Card className="border border-neutral-200">
        <Table columns={columns} data={users} loading={loading} />
        <div className="mt-4">
          <Pagination page={page} limit={10} total={total} onPageChange={setPage} />
        </div>
      </Card>

      <ConfirmDialog 
        isOpen={!!confirmStatus}
        onClose={() => setConfirmStatus(null)}
        onConfirm={toggleUserStatus}
        title={confirmStatus?.currentStatus === 'active' ? 'Nonaktifkan User?' : 'Aktifkan User?'}
        message={confirmStatus?.currentStatus === 'active' 
          ? 'User tidak akan bisa login ke dashboard hingga diaktifkan kembali.' 
          : 'User akan mendapatkan kembali akses penuh ke dashboard mereka.'
        }
        variant={confirmStatus?.currentStatus === 'active' ? 'danger' : 'primary'}
        confirmText={confirmStatus?.currentStatus === 'active' ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default UserListPage;
