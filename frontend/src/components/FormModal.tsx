"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

// Lazy load StudentForm
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
    loading: () => <p>Loading...</p>,
});

const LocalForm = dynamic(() => import("./forms/LocalForm"), {
    loading: () => <p>Loading....</p>
})

const ClassForm = dynamic(() => import("./forms/ClassForm"), {
    loading: () => <p>Loading....</p>
})

const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
    loading: () => <p>Loading....</p>
})

type FormModalProps = {
    table: "student" | "local" | "class" | "subject";
    type: "create" | "update";
    data?: any;
    relatedData?: any;
    onSuccess?: () => void;
    children?: React.ReactNode;  // Add children prop
};

const FormModal: React.FC<FormModalProps> = ({
    table,
    type,
    data,
    relatedData,
    onSuccess,
    children,
}) => {
    const [open, setOpen] = useState(false);

    const renderForm = () => {
        if (table === "student") {
            return (
                <StudentForm
                    type={type}
                    data={data}
                    setOpen={setOpen}
                    relatedData={relatedData}
                    onSuccess={onSuccess}
                />
            );
        } else if (table === "local") {
            return (
                <LocalForm
                    type={type}
                    data={data}
                    setOpen={setOpen}
                    relatedData={relatedData}
                    onSuccess={onSuccess}
                />
            );
        } else if (table === "class") {
            return (
                <ClassForm
                    type={type}
                    data={data}
                    setOpen={setOpen}
                    relatedData={relatedData}
                    onSuccess={onSuccess}
                />
            );
        }
        else if (table === "subject") {
            return (
                <SubjectForm
                    type={type}
                    data={data}
                    setOpen={setOpen}
                    relatedData={relatedData}
                    onSuccess={onSuccess}
                />
            );
        }
        return <p>Form not found</p>;
    };

    return (
        <>
            {/* Use children as the trigger if provided */}
            {children ? (
                <div onClick={() => setOpen(true)}>
                    {children}
                </div>
            ) : (
                <button
                    className={`${type === "create" ? "w-8 h-8" : "w-7 h-7"} flex items-center justify-center rounded-full ${type === "create" ? "bg-lamaYellow" : "bg-lamaSky"
                        }`}
                    onClick={() => setOpen(true)}
                >
                    <Image
                        src={type === "create" ? "/plus.png" : "/update.png"}
                        alt={type}
                        width={16}
                        height={16}
                    />
                </button>
            )}

            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[50%]">
                        {renderForm()}
                        <div
                            className="absolute top-4 right-4 cursor-pointer"
                            onClick={() => setOpen(false)}
                        >
                            <Image src="/close.png" alt="close" width={14} height={14} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FormModal;
