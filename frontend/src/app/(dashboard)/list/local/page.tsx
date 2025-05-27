"use client"

import FormModal from "@/components/FormModal";
import PaginationBar from "@/components/PaginationBar";
import Table from "@/components/Table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { LocalData, role } from "@/lib/data";
import api from "@/utils/api";
import debounce from "lodash.debounce";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

type local = {
    localId: number;
    name: string;
    code: string;
    NumClass: number;
};

const columns = [
    { header: "Local", accessor: "name" },
    { header: "Code", accessor: "code" },
    { header: "Number", accessor: "NumClass" },
    { header: "Actions", accessor: "action" },
];

const sortMap: Record<string, string> = {
    top: "dateCreate",
    bottom: "code",
    right: "ClassName", // assuming 'Nom' maps to class name
};

const localList = () => {
    const [locals, setLocals] = useState<local[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(pageParam);
    const { toast } = useToast();
    const [position, setPosition] = React.useState("top");
    const [data, setData] = React.useState([])



    const fetchLocal = useCallback(
        debounce(async (page: number, sortBy: string = "dateCreate") => {
            try {
                const url = `/local?page=${page}&sortBy=${sortBy}`;
                const response = await api.get(url, { withCredentials: true });
                //console.log("Full API response:", response.data);
                const localsArray = Array.isArray(response.data.locals) ? response.data.locals : [];;

                setLocals(localsArray);
                setTotalPages(response.data.totalPages || 1);
            } catch (err) {
                console.error("❌ Failed to fetch local:", err);
                setLocals([]); // fallback
            }
            finally {
                setLoading(false)
            }
        }, 500),
        []
    );



    // useEffect(() => {
    //     fetchLocal(currentPage);
    //     return () => fetchLocal.cancel();
    // }, [currentPage, fetchLocal]);

    useEffect(() => {
        fetchLocal(currentPage, sortMap[position]);
        return () => fetchLocal.cancel();
    }, [currentPage, position]);

    useEffect(() => {
        setCurrentPage(pageParam);
    }, [pageParam]);


    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        router.push(`/list/local?page=${newPage}`);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this local?")) return;
        try {
            console.log("deleted id ", id)
            await api.delete(`/local/${id}`, { withCredentials: true });
            fetchLocal(currentPage);
            toast({
                description: "Success Deleted Local."
            })
        } catch (err) {
            console.log("❌ Failed to delete local:", err);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Failed to delete local.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
    }

    const handleSuccess = () => {
        fetchLocal(currentPage); // Refresh data after successful operation
    };

    const renderRow = (item: local) => (
        <tr
            key={item.localId}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >
            <td className="p-4">{item.name}</td>
            <td className="p-4">{item.code}</td>
            <td className="p-4">{item.NumClass}</td>
            <td className="p-4">
                <div className="flex items-center gap-2">
                    <FormModal
                        table="local"
                        type="update"
                        data={item}  // Pass the current item directly
                        onSuccess={handleSuccess}
                    >

                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                            <Image src="/update.png" alt="Update" width={16} height={16} />
                        </button>
                    </FormModal>
                    {role === "admin" && (
                        <button
                            onClick={() => handleDelete(item.localId)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
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
                    <h1 className="hidden md:block text-lg font-semibold">All Local</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-4 self-end">
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                                <Image src="/filter.png" alt="Filter" width={14} height={14} />
                            </button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                                        <Image src="/sort.png" alt="Filter" width={14} height={14} />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-50">
                                    <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                                        <DropdownMenuRadioItem value="top">Date Creation</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="bottom">Code</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="right">Nom</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {role === "admin" && (
                                <FormModal table="local" type="create" onSuccess={handleSuccess} />
                            )}
                        </div>
                    </div>
                </div>
                <Table
                    columns={columns}
                    data={locals}
                    renderRow={renderRow}
                />

                <PaginationBar
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}

export default localList;
