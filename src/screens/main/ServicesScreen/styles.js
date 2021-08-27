import { StyleSheet } from "react-native"
import { theme } from "../../../theme"

export const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // backgroundColor: theme.colors.colorPrimary,
        backgroundColor: theme.colors.white,
        // paddingTop: Platform.OS === "ios" ?  80 : 0,  
        // paddingBottom:100,
        display:"flex",
        padding:20,
      },
    // subContainer: {
    //     flex: 1,
    //     backgroundColor: theme.colors.white,
    // },
    heading: {
        fontFamily: theme.fonts.SFProBold,
        fontSize: 22,
        letterSpacing: 0.35,
        // lineHeight: 30,
        marginHorizontal: 14,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.grey_shade_3,
        marginTop: 20,
    },
    // center: {
    //     position: 'absolute',
    //     textAlign: "center",
    //     ...StyleSheet.absoluteFill,
    //     fontFamily: theme.fonts.SFProBold,
    //     fontSize: 22,
    //     justifyContent: 'center',
    //     color: theme.colors.white,
    //     marginTop: 44
    //   },
    // subHeading: {
    //     fontFamily: theme.fonts.SFProBold,
    //     fontSize: 23,
    //     letterSpacing: 0.35,
    //     lineHeight: 26,
    //     marginTop: 10,
    //     marginLeft: 44,
    // },
    teletext: {
        color: theme.colors.grey,
    },
    image: {
        marginLeft: 10,
        marginRight: 10,
        width: 280,
        height: 40
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        marginLeft: 20,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: 'center'
      },
    openButton: {
        backgroundColor: theme.colors.colorPrimary,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: 70,
        flexDirection: 'row',
        height: 40,
        marginTop:10
      },
    webViewClosebutton: {
        backgroundColor: theme.colors.colorPrimary,
        padding: 10,
        height: 40,
      },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
    // modalText: {
    //     marginBottom: 15,
    //     textAlign: "center"
    //   },
    roundButton1: {
      width: 40,
      height: 40,
      padding: 10,
      marginTop: 10,
      marginRight: 10,
      marginBottom: 6,
      borderRadius: 100,
      backgroundColor: theme.colors.colorPrimary,
    },
    mini: {
      flexDirection: 'row',
      justifyContent: 'center',
    },


    webViewContainer:{
      backgroundColor: "#FFF", 
      flex:1,
    },


})