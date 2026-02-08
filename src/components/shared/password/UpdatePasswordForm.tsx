import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authService } from "@/services/authService";

import {
  FormLabel,
  FormInput,
  FormItem,
  FormDescription,
  FormMessage,
} from "@/components/ui/form-elements";

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Password saat ini wajib diisi."),
    new_password: z.string().min(8, "Password baru minimal 8 karakter"),
    new_password_confirmation: z.string(),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Konfirmasi password tidak cocok.",
    path: ["new_password_confirmation"],
  });

export default function UpdatePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  async function onSubmit(values: z.infer<typeof passwordSchema>) {
    setIsLoading(true);
    try {
      const res = await authService.updatePassword(values);
      toast.success(res.message || "Password berhasil diperbarui.");
      reset();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui password",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Password Saat Ini */}
      <FormItem>
        <FormLabel htmlFor="current_password">Password Saat Ini</FormLabel>
        <div className="relative">
          <FormInput
            id="current_password"
            type={showPass.current ? "text" : "password"}
            placeholder="••••••••"
            {...register("current_password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400"
            onClick={() =>
              setShowPass({ ...showPass, current: !showPass.current })
            }
          >
            {showPass.current ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        <FormMessage>{errors.current_password?.message}</FormMessage>
      </FormItem>

      <Separator className="bg-slate-100" />

      {/* Password Baru */}
      <FormItem>
        <FormLabel htmlFor="new_password">Password Baru</FormLabel>
        <div className="relative">
          <FormInput
            id="new_password"
            type={showPass.new ? "text" : "password"}
            placeholder="••••••••"
            {...register("new_password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400"
            onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
          >
            {showPass.new ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        <FormDescription>Minimal 8 karakter.</FormDescription>
        <FormMessage>{errors.new_password?.message}</FormMessage>
      </FormItem>

      {/* Konfirmasi Password */}
      <FormItem>
        <FormLabel htmlFor="new_password_confirmation">
          Konfirmasi Password Baru
        </FormLabel>
        <div className="relative">
          <FormInput
            id="new_password_confirmation"
            type={showPass.confirm ? "text" : "password"}
            placeholder="••••••••"
            {...register("new_password_confirmation")}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400"
            onClick={() =>
              setShowPass({ ...showPass, confirm: !showPass.confirm })
            }
          >
            {showPass.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        <FormMessage>{errors.new_password_confirmation?.message}</FormMessage>
      </FormItem>

      <Button
        type="submit"
        className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 transition-colors h-11 px-8 rounded-xl"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <KeyRound className="mr-2 h-4 w-4" />
        )}
        Perbarui Password
      </Button>
    </form>
  );
}
