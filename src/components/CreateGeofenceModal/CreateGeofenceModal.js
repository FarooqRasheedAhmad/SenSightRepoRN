import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
} from "react-native";
import { AppConstants, StorageUtils } from "../../utils";
import { Header, Icon, Input, Slider } from "react-native-elements";
import MapView, { Circle, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useEffect, useRef, useState } from "react";

import LinearGradient from "react-native-linear-gradient";
import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import { api } from "../../api";
import { icons } from "../../assets";
import { theme } from "../../theme";

export const CreateGeofenceModal = (props) => {
  const {
    id,
    title,
    description,
    seniorId,
    baseLatitude,
    baseLongitude,
    geofenceLimit,
    isActive,
    type,
    onSaveGeofence,
    disabled,
    ...rest
  } = props;
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [geofenceValue, setGeofenceValue] = useState(
    type === "create" ? 100 : geofenceLimit || 100
  );
  const [geofenceTitle, setGeofenceTitle] = useState(
    type === "create" ? "" : title || ""
  );
  const [emptyTitleError, setError] = useState(false);

  const [mapRegion, setMapRegion] = useState({
    latitude: baseLatitude,
    longitude: baseLongitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [keyboardOffset, setKeyboardOffset] = useState(60);
  const onKeyboardShow = (event) =>
    setKeyboardOffset(event.endCoordinates.height);

  const onKeyboardHide = () => setKeyboardOffset(60);
  const keyboardDidShowListener = useRef();
  const keyboardDidHideListener = useRef();

  useEffect(() => {}, [mapRegion]);
  useEffect(() => {}, [type]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      onKeyboardShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      onKeyboardHide
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const showError = (text) => {
    Snackbar.show({ text, duration: Snackbar.LENGTH_LONG });
  };

  const refreshState = () => {
    setGeofenceTitle("");
    setGeofenceValue(100);
    // setMapRegion({});
  };

  const onSave = async () => {
    if (!geofenceTitle) {
      setError(true);
      return;
    }
    setModalVisible(false);
    setLoading(true);
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    try {
      const response = await fetch(
        `${api.geofenceNew}${type !== "create" ? `/${id}` : ""}`,
        {
          method: type === "create" ? "post" : "put",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            title: geofenceTitle,
            description: "",
            baseLongitude: mapRegion.longitude,
            baseLatitude: mapRegion.latitude,
            geofenceLimit: geofenceValue,
            isActive: true,
            ...(type === "create" ? { seniorId } : {}),
          }),
        }
      );
      if (response) {
        setLoading(false);
        if (response.ok) {
          const json = await response.json();
          if (json) {
            if (json.errors) {
              showError("Error in Saving json err Geofence");
              refreshState();
            } else {
              refreshState();
              onSaveGeofence();
            }
          }
        } else {
          refreshState();
          showError("Error in Saving not ok Geofence");
        }
      }
    } catch (error) {
      refreshState();
      setLoading(false);
      showError("Error in Saving catch Geofence");
    }
  };

  return (
    <>
      {/* <Spinner visible={loading} /> */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}
             onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalRoot}>
          <View style={styles.modalView}>
            <Header
              barStyle="dark-content"
              ViewComponent={LinearGradient}
              centerComponent={{
                text: "Create Geofence",
                style: styles.headerTitle,
              }}
              rightComponent={
                <TouchableOpacity onPress={onSave}>
                  <Text style={styles.headerRight}>Save</Text>
                </TouchableOpacity>
              }
              leftComponent={{
                icon: "close",
                color: "#fff",
                onPress: () => setModalVisible(false),
              }}
              linearGradientProps={{
                colors: ["#25BEED", "#0FBDAF"],
                start: { x: 0, y: 0.2 },
                end: { x: 1, y: 0.8 },
              }}
            />
            <View style={styles.sliderRoot}>
              <Slider
                minimumValue={100}
                maximumValue={5000}
                step={100}
                minimumTrackTintColor="#25BEED"
                maximumTrackTintColor={theme.colors.grey_shade_3}
                thumbTintColor="#25BEED"
                value={geofenceValue}
                onValueChange={(value) => {
                  setGeofenceValue(value);
                }}
              />
              <View style={styles.sliderBottomView}>
                <Text style={styles.sliderLeft}>100 m</Text>
                <Text style={styles.sliderCenter}>
                  {geofenceValue > 999
                    ? `${geofenceValue / 1000} km`
                    : `${geofenceValue} m`}
                </Text>
                <Text style={styles.sliderRight}>5 km</Text>
              </View>
            </View>

            <View
              style={{
                ...styles.inputRoot,
                borderColor: emptyTitleError ? "red" : "#25BEED",
                bottom: keyboardOffset,
              }}
            >
              <Input
                placeholder="Enter Geofence Title"
                value={geofenceTitle}
                onChangeText={(value) => setGeofenceTitle(value)}
                errorStyle={styles.inputError}
                errorMessage={
                  emptyTitleError ? "Please enter geofence title!" : undefined
                }
                onEndEditing={() => {
                  if (geofenceTitle === "") setError(true);
                }}
                onFocus={() => setError(false)}
                label="Geofence Title"
                leftIcon={{
                  name: "crosshairs-gps",
                  type: "material-community",
                  color: "grey",
                }}
                leftIconContainerStyle={styles.inputIcon}
              />
            </View>
            <MapView
              // provider={PROVIDER_GOOGLE}
              initialRegion={mapRegion}
              // region={mapRegion}
              onRegionChange={(region) => {
                setMapRegion(region);
              }}
              // onRegionChangeComplete={(region) => setMapRegion(region)}
              style={styles.mapView}
            >
              <Circle
                  center={mapRegion}
                  radius={geofenceValue}
                  strokeWidth={2}
                  strokeColor="#25BEED"
                  fillColor={"rgba(37,190,237,0.25)"}
              />
            </MapView>
              <View pointerEvents="none" style={styles.mapMakerView}>
                <Image
                    pointerEvents="none"
                    source={icons.location_marker}
                    style={styles.markerImage}
                />
              </View>

          </View>
        </View>
      </Modal>

      <TouchableHighlight onPress={() => setModalVisible(true)} underlayColor="rgba(0,0,0, 0.1)" style={{ borderWidth: 0, borderRadius: 50 }}>
        <Icon name="edit" size={18} disabled={disabled || loading} reverse raised color={!disabled ? theme.colors.colorPrimary : "white"} {...rest} />
      </TouchableHighlight>

      {/* <Icon onPress={() => setModalVisible(true)} name="edit" disabled={disabled || loading} raised color={!disabled ? theme.colors.colorPrimary : "white"} {...rest} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "rgba(17,17,17,0.8)",
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
    alignItems: "center",
    position: 'absolute'
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  headerRight: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  sliderRoot: {
    width: "95%",
    backgroundColor: "white",
    opacity: 0.8,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 5,
    position: "absolute",
    marginHorizontal: 8,
    top: 100,
    zIndex: 1,
  },
  sliderBottomView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  sliderLeft: { fontSize: 14, color: theme.colors.grey_shade_1 },
  sliderCenter: { fontSize: 18 },
  sliderRight: { fontSize: 14, color: theme.colors.grey_shade_1 },
  mapView: { height: "90%", width: "100%" },
  mapMakerView: {
    position: "absolute",
    top: 25,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  markerImage: { marginBottom: 0 },
  inputRoot: {
    width: "95%",
    backgroundColor: "white",
    opacity: 0.9,
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 5,
    position: "absolute",
    marginHorizontal: 8,
    zIndex: 1,
  },
  inputIcon: { marginLeft: 0, marginRight: 8 },
  inputError: { color: "red", fontSize: 14 },
});
