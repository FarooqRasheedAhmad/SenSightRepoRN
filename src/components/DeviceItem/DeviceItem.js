import { Image, Text, View, TouchableOpacity } from "react-native";
import { icons, images } from "../../assets";
import PropTypes from "prop-types"
import React from "react";
import { styles } from "./styles";
import { Row, Col } from '../Grid'
import { getDevice } from '../../configs'

export const DeviceItem = (props) => {
  const { item, image, deviceName, deviceModel, onItemPressCallBack, rightItem, rightItemType } = props

  const renderBorder = (itemType) => {
    switch (itemType) {
      case 'icon':
        return (<View style={rightItem} />)
      case 'text':
        return (<Text style={styles.rightText}>{rightItem}</Text>)
      default:
        return (<View style={rightItem} />)
    }
  }

  return (
    <TouchableOpacity style={styles.list} onPress={() => onItemPressCallBack(item)}>
      <View style={{ flexDirection: "row" }}>
        {image && <Image style={{ width: 48, height: 48, marginRight: 6 }} source={image} />}
        <View>
          <Text style={styles.listText}>{deviceName}</Text>
          <Text style={styles.listSubText}>{deviceModel}</Text>
        </View>
      </View>
      {rightItemType ? renderBorder(rightItemType) : <Image source={icons.disclosure}></Image>}
    </TouchableOpacity>
  )
}

DeviceItem.propTypes = {
  item: PropTypes.object,
  image: PropTypes.string,
  deviceName: PropTypes.string.isRequired,
  deviceModel: PropTypes.string.isRequired,
  onItemPressCallBack: PropTypes.func,
  // rightItem: PropTypes.object,
  rightItemType: PropTypes.string
}

DeviceItem.defaultProps = {
  image: undefined,
  onItemPressCallBack: PropTypes.func,
  onItemPressCallBack: () => { },
  rightItem: undefined,
  rightItemType: null
}


export const DeviceItemV2 = props => {
  // const deviceInfo = props.deviceInfo || getDevice(props.data) || props.data;
  const deviceInfo = props.deviceInfo || props.data;

  if (!deviceInfo) return <Text>No fda info...</Text>
  // const { title, localName, image, deviceModel, rightItem } = deviceInfo

  const Wrapper = args => {
    if (props.onPress) return (<TouchableOpacity onPress={() => props.onPress(props.data)} style={styles.list} {...args} />)
    return (<View style={styles.list} {...args} />)
  }

  const renderRightColumn = () => {
    if (props.text) return <Text style={styles.rightText}>{props.text}</Text>
    if (props.icon) return <View style={props.icon} />
    return props.onPress ? <Image source={icons.disclosure} /> : null;
  }

  return (
    <Wrapper disabled={props.disabled}>
      <Row>
        {deviceInfo.image && <Col>{deviceInfo.image && <Image style={{ width: 48, height: 48 }} source={deviceInfo.image} />}</Col>}
        <Col flex="auto" valign="center" style={{marginHorizontal:6}}><View>
          <Text style={styles.listText}>{deviceInfo.localName || deviceInfo.name}</Text>
         {deviceInfo.deviceModel !== undefined && <Text style={styles.listSubText}>{deviceInfo.deviceModel}</Text>}
        </View></Col>
        <Col valign="center">{renderRightColumn()}</Col>
      </Row>
    </Wrapper>
  )

}

DeviceItemV2.propTypes = {
  deviceInfo: PropTypes.object,
  data: PropTypes.object,
  onPress: PropTypes.func,
  text: PropTypes.string,
  icon: PropTypes.object,
}
