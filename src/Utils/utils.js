const isMeetingToday = (meeting, currentDate) => {
  const { date } = meeting;
  return isSameDate(date, currentDate);
}

const isMeetingCurrentlyRunning = (meeting, currentDate) => {
  const { startTime, endTime } = meeting;
  if (isMeetingToday(meeting, currentDate)) {
    const hour = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ans = (
      parseInt(hour) >= parseInt(startTime.split(":")[0]) &&
      parseInt(minutes) >= parseInt(startTime.split(":")[1]) &&
      (parseInt(hour) <= parseInt(endTime.split(":")[0]) ||
      (parseInt(hour) === parseInt(endTime.split(":")[0]) && parseInt(minutes) <= parseInt(endTime.split(":")[1])))
    );
    return ans;
  }
  return false;
}

/**
 * 
 * @param {String} date date in format "yyyy-mm-dd"
 * @returns {String} date in format "dd/mm/yyyy"
 */
const getFormattedDate = (date) => {
  const dateParts = date.split('-');
  return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
}

/**
 * 
 * @param {String} date date in dd/mm/yyyy format
 * @param {string} dateToCompare instance of new Date()
 */
const isSameDate = (date, dateToCompare) => {
  const dt = `${("0" + dateToCompare.getDate()).slice(-2)}/${("0" + (dateToCompare.getMonth() + 1)).slice(-2)}/${dateToCompare.getFullYear()}`
  return (date === dt);
}

export {isMeetingToday, isMeetingCurrentlyRunning, getFormattedDate, isSameDate};
