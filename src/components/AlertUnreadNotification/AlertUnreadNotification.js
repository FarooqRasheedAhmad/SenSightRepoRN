import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { icons, images } from "../../assets";
import { getTOffset } from '../../utils/Utils';
import { CallButton } from "../CallButton";
import { RoundButton } from '../RoundButton'
import React from "react";
import { alertTypes } from "../../utils/constants";
import moment from "moment";
import { styles } from "./styles";
import { theme } from "../../theme";
import { Row, Col } from '../Grid';

const sendSMS = (name, phone) => {
  const msgBody = `Hi ${name}, \n`;
  if (Platform.OS === "ios") Linking.openURL(`sms:${phone}&body=${msgBody}`);
  else Linking.openURL(`sms:${phone}?body=${msgBody}`);
}

export const AlertUnreadNotification = (props) => {
  const { alertTitle, description, time, role, id, acknowledgeAlert, type } = props;

  const acknowledgeAlertCallBack = () => {
    acknowledgeAlert(id);
  }

  const alertTime = getTOffset(time);

  return (
    <View style={styles.card}>
      <View style={styles.upperBackground}>
        {/* <Text>{id}</Text> */}
        <View style={{flex:1}}>
          <Text style={styles.heading} numberOfLines={2}>{alertTitle}</Text>
          <Text style={styles.text}>{`${description}`}</Text>
        </View>

        <Row style={styles.row2}>
          <Col flex="auto"><Text>{alertTime.offsetTime.format('h:mm a, Do MMM, YYYY')}</Text></Col>
          <Col><Text style={styles.text2}>{getTOffset(time).offsetTime.fromNow()}</Text></Col>
        </Row>
        
      </View>

      <Row style={styles.row2}>
        <Col valign="center"><RoundButton title={'CANCEL'} callBackFunction={() => { }} bgColor={theme.colors.grey_shade_3} /></Col>
        <Col flex="auto" valign="center" align="center"><RoundButton title={'ACKNOWLEDGED'} callBackFunction={acknowledgeAlertCallBack} bgColor={theme.colors.colorPrimary} /></Col>
        <Col valign="center">
          {role == "senior" ? null : (
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => props.addToTask(id, alertTitle, description)}>
              <Image source={icons.add_icon} />
            </TouchableOpacity>
          )}
        </Col>
      </Row>

    </View>
  );
};
