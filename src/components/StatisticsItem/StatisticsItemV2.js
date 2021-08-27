import React from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { Row, Col } from '../Grid'


export const StatisticsItemV2 = (props) => {
  // console.log("StatisticsItemV2.props: ", props);
  
  const { title, titleSize, children, avatar, onPress, bg_color } = props;
  return (<TouchableOpacity onPress={onPress} style={{ borderWidth: 0, backgroundColor: bg_color || "#F3F3F3", borderRadius: 14, margin: 2, height: 110, overflow: 'hidden', }}>
    <Row style={{ justifyContent: "center", marginTop: 3 }}>
      <Col align="center" valign="center"><Text style={{ fontSize: titleSize || 16, fontWeight: "bold", textAlign: "center" }}>{title}</Text></Col>
      {avatar && <Col valign="center" style={{ marginHorizontal: 5 }}><Image source={avatar} /></Col>}
    </Row>

    <View style={{ borderWidth: 0, flex: 1, alignItems: "center", justifyContent: "center" }}>
      {children}
      {/* <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>36.5<Text style={{ fontSize: 14, fontWeight: "normal" }}> °C</Text></Text> */}
    </View>
  </TouchableOpacity>)
}

export default StatisticsItemV2;