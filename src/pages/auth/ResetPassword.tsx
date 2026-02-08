import { useNavigate, useSearchParams } from "react-router-dom";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const resetSchema = z
  .object({
    password: z.string().min(8, "Password minimal 8 karakter"),
    password_confirmation: z.string(),
    token: z.string(),
    email: z.string().email(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi password tidak cocok",
    path: ["password_confirmation"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  useEffect(() => {
    if (token) setValue("token", token);
    if (email) setValue("email", email);

    if (!token || !email) {
      toast.error("Link tidak valid atau kadaluarsa.");
    }
  }, [token, email, setValue]);

  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.resetPassword(data);
      toast.success(
        response.message || "Password berhasil direset! Silakan login kembali.",
      );
      navigate("/login");
    } catch (error: any) {
      // State form tidak akan ter-reset karena preventDefault otomatis dari handleSubmit
      const msg = error.response?.data?.message || "Gagal mereset password.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors duration-300">
        <div className="mb-6 text-center">
          {/* FP Logo Icon */}
          <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-slate-800 mx-auto flex items-center justify-center mb-4 transition-colors">
            <span className="text-gray-500 dark:text-slate-400 font-bold uppercase">
              FP
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">
            Buat Password Baru
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-2 font-medium leading-relaxed">
            Silakan masukkan password baru untuk akun <br />
            <strong className="text-gray-900 dark:text-slate-200 break-all">
              {email}
            </strong>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Hidden fields untuk menyimpan data dari URL */}
          <input type="hidden" {...register("token")} />
          <input type="hidden" {...register("email")} />

          <div className="space-y-1 relative">
            <Label className="text-gray-600 dark:text-slate-300 font-medium ml-1 uppercase text-[10px] tracking-wider">
              Password Baru
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Minimal 8 karakter"
                {...register("password")}
                error={errors.password?.message}
                className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 h-11 rounded-xl focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white"
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
            <Label className="text-gray-600 dark:text-slate-300 font-medium ml-1 uppercase text-[10px] tracking-wider">
              Ulangi Password Baru
            </Label>
            <Input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Konfirmasi Password"
              {...register("password_confirmation")}
              error={errors.password_confirmation?.message}
              className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 h-11 rounded-xl focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 text-white font-bold h-11 transition-all active:scale-95"
            >
              {isLoading && <Loader2 className="animate-spin mr-2" size={18} />}
              Simpan Password Baru
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
