import { StyleSheet } from "react-native"
import { theme } from "../../../theme"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.colorPrimary,
        paddingTop: Platform.OS === "ios" ?  44 : 0
    },
    subContainer: {
        flex: 1,
        backgroundColor: theme.colors.white
    },
    heading: {
        fontFamily: theme.fonts.SFProBold,
        fontSize: 22,
        letterSpacing: 0.35,
        lineHeight: 28,
        margin: 14,
    },
    headingText: {
        fontSize: 22,
        fontWeight: '700',
        lineHeight: 28,
        letterSpacing: 0.35,
        fontFamily: theme.fonts.SFProRegular,
        color: theme.colors.black
    },
    stepHeading: {
        fontSize: 14,
        lineHeight: 18,
        letterSpacing: 0.35,
        fontFamily: theme.fonts.SFProRegular,
        color: theme.colors.grey_shade_1,
        marginTop: 9
    },
    textInputStyle: {
        flex: 1,
        marginRight: 16
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})