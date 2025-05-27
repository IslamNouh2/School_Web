import React, { useState } from "react";
import { Input } from "../ui/input";
import { ComboboxDemo } from "../ui/combobox";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import api from "@/utils/api";
import Image from "next/image";

type StudentFormProps = {
    type: "create" | "update";
    data?: any;
    relatedData?: any;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSuccess?: () => void;
};

const StudentForm: React.FC<StudentFormProps> = ({
    type,
    data,
    relatedData,
    setOpen,
    onSuccess,
}) => {
    const [form, setForm] = useState({
        code: "",
        nom: "",
        prenom: "",
        dateNaissance: "",
        dateInscription: "",
        lieuNaissance: "",
        nationalite: "",
        genre: "",
        carteNationale: "",
        etatCivil: "",
        etatSante: "",
        groupeSanguin: "",
        identifiantScolaire: "",
        adresse: "",
        observation: "",
        classe: "",
        pereNom: "",
        pereTel: "",
        pereEmploi: "",
        pereCarte: "",
        mereNom: "",
        mereTel: "",
        mereEmploi: "",
        kafili: false,
        photo: null as File | null,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type, checked, files } = e.target as HTMLInputElement;
        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "file"
                        ? files?.[0] ?? null
                        : value,
        }));
    };

    const GenderFrameworks = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
    ];

    const BooldTypeFrameworks = [
        { value: "A+", label: "A+" },
        { value: "A-", label: "A-" },
        { value: "B+", label: "B+" },
        { value: "B-", label: "B-" },
        { value: "O+", label: "O+" },
        { value: "O-", label: "O-" },
        { value: "AB+", label: "AB+" },
        { value: "AB-", label: "AB-" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("firstName", form.nom);
        formData.append("lastName", form.prenom);
        formData.append("dateOfBirth", form.dateNaissance);
        formData.append("gender", form.genre);
        formData.append("address", form.adresse);
        formData.append("parentId", "1"); // or dynamically if available
        formData.append("code", form.code);
        formData.append("health", form.etatSante);
        formData.append("dateCreate", new Date().toISOString());
        formData.append("dateModif", new Date().toISOString());
        formData.append("lieuOfBirth", form.lieuNaissance);
        formData.append("bloodType", form.groupeSanguin);
        formData.append("etatCivil", form.etatCivil);
        formData.append("cid", form.carteNationale);
        formData.append("nationality", form.nationalite);
        formData.append("observation", form.observation);
        formData.append("numNumerisation", "0001");
        formData.append("dateInscription", form.dateInscription);
        if (form.photo) {
            formData.append("photo", form.photo);
        }


        try {
            const response = await api.post(
                "/student/create",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("✔ Étudiant créé :", response.data);
            setOpen(false);

            if (onSuccess) onSuccess();
        } catch (err: any) {
            const message =
                err.response?.data?.message || err.message || "Erreur inconnue";
            throw new Error(message);
        }
    }



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-h-screen overflow-y-auto p-6 bg-white rounded-2xl shadow-lg w-full max-w-6xl relative">
                {/* Close button */}
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-lg"
                >
                    ✕
                </button>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Photo upload */}
                    <div className="flex flex-col items-center space-y-2">
                        <h1 className="text-xl font-medium">Ajouter Student</h1>
                        {form.photo && (
                            <Image
                                src={URL.createObjectURL(form.photo)}
                                alt="Preview"
                                className="h-24 w-24 rounded-full object-cover border"
                            />
                        )}
                        <Input
                            type="file"
                            name="photo"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>

                    {/* Section 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        <div>
                            <h2>Code<span className="text-red-600">*</span></h2>
                            <Input name="code" value={form.code} onChange={handleChange} placeholder="Code *" />
                        </div>
                        <div>
                            <h2>Nom<span className="text-red-600">*</span></h2>
                            <Input name="nom" value={form.nom} onChange={handleChange} placeholder="Nom *" />
                        </div>
                        <div>
                            <h2>Prénom<span className="text-red-600">*</span></h2>
                            <Input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Prénom *" />
                        </div>
                        <div>
                            <h2>Date Naissance<span className="text-red-600">*</span></h2>
                            <Input name="dateNaissance" value={form.dateNaissance} onChange={handleChange} type="date" />
                        </div>
                        <div>
                            <h2>Date Inscription<span className="text-red-600">*</span></h2>
                            <Input name="dateInscription" value={form.dateInscription} onChange={handleChange} type="date" />
                        </div>
                        <div>
                            <h2>Lieu de Naissance</h2>
                            <Input name="lieuNaissance" value={form.lieuNaissance} onChange={handleChange} placeholder="Lieu de Naissance" />
                        </div>
                        <div>
                            <h2>Nationalité</h2>
                            <Input name="nationalite" value={form.nationalite} onChange={handleChange} placeholder="Nationalité" />
                        </div>
                        <div>
                            <h2>Genre</h2>
                            <ComboboxDemo
                                frameworks={GenderFrameworks}
                                type="Gender"
                                value={form.genre}
                                onChange={(val) => setForm((prev) => ({ ...prev, genre: val }))}
                            />
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        <div>
                            <h2>N° Carte Nationale</h2>
                            <Input name="carteNationale" value={form.carteNationale} onChange={handleChange} />
                        </div>
                        <div>
                            <h2>État Civil</h2>
                            <Input name="etatCivil" value={form.etatCivil} onChange={handleChange} />
                        </div>
                        <div>
                            <h2>État de Santé</h2>
                            <Input name="etatSante" value={form.etatSante} onChange={handleChange} />
                        </div>
                        <div>
                            <h2>Groupage</h2>
                            <ComboboxDemo
                                frameworks={BooldTypeFrameworks}
                                type="Groupage"
                                value={form.groupeSanguin}
                                onChange={(val) => setForm((prev) => ({ ...prev, groupeSanguin: val }))}
                            />
                        </div>
                    </div>

                    {/* Adresse & Observation */}
                    <div>
                        <h2>Adresse</h2>
                        <Input name="adresse" value={form.adresse} onChange={handleChange} />
                    </div>
                    <div>
                        <h2>Observation</h2>
                        <Textarea name="observation" value={form.observation} onChange={handleChange} />
                    </div>

                    {/* Parents */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <Input name="pereNom" value={form.pereNom} onChange={handleChange} placeholder="Nom du père" />
                        <Input name="pereTel" value={form.pereTel} onChange={handleChange} placeholder="Téléphone père" />
                        <Input name="pereEmploi" value={form.pereEmploi} onChange={handleChange} placeholder="Emploi père" />
                        <Input name="pereCarte" value={form.pereCarte} onChange={handleChange} placeholder="Carte père" />
                        <Input name="mereNom" value={form.mereNom} onChange={handleChange} placeholder="Nom de la mère" />
                        <Input name="mereTel" value={form.mereTel} onChange={handleChange} placeholder="Téléphone mère" />
                        <Input name="mereEmploi" value={form.mereEmploi} onChange={handleChange} placeholder="Emploi mère" />
                        <div className="flex items-center space-x-2">
                            <Input type="checkbox" name="kafili" checked={form.kafili} onChange={handleChange} />
                            <label>Kafil</label>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center space-x-6 mt-6">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" variant="outline">
                            Valider
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentForm;
