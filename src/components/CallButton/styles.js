import { theme } from "../../theme";
import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  root: {
    borderRadius: 50,
    alignSelf: "flex-end",
    marginRight: 16,
    paddingHorizontal: 8,
    paddingVertical: 6
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
  title: {
    color: theme.colors.white,
    fontSize: 15,
    marginLeft: 5,
    alignSelf: "center"
  },
  image: {
    alignSelf: "center"
  }
});
