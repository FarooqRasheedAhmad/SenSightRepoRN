import { StyleSheet } from "react-native";
import { theme } from "../../theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 10,
        borderColor: theme.colors.white,
        borderWidth: 1,
        height: 50,
        flexDirection: 'row'
    },
    seprator: {
        height: '100%',
        width: 1,
        backgroundColor: theme.colors.white
    },
    iconStyle: {
        height: 15,
        width: 15
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 17,
        fontWeight: '600',
        fontFamily: theme.fonts.SFProRegular,
        letterSpacing: -0.41,
        lineHeight: 22,
        marginLeft: 6,
        color: theme.colors.white
    }
})
