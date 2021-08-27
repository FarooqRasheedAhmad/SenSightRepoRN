import { Image, Text, View, TouchableOpacity } from "react-native";
import { icons, images } from "../../assets";
import PropTypes from "prop-types"
import React from "react";
import { styles } from "./styles";

export const  ServiceItem = (props) => {
  const { item, image, subimage, deviceName, subName, deviceModel, onItemPressCallBack, rightItem, rightItemType } = props
  const { mainimage, subimagestyle, listText, listSubText } = styles;
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
    <TouchableOpacity style={styles.list} onPress={()=> onItemPressCallBack(item)}> 
      <View style={{ flexDirection: "row" }}>
        { image && <Image style={mainimage} source={image} />}
        { subimage && <Image style={subimagestyle} source={subimage} />}
        <View>
          <Text style={listText}>{deviceName}</Text>
          <Text style={styles.listSubText}>{subName}</Text>
        </View>
      </View>
      {rightItemType ? renderBorder(rightItemType) : <Image source={icons.disclosure}></Image>}
    </TouchableOpacity>
  )
}

ServiceItem.propTypes = {
  item: PropTypes.object,
  image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  subimage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  deviceName: PropTypes.string,
  subName: PropTypes.string,
  onItemPressCallBack: PropTypes.func,
  onItemPressCallBack: () => {},
  rightItem: PropTypes.object,
  rightItemType: PropTypes.string
}

ServiceItem.defaultProps = {
  image: undefined,
  subimage: undefined,
  onItemPressCallBack: PropTypes.func,
  onItemPressCallBack: () => {},
  rightItem: undefined,
  rightItemType: null
}
