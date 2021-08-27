import { StyleSheet, Dimensions } from "react-native"
import { theme } from "../../../theme"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: theme.colors.green_color,
        //paddingTop: Platform.OS === "ios" ?  44 : 0
    },
    subContainer: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    heading: {
        marginTop: 20,
        fontFamily: theme.fonts.SFProBold,
        fontSize: 22,
        letterSpacing: 0.35,
        lineHeight: 28,
        margin: 14,
    },
    liveStreamButton: {
        backgroundColor: '#34495e',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginHorizontal: 25,
        marginBottom: 15,
        top: Dimensions.get('screen').height - 250
    
      },
      textButton: {
        color: 'white',
        fontSize: 25,
      },
      input: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginVertical: 20,
        marginHorizontal: 25,
        fontSize: 23,
        fontWeight: '600',
      },
      flatList: {
        marginHorizontal: 15,
      },
      welcomeText: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 25,
      },
      title: {
        fontSize: 25,
        color: 'white',
        fontWeight: '700',
        marginLeft: 20,
        marginVertical: 25,
      },
})