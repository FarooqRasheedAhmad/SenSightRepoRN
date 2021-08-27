import { FlatList, StyleSheet, Platform, View, StatusBar, Text, Image, TouchableOpacity, Modal, ActivityIndicator, ScrollView,Linking } from "react-native";
import { Contact, SearchBar, NavigationHeader, Row, Col } from "../../components";
import React, { useState, useEffect } from "react";
import { theme } from "../../theme";
import { icons } from "../../assets";
import { GET_CARE_CIRCLE, UPDATE_CARE_CIRCLE, ADD_CARE_CIRCLE } from '../../api'
import { sendRequest } from '../../apicall'
import { AppConstants, StorageUtils } from "../../utils";
import { CareCircleForm } from '../../components/Preferences';
import Contacts from "react-native-contacts";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";

export const CareCircle = props => {
  const [busy, setBusy] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [searchKw, setSearchKw] = useState(null);

  useEffect(() => {
    if (Platform.OS !== "ios") {
      StatusBar.setTranslucent(false);
      StatusBar.setBackgroundColor(theme.colors.colorPrimary);
    }
    getData();
  }, [])

  const searchFilter = text => {
    setSearchKw((!text || text.length < 1) ? null : text);
  };

  const doAdd = async (values) => {
    // let fd = new FormData();
    // for (let a in values) fd.append(a, values[a]);

    setBusy(true);
    setError(null);

    sendRequest({ uri: ADD_CARE_CIRCLE, method: 'post', body: JSON.stringify(values), debug:true }).then(result => {
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
    let uri = String(GET_CARE_CIRCLE).replace("{seniorId}", seniorId);

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
      return itm.memberName ? itm.memberName.toLowerCase().includes(searchKw.toLowerCase()) : false;
    })
  }

  const getContacts = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          'title': 'Contacts',
          'message': 'Sensights app would like to view your contacts.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Contacts.getAll((err, conts) => {
          if (err === "denied") {
            console.log(err)
          } else {
            const sliced = conts.slice(1, 10);
            setContacts([...sliced]);
          }
        });
      } else {
        console.log("Contacts permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const makeCall = (phone) => () => {
      RNImmediatePhoneCall.immediatePhoneCall(phone);
  };

  const sendSMS = (name, phone) => () => {
    const msgBody = `Hi ${name}, \n`;
      if (Platform.OS === "ios") Linking.openURL(`sms:${phone}&body=${msgBody}`);
      else Linking.openURL(`sms:${phone}?body=${msgBody}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.white, paddingTop: Platform.OS == 'ios' ? 44 : 0 }}>
      <NavigationHeader title={'Care Circle'} leftText={'Back'} navigation={props.navigation} />

      <Row>
        <Col flex="auto"><SearchBar searchFilter={searchFilter} /></Col>
        <Col valign="center"><TouchableOpacity onPress={() => setShowModal({ type: 'form' })} activeOpacity={0.6} style={{ marginTop: 5 }}><Image source={icons.add_green} /></TouchableOpacity></Col>
      </Row>

      {error && <Text style={{ color: "#F00", fontWeight: "bold", padding: 10 }}>{error}</Text>}
      {busy && <ActivityIndicator size={32} animating={true} />}

      <ScrollView>
        {/* <Text style={styles.heading}>Caregivers</Text> */}
        {getFilteredData().map((item, i)=>{
          return <TouchableOpacity onPress={() => setShowModal({type:'details', data:item})} activeOpacity={0.5}><Contact givenName={item.memberName} _thumbnailPath={icons.cicle_default} key={i} /></TouchableOpacity>
        })}
      </ScrollView>


      <Modal animationType="slide" transparent={true} visible={showModal !== false} onRequestClose={() => setShowModal(false)} >
        <TouchableOpacity onPress={() => setShowModal(false)} style={{ backgroundColor: "rgba(0,0,0,0.5)", flex: 1, alignItems: "center", justifyContent: "center", padding: 5 }} activeOpacity={1}>

          {showModal && showModal.type == 'details' && <>
            <View style={{ paddingHorizontal: 15, paddingVertical: 20, backgroundColor: "#FFF", borderRadius: 10, width: "100%" }}>
              <Row style={{marginBottom:20}}><Col align="center" flex="auto"><Image source={icons.tab_profile} style={styles.imageContainer} /></Col></Row>

              <Row style={styles.detailRow}>
                <Col flex={200}><Text style={styles.detailRowText}>Name: </Text></Col>
                <Col flex="auto"><Text style={{ ...styles.detailRowText, fontWeight: "bold" }}>{showModal.data.memberName}</Text></Col>
              </Row>
              <Row style={styles.detailRow}>
                <Col flex={200}><Text style={styles.detailRowText}>Relation: </Text></Col>
                <Col flex="auto"><Text style={{ ...styles.detailRowText, fontWeight: "bold" }}>{showModal.data.relation}</Text></Col>
              </Row>
              <Row style={styles.detailRow}>
                <Col flex={200}><Text style={styles.detailRowText}>Contact #: </Text></Col>
                <Col flex="auto"><Text style={{ ...styles.detailRowText, fontWeight: "bold" }}>{showModal.data.contactno}</Text></Col>
              </Row>
              <Row style={styles.detailRow}>
                <Col flex={200}><Text style={styles.detailRowText}>Emergency Contact: </Text></Col>
                <Col flex="auto"><Text style={{ ...styles.detailRowText, fontWeight: "bold" }}>{showModal.data.isEmergencyContact ? "YES" : "NO"}</Text></Col>
              </Row>
              <Row style={styles.detailRow}>
                <Col flex={200}><Text style={styles.detailRowText}>Address: </Text></Col>
                <Col flex="auto"><Text style={{ ...styles.detailRowText, fontWeight: "bold" }}>{showModal.data.address}</Text></Col>
              </Row>

              <TouchableOpacity onPress={makeCall(showModal.data.contactno)} activeOpacity={0.8} style={{ ...styles.detailRow, marginVertical: 5, width: "100%" }}>
                <Text style={{ ...theme.palette.buttonText, color: theme.colors.colorPrimary, fontSize:20 }}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={sendSMS(showModal.data.memberName,showModal.data.contactno)} activeOpacity={0.8} style={{ ...styles.detailRow, marginVertical: 5, width: "100%" }}>
                <Text style={{ ...theme.palette.buttonText, color: theme.colors.colorPrimary, fontSize: 20 }}>Message</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity onPress={() => setShowModal(false)} activeOpacity={0.8} style={{ ...styles.detailRow, borderBottomWidth:0, marginBottom:0, width: "100%" }}>
                <Text style={{ ...theme.palette.buttonText, color: 'red', fontSize: 20 }}>Remove</Text>
              </TouchableOpacity> */}


            </View>
            <TouchableOpacity onPress={() => setShowModal(false)} activeOpacity={0.8} style={{ ...theme.palette.nextButton, backgroundColor: "#FFF", marginTop: 15, width: "100%" }}>
              <Text style={{ ...theme.palette.buttonText, color: theme.colors.colorPrimary, fontSize: 20 }}>Cancel</Text>
            </TouchableOpacity>
          </>}

          {showModal && showModal.type == 'form' && <CareCircleForm busy={busy} onSubmit={doAdd} />}

        </TouchableOpacity>
      </Modal>


    </View>
  )

};

const styles = StyleSheet.create({
  detailRow: {
    borderBottomWidth: 1, borderColor: "rgba(0,0,0, 0.1)",
    paddingBottom: 10,
    margin: 5, marginBottom: 10,
  },
  detailRowText: {
    fontFamily: theme.fonts.SFProRegular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: "#000"
  },
  imageContainer: {
    height: 40,
    width: 40,
    marginLeft: 10,
    borderRadius: 40,
    backgroundColor: theme.colors.grey_shade_3
  },
  heading: {
    fontFamily: theme.fonts.SFProBold,
    fontSize: 22,
    letterSpacing: 0.35,
    lineHeight: 28,
    margin: 14
  }
});
