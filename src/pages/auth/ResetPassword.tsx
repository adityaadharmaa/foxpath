import { useNavigate, useSearchParams } from "react-router-dom"

import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authService } from "@/services/authService"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

const resetSchema = z.object({
    password: z.string().min(8, "Password minimal 8 karakter"),
    password_confirmation: z.string(),
    token: z.string(),
    email: z.string().email()
}).refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi password tidak cocok",
    path: ["password_confirmation"]
})

type ResetFormValues = z.infer<typeof resetSchema>

export default function ResetPassword() {
    const navigate = useNavigate()
    const [ searchParams ] = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const token = searchParams.get("token")
    const email = searchParams.get("email")

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors}
    } = useForm<ResetFormValues>({
        resolver: zodResolver(resetSchema)
    })

    useEffect(() => {
        if (token) setValue("token", token)
        if (email) setValue("email", email)

        if(!token || !email) {
            toast.error("Link tidak valid atau kadaluarsa.")
        }
    }, [token, email, setValue])

    const onSubmit = async (data: ResetFormValues) => {
        setIsLoading(true)
        try{
            const response = await authService.resetPassword(data)
            toast.success(response.message || "Password berhasil direset! Silakan login kembali.")
            navigate("/login")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal mereset password.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm borded border-gray-100">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Buat Password Baru</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Silakan masukkan password baru untuk akun <strong>{email}</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input type="hidden" {...register("token")} />
                    <input type="hidden" {...register("email")} />

                    <div className="space-y-1 relative">
                        <Label>Password Baru</Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Minimal 8 karakter"
                                {...register("password")} 
                                error={errors.password?.message}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400"
                            >
                                {showPassword ? <EyeOff size={16}/> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label>Ulangi Password Baru</Label>
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Konfirmasi Password"
                            {...register("password_confirmation")}
                            error={errors.password_confirmation?.message}
                        />
                    </div>
 
                    <Button type="submit" className="w-full rounded-full bg-gray-900" isLoading={isLoading}>
                        Simpan Password Baru
                    </Button>
                </form>
            </div>
        </div>
    )
}