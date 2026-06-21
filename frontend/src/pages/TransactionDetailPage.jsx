import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, User, ArrowUpCircle, ArrowDownCircle, Info, Edit } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const TransactionDetailPage = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/transaksi/${id}`);
        if (response.data.success) {
          setTransaction(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching transaction');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <LoadingSpinner className="h-screen" />;
  if (!transaction) return <div className="text-center py-20 italic">Transaksi tidak ditemukan.</div>;

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between">
        <Link to="/transactions" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Riwayat
        </Link>
        <Link to={`/transactions/${id}/edit`}>
          <Button variant="secondary" size="sm"><Edit className="h-4 w-4 mr-2" /> Edit</Button>
        </Link>
      </div>

      <Card className="border-none shadow-xl overflow-hidden">
        <div className={`h-2 w-full ${transaction.jenis_transaksi === 'Pemasukan' ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <div className="p-8">
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Detail Transaksi</p>
            <h2 className={`text-4xl font-black ${transaction.jenis_transaksi === 'Pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.jenis_transaksi === 'Pemasukan' ? '+' : '-'} {formatCurrency(transaction.nominal)}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center py-4 border-b border-gray-50">
              <span className="text-gray-500 text-sm">Status Arus Kas</span>
              <Badge variant={transaction.jenis_transaksi === 'Pemasukan' ? 'success' : 'danger'} className="px-4 py-1 text-sm">
                {transaction.jenis_transaksi}
              </Badge>
            </div>

            <div className="flex justify-between items-center py-4 border-b border-gray-50">
              <span className="text-gray-500 text-sm">Kategori</span>
              <span className="font-bold text-gray-900">{transaction.kategori}</span>
            </div>

            <div className="flex justify-between items-center py-4 border-b border-gray-50">
              <span className="text-gray-500 text-sm">Tanggal Pencatatan</span>
              <div className="flex items-center font-medium text-gray-900">
                <Calendar className="h-4 w-4 mr-2 text-primary-400" />
                {new Date(transaction.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>

            <div className="space-y-2 py-4">
              <span className="text-gray-500 text-sm block">Keterangan Tambahan</span>
              <div className="p-4 bg-gray-50 rounded-xl text-gray-600 text-sm italic leading-relaxed border border-gray-100">
                {transaction.keterangan || 'Tidak ada keterangan tambahan.'}
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-2xl flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Catatan ini disimpan secara aman dan digunakan untuk menghitung ringkasan keuangan pada dashboard bisnis Anda.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TransactionDetailPage;
