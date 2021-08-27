import React from "react";
import { ScrollView, View, Platform, StatusBar, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { theme } from "../../../theme";
import { Col, Row ,NavigationHeader} from '../../../components'

export const PrivacyPolicy = (props) => {
  const [busy, setBusy] = React.useState(true)

  return (<>
  <View style={{flex: 1, backgroundColor: theme.colors.colorPrimary,paddingTop: 40}}>
  <NavigationHeader title={'Privacy Policy'} leftText={'Back'} navigation={props.navigation} />
        <WebView
          // onLoad={() => this.hideSpinner()}
          style={{ flex: 1 }}
          source={{ uri: 'https://sensights.ai/privacy-policy/' }}
          onLoad={() => setBusy(false)}
        />
      {busy && <Row style={{ position: "absolute", width: "100%", top: 100, left: 0 }}><Col flex="auto" align="center"><ActivityIndicator animating={true} /></Col></Row>}
      </View>
  </>);
};

PrivacyPolicy.navigationOptions = ({ navigation }) => {
  return {
    title: "Privacy Policy",
    headerBackTitle: "",
    headerTintColor: "white",
    headerTitleStyle: {
      fontSize: 20,
    },
    headerStyle: {
      backgroundColor: theme.colors.colorPrimary,
    },
    // headerLeft: () => (
    //   <HeaderBackButton
    //     tintColor={theme.colors.colorPrimary}
    //     onPress={() => {
    //       getSeniorLocations();
    //       fetchGeofences();
    //       navigation.goBack();
    //     }}
    //   />
    // ),
  };
};
