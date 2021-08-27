import { StyleSheet } from "react-native"
import { theme } from "../../../theme"

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center' 
    },
    heading: {
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 17,
        letterSpacing: -0.41,
        lineHeight: 22,
        color: '#000000',
        textAlign: 'center',
        marginTop: 20
    },
    heading2: {
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 24,
        letterSpacing: -0.41,
        lineHeight: 24,
        color: '#000000',
        marginTop: 20
    },
    resultHeading: {
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 28,
        letterSpacing: -0.41,
        lineHeight: 28,
        color: '#000000',
        marginTop: 20
    },
    resultSubtHeading: {
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 22,
        letterSpacing: -0.41,
        lineHeight: 22,
        color: '#000000',
        textAlign: 'center',
        marginTop: 20,
        paddingLeft: 32,
        paddingRight: 32
    },
    resultInstruction: {
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 20,
        letterSpacing: -0.41,
        lineHeight: 22,
        color: '#000000',
    },
    questionTextStyle: {
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 26,
        letterSpacing: -0.41,
        lineHeight: 26,
        color: '#000000',
        textAlign: 'center',
        marginTop: 40,
        marginLeft: 32,
        marginRight: 32,
        marginBottom: 20
    },
    divider: {
        marginBottom: 20,
        marginTop: 50,
        width: "100%",
      },
      bullet: {
          width: 22,
          fontSize: 22
          
      }
})
