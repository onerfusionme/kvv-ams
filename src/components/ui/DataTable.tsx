'use client';

import { ReactNode, useState } from 'react';
import {
    ChevronUpDownIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';

export interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => ReactNode;
    sortable?: boolean;
    width?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string;
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
    loading?: boolean;
    pagination?: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalItems: number;
        onPageChange: (page: number) => void;
    };
    selectable?: boolean;
    selectedIds?: string[];
    onSelectionChange?: (ids: string[]) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataTable<T extends object>({
    data,
    columns,
    keyExtractor,
    onRowClick,
    emptyMessage = 'No data available',
    loading = false,
    pagination,
    selectable = false,
    selectedIds = [],
    onSelectionChange,
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortKey) return 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aVal = (a as any)[sortKey];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bVal = (b as any)[sortKey];
        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
    });

    const handleSelectAll = () => {
        if (selectedIds.length === data.length) {
            onSelectionChange?.([]);
        } else {
            onSelectionChange?.(data.map(keyExtractor));
        }
    };

    const handleSelectRow = (id: string) => {
        if (selectedIds.includes(id)) {
            onSelectionChange?.(selectedIds.filter((i) => i !== id));
        } else {
            onSelectionChange?.([...selectedIds, id]);
        }
    };

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10">
                            {selectable && (
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={data.length > 0 && selectedIds.length === data.length}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-white/20 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                                    />
                                </th>
                            )}
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider ${column.sortable ? 'cursor-pointer select-none hover:text-white' : ''
                                        }`}
                                    style={{ width: column.width }}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                >
                                    <div className="flex items-center gap-1">
                                        {column.header}
                                        {column.sortable && (
                                            <span className="text-slate-500">
                                                {sortKey === column.key ? (
                                                    sortDirection === 'asc' ? (
                                                        <ChevronUpIcon className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDownIcon className="w-4 h-4" />
                                                    )
                                                ) : (
                                                    <ChevronUpDownIcon className="w-4 h-4" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center">
                                    <div className="flex items-center justify-center gap-2 text-slate-400">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : sortedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center text-slate-400">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            sortedData.map((item) => {
                                const id = keyExtractor(item);
                                const isSelected = selectedIds.includes(id);
                                return (
                                    <tr
                                        key={id}
                                        onClick={() => onRowClick?.(item)}
                                        className={`
                      transition-colors duration-150
                      ${onRowClick ? 'cursor-pointer hover:bg-white/5' : ''}
                      ${isSelected ? 'bg-indigo-500/10' : ''}
                    `}
                                    >
                                        {selectable && (
                                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectRow(id)}
                                                    className="w-4 h-4 rounded border-white/20 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                                                />
                                            </td>
                                        )}
                                        {columns.map((column) => (
                                            <td key={column.key} className="px-4 py-3 text-sm text-slate-300">
                                                {column.render
                                                    ? column.render(item)
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    : ((item as any)[column.key] as ReactNode) ?? '-'}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
                    <div className="text-sm text-slate-400">
                        Showing{' '}
                        <span className="font-medium text-white">
                            {(pagination.currentPage - 1) * pagination.pageSize + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium text-white">
                            {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}
                        </span>{' '}
                        of <span className="font-medium text-white">{pagination.totalItems}</span> results
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="p-2 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                            .filter((page) => {
                                const current = pagination.currentPage;
                                return page === 1 || page === pagination.totalPages || Math.abs(page - current) <= 1;
                            })
                            .map((page, index, array) => {
                                const showEllipsis = index > 0 && page - array[index - 1] > 1;
                                return (
                                    <div key={page} className="flex items-center">
                                        {showEllipsis && <span className="px-2 text-slate-400">...</span>}
                                        <button
                                            onClick={() => pagination.onPageChange(page)}
                                            className={`min-w-[2rem] h-8 rounded-lg text-sm font-medium transition-colors ${page === pagination.currentPage
                                                ? 'bg-indigo-500 text-white'
                                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    </div>
                                );
                            })}
                        <button
                            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="p-2 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
