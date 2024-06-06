import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { CiFilter } from "react-icons/ci";
import Modal from './Modal';
import { GoCalendar } from "react-icons/go";

import NoLaunch from './NoLaunch';

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
const LaunchTable = ({ launches, loading , currentItems }) => {

  const getStatusText = (status) => {
    if (status === true) {
      return 'Success';
    } else if (status === null) {
      return 'Upcoming';
    } else if (status === false) {
      return 'Failed';
    } else {
      return '';
    }
  };


  //  For displaying Status
  const getStatusColor = (status) => {
    if (status === null) {
      return '#FEF3C7';
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
         { loading ? (
                 <tr>
                  <td colSpan={7} rowSpan={12}>Loading...</td>
                 </tr>
         ) : (
           launches.map((launch, index) => (
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
                   {getStatusText(launch.launch_success)}
                </div>
              </td>
              <td>{launch.rocket.rocket_name}</td>
            </tr>
          ))
         ) 
        }
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
        <option value="past">Past launches</option>
        <option value="upcoming">Upcoming launches</option>
      </select>
    </div>
  );
};

const TimeFilter = ({ timeFilter, setTimeFilter }) => {
  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  return (
    <div>
      <label><GoCalendar size={10}/></label>
      <select value={timeFilter} onChange={handleTimeFilterChange}>
      <option value="all">All</option>
        <option value="past-week">Past week</option>
        <option value="past-month">Past month</option>
        <option value="past-3-months">Past 3 months</option>
        <option value="past-6-months">Past 6 months</option>
        <option value="past-year">Past year</option>
        <option value="past-2-years">Past 2 years</option>
      </select>
    </div>
  );
};

// Component for the dashboard
const Dashboard = () => {
  const [launches, setLaunches] = useState([]);
  const [filter, setFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredLaunches, setFilteredLaunches] = useState([]);

  useEffect(() => {
    setLoading(true);
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
  useEffect(() => {
    // Filter launches based on the selected filter and time filter
    const filteredLaunches = launches.filter((launch) => {
      if (filter === 'past') {
        return !launch.upcoming;
      } else if (filter === 'upcoming') {
        return launch.upcoming;
      } else {
        return true;
      }
    }).filter((launch) => {
      if (timeFilter === 'all') {
        return true;
      } else {
        const currentDate = new Date();
        const launchDate = new Date(launch.launch_date_utc);
        const timeDiff = currentDate - launchDate;
        
        if (timeFilter === 'past-week') {
          return timeDiff <= 7 * 24 * 60 * 60 * 1000;
        } else if (timeFilter === 'past-month') {
          return timeDiff <= 30 * 24 * 60 * 60 * 1000;
        } else if (timeFilter === 'past-3-months') {
          return timeDiff <= 3 * 30 * 24 * 60 * 60 * 1000;
        } else if (timeFilter === 'past-6-months') {
          return timeDiff <= 6 * 30 * 24 * 60 * 60 * 1000;
        } else if (timeFilter === 'past-year') {
          return timeDiff <= 365 * 24 * 60 * 60 * 1000;
        } else if (timeFilter === 'past-2-years') {
          return timeDiff <= 2 * 365 * 24 * 60 * 60 * 1000;
        } else {
          return true;
        }
      }
    });

    setFilteredLaunches(filteredLaunches);
  }, [launches, filter, timeFilter]);


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
      <>
        <header>
          <h2>SPACEX</h2>
        </header>

        <div className='main'>
          <div className='subHeader'>
            <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
            <LaunchFilter filter={filter} setFilter={setFilter} />
          </div>
         
           
            <div className='table-container'>
            
            { currentItems.length > 0 ? (
              <LaunchTable launches={currentItems} loading={loading} /> ) : (
                <NoLaunch/>
                )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
        
        </div>
      </>
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
export default Dashboard;

