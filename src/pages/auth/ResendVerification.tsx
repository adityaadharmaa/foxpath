import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

const resendSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

type ResendFormValues = z.infer<typeof resendSchema>;

export default function ResendVerification() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendFormValues>({
    resolver: zodResolver(resendSchema),
  });

  const onSubmit = async (data: ResendFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.resendVerificationByEmail(data.email);
      toast.success(response.message);
    } catch (error: any) {
      // State form tetap terjaga karena tidak ada reload halaman
      toast.success("Jika email terdaftar, link baru telah dikirim.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Ditambahkan dark:bg-slate-950 untuk background utama
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      {/* Ditambahkan dark:bg-slate-900 dan dark:border-slate-800 untuk card container */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors duration-300">
        <div className="mb-6 text-center">
          {/* Icon container diperbarui untuk tampilan dark mode */}
          <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 mx-auto flex items-center justify-center mb-4 transition-colors">
            <Mail className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">
            Kirim Ulang Verifikasi
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-2 font-medium leading-relaxed">
            Link verifikasi kadaluarsa atau tidak masuk? Masukkan email Anda
            untuk mendapatkan link baru.
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
            {/* Label diperbarui dengan gaya font konsisten */}
            <Label
              htmlFor="email"
              className="text-gray-600 dark:text-slate-300 font-medium ml-1 uppercase text-[10px] tracking-wider"
            >
              Email Terdaftar
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email" // Mencegah warna hitam autofill browser
              placeholder="nama@email.com"
              {...register("email")}
              error={errors.email?.message}
              className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 h-11 rounded-xl focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 text-white font-bold h-11 transition-all active:scale-95 shadow-lg shadow-gray-200 dark:shadow-none"
          >
            {isLoading && <Loader2 className="animate-spin mr-2" size={18} />}
            Kirim Link Baru
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-gray-50 dark:border-slate-800 pt-6">
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
