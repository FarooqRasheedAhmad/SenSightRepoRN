import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { theme } from "../../theme";

// active: true
// doctorName: "dr name 1"
// dosage: "dosage 1"
// id: 14
// medicine: "med 1"
// remarks: "remarks 1"
// seniorId: 193

export const MedicationItem = props => {
    return (
        <TouchableOpacity onPress={props.onPress} activeOpacity={0.6} style={styles.listItem}><View>
            <Text style={styles.li_heading}>{props.medicine}</Text>
            <Text style={styles.li_subHeading}>Dosage: {props.dosage}</Text>
            {/* <Image source={props.isChecked ? icons.checked_icon : icons.empty} /> */}
        </View></TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 10,
        paddingRight: 10,
        borderBottomColor: "rgba(0,0,0,0.2)",
        borderBottomWidth: 0.5,
        paddingBottom: 15,
        paddingTop: 15,
        alignItems: "center"
    },
    li_heading: {
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 17,
        lineHeight: 22,
        letterSpacing: -0.41,
        color: theme.colors.black
    },
    li_subHeading: {
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: -0.24,
        color: "rgba(0, 0, 0, 0.48)"
    }

});
