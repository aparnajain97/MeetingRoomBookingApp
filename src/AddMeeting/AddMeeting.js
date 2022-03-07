import React, { useReducer } from 'react';
import Rooms from '../Rooms/Rooms';
import {getFormattedDate, isSameDate} from '../Utils/utils';
import AddMeetingCss from './AddMeeting.css';
import Constants from '../Constants/Constants';

const initialstate = {
  meetingDate: "",
  startTime: "",
  endTime: "",
  buildingName: "",
  error: {
    isError: false,
    errorMsg: ""
  },
}

const reducer = (state, {type, value}) => {
  switch(type) {
    case Constants.SET_MEETING_DATE:
      return {...state, meetingDate: value}
    case Constants.SET_START_TIME:
      return {...state, startTime: value}
    case Constants.SET_END_TIME:
      return {...state, endTime: value}
    case Constants.SET_BUILDING_NAME:
      return {...state, buildingName: value}
    case Constants.SET_FIND_ROOMS:
      return {...state, findRooms: value}
    case Constants.SET_ERROR:
      return {...state, error: value}
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
  const { meetingDate, startTime, endTime, buildingName, findRooms, error } = state;
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
      type: Constants.SET_FIND_ROOMS,
      value,
    })
  }

  const setError = error => {
    dispatch({
      type: Constants.SET_ERROR,
      value: error,
    });
  }

  const isMeetingTimeValid = () => {
    if (meetingDate && startTime && endTime) {
      const currentDate = new Date();
      const startHours = parseInt(startTime.split(":")[0]);
      const startMinutes = parseInt(startTime.split(":")[1]);
      const endHours = parseInt(endTime.split(":")[0]);
      const endMinutes = parseInt(endTime.split(":")[1]);

      if (isSameDate(getFormattedDate(meetingDate), currentDate)) {
        const hours = parseInt(currentDate.getHours());
        const minutes = parseInt(currentDate.getMinutes());
        if ((startHours < hours) || (startHours === hours && startMinutes < minutes)) {
          return "Meeting cannot start in the past. Please select a valid start time."
        }
      }
      if ((endHours < startHours) || (endHours === startHours && endMinutes < startMinutes)) {
        return "Meeting cannot end before start. Please select a valid end time."
      }
    }
    return "";
  }

  const findRoomClicked = () => {
    const msg = isMeetingTimeValid();
    if (msg) {
      setError({isError: true, errorMsg: msg});
      return;
    } else if (error.isError) {
      setError({isError: false, errorMsg: ""});
    }
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

  const isValidInput = () => {
    if (!meetingDate || !startTime || !endTime || !buildingName) {
      return false;
    }
    return true;
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
              data-type={Constants.SET_MEETING_DATE}
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
              data-type={Constants.SET_START_TIME}
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
              data-type={Constants.SET_END_TIME}
              onChange={handleInput}
              required
            />
          </div>
        
          <div className='addMeetingInputs'>
            <label><h4 className='h4Label'>Building: </h4></label>
            <select defaultValue="" name="building" data-type={Constants.SET_BUILDING_NAME} onChange={handleInput}>
              <option key="default" value="" disabled hidden>Select building</option>
              {buildingNames.map((buildingName, index) => (
                <option key={index} value={buildingName}>{buildingName}</option>
              ))}
            </select>
          </div>
          {error.isError && <div className='errorMessage'>{error.errorMsg}</div>}
          <button className='findRoomButton' onClick={findRoomClicked} disabled={!isValidInput()}>Find Rooms</button>
        </div>
      </div>
      {findRooms && <Rooms meetingDetails={getMeetingDetails()} />}
    </div>
  );
}

export default AddMeeting;