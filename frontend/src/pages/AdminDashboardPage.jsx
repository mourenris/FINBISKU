import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Briefcase, FileText } from 'lucide-react';
import { 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart,
  Area
} from 'recharts';
import api from '../services/api';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import ChartContainer from '../components/ChartContainer';
import Badge from '../components/Badge';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [growthFilter, setGrowthFilter] = useState('monthly');

  const fetchAdminStats = async (filter = 'monthly') => {
    try {
      const response = await api.get(`/dashboard/admin?filter=${filter}`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch admin stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats(growthFilter);
  }, [growthFilter]);

  if (loading && !stats) return <LoadingSpinner className="h-[calc(100vh-200px)]" />;
  if (!stats) return <div className="text-center py-10 text-neutral-500 font-display">Gagal memuat data statistik admin</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* Admin Hero Section */}
      <div className="bg-senja-gradient rounded-card p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative circles and ambient glows for depth */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full hero-glow-1 blur-2xl pointer-events-none"></div>
        <div className="absolute left-1/3 -bottom-20 w-96 h-96 rounded-full hero-glow-2 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 text-[#d4a830] border border-white/10 backdrop-blur-md shadow-sm">
              Panel Sistem Administrator
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight text-white leading-tight drop-shadow-sm">
              Selamat Datang kembali, {user?.nama || 'Admin'} !
            </h1>
            <p className="text-sm text-white/90 font-body max-w-xl leading-relaxed">
              Kelola ekosistem FINBISKU, pantau statistik sistem, pendaftaran pengguna baru, dan artikel pembelajaran UMKM secara efisien.
            </p>
          </div>
          <div className="flex-shrink-0 flex bg-white/15 p-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-md">
            {['weekly', 'monthly', 'yearly'].map((f) => (
              <button
                key={f}
                onClick={() => setGrowthFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold font-display transition-all duration-150 ${growthFilter === f ? 'bg-[#d4a830] text-[#0f3d2b] shadow-md' : 'text-white hover:bg-white/10 hover:text-white'}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards Grid (Aligned with User stats style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* Total User */}
        <Card className="hover:shadow-lg transition-all duration-200 border border-neutral-200">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-650 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] font-display">Total User</h4>
                <span className="text-xs font-medium text-neutral-500 font-body">Pengguna terdaftar</span>
              </div>
            </div>
            <div className="mt-5">
              <span className="text-3xl font-extrabold font-display text-[#1c1c18] block tracking-tight">
                {stats.total_users}
              </span>
            </div>
          </div>
        </Card>

        {/* User Aktif */}
        <Card className="hover:shadow-lg transition-all duration-200 border border-neutral-200">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#1a5c38]/10 text-[#1a5c38] rounded-xl">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] font-display">User Aktif</h4>
                <span className="text-xs font-medium text-neutral-500 font-body">Status aktif sistem</span>
              </div>
            </div>
            <div className="mt-5">
              <span className="text-3xl font-extrabold font-display text-[#1c1c18] block tracking-tight">
                {stats.active_users}
              </span>
            </div>
          </div>
        </Card>

        {/* User Inaktif */}
        <Card className="hover:shadow-lg transition-all duration-200 border border-neutral-200">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-55 bg-red-50/50 text-[#dc2626] rounded-xl border border-red-100">
                <UserX className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] font-display">User Inaktif</h4>
                <span className="text-xs font-medium text-neutral-500 font-body">Status nonaktif</span>
              </div>
            </div>
            <div className="mt-5">
              <span className="text-3xl font-extrabold font-display text-[#1c1c18] block tracking-tight">
                {stats.inactive_users}
              </span>
            </div>
          </div>
        </Card>

        {/* Total Bisnis */}
        <Card className="hover:shadow-lg transition-all duration-200 border border-neutral-200">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#d4a830]/10 text-[#8b6820] rounded-xl">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] font-display">Total Bisnis</h4>
                <span className="text-xs font-medium text-neutral-500 font-body">Profil UMKM aktif</span>
              </div>
            </div>
            <div className="mt-5">
              <span className="text-3xl font-extrabold font-display text-[#1c1c18] block tracking-tight">
                {stats.total_businesses}
              </span>
            </div>
          </div>
        </Card>

        {/* Total Artikel */}
        <Card className="hover:shadow-lg transition-all duration-200 border border-neutral-200">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] font-display">Total Artikel</h4>
                <span className="text-xs font-medium text-neutral-500 font-body">Edukasi diterbitkan</span>
              </div>
            </div>
            <div className="mt-5">
              <span className="text-3xl font-extrabold font-display text-[#1c1c18] block tracking-tight">
                {stats.total_articles}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Section */}
          <Card title="Pertumbuhan Pengguna Baru" subtitle={`Data ${growthFilter} terakhir`}>
            <div className="mt-4">
              <ChartContainer height={320}>
                <AreaChart data={stats.user_growth_chart}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a5c38" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#1a5c38" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e5dd" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#767268'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#767268'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: '1px solid #e8e5dd', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}
                  />
                  <Area type="monotone" dataKey="count" name="User Baru" stroke="#1a5c38" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ChartContainer>
            </div>
          </Card>

          {/* Recent Registrations Table */}
          <Card title="Pendaftaran Terbaru" subtitle="5 pengguna terakhir yang bergabung">
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="pb-3 text-xs font-bold text-[#6b8a78] uppercase tracking-wider font-display">User</th>
                    <th className="pb-3 text-xs font-bold text-[#6b8a78] uppercase tracking-wider font-display">Status</th>
                    <th className="pb-3 text-xs font-bold text-[#6b8a78] uppercase tracking-wider font-display">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {stats.recent_registrations.map((u) => (
                    <tr key={u.id} className="group">
                      <td className="py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[#1a5c38] font-bold text-xs uppercase">
                            {u.nama.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-neutral-800 group-hover:text-[#1a5c38] transition-colors font-display">{u.nama}</p>
                            <p className="text-xs text-neutral-450 font-body">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant={u.status === 'active' ? 'success' : 'warning'}>{u.status}</Badge>
                      </td>
                      <td className="py-3 text-xs font-semibold text-neutral-500 font-body">
                        {new Date(u.created_at).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Recent Activity */}
          <Card title="Aktivitas Terbaru" subtitle="Aktivitas UMKM dan blog terbaru">
            <div className="space-y-4 mt-4">
              {stats.recent_businesses.map((b) => (
                <div key={`biz-${b.id}`} className="flex items-start space-x-3 border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                  <div className="w-9 h-9 rounded-xl bg-[#1a5c38]/10 text-[#1a5c38] flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-neutral-800 font-display">Bisnis Baru: <span className="text-[#1a5c38]">{b.nama_usaha}</span></p>
                    <p className="text-[10px] text-neutral-450 font-body">Oleh {b.owner_name} • {new Date(b.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
              ))}
              {stats.recent_blogs.map((blog) => (
                <div key={`blog-${blog.id}`} className="flex items-start space-x-3 border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-neutral-800 font-display">Blog Baru: <span className="text-blue-700">{blog.judul_blog}</span></p>
                    <p className="text-[10px] text-neutral-450 font-body">Oleh {blog.nama_usaha} • {new Date(blog.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
