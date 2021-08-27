import { AppNavigator } from "./routes";
import { createAppContainer } from "react-navigation";

export const AppContainer = createAppContainer(AppNavigator);
export * from "./api";
export * from "./assets";
export * from "./configs";
export * from "./theme";
export * from "./utils";
