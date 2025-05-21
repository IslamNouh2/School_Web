"use client";

import { useState } from "react";
import CardList from "@/components/CardList";
import PaginationBar from "@/components/PaginationBar";
import TableSearch from "@/components/TableSearch";
import { role, teachersData } from "@/lib/data";
import Image from "next/image";
import FormModal from "@/components/FormModal";

const TeacherList = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="bg-white p-4 flex-1 m-4 rounded-md mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block font-semibold text-lg">All Teachers</h1>
                <div className="flex flex-col items-center md:flex-row gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="flex items-center justify-center h-8 w-8 rounded-full bg-lamaSky">
                            <Image src="/filter.png" alt="Filter" width={14} height={14} />
                        </button>
                        <button className="flex items-center justify-center h-8 w-8 rounded-full bg-lamaSky">
                            <Image src="/sort.png" alt="Sort" width={14} height={14} />
                        </button>
                        {role == "admin" && (
                            // <button
                            //     className="flex items-center justify-center h-8 w-8 rounded-full bg-lamaSky">
                            //     <Image src="/plus.png" alt="Add" width={14} height={14} />
                            // </button>
                            <FormModal table="teacher" type="create" />
                        )}
                    </div>
                </div>
            </div>

            {/* LIST */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
                {teachersData.map((person, teacherID) => (
                    <CardList key={teacherID} {...person} />
                ))}
            </div>

            {/* BOTTOM */}
            <PaginationBar />
        </div>
    );
};

export default TeacherList;
