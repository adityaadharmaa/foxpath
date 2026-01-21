import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Camera, Save, User, Phone, MapPin, BookOpen, School, Building2, Calendar, Mail, Award, Briefcase } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { profileService } from "@/services/profileService";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"general" | "education">("general");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [applicantType, setApplicantType] = useState<"siswa" | "mahasiswa">("mahasiswa");
    const [joinedAt, setJoinedAt] = useState<string | null>(null);
    
    const user = authService.getUser();
    const isAdmin = user?.role === 'admin'; // Logic admin tetap ada tapi hidden jika user biasa

    const { register, handleSubmit, setValue, watch } = useForm();
    const watchedType = watch("applicant_type");

    useEffect(() => {
        if (watchedType) setApplicantType(watchedType);
    }, [watchedType]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await profileService.getFullProfile();
                const data = response.data;
                setValue("full_name", data.full_name);
                setValue("phone", data.phone);
                setValue("address", data.address);
                setValue("bio", data.bio);
                setValue("date_of_birth", data.date_of_birth);
                setValue("applicant_type", data.applicant_type || "mahasiswa");
                if(data.created_at) setJoinedAt(data.created_at);
                if (data.profile_picture_url) setPreviewImage(data.profile_picture_url);
                if (data.education) {
                    setValue("institution_name", data.education.institution_name);
                    setValue("major", data.education.major);
                    setValue("gpa", data.education.gpa);
                    setValue("average_score", data.education.average_score);
                    setValue("nim", data.education.nim);
                    setValue("nisn", data.education.nisn);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsFetching(false);
            }
        };
        loadData();
    }, [setValue]);

    const onSubmit = async (formData: any) => {
        setIsLoading(true);
        try {
            await profileService.updateGeneral({ ...formData, profile_picture: formData.profile_picture });
            if (!isAdmin) {
                await profileService.updateEducation({
                    level: formData.applicant_type,
                    institution_name: formData.institution_name,
                    major: formData.major,
                    nim: formData.applicant_type === 'mahasiswa' ? formData.nim : null,
                    gpa: formData.applicant_type === 'mahasiswa' ? formData.gpa : null,
                    nisn: formData.applicant_type === 'siswa' ? formData.nisn : null,
                    average_score: formData.applicant_type === 'siswa' ? formData.average_score : null,
                });
            }
            toast.success("Profile berhasil disimpan!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal menyimpan.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setValue("profile_picture", file);
        }
    };

    if (isFetching) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>;

    return (
        <div className="pb-10">
            {/* --- HEADER BANNER --- */}
            <div className="relative mb-20">
                {/* Gradient Banner */}
                <div className="h-48 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-lg relative overflow-hidden">
                    {/* Hiasan Circle (Optional) */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
                </div>

                {/* Profile Card Overlay */}
                <div className="absolute -bottom-16 left-6 md:left-10 flex items-end gap-6">
                    <div className="relative group">
                        <div className="h-36 w-36 rounded-full border-4 border-white dark:border-slate-900 bg-white shadow-xl overflow-hidden">
                            {previewImage ? (
                                <img src={previewImage} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">
                                    <User size={64} />
                                </div>
                            )}
                        </div>
                        <label htmlFor="upload-photo" className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                            <Camera size={18} />
                        </label>
                        <input id="upload-photo" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </div>
                    
                    <div className="mb-2 hidden sm:block">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white drop-shadow-sm">{user?.name}</h1>
                        <p className="text-slate-500 font-medium flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                                {user?.role}
                            </span>
                            <span className="text-sm">{user?.email}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Nama di Mobile (Kalo layar kecil, nama turun kebawah) */}
            <div className="sm:hidden px-2 mb-6 text-center">
                 <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h1>
                 <p className="text-slate-500 text-sm">{user?.email}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                
                {/* --- SIDEBAR KIRI: STATUS & INFO SINGKAT --- */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Award className="text-blue-600" size={20}/> Status Akun
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Username</p>
                                <p className="font-medium text-slate-900 dark:text-white">@{user?.username}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Terdaftar Sejak</p>
                                <p className="font-medium text-slate-900 dark:text-white">
                                    {joinedAt ? new Date(joinedAt).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : '-'}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <div>
                                        <p className="text-xs text-green-600 font-bold uppercase">Status</p>
                                        <p className="font-medium text-green-700 text-sm">Akun Aktif</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- KANAN: FORM CONTENT --- */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* MODERN TABS */}
                    <div className="flex p-1 gap-1 bg-slate-100/80 dark:bg-slate-800/50 rounded-xl w-fit backdrop-blur-sm">
                        <button
                            type="button"
                            onClick={() => setActiveTab("general")}
                            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                activeTab === "general"
                                    ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                            }`}
                        >
                            <User size={16} /> Data Pribadi
                        </button>
                        {!isAdmin && (
                            <button
                                type="button"
                                onClick={() => setActiveTab("education")}
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                    activeTab === "education"
                                        ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                                }`}
                            >
                                <School size={16} /> Pendidikan
                            </button>
                        )}
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                        
                        {/* TAB 1: GENERAL */}
                        {activeTab === "general" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2 md:col-span-1 space-y-2">
                                        <Label>Nama Lengkap</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input {...register("full_name")} placeholder="Nama Lengkap" />
                                        </div>
                                    </div>
                                    <div className="col-span-2 md:col-span-1 space-y-2">
                                        <Label>No. WhatsApp</Label>
                                        <div className="relative">
                                            <Input {...register("phone")} placeholder="08..." startIcon={<Phone size={18} />} />
                                        </div>
                                    </div>
                                    {!isAdmin && (
                                        <>
                                            <div className="col-span-2 md:col-span-1 space-y-2">
                                                <Label>Tanggal Lahir</Label>
                                                <Input 
                                                    type="date"
                                                    {...register("date_of_birth")}
                                                    
                                                    // 1. Masukkan Icon Calendar disini
                                                    startIcon={<Calendar size={18}  />} 
                                                    
                                                    // 2. Trik CSS agar terlihat bersih & bisa diklik seluruhnya
                                                    className="
                                                        cursor-pointer
                                                        [&::-webkit-calendar-picker-indicator]:opacity-0  // Sembunyikan ikon native (Chrome/Edge)
                                                        [&::-webkit-calendar-picker-indicator]:absolute 
                                                        [&::-webkit-calendar-picker-indicator]:w-full 
                                                        [&::-webkit-calendar-picker-indicator]:h-full 
                                                        [&::-webkit-calendar-picker-indicator]:left-0
                                                        [&::-webkit-calendar-picker-indicator]:top-0
                                                        [&::-webkit-calendar-picker-indicator]:cursor-pointer
                                                    "
                                                    
                                                    // 3. UX Tambahan: Membatasi agar tidak bisa pilih tanggal masa depan
                                                    max={new Date().toISOString().split("T")[0]} 
                                                    
                                                    // 4. (Opsional) Trigger picker saat diklik di area manapun (untuk support browser lama)
                                                    onClick={(e) => {
                                                        try {
                                                            // @ts-ignore
                                                            e.currentTarget.showPicker(); 
                                                        } catch (err) {
                                                            // Fallback untuk browser lama
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <Label>Alamat Domisili</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <textarea 
                                                        {...register("address")} 
                                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-3 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors min-h-[80px]"
                                                        placeholder="Alamat lengkap..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <Label>Bio Singkat</Label>
                                                <textarea 
                                                    {...register("bio")} 
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors min-h-[100px]"
                                                    placeholder="Deskripsikan diri Anda, minat, dan keahlian..."
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB 2: EDUCATION */}
                        {activeTab === "education" && !isAdmin && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm mb-6 flex items-start gap-3">
                                    <BookOpen className="shrink-0 mt-0.5" size={18} />
                                    <p>Pastikan data pendidikan yang Anda masukkan valid karena akan digunakan untuk proses seleksi magang.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Jenjang Pendidikan</Label>
                                    <select 
                                        {...register("applicant_type")}
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:ring-2 focus:ring-blue-500/20 transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="mahasiswa">Mahasiswa (Universitas/Politeknik)</option>
                                        <option value="siswa">Siswa (SMA/SMK)</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    {applicantType === 'mahasiswa' ? (
                                        <>
                                            <div className="col-span-2 space-y-2">
                                                <Label>Nama Universitas / Politeknik</Label>
                                                <div className="relative">
                                                    <Input {...register("institution_name")} placeholder="Nama Kampus" startIcon={<Building2 size={18} />} />
                                                </div>
                                            </div>
                                            <div className="col-span-1 space-y-2">
                                                <Label>NIM</Label>
                                                <Input {...register("nim")} placeholder="Nomor Induk" />
                                            </div>
                                            <div className="col-span-1 space-y-2">
                                                <Label>IPK Terakhir</Label>
                                                <Input {...register("gpa")} type="number" step="0.01" placeholder="3.50" />
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <Label>Jurusan / Program Studi</Label>
                                                <Input {...register("major")}  placeholder="Teknik Informatika" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="col-span-2 space-y-2">
                                                <Label>Nama Sekolah</Label>
                                                <div className="relative">
                                                    <Input {...register("institution_name")} placeholder="SMA / SMK..." startIcon={<School size={18} />} />
                                                </div>
                                            </div>
                                            <div className="col-span-1 space-y-2">
                                                <Label>NISN</Label>
                                                <Input {...register("nisn")} placeholder="Nomor Induk Siswa" />
                                            </div>
                                            <div className="col-span-1 space-y-2">
                                                <Label>Rata-rata Nilai</Label>
                                                <Input {...register("average_score")} type="number" step="0.01" placeholder="85.5" />
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <Label>Jurusan / Keahlian</Label>
                                                <Input {...register("major")} placeholder="RPL / TKJ" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <Button type="submit" isLoading={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-11 font-medium shadow-lg shadow-blue-500/20">
                                <Save size={18} className="mr-2" /> Simpan Perubahan
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}