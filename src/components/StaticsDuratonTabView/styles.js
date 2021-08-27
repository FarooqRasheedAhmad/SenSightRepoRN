import { StyleSheet } from "react-native"
import { theme } from "../../theme"

export const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    line: {
        height: '100%',
        width: 1,
        backgroundColor: theme.colors.white
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRightColor: theme.colors.white,
    },
    tabItem: { flexDirection: 'row', flex: 1},
    textStyle: {
        fontSize: 14,
        color: theme.colors.white,
        letterSpacing: 0.35,
        textAlign: 'center',
    },
    subContainer: {
        height: 28,
        width: '90%',
        flexDirection: 'row',
        borderRadius: 14,
        borderColor: '#fff',
        borderWidth: 1,
    }
});
