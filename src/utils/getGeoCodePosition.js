import moment from "moment";

export const getGeoCodePosition = async (data, cb) => {
  // var list = [];
  // var index = 0;
  let parsedLastLoc, locality;
  /*
  for (let item of data) {

    if (item.locality) {
      const address = item.locationName.split(/[-,]+/)
      locality = `${address[0]}`
      var date = await new Date((item.addedTime + 'Z').toLocaleString())
      const hourDiff = moment().diff(moment(item.addedTime + 'Z'), "hours")
      // console.log("===> moment(date).fromNow(): "+ moment(date).fromNow())
      var timeAgo = hourDiff <= 24 && index < 4 ? moment(date).fromNow() : moment(date).format('h:mm a, Do MMM')      
      parsedLastLoc = locality + " • " + timeAgo == "in a few seconds" ? "a few seconds ago" : timeAgo

      var newelement = {
        key: index + "",
        name: item.city + ", " + item.locality,
        detail: parsedLastLoc,
        latitude: item.latitude,
        longitude: item.longitude
      }
      list.push(newelement)

      index++;
    }
  }

  cb(list)
  */

  cb(data.map((item, index) => {
    // console.log("item: ", item);
    // console.log("---Location Item: "+ JSON.stringify(item))
    // if (item.locality) {
    //const address = item.locationName.split(/[-,]+/)
    //locality = `${address[0]}`
    //var date = await new Date((item.addedTime + 'Z').toLocaleString())
    var date = new Date((item.addedTime + 'Z').toLocaleString())
    const hourDiff = moment().diff(moment(item.addedTime + 'Z'), "min")
    var seconds = Math.floor((new Date() - date) / 1000);
    parsedLastLoc = 0 + ' seconds ago'
    if(seconds => 0 && seconds < 60){
      parsedLastLoc = seconds + ' seconds ago'
    }
    interval = seconds / 60;
    if (interval > 1) {
      const secs =  seconds%60 
      const mins = interval < 2? ' minute ': ' minutes '
      parsedLastLoc = Math.floor(interval) +  mins + Math.floor(secs) + ' sec ago'
    }
    interval = seconds / 3600;
    if (interval > 1) {
      const mins = (seconds%3600) / 60;
      const hour = interval < 2? ' hour ': ' hours '
      parsedLastLoc = Math.floor(interval) + hour + Math.floor(mins) + ' min ago';
    }
    interval = seconds / 86400;

     if (interval > 1) {
      parsedLastLoc =  moment(date).format('h:mm a, Do MMM')
    }

    // day , month and years time interval count
    // if (interval > 1) {
    //   const hours = (seconds % 86400) / 3600;
    //   const day = interval < 2? ' day ' :' days '
    //   parsedLastLoc =  Math.floor(interval) + day  + Math.floor(hours) + ' hour'
    // }
    // interval = seconds / 2592000;
    // if (interval > 1) {
    //   const days = (seconds % 2592000) / 86400;
    //   const month = interval < 2? ' month ': ' months '
    //   parsedLastLoc = Math.floor(interval) +  month + Math.floor(days) + ' day';
    // }
    // var interval = seconds / 31536000;
    // if (interval > 1) {
    //   const months =  (seconds % 31536000) / 2592000;
    //   const year = interval < 2? ' year ': ' years '
    //   parsedLastLoc  = Math.floor(interval) +  year + Math.floor(months) + ' month'
    // }
   

    // if (hourDiff<0){
    //   parsedLastLoc = "a few seconds ago";
    // }else{
    //   var timeAgo = hourDiff <= 24 && index < 4 ? moment(date).fromNow() : moment(date).format('h:mm a, Do MMM')
    //   parsedLastLoc = `${item.locality} • ${timeAgo.indexOf() == "in a few seconds" ? "a few seconds ago" : timeAgo}`; 
    // }

    // if (hourDiff <= 24) console.log("hourDiff()", hourDiff);

    // console.log("===> moment(date).fromNow(): "+ moment(date).fromNow())
    // var timeAgo = hourDiff <= 24 && index < 4 ? moment(date).fromNow() : moment(date).format('h:mm a, Do MMM')      
    // parsedLastLoc = `${item.locality} • ${timeAgo.indexOf() == "in a few seconds" ? "a few seconds ago" : timeAgo}`; 
    // parsedLastLoc = `${item.locality} • ${timeAgo == "in a few seconds" ? "a few seconds ago" : timeAgo}`; 
    // parsedLastLoc = item.locality + " • " + timeAgo == "in a few seconds" ? "a few seconds ago" : timeAgo

    return {
      key: index + "_LocationItem",
      name: item.city + ", " + item.locality,
      detail: parsedLastLoc,
      latitude: item.latitude,
      longitude: item.longitude
    }
    // list.push(newelement)
    // index++;
    // }
  }))
}
