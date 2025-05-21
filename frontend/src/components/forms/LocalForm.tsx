"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "../ui/input";
import api from "@/utils/api";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

type LocalFormProps = {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
    onSuccess?: () => void;
};

const LocalForm: React.FC<LocalFormProps> = ({
    type,
    data,
    setOpen,
    relatedData,
    onSuccess,
}) => {

    const [form, setForm] = useState({
        LocalName: "",
        Code: "",
        NumClass: "",
    });

    const { toast } = useToast();

    useEffect(() => {
        if (type === "update" && data) {
            setForm({
                LocalName: data.name || "",
                Code: data.code || "",
                NumClass: data.NumClass?.toString() || "",
            });
        }
    }, [type, data]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { LocalName, Code, NumClass } = form;

        if (!Code || !LocalName || !NumClass) {

            toast({
                variant: "destructive",
                title: "Uh oh! Something wrong.",
                description: "All fields are required."
            })
            return;
        }

        const numClassInt = parseInt(NumClass);
        if (isNaN(numClassInt)) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something wrong.",
                description: "NumClass must be a number."
            })
            return;
        }

        const payload = {
            name: LocalName,
            code: Code,
            NumClass: numClassInt,
            dateCreate: new Date().toISOString(),
            dateModif: new Date().toISOString(),
        };

        //console.log("Sending JSON:", payload);

        try {
            
            if (type === "create") {
                const response = await api.post("/local/create", payload, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            } else {
                await api.put(`/local/${data.localId}`, payload, {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                });
            }

            //console.log("✔ Local créé :", response.data);
            setOpen(false);
            onSuccess?.();
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || "Erreur inconnue";
            console.error("❌ Échec création local:", message);
        }
    };




    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e) }}>
            <h2 className="text-lg font-semibold mb-4">
                {type === "create" ? "Add Local" : "Edit Local"}
            </h2>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                        <h1 className="text-sm text-gray-600">Code</h1>
                        <Input
                            value={form.Code}
                            onChange={(e) => setForm({ ...form, Code: e.target.value })}
                            placeholder="Code"
                            required
                        />
                    </div>
                    <div className="w-full md:w-2/3">
                        <h1 className="text-sm text-gray-600">Local name</h1>
                        <Input
                            value={form.LocalName}
                            onChange={(e) => setForm({ ...form, LocalName: e.target.value })}
                            placeholder="Local name"
                            required
                        />
                    </div>
                </div>

                <div>
                    <h1 className="text-sm text-gray-600">Num</h1>
                    <Input
                        type="number"
                        value={form.NumClass}
                        onChange={(e) => setForm({ ...form, NumClass: e.target.value })}
                        placeholder="Num"
                        required
                    />
                </div>

            </div>

            <button
                type="submit"
                className="bg-lamaPurple text-white px-4 py-2 mt-4 rounded hover:bg-lamaPurpleDark"
            >
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default LocalForm;
