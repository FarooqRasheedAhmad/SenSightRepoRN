
import * as React from 'react';
import { Text, TouchableOpacity } from "react-native";
import PropType from 'prop-types'

import { styles } from "./styles";

const { submit, submitText } = styles

export const RoundButton = props => {

    const { title, callBackFunction, bgColor, textSizeValue } = props
    return (
        <TouchableOpacity
            style={[submit, { backgroundColor: bgColor }]}
            onPress={() => callBackFunction()}
            underlayColor='#fff'>
            <Text style={[submitText, { fontSize: textSizeValue }]}>{title}</Text>
        </TouchableOpacity>
    )
}

RoundButton.propTypes = {
    title: PropType.string.isRequired,
    callBackFunction: PropType.func.isRequired,
    textSizeValue: PropType.number
}

RoundButton.defaultProps = {
    textSizeValue: 14
}

