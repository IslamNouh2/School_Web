"use client";

import FormModal from "@/components/FormModal";
import PaginationBar from "@/components/PaginationBar";
import Table from "@/components/Table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { role } from "@/lib/data";
import api from "@/utils/api";
import debounce from "lodash.debounce";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

type Class = {
    classId: number;
    ClassName: string;
    code: string;
    localId: number;
    local: {
        name: string;
    }
    NumStudent: number;
};

const columns = [
    { header: "Class", accessor: "ClassName" },
    { header: "Code", accessor: "code" },
    { header: "Local", accessor: "name" },
    { header: "Number", accessor: "NumStudent" },
    { header: "Actions", accessor: "action" },
];

const ClassList = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(pageParam);
    const { toast } = useToast();
    const [position, setPosition] = useState("top");

    const fetchClasses = useCallback(
        debounce(async (page: number, sortBy: string = "dateCreate") => {
            try {
                const url = `/class?page=${page}&sortBy=${sortBy}`;
                const response = await api.get(url, { withCredentials: true });
                console.log("Full API response:", response.data);
                const classesArray = Array.isArray(response.data.classes) ? response.data.classes : [];
                setClasses(classesArray);

                setTotalPages(response.data.totalPages || 1);
            } catch (err) {
                console.error("❌ Failed to fetch Classes:", err);
                setClasses([]); // fallback
            }
            finally {
                setLoading(false)
            }
        }, 500),
        []
    );

    const sortMap: Record<string, string> = {
        top: "dateCreate",
        bottom: "code",
        right: "ClassName",
    };

    useEffect(() => {
        fetchClasses(currentPage, sortMap[position]);
        console.log(sortMap[position]);
        return () => fetchClasses.cancel();
    }, [currentPage, position, fetchClasses]);

    useEffect(() => {
        setCurrentPage(pageParam);
    }, [pageParam]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        router.push(`/class?page=${newPage}`);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this Class?")) return;
        try {
            await api.delete(`/class/${id}`, { withCredentials: true });
            fetchClasses(currentPage);
            toast({ description: "Successfully deleted class." });
        } catch (err) {
            console.error("❌ Failed to delete class:", err);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Failed to delete class.",
            });
        }
    };

    const handleSuccess = () => {
        fetchClasses(currentPage);
    };

    const renderRow = (item: Class) => (
        <tr
            key={item.classId}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >
            <td className="p-4">{item.ClassName}</td>
            <td className="p-4">{item.code}</td>
            <td className="p-4">{item.local.name}</td>
            <td className="p-4">{item.NumStudent}</td>
            <td className="p-4">
                <div className="flex items-center gap-2">
                    <FormModal
                        table="class"
                        type="update"
                        data={item}
                        onSuccess={handleSuccess}
                    >
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                            <Image src="/update.png" alt="Update" width={16} height={16} />
                        </button>
                    </FormModal>
                    {role === "admin" && (
                        <button
                            onClick={() => handleDelete(item.classId)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple"
                        >
                            <Image src="/delete.png" alt="Delete" width={16} height={16} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );

    return (
        <div>
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <div className="flex items-center justify-between">
                    <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-4 self-end">
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                                <Image src="/filter.png" alt="Filter" width={14} height={14} />
                            </button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                                        <Image src="/sort.png" alt="Sort" width={14} height={14} />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-50">
                                    <DropdownMenuRadioGroup
                                        value={position}
                                        onValueChange={setPosition}
                                    >
                                        <DropdownMenuRadioItem value="top">Date Creation</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="bottom">Code</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="right">Nom</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {role === "admin" && (
                                <FormModal table="class" type="create" onSuccess={handleSuccess} />
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading...</div>
                ) : (
                    <>
                        <Table columns={columns} data={classes} renderRow={renderRow} />
                        <PaginationBar
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ClassList;
