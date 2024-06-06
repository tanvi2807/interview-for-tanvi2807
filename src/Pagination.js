
import React from 'react';
import ReactDOM from 'react-dom';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePreviousClick = () => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    };
  
    const handleNextClick = () => {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    };
  
    const handlePageClick = (pageNumber) => {
      onPageChange(pageNumber);
    };
  
    const getPageNumbers = () => {
      const pageNumbers = [];
  
      if (totalPages <= 2) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(currentPage);
  
        if (currentPage < totalPages - 1) {
          pageNumbers.push(currentPage + 1);
        }
  
        if (currentPage < totalPages - 2) {
          pageNumbers.push('...');
        }
  
        pageNumbers.push(totalPages);
      }
  
      return pageNumbers;
    };
  
    return (
      <div className='pagi'>
        <button onClick={handlePreviousClick} disabled={currentPage === 1}>
        &#60;	 
        </button>
  
        {getPageNumbers().map((pageNumber, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(pageNumber)}
            className={pageNumber === currentPage ? 'active' : ''
            }
          >
            {pageNumber}
          </button>
        ))}
  
        <button onClick={handleNextClick} disabled={currentPage === totalPages}>
        &#62;	
        </button>
      </div>
    );
  };

  export default Pagination;