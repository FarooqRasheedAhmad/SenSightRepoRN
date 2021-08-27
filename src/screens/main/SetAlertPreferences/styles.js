import { StyleSheet } from "react-native"
import { theme } from "../../../theme"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.colorPrimary,
        paddingTop: Platform.OS === "ios" ? 44 : 0
    },
    subContainer: {
        flex: 1,
        backgroundColor: theme.colors.white,
        padding: 20
    },
    track: {
        height: 20,
        borderRadius: 10,
      },
      thumb: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#000000',
      },
      textStyle: {
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: -0.17,
        fontFamily: theme.fonts.SFProRegular 
      },
      headingStyle: {
        fontSize: 24,
        fontWeight: '600',
        letterSpacing: -0.41,
        marginVertical: 10,
        fontFamily: theme.fonts.SFProRegular 
      },
      descriptionStyle: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: -0.17,
        margin: 30,
        fontFamily: theme.fonts.SFProRegular 
      },
      redAlertStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: -0.17,
        marginVertical: 0,
        // marginRight: 100,
        fontFamily: theme.fonts.SFProRegular 
      },
      textInputStyle: {
        flex: 1,
        height: 45,
        color: theme.colors.black,
        fontSize: 14,
        fontFamily: theme.fonts.SFProRegular,
        backgroundColor: theme.colors.grey_shade_4,
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 10,
    },
})