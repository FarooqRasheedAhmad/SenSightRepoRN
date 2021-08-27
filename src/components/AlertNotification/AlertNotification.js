import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import moment from "moment";
import { convertDate } from "../../utils";
import { icons } from "../../assets";
import { styles } from "./styles";
import { getTOffset } from '../../utils/Utils';

export const AlertNotification = (props) => {
  // const { time: UTCTime } = props;
  // const { time, date, dayName, day } = convertDate(UTCTime)
  // const dateTime = moment(new Date(UTCTime)).format('ddd, Do MMM, h:mm a');

  const alertTime = getTOffset(props.time);

  return (
    <>
      <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={props.onPress} >
        <View style={{ flex: 0.1, paddingBottom: 8, paddingTop: 8, paddingRight: 8, }}>
          <Image source={props.checked ? icons.checked_icon : icons.unchecked} />
        </View>

        <View style={{ borderBottomWidth: 0.5, borderBottomColor: "rgba(0, 0, 0, 0.2)", flex: 0.9, paddingBottom: 8, paddingTop: 8, }} >
          <Text style={styles.alertMainText}>{props.message}</Text>
          {/* <Text style={styles.alertSubText}>{`${dateTime}`}</Text> */}
          <Text style={styles.alertSubText}>{alertTime.offsetTime.format('ddd, Do MMM,h:mm a')}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};
