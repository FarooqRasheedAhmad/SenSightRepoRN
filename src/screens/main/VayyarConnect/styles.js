import { StyleSheet } from "react-native"
import { theme } from "../../../theme"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.colorPrimary,
        paddingTop: Platform.OS === "ios" ?  44 : 0
    },
    heading: {
        fontFamily: theme.fonts.SFProBold,
        fontSize: 24,
        letterSpacing: 0.35,
        lineHeight: 22,
        letterSpacing: -0.41,
        marginTop: 21
    },
    aboutSummery: {
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 14,
        letterSpacing: 0.35,
        lineHeight: 22,
        letterSpacing: -0.41,
        marginTop: 12,
    },
    bluetoothMsg: {
        fontFamily: theme.fonts.SFProBold,
        fontSize: 14,
        letterSpacing: 0.35,
        lineHeight: 22,
        letterSpacing: -0.41
    },
    line: {
        backgroundColor: theme.colors.grey_shade_3,
        height: 1,
        marginTop: 10
    },
    ovalRed: {
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.red_shade_1,
        marginRight: 10
    },
    WebViewStyle: {
        margin: 20,
        marginTop: (Platform.OS == 'ios') ? 20 : 0,
      }
})