import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { CiFilter } from "react-icons/ci";
import Modal from './Modal';

// Component for displaying Modal
const LaunchItem = ({ launch }) => {
  const [showModal, setShowModal] = useState(false);

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const modal= <Modal onClose={handleClose}>
      <td>{launch.flight_number}</td>
      <td>{launch.launch_date_utc}</td>
      <td>{launch.launch_site.site_name}</td>
      <td>{launch.mission_name}</td>
      <td>{launch.rocket.rocket_name}</td>
      <td>{launch.rocket.second_stage.payloads[0].orbit}</td>
    </Modal>
 
  return (
    <div className='modal-page'>
    <tr onClick={handleModalToggle}>
      <td>{launch.flight_number}</td>
      <td>{launch.launch_date_utc}</td>
      <td>{launch.launch_site.site_name}</td>
      <td>{launch.mission_name}</td>
      <td>{launch.rocket.rocket_name}</td>
      <td>{launch.rocket.second_stage.payloads[0].orbit}</td>
     </tr> 

    {showModal && modal }
    </div>
  );
};



// Component for displaying the launch table
const LaunchTable = ({ launches }) => {

  //  For displaying Status
  const getStatusColor = (status) => {
    if (status === null) {
      return 'yellow';
    } else if (status == true) {
      return '#DEF7EC';
    } else if (status === false) {
      return '#FDE2E1';
    } else {
      return 'transparent';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  

  return (
    <table class='table_body'>
      <thead>
        <tr>
          <th>No</th>
          <th>Launched</th>
          <th>Location</th>
          <th>Mission</th>
          <th>Orbit</th>
          <th>Launch Status</th>
          <th>Rocket</th>
        </tr>
      </thead>
      <tbody>
        {launches.map((launch, index) => (
          <tr key={launch.flight_number}>
            <td>{index + 1}</td>
            <td>{formatDate(launch.launch_date_utc)} at {formatTime(launch.launch_date_utc)}</td>
            <td>{launch.launch_site.site_name}</td>
            <td>{launch.mission_name}</td>
            <td>{launch.rocket.second_stage.payloads[0].orbit}</td>
            <td>
              <div
                className="status-box"
                style={{ backgroundColor: getStatusColor(launch.launch_success) }}
              >
                {launch.launch_success ? 'Success' : 'Failed'}
              </div>
            </td>
            <td>{launch.rocket.rocket_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


// Component for filtering launches
const LaunchFilter = ({ filter, setFilter }) => {
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className='filters'>
      <label><CiFilter size={15} /></label>
      <select value={filter} onChange={handleFilterChange}>
        <option value="all">All launches</option>
        <option value="upcoming">Upcoming launches</option>
        <option value="past">Past launches</option>
      </select>
    </div>
  );
};


// Component for the dashboard
const Dashboard = () => {
  const [launches, setLaunches] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Fetch launches from API
    fetch('https://api.spacexdata.com/v3/launches')
      .then((response) => response.json())
      .then((data) => {
        setLaunches(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching launches:', error);
        setLoading(false);
      });
  }, []);

  // Filter launches based on the selected filter
  const filteredLaunches = launches.filter((launch) => {
    if (filter === 'upcoming') {
      return launch.upcoming;
    } else if (filter === 'past') {
      return !launch.upcoming;
    } else {
      return true;
    }
  });


   // Pagination
   const itemsPerPage = 12;
   const totalPages = Math.ceil(filteredLaunches.length / itemsPerPage);
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = filteredLaunches.slice(indexOfFirstItem, indexOfLastItem);
 
   const handlePageChange = (pageNumber) => {
     setCurrentPage(pageNumber);
   };
 


  return (
    <div>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <>
      <header>
        <h2>SPACEX</h2>
      </header>
        
        <div className='subHeader'>
          <LaunchFilter filter={filter} setFilter={setFilter} />
        </div>

        
        {currentItems.length > 0 ? (
          <>
            <LaunchTable launches={currentItems} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
         
        ) : (
          <p>No launches found.</p>
        )}
      </>
    )}
  </div>
 );
};


// Component for pagination
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

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage === 1) {
        pageNumbers.push(currentPage, currentPage + 1, currentPage + 2);
      } else if (currentPage === totalPages) {
        pageNumbers.push(currentPage - 2, currentPage - 1, currentPage);
      } else {
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }

    return pageNumbers;
  };

  return (
    <div>
      <button onClick={handlePreviousClick} disabled={currentPage === 1}>
        Previous
      </button>

      {getPageNumbers().map((pageNumber, index) => (
        <button
          key={index}
          onClick={() => handlePageClick(pageNumber)}
          className={pageNumber === currentPage ? 'active' : ''}
        >
          {pageNumber}
        </button>
      ))}

      <button  onClick={handleNextClick} disabled={currentPage === totalPages}> 
        Next
      </button>
    </div>
  );
};
export default Dashboard;

