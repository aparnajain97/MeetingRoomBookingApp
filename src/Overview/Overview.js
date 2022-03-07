import React, { useEffect, useState } from 'react';
import AddMeeting from '../AddMeeting/AddMeeting';
import {getAllBuildings} from '../ApiProvider/provider';
import { isMeetingToday, isMeetingCurrentlyRunning } from '../Utils/utils';
import OverviewsCss from './Overviews.css';

const initialMeetingData = {
  totalBuildings: 0,
  totalMeetingRooms: 0,
  currentlyAvailableRooms: 0,
  totalMeetingsToday: 0,
  currentMeetingsCount: 0,
  buildingNames: []
}

const getMeetingData = (buildings) => {
  const totalBuildings = buildings.length;
  let totalMeetingRooms = 0;
  let currentlyAvailableRooms = 0;
  let totalMeetingsToday = 0;
  let currentMeetingsCount = 0;
  let buildingNames = [];

  buildings.forEach(building => {
    buildingNames.push(building.name);
    const { meetingRooms } = building;
    totalMeetingRooms += meetingRooms.length;
    currentlyAvailableRooms += meetingRooms.length;

    meetingRooms.forEach(meetingRoom => {
      const { meetings } = meetingRoom;

      meetings.forEach(meeting => {
        const currentDate = new Date();
        if (isMeetingToday(meeting, currentDate)) {
          ++totalMeetingsToday;
          if (isMeetingCurrentlyRunning(meeting, currentDate)) {
            --currentlyAvailableRooms;
            ++currentMeetingsCount;
          }
        }
      })

    })
  });
  return {totalBuildings, totalMeetingRooms, currentlyAvailableRooms, totalMeetingsToday, currentMeetingsCount, buildingNames};
}

const Overview = () => {
  // fetchAllBuildings:
  // Buildings.length = total buildings
  // For each building: meetingRooms.length = total meetingRooms
  // For each  building: for each meetingRooms: for each meetings: See if available now = free now rooms
  // For each  building: for each meetingRooms: for each meetings: see how many today and how many going on
  const [buildings, setBuildings] = useState();
  const [showMeetingData, setShowMeetingData] = useState(false);
  const [addMeeting, setAddMeeting] = useState(false);
  const [meetingData, setMeetingData] = useState(initialMeetingData);
  
  useEffect(() => {
    getAllBuildings().then(data => {
      setBuildings(data.Buildings);
    })
  }, []);

  useEffect(() => {
    if (!buildings) return;
    setMeetingData(getMeetingData(buildings));
    setShowMeetingData(true);
  }, [buildings]);

  const onClickHandler = () => {
    setAddMeeting(true);
  }

  return (
    <div>
      {showMeetingData && !addMeeting && (<div>
      <h1>Meeting Overview</h1>
      <div className='overviewsContainer'>
        <div className='overview'>
          <h3 className='h3HeadingStyle'>Buildings</h3>
          <div>Total: {meetingData.totalBuildings}</div>
        </div>
        <div className='overview'>
          <h3 className='h3HeadingStyle'>Rooms</h3>
          <div>Total: {meetingData.totalMeetingRooms}</div>
          <div>Currently available: {meetingData.currentlyAvailableRooms}</div>
        </div>
        <div className='overview'>
          <h3 className='h3HeadingStyle'>Meetings</h3>
          <div>Total today: {meetingData.totalMeetingsToday}</div>
          <div>Currently running: {meetingData.currentMeetingsCount}</div>
        </div>
        <button className='addMeetingButton' onClick={onClickHandler}>Add Meeting</button>
      </div>
      </div>)}
      {addMeeting && <AddMeeting buildingNames={meetingData.buildingNames} />}
    </div>
  );
}

export default Overview;