import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Calendar, 
  Globe, 
  Edit, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  History,
  FileText
} from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';
import Table from '../components/Table';

const BusinessDetailPage = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bRes, tRes, blogRes] = await Promise.all([
          api.get(`/usaha/${id}`),
          api.get(`/transaksi?usaha_id=${id}&limit=5`),
          api.get(`/blog?usaha_id=${id}`)
        ]);

        if (bRes.data.success) setBusiness(bRes.data.data);
        if (tRes.data.success) setRecentTransactions(tRes.data.data);
        if (blogRes.data.success) setRecentBlogs(blogRes.data.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching business detail');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner className="h-screen" />;
  if (!business) return <div className="text-center py-20">Bisnis tidak ditemukan</div>;

  const transactionColumns = [
    { header: 'Tanggal', key: 'tanggal', render: (val) => new Date(val).toLocaleDateString('id-ID') },
    { 
      header: 'Jenis', 
      key: 'jenis_transaksi', 
      render: (val) => (
        <div className="flex items-center">
          {val === 'Pemasukan' ? <ArrowUpCircle className="h-4 w-4 text-green-500 mr-2" /> : <ArrowDownCircle className="h-4 w-4 text-red-500 mr-2" />}
          <span className={val === 'Pemasukan' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{val}</span>
        </div>
      ) 
    },
    { header: 'Kategori', key: 'kategori' },
    { header: 'Nominal', key: 'nominal', render: (val) => <strong>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val)}</strong> }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link to="/business" className="p-2 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{business.nama_usaha}</h1>
            <p className="text-primary-600 font-semibold">{business.jenis_usaha}</p>
          </div>
        </div>
        <Link to={`/business/${id}/edit`}>
          <Button variant="secondary">
            <Edit className="h-4 w-4 mr-2" /> Edit Profil Bisnis
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Business Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="text-center border-none shadow-md">
            <div className="w-32 h-32 mx-auto rounded-3xl bg-primary-50 border border-primary-100 overflow-hidden mb-6">
              {business.logo_usaha ? (
                <img src={`${import.meta.env.VITE_BASE_URL}/api/uploads/logos/${business.logo_usaha}`} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary-600 font-bold text-3xl">
                  {business.nama_usaha.charAt(0)}
                </div>
              )}
            </div>
            <Badge variant="primary" className="mb-4 px-4 py-1">{business.status_umkm}</Badge>
            <p className="text-gray-500 text-sm italic">"{business.deskripsi_usaha}"</p>
          </Card>

          <Card title="Kontak & Lokasi">
            <div className="space-y-4 text-sm">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <span className="text-gray-600">{business.alamat}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600 font-medium">{business.kontak_usaha}</span>
              </div>
              {business.media_sosial && (
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-primary-600">{business.media_sosial}</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600">Berdiri sejak <strong className="text-gray-900">{business.tahun_berdiri}</strong></span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card 
            title="Transaksi Terbaru" 
            footer={
              <Link to={`/transactions?usaha_id=${id}`} className="text-sm font-bold text-primary-600 hover:underline flex items-center">
                Lihat semua transaksi <History className="ml-2 h-4 w-4" />
              </Link>
            }
          >
            <Table 
              columns={transactionColumns} 
              data={recentTransactions} 
              loading={false}
              emptyMessage="Belum ada transaksi di bisnis ini."
            />
          </Card>

          <Card 
            title="Blog Bisnis"
            footer={
              <Link to={`/blogs?usaha_id=${id}`} className="text-sm font-bold text-primary-600 hover:underline flex items-center">
                Kelola blog bisnis <FileText className="ml-2 h-4 w-4" />
              </Link>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentBlogs.map((blog) => (
                <Link key={blog.id} to={`/blogs/${blog.id}`} className="flex items-center p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden mr-3">
                    {blog.gambar_blog && <img src={`${import.meta.env.VITE_BASE_URL}/api/uploads/blogs/${blog.gambar_blog}`} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h5 className="text-sm font-bold text-gray-900 truncate">{blog.judul_blog}</h5>
                    <p className="text-xs text-gray-400">{new Date(blog.created_at).toLocaleDateString()}</p>
                  </div>
                </Link>
              ))}
              {recentBlogs.length === 0 && <p className="text-sm text-gray-500 italic col-span-2">Belum ada blog.</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailPage;
