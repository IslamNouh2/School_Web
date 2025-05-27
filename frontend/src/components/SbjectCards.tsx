"use client"

import { MoreVertical } from "lucide-react";
import React from "react";

type SubjectCardProps = {
    subjectId: number;
    subjectName: string;
    totalGrads: number;

}
const SbjectCards: React.FC<SubjectCardProps> = ({ subjectId, subjectName, totalGrads }) => {
    return (
        <div className='rounded-2xl shadow-md bg-white mt p-4 hover:shadow-lg transition duration-200 space-y-3 w-[300px]'>
            {/* Title */}
            <div className="flex items-center justify-between ">
                <h1 className="text-xs text-gray-700 ">{subjectName}</h1>
                <MoreVertical></MoreVertical>
            </div>
            {/* Body */}
            <div className="flex items-center justify-between ">
                <div className="w-40 h-48 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-5 text-white font-sans text-center flex flex-col justify-center
                                items-center relative overflow-hidden shadow-lg">

                    <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] rotate-45"></div>

                    <div className="text-5xl font-bold mb-1 drop-shadow-md">20</div>


                    <div className="text-lg mb-4 opacity-90">Marks</div>
                </div>
            </div>
        </div>
    )
}

export default SbjectCards