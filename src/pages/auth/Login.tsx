import { useState } from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import { redirect, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";

const loginSchema = z.object({
    login: z.string().min(1, "Email atau username wajib diisi"),
    password: z.string().min(8, "Password wajid diisi"),
    remember_me: z.boolean().optional()
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
    const navigate = useNavigate()
    const[isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { remember_me: false }
    })

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true)
        try{
            const response = await authService.login(data)

            if(response.status === "success"){
                // const msg = success.reponse?.data?.message || "Berhasil login!"
                toast.success(response.message)
                authService.setSession(response.token.access_token, response.data.user)
                redirect(response.meta.redirect_to)
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Gagal login!"

            if (error.response?.status === 403) {
                toast.warning(msg);
            } else {
                toast.error(msg);
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="mn-8">
                <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center shadow-inner">
                    <span className="text-gray-500 font-bold text-xl">FP</span>
                </div>
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Masuk ke FoxPath</h1>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Silahkan masuk untuk mengakses portal pendaftaran magang dan memantau hasil seleksi metode SAW.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y">
                            <Label htmlFor="login" className="text-gray-600 font-normal">Email atau Username</Label>
                            <Input 
                                id="login"
                                placeholder="user / user@gmail.com"
                                {...register("login")}
                                error={errors.login?.message}
                                className="bg-gray-50 border-gray-200 h-11 rounded-lg focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-1 relative">
                            <div className="flex justify-between items-center mb-1">
                                <Label htmlFor="password" className="text-gray-600 font-normal">Password</Label>
                                <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 font-medium transition-colors"
                            >
                                {showPassword ? <EyeOff size={14}/> : <Eye size={14} />}
                                {showPassword ? "Sembunyikan" : "Tampilkan"}
                            </button>
                            </div>

                            <Input 
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("password")}
                                error={errors.password?.message}
                                className="bg-gray-50 border-gray-200 h-11 rounded-lg focus:bg-white transition-colors"
                            />
                        </div>
                        <div className="flex-flex-col sm:flex-row items-center gap-4 pt-2">
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="w-full sw:auto px-8 rounded-full bg-gray-400 hover:bg-gray-500 text-white font-semibold h-11"
                            >
                                Sign In
                            </Button>

                            <a href="/forgot-password" className="text-sm font-semibold text-gray-800 hover:underline">
                                Lupa password anda?
                            </a>
                        </div>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">Atau masuk dengan</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" className="flex items-center justify-center gap-2 h-10 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                                <FacebookIcon className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium text-gray-600">Facebook</span>
                            </button>
                            <button type="button" className="flex items-center justify-center gap-2 h-10 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                                <GoogleIcon className="w-5 h-5" />
                                <span className="text-sm font-medium text-gray-600">Google</span>
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-6 leading-relaxed">
                            Belum terdaftar? Dapatkan akses eksklusif ke lowongan magang dan update status seleksi real-time.
                            <a href="/register" className="text-gray-900 font-bold hover:underline ml-1">
                                Daftar sekarang
                            </a>
                        </p>

                        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                            <div className="text-xs text-gray-400">
                                Sudah daftar tapi belum dapat email?
                                <a href="/email/resend" className="text-blue-600 font-semibold hover:underline ml-1">Kirim ulang verifikasi</a>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 h-fit">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Buat Akun Baru</h2>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    Bergabunglah dengan FoxPath untuk memulai perjalanan karir Anda. Sistem kami menggunakan metode 
                    <strong> Simple Additive Weighting (SAW)</strong> untuk memastikan proses seleksi yang transparan, adil, dan akurat berdasarkan kriteria akademik Anda.
                </p>

                <button 
                    type="button"
                    onClick={() => navigate('/register')}
                    className="w-full h-11 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300"
                >
                    Buat Akun Pendaftar
                </button>
                </div>
            </div>
        </div>
    )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.648 0-2.928 1.67-2.928 3.403v1.596h3.921l-.473 3.667h-3.448v7.925a11.96 11.96 0 0 1-5.96 0Z" />
    </svg>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}