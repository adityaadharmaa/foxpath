import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";
import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function VerifyEmail() {
  const { id, hash } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Memproses verifikasi email...");

  useEffect(() => {
    const verify = async () => {
      if (!id || !hash) {
        setStatus("error");
        setMessage("Link verifikasi tidak valid.");
        return;
      }

      try {
        const query = window.location.search.substring(1);
        const response = await authService.verifyEmail(id, hash, query);

        setStatus("success");
        setMessage(response.message || "Email anda berhasil diverifikasi!");
        toast.success("Email berhasil diverifikasi.");
      } catch (error: any) {
        setStatus("error");
        const errorMsg =
          error.response?.data?.message ||
          "Link kadaluarsa atau akun sudah tidak ada.";
        setMessage(errorMsg);
        toast.error(errorMsg);
      }
    };

    verify();
  }, [id, hash]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-800 text-center transition-colors duration-300">
        <div className="mb-6 flex justify-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center transition-colors">
            {status === "loading" && (
              <Loader2
                className="animate-spin text-blue-600 dark:text-blue-400"
                size={32}
              />
            )}
            {status === "success" && (
              <CheckCircle2 className="text-green-500" size={32} />
            )}
            {status === "error" && (
              <XCircle className="text-red-500" size={32} />
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-tight">
          {status === "loading" && "Verifikasi Email"}
          {status === "success" && "Berhasil!"}
          {status === "error" && "Gagal Verifikasi"}
        </h1>

        <p className="text-gray-500 dark:text-slate-400 text-sm mb-8 leading-relaxed font-medium">
          {message}
        </p>

        <div className="space-y-3">
          {status === "loading" && (
            <div className="h-11 w-full bg-gray-100 dark:bg-slate-800 animate-pulse rounded-full" />
          )}

          {status === "success" && (
            <Button
              onClick={() => navigate("/login")}
              className="w-full rounded-full bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 text-white font-bold h-11 transition-all active:scale-95 shadow-lg shadow-gray-200 dark:shadow-none"
            >
              Lanjut Login <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {status === "error" && (
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => navigate("/register")}
                className="w-full rounded-full bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 text-white font-bold h-11 transition-all active:scale-95 shadow-lg shadow-gray-200 dark:shadow-none"
              >
                Daftar Ulang Sekarang
              </Button>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
                Akun mungkin sudah dihapus atau link tidak berlaku. <br />{" "}
                Silakan daftar kembali untuk memulai proses.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
