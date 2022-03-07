import React, { useEffect, useState } from 'react';
import { getAllMeetingRooms, saveMeeting } from '../ApiProvider/provider';
import Room from './Room';
import RoomsCss from './Rooms.css';

const findAvailableRooms = (allMeetingRooms, meetingDetails) => {
  const allAvailableRooms = [];

  allMeetingRooms.forEach(meetingRoom => {
    const {
      name: roomName,
      floor,
      building: { name: buildingName },
      meetings = [],
      id: roomId,
    } = meetingRoom;

    let isBooked = false;

    meetings.forEach(meeting => {
      if ((meeting.date === meetingDetails.meetingDate
          && meeting.startTime < meetingDetails.endTime
          && meeting.endTime > meetingDetails.startTime)) {
        isBooked = true;
      }
    });

    if (!isBooked) {
      allAvailableRooms.push({
        roomId,
        roomName,
        floor,
        buildingName,
      });
    }
  });

  return [...allAvailableRooms];
}
const Rooms = (props) => {
  const [allMeetingRooms, setAllMeetingRooms] = useState();
  const [allAvailableRooms, setAllAvailableRooms] = useState();
  const [availableRoomsInBuilding, setAvailableRoomsInBuilding] = useState();
  const [showrooms, setShowRooms] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState();
  const [selectedRoom, setSelectedRoom] = useState();
  const { meetingDetails, meetingDetails: { buildingName } } = props;

  useEffect(() => {
    getAllMeetingRooms().then(data => {
      setAllMeetingRooms(data.MeetingRooms);
    })
  }, [])

  useEffect(() => {
    if (!allMeetingRooms || !meetingDetails) {
      return;
    }
    setAllAvailableRooms(findAvailableRooms(allMeetingRooms, meetingDetails));
  }, [allMeetingRooms, meetingDetails]);

  useEffect(() => {
    if (!allAvailableRooms) {
      return;
    }
    setAvailableRoomsInBuilding(allAvailableRooms.filter(room => room.buildingName === buildingName));
    setShowRooms(true);
  }, [allAvailableRooms])

  const handleSave = () => {
    const payload = {...selectedRoom, id: Math.floor(Math.random() * 100), title: "Booked for interview"};
    saveMeeting(payload).then(() => {
      alert('saved successfully');
      window.location.reload();
    }).catch(error => {
      alert('Error saving your meeting. Please try again.');
      console.log("Error saving meeting", JSON.stringify(error));
    });
  }

  const selectRoom = (selectedRoomDetails, index) => {
    setSelectedIndex(index);
    setSelectedRoom({...selectedRoomDetails, ...props.meetingDetails})
  }

  return (
    <div>
      {showrooms &&
        (<div className='roomsContainer'>
          <h3 className='roomsHeading'>Please select one of available rooms</h3>
          {(availableRoomsInBuilding && availableRoomsInBuilding.length)
            ? <div>
                {availableRoomsInBuilding.map((room, index) => (
                  <Room
                    room={room}
                    index={index}
                    key={index}
                    selected={selectedIndex === index}
                    handleSelect={selectRoom}
                  />
                ))}
              <button className='saveButton' onClick={handleSave} disabled={selectedIndex===undefined}>Save</button>
            </div>
            : <div className='noRoomsAvailable'>No rooms available in this building. Please select different date/time.</div>
          }
          </div>
        )
      }
    </div>
  )
}

export default Rooms;