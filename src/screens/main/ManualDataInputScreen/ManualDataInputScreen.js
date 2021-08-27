import {
  AppConstants,
  StorageUtils,
  getLocalDate,
  showMessage,
  timeConvert,
} from "../../../utils";
import { Button, ListItem } from "react-native-elements";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

import BLE from "./BluetoothModule";
import { HeaderBackButton } from "react-navigation-stack";
import RNPickerSelect from "react-native-picker-select";
import { TempratureUnit } from "../../../components";
import { api } from "../../../api";
import { theme } from "../../../theme";

export const ManualDataInputScreen = (props) => {
  const [temperature, setTemperature] = useState("");
  const [oxygen, setOxygen] = useState("");
  // const [temperatureError, setTemperatureError] = useState(false);
  // const [oxygenError, setOxygenError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [statusList, setStatusList] = useState([
    {
      title: "Working As Normal",
      checked: true,
    },
    {
      title: "Isolated",
      checked: false,
    },
    {
      title: "Awaiting Test Result",
      checked: false,
    },
    {
      title: "Tested Positive",
      checked: false,
    },
    {
      title: "Tested Negative",
      checked: false,
    },
  ]);

  const convertToCelcius = (val) => ((val - 32) * 5) / 9;
  // const convertToFahrenheit = (val) => (val * 9) / 5 + 32;

  const ox = [];
  const temp = [];

  const getPickerValues = () => {
    for (let i = 100; i >= 50; i--) {
      ox.push({ label: i.toString(), value: i });
    }
    for (let i = 35; i <= 45; i = i + 0.5) {
      temp.push({ label: i.toString(), value: i });
    }
  };

  getPickerValues();

  const [tempratureList, setTempratureList] = useState(temp);

  const tempRef = useRef();
  const oxRef = useRef();

  useEffect(() => {
    fetchData();
    if (Platform.OS !== "ios") {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor("transparent");
    }
  }, []);

  const fetchData = async () => {
    const { timeOffset, dateString } = getLocalDate();
    const url = `${
      api.baseURL
    }Seniors/SeniorHRV/LastScore?todayDate=${dateString}&offSetHours=${timeOffset}`;
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
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
        const json = await res.json();
        if (json) {
          onSelect(statusList[json.hrvStatus], json.hrvStatus);
        } else showMessage("Error in getting previous value");
      }
    } catch (error) {
      showMessage("Error in getting previous value");
    }
  };

  const getTimeOffset = () => {
    const date = new Date();
    const offset = date.getTimezoneOffset() / 60;
    const offsetHours = offset < 0 ? Math.abs(offset) : -offset;
    const { hours, minutes, sign } = timeConvert(offsetHours);
    const dateISO = date.toISOString().replace("Z", "");
    const nDate = `${dateISO}${sign === "+" ? "-" : "+"}${hours}:${minutes}`;
    const localDate = new Date(nDate);

    return {
      offsetHours: offsetHours.toString(),
      clientSideDate: localDate.toISOString(),
    };
  };

  const onSelect = (item, index) => {
    if (item.checked) return;
    else {
      const list = [];
      statusList.forEach((e, i) => {
        list.push({ ...e, checked: index === i });
      });
      setStatusList(list);
    }
  };

  const updateValuesAndSave = () => {
    if (Platform.OS === "ios") {
      showMessage("iOS implementation is under process");
      return;
    }
    // if (!temperature && !oxygen) {
    //   setTemperatureError(true);
    //   setOxygenError(true);
    //   return;
    // }
    // if (!temperature) {
    //   setTemperatureError(true);
    //   // if (tempRef) tempRef.current.shake();
    //   return;
    // }
    // if (!oxygen) {
    //   setOxygenError(true);
    //   // if (oxRef) oxRef.current.shake();
    //   return;
    // }

    BLE.scanForHeartRate()
      .then((response) => {
        const heartRateAndVariation = response.split(";");
        if (heartRateAndVariation && heartRateAndVariation.length == 2) {
          onSave(heartRateAndVariation[0], heartRateAndVariation[1]);
        }
      })
      .catch((e) => {
        showMessage(e.message);
      });
  };

  const onSave = async (heartRate, hrv) => {
    const { offsetHours, clientSideDate } = getTimeOffset();
    const hrvStatus = statusList.findIndex((e) => e.checked);

    const body = {
      ...(temperature ? { temperature: parseFloat(temperature) } : {}),
      ...(oxygen ? { oxygen: parseFloat(oxygen) } : {}),
      hrv: parseFloat(hrv),
      heartRate: parseInt(heartRate),
      hrvStatus,
      offsetHours,
      clientSideDate,
    };

    setLoading(true);
    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    const url = `${api.baseURL}Seniors/SeniorHRv`;
    fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.errors) {
          showMessage("Error in saving data");
        } else {
          const urlForHRV = `${api.baseURL}Seniors/SeniorHRVData`;
          BLE.setLatestIdAndAuth(urlForHRV, data.id, token);
          showMessage("HRV data saved successfully");
        }
      })
      .catch((error) => {
        setLoading(false);
        showMessage("Error in saving data");
      });
  };

  const onChangeUnit = (unit) => {
    if (unit === "F") {
      let list = [];
      for (let i = 90; i <= 105; i = i + 0.5) {
        list.push({
          label: i.toString(),
          value: convertToCelcius(i).toFixed(2),
        });
      }
      setTempratureList(list);
    } else {
      setTempratureList(temp);
    }
  };

  const getPickerComponent = (
    value,
    // valueError,
    placeholder,
    setValue,
    // setValueError,
    // ref,
    items
  ) => {
    return (
      <View style={styles.pickerRoot}>
        <RNPickerSelect
          value={value}
          placeholder={{ label: placeholder, value: "" }}
          onValueChange={(val) => {
            // console.log(value);
            // if (value) {
            //   setValueError(false);
            // } else {
            //   setValueError(true);
            // }
            setValue(val);
          }}
          items={items}
          style={{ borderWidth: 1 }}
        />
        {/* <Text style={{ color: "red", fontSize: 13 }}>
          {valueError ? "Please enter " + placeholder : ""}
        </Text> */}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView>
        <Text style={styles.title}>Input Fields</Text>
        <Text style={styles.description}>
          {theme.strings.manualDataInputDescription}
        </Text>
        <TempratureUnit onChange={onChangeUnit} />
        <View style={styles.inputView}>
          {getPickerComponent(
            temperature,
            "Temperature",
            setTemperature,
            tempratureList
          )}
          {getPickerComponent(oxygen, "O2 Saturation (%)", setOxygen, ox)}
        </View>
        <Text style={styles.title}>Current Status</Text>

        {statusList.map((item, index) => {
          return (
            <ListItem
              title={item.title}
              bottomDivider
              rightIcon={{
                name: item.checked ? "check-circle" : "circle-outline",
                type: "material-community",
                color: theme.colors.colorPrimary,
                size: 28,
              }}
              containerStyle={{ backgroundColor: "transparent" }}
              titleStyle={styles.listTitle}
              onPress={() => onSelect(item, index)}
              underlayColor={theme.colors.grey_shade_3}
            />
          );
        })}

        <Button
          title="Save Data"
          titleStyle={{ fontFamily: theme.fonts.SFProSemibold }}
          buttonStyle={styles.button}
          containerStyle={{ marginVertical: 16 }}
          onPress={updateValuesAndSave}
          loading={loading}
          disabled={loading}
          loadingProps={{ color: theme.colors.colorPrimary }}
        />
      </ScrollView>
    </View>
  );
};

ManualDataInputScreen.navigationOptions = ({ navigation }) => ({
  title: "Start Screening",
  headerTintColor: "white",
  headerTitleStyle: { fontSize: 18 },
  headerStyle: { backgroundColor: theme.colors.colorPrimary },
  headerBackTitle: "",
  headerLeft: (
    <HeaderBackButton
      tintColor="white"
      onPress={() => {
        navigation.getParam("refetch", () => {})();
        navigation.goBack();
      }}
    />
  ),
});

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, backgroundColor: "white" },
  title: {
    fontSize: 22,
    fontFamily: theme.fonts.SFProBold,
  },
  description: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 14,
    color: theme.colors.grey_shade_1,
    paddingVertical: 8,
  },
  inputView: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 48,
    marginTop: 8,
    marginBottom: 20,
  },

  tempInput: {
    backgroundColor: theme.colors.grey_shade_3,
    borderRadius: 8,
    width: "48%",
    padding: 8,
  },
  oxygenInput: {
    backgroundColor: theme.colors.grey_shade_3,
    borderRadius: 8,
    width: "48%",
    padding: 8,
  },
  listTitle: {
    fontFamily: theme.fonts.SFProRegular,
    marginLeft: -14,
  },
  button: {
    backgroundColor: theme.colors.colorPrimary,
    borderRadius: 8,
    height: 48,
  },
  pickerRoot: {
    width: "45%",
    height: 48,
    borderColor: theme.colors.grey_shade_1,
    borderWidth: 1,
    margin: 8,
    borderRadius: 8,
    justifyContent: "center",
    paddingLeft: 8,
  },
});
