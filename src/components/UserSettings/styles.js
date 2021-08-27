import { theme } from "../../theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  title: {
    backgroundColor: theme.colors.grey_shade_2,
    padding: 8,
    paddingTop: 24
  },
  titleText: { color: theme.colors.black, paddingHorizontal: 8, opacity: 0.4 },
  divider: {
    marginLeft: 16,
    borderWidth: 0.5,
    borderColor: theme.colors.grey_shade_3
  },
  listItemTextStyle: {
    padding: 8,
    fontFamily: theme.fonts.SFProSemibold,
    fontSize: 18
  },
});
