import React from 'react';
import '../../style/Pagination.css';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1
}) => {
    // Helper to generate the range of pages to display
    const paginationRange = () => {
        const totalPageNumbers = siblingCount + 5;

        // Case 1: If the number of pages is less than the page numbers we want to show
        if (totalPages <= totalPageNumbers) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, '...', totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
            return [firstPageIndex, '...', ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
            return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
        }
    };

    const pages = paginationRange();

    if (currentPage === 0 || totalPages < 2) {
        return null; // Don't show pagination if there's only 1 page
    }

    const onNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const onPrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <ul className="pagination-container">
            {/* Previous Button */}
            <li
                className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={onPrevious}
            >
                <div className="arrow left" />
            </li>

            {/* Page Numbers */}
            {pages.map((pageNumber, index) => {
                if (pageNumber === '...') {
                    return <li key={index} className="pagination-item dots">&#8230;</li>;
                }

                return (
                    <li
                        key={index}
                        className={`pagination-item ${pageNumber === currentPage ? 'selected' : ''}`}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </li>
                );
            })}

            {/* Next Button */}
            <li
                className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={onNext}
            >
                <div className="arrow right" />
            </li>
        </ul>
    );
};

export default Pagination;
