import React, { useReducer } from 'react';
import Rooms from '../Rooms/Rooms';
import {getFormattedDate} from '../Utils/utils';
import AddMeetingCss from './AddMeeting.css';

const initialstate = {
  meetingDate: "",
  startTime: "",
  endTime: "",
  buildingName: "",
  goToNextPage: false,
}

const reducer = (state, {type, value}) => {
  switch(type) {
    case "SET_MEETING_DATE":
      return {...state, meetingDate: value}
    case "SET_START_TIME":
      return {...state, startTime: value}
    case "SET_END_TIME":
      return {...state, endTime: value}
    case "SET_BUILDING_NAME":
      return {...state, buildingName: value}
    case "SET_FIND_ROOMS":
      return {...state, findRooms: value}
    default:
      throw new Error(`Unrecognized action type: ${ type }`);
  }
}

const getMinDate = () => {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  } 
  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

const AddMeeting = (props) => {
  const [state, dispatch] = useReducer(reducer, initialstate);
  const { meetingDate, startTime, endTime, buildingName, findRooms } = state;
  const { buildingNames } = props;

  const handleInput = ev => {
    let { value = "" } = ev.target;
    const { type = "" } = ev.target.dataset;
    dispatch({ type, value });
    if (findRooms) {
      setfindRooms(false);
    }
  }

  const setfindRooms = (value) => {
    dispatch({
      type: "SET_FIND_ROOMS",
      value,
    })
  }

  const findRoomClicked = () => {
    setfindRooms(true);
  }

  const getMeetingDetails = () => {
    const details = {
      meetingDate: getFormattedDate(meetingDate),
      startTime,
      endTime,
      buildingName,
    }
    return details;
  }

  return (
    <div>
      <div className='addMeetingContainer'>
        <h1 className='addMeetingHeading'>Add Meeting</h1>
        <div>
          <div className='addMeetingInputs'>
            <label htmlFor="meetingDate"><h4 className='h4Label'>Date: </h4></label>
            <input
              id="meetingDate"
              type='date'
              name="meetingDate"
              value={meetingDate}
              min={getMinDate()}
              data-type="SET_MEETING_DATE"
              onChange={handleInput}
            />
          </div>
        
          <div className='addMeetingInputs'>
            <label htmlFor="startTime"><h4 className='h4Label'>Start time: </h4></label>
            <input
              id="startTime"
              type='time'
              name="startTime"
              value={startTime}
              data-type="SET_START_TIME"
              onChange={handleInput}
              required
            />
          </div>

          <div className='addMeetingInputs'>
            <label htmlFor="endTime"><h4 className='h4Label'>End time: </h4></label>
            <input
              id="endTime"
              type='time'
              name="endTime"
              value={endTime}
              data-type="SET_END_TIME"
              onChange={handleInput}
              required
            />
          </div>
        
          <div className='addMeetingInputs'>
            <label><h4 className='h4Label'>Building: </h4></label>
            <select defaultValue="" name="building" data-type="SET_BUILDING_NAME" onChange={handleInput}>
              <option key="default" value="" disabled hidden>Select building</option>
              {buildingNames.map((buildingName, index) => (
                <option key={index} value={buildingName}>{buildingName}</option>
              ))}
            </select>
          </div>

          <button className='findRoomButton' onClick={findRoomClicked}>Find Rooms</button>
        </div>
      </div>
      {findRooms && <Rooms meetingDetails={getMeetingDetails()} />}
    </div>
  );
}

export default AddMeeting;