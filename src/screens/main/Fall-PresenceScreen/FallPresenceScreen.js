import { Icon, ListItem } from "react-native-elements";
import { Info, NoDataState, StatsDetailItem } from "../../../components";
import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory-native";
import { convertDate, timeConvert } from "../../../utils";

import LinearGradient from "react-native-linear-gradient";
import Snackbar from "react-native-snackbar";
import { api } from "../../../api";
import { theme } from "../../../theme";
import { useFetch } from "../../../hooks";



export const FallPresenceScreen = (props) => {
  const d = new Date();
  const n = d.getTimezoneOffset() / 60;
  const timeOffset = n < 0 ? Math.abs(n) : -n;
  const { hours, minutes, sign } = timeConvert(timeOffset);
  const p = d.toISOString().replace("Z", "");
  const nDate = `${p}${sign === "+" ? "-" : "+"}${hours}:${minutes}`;
  const t = new Date(nDate);

  const title = props.navigation.getParam("title", "Statistics");
  const seniorId = props.navigation.getParam("seniorId", null);

  const [timeOffsetState, setTimeOffset] = useState("");
  const [statsDateState, setStatsDate] = useState("");

  //Change API URL
  const url = `${api.covidStats}/${seniorId}/Last30Days?statsDate=${
    statsDateState ? statsDateState : t.toISOString()
  }&&offSetHours=${timeOffsetState ? timeOffsetState : timeOffset.toString()}`;

  const { data, error, loading, fetchData } = useFetch(url);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [statsDateState, timeOffsetState]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTimeOffset();
    fetchData().then(() => setRefreshing(false));
  }, [refreshing]);


  const getTimeOffset = () => {
    const d = new Date();
    const n = d.getTimezoneOffset() / 60;
    const timeOffset = n < 0 ? Math.abs(n) : -n;
    const { hours, minutes, sign } = timeConvert(timeOffset);
    const p = d.toISOString().replace("Z", "");
    const nDate = `${p}${sign === "+" ? "-" : "+"}${hours}:${minutes}`;
    const t = new Date(nDate);

    setTimeOffset(timeOffset.toString());
    setStatsDate(t.toISOString());
  };

  const renderList = (list) => {
    return list.length > 0 ? (
      <>
        <Text style={styles.heading}>HISTORY</Text>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.listRoot}>
            {list.map((item, index) => {
              const hrvDate = item.hRvTestDate.replace("Z", "");
              const { hours, minutes, sign } = timeConvert(timeOffset);
              const { time, date, dayName } = convertDate(
                `${hrvDate}${sign}${hours}:${minutes}`
              );
              console.log(item.hRvTestDate);
              return (
                <StatsDetailItem
                  key={index}
                  title="sleep"
                  item={item}
                  seniorId={seniorId}
                  timeOffset={timeOffset}
                />
                // <ListItem
                //   key={index}
                //   title={item.hrv}
                //   rightTitle={time}
                //   rightSubtitle={date}
                //   rightSubtitleStyle={{ fontSize: 12 }}
                //   leftElement={
                //     <View
                //       style={{
                //         ...styles.leftRoot,
                //         backgroundColor: "#0152A9",
                //       }}
                //     >
                //       <Text style={styles.leftText}>{dayName}</Text>
                //     </View>
                //   }
                //   onLongPress={() => onPressItem(item.covidTestDate)}
                // />
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

  // const weekData = [];
  // if (data) {
  //   console.log(data);
  //   data.forEach((e) => {
  //     const { hours, minutes, sign } = timeConvert(
  //       timeOffsetState ? timeOffsetState : timeOffset.toString()
  //     );
  //     const { date } = convertDate(
  //       e.hRvTestDate + sign + hours + ":" + minutes
  //     );

  //     // const { date } = convertDate(e.hRvTestDate);
  //     weekData.push({
  //       x: e.hRvTestDate,
  //       y: e.hrv,
  //       day: date.substr(0, 6),
  //     });
  //   });
  // }

  return (
    <View style={{ flex: 1 }}>
      {/** gradiant would be 0152A9 007AFF */}
      <LinearGradient colors={["#0152A9", "#007AFF"]}>
        <VictoryChart
          style={{ parent: { paddingLeft: 8 } }}
          containerComponent={
            <VictoryVoronoiContainer
              labels={({ datum }) => `${Math.floor(datum.y)}\n${datum.day}`}
              responsives
              labelComponent={
                <VictoryTooltip
                  cornerRadius={10}
                  center={{ x: 205, y: 50 }}
                  pointerLength={10}
                  pointerWidth={20}
                  flyoutStyle={{ stroke: "none", fill: "rgba(0, 0, 0, 0.6)" }}
                  style={[{ fontSize: 20 }]}
                />
              }
            />
          }
        >
          {data.length > 0 ? (
            <VictoryBar
              style={{
                data: {
                  stroke: "none",
                  strokeWidth: 4,
                  fill: "white",
                  fillOpacity: 0.5,
                },
                labels: { fill: "white", fontSize: 20 },
              }}
              data={data}
              barWidth={20}
              animate={{
                duration: 1000,
                onLoad: { duration: 500 },
              }}
            />
          ) : null}

          <VictoryAxis
            style={{
              axis: { stroke: "none" },
              axisLabel: { fontSize: 16, fill: "white", paddingLeft: 20 },
              tickLabels: {
                angle: -25,
                fill: "white",
                fontWeight: "bold",
                fontSize: 16,
              },
            }}
            tickFormat={(t) =>
              t > 999 ? `${t.toFixed(0) / 1000}k` : t.toFixed(0)
            }
            dependentAxis
            // label="Heart Rate Variability"
            // axisLabelComponent={<VictoryLabel dy={-16} />}
            offsetX={35}
          />
          <VictoryAxis
            style={{
              axis: { stroke: "none" },
              axisLabel: { fontSize: 16, fill: "white", paddingLeft: 20 },
              tickLabels: {
                // angle: -25,
                fill: "white",
                fontSize: 14,
              },
            }}
            tickFormat={(t) => {
              if (typeof t === "string") {
                const { sign: s, hours: h, minutes: m } = timeConvert(
                  timeOffset
                );
                const nt = t.replace("Z", "");
                const { time } = convertDate(`${nt}${s}${h}:${m}`);
                return time;
              } else {
                return "";
              }
            }}
            axisLabelComponent={<VictoryLabel dy={-16} />}
            offsetX={55}
          />
        </VictoryChart>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: -16,
            marginBottom: 8,
            alignItems: "center",
          }}
        >
          <Icon
            type={"font-awesome"}
            name={"fall"}
            color="white"
            size={24}
          />
          <Text
            style={{
              color: "white",
              marginLeft: 4,
              fontSize: 18,
              fontWeight: "500",
            }}
          >
            Fall Presence History
          </Text>
        </View>
      </LinearGradient>
      {loading ? <NoDataState text="Loading..." /> : renderList(data || [])}
    </View>
  );
};

FallPresenceScreen.navigationOptions = ({ navigation }) => {
  const title = navigation.getParam("title", "Statistics");
  return {
    title: title,
    headerBackTitle: "",
    headerTintColor: "white",
    headerTitleStyle: { fontSize: 22 },
    headerStyle: {
      backgroundColor: "#0152A9",
      shadowRadius: 0,
      shadowOffset: { height: 0 },
    },
    headerRight: () => (
      <Info
        type={"sleep"}
        color="white"
        containerStyle={{ marginRight: 8 }}
      />
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
});
