import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Briefcase,
  ArrowRight,
  Plus
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useBusiness } from '../contexts/BusinessContext';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Table from '../components/Table';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';
import ChartContainer from '../components/ChartContainer';

const calculateHealthScore = (income, expense, balance) => {
  if (income === 0 && expense === 0) {
    return {
      score: 75,
      status: 'Sehat',
      colorClass: 'text-[#1a5c38]',
      bgClass: 'bg-[#1a5c38]/5 border-[#1a5c38]/20',
      circleClass: 'bg-[#1a5c38]',
      narrative: 'Belum ada transaksi tercatat bulan ini. Catat transaksi baru untuk mulai menganalisis kesehatan keuangan usahamu.'
    };
  }

  if (income === 0 && expense > 0) {
    return {
      score: 25,
      status: 'Risiko Tinggi',
      colorClass: 'text-[#dc2626]',
      bgClass: 'bg-[#dc2626]/5 border-[#dc2626]/20',
      circleClass: 'bg-[#dc2626]',
      narrative: 'Usahamu mencatatkan pengeluaran tanpa adanya pemasukan. Segera tinjau operasional dan upayakan penjualan untuk mencegah kerugian lebih lanjut.'
    };
  }

  // Calculate Net Profit Margin (NPM)
  const npm = (balance / income) * 100;
  let score = 75;
  let status = 'Sehat';
  let colorClass = 'text-[#1a5c38]';
  let bgClass = 'bg-[#1a5c38]/5 border-[#1a5c38]/20';
  let circleClass = 'bg-[#1a5c38]';
  let narrative = '';

  if (npm >= 40) {
    // Sangat Sehat (90 - 100)
    score = Math.round(90 + Math.min(10, ((npm - 40) / 60) * 10));
    status = 'Sangat Sehat';
    colorClass = 'text-[#1a5c38]';
    bgClass = 'bg-[#1a5c38]/5 border-[#1a5c38]/20';
    circleClass = 'bg-[#1a5c38]';
    narrative = 'Luar biasa! Keuangan usahamu sangat sehat dengan profitabilitas tinggi. Usahamu memiliki fondasi yang kuat untuk melakukan ekspansi atau investasi baru.';
  } else if (npm >= 15) {
    // Sehat (75 - 89)
    score = Math.round(75 + ((npm - 15) / 25) * 14);
    status = 'Sehat';
    colorClass = 'text-[#1a5c38]';
    bgClass = 'bg-[#1a5c38]/5 border-[#1a5c38]/20';
    circleClass = 'bg-[#1a5c38]';
    narrative = 'Keuangan usahamu berada dalam kondisi baik dan memiliki ruang untuk berkembang. Pertahankan pengelolaan biaya yang efisien saat ini.';
  } else if (npm >= 0) {
    // Cukup Sehat (60 - 74)
    score = Math.round(60 + (npm / 15) * 14);
    status = 'Cukup Sehat';
    colorClass = 'text-[#d4a830]';
    bgClass = 'bg-[#d4a830]/5 border-[#d4a830]/20';
    circleClass = 'bg-[#d4a830]';
    narrative = 'Arus kas usahamu stabil, namun margin keuntungan tergolong tipis. Pertimbangkan untuk meningkatkan omzet penjualan atau menekan pengeluaran kecil yang kurang produktif.';
  } else if (npm >= -50) {
    // Perlu Perhatian (40 - 59)
    score = Math.round(40 + ((npm + 50) / 50) * 19);
    status = 'Perlu Perhatian';
    colorClass = 'text-orange-600';
    bgClass = 'bg-orange-50 border-orange-200';
    circleClass = 'bg-orange-600';
    narrative = 'Pengeluaran mulai mendekati pemasukan. Evaluasi biaya operasional usahamu segera untuk menjaga arus kas tetap aman.';
  } else {
    // Risiko Tinggi (0 - 39)
    score = Math.round(Math.max(10, 40 - (Math.abs(npm) - 50) * 0.4));
    status = 'Risiko Tinggi';
    colorClass = 'text-[#dc2626]';
    bgClass = 'bg-[#dc2626]/5 border-[#dc2626]/20';
    circleClass = 'bg-[#dc2626]';
    narrative = 'Pengeluaran usahamu melebihi pemasukan bulan ini secara signifikan. Segera lakukan evaluasi pengeluaran, batasi beban non-operasional, dan cari cara meningkatkan pendapatan.';
  }

  return { score, status, colorClass, bgClass, circleClass, narrative };
};

const DashboardPage = () => {
  const { activeBusiness } = useBusiness();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const url = activeBusiness ? `/dashboard/user?usaha_id=${activeBusiness.id}` : '/dashboard/user';
        const response = await api.get(url);
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [activeBusiness]);

  if (loading) return <LoadingSpinner className="h-[calc(100vh-200px)]" />;
  if (!stats) return <div className="text-center py-10 text-neutral-500 font-display">Gagal memuat data dashboard</div>;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'pagi';
    if (hour < 15) return 'siang';
    if (hour < 18) return 'sore';
    return 'malam';
  };

  const getTodayDateString = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const transactionColumns = [
    { header: 'Tanggal', key: 'tanggal', render: (val) => new Date(val).toLocaleDateString('id-ID') },
    { header: 'Kategori', key: 'kategori' },
    { 
      header: 'Jenis', 
      key: 'jenis_transaksi', 
      render: (val) => (
        <Badge variant={val === 'Pemasukan' ? 'green' : 'red'}>{val}</Badge>
      ) 
    },
    { 
      header: 'Nominal', 
      key: 'nominal', 
      render: (val) => <span className="font-semibold text-neutral-800">{formatCurrency(val)}</span> 
    }
  ];

  const income = stats.total_pemasukan || 0;
  const expense = stats.total_pengeluaran || 0;
  const balance = stats.saldo || 0;
  const hasPositiveSaldo = balance >= 0;

  const healthData = calculateHealthScore(income, expense, balance);
  const healthScore = healthData.score;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* 1. Hero Greeting Section */}
      <div className="bg-senja-gradient rounded-card p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative circles and ambient glows for depth */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full hero-glow-1 blur-2xl pointer-events-none"></div>
        <div className="absolute left-1/3 -bottom-20 w-96 h-96 rounded-full hero-glow-2 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold bg-white/10 text-[#d4a830] border border-white/10 backdrop-blur-md shadow-sm">
              Pendamping Bisnis Anda
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-white leading-tight drop-shadow-sm">
              Selamat {getGreeting()}, {user?.nama || 'Rekan Bisnis'} !
            </h1>
            <p className="text-sm md:text-base text-white/90 font-body leading-relaxed max-w-xl">
              Pantau kondisi keuangan dan kelola usahamu dengan mudah. Saat ini Anda melihat ringkasan untuk usaha <span className="font-bold text-[#d4a830] underline decoration-[#d4a830] decoration-2 underline-offset-2">{activeBusiness ? activeBusiness.nama_usaha : 'Semua Usaha'}</span>.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="text-xs text-white/80 font-body">
                Hari ini: <span className="text-white font-semibold">{getTodayDateString()}</span>
              </div>
              <span className="h-3 w-px bg-white/20 hidden sm:block"></span>
              <div className="text-xs text-white/80 font-body">
                Status Bisnis: <span className="text-[#d4a830] font-bold">{activeBusiness ? 'Aktif' : 'Semua Terpantau'}</span>
              </div>
            </div>
            <div className="pt-2">
              <Link to="/transactions/add">
                <button className="bg-[#d4a830] text-[#0f3d2b] px-6 py-3.5 rounded-btn text-xs font-extrabold font-display hover:bg-white hover:text-[#1a5c38] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 shadow-md">
                  <Plus className="h-4.5 w-4.5 stroke-[3]" /> Catat Transaksi Baru
                </button>
              </Link>
            </div>
          </div>

          {/* Right side: Beautiful glassmorphic statistics widget representation (focal point decoration) */}
          <div className="hidden lg:block w-72 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-2xl relative overflow-hidden group">
            {/* Glowing background inside the card */}
            <div className="absolute -right-10 -bottom-10 w-28 h-28 rounded-full bg-[#d4a830]/25 blur-xl group-hover:bg-[#d4a830]/35 transition-colors duration-500"></div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-white/70 font-bold font-display">Performa Usaha</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-450 animate-pulse"></span>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-black text-white font-display block tracking-tight">
                  {formatCurrency(stats.saldo)}
                </span>
                <span className="text-[11px] text-white/80 font-body block">Total Saldo Bersih Saat Ini</span>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#d4a830] to-emerald-400 rounded-full transition-all duration-500" 
                  style={{ width: `${healthScore}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-[10px] text-white font-semibold font-body">
                <span>Skor Kesehatan</span>
                <span className="text-white font-bold">{healthScore}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stats Grid 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Stat Card 1: Pemasukan */}
        <Card className="hover:shadow-lg transition-all duration-200 border border-neutral-200">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#1a5c38]/10 text-[#1a5c38] rounded-xl">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] font-display">Total Pemasukan</h4>
                  <span className="text-xs font-medium text-neutral-500 font-body">Uang masuk bulan ini</span>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1a5c38]/10 text-[#1a5c38] font-display">
                Pemasukan Bertumbuh
              </span>
            </div>
            <div className="mt-5">
              <span className="text-3xl font-extrabold font-display text-[#1c1c18] block tracking-tight">
                {formatCurrency(stats.total_pemasukan)}
              </span>
              <p className="text-[11px] font-semibold text-[#1a5c38] font-body flex items-center gap-1 mt-1.5">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Pendapatan bertambah dari penjualan</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Stat Card 2: Pengeluaran */}
        <Card className="hover:shadow-lg transition-all duration-200 border border-neutral-200">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#dc2626]/5 text-[#dc2626] rounded-xl">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] font-display">Total Pengeluaran</h4>
                  <span className="text-xs font-medium text-neutral-500 font-body">Uang keluar bulan ini</span>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fdecea] text-[#dc2626] font-display">
                Pengeluaran Tinggi
              </span>
            </div>
            <div className="mt-5">
              <span className="text-3xl font-extrabold font-display text-[#1c1c18] block tracking-tight">
                {formatCurrency(stats.total_pengeluaran)}
              </span>
              <p className="text-[11px] font-semibold text-[#dc2626] font-body flex items-center gap-1 mt-1.5">
                <TrendingDown className="h-3.5 w-3.5" />
                <span>Beban operasional & belanja stok</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Stat Card 3: Saldo Bersih */}
        <Card className="hover:shadow-lg transition-all duration-200 border border-neutral-200">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${hasPositiveSaldo ? 'bg-[#1a5c38]/10 text-[#1a5c38]' : 'bg-[#dc2626]/5 text-[#dc2626]'}`}>
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] font-display">Saldo Bersih</h4>
                  <span className="text-xs font-medium text-neutral-500 font-body">Sisa uang kas usaha</span>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-display ${hasPositiveSaldo ? 'bg-[#1a5c38]/10 text-[#1a5c38]' : 'bg-[#fdecea] text-[#dc2626]'}`}>
                {hasPositiveSaldo ? "Pemasukan Bertumbuh" : "Perlu Perhatian"}
              </span>
            </div>
            <div className="mt-5">
              <span className="text-3xl font-extrabold font-display text-[#1c1c18] block tracking-tight">
                {formatCurrency(stats.saldo)}
              </span>
              <p className={`text-[11px] font-semibold font-body flex items-center gap-1 mt-1.5 ${hasPositiveSaldo ? 'text-[#1a5c38]' : 'text-[#dc2626]'}`}>
                {hasPositiveSaldo ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                <span>{hasPositiveSaldo ? "Aliran kas bisnis dalam kondisi sehat" : "Uang keluar lebih besar dari pemasukan"}</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Stat Card 4: Jumlah Usaha */}
        <Card className="hover:shadow-lg transition-all duration-200 border border-neutral-200">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#d4a830]/10 text-[#8b6820] rounded-xl">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] font-display">Jumlah Usaha</h4>
                  <span className="text-xs font-medium text-neutral-500 font-body">Unit usaha dikelola</span>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#d4a830]/10 text-[#8b6820] font-display">
                Usaha Aktif
              </span>
            </div>
            <div className="mt-5">
              <span className="text-3xl font-extrabold font-display text-[#1c1c18] block tracking-tight">
                {stats.total_usaha || 0} Usaha
              </span>
              <p className="text-[11px] font-semibold text-[#6b8a78] font-body flex items-center gap-1 mt-1.5">
                <span>Semua usaha terpantau dengan baik</span>
              </p>
            </div>
          </div>
        </Card>

      </div>

      {/* 3. Health Card */}
      <div className={`border rounded-card flex items-center gap-4 p-5 ${healthData.bgClass}`}>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg font-display flex-shrink-0 text-white ${healthData.circleClass}`}>
          {healthScore}
        </div>
        <div className="space-y-0.5">
          <h4 className={`font-bold font-display text-sm md:text-base ${healthData.colorClass}`}>
            Kondisi Keuangan {healthData.emoji} {healthData.status}
          </h4>
          <p className="text-xs md:text-sm font-body leading-relaxed text-[#6b8a78]">
            {healthData.narrative}
          </p>
        </div>
      </div>

      {/* Secondary Dashboard Content: Performance and Recent Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Financial Chart */}
        <div className="lg:col-span-2">
          <Card title="Grafik Arus Kas" subtitle="Performa 6 bulan terakhir" className="h-full">
            <div className="mt-4">
              <ChartContainer>
                <LineChart data={stats.chart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e5dd" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#767268'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#767268'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: '1px solid #e8e5dd', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}
                  />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                  <Line type="monotone" dataKey="income" name="Pemasukan" stroke="#1a5c38" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="expense" name="Pengeluaran" stroke="#dc2626" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ChartContainer>
            </div>
          </Card>
        </div>

        {/* Latest Articles */}
        <div className="lg:col-span-1">
          <Card 
            title="Artikel Edukasi UMKM" 
            footer={
              <Link to="/dashboard/articles" className="text-sm font-bold text-[#d4a830] hover:text-[#8b6820] flex items-center gap-1 font-display">
                Buka Pusat Belajar <ArrowRight className="h-4 w-4" />
              </Link>
            }
            className="h-full"
          >
            <div className="space-y-4 mt-2">
              {stats.latest_articles && stats.latest_articles.map((article) => (
                <Link key={article.id} to={`/dashboard/articles/${article.id}`} className="flex group">
                  <img 
                    src={`${import.meta.env.VITE_BASE_URL}/api/uploads/articles/${article.thumbnail_artikel}`} 
                    className="w-14 h-14 rounded-xl object-cover mr-4 flex-shrink-0 border border-neutral-200 group-hover:scale-105 transition-transform duration-300"
                    alt=""
                  />
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-neutral-800 line-clamp-2 group-hover:text-[#1a5c38] transition-colors font-display">
                      {article.judul_artikel}
                    </h5>
                    <span className="text-[9px] font-extrabold text-[#d4a830] uppercase tracking-widest font-sans">{article.kategori_artikel}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Transactions */}
      <Card title="Riwayat Transaksi Terakhir">
        <Table 
          columns={transactionColumns} 
          data={stats.recent_transactions || []} 
          loading={false}
          emptyMessage="Belum ada transaksi tercatat."
        />
      </Card>
    </div>
  );
};

export default DashboardPage;
