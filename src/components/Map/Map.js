import { AppConstants, StorageUtils, watchPaired as checkDevice, distanceBetweenCoordinates, distanceBetweenMultipleCoordinates,
  get4PointsAroundCircumference, getGeoCodePosition,
} from "../../utils";
// import { Dialog } from "../Dialog";
import { CreateGeofenceModal } from "../CreateGeofenceModal";
// import { NoDataState } from "../NoDataState";
import { Row, Col } from '../Grid';
import { Image, Platform, Text, View, TouchableHighlight } from "react-native";
import MapView, { Callout, Circle, Marker, PROVIDER_GOOGLE, } from "react-native-maps";
import React, { useEffect, useRef, useState } from "react";
import { GeofenceMarker } from "./GeofenceMarker";
import { Icon } from "react-native-elements";
import Snackbar from "react-native-snackbar";
// import Spinner from "react-native-loading-spinner-overlay";
import { api } from "../../api";
import { styles } from "./styles";
import { theme } from "../../theme";

export const Map = (props) => {
  const { coords, baseCoords, geofence, seniorId, previousLocationPointer, unpinPreviousLocations, getSeniorLocations, } = props;
  // const { loading, error, data, fetchData } = useFetch(
  //   `${api.geofenceNew}/${seniorId}`
  // );

  const [markers, setMarkers] = useState(previousLocationPointer);
  const [geofenceMarkers, setGeofenceMarkers] = useState([]);
  const [loadingPost, setLoadingPost] = useState(false);
  const [watchPaired, setWatchPaired] = useState(false);
  const [role, setRole] = useState("senior");

  let map = useRef();
  let circle = useRef();
  let prevLocation = useRef();

  if (circle.current) {
    circle.current.setNativeProps({ fillColor: "rgba(37,190,237,0.25)" });
  }

  useEffect(() => {
    setMarkers(previousLocationPointer);
    console.log("Markers ap previous location component: ", markers);
    getRole();
  }, [previousLocationPointer]);

  useEffect(() => {
    fitToMap();
    console.log("Markers In Map component: ", markers);
    if (prevLocation.current) {
      prevLocation.current.showCallout();
    }
  }, [markers]);

  useEffect(() => {
    fetchGeofences();
    // if (Platform.OS === "ios") {
    //   Watch.getIsPaired((err, isPaired) => setWatchPaired(isPaired));
    // }
    checkDevice((data, error) => {
      if (data) {
        setWatchPaired(data.watchPaired);
      }
    });
  }, []);

  useEffect(() => {
    fitToMap();
    console.log("Markers In Map component: ", markers);
  }, [geofenceMarkers]);

  const fitToMap = () => {
    const { distance, circleLimit } = distanceBetweenMultipleCoordinates([
      { baseLatitude: coords.latitude, baseLongitude: coords.longitude },
      ...geofenceMarkers,
    ]);

    const circ = (circleLimit + 300) / 1000;

    if (geofenceMarkers.length && distance < 5) {
      const points = get4PointsAroundCircumference(
        coords.latitude,
        coords.longitude,
        distance > circ ? distance + 0.3 : circ
      );
      map.current.fitToCoordinates(points, {
        animated: true,
      });
    } else {
      const markerIdentifiers = ["mk1"];
      markers.forEach((_marker, index) =>
        markerIdentifiers.push("mk" + (index + 2).toString())
      );
      geofenceMarkers.forEach((_marker, index) =>
        markerIdentifiers.push("gm" + (index + 1).toString())
      );
      if (markers.length > 0 || geofenceMarkers.length > 0) {
        map.current.fitToSuppliedMarkers(markerIdentifiers, {
          edgePadding: { top: 70, bottom: 70, left: 70, right: 70 },
          animated: true,
        });
      }
    }
  };

  const fetchGeofences = async () => {
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    try {
      const res = await fetch(`${api.geofenceNew}/${seniorId}`, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (res) {
        const json = await res.json();
        if (json) {
          setGeofenceMarkers(json);
          fitToMap();
        }
      }
    } catch (error) {
      Snackbar.show({
        title: "Error in getting geofences",
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const getRole = async () => {
    const role = await StorageUtils.getValue(AppConstants.SP.ROLE);
    if (role) {
      setRole(role);
    }
    return;
  };

  const prevLocMarker = (marker, index) => {
    const { longitude, latitude, color, title, timeAgo, key } = marker;
    return latitude && longitude ? (
      <Marker
        coordinate={{
          longitude,
          latitude,
        }}
        identifier={`mk${index + 2}`}
        pinColor={color}
        title={title}
        description={timeAgo}
        ref={prevLocation}
        tracksViewChanges
        tracksInfoWindowChanges
      />
    ) : null;
  };

  const region = {
    ...coords,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  };

  const onCenterPress = args => {
    // console.log("map: ", map);
    
    map.current.animateToRegion(region);
    // map.current.animateToCoordinate	(region);
    // map.current.setMapBoundaries	(region);
    // unpinPreviousLocations();
    // console.log(props)
  }

  return (
    <View>
      <Row style={{ borderWidth: 0, position: "absolute", bottom: 10, paddingHorizontal:10, zIndex: 1}}>
        <Col flex="50%">
          <CreateGeofenceModal
            reverse
            baseLatitude={coords.latitude}
            baseLongitude={coords.longitude}
            type="create"
            seniorId={seniorId}
            onSaveGeofence={fetchGeofences}
            // disabled={role === "senior" && !watchPaired}
          />

          <TouchableHighlight onPress={() => props.navigation.navigate("GeofenceListScreen", { seniorId: seniorId, fetchGeofences, getSeniorLocations, })} underlayColor="rgba(0,0,0, 0.1)" style={{ borderWidth: 0, borderRadius: 50 }}>
            <Icon name="menu" size={18} color={theme.colors.colorPrimary} reverse raised />
          </TouchableHighlight>
        </Col>
        <Col flex="auto" align="flex-end"><View style={{ display:"flex", flexDirection: "column" }}>
            <TouchableHighlight onPress={() => { getSeniorLocations(); fetchGeofences(); unpinPreviousLocations(); }} underlayColor="rgba(0,0,0, 0.1)" style={{ borderWidth: 0, borderRadius: 50 }}>
              <Icon name="refresh" size={18} color={theme.colors.colorPrimary} reverse raised />
            </TouchableHighlight>

          <TouchableHighlight onPress={onCenterPress} underlayColor="rgba(0,0,0, 0.1)" style={{ borderWidth: 0, borderRadius: 50 }}>
              <Icon name="crosshairs" type="font-awesome" size={18} color={theme.colors.colorPrimary} reverse raised />
            </TouchableHighlight>
        </View></Col>
      </Row>

      <MapView
        initialRegion={region}
        style={styles.map}
        zoomEnabled
        provider={PROVIDER_GOOGLE}
        region={region}
        ref={map}
        onUserLocationChange={(val) => console.log("onUserLocationChange(): ", val)}
        // onMapReady={() => {
        //   map.current.fitToSuppliedMarkers(["mk1", "mk2", "mk3"]);
        // }}
      >
        <Marker coordinate={coords} identifier="mk1" />

        {markers.length > 0 ? markers.map((marker, index) => prevLocMarker(marker, index)) : null}

        {geofenceMarkers.length > 0
          ? geofenceMarkers.map((marker, index) => (
              <GeofenceMarker marker={marker} index={index} identifier={"gm" + (index + 1).toString()} />
            ))
          : null}
        <Circle ref={circle} center={baseCoords} radius={geofence} strokeWidth={2} strokeColor="#25BEED" fillColor={"rgba(37,190,237,0.25)"} />
      </MapView>
    </View>
  );
};
