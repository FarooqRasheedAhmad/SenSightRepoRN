import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { StorageUtils } from "../utils";

const clickLimit = 10;

export const HiddenInfoButton = props => {
    const [user_modules, set_user_modules] = React.useState(false);
    const [clicks, set_clicks] = React.useState(0);

    React.useEffect(() => {
        StorageUtils.getValue('user_modules').then(r => set_user_modules(r));

        // effect
        // return () => {
        //     cleanup
        // }
    }, [])

    const onPressed = props => {
        if (clicks > clickLimit) return;
        let _clicks = clicks + 1;

        if (_clicks > clickLimit) alert("Info unlocked");

        set_clicks(_clicks);
    }

    if (!user_modules) return null;

    return (
        <View>
            <TouchableOpacity onPress={onPressed} style={{ borderWidth: 1, padding:20, borderColor:"rgba(0, 0, 0, 0.02)" }} />

            {clicks>5 && <View>
                <Text>Modules: {user_modules}</Text>
            </View>}

        </View>
    )
}
