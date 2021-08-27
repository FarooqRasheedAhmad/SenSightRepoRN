// import { StatusBar } from "react-native";
// import { theme } from ".";
import colors from "./colors";
import fonts from "./fonts";

const palette = {
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  button: {
    height: 45,
    backgroundColor: colors.colorPrimary,
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 1, height: 5 },
    marginLeft: 25,
    marginRight: 25,
  },
  buttonWhiteBg: {
    height: 45,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 1, height: 5 },
    marginLeft: 25,
    marginRight: 25,
  },
  nextButton: {
    height: 45,
    backgroundColor: colors.colorPrimary,
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 25,
    marginRight: 25,
  },
  buttonSave: {
    height: 45,
    backgroundColor: colors.colorPrimary,
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 1, height: 5 },
    width: 200,
  },
  buttonWithBorder: {
    height: 45,
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 1, height: 5 },
    marginLeft: 30,
    marginRight: 30,
    borderWidth: 1,
    borderColor: colors.colorPrimary,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
    fontFamily: fonts.SFProSemibold,
  },
  buttonTextPrimary: {
    color: colors.colorPrimary,
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
    fontFamily: fonts.SFProSemibold,
  },
  buttonTextBorder: {
    color: colors.colorPrimary,
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
    fontFamily: fonts.SFProSemibold,
  },
  textInputContainer: {
    width: "100%",
    position: "absolute",
    top: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    height: 45,
    color: colors.white,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 15,
    fontFamily: fonts.SFProRegular,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    marginTop: 7,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 8,
    paddingLeft: 15,
    paddingRight: 15,
  },
  textInputRoundBg: {
    height: 45,
    color: colors.black,
    fontSize: 14,
    fontFamily: fonts.SFProRegular,
    backgroundColor: colors.grey_shade_4,
    paddingLeft: 7,
    paddingRight: 7,
    borderRadius: 10,
  },
  textInputTransparentBg: {
    height: 45,
    color: colors.white,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 15,
    fontFamily: fonts.SFProRegular,
    backgroundColor: "transparent",
    marginTop: 7,
    borderRadius: 8,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: colors.white,
    borderWidth: 1,
  },
  textInputTransparentBGLogin: {
    height: 45,
    color: colors.white,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 15,
    fontFamily: fonts.SFProRegular,
    backgroundColor: "transparent",
    marginTop: 7,
    borderRadius: 8,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: colors.white,
    borderWidth: 1,
  },
  backgroundOnBoarding: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  back: {
    width: 25,
    height: 25,
    resizeMode: "center",
    marginLeft: 10,
    alignSelf: "center",
  },
  headerContainer: {
    width: "100%",
    height: 52,
    backgroundColor: colors.colorPrimary,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  headerText: {
    flexGrow: 1,
    color: colors.white,
    fontSize: 16,
    textAlign: "center",
    fontFamily: fonts.GothamBold,
    justifyContent: "center",
    marginRight: 35,
  },
  searchParentContainer: {
    width: "100%",
    backgroundColor: colors.grey_89,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  textSearchInputContainer: {
    width: "95%",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  textSearchInput: {
    width: "100%",
    height: "100%",
    color: colors.black_17,
    fontSize: 15,
    fontFamily: fonts.GothamBook,
    paddingLeft: 10,
    paddingRight: 10,
    textAlignVertical: "top",
  },
  searchSection: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginLeft: 10,
    marginRight: 10,
  },
  searchIcon: {
    padding: 10,
  },
  statusBar: {
    flex: 0,
    backgroundColor: colors.colorPrimary,
  },
};

export default palette;
