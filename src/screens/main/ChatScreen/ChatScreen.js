import { Platform, StatusBar, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";

import Snackbar from "react-native-snackbar";
import Spinner from "react-native-loading-spinner-overlay";
import { WebView } from "react-native-webview";
import { theme } from "../../../theme";


export const ChatScreen = props => {
  const [loading, setLoading] = useState(false);
  if (Platform.OS === "android") {
    StatusBar.setBackgroundColor(theme.colors.colorPrimary);
  }

  useEffect(() => {
    // StatusBar.setBarStyle("dark-content", true);
  }, []);

  const showError = e => {
    setLoading(false);
    Snackbar.show({
      text: e.description,
      duration: Snackbar.LENGTH_LONG
    });
  };

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />
      <WebView
        source={{ uri: theme.strings.chat_url }}
        style={styles.webview}
        onLoadProgress={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={e =>
          showError(e)
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.colorPrimary,
    paddingTop: Platform.OS === "ios" ?  44 : 0
  },
  webview: {
    marginTop: Platform.OS === "ios" ? 1 : StatusBar.currentHeight
  }
});

