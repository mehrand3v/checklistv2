// src/components/admin/DataTable.jsx
import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTable({ columns, data, loading = false }) {
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="space-y-2">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50/80">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="py-2 px-2 md:px-4 whitespace-nowrap">
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "flex items-center gap-1 cursor-pointer select-none text-xs md:text-sm font-medium"
                              : "text-xs md:text-sm font-medium"
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                          {{
                            asc: <ChevronUp className="h-3 w-3 md:h-4 md:w-4" />,
                            desc: <ChevronDown className="h-3 w-3 md:h-4 md:w-4" />,
                          }[header.column.getIsSorted()] ??
                            (header.column.getCanSort() ? (
                              <ChevronsUpDown className="h-3 w-3 md:h-4 md:w-4 opacity-50" />
                            ) : null)}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-16 text-center"
                >
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin mr-2" />
                    <span className="text-xs md:text-sm">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    index % 2 === 0
                      ? "bg-sky-50 hover:bg-sky-100"
                      : "bg-violet-50 hover:bg-violet-100"
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2 px-2 md:px-4 text-xs md:text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-16 text-center text-xs md:text-sm"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
        <div className="text-xs md:text-sm text-muted-foreground order-2 sm:order-1">
          Showing {table.getRowModel().rows.length} of {data.length} results
        </div>
        <div className="flex items-center space-x-2 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
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
