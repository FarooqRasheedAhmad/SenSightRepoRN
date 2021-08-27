const monthsHalf = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const monthsFull = [
  "January",
  "Februry",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
var days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const convertDate = (dateToConvert, monthType = "half") => {
  const months = monthType === "full" ? monthsFull : monthsHalf;
  const localStatsDate = new Date(dateToConvert);
  const time = localStatsDate
    .toTimeString()
    .split(" ")[0]
    .substr(0, 5);
  const statsDate = localStatsDate.toDateString();
  const dayName = statsDate.substr(0, 3);
  const date = statsDate.substr(4);
  const day = localStatsDate.getDate();
  const month = months[localStatsDate.getMonth()];

  return { time, date, dayName, day, month };
};

export const getTimeOffsetValue = () => {
  const d = new Date();
  const n = d.getTimezoneOffset() / 60;
  const timeOffset = n < 0 ? Math.abs(n) : -n;
  return timeOffset;
};

// date format Day, dd/mm/yyyy
export const getDayMonthYear = (dateToConvert) => {
  const d = new Date(dateToConvert);
  const dayName = isToday(d) ? "Today" : days[d.getDay()];
  const monthOfYear = d.getMonth() + 1;
  const monthName = monthOfYear < 10 ? "0" + monthOfYear : monthOfYear;
  return dayName + " " + d.getDate() + "/" + monthName + "/" + d.getFullYear();
};

const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

const hours12 = (date) => date.getHours() % 12 || 12;

// date format Day, dd/mm/yyyy
export const getTime = (dateToConvert) => {
  const date = new Date(dateToConvert);
  const hours = date.getHours();
  const minutes =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  const hoursMin = `${hours < 10 ? "0" + hours : hours} : ${minutes}`;

  return hoursMin;
};

export const timeConvert = (h) => {
  const hours = Math.floor(Math.abs(h));
  const minutes = (Math.abs(h) - hours) * 60;
  return {
    hours: hours < 10 ? "0" + hours : "" + hours,
    minutes: minutes < 10 ? "0" + minutes : "" + minutes,
    sign: h < 0 ? "-" : "+",
  };
};
