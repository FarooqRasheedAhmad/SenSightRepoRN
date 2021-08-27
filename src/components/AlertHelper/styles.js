import { theme } from "../../theme";
import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        ...StyleSheet.absoluteFill,
        backgroundColor: theme.colors.black,
        opacity: 0.3,
        zIndex: 999
    },
    mainAlertView: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.white,
        height: 200,
        width: '90%',
        borderRadius: 5
    },
    alertTitle: {
        fontSize: 20,
        color: theme.colors.black,
        textAlign: 'center',
        padding: 10,
        height: '28%'
    },
    alertMessage: {
        fontSize: 18,
        color: theme.colors.black,
        textAlign: 'center',
        textAlignVertical: 'center',
        padding: 10,
        height: '80%'
    },
    buttonStyle: {
        width: '50%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        color: theme.colors.colorPrimary,
        textAlign: 'center',
        fontSize: 22,
        marginTop: -5
    },
    btnContainer: {
        flexDirection: 'row',
        width: '100%',
        height: '25%',
        justifyContent: 'center' 
    }
})
