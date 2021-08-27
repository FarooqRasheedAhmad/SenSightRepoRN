import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types';
// import { styles } from './ListItem/styles'
import { theme } from "../theme"


export const Button = props=> {

    // const btStyle = {...styles.btn, ...props.styles}
    // const btnTxtStyle = { ...styles.btnText, ...props.textStyle };

    // return (
    //     <TouchableOpacity style={btStyle} onPress={props.onPress}><>
    //         <Text style={btnTxtStyle}>{props.title}</Text>
    //         {props.children}
    //     </></TouchableOpacity>
    // )


    let __style = { ...props.style, borderWidth: 1, borderColor:"#EEE", backgroundColor:"#18B3FF", margin:5, padding:10, borderRadius:5 };
    if (props.disabled) __style.backgroundColor = "#CCC";
    const __textStyle = { ...styles.textStyle, ...props.textStyle }
    // if (props.disabled) Object.assign(__style, {opacity:0.5})

    return (<><TouchableOpacity {...props} style={__style}>
        <Text style={__textStyle}>{props.title}</Text>
        {props.children}
    </TouchableOpacity></>)
}
export default Button;

const styles = StyleSheet.create({
    btn:{
        backgroundColor: theme.colors.colorPrimary,
    },
    textStyle:{
        color: "#FFFFFF",
    }
})