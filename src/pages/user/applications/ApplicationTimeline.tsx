import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface TimelinesProps {
  currentStatus: string;
}

export default function ApplicationTimeline({ currentStatus }: TimelinesProps) {
  const STEPS = [
    {
      id: "submitted",
      label: "Lamaran Dikirim",
      description: "Dokumen Anda telah diterima oleh sistem.",
    },
    {
      id: "verified",
      label: "Verifikasi Dokumen",
      description: "Tim admin sedang memeriksa kelengkapan berkas Anda.",
    },
    {
      id: "scored",
      label: "Penilaian Teknis",
      description: "Kriteria Anda sedang dievaluasi menggunakan metode SAW.",
    },
    {
      id: "calculated",
      label: "Perhitungan Final",
      description: "Hasil akhir sedang difinalisasi oleh sistem.",
    },
    {
      id: "decision",
      label: "Keputusan Akhir",
      description: "Hasil kelulusan telah diumumkan.",
    },
  ];

  const getActiveIndex = () => {
    if (currentStatus === "accepted" || currentStatus === "rejected") return 4;
    return STEPS.findIndex((step) => step.id === currentStatus);
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
      {STEPS.map((step, index) => {
        const isCompleted = index < activeIndex || currentStatus === "accepted";
        const isCurrent =
          index === activeIndex &&
          currentStatus !== "accepted" &&
          currentStatus !== "rejected";
        const isRejected = index === 4 && currentStatus === "rejected";

        return (
          <div
            key={step.id}
            className={cn(
              "relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-in fade-in slide-in-from-bottom-4 duration-500",
              index > activeIndex &&
                currentStatus !== "accepted" &&
                "opacity-50",
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Icon/Dot */}
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-300",
                isCompleted
                  ? "bg-emerald-500 text-white"
                  : isCurrent
                    ? "bg-blue-600 text-white"
                    : isRejected
                      ? "bg-red-500 text-white"
                      : "bg-slate-200 text-slate-400",
              )}
            >
              {isCompleted ? (
                <CheckCircle2 size={18} />
              ) : isCurrent ? (
                <Clock size={18} className="animate-pulse" />
              ) : (
                <Circle size={10} fill="currentColor" />
              )}
            </div>

            {/* Card Content */}
            <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-1">
                <time
                  className={cn(
                    "font-bold text-sm",
                    isCurrent
                      ? "text-blue-600"
                      : isCompleted
                        ? "text-emerald-600"
                        : "text-slate-700",
                  )}
                >
                  {index === 4 && currentStatus === "accepted"
                    ? "Lolos Seleksi"
                    : index === 4 && currentStatus === "rejected"
                      ? "Tidak Lolos"
                      : step.label}
                </time>
              </div>
              <div className="text-slate-500 text-xs leading-relaxed">
                {isRejected && index === 4
                  ? "Maaf, kriteria Anda belum memenuhi standar kebutuhan saat ini."
                  : step.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
