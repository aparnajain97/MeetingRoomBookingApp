import React from 'react';
import RoomCss from './Room.css';

const Room = (props) => {
  const { room: {roomId, roomName, buildingName, floor }, selected } = props;

  const handleSelect = (ev) => {
    props.handleSelect(props.room, props.index);
  }
  return (
    <div
      id={roomId}
      key={props.index}
      onClick={handleSelect}
      className={selected ? "selected" : "unselected"}
    >
      <h4 className='roomName'>{roomName}</h4>
      <div>{buildingName}</div>
      <div>Floor {floor}</div>
    </div>
  )
}

export default Room;