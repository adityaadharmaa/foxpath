import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(data.email);
      toast.success(
        response.message || "Link reset password telah dikirim ke email anda.",
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengirim link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Ditambahkan dark:bg-slate-950 untuk background utama
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      {/* Ditambahkan dark:bg-slate-900 dan dark:border-slate-800 untuk card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors duration-300">
        <div className="mb-6 text-center">
          {/* Icon container diperbarui untuk dark mode */}
          <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-slate-800 mx-auto flex items-center justify-center mb-4 transition-colors">
            <span className="text-gray-500 dark:text-slate-400 font-bold">
              FP
            </span>
          </div>
          {/* Warna teks disesuaikan untuk dark mode */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">
            Lupa Password?
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-2 font-medium leading-relaxed">
            Masukkan email yang terdaftar, kami akan mengirimkan link untuk
            mereset password Anda.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault(); // Mencegah reload halaman
            handleSubmit(onSubmit)(e);
          }}
          className="space-y-5"
        >
          <div className="space-y-1">
            {/* Label diperbarui untuk dark mode */}
            <Label
              htmlFor="email"
              className="text-gray-600 dark:text-slate-300 font-medium ml-1 uppercase text-[10px] tracking-wider"
            >
              Email Terdaftar
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email" // Mencegah background hitam browser
              placeholder="nama@email.com"
              {...register("email")}
              error={errors.email?.message}
              className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 h-11 rounded-xl focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white"
            />
          </div>

          {/* Button diperbarui agar selaras dengan desain login Anda sebelumnya */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 text-white font-bold h-11 transition-all active:scale-95"
          >
            {isLoading && <Loader2 className="animate-spin mr-2" size={18} />}
            Kirim Link Reset
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-gray-50 dark:border-slate-800 pt-6">
          {/* Link kembali diperbarui untuk dark mode */}
          <Link
            to="/login"
            className="text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-2 font-black uppercase text-[11px] tracking-tighter transition-colors"
          >
            <ArrowLeft size={14} /> Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
