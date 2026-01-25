import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Your Custom Select
import { criteriaService } from "@/services/criteriaService"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"

interface CriteriaModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    criteriaToEdit?: any
}

export default function CriteriaModal({isOpen, onClose, onSuccess, criteriaToEdit} : CriteriaModalProps) {
    const {register, handleSubmit, reset, control, setValue, watch, trigger, formState: {errors}} = useForm()
    const [isLoading, setIsLoading] = useState(false)

    const typeValue = watch("type");

    useEffect(() =>{
        if(isOpen) {
            if(criteriaToEdit) {
                setValue("code", criteriaToEdit.code)
                setValue("name", criteriaToEdit.name)
                setValue("weight", criteriaToEdit.weight)
                setValue("type", criteriaToEdit.type)
                setValue("description", criteriaToEdit.description)
            } else {
                reset({name: "", code: "", weight: "", type: "benefit", description: ""})
            }

            register("type", { required: "Tipe attribute wajib dipilih" });
        }
    }, [isOpen, criteriaToEdit, reset, setValue, register]) 

    const onSubmit = async (data: any) => {
        // console.log("Submitting Data:", data); 

        setIsLoading(true)
        try{
            const payload = {
                ...data,
                weight: parseFloat(data.weight)
            }
            if(criteriaToEdit) {
                const response = await criteriaService.updateCriteria(criteriaToEdit.id, payload)
                toast.success(response.data.message)
            } else {
                const response = await criteriaService.createCriteria(payload)
                toast.success(response.data.message)
            }
            onSuccess()
            onClose() 
        } catch (error: any) {
            console.error(error)
            if (error.response?.data?.errors) {
                const errorMsg = Object.values(error.response.data.errors).flat().join(', ');
                toast.error(errorMsg);
            } else {
                toast.error(error.response?.data?.message || "Terjadi kesalahan.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>{criteriaToEdit ? "Edit Kriteria" : "Tambah Kriteria Baru"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Kode Kriteria</Label>
                        <Input
                            {...register("code", {required: "Kode wajib diisi"})}
                            placeholder="Contoh: C1"
                            disabled={!!criteriaToEdit}
                        />
                        {errors.code && <span className="text-xs text-red-500">{errors.code.message as string}</span>}
                    </div>

                    <div className="space-y-2">
                        <Label>Nama Kriteria</Label>
                        <Input
                            {...register("name", {required: "Nama wajib diisi"})}
                            placeholder="Contoh: Nilai Akademik"
                        />
                        {errors.name && <span className="text-xs text-red-500">{errors.name.message as string}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Bobot (0 - 1)</Label>
                            <Input 
                                type="number"
                                step="0.0001" 
                                {...register("weight", {required: "Bobot wajib diisi", min: 0, max: 1})}
                                placeholder="0.25"
                            />
                            {errors.weight && <span className="text-xs text-red-500">{errors.weight.message as string}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label>Tipe (Attribute)</Label>
                            <Controller
                                control={control}
                                name="type"
                                rules={{required: "Tipe wajib dipilih"}}
                                render={({field}) => (
                                    <Select 
                                onValueChange={(val) => {
                                    setValue("type", val);
                                    trigger("type"); 
                                }} 
                                defaultValue={criteriaToEdit?.type || "benefit"}
                                value={typeValue} 
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="benefit">Benefit (Makin tinggi makin bagus)</SelectItem>
                                    <SelectItem value="cost">Cost (Makin rendah makin bagus)</SelectItem>
                                </SelectContent>
                            </Select>
                            )}
                            />
                            {errors.type && <span className="text-xs text-red-500">{errors.type.message as string}</span>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Deskripsi (Opsional)</Label>
                        <Input 
                            {...register("description")}
                            placeholder="Keterangan tambahan..."
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {criteriaToEdit ? "Simpan Perubahan" : "Buat Kriteria"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}