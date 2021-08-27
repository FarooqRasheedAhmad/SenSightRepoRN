import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
// import { theme } from "../../../../theme";
import { theme } from "../theme";
import { Icon } from "react-native-elements";

/*****
 * USAGE
<RadioButton selected={selected} value="A" />
 * 
 * PROPS
value: String
onChange: Function
selected: [Selected Value]
 *
 *
 */

export const RadioButton = props => {
    const [checked, setChecked] = React.useState(false);

    // React.useEffect(() => {
    //     console.log("selected chnaged: ", props.selected);
    //     // if (props.selected === props.value) 
    //     setChecked(props.selected === props.value);

    //     return () => {
    //         // cleanup
    //     }
    // }, [props.selected])

    const onCheckPress = args => {
        if (props.onChange) props.onChange(!checked ? props.value : false);
        setChecked(!checked);
    }

    if (!props.onChange)
        return (<View style={[styles.checkbox, props.selected==props.value ? styles.checkedStyle : {}]}><Icon name='check' color="#FFF" containerStyle={styles.checkIcon} /></View>)
    else
        return (<TouchableOpacity 
            onPress={() => props.onChange(props.selected == props.value ? false : props.value)} 
            style={[styles.checkbox, props.selected == props.value ? styles.checkedStyle : {}]}><Icon name='check' color="#FFF" containerStyle={styles.checkIcon} /></TouchableOpacity>)
        // return (<TouchableOpacity onPress={onCheckPress} style={[styles.checkbox, checked ? styles.checkedStyle : {}]}><Icon name='check' color="#FFF" containerStyle={styles.checkIcon} /></TouchableOpacity>)

}

const styles = StyleSheet.create({
    checkbox: {
        width: 24,
        height: 24,
        position: "relative",
        borderWidth: 1,
        padding: 12,
        borderRadius: 20,
        borderColor: theme.colors.colorPrimary,
    },
    checkedStyle: {
        backgroundColor: theme.colors.colorPrimary,
    },
    checkIcon: {
        position: "absolute",
    },
})


export default RadioButton;
