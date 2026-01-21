import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";
import { 
    ArrowRight, 
    Award, 
    BarChart3, 
    LayoutDashboard, 
    LogOut, 
    User, 
    ChevronDown,
    Users,
    CheckCircle2,
    FileText,
    MousePointerClick,
    Trophy
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Landing() {
    const navigate = useNavigate()
    const isLoggedIn = authService.isAuthenticated()
    const user = authService.getUser()

    // --- LOGIC DROPDOWN ---
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleDashboardRedirect = () => {
        setIsDropdownOpen(false) 
        if(user?.role === "admin" || user?.roles_id === 1) {
            navigate("/admin/dashboard")
        } else {
            navigate("/user/dashboard")
        }
    }

    const handleCtaClick = () => {
        if(isLoggedIn){
            handleDashboardRedirect()
        } else {
            navigate("/register")
        }
    }

    const handleLogout = () => {
        authService.logout()
        navigate("/login")
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors duration-300">
            
            {/* --- NAVBAR --- */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-colors duration-300">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                        <div className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold text-lg shadow-lg shadow-slate-200 dark:shadow-none">
                            FP
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-100">FoxPath</span>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                    <ModeToggle />
                    {isLoggedIn ? (
                        <div className="relative" ref={dropdownRef}>
                            <Button 
                                variant="ghost" 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                                className="gap-2 font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                            >
                                <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 flex items-center justify-center text-xs font-bold">
                                    {user?.username?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <span className="max-w-[100px] truncate">{user?.username}</span>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </Button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                    <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800 mb-1">
                                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.email}</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate("/profile")}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors"
                                    >
                                        <User size={16} /> Profile Saya
                                    </button>
                                    <button 
                                        onClick={handleDashboardRedirect}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors"
                                    >
                                        <LayoutDashboard size={16} /> Dashboard
                                    </button>
                                    <div className="my-1 border-t border-slate-50 dark:border-slate-800"></div>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors font-medium"
                                    >
                                        <LogOut size={16} /> Keluar
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={() => navigate("/login")} className="font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                                Masuk
                            </Button>
                            <Button onClick={() => navigate("/register")} className="bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-full px-6 shadow-md hover:shadow-lg transition-all">
                                Daftar Akun
                            </Button>
                        </>
                    )}
                    </div>
                </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="pt-40 pb-20 px-4 text-center max-w-5xl mx-auto relative overflow-hidden">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl -z-10 opacity-60"></div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold mb-8 shadow-sm">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-500"></span>
                </span>
                Pendaftaran Batch 2026 Dibuka
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8 leading-[1.1]">
                Mulai Karir Profesionalmu di <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    FoxPath Internship
                </span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
                Platform seleksi magang yang <strong>Transparan, Objektif, dan Adil</strong> menggunakan metode 
                komputasi <em>Simple Additive Weighting (SAW)</em> untuk menemukan talenta terbaik.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                    onClick={handleCtaClick} 
                    variant="default"
                    className="h-14 px-8 rounded-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-lg font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                >
                    {isLoggedIn ? "Buka Dashboard" : "Daftar Magang Sekarang"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button variant="ghost" className="h-14 px-8 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 w-full sm:w-auto">
                    Pelajari Alur Seleksi
                </Button>
                </div>
            </section>

            {/* --- FEATURES SECTION --- */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
                <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Mengapa FoxPath Berbeda?</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                    Kami menggunakan teknologi SAW untuk memastikan setiap pelamar dinilai berdasarkan data, bukan asumsi.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: BarChart3, title: "Penilaian Objektif", desc: "Setiap kriteria (IPK, Skill, Portfolio) memiliki bobot matematis yang jelas.", color: "blue" },
                        { icon: Users, title: "Transparansi Ranking", desc: "Hasil seleksi ditampilkan berdasarkan skor akhir tertinggi secara transparan.", color: "indigo" },
                        { icon: Award, title: "Sertifikasi Resmi", desc: "Peserta yang lolos akan mendapatkan pengalaman kerja riil dan sertifikat.", color: "teal" }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
                            <div className={`h-12 w-12 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-2xl flex items-center justify-center text-${item.color}-600 dark:text-${item.color}-400 mb-6`}>
                                <item.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
                </div>
            </section>

            {/* --- ALUR PENDAFTARAN (NEW CARD DESIGN) --- */}
            <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm font-semibold mb-4">
                            Proses Mudah
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Alur Pendaftaran</h2>
                        <p className="text-slate-500 dark:text-slate-400">Ikuti 4 langkah mudah untuk memulai karir impian Anda.</p>
                    </div>

                    {/* CONTAINER UTAMA TIMELINE */}
                    <div className="relative">
                        <div className="absolute left-8 top-4 bottom-4 w-[2px] bg-slate-200 dark:bg-slate-800 z-0"></div>

                        {/* --- ITEM TIMELINE (Berada di depan garis) --- */}
                        <div className="relative z-10 space-y-8">
                            {[
                                { 
                                    title: "Registrasi Akun", 
                                    desc: "Buat akun pendaftar dengan mengisi email dan password, lalu verifikasi email Anda.",
                                    icon: User
                                },
                                { 
                                    title: "Lengkapi Profil & Berkas", 
                                    desc: "Upload CV, Transkrip Nilai, dan Portofolio Project sesuai format yang ditentukan.",
                                    icon: FileText
                            },
                            { 
                                title: "Proses Seleksi (SAW)", 
                                desc: "Sistem menghitung skor otomatis berdasarkan bobot kriteria secara real-time.",
                                icon: MousePointerClick
                            },
                            { 
                                title: "Pengumuman Hasil", 
                                desc: "Cek hasil ranking final. Peserta dengan skor tertinggi akan mendapatkan Offering Letter.",
                                icon: Trophy
                            }
                        ].map((item, index) => (
                            <div key={index} className="relative pl-20">
                                
                                {/* Lingkaran Angka/Icon */}
                                {/* - ring-4 ring-white: Ini kuncinya. Ring putih tebal ini menutupi garis di belakangnya, 
                                      menciptakan ilusi garisnya "lewat belakang" lingkaran.
                                */}
                                <div className="absolute left-4 top-0 w-8 h-8 rounded-full bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-white dark:ring-slate-950">
                                    {index + 1}
                                </div>

                                {/* CARD CONTENT */}
                                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
                                    <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-sm text-slate-600 dark:text-slate-300">
                                                <item.icon size={20} />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* --- CTA BOTTOM --- */}
            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto bg-slate-900 dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-[2.5rem] p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">Siap Memulai Perjalananmu?</h2>
                    <p className="text-slate-300 mb-8 max-w-xl mx-auto relative z-10">
                        Jangan lewatkan kesempatan untuk berkembang bersama kami. Kuota terbatas untuk batch bulan ini.
                    </p>
                    <Button 
                        onClick={handleCtaClick}
                        className="h-12 px-8 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold relative z-10"
                    >
                        {isLoggedIn ? "Buka Dashboard Saya" : "Daftar Sekarang"}
                    </Button>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-10 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 text-center transition-colors duration-300">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <div className="h-6 w-6 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-xs font-bold">FP</div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">FoxPath</span>
                </div>
                <p className="text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} Foxbyte Global Inovasi. All rights reserved.
                </p>
            </footer>
        </div>
    )
}