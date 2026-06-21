import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Shield, MapPin, Briefcase } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';

const UserDetailPage = () => {
  const { id } = useParams();
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await api.get(`/admin/users/${id}`);
        if (response.data.success) {
          setUserDetail(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user detail');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetail();
  }, [id]);

  if (loading) return <LoadingSpinner className="h-screen" />;
  if (!userDetail) return <div className="text-center py-20 text-neutral-500 font-display">User tidak ditemukan.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-10">
      <Link to="/admin/users" className="inline-flex items-center text-sm font-bold text-neutral-500 hover:text-[#1a5c38] transition-colors font-display">
        <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Daftar User
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="text-center border border-neutral-200">
            <div className="w-24 h-24 mx-auto rounded-full bg-[#1a5c38]/10 flex items-center justify-center mb-4 border-4 border-white shadow-md">
              <User className="h-12 w-12 text-[#1a5c38]" />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 font-display">{userDetail.nama}</h3>
            <p className="text-xs text-neutral-500 mb-4 font-body">{userDetail.email}</p>
            <Badge variant={userDetail.status === 'active' ? 'success' : 'danger'}>
              {userDetail.status === 'active' ? 'Akun Aktif' : 'Akun Inaktif'}
            </Badge>
          </Card>

          <Card title="Akses & Keamanan" className="border border-neutral-200">
            <div className="space-y-4 text-sm mt-3">
              <div className="flex justify-between items-center">
                <span className="text-[#6b8a78] text-[10px] font-bold uppercase tracking-wider font-display">Role</span>
                <span className="font-bold text-[#1a5c38] uppercase text-xs tracking-wider font-display bg-[#1a5c38]/10 px-2 py-0.5 rounded-md">{userDetail.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6b8a78] text-[10px] font-bold uppercase tracking-wider font-display">User ID</span>
                <span className="font-mono text-xs text-neutral-500 font-semibold">#{userDetail.id}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card title="Detail Informasi" className="border border-neutral-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-3">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#6b8a78] uppercase tracking-wider flex items-center font-display">
                  <Mail className="h-3.5 w-3.5 mr-1 text-[#1a5c38]" /> Alamat Email
                </p>
                <p className="text-neutral-800 font-semibold text-sm font-body">{userDetail.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#6b8a78] uppercase tracking-wider flex items-center font-display">
                  <Calendar className="h-3.5 w-3.5 mr-1 text-[#1a5c38]" /> Tanggal Registrasi
                </p>
                <p className="text-neutral-800 font-semibold text-sm font-body">
                  {new Date(userDetail.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </Card>

          <div className="p-8 bg-senja-gradient rounded-card text-white relative overflow-hidden shadow-lg">
            <div className="absolute right-0 top-0 w-60 h-60 rounded-full hero-glow-1 blur-xl pointer-events-none"></div>
            <div className="relative z-10 space-y-2">
              <h4 className="text-lg font-bold font-display">Pantau Aktivitas Pengguna</h4>
              <p className="text-white/80 text-sm font-body max-w-md leading-relaxed">
                Admin memiliki wewenang penuh untuk menonaktifkan akses pengguna jika ditemukan pelanggaran terhadap kebijakan platform FINBISKU.
              </p>
            </div>
            <Shield className="absolute -right-6 -bottom-6 h-36 w-36 text-white/5 opacity-10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
