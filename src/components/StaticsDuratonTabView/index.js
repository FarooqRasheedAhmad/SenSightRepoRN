import React from "react";
import { Text, View, TouchableOpacity } from "react-native"
import PropTypes from "prop-types"
import { styles } from './styles'

const { textStyle, line, subContainer, container, textContainer, tabItem } = styles

export const StaticsDuratonTabView = (props) => {

    const { tabItems, selectedIndex, textColor, selectedBgColor, tabWidth,
        onPressCallBack, fontSize } = props
    const renderSeprator = () => {
        return <View style={[line, { backgroundColor: selectedBgColor }]} />
    }

    return (<View style={container}>
        <View style={[subContainer, { borderColor: selectedBgColor, width: tabWidth }]}>
            {tabItems && tabItems.map((item, index) => {
                let selectedTabBgColor = index == selectedIndex ? selectedBgColor : 'transparent'
                let selectedTabTextColor = index == selectedIndex ? textColor : selectedBgColor
                let leftTopCornerStyle = { borderTopLeftRadius: index == 0 ? 15 : 0 }
                let leftBottomCornerStyle = { borderBottomLeftRadius: index == 0 ? 15 : 0 }
                let rightTopCornerStyle = { borderTopRightRadius: index == tabItems.length - 1 ? 15 : 0 }
                let rightBottomCornerStyle = { borderBottomRightRadius: index == tabItems.length - 1 ? 15 : 0 }

                return (<View style={tabItem} key={item.name}>
                    <TouchableOpacity onPress={()=> onPressCallBack(index)} style={[textContainer, { backgroundColor: selectedTabBgColor }, leftTopCornerStyle,
                    leftBottomCornerStyle, rightTopCornerStyle, rightBottomCornerStyle]}>
                    <Text style={[textStyle, { color: selectedTabTextColor, fontSize: fontSize }]}>{item.name}</Text>
                </TouchableOpacity>
                    {index < tabItems.length - 1 && renderSeprator()}

                </View>
                )
            })}
        </View>
    </View>)
}

StaticsDuratonTabView.propTypes = {
    tabItems: PropTypes.array.isRequired,
    tabWidth: PropTypes.string,
    textColor: PropTypes.string,
    selectedBgColor: PropTypes.string,
    fontSize: PropTypes.number
}

StaticsDuratonTabView.defaultProps = {
    tabWidth: '90%',
    textColor: '#ffffff',
    selectedBgColor: '#C42323',
    fontSize: 14
}


