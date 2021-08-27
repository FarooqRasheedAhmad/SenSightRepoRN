import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput } from 'react-native'
import { theme } from "../../theme";

export const InputField = (props) => {
    const { label, type, value } = props;

    const _props = {
        secureTextEntry: props.secureTextEntry || false,
        autoFocus: props.autoFocus || false,
        numberOfLines: props.numberOfLines || 1,
        style: [styles.inputField, styles.textField],
        // onChangeText: props.onChange,
        placeholder: props.placeholder,
        placeholderTextColor: "rgba(0,0,0,0.2)"
    }
    if (value) Object.assign(_props, { value });
    if (type == "text" || type == "password" || type == "textarea") Object.assign(_props, { onChangeText:props.onChange });


    if(type=='text') return(<>
        <View style={styles.fieldWrapper}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput {..._props}
            />
        </View>
    </>)

    if(type=='password') return(<>
        <View style={styles.fieldWrapper}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput {..._props}
                secureTextEntry={true}
            />
        </View>
    </>)

    // if(type=='text') return(<></>)

    return <Text style={{color:"#F00", fontWeight:"bold"}}>Invalid Field</Text>
}


const styles = StyleSheet.create({
    fieldWrapper:{
        marginLeft: 20,
        marginBottom: 20,
        // borderBottomWidth: 0.5,
        // borderBottomColor: "#CCC",
    },

    inputField:{
        // height: Platform.OS === "ios" ? 40 : undefined,
        borderWidth:1,
        borderColor: "rgba(0,0,0,0.02)",
        borderBottomColor: "rgba(0,0,0,0.2)",
        // borderRadius:5,
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 17,
        lineHeight: 22,
        letterSpacing: -0.41,
        color: theme.colors.black,
        paddingRight: 10,
    },

    label:{
        color: theme.colors.black,
        fontSize: 18, fontFamily: theme.fonts.SFProSemibold,
        marginTop: 8,
        // marginLeft: 23
    },

    textField:{},

});