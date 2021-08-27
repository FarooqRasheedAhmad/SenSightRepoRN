import { Circle, Marker } from "react-native-maps";
import React, { useEffect, useRef } from "react";

export const GeofenceMarker = ({ marker, identifier, index }) => {
  let geofenceListCircle = useRef();

  if (geofenceListCircle.current) {
    geofenceListCircle.current.setNativeProps({ fillColor: "rgba(37,190,237,0.25)", });
  }

  useEffect(() => {
    if (geofenceListCircle.current) {
      geofenceListCircle.current.setNativeProps({ fillColor: "rgba(37,190,237,0.25)", });
    }
  });

  return (
    <>
      <Marker
        coordinate={{
          longitude: marker.baseLongitude,
          latitude: marker.baseLatitude,
        }}
        identifier={identifier}
        pinColor="#25BEED"
        // ref={geofenceMarkerRef[index]}
      />
      {/* {Platform.OS === 'ios' ? <Callout tooltip style={styles.callout}>
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.description}>
            {timeAgo}
          </Text>
        </Callout> : null} */}

      {marker.geofenceLimit ? (
        <Circle
          ref={geofenceListCircle}
          center={{
            longitude: marker.baseLongitude,
            latitude: marker.baseLatitude,
          }}
          radius={parseInt(marker.geofenceLimit)}
          strokeWidth={2}
          strokeColor="#25BEED"
          fillColor={"rgba(37,190,237,0.25)"}
        />
      ) : null}
    </>
  );
};
