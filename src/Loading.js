import React from 'react';
import ReactDOM from 'react-dom';

function Loading () {
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
                  <tr>
                    <td colSpan="7" rowSpan="12" className="no-Launch">
                      {/* <img src='C:\Users\tanvi\Downloads' alt='Loading'/> */}
                      Loading...
                    </td>
                  </tr>
                </tbody>
                </table>
    );
}

export default Loading;