import moment, { utc } from 'moment';


export class Utils {
  
  static minToHours = (val, returnObj=false) => {
    var num = val;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);

    if (returnObj) return ({ hours:rhours, minutes:rminutes})

    return rhours + " hr " + rminutes + " min";
  };


  static timeAgo = time => {
    switch (typeof time) {
      case "number":
        break;
      case "string":
        time = +new Date(time);
        break;
      case "object":
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        time = +new Date();
    }
    var time_formats = [
      [60, "seconds", 1], // 60
      [120, "1 minute ago", "1 minute from now"], // 60*2
      [3600, "minutes", 60], // 60*60, 60
      [7200, "1 hour ago", "1 hour from now"], // 60*60*2
      [86400, "hours", 3600], // 60*60*24, 60*60
      [172800, "Yesterday", "Tomorrow"], // 60*60*24*2
      [604800, "days", 86400], // 60*60*24*7, 60*60*24
      [1209600, "Last week", "Next week"], // 60*60*24*7*4*2
      [2419200, "weeks", 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, "Last month", "Next month"], // 60*60*24*7*4*2
      [29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, "Last year", "Next year"], // 60*60*24*7*4*12*2
      [2903040000, "years", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, "Last century", "Next century"], // 60*60*24*7*4*12*100*2
      [58060800000, "centuries", 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = "ago",
      list_choice = 1;

    if (seconds == 0) {
      return "Just now";
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = "from now";
      list_choice = 2;
    }
    var i = 0,
      format;
    while ((format = time_formats[i++]))
      if (seconds < format[0]) {
        if (typeof format[2] == "string") return format[list_choice];
        else
          return (
            Math.floor(seconds / format[2]) + " " + format[1] + " " + token
          );
      }
    return time;
  };

  static distance = (lat1 = 0, lon1 = 0, lat2 = 0, lon2 = 0, unit = "K") => {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "M") {
      dist = dist * 0.8684;
    }
    return dist;
  };

  static addCommas = nStr => {
    nStr += "";
    var x = nStr.split(".");
    var x1 = x[0];
    var x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
  };

}

export const getTOffset = (_time) => {
  // let str = ``;// `${time} > `;
  // const parts = _time.split(".");
  // const time = parts[0];


  // const d = new Date();
  const offset = moment().utcOffset() / 60; // (d.getTimezoneOffset() / 60); // difference in minutes / 60 = hours
  // const offset = n < 0 ? Math.abs(n) : -n;
  let offsetTime = moment(_time).add(offset, 'hours');
  // let offsetTime = moment(time).add(offset, 'hours');
  // let offsetTime = moment(d.toString()); // convert UTC to Local

  // console.log("time: ", time);
  // console.log(d.toUTCString());
  // console.log("offset: ", offset)
  // console.log("offsetTime: ", offsetTime.format());

  // str = `${_time} > diff: ${n} > `;
  
  // str = `${_time} > diff: ${n} > `;

  // let utc_date = moment.utc(_time);
  // str += ` utc(${utc_date.format()}), `
  // let converteddate = utc_date.add(n, 'hours');
  // str += ` converted(${converteddate.format()}), `

  

  return { offset, offsetTime }
}

export const cmToFeet = (cm) => {
  // var realFeet = ((n * 0.393700) / 12);
  var realFeet = ((cm * 0.393701) / 12);
  var feet = Math.floor(realFeet);
  var inches = Math.round((realFeet - feet) * 12);
  return { feet: feet.toString(), inches: inches.toString() }
}

export const feetToCm = (feet, inches) => {
  let _feet = Number(`${feet || 0}.${inches || 0}`);
  let _cm = Number(_feet / 0.0328084);
  return _cm;
}

