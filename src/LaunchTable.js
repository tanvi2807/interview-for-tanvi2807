import React from "react";

// Component for displaying the launch table
const LaunchTable = ({ launches, loading }) => {

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
           {/* { loading ? (
                   <tr>
                    <td colSpan={7} rowSpan={12}>Loading...</td>
                   </tr>
           ) : ( */}
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
                     {getStatusText(launch.launch_success)}
                  </div>
                </td>
                <td>{launch.rocket.rocket_name}</td>
              </tr>
            ))
        //    ) 
          }
        </tbody>
      </table>
    );
  };

  export default LaunchTable;