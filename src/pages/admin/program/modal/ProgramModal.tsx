import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { programService } from "@/services/programService";
import {
  Calendar,
  Clock,
  Database,
  FileText,
  Loader2,
  PlayCircle,
  Save,
  Type,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  programToEdit?: any;
}

export default function ProgramModal({
  isOpen,
  onClose,
  onSuccess,
  programToEdit,
}: ProgramModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    registration_starts_at: "",
    registration_ends_at: "",
    cohort_starts_at: "",
    placement_duration_months: "",
    capacity: "",
    is_active: 1,
  });

  useEffect(() => {
    if (programToEdit) {
      setFormData({
        name: programToEdit.name,
        description: programToEdit.description || "",
        registration_starts_at: formatDateForInput(
          programToEdit.registration_starts_at,
        ),
        registration_ends_at: formatDateForInput(
          programToEdit.registration_ends_at,
        ),
        cohort_starts_at: formatDateForInput(programToEdit.cohort_starts_at),
        placement_duration_months:
          programToEdit.placement_duration_months || "",
        capacity: programToEdit.capacity || "",
        is_active: programToEdit.is_active,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        registration_starts_at: "",
        registration_ends_at: "",
        cohort_starts_at: "",
        placement_duration_months: "6",
        is_active: 1,
        capacity: "",
      });
    }
  }, [programToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Nama program wajib diisi.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading(
      programToEdit ? "Memperbarui program..." : "Membuat program baru...",
    );

    try {
      let response;
      if (programToEdit) {
        response = await programService.updateProgram(
          programToEdit.id,
          formData,
        );
      } else {
        response = await programService.createProgram(formData);
      }
      toast.success(response.data.message, { id: toastId });
      onSuccess();
      onClose();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Gagal menyimpan program.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-0 sm:px-4">
      {/* Container Utama: Ditambahkan max-w-full dan overflow-x-hidden untuk fix lewat kanan */}
      <div className="bg-white dark:bg-slate-900 w-full max-w-[600px] rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 flex flex-col max-h-[92vh]">
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {programToEdit ? "Edit Program" : "Tambah Program"}
            </h2>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
              Atur Detail Pendaftaran
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY - Scrollable area */}
        <div className="p-6 overflow-y-auto overflow-x-hidden flex-1 custom-scrollbar">
          <form id="program-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Field: Nama */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">
                Nama Program
              </label>
              <Input
                name="name"
                placeholder="Contoh: Internship Batch II"
                className="h-12 w-full rounded-2xl dark:bg-slate-800"
                startIcon={<Type className="text-slate-400" size={18} />}
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Field: Capacity & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">
                  Kapasitas
                </label>
                <Input
                  name="capacity"
                  type="number"
                  placeholder="0"
                  className="h-12 w-full rounded-2xl dark:bg-slate-800"
                  startIcon={<Database className="text-slate-400" size={18} />}
                  value={formData.capacity}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">
                  Durasi (Bulan)
                </label>
                <Input
                  name="placement_duration_months"
                  type="number"
                  placeholder="6"
                  className="h-12 w-full rounded-2xl dark:bg-slate-800"
                  startIcon={<Clock className="text-orange-500" size={18} />}
                  value={formData.placement_duration_months}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Field: Description */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">
                Deskripsi
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Detail program..."
                className="w-full rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-800 px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white resize-none"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* SECTION: PENJADWALAN (Fixed sizing for mobile) */}
            <div className="p-5 bg-slate-50 dark:bg-slate-950/40 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <Calendar size={14} /> Penjadwalan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2 overflow-hidden">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">
                    Buka Pendaftaran
                  </label>
                  <Input
                    type="datetime-local"
                    name="registration_starts_at"
                    className="h-11 w-full rounded-xl text-xs dark:bg-slate-900 border-slate-200"
                    value={formData.registration_starts_at}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2 overflow-hidden">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">
                    Tutup Pendaftaran
                  </label>
                  <Input
                    type="datetime-local"
                    name="registration_ends_at"
                    className="h-11 w-full rounded-xl text-xs dark:bg-slate-900 border-slate-200"
                    value={formData.registration_ends_at}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2 overflow-hidden">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">
                  Mulai Kegiatan (Cohort)
                </label>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    name="cohort_starts_at"
                    className="h-11 w-full rounded-xl text-xs dark:bg-slate-900 border-blue-100 dark:border-blue-900"
                    value={formData.cohort_starts_at}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-2xl font-bold uppercase text-[10px] tracking-widest"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              form="program-form"
              type="submit"
              disabled={isLoading}
              className="h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-blue-500/20 active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                <Save className="mr-2" size={16} />
              )}
              Simpan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
