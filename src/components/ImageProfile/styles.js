import { Platform, StatusBar, StyleSheet } from "react-native";

import { theme } from "../../theme";

export const styles = StyleSheet.create({
  imageBackground: {
    height: "100%",
    width: "100%",
    backgroundColor: "#D0D0D0",
  },
  root: {
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
    paddingTop: Platform.OS === "ios" ? "8%" : StatusBar.currentHeight,
  },
  logoutButtonRoot: { flexDirection: "row", alignSelf: "flex-end" },
  logoutButton: {
    margin: 16,
    borderRadius: 16,
    paddingHorizontal: 7,
    backgroundColor: 'rgba(239, 239, 244, 0.5)'
  },
  logoutText: { color: "white", padding: 8, fontSize: 14 },
  profileInfoRoot: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 16,
  },
  name: {
    fontSize: 24,
    fontFamily: theme.fonts.SFProBold,
    color: "white",
    textShadowRadius: 3,
    textShadowColor: "black",
  },
  address: {
    fontSize: 20,
    fontFamily: theme.fonts.SFProRegular,
    color: "white",
    textShadowRadius: 3,
    textShadowColor: "black",
  },
  email: {
    fontSize: 16,
    fontFamily: theme.fonts.SFProRegular,
    color: "white",
    textShadowRadius: 8,
    textShadowColor: "black",
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
});
