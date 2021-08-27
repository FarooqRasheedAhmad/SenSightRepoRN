import React, { useEffect, useState } from "react";
import { View, TextInput as _TextInput, Text, StyleSheet } from "react-native";
import { theme } from "../theme";


export const TextInput = props => {
    return (<View style={styles.inputContainer}>
        <Text style={styles.label}>{props.label}</Text>
        <View style={styles.textInputContainer}>
            <_TextInput
                // placeholderTextColor={props.placeholderTextColor || "grey"}
                autoFocus={props.autoFocus==true}
                multiline={props.multiline==true}
                numberOfLines={props.multiline ? props.numberOfLines || 4 : 1}
                style={styles.input}
                value={props.value}
                onChangeText={props.onChange || console.log}
                {...props.fieldProps}
            />
        </View>
    </View>)
}

const styles = StyleSheet.create({
    inputContainer:{},
    textInputContainer:{},
    label: { fontSize: 18, fontFamily: theme.fonts.SFProSemibold, },
    input: {
        textAlignVertical:"top",
        // height: Dimensions.get("window").height / 4,
        // justifyContent: "flex-start",
        fontSize: 18,
        borderWidth: 1,
        borderColor: theme.colors.grey_shade_1,
        paddingHorizontal: 10,
        paddingVertical: 12,
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: "white",
        minHeight: 50,
    },

});
