import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";
import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function VerifyEmail() {
    const {id, hash} = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("Memproses verifikasi email...")

    useEffect(() => {
        const verify = async () => {
            if(!id || !hash) {
                setStatus("error")
                setMessage("Link verifikasi tidak valid.")
                return
            }

            try{
                const query = window.location.search.substring(1)

                await authService.verifyEmail(id, hash, query)

                setStatus("success")
                setMessage("Email anda berhasil diverifikasi!")
                toast.success("Email berhasil diverifikasi.")
            } catch (error: any) {
                setStatus("error")
                toast.error(error.response?.data?.message || "Link verifikasi kadaluarsa atau tidak valid.")   

                console.error("Verification Error:", error.response);
            }
        }

        verify()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="mb-6 flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                        {status === "loading" && <Loader2 className="animate-spin text-blue-600" size={32}/>}
                        {status === "success" && <CheckCircle2 className="text-green-500" size={32}/>}
                        {status === "error" && <XCircle className="text-red-500" size={32}/>}
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {status === "loading" && "Verifikasi Email"}
                    {status === "success" && "Berhasil!"}
                    {status === "error" && "Gagal Verifikasi"}
                </h1>

                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    {message}
                </p>
                
                <div className="space-y-3">
                    {status === "loading" && (
                        <div className="h-10 w-full bg-gray-100 animate-pulse rounded-full" />
                    )}

                    {status === "success" && (
                        <Button
                            onClick={() => navigate("/login")}
                            className="w-full rounded-full bg-gray-900 hover:bg-gray-800" 
                        >
                            Lanjut Login <ArrowRight className="ml-2 h-4 w-4
                            
                            "/>
                        </Button>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col gap-3">
                            <Button 
                                onClick={() => navigate("/login")}
                                className="w-full rounded-full bg-gray-900 hover:bg-gray-800"
                            >
                                Kembali ke Login
                            </Button>
                            <p className="text-xs text-gray-400">
                                Jika link kadaluarsa, silakan login dan minta kirim ulang verifikasi.
                            </p>
                        </div>
                    )}
                </div>
            </div>
          
        </div>
    )
}