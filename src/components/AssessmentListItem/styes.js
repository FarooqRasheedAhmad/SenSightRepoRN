import { StyleSheet } from "react-native"
import { theme } from "../../theme"

export const styles = StyleSheet.create({

    container: {
        width: '100%',
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.2)',        
        justifyContent: 'center'
    },
    subContainer: {
        flexDirection: 'row',       
        alignItems: 'center',
        width: '100%',
        minHeight: 76,
        padding: 18
    },
    answerTextStyle: {
        flex: 1,
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 17,
        letterSpacing: -0.41,
        lineHeight: 20,
        color: '#000000',
    }
})
