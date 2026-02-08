import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

const registerSchema = z
  .object({
    username: z.string().min(3, "Username minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi password tidak cocok",
    path: ["password_confirmation"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      toast.success(
        "Register berhasil! Silakan verifikasi akun anda terlebih dahulu.",
      );
      navigate("/login");
    } catch (error: any) {
      // PERBAIKAN BUG: Penanganan error yang lebih aman agar tidak crash jika response tidak sesuai format
      const msg = error.response?.data?.message || "Gagal mendaftar.";
      const serverErrors = error.response?.data?.errors;

      if (serverErrors) {
        Object.values(serverErrors)
          .flat()
          .forEach((err: any) => {
            toast.error(err as string);
          });
      } else {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Penambahan class dark: ke container utama
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="mb-8">
        <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-slate-800 flex items-center justify-center shadow-inner">
          <span className="text-gray-500 dark:text-slate-400 font-bold text-xl uppercase">
            FP
          </span>
        </div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KIRI: Sudah Punya Akun */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 dark:border-slate-800 h-fit order-2 md:order-1 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-tight">
            Sudah Punya Akun?
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
            Jika anda sebelumnya sudah mendaftar di FoxPath, silakan untuk
            melanjutkan proses seleksi magang dan melihat status lamaran anda.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full h-11 border-2 border-gray-900 dark:border-blue-600 text-gray-900 dark:text-blue-500 font-semibold rounded-full hover:bg-gray-900 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all duration-300"
          >
            Masuk ke Akun Saya
          </button>
        </div>

        {/* KANAN: Form Register */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-9 md:p-10 shadow-sm border border-gray-100 dark:border-slate-800 order-1 md:order-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-tight">
            Buat Akun Baru
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
            Daftarkan diri Anda untuk mulai melamar magang.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault(); // Memastikan tidak ada reload halaman
              handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <Label
                htmlFor="username"
                className="text-gray-600 dark:text-slate-300 font-normal"
              >
                Username
              </Label>
              <Input
                id="username"
                placeholder="Username"
                autoComplete="username"
                {...register("username")}
                error={errors.username?.message}
                className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-gray-600 dark:text-slate-300 font-normal"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@foxpath.com"
                {...register("email")}
                error={errors.email?.message}
                className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1 relative">
                <Label
                  htmlFor="password"
                  className="text-gray-600 dark:text-slate-300 font-normal"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Min 8 karakter"
                    {...register("password")}
                    error={errors.password?.message}
                    className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-900 dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="password_confirmation"
                  className="text-gray-600 dark:text-slate-300 font-normal"
                >
                  Ulangi Password
                </Label>
                <Input
                  id="password_confirmation"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Konfirmasi password"
                  {...register("password_confirmation")}
                  error={errors.password_confirmation?.message}
                  className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 text-white font-semibold h-11 shadow-lg shadow-gray-200 dark:shadow-none transition-all active:scale-95"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    <span>Mendaftarkan...</span>
                  </div>
                ) : (
                  "Daftar Sekarang"
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-gray-400 dark:text-slate-500 mt-4 font-medium">
              Nama lengkap dan biodata lainnya dapat dilengkapi di halaman
              Profil setelah login.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
