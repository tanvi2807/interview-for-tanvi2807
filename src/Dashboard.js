import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { CiFilter } from "react-icons/ci";
import Modal from './Modal';
import { GoCalendar } from "react-icons/go";

import LaunchTable from './LaunchTable';
import NoLaunch from './NoLaunch';
import Loading from './Loading';
import Pagination from './Pagination';

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
            
            { loading ? <Loading/> : 
            ( currentItems.length > 0 ? (
              <LaunchTable launches={currentItems} loading={loading} /> ) : (
                <NoLaunch/>
                )
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

export default Dashboard;

