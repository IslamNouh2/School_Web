"use client";

import { useParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { role } from "@/lib/data";
import FormModal from "./FormModal";
import StudentForm from "./forms/StudentForm";

type UserCardProps = {
    studentId: number;
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
};

const CardList: React.FC<UserCardProps> = ({ studentId, firstName, lastName, email, photo }) => {
    const params = useParams();
    const pathname = usePathname();

    // More reliable way to get the type
    const type = params?.type || pathname.split('/')[2];

    if (!type) {
        console.error("Type parameter is missing in URL");
        return null;
    }

    return (
        <div className="rounded-2xl shadow-md bg-white p-4 hover:shadow-lg transition duration-200 space-y-3">
            <div className="flex flex-col items-center space-y-2">
                <Image
                    src={photo || "/avatar.png"}
                    alt={firstName + ' ' + lastName}
                    width={80}
                    height={80}
                    className="rounded-full object-cover border-2 border-gray-200"
                />
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800">{firstName} {lastName}</h3>
                    <p className="text-sm text-gray-500">{email || 'No email provided'}</p>
                </div>
            </div>

            <div className="flex flex-row justify-center items-center space-x-4">
                {/* View Button */}
                <Link href={`/list/students/${studentId}`}>
                    <button
                        type="button"
                        className="flex items-center justify-center w-8 h-8 bg-lamaSky rounded-full"
                    >
                        <Image src="/view.png" alt="view" width={20} height={20} />
                    </button>
                </Link>

                {/* Admin can edit or create */}
                {role === "admin" && (
                    <>
                        {/* Edit Button */}
                        {/* <FormModal
                            table="student"
                            type="update"
                            data={{ studentId, firstName, lastName, email, photo }}
                        /> */}
                        {/* Delete Button */}
                        <button
                            type="button"
                            className="flex items-center justify-center w-8 h-8 bg-lamaPurple rounded-full"
                        >
                            <Image src="/delete-white.png" alt="delete" width={20} height={20} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CardList;