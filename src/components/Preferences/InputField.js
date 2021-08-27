import React from 'react'
import { StyleSheet, Text, TextInput } from "react-native";
// import { theme } from "../../theme";
// import { icons } from "../../assets";
import { Row, Col } from "../../components";
import { Divider } from "react-native-elements";


export const InputField = props => {
    return (<>
        <Row style={props.style}>
            <Col flex={150} valign="center"><Text style={styles.fieldLabel}>{props.label}</Text></Col>
            <Col flex="auto">
                <TextInput style={styles.textField}
                    keyboardType={props.keyboardType || 'default'}
                    value={props.value}
                    placeholder={props.placeholder} placeholderTextColor="rgba(0,0,0,0.2)"
                    onChangeText={props.onChange}
                />
            </Col>
        </Row>
        <Divider style={{ margin: 5 }} />
    </>)
}

export const styles = StyleSheet.create({
    fieldLabel: {},
    textField: {
        backgroundColor: "#EEE",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 0,
    },
});
