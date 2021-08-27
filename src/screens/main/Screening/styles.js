import { StyleSheet, StatusBar, Platform } from "react-native"
import { theme } from "../../../theme"

export const styles = StyleSheet.create({
    steptext: {
        fontSize: 22,
        fontWeight: '700',
        lineHeight: 28,
        letterSpacing: 0.35,
        fontFamily: theme.fonts.SFProRegular,
        color: theme.colors.black
    },
    selectDevice: {
        fontSize: 14,
        lineHeight: 18,
        letterSpacing: 0.35,
        fontFamily: theme.fonts.SFProRegular,
        color: theme.colors.grey_shade_1,
        marginTop: 9
    },
    tempNote: {
        fontSize: 12,
        lineHeight: 14,
        fontWeight: 'bold',
        fontFamily: theme.fonts.SFProRegular,
        color: theme.colors.black,
        marginTop: 9,
        marginBottom: 5
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputFieldLable: {
        fontSize: 12,
        lineHeight: 14,
        fontFamily: theme.fonts.SFProRegular,
        color: theme.colors.black,
        marginTop: 15,
        marginBottom: 5
    },
    textInputStyle: {
        flex: 1,
        marginRight: 16
    },
    infoIcon: {
        width: 28,
        height: 28,
        tintColor: theme.colors.colorPrimary
    },
    pickerRoot: {
        width: "100%",
        height: 50,
        borderColor: theme.colors.colorPrimary,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: "center",
        paddingLeft: 8,
        marginTop: 20
    },
    downArrow: {
        width: 13,
        height: 10,
    },
    statusLable: {
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 17,
        letterSpacing: -0.41,
        lineHeight: 22,
        marginTop: 18
    },
    dropDownInput: {
        fontSize: 26,
        letterSpacing: -0.41,
        fontWeight: 'bold',
        color: theme.colors.black,
        backgroundColor: '#999',
        height: 50,
    }
});
