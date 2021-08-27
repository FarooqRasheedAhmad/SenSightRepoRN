import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { convertDate, timeConvert } from "../../utils";

import { Button } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { theme } from "../../theme";

const getTime = (date, off = false) => {
  const { hours, minutes, sign } = timeConvert(
    new Date().getTimezoneOffset() / 60
  );

  const offsetDate = `${date && date.replace("Z", "")}${
    off ? sign : sign === "+" ? "-" : "+"
  }${hours}:${minutes}`;

  const { time } = convertDate(offsetDate);

  return { time, offsetDate: new Date(offsetDate) };
};

export const JobShiftTime = ({ title, jobStartTime, jobEndTime, values }) => {
  const date = new Date().toISOString();
  const [startTime, setStartTime] = useState(
    jobStartTime ? jobStartTime : date.substr(0, 10) + "T09:00:00.000Z"
  );
  const [endTime, setEndTime] = useState(
    jobEndTime ? jobEndTime : date.substr(0, 10) + "T17:00:00.000Z"
  );
  const [showStartTimePicker, setStartTimePicker] = useState(false);
  const [showEndTimePicker, setEndTimePicker] = useState(false);
  const [jobTitle, setJobTitle] = useState(title || "");

  useEffect(() => {
    values({ jobTitle, jobStartTime: startTime, jobEndTime: endTime });
  }, [jobTitle, startTime, endTime]);

  const onChange = (setTime, setShow) => (date) => {
    const localDate = getTime(
      date.toISOString(),
      true
    ).offsetDate.toISOString();
    setShow(false);
    setTime(localDate);
  };

  const timeFeild = (title, time, setTime) => (
    <View style={styles.timeFeildView}>
      <Text style={styles.timeTitle}>{title}</Text>
      <Button
        type="clear"
        title={getTime(time).time}
        titleStyle={{
          color: theme.colors.colorPrimary,
          fontWeight: "500",
          fontSize: 22,
        }}
        onPress={() => setTime(true)}
      />
    </View>
  );

  const timePicker = (show, time, setTime, setShow, key) => (
    <DateTimePickerModal
      date={getTime(time).offsetDate}
      isVisible={show}
      mode="time"
      is24Hour
      onConfirm={onChange(setTime, setShow)}
      onCancel={() => setShow(false)}
      key={key}
    />
  );

  return (
    <View>
      <Text style={styles.jobTitle}>Job Title</Text>
      <TextInput
        value={jobTitle}
        placeholder="Enter job title"
        placeholderTextColor="rgba(0,0,0,0.2)"
        style={styles.textInput}
        onChangeText={(text) => setJobTitle(text)}
      />
      <View style={{ margin: 16 }}>
        <Text style={styles.shiftTitle}>Job Shift:</Text>
        {timeFeild("Start Time:", startTime, setStartTimePicker)}
        {timeFeild("End Time:", endTime, setEndTimePicker)}
        {timePicker(
          showStartTimePicker,
          startTime,
          setStartTime,
          setStartTimePicker,
          "key1"
        )}
        {timePicker(
          showEndTimePicker,
          endTime,
          setEndTime,
          setEndTimePicker,
          "key2"
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  jobTitle: {
    fontFamily: theme.fonts.SFProSemibold,
    fontSize: 18,
    marginTop: 12,
    marginLeft: 23,
    color: theme.colors.black,
  },
  textInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.2)",
    color: "black",
    marginLeft: 20,
    height: Platform.OS === "ios" ? 40 : undefined,
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: theme.colors.black,
    ...(Platform.OS === "android" ? { paddingTop: 15, paddingBottom: 15 } : {}),
  },
  timeFeildView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "baseline",
  },
  timeTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.SFProSemibold,
    color: theme.colors.grey_shade_1,
  },
  shiftTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.SFProSemibold,
    marginTop: 8,
  },
});
