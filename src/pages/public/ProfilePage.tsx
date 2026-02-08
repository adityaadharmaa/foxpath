import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Camera,
  Save,
  User,
  Phone,
  MapPin,
  BookOpen,
  School,
  Building2,
  Calendar,
  Award,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { profileService } from "@/services/profileService";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"general" | "education">(
    "general",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [applicantType, setApplicantType] = useState<"siswa" | "mahasiswa">(
    "mahasiswa",
  );
  const [joinedAt, setJoinedAt] = useState<string | null>(null);

  const user = authService.getUser();
  const isAdmin = user?.role === "admin";

  const { register, handleSubmit, setValue, watch } = useForm();
  const watchedType = watch("applicant_type");

  useEffect(() => {
    if (watchedType) setApplicantType(watchedType);
  }, [watchedType]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await profileService.getFullProfile();
        const data = response.data;
        setValue("full_name", data.full_name);
        setValue("phone", data.phone);
        setValue("address", data.address);
        setValue("bio", data.bio);
        setValue("date_of_birth", data.date_of_birth);

        const type = data.applicant_type || "mahasiswa";
        setValue("applicant_type", type);
        setApplicantType(type);

        if (data.created_at) setJoinedAt(data.created_at);
        if (data.profile_picture_url) setPreviewImage(data.profile_picture_url);

        if (data.education) {
          setValue("institution_name", data.education.institution_name);
          setValue("major", data.education.major);
          setValue("gpa", data.education.gpa);
          setValue("average_score", data.education.average_score);
          setValue("nim", data.education.nim);
          setValue("nisn", data.education.nisn);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    };
    loadData();
  }, [setValue]);

  const onSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      await profileService.updateGeneral({
        ...formData,
        profile_picture: formData.profile_picture,
      });

      if (!isAdmin) {
        const isMahasiswa = formData.applicant_type === "mahasiswa";
        const educationPayload = {
          level: formData.applicant_type,
          institution_name: formData.institution_name,
          major: formData.major,
          nim: isMahasiswa ? formData.nim : null,
          gpa: isMahasiswa ? formData.gpa : null,
          nisn: !isMahasiswa ? formData.nisn : null,
          average_score: !isMahasiswa ? formData.average_score : null,
        };
        await profileService.updateEducation(educationPayload);
      }

      await authService.fetchMe();
      window.dispatchEvent(new Event("user-updated"));
      toast.success("Profile berhasil disimpan!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran foto maksimal 2MB");
        return;
      }
      setPreviewImage(URL.createObjectURL(file));
      setValue("profile_picture", file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (isFetching)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="pb-10 animate-in fade-in duration-500">
      {/* HEADER BANNER */}
      <div className="relative mb-20">
        <div className="h-48 w-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
        </div>

        <div className="absolute -bottom-16 left-6 md:left-10 flex items-end gap-6">
          <div className="relative group">
            <div className="h-36 w-36 rounded-full border-4 border-white dark:border-slate-950 bg-slate-100 dark:bg-slate-800 shadow-xl overflow-hidden relative">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-400">
                  <User size={64} />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-all z-20 active:scale-90 md:opacity-0 md:group-hover:opacity-100"
            >
              <Camera size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="mb-2 hidden sm:block">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {user?.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-none px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                {user?.role}
              </Badge>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:hidden px-4 mb-6 text-left">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {user?.name}
        </h1>
        <p className="text-slate-500 text-sm">{user?.email}</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 px-4 md:px-0"
      >
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-2 uppercase text-xs tracking-widest">
              <Award className="text-blue-600 dark:text-blue-400" size={18} />{" "}
              Status Akun
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black mb-1">
                  Username
                </p>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  @{user?.username}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-black uppercase">
                      Status
                    </p>
                    <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm uppercase">
                      Akun Aktif
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="flex p-1 gap-1 bg-slate-100/80 dark:bg-slate-800/50 rounded-xl w-fit border border-slate-200 dark:border-slate-800 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap",
                activeTab === "general"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500",
              )}
            >
              <User size={16} /> Data Pribadi
            </button>
            {!isAdmin && (
              <button
                type="button"
                onClick={() => setActiveTab("education")}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap",
                  activeTab === "education"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500",
                )}
              >
                <School size={16} /> Pendidikan
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            {activeTab === "general" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2 md:col-span-1 space-y-2">
                    <Label className="dark:text-slate-300">Nama Lengkap</Label>
                    <Input
                      {...register("full_name")}
                      placeholder="Nama Lengkap"
                      startIcon={<User size={16} />}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1 space-y-2">
                    <Label className="dark:text-slate-300">No. WhatsApp</Label>
                    <Input
                      {...register("phone")}
                      placeholder="08..."
                      startIcon={<Phone size={16} />}
                    />
                  </div>
                  {!isAdmin && (
                    <>
                      <div className="col-span-2 md:col-span-1 space-y-2">
                        <Label className="dark:text-slate-300">
                          Tanggal Lahir
                        </Label>
                        <Input
                          type="date"
                          {...register("date_of_birth")}
                          className="dark:bg-slate-900"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label className="dark:text-slate-300">
                          Alamat Domisili
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                          <textarea
                            {...register("address")}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 px-4 py-3 pl-11 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:text-slate-100 transition-all min-h-25"
                            placeholder="Alamat lengkap..."
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === "education" && !isAdmin && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30 rounded-xl text-sm mb-4">
                  Data pendidikan digunakan untuk perhitungan seleksi SAW.
                </div>

                <div className="space-y-2">
                  <Label className="dark:text-slate-300">
                    Jenjang Pendidikan
                  </Label>
                  <select
                    {...register("applicant_type")}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm font-medium"
                  >
                    <option value="mahasiswa">
                      Mahasiswa (Universitas/Politeknik)
                    </option>
                    <option value="siswa">Siswa (SMK)</option>
                  </select>
                </div>

                {/* MODIFIKASI GRID: grid-cols-1 untuk Mobile, md:grid-cols-2 untuk Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {applicantType === "mahasiswa" ? (
                    <>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="dark:text-slate-300">
                          Nama Universitas / Politeknik
                        </Label>
                        <Input
                          {...register("institution_name")}
                          placeholder="Nama Kampus"
                          startIcon={<Building2 size={16} />}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="dark:text-slate-300">NIM</Label>
                        <Input
                          {...register("nim")}
                          placeholder="Nomor Induk Mahasiswa"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="dark:text-slate-300">
                          IPK Terakhir
                        </Label>
                        <Input
                          {...register("gpa")}
                          type="number"
                          step="0.01"
                          placeholder="3.50"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="dark:text-slate-300">
                          Nama Sekolah
                        </Label>
                        <Input
                          {...register("institution_name")}
                          placeholder="SMA / SMK..."
                          startIcon={<School size={16} />}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="dark:text-slate-300">NISN</Label>
                        <Input
                          {...register("nisn")}
                          placeholder="Nomor Induk Siswa"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="dark:text-slate-300">
                          Rata-rata Nilai Rapor
                        </Label>
                        <Input
                          {...register("average_score")}
                          type="number"
                          step="0.01"
                          placeholder="85.5"
                        />
                      </div>
                    </>
                  )}
                  <div className="md:col-span-2 space-y-2">
                    <Label className="dark:text-slate-300">
                      Jurusan / Program Studi
                    </Label>
                    <Input
                      {...register("major")}
                      placeholder="Teknik Informatika / RPL"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-10 h-12 font-bold w-full sm:w-auto shadow-lg shadow-blue-600/20"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  <Save size={18} className="mr-2" />
                )}
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
