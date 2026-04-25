'use client'

import * as React from 'react'

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className='flex flex-col h-full'>
      {/* Fixed Header */}
      <div className='w-full'>
        <table className='w-full caption-bottom text-sm table-fixed'>
          <colgroup>
            {table.getAllColumns().map((col, i) => (
              <col key={col.id} style={{ width: i === 0 ? '20%' : `${80 / (table.getAllColumns().length - 1)}%` }} />
            ))}
          </colgroup>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      className={index === 0 ? '' : 'text-right'}
                      key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
        </table>
      </div>

      {/* Scrollable Body */}
      <div className='flex-1 min-h-0 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
        <table className='w-full caption-bottom text-sm table-fixed'>
          <colgroup>
            {table.getAllColumns().map((col, i) => (
              <col key={col.id} style={{ width: i === 0 ? '20%' : `${80 / (table.getAllColumns().length - 1)}%` }} />
            ))}
          </colgroup>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      className={`${index === 0 ? 'font-medium' : 'text-right'}`}
                      key={cell.id}>
                      <p className='mr-10'>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </p>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>
    </div>
  )
}
