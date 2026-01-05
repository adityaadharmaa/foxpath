import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authService } from "@/services/authService"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

const forgotPasswordSchema = z.object({
    email: z.string().email("Format email tidak valid.")
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema)
    })

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setIsLoading(true)
        try{
            const response = await authService.forgotPassword(data.email)
            toast.success(response.message || "Link reset password telah dikirim ke email anda.")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal mengirim link.")
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="mb-6 text-center">
                    <div className="h-12 w-12 rounded-full bg-gray-200 mx-auto flex items-center justify-center mb-4">
                        <span className="text-gray-500 font-bold">FP</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Lupa Password?</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Masukkan email yang terdaftar, kami akan mengirimkan link untuk mereset password Anda.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="email">Email Terdaftar</Label>
                        <Input 
                            id="email"
                            placeholder="nama@email.com"
                            {...register("email")}
                            error={errors.email?.message}
                        />
                    </div>
                    
                    <Button type="submit" className="w-full rounded-full bg-gray-900" isLoading={isLoading}>
                        Kirim Link Reset
                    </Button>
                </form>
                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2 font-medium">
                        <ArrowLeft size={16}/> Kembali ke Login
                    </Link>
                </div>
            </div>
        </div>
    )

}