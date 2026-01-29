import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { programService } from "@/services/programService";
import {
  AlertCircle,
  Calculator,
  ChartColumn,
  CheckCircle2,
  FileSpreadsheet,
  Info,
  Loader2,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SAWResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: any;
}

export default function SAWResultModal({
  isOpen,
  onClose,
  program,
}: SAWResultModalProps) {
  const [sawData, setSawData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const fetchRankings = async () => {
    if (!program?.id) return;
    setIsLoading(true);
    try {
      const res = await programService.getSAWDetails(program.id);
      setSawData(res.data.data);
    } catch (error: any) {
      console.error(error);
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || "Gagal memuat data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinaliszeDecision = async () => {
    if (!program?.id) return;
    setIsFinalizing(true);
    try {
      await programService.finalizeDecision(program.id);
      toast.success("Keputusan berhasil ditetapkan!", {
        description: `Pelamar telah diterima/ditolak sesuai kuota program (${program.capacity} orang).`,
      });
      setIsConfirmOpen(false);
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Gagal menetapkan keputusan.",
      );
    } finally {
      setIsFinalizing(false);
    }
  };

  useEffect(() => {
    if (isOpen && program) {
      setSawData(null);
      fetchRankings();
    }
  }, [isOpen, program]);

  // --- HELPER: Render Tabel Matriks ---
  const renderMatrixTable = (
    matrixData: any[],
    title: string,
    isScore: boolean = false,
  ) => {
    if (!matrixData || matrixData.length === 0) {
      return (
        <div className="mt-4 p-6 border border-dashed rounded-xl bg-slate-50 flex flex-col items-center justify-center text-slate-500 text-sm">
          <FileSpreadsheet className="mb-2 h-8 w-8 opacity-20" />
          <p>Belum ada data untuk {title}.</p>
        </div>
      );
    }

    const firstValidRow = matrixData.find(
      (row) => row.scores && row.scores.length > 0,
    );

    if (!firstValidRow) return null;

    const criteriasCodes = firstValidRow.scores.map(
      (s: any) => s.criteria_code,
    );

    return (
      <div className="space-y-3 mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <h4 className="font-bold text-base flex items-center gap-2 text-slate-800">
          <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
            <FileSpreadsheet size={18} />
          </div>
          {title}
        </h4>

        <div className="border rounded-xl overflow-hidden overflow-x-auto shadow-sm bg-white">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-200">
              <TableRow>
                <TableHead className="w-[250px] font-bold text-slate-700 h-12">
                  Kandidat
                </TableHead>
                {criteriasCodes.map((code: string) => (
                  <TableHead
                    key={code}
                    className="text-center font-bold text-slate-700 h-12 min-w-[80px]"
                  >
                    {code}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {matrixData.map((row: any, idx: number) => (
                <TableRow
                  key={idx}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <TableCell className="font-medium py-3">
                    <div className="font-bold text-slate-800 text-sm">
                      {row.full_name}
                    </div>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {row.identity_number} • {row.type}
                    </span>
                  </TableCell>

                  {criteriasCodes.map((code: string, cIdx: number) => {
                    const scoreItem = row.scores?.find(
                      (s: any) => s.criteria_code === code,
                    );
                    const val = scoreItem ? scoreItem.value : 0;

                    return (
                      <TableCell
                        key={cIdx}
                        className="text-center text-sm text-slate-600 font-mono py-3"
                      >
                        {isScore ? val : Number(val).toFixed(4)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        {/* PERUBAHAN 1: sm:max-w-6xl 
          Membuat modal jauh lebih lebar (sekitar 1150px) agar tabel lega 
      */}
        <DialogContent className="sm:max-w-6xl h-[90vh] flex flex-col p-0 overflow-hidden gap-0">
          {/* HEADER */}
          <div className="p-6 border-b bg-white z-10 flex-none">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl text-slate-900">
                <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm shadow-blue-200">
                  <Calculator size={24} />
                </div>
                Hasil Perhitungan SAW
              </DialogTitle>
              <DialogDescription className="text-base mt-1">
                Program:{" "}
                <span className="font-semibold text-slate-800">
                  {program?.name}
                </span>
                <span className="mx-2 text-slate-300">|</span>
                Total Peserta:{" "}
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {sawData?.program_info?.total_applicants || 0}
                </span>
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* CONTENT AREA (SCROLLABLE) */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="font-medium animate-pulse text-lg">
                  Sedang memuat data kalkulasi...
                </p>
              </div>
            ) : !sawData ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl m-4">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <AlertCircle className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700">
                  Belum ada data perhitungan
                </h3>
                <p className="text-slate-500 mt-1 mb-6 max-w-md text-center">
                  Silakan lakukan perhitungan ranking terlebih dahulu melalui
                  menu program.
                </p>
                <Button variant="outline" onClick={onClose}>
                  Tutup Modal
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="ranking" className="w-full space-y-6">
                {/* TABS LIST */}
                <div className="flex justify-center md:justify-start">
                  <TabsList className="grid w-full md:w-auto grid-cols-2 h-12 p-1 bg-slate-200/50 rounded-xl">
                    <TabsTrigger
                      value="ranking"
                      className="px-8 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm font-medium transition-all"
                    >
                      <Trophy size={18} className="mr-2 text-amber-500" /> Final
                      Ranking
                    </TabsTrigger>
                    <TabsTrigger
                      value="details"
                      className="px-8 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm font-medium transition-all"
                    >
                      <ChartColumn size={18} className="mr-2 text-blue-500" />{" "}
                      Detail Matriks
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* TAB 1: FINAL RANKING */}
                <TabsContent
                  value="ranking"
                  className="space-y-6 animate-in fade-in zoom-in-95 duration-300"
                >
                  <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader className="bg-slate-50 border-b">
                        <TableRow>
                          <TableHead className="w-[80px] text-center font-bold text-slate-700 py-4">
                            Rank
                          </TableHead>
                          <TableHead className="text-slate-700 font-bold py-4">
                            Informasi Kandidat
                          </TableHead>
                          <TableHead className="text-slate-700 font-bold py-4 hidden md:table-cell">
                            Institusi / Asal
                          </TableHead>
                          <TableHead className="text-right text-slate-700 font-bold py-4 pr-6">
                            Nilai Akhir (V)
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sawData.final_ranking.map(
                          (item: any, index: number) => (
                            <TableRow
                              key={index}
                              className={`transition-colors ${index === 0 ? "bg-amber-50/40 hover:bg-amber-50/60" : "hover:bg-slate-50"}`}
                            >
                              <TableCell className="text-center py-4">
                                {index === 0 ? (
                                  <div className="flex justify-center">
                                    <div className="bg-amber-100 p-2 rounded-full shadow-sm">
                                      <Trophy
                                        size={20}
                                        className="text-amber-600"
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <span className="font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg text-sm border">
                                    #{item.rank}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="font-bold text-slate-800 text-base">
                                  {item.full_name}
                                </div>
                                <div className="text-xs text-slate-500 flex flex-wrap gap-2 mt-1.5">
                                  <span className="bg-slate-100 border px-2 py-0.5 rounded text-slate-600 font-medium">
                                    {item.type}
                                  </span>
                                  <span className="flex items-center text-slate-400">
                                    ID: {item.identity_number}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell py-4">
                                <div className="text-sm text-slate-700 font-medium">
                                  {item.institution}
                                </div>
                                <div className="text-xs text-slate-400 truncate max-w-[250px] mt-0.5">
                                  {item.major}
                                </div>
                              </TableCell>
                              <TableCell className="text-right pr-6 py-4">
                                <span className="font-mono text-xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                                  {Number(item.final_score).toFixed(4)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ),
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {sawData.final_ranking.length > 0 && (
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-sm text-blue-800 items-start shadow-sm">
                      <Info className="shrink-0 mt-0.5" size={18} />
                      <p>
                        Hasil ini diurutkan berdasarkan nilai tertinggi. Peserta
                        dengan nilai tertinggi direkomendasikan untuk diterima
                        sesuai kuota.
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* TAB 2: DETAIL MATRIKS */}
                <TabsContent
                  value="details"
                  className="space-y-8 animate-in fade-in zoom-in-95 duration-300 pb-10"
                >
                  {/* Info Bobot - Card Grid */}
                  {sawData.criteria_info &&
                    sawData.criteria_info.length > 0 && (
                      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-sm mb-4 text-slate-700 flex items-center gap-2">
                          <ChartColumn size={16} className="text-blue-500" />{" "}
                          Bobot Kriteria (W)
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {sawData.criteria_info.map((c: any) => (
                            <div
                              key={c.code}
                              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg shadow-sm flex flex-col items-center min-w-[100px] hover:border-blue-300 transition-colors"
                            >
                              <span className="font-bold text-slate-800 text-lg">
                                {c.code}
                              </span>
                              <span
                                className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${c.type === "benefit" ? "text-green-600" : "text-red-600"}`}
                              >
                                {c.type}
                              </span>
                              <span className="text-blue-600 font-bold text-xl">
                                {c.weight}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {renderMatrixTable(
                    sawData.steps?.matrix_x_decision || [],
                    "1. Matriks Keputusan (X)",
                    true,
                  )}
                  {renderMatrixTable(
                    sawData.steps?.matrix_normalizes || [],
                    "2. Matriks Normalisasi (R)",
                  )}
                  {renderMatrixTable(
                    sawData.steps?.matrix_v_preference || [],
                    "3. Matriks Preferensi (V)",
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-4 border-t bg-white flex justify-between items-center z-10 flex-none">
            {/* Info Kiri (Optional) */}
            <div className="text-xs text-slate-500 hidden sm:block">
              *Pastikan data ranking sudah benar sebelum menetapkan kelulusan.
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Tutup
              </Button>

              {/* TOMBOL ACTION BARU */}
              {sawData && sawData.final_ranking?.length > 0 && (
                <Button
                  onClick={() => setIsConfirmOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <CheckCircle2 size={16} />
                  Tetapkan Kelulusan
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleFinaliszeDecision}
        title="Tetapkan Kelulusan Kandidat?"
        description={`Sistem akan otomatis menerima ${program?.capacity || 0} kandidat teratas dan menolak sisanya berdasarkan ranking saat ini. Status akan berubah menjadi 'Accepted' atau 'Rejected'.`}
        confirmText="Ya, Tetapkan Sekarang"
        variant="info" // Atau 'primary' tergantung komponen Anda, biasanya biru/hijau
        isLoading={isFinalizing}
      />
    </>
  );
}
