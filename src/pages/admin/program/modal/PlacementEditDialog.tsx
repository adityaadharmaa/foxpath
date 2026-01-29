import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { applicationService } from "@/services/applicationService";
import { CalendarClock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PlacementEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  application: any;
  onSuccess: () => void;
}

export default function PlacementEdtiDialog({
  isOpen,
  onClose,
  application,
  onSuccess,
}: PlacementEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [duration, setDuration] = useState<string>("");

  useEffect(() => {
    if (application.placement_start_at) {
      setStartDate(String(application.placement_start_at).substring(0, 10));
    } else {
      setStartDate("");
    }

    if (application.placement_end_at) {
      setEndDate(String(application.placement_end_at).substring(0, 10));
    } else {
      setEndDate("");
    }

    setDuration("");
  }, [application, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: any = {
        start_date: startDate,
      };

      if (endDate) payload.end_date = endDate;
      if (duration) payload.duration_months = parseInt(duration);

      const res = await applicationService.updatePlacement(
        application.id,
        payload,
      );

      toast.success(res.data.message);

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal update jadwal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="text-blue-600" /> Ubah Jadwal Magang
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="bg-slate-50 p-2 rounded text-xs text-slate-500 mb-2">
            Pelamar:{" "}
            <span className="font-bold text-slate-700">
              {application?.user?.profile?.full_name || "Tanpa Nama"}
            </span>
          </div>
          <div className="space-y-2">
            <Label>Tanggal Mulai (Start)</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tanggal Selesai</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setDuration("");
                }}
                disabled={!!duration}
              />
            </div>
            <div className="space-y-2">
              <Label>Atau Durasi (Bulan)</Label>
              <Input
                type="number"
                placeholder="Contoh: 3"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  setEndDate("");
                }}
                disabled={!!endDate}
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 italic">
            *Isi salah satu: Tanggal Selesai manual ATAU Durasi bulan.
          </p>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600">
              {isLoading && <Loader2 className="animate spin mr-2 h-4 w-4" />}{" "}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
