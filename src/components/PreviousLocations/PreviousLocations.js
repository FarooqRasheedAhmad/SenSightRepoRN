import { AppConstants, StorageUtils, getGeoCodePosition } from "../../utils";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import { NoDataState } from "../NoDataState";
import { ShowAllDialog } from "../ShowAllDialog";
import { icons } from "../../assets";
import { styles } from "./styles";
import { theme } from "../../theme";

export const PreviousLocations = (props) => {
  const {
    locations,
    setPreviousLocationPointer,
    unpinPreviousLocations,
  } = props;

  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullList, setFullList] = useState([]);

  useEffect(() => {
    setLoading(true);
      getGeoCodePosition(locations, (data) => {
        setFullList(data);
        setLoading(false);
      })
  }, [locations]);

  const renderList = (locationList, isPopUp) => (
    <FlatList
      data={locationList}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => "key" + index}
      renderItem={({ item, index }) => (
        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              setPreviousLocationPointer(item, index);
              if (dialog) {
                setDialog(false);
              }
            }}
          >
            <View style={{ flex: 1, marginTop: 10 }}>
              <View style={[styles.headerLocStatsView, { paddingHorizontal: isPopUp ? 10 : 0 }]}>
                <Image source={icons.location} />
                <View style={{ flex: 3 }}>
                  <View style={{ marginLeft: 10, marginRight: 10, }}>
                    <Text style={styles.lastLocItemTitle}>{item.name}</Text>
                    <Text style={[styles.lastLocItemDetail, { fontSize: 13 }]}>
                      {item.detail}
                    </Text>
                  </View>
                </View>
                {locationList.length > 5 ? null : (
                  <View style={{ flex: 0.15 }}>
                    <Image style={styles.image} source={icons.disclosure} />
                  </View>
                )}
              </View>
              <View style={styles.lastLocItemLine} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}
      numColumns={1}
      contentContainerStyle={{}}
    />
  )

  return (
    <View style={{ flex: 1, paddingHorizontal: 15 }}>
      {/* <Spinner visible={loading} /> */}
      <ShowAllDialog
        title="Previous Locations"
        showDialog={dialog}
        hideDialog={() => setDialog(false)}
        style={{ flex: 1, width: '100%', }}
      >
        {loading ? <NoDataState text="Loading..." /> : renderList(fullList, true)}
      </ShowAllDialog>
      <View style={styles.headerLocStatsView}>
        <Text style={styles.headerLocStatsTitle}>
          {theme.strings.previous_locations}
        </Text>
        <View style={styles.btnContainer}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => setDialog(true)}>
            <Text style={{ ...theme.palette.buttonTextBorder }}>Show All</Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <NoDataState text="Loading..." />
      ) : (
        renderList(fullList.slice(0, 5), false)
      )}
    </View>
  )
}
