import React from "react"
import { Image, Text, View, TouchableOpacity } from "react-native"
import PropTypes from 'prop-types'
import { styles } from './styes'
import { icons } from "../../assets";

const { container, subContainer, answerTextStyle } = styles

export const AssessmentListItem = props => {

    const { title, type, icon, index, callBackFunction, isSelected } = props

    const _icon = isSelected ? icons.checked_icon : icons.empty;
    
    // if (type == 'checkbox'){ }
    // if (type == 'radio'){ }
    


    return (<View
        style={[container, { borderTopWidth: index == 0 ? 1 : 0 }]}>
        <TouchableOpacity style={subContainer} onPress={() => callBackFunction(index)}>
            <Text style={answerTextStyle}>{title}</Text>
            <Image source={_icon} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
    </View>)
}

AssessmentListItem.propTypes = {
    title: PropTypes.string.isRequired,
    // icon: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    callBackFunction: PropTypes.func.isRequired,
}