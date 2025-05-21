"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CardList from "@/components/CardList";
import FormModal from "@/components/FormModal";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { role } from "@/lib/data";
import api from "@/utils/api";
import PaginationBar from "@/components/PaginationBar";
import debounce from "lodash.debounce";

const StudentList = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const searchParams = useSearchParams();
    const router = useRouter();

    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const [currentPage, setCurrentPage] = useState(pageParam);
    const [isClient, setIsClient] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchStudents = useCallback(
        debounce(async (term: string, page: number) => {
            try {
                const url = term.trim()
                    ? `/student?name=${encodeURIComponent(term)}&page=${page}`
                    : `/student?page=${page}`;

                const res = await api.get(url, { withCredentials: true });

                console.log("Full API response:", res.data);

                const students = Array.isArray(res.data) ? res.data : [];

                setStudents(students);
                    (res.data.totalPages || 1);
            } catch (err) {
                console.error("❌ Failed to fetch students:", err);
                setStudents([]); // fallback
            }
        }, 500),
        []
    );


    useEffect(() => {
        console.log('Calling fetchStudents with term:', searchTerm, 'page:', currentPage);
        if (isClient) {
            fetchStudents(searchTerm, currentPage);
        }
    }, [searchTerm, currentPage, fetchStudents, isClient]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        setCurrentPage(pageParam);
    }, [pageParam]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        router.push(`/list/students?page=${newPage}`);
    };

    const handleSearchChange = (val: string) => {
        console.log(`Search term changed to: ${val}`);
        setSearchTerm(prev => (prev === val ? val + " " : val));
    };

    if (!isClient) {
        return null;
    }

    return (
        <div className="bg-white  p-4 flex-1 m-4 rounded-md mt-0">
            {/* TOP BAR */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block font-semibold text-lg">All Students</h1>
                <div className="flex flex-col items-center md:flex-row gap-4 w-full md:w-auto">
                    <TableSearch onSearchChange={handleSearchChange} />
                    <div className="flex items-center gap-4 self-end">
                        <button className="flex items-center justify-center h-8 w-8 rounded-full bg-lamaSky">
                            <Image src="/filter.png" alt="Filter" width={14} height={14} />
                        </button>
                        <button className="flex items-center justify-center h-8 w-8 rounded-full bg-lamaSky">
                            <Image src="/sort.png" alt="Sort" width={14} height={14} />
                        </button>
                        {role === "admin" && (
                            <FormModal
                                table="student"
                                type="create"
                                onSuccess={() => fetchStudents(searchTerm, currentPage)}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* STUDENT CARDS */}
            <div>

                {Array.isArray(students) && students.length === 0 ? (
                    <p className="text-center text-gray-500">Aucun étudiant trouvé.</p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
                        {students.map((person, id) => (
                            <CardList key={id}
                                studentId={person.studentId}
                                firstName={person.firstName}
                                lastName={person.lastName}
                                email={person.email || ''}
                                photo={person.photo || ''}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* PAGINATION */}
            <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default StudentList;
