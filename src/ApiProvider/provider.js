import useFetch from "./UseFetch";

const baseHeaders = {
  "Content-Type": "application/json",
  "token": "a123gjhgjsdf6576",
}

const getAllBuildings = () => {
  const url = "http://smart-meeting.herokuapp.com";
    const method = "POST"
    const query = `{
      Buildings {
      name
      id
      meetingRooms {
          id
          name
          meetings {
              title
              date
              startTime
              endTime
          }
        }
      }
    }`
    const body = JSON.stringify({query});
  return new Promise((resolve, reject) => {
    useFetch(url, method, baseHeaders, body).then(response => {
      resolve(response.data);
    }).catch((error) => {
      //log error
      console.log("Error fetching allBuildings", JSON.stringify(error));
    });
  });
}

const getAllMeetingRooms = () => {
  const url = "http://smart-meeting.herokuapp.com";
    const method = "POST"
    const query = `{
      MeetingRooms {
        id
        name
        floor
        building {
          name
        }
        meetings {
          id
          title
          date
          startTime
          endTime
        }
      }
    }`
    const body = JSON.stringify({query});
  return new Promise((resolve) => {
    useFetch(url, method, baseHeaders, body).then(response => {
      resolve(response.data);
    }).catch((error) => {
      //log error
      console.log("Error fetching allMeetingRooms", JSON.stringify(error));
    });
  }) 
}

const saveMeeting = (payload) => {
  const {id, title, meetingDate, startTime, endTime, roomId} = payload;
  const url = "http://smart-meeting.herokuapp.com";
  const method = "POST"
  const query = `mutation {
    Meeting(
    id: ${id}
    title: "${title}"
    date: "${meetingDate}"
    startTime: "${startTime}"
    endTime: "${endTime}"
    meetingRoomId: ${roomId}
    ) {
    id
    title
    }
  }`
  const body = JSON.stringify({query});
  return new Promise((resolve, reject) => {
    useFetch(url, method, baseHeaders, body).then(response => {
      resolve(response.data);
    }).catch((error) => {
      //log error
      console.log("Error saving meeting", JSON.stringify(error));
      reject(error);
    });
  }) 
}

export {getAllBuildings, getAllMeetingRooms, saveMeeting};