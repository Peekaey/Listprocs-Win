"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button.tsx"
import { Checkbox } from "@/components/ui/checkbox.tsx"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { Input } from "@/components/ui/input.tsx"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx"
import {Process} from "@/components/processes-data-table/process-data-table.type.ts";


// Boilerplate for processes table

//
// 2) Example data array of Process objects
//

export function ProcessDataTableDemo() {
    const data: Process[] = [
        {
            name: "chrome.exe",
            pid: 4520,
            cpu: 12.4,
            memory: 240_512,
            disk: 1.2,
            network: 0.85,
        },
        {
            name: "code.exe",
            pid: 11984,
            cpu: 5.7,
            memory: 180_256,
            disk: 0.3,
            network: 0.12,
        },
        {
            name: "explorer.exe",
            pid: 4924,
            cpu: 0.8,
            memory: 45_120,
            disk: 0.0,
            network: 0.00,
        },
        {
            name: "node.exe",
            pid: 22376,
            cpu: 23.1,
            memory: 320_768,
            disk: 3.4,
            network: 1.33,
        },
        {
            name: "powershell.exe",
            pid: 7280,
            cpu: 0.2,
            memory: 15_872,
            disk: 0.0,
            network: 0.00,
        },
    ];

    //
    // 3) Define the new columns for Process
    //
    const columns: ColumnDef<Process>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Name
                    {/*insert an up/down icon here if desired */}
                </Button>
            ),
            cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
            footer: (props) => <div>Total: {props.table.getPreFilteredRowModel().rows.length}</div>,
        },
        {
            accessorKey: "pid",
            header: () => <div className="text-right">Process ID</div>,
            cell: ({ row }) => <div className="text-right">{row.getValue("pid")}</div>,
        },
        {
            accessorKey: "cpu",
            header: () => <div className="text-right">CPU (%)</div>,
            cell: ({ row }) => {
                const usage = row.getValue<number>("cpu");
                // Format to one decimal place + “%”
                return <div className="text-right">{usage.toFixed(1)}%</div>;
            },
        },
        {
            accessorKey: "memory",
            header: () => <div className="text-right">Memory (MB)</div>,
            cell: ({ row }) => {
                const mem = row.getValue<number>("memory");
                const formatted = new Intl.NumberFormat("en-US", {
                    maximumFractionDigits: 0,
                }).format(mem);
                return <div className="text-right">{formatted}</div>;
            },
        },
        {
            accessorKey: "disk",
            header: () => <div className="text-right">Disk I/O (MB/s)</div>,
            cell: ({ row }) => {
                const d = row.getValue<number>("disk");
                return <div className="text-right">{d.toFixed(2)}</div>;
            },
        },
        {
            accessorKey: "network",
            header: () => <div className="text-right">Network I/O (Mbps)</div>,
            cell: ({ row }) => {
                const n = row.getValue<number>("network");
                return <div className="text-right">{n.toFixed(2)}</div>;
            },
        },
    ];

    //
    // 4) Set up state and React Table hooks
    //
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="w-full">
            {/* ─────────────── Filter Bar ─────────────── */}
            <div className="flex items-center justify-center py-4">
                <Input
                    placeholder="Filter names..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                
            </div>

            {/* ─────────────── Table Itself ─────────────── */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ─────────────── Pagination & Selection Info ─────────────── */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}