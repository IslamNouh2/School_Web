"use client";

import React from "react";

const Table = ({
    columns,
    renderRow,
    data,
}: {
    columns: { header: string; accessor: string; className?: string }[];
    renderRow: (item: any) => React.ReactNode;
    data: any[];
}) => {
    if (!Array.isArray(data)) {
        return <div className="text-red-500 p-4">Invalid data format</div>;
    }

    if (data.length === 0) {
        return <div className="text-gray-500 p-4">No records found</div>;
    }

    return (
        <table className="w-full mt-4">
            <thead>
                <tr className="text-left text-gray-500 text-sm">
                    {columns.map((col) => (
                        <th key={col.accessor} className={col.className || "p-4"}>
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <React.Fragment key={item.id || index}>
                        {renderRow(item)}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default Table;
