import {
  AppConstants,
  StorageUtils,
  watchPaired as checkDevice,
} from "../../../utils";
import { Platform, RefreshControl, ScrollView, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";

import { GeofenceListItem } from "./GeofenceListItem";
import { HeaderBackButton } from "react-navigation-stack";
import { NoDataState,NavigationHeader } from "../../../components";
import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import { api } from "../../../api";
import { theme } from "../../../theme";
import { useFetch } from "../../../hooks";
import { color } from "react-native-reanimated";
import colors from "../../../theme/colors";

export const GeofenceListScreen = (props) => {
  const seniorId = props.navigation.getParam("seniorId", "");

  const { data, error, loading, fetchData } = useFetch(
    `${api.geofenceNew}/${seniorId}/GetAll`
  );
  const [refreshing, setRefreshing] = useState(false);
  const [loadingActive, setLoadingActive] = useState(false);
  const [role, setRole] = useState("senior");
  const [watchPaired, setWatchPaired] = useState(false);

  useEffect(() => {
    getRole();
    // if (Platform.OS === "ios") {
    //   Watch.getIsPaired((err, isPaired) => setWatchPaired(isPaired));
    // }
    checkDevice((data, error) => {
      if (data) {
        setWatchPaired(data.watchPaired);
      }
    });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, [refreshing]);

  const showError = (title) => {
    Snackbar.show({ text, duration: Snackbar.LENGTH_LONG });
  };

  const getRole = async () => {
    const role = await StorageUtils.getValue(AppConstants.SP.ROLE);
    if (role) {
      setRole(role);
    }
    return;
  };

  const onChangeActive = async (value, id) => {
    setLoadingActive(true);
    const {
      title,
      description,
      baseLongitude,
      baseLatitude,
      geofenceLimit,
    } = data.find((element) => element.id === id);

    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    try {
      const response = await fetch(`${api.geofenceNew}/${id}`, {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          title,
          description,
          baseLongitude,
          baseLatitude,
          geofenceLimit,
          isActive: value,
        }),
      });
      if (response) {
        if (response.ok) {
          const json = await response.json();
          if (json) {
            if (json.errors) {
              setLoadingActive(false);
              showError("Error in update geofence");
            } else {
              setLoadingActive(false);
              fetchData();
            }
          }
        } else {
          setLoadingActive(false);
          showError("Error in update geofence");
        }
      }
    } catch (error) {
      setLoadingActive(false);
      showError("Error in update geofence");
    }
  };

  const onSave = () => {
    props.navigation.navigate("GeofenceListScreen", { seniorId: seniorId });
    fetchData();
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.colorPrimary}}>
     <NavigationHeader title='Geofence' leftText={'Back'} navigation={props.navigation} style={{marginTop: Platform.OS === 'ios' ?  40: 25,}} />
    <ScrollView  style={{backgroundColor: 'white'}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >

      <Spinner visible={loadingActive} />
      <View style={{ flex: 1,}}>
        {data ? (
          data.length > 0 ? (
            data.map((item) => (
              <GeofenceListItem
                onChangeActive={onChangeActive}
                fetchData={fetchData}
                onSaveGeofence={onSave}
                // disabled={role === "senior" && !watchPaired}
                {...item}
              />
            ))
          ) : (
            <NoDataState text="No geofence" />
          )
        ) : null}
        {loading ? <NoDataState text="Loading..." /> : null}
        {error || (data && data.errors) ? <NoDataState text="Error" /> : null}
      </View>
    </ScrollView>
    </View>
  );
};

GeofenceListScreen.navigationOptions = ({ navigation }) => {
  const fetchGeofences = navigation.getParam("fetchGeofences", () => {});
  const getSeniorLocations = navigation.getParam(
    "getSeniorLocations",
    () => {}
  );
  return {
    title: "Geofence List",
    headerBackTitle: "",
    headerTintColor: theme.colors.colorPrimary,
    headerTitleStyle: { fontSize: 22 },
    headerLeft: () => (
      <HeaderBackButton
        tintColor={theme.colors.colorPrimary}
        onPress={() => {
          getSeniorLocations();
          fetchGeofences();
          navigation.goBack();
        }}
      />
    ),
  };
};
