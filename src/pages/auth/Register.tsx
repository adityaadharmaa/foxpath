import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authService } from "@/services/authService"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import * as z from "zod"

const registerSchema = z.object({
    username: z.string().min(3, "Username minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation,{
    message: "Konfirmasi password tidak cocok",
    path: ["password_confirmation"]
})

type RegisterFormValues = z.infer<typeof registerSchema >

export default function Register() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema)
    })

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true)
        try {
            await authService.register(data)

            toast.success("Register berhasil! Silakan verifikasi akun anda terlebih dahulu.")
            navigate("/login")
        } catch (error: any) {
            const msg = error.response?.data?.message || "Gagal mendaftar."
            if(error.response?.data?.errors) {
                Object.values(error.response.data.errors).flat().forEach((err: any) => {
                    toast.error(msg)
                }) 
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="mb-8">
                <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center shadow-inner">
                    <span className="text-gray-500 font-bold text-xl">FP</span>
                </div>
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-8 md-:p-10 shadow-sm border border-gray-100 h-fit order-2 md:order-1 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Sudah Punya Akun?</h2>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        Jika anda sebelumnya sudah mendaftar di FoxPath, silakan untuk melanjutkan proses seleksi magang dan melihat status lamaran anda.
                    </p>

                    <button 
                        type="button"
                        onClick={() => navigate('/login')}
                        className="w.full h-11 border-2 corder-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300"
                    >
                        Masuk ke Akun Saya
                    </button>
                </div>

                <div className="bg-white rounded-3xl p-9 md:p-10 shadow-sm border border-gray-100 order-1 md:order-2">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Buat Akun Baru</h1>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        Daftarkan diri Anda untuk mulai melamar magang.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y">
                            <Label htmlFor="username" className="text-gray-600 font-normal">Username</Label>
                            <Input
                                id="username"
                                placeholder="Username"
                                {...register("username")}
                                error={errors.username?.message}
                                className="bg-gray-50 border-gray-200 rounded-lg focus:bg-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-gray-600 font-normal">Email</Label>
                            <Input 
                                id="email"
                                type="email"
                                placeholder="admin@foxpath.com"
                                {...register("email")}
                                className="bg-gray-50 border-gray-200 rounded-lg focus:bg-white" 
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y relative">
                                <Label htmlFor="password" className="text-gray-600 font-normal">Password</Label>
                                <div className="relative">
                                    <Input 
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min 8 karakter"
                                        {...register("password")}
                                        error={errors.password?.message}
                                        className="bg-gray-50 border-gray-200 rounded-lg focus:bg-white" />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-2 5 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16}/>}
                                        </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="password_confirmation" className="text-gray-600 font-normal">Ulangi Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Konfirmasi password"
                                    {...register("password_confirmation")}
                                    error={errors.password_confirmation?.message}
                                    className="bg-gray-50 border-gray-200 rounded-lg focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                        <Button 
                            type="submit" 
                            isLoading={isLoading}
                            className="w-full rounded-full bg-gray-900 hover:bg-gray-800 text-white font-semibold h-11 shadow-lg shadow-gray-200"
                        >
                            Daftar Sekarang
                        </Button>
                        </div>

                        <p className="text-xs text-center text-gray-400 mt-4">
                            Nama lengkap dan biodata lainnya dapat dilengkapi di halaman Profil setelah login.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}