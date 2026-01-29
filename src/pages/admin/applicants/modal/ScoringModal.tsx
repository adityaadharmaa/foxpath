import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { applicationService } from "@/services/applicationService";
import { criteriaService } from "@/services/criteriaService";
import { FileText, Info, Loader2, Mic, Save, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ScoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  applicant: any;
}

export default function ScoringModal({
  isOpen,
  onClose,
  onSuccess,
  applicant,
}: ScoringModalProps) {
  const [criterias, setCriterias] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const getIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("wawancara"))
      return <Mic className="text-purple-500" size={20} />;
    if (lowerName.includes("cv") || lowerName.includes("curriculum"))
      return <FileText className="text-blue-500" size={20} />;
    return <Star className="text-amber-500" size={20} />;
  };

  const getScoreColor = (val: number) => {
    if (!val) return "bg-slate-100 text-slate-400";
    if (val >= 85) return "bg-green-100 text-green-700 border-green-200";
    if (val >= 70) return "bg-blue-100 text-blue-700 border-blue-200";
    if (val >= 50) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  useEffect(() => {
    if (isOpen) {
      const fetchCriterias = async () => {
        setIsLoadingData(true);
        try {
          const res = await criteriaService.getActiveCriterias();
          const manualInputCriterias = res.data.data.filter(
            (item: any) =>
              !item.name.toLowerCase().includes("akademik") &&
              !item.name.toLowerCase().includes("nilai rapor") &&
              !item.name.toLowerCase().includes("ipk"),
          );
          setCriterias(manualInputCriterias);
        } catch (error) {
          console.error(error);
          toast.error("Gagal memuat kriteria penilaian");
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchCriterias();
    }
  }, [isOpen]);

  const onSubmit = async (data: any) => {
    try {
      const scores = Object.keys(data).map((key) => {
        const criteriaId = parseInt(key.replace("criteria_", ""));
        return {
          criteria_id: criteriaId,
          value: parseFloat(data[key]),
        };
      });

      const payload = { scores };

      await applicationService.submitScore(applicant.id, payload);

      toast.success(
        `Nilai untuk ${applicant?.user?.profile?.full_name || "Pelamar"} berhasil disimpan.`,
      );

      onSuccess();
      onClose();
      reset();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Gagal menyimpan nilai.";
      toast.error(msg);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125 p-0 overflow-hidden gap-0 border-0 shadow-2xl rounded-2xl">
        <div className="px-6 py-3 text-white border-b border-slate-200 mb-2">
          <DialogHeader>
            <DialogTitle>Input Penilaian Kandidat</DialogTitle>
            <DialogDescription className=" opacity-90 text-xs font-normal">
              Masukkan nilai(0-100) untuk pelamar{" "}
              <b>{applicant?.user?.profile?.full_name}</b>. <br /> Nilai
              Akademik akan dikalkulasi otomatis oleh sistem.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="px-6 py-6 bg-white dark:bg-slate-950">
          {isLoadingData ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              <span className="text-sm text-slate-500 font-medium animate-pulse">
                Memuat Form Penilaian...
              </span>
            </div>
          ) : criterias.length === 0 ? (
            <div className="py-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Info className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p>Tidak ada kriteria penilaian manual.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* --- FORM INPUT AREA --- */}
              <div className="space-y-3">
                {criterias.map((criteria) => {
                  const currentValue = watch(`criteria_${criteria.id}`);

                  return (
                    <div
                      key={criteria.id}
                      className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                    >
                      {/* Icon Box */}
                      <div className="h-10 w-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
                        {getIcon(criteria.name)}
                      </div>

                      {/* Label & Type */}
                      <div className="flex-1">
                        <Label
                          className="text-sm font-semibold text-slate-700 cursor-pointer"
                          htmlFor={`c-${criteria.id}`}
                        >
                          {criteria.name}
                        </Label>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Bobot: {criteria.weight * 100}% •{" "}
                          {criteria.type === "benefit"
                            ? "Benefit (High Good)"
                            : "Cost (Low Good)"}
                        </p>
                      </div>

                      {/* Input Wrapper */}
                      <div className="w-24 shrink-0 relative">
                        <Input
                          id={`c-${criteria.id}`}
                          type="number"
                          step="0.01"
                          placeholder="0"
                          className={cn(
                            "text-center font-bold text-lg h-12 rounded-lg border-slate-200 focus-visible:ring-blue-500 transition-all",
                            errors[`criteria_${criteria.id}`] &&
                              "border-red-500 focus-visible:ring-red-500 bg-red-50",
                          )}
                          {...register(`criteria_${criteria.id}`, {
                            required: "Wajib",
                            min: { value: 0, message: "Min 0" },
                            max: { value: 100, message: "Max 100" },
                          })}
                        />
                        {/* Score Badge Indicator (muncul saat diketik) */}
                        {currentValue && (
                          <div
                            className={cn(
                              "absolute -top-2 -right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full border shadow-sm",
                              getScoreColor(currentValue),
                            )}
                          >
                            {currentValue}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <DialogFooter className="pt-2 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg shadow-lg shadow-blue-600/20"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Simpan Penilaian
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
