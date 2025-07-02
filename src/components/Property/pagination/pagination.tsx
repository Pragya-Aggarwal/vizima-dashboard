'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DOTS = 'DOTS';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const getPaginationRange = (
    totalPages: number,
    currentPage: number,
    siblingCount: number = 1
): (number | typeof DOTS)[] => {
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPages <= totalPageNumbers) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1);
        return [...leftRange, DOTS, totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightRange = Array.from(
            { length: 3 + 2 * siblingCount },
            (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1
        );
        return [1, DOTS, ...rightRange];
    }

    const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
    );

    return [1, DOTS, ...middleRange, DOTS, totalPages];
};

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const paginationRange = getPaginationRange(totalPages, currentPage);

    if (currentPage === 0 || paginationRange.length < 1) return null;

    const handlePageClick = (page: number) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="flex items-center justify-center mt-6 flex-wrap gap-2">
            <Button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className={`
    w-10 h-10 rounded-full border 
    ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
    bg-background text-primary hover:bg-primary hover:text-white
  `}
                size="icon"
                variant="ghost"
            >
                <ChevronLeft className="w-4 h-4" strokeWidth={3} />
            </Button>

            {paginationRange.map((page, index) =>
                page === DOTS ? (
                    <span key={index} className="px-3 py-1 text-muted-foreground">
                        ...
                    </span>
                ) : (
                    <Button
                        key={page}
                        size="icon"
                        onClick={() => handlePageClick(Number(page))}
                        className={`w-10 h-10 rounded-full border 
              ${currentPage === page
                                ? 'bg-primary text-white'
                                : 'bg-background text-primary hover:bg-primary hover:text-white'
                            }`}
                    >
                        {page}
                    </Button>
                )
            )}

            <Button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`
    w-10 h-10 rounded-full border 
    ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}
    bg-background text-primary hover:bg-primary hover:text-white
  `}
                size="icon"
                variant="ghost"
            >
                <ChevronRight className="w-4 h-4" strokeWidth={3} />
            </Button>
        </div>
    );
};

export default Pagination;

