export const distanceBetweenCoordinates = (lat1, lon1, lat2, lon2, unit) => {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
};

export const distanceBetweenMultipleCoordinates = (list) => {
  var distance = 0;
  var circleLimit = 0;
  list.forEach((item, index) => {
    if (index > 0) {
      const dist = distanceBetweenCoordinates(
        list[0].baseLatitude,
        list[0].baseLongitude,
        item.baseLatitude,
        item.baseLongitude,
        "K"
      );
      if (dist > distance) {
        distance = dist;
      }
      if (parseInt(item.geofenceLimit) > circleLimit) {
        circleLimit = parseInt(item.geofenceLimit);
      }
    }
  });
  return { distance, circleLimit };
};
