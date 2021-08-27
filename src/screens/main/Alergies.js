import { FlatList, StyleSheet, Platform, View, StatusBar, Text, Image, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { SearchBar, NavigationHeader, Row, Col } from "../../components";
import React, { useState, useEffect } from "react";
import { theme } from "../../theme";
import { icons } from "../../assets";
import { GET_ALLERGIES, UPDATE_ALLERGIES, ADD_ALLERGIES } from '../../api'
import { sendRequest } from '../../apicall'
import { AppConstants, StorageUtils } from "../../utils";
import { AllergiesItem, AllergiesForm } from '../../components/Preferences';

export const Alergies = props => {
  const [busy, setBusy] = useState(false)
  const [showModal, setShowModal] = useState(false)
  // const [medications, setMedications] = useState(arrayHolder);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [searchKw, setSearchKw] = useState(null);

  useEffect(() => {
    if (Platform.OS !== "ios") {
      StatusBar.setTranslucent(false);
      StatusBar.setBackgroundColor(theme.colors.colorPrimary);
    }
    getData();

    // return () => {
    //   setMounted(false);
    // };

  }, []);

  const searchFilter = text => {
    setSearchKw((!text || text.length < 1) ? null : text);

    // if (!text || text.length < 1){
    //   setSearchKw(null);
    //   return;
    // }
    // const newData = arrayHolder.filter(item => {
    //   return item.name.toLowerCase().includes(text.toLowerCase());
    // });
    // setData(newData);
  };

  const doAdd = async (values) => {
    // let fd = new FormData();
    // for (let a in values) fd.append(a, values[a]);
   
    setBusy(true);
    setError(null);

    sendRequest({ uri: ADD_ALLERGIES, method: 'post', body: JSON.stringify(values), debug:false }).then(result => {
      setBusy(false);
      setShowModal(false);

      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.errors) {
        console.log("ERRORS: ", JSON.stringify(result.errors, 0, 2));
        setError("Unexpected Error!");
        return;
      }

      getData();

    })

  }

  const getData = async (args) => {
    setBusy(true);

    const seniorId = await StorageUtils.getValue(AppConstants.SP.USER_ID)
    let uri = String(GET_ALLERGIES).replace("{seniorId}", seniorId);

    sendRequest({ uri: uri, method: 'get' }).then(result => {
      setBusy(false);

      if (result.error) { setError(result.error); return; }

      if (result.errors) {
        console.log("ERRORS: ", JSON.stringify(result.errors, 0, 2));
        setError("Unexpected Error!")
        return;
      }

      setData(result)

    })

  }

  const getFilteredData = args => {
    if (!searchKw || searchKw.length < 1) return data;

    if (searchKw) return data.filter(itm => {
      return itm.allergy ? itm.allergy.toLowerCase().includes(searchKw.toLowerCase()) : false;
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.colorPrimary, paddingTop: Platform.OS == 'ios' ? 44 : 0 }}>
      <NavigationHeader title={'Allergies'} leftText={'Back'} navigation={props.navigation} />
      <View style={{flex: 1, backgroundColor: theme.colors.white,}}>

      <Row>
        <Col flex="auto"><SearchBar searchFilter={searchFilter} /></Col>
        <Col valign="center"><TouchableOpacity onPress={() => setShowModal({ type: 'form' })} activeOpacity={0.6} style={{ marginTop: 5 }}><Image source={icons.add_green} /></TouchableOpacity></Col>
      </Row>

      {error && <Text style={{ color: "#F00", fontWeight: "bold", padding: 10 }}>{error}</Text>}
      {busy && <ActivityIndicator size={32} animating={true} />}

      <FlatList
        data={getFilteredData()}
        renderItem={({ item }) => (<AllergiesItem {...item} onPress={() => setShowModal({ type: 'details', data: item })} />)}
        keyExtractor={(item, index) => index.toString()}
      />

      <Modal animationType="slide" transparent={true} visible={showModal !== false} onRequestClose={() => setShowModal(false)} >
        <TouchableOpacity onPress={() => setShowModal(false)} style={{ backgroundColor: "rgba(0,0,0,0.5)", flex: 1, alignItems: "center", justifyContent: "center", padding: 5 }} activeOpacity={1}>

          {showModal && showModal.type == 'details' && <>
            <View style={{ paddingHorizontal: 15, paddingVertical: 20, backgroundColor: "#FFF", borderRadius: 10, width: "100%" }}>
              <Row style={styles.detailRow}>
                <Col flex={100}><Text style={styles.detailRowText}>Allergy: </Text></Col>
                <Col flex="auto"><Text style={{ ...styles.detailRowText, fontWeight: "bold" }}>{showModal.data.allergy}</Text></Col>
              </Row>
              <Row style={styles.detailRow}>
                <Col flex={100}><Text style={styles.detailRowText}>Remarks: </Text></Col>
                <Col flex="auto"><Text style={styles.detailRowText}>{showModal.data.remarks}</Text></Col>
              </Row>

            </View>
            <TouchableOpacity onPress={() => setShowModal(false)} activeOpacity={0.8} style={{ ...theme.palette.nextButton, backgroundColor: "#FFF", marginTop: 15, width: "100%" }}>
              <Text style={{ ...theme.palette.buttonText, color: theme.colors.colorPrimary }}>Cancel</Text>
            </TouchableOpacity>
          </>}

          {showModal && showModal.type == 'form' && <AllergiesForm busy={busy} onSubmit={doAdd} />}

        </TouchableOpacity>
      </Modal>
 
    </View>
    </View>
  );
};


const styles = StyleSheet.create({
  detailRow: {
    borderBottomWidth: 1, borderColor: "rgba(0,0,0, 0.1)",
    paddingBottom: 10,
    margin: 5, marginBottom: 10,
  },
  detailRowText: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: "rgba(0, 0, 0, 0.48)"
  }
});
