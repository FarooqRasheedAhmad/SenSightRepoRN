import {
    Platform,
    StyleSheet,
    Text,
    StatusBar,
    View
} from "react-native";
// import { icons, theme } from "../..";

// import { theme, icons } from "../../";
import { theme } from "../../theme";
import { icons } from "../../assets";
import React, { useEffect } from "react";
import { SearchBar, NavigationHeader } from "../../components";

export const ComingSoon = props => {
    useEffect(() => {
        if (Platform.OS !== "ios") {
          StatusBar.setTranslucent(false);
          StatusBar.setBackgroundColor(theme.colors.colorPrimary);
        }
      }, []);
    return (
        <View style={styles.container}>
            <NavigationHeader title={'Coming soon'} leftText={'Back'} navigation={props.navigation} />
            <View style={styles.subContainer}>

                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text style={styles.text}>
                        Coming soon
            </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.colorPrimary,
        paddingTop: Platform.OS === "ios" ?  44 : 0
      },
    subContainer: {
        flex: 1,
        backgroundColor: theme.colors.white
      },
    heading: {
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 17,
        lineHeight: 22,
        letterSpacing: -0.41
    },
    text: {
        fontFamily: theme.fonts.SFProRegular,
        fontSize: 18,
        lineHeight: 20,
        letterSpacing: -0.24,
        color: theme.colors.black
    }
});
