import {
  AppConstants,
  StorageUtils,
  convertDate,
  getDayMonthYear,
  getTime,
  timeConvert,
} from "../../utils";
import { Button, Card, Divider, Icon } from "react-native-elements";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory-native";

import PropTypes from "prop-types";
import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import { api } from "../../api";
import { styles } from "./styles";
import { theme } from "../../theme";

const {
  valueRoot,
  valueTitle,
  valueUnit,
  leftRoot,
  leftText,
  modalView,
  card,
  noDataText,
  closeButton,
  noDataRoot,
} = styles;

export const GraphListItem = (props) => {
  const {
    key,
    title,
    item,
    seniorId,
    timeOffset,
    selectedValueType,
    avatar,
    chartTintColor,
    unit,
  } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);

  const onPressItem = async (date) => {
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    const UTCDate = new Date(date);
    const UTCDateString = UTCDate.toISOString().replace("Z", "");
    const p = new Date(`${UTCDateString}+00:00`);
    const stDate = p.toISOString().replace("Z", "");

    setLoading(true);
    let url = "";

    if (title === theme.strings.temperature) {
      url =
        api.fdaStatsTemperatureToday +
        `${seniorId}?uploadDate=${stDate}&OffSetHours=${timeOffset.toString()}`;
    } else if (title === theme.strings.bloodPressure) {
      url =
        api.fdaStatesBloodPressure +
        `${seniorId}?uploadDate=${stDate}&OffSetHours=${timeOffset.toString()}`;
    } else if (title === theme.strings.pulseOximeter) {
      url =
        api.statsOximeterToday +
        `${seniorId}?uploadDate=${stDate}&OffSetHours=${timeOffset.toString()}`;
    } else if (title === theme.strings.glucometer) {
      url =
        api.statsGlucometerToday +
        `${seniorId}?uploadDate=${stDate}&OffSetHours=${timeOffset.toString()}`;
    }

    try {
      const res = await fetch(url, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (res) {
        if (res.ok) {
          const json = await res.json();
          if (json) {
            setModalVisible(true);
            const parseData = [];
            json.forEach((e, i) => {
              const { hours: h, minutes: m, sign: s } = timeConvert(timeOffset);
              const d = e.uploadDate.replace("+00:00", "");
              const { time: dayTime } = convertDate(`${d}${s}${h}:${m}`);
              parseData.push({
                x: dayTime,
                y: e[selectedValueType],
                time: dayTime,
              });
            });
            setLoading(false);
            setChartData(parseData.reverse());
          }
          setLoading(false);
        } else {
          setLoading(false);
          Snackbar.show({
            title: "Error in getting daily data",
            duration: Snackbar.LENGTH_LONG,
          });
        }
      }
    } catch (error) {
      setLoading(false);
      Snackbar.show({
        title: "Error in getting daily data",
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const renderValue = (value, unit) => (
    <View style={{ marginLeft: 12 }}>
      <Text style={valueTitle}>{value}</Text>
      <Text style={valueUnit}>{unit}</Text>
    </View>
  );

  const uploadDate = new Date(item.uploadDate);

  const { hours: h, minutes: m, sign: s } = timeConvert(timeOffset);
  const d = item.uploadDate.replace("+00:00", "");
  const { time, date, day, month } = convertDate(`${d}${s}${h}:${m}`);

  const subTitle = `${Math.floor(item[selectedValueType] * 100) /
    100} ${unit} • Updated ${time}`;

  const renderVictorBar = (chartData) => {
    if (chartData.length === 0) return null;

    if (chartData.length === 1) {
      return (
        <VictoryBar
          data={chartData}
          barWidth={28}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 },
          }}
          style={{
            data: { stroke: "white", fill: chartTintColor, fillOpacity: 0.7 },
          }}
        />
      );
    } else
      return (
        <VictoryBar
          data={chartData}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 },
          }}
          style={{
            data: { stroke: "white", fill: chartTintColor, fillOpacity: 0.7 },
          }}
        />
      );
  };

  return (
    <>
      <Spinner visible={loading} />
      <TouchableOpacity
        key={item.uploadDate}
        onPress={() => onPressItem(item.uploadDate)}
        style={{
          flexDirection: "row",
          height: 76,
          padding: 18,
          paddingBottom: 18,
        }}
      >
        <Image source={avatar} style={{ width: 40, height: 40 }} />
        <View style={{ flex: 1 }}>
          {renderValue(getDayMonthYear(uploadDate), subTitle)}
        </View>
      </TouchableOpacity>
      <Divider style={{ marginLeft: 80 }} />

      <Modal
        animated
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={modalView}>
          <Card
            titleStyle={{ color: chartTintColor }}
            title={`${title} (${date})`}
            containerStyle={card}
          >
            {chartData.length === 0 ? (
              <View style={noDataRoot}>
                <Icon
                  name="emoticon-sad-outline"
                  type="material-community"
                  size={50}
                  color={chartTintColor}
                />
                <Text style={noDataText}>No Data!</Text>
              </View>
            ) : (
              <VictoryChart
                height={250}
                // adding the material theme provided with Victory
                domainPadding={20}
                containerComponent={
                  <VictoryVoronoiContainer
                    labels={({ datum }) =>
                      `${Math.floor(datum.y * 100) / 100} ${unit}
                          \n${datum.time}`
                    }
                    labelComponent={
                      <VictoryTooltip
                        constrainToVisibleArea
                        cornerRadius={10}
                        pointerLength={10}
                        pointerWidth={20}
                        flyoutStyle={{
                          stroke: "none",
                          fill: "rgba(0, 0, 0, 0.6)",
                        }}
                        style={[{ fontSize: 20, stroke: "#ffffff" }]}
                      />
                    }
                  />
                }
              >
                <VictoryAxis
                  fixLabelOverlap={true}
                  style={{
                    axis: { stroke: chartTintColor },
                    tickLabels: {
                      fontSize: 12,
                      padding: 15,
                      stroke: chartTintColor,
                      fill: chartTintColor,
                      angle: -25,
                    },
                  }}
                />
                <VictoryAxis
                  style={{
                    axis: { stroke: "none" },
                    tickLabels: {
                      fontSize: 10,
                      padding: 15,
                      stroke: chartTintColor,
                      fill: chartTintColor,
                    },
                    grid: { stroke: chartTintColor, strokeWidth: 1 },
                  }}
                  dependentAxis
                  domain={[60, 100]}
                />
                {renderVictorBar(chartData)}
              </VictoryChart>
            )}
            <Button
              onPress={() => setModalVisible(!modalVisible)}
              title="Close"
              type="outline"
              titleStyle={{
                color: chartTintColor,
              }}
              raised
              buttonStyle={{
                ...closeButton,
                borderColor: chartTintColor,
              }}
            />
          </Card>
        </View>
      </Modal>
    </>
  );
};

GraphListItem.propTypes = {
  chartTintColor: PropTypes.string,
};

GraphListItem.defaultProps = {
  chartTintColor: "#000",
};
