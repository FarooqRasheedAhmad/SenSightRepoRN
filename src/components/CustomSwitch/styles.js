import { theme } from "../../theme";
import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  tabItem: { flexDirection: 'row', width: 60, justifyContent: 'flex-end', height: 32 },
  textStyle: {
    fontSize: 14,
    color: theme.colors.white,
    letterSpacing: 0.35,
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 17
  },
  container: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 20,
    borderColor: theme.colors.colorPrimary,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    width: 132,
    position:"relative",
    zIndex:9999,
  }
})

