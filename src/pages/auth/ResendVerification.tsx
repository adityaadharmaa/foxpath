import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authService } from "@/services/authService"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Mail } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import * as z from "zod"

const resendShcema = z.object({
    email: z.string().email("Format email tidak valid")
})

type ResendFormValues = z.infer<typeof resendShcema>

export default function ResendVerification(){
    const [isLoading, setIsLoading] = useState(false)

    const{
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<ResendFormValues>({
        resolver: zodResolver(resendShcema)
    })

    const onSubmit = async(data: ResendFormValues) => {
        setIsLoading(true)
        try{
            const response = await authService.resendVerificationByEmail(data.email)
            toast.success(response.message)
        } catch (error: any) {
            toast.success("Jika email terdaftar, link baru telah dikirim.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="mb-6 text-center">
          <div className="h-12 w-12 rounded-full bg-blue-50 mx-auto flex items-center justify-center mb-4">
            <Mail className="text-blue-600" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Kirim Ulang Verifikasi</h1>
          <p className="text-gray-500 text-sm mt-2">
            Link verifikasi kadaluarsa atau tidak masuk? Masukkan email Anda untuk mendapatkan link baru.
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

          <Button type="submit" className="w-full rounded-full bg-gray-900 hover:bg-gray-800" isLoading={isLoading}>
            Kirim Link Baru
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2 font-medium">
            <ArrowLeft size={16} /> Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
    )
}