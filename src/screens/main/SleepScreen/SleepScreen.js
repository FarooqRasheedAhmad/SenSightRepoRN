import {
  Info,
  NoDataState,
  StatisticsChart,
  StatsDetailItem,
} from "../../../components";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";

import { ButtonGroup } from "react-native-elements";
import Snackbar from "react-native-snackbar";
import { api } from "../../../api";
import { getLocalDate } from "../../../utils";
import { theme } from "../../../theme";
import { useFetch } from "../../../hooks";

export const SleepScreen = (props) => {
  const title = props.navigation.getParam("title", "Sleep");
  const seniorId = props.navigation.getParam("seniorId", null);
  const subHeading = props.navigation.getParam("subHeading", "DAILY AVERAGE");
  const unit = props.navigation.getParam("unit", "");
  const average = props.navigation.getParam("average", undefined);
  const lastValue = props.navigation.getParam("lastValue", undefined);
  const lastValueDate = props.navigation.getParam("lastValueDate", undefined);
  const gradiantColors = props.navigation.getParam("gradiantColors", "");
  const headerColor = props.navigation.getParam(
    "headerColor",
    theme.colors.colorPrimary
  );
  const screenType = props.navigation.getParam("screenType", "");

  const [timeOffsetState, setTimeOffset] = useState("");
  const [statsDateState, setStatsDate] = useState("");
  //const [heartRateType, setHeartRateType] = useState(0);

  const { timeOffset, dateString } = getLocalDate();
  const options = ["FitBit", "BioStrap"];

  //Change API
  const url = `${
    screenType === "covid" || heartRateType ? api.covidStats : api.healthStats
  }/${seniorId}/Last30Days?statsDate=${
    statsDateState ? statsDateState : dateString
  }&&offSetHours=${timeOffsetState ? timeOffsetState : timeOffset.toString()}`;

  const { data, error, loading, fetchData } = useFetch(url);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [statsDateState, timeOffsetState]);

  useEffect(() => {
    if (Platform.OS !== "ios") {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor("transparent");
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTimeOffset();
    fetchData().then(() => setRefreshing(false));
  }, [refreshing]);

  const getTimeOffset = () => {
    const { timeOffset, dateString } = getLocalDate();
    setTimeOffset(timeOffset.toString());
    setStatsDate(dateString);
  };

  const renderList = (list) => {
    return list.length > 0 ? (
      <>
        <Text style={styles.heading}>{subHeading}</Text>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.listRoot}>
            {list.map((item, index) => {
              return (
                <StatsDetailItem
                  key={index}
                  title={title}
                  item={item}
                  seniorId={seniorId}
                  timeOffset={timeOffset}
                  type={screenType ? "covid" : ""}
                  tintColor={headerColor}
                  unit={unit}
                />
              );
            })}
          </View>
        </ScrollView>
      </>
    ) : (
      <NoDataState text="No Item" />
    );
  };

  if (error) {
    Snackbar.show({
      text: "Error in getting statistics",
      duration: Snackbar.LENGTH_LONG,
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <StatisticsChart
        title={title}
        unit={unit}
        monthData={data || []}
        gradiantColors={gradiantColors}
        timeOffset={timeOffsetState ? timeOffsetState : timeOffset.toString()}
        type={screenType || heartRateType ? "covid" : ""}
        average={average}
        valueIndex={heartRateType}
        lastValue={lastValue}
        lastValueDate={lastValueDate}
      />
      {title === "Sleep" ? (
        <ButtonGroup
          onPress={(type) => setHeartRateType(type)}
          selectedIndex={heartRateType}
          buttons={options}
          containerStyle={{ borderWidth: 0 }}
          buttonStyle={{ backgroundColor: "transparent" }}
          textStyle={styles.buttonGroupText}
          selectedButtonStyle={styles.selectedButton}
          selectedTextStyle={styles.selectedButtonText}
        />
      ) : null}
      {loading ? <NoDataState text="Loading..." /> : renderList(data || [])}
    </View>
  );
};

SleepScreen.navigationOptions = ({ navigation }) => {
  const title = navigation.getParam("title", "Statistics");
  const headerColor = navigation.getParam(
    "headerColor",
    theme.colors.colorPrimary
  );
  const infoType = navigation.getParam("infoType", "");

  return {
    title: title,
    headerBackTitle: "",
    headerTintColor: "white",
    headerTitleStyle: { fontSize: 17 },
    headerStyle: {
      backgroundColor: theme.colors.colorPrimary,
      shadowRadius: 0,
      shadowOffset: { height: 0 },
    },
    headerRight: () => (
      <Info type={infoType} color="white" containerStyle={{ marginRight: 8 }} />
    ),
  };
};

const styles = StyleSheet.create({
  listRoot: {
    flex: 1,
  },
  valueRoot: { flexDirection: "row", alignItems: "baseline" },
  valueTitle: { fontSize: 20, marginHorizontal: 8 },
  valueUnit: { color: theme.colors.grey_shade_1 },
  leftRoot: {
    borderRadius: 50,
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  leftText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    padding: 8,
  },
  week: { width: "100%", fontSize: 20, color: "white" },
  heading: {
    width: "100%",
    color: "grey",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
  },
  buttonGroupText: {
    fontSize: 14,
    color: theme.colors.grey_shade_1,
    fontFamily: theme.fonts.SFProBold,
  },
  selectedButton: {
    backgroundColor: "transparent",
    borderBottomColor: "#F7B42C",
    borderBottomWidth: 1,
  },
  selectedButtonText: {
    color: "#F7B42C",
    fontFamily: theme.fonts.SFProBold,
  },
});
