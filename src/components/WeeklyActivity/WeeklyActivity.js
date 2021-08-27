import { Button, Divider } from "react-native-elements";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ActivityScoreBarChartCH } from "../ActivityScoreBarChartCH";
import { NoDataState } from "../NoDataState";
import { api } from "../../api";
import { theme } from "../../theme";
import { useFetch } from "../../hooks";

export const WeeklyActivity = (props) => {
  const d = new Date();
  const n = d.getTimezoneOffset() / 60;
  const tOffset = n < 0 ? Math.abs(n) : -n;

  const {
    seniorId,
    refreshCharts,
    role,
    statsDate,
    timeOffset,
    name,
    refreshStats,
  } = props;
  const { data, error, loading, fetchData } = useFetch(
    `${api.baseURL}Seniors/Stats/Covid/RiskScore/LastWeek/${
      seniorId ? `${seniorId}` : ""
    }?statsDate=${statsDate ? statsDate : d.toISOString()}&&offSetHours=${
      timeOffset ? timeOffset : tOffset
    }`
  );

  useEffect(() => {
    refreshCharts(() => {
      fetchData();
    });
    fetchData();
  }, [statsDate, timeOffset]);

  if (error) {
    console.log(error);
    return <NoDataState text="Error in getting Weekly Activity" />;
  }

  if (loading) {
    return <NoDataState text="Loading..." />;
  }

  if (data) {
    if (!data.length) {
      return <NoDataState text="No  Available" />;
    }
    const processedData = [];

    data.forEach((element, index) => {
      processedData.push({
        score: element.covidRiskScore.covidRiskScore,
        color: element.covidRiskScore.covidRiskScoreColor,
        date: element.covidRiskScore.covidTestDate,
        day: index + 1,
      });
    });

    const average = () => {
      let sum = 0;
      let value = 0;
      processedData.map((item) => {
        sum += item.score;
        if (item.score > 0) value++;
      });
      return Math.floor(sum / value > 0 ? value : 1);
    };

    const weeklyAverage = average();
    const lastWeekAverage = "N/A";
    const status =
      weeklyAverage < lastWeekAverage
        ? "trending downwards"
        : weeklyAverage > lastWeekAverage
        ? "trending upwards"
        : "maintained";

    return (
      <View style={styles.root}>
        <Text style={styles.title}>Weekly COVID Risk Trend</Text>
        <View style={styles.descrptionView}>
          {/* <Text style={styles.descriptionText}>
            Over the last 7 days, {role === "senior" ? "your" : name + "'s"}{" "}
            activity score is {status}
          </Text> */}

          <View style={styles.averageView}>
            <View style={styles.average}>
              <Text style={{ color: theme.colors.grey_shade_1 }}>
                Average:{" "}
              </Text>
              <Text style={{ fontWeight: "600", fontSize: 18 }}>
                {weeklyAverage}
              </Text>
            </View>
            <View style={styles.average}>
              <Text style={{ color: theme.colors.grey_shade_1 }}>
                Last Week:{" "}
              </Text>
              <Text>{lastWeekAverage}</Text>
            </View>
          </View>
          <Divider />
        </View>
        <ScrollView horizontal>
          <ActivityScoreBarChartCH
            average={weeklyAverage}
            data={processedData}
            timeOffset={timeOffset ? timeOffset : tOffset}
          />
        </ScrollView>
        {role === "senior" ? (
          <Button
            title="Input Readings for COVID"
            icon={{ name: "edit", color: theme.colors.colorPrimary, size: 26 }}
            type="clear"
            onPress={() =>
              props.navigation.navigate("ManualDataInputScreen", {
                refetch: () => {
                  fetchData();
                  if (refreshStats) {
                    refreshStats();
                  }
                },
              })
            }
            containerStyle={{ alignSelf: "center" }}
            titleStyle={{
              color: theme.colors.colorPrimary,
              fontFamily: theme.fonts.SFProSemibold,
              fontSize: 19,
            }}
          />
        ) : null}
      </View>
    );
  }
  return <View />;
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  title: {
    fontSize: 22,
    fontFamily: theme.fonts.SFProBold,
    color: theme.colors.black,
    marginLeft: 16,
    margin: 8,
  },
  descrptionView: { marginHorizontal: 32, marginVertical: 8 },
  descriptionText: { marginBottom: 8, fontWeight: "600" },
  averageView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
    alignItems: "baseline",
  },
  average: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
});
