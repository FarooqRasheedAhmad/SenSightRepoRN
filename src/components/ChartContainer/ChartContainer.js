import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { NoDataState } from "../NoDataState";
import { ActivityScoreBarChartCH, } from "../ActivityScoreBarChartCH";
import { ActivityScoreBarChart } from "../ActivityScoreBarChart";
import { Row, Col } from '../Grid'
import { AppWidgets, AppConstants, StorageUtils, getAppUsers, getLocalDate, showMessage, } from "../../utils";
import { Button, Divider } from "react-native-elements";
// import Spinner from "react-native-loading-spinner-overlay";
import { api } from "../../api";
import { sendRequest } from "../../apicall";
import { icons } from "../../assets";
import { theme } from "../../theme";
import { useFetch } from "../../hooks";


const tabsArray = [
  { title: "Activity Score", sub_title:"Activity Score", key:"activity_score" },
  { title: "Risk Score", sub_title:"Infection Risk", key:"risk_score" },
]


export class ChartContainer extends React.Component {
  state = {
    lastRiskScore: 0,
    averageRiskScore: 0,

    selectedTab: null,
    availableTabs: null,
    haltSystem: false,

    data: null,
    error: false,
    loading: false,
  }

  componentDidMount(){
    // const { timeOffset: tOffset, dateString } = getLocalDate();
    this.configureTabs();
  }

  configureTabs = async (args) => {
    const _showActivity = await StorageUtils.getValue(AppWidgets.ACTIVITY_SCORE);
    const _showRiskScore = await StorageUtils.getValue(AppWidgets.RISK_SCORE)
    
    let _availableTabs = tabsArray.map(tab => {
      if (tab.key == 'activity_score' && _showActivity == 'false') return { ...tab, hide: true };
      if (tab.key == 'risk_score' && _showRiskScore == 'false') return { ...tab, hide: true };
      return { ...tab }
    })

    let notHiddenItems = _availableTabs.filter(o => (!o.hide));

    if (!notHiddenItems || notHiddenItems.length < 1) {
      this.setState({ haltSystem: true });
      return false;
    }

    this.setState({ selectedTab: notHiddenItems[0], availableTabs: notHiddenItems }, () => this.fetchAll())

    return notHiddenItems;
  }

  async fetchAll(){
    const { timeOffset: _timeOffset, dateString } = getLocalDate();
    const { selectedTab } = this.state;
    const { seniorId, refreshCharts, statsDate, timeOffset, appType, role, navigation, refreshScreen, isShowActivityScore, isShowRiskScore, selectedGraph } = this.props
    // const tabsConfigured = await this.configureTabs();
    if (!selectedTab) return;


    let serviceUrl = '';
    if (selectedTab.key == 'risk_score') serviceUrl = api.riskScore;
    if (selectedTab.key == 'activity_score') serviceUrl = api.activityScore;
    if (seniorId) serviceUrl += `/${seniorId}`;
    serviceUrl += `?statsDate=${statsDate || dateString}`;
    serviceUrl += `&&offSetHours=${timeOffset || _timeOffset}`;

    // const serviceUrl = `${(selectedTab.key == 'risk_score') ? api.activityScore : api.riskScore}${seniorId ? `/${seniorId}` : ""}?statsDate=${statsDate ? statsDate : dateString}&&offSetHours=${timeOffset || _timeOffset}`
    this.setState({ loading: true });
    await sendRequest({ uri: serviceUrl }).then(data=>{
      this.setState({data});
      return data;
    })
    
    await this.fetchLastScore();
    
    await this.fetchAverageRiskScore();
    
    this.setState({ loading: false });
    return true;
  }

  fetchLastScore = async () => {
    const { seniorId, statsDate, timeOffset, role } = this.props
    const { timeOffset: _timeOffset, dateString } = getLocalDate();

    const uri = `${api.lastRiskScore}${role !== "senior" ? `/${seniorId}` : ""}?today=${statsDate ? statsDate : dateString}&offSetHours=${timeOffset || _timeOffset}`;

    return await sendRequest({ uri, debug: false }).then(json => {
      if (json && json.length > 0 && json[0].covidRiskScore) {
        this.setState({ lastRiskScore: json[0].covidRiskScore.covidRiskScore });
      }
      return json;
    })

  }

  fetchAverageRiskScore = async () => {
    const { timeOffset: _timeOffset, dateString } = getLocalDate();
    const { seniorId, statsDate, timeOffset } = this.props

    const uri = `${api.riskScoreAverage}${`/${seniorId}`}?today=${statsDate ? statsDate : dateString}&offSetHours=${timeOffset || _timeOffset}`;
    await sendRequest({ uri }).then(json => {
      if (json && json.length > 0 && json[0].covidRiskScore) {
        this.setState({ averageRiskScore: json[0].covidRiskScore.covidRiskScore })
      }
     return json;
    })

  }

  set_selectedTab = tab => {
    this.setState({ selectedTab: tab }, () => this.fetchAll());
  }

  processData(){
    const { loading, data, selectedTab, averageRiskScore } = this.state;
    if (!data || loading){
      // console.log(`no data available for processing: loading:${loading?'true':'false'}`);
      return {};
    }

    var processedData = [];
    let weeklyAverage = 0;
    let lastActivityScore = 0;
    let textColor = "#000";
    let lastDayData = "";

    if (selectedTab.key == 'risk_score') {
      data.forEach((element, index) => {
        if (element && element.covidRiskScore) {
          let el = element.covidRiskScore;
          processedData.push({ score: el.covidRiskScore, color: el.covidRiskScoreColor, date: el.covidTestDate, day: (index + 1), });
        }
      });
    }

    if (selectedTab.key == 'activity_score') {
      data.forEach((element, index) => {
        processedData.push({ ...element, day: (index + 1) });
      });
    }

    if (processedData && processedData.length>0) weeklyAverage = this.average(processedData);

    if (averageRiskScore) {
      if (averageRiskScore > 60) {
        lastDayData = "HIGH";
        textColor = theme.colors.red_shade_2;
      } else if (averageRiskScore <= 60 && averageRiskScore > 40) {
        lastDayData = "MED";
        textColor = theme.colors.orange_shade_1;
      } else if (averageRiskScore <= 40) {
        lastDayData = "LOW";
        textColor = theme.colors.green_color;
      }
    }

    if (selectedTab.key == 'activity_score') {
      lastActivityScore = data && data.length && data[data.length - 1].activityScore;
    }

    return { processedData, weeklyAverage, lastActivityScore, textColor, lastDayData };

  }

  average = (data) => {
    const { selectedTab } = this.state;

    let sum = 0;
    let value = 0;

    if (selectedTab.key == 'risk_score') {
      data.forEach((item) => {
        sum += item.score || 0;
        if (item.score > 0) value++;
      });
    } else {
      data.forEach((item) => {
        sum += item.activityScore || 0;
        if (item.activityScore > 0) value++;
      });
    }

    // console.log(`${sum} / ${(value || 1)}`);
    
    return Math.floor(sum / (value || 1));
  };

  RenderTabs = args => {
    const { availableTabs, selectedTab, loading } = this.state;
    if (!availableTabs) return null;

    return (<View style={styles.tabsContainer}>
      {availableTabs.map((tab, i) => {
        let isSelected = selectedTab && selectedTab.key == tab.key;

        return (
          <View style={{ ...styles.tabSubcontainer, opacity: loading ? 0.2 : 1 }} key={i}>
            <TouchableOpacity disabled={loading} onPress={() => this.set_selectedTab(tab)}>
              <Text style={[styles.buttonGroupText, { color: isSelected ? theme.colors.black : theme.colors.grey_shade_1 }]}>{tab.title}</Text>
            </TouchableOpacity>
            <View style={{ ...styles.tabIndicator, borderBottomColor: isSelected ? theme.colors.colorPrimary : "#FFF" }} />
          </View>
        )
      })}
    </View>)
  }

  RenderChart = ({ chartData }) => {
    // const value = ((data.length && !selectedChart ? data[0].activityScore : 0) * 100) / 150;
    const { selectedTab, data } = this.state;
    const { timeOffset } = this.props;
    const { timeOffset: _timeOffset, dateString } = getLocalDate();
    if (!data || !data[0]) return null;

    if (data.length === 0) return <NoDataState text="No Activity Score Available" />;

    if (selectedTab.key == 'risk_score') return <ActivityScoreBarChartCH average={this.average(chartData)} data={chartData} timeOffset={timeOffset || _timeOffset} />;

    if (data[0].activityScore !== undefined) return <ActivityScoreBarChart data={chartData} timeOffset={timeOffset || _timeOffset} />;

    return <Text style={{fontWeight:"bold", textAlign:"center", padding:15}}>No chart data available</Text>

  }

  onPressStartScreening = () => {
    this.props.navigation.navigate("ScreeningScreen", { oximterValues: null })
  }


  render() {
    const { role } = this.props
    const { loading, data, selectedTab, haltSystem, lastRiskScore, error, averageRiskScore } = this.state;
    if (!selectedTab || !data || haltSystem) return null;

    const { processedData, weeklyAverage, lastActivityScore, textColor, lastDayData, } = this.processData();

    return (<>

      <this.RenderTabs />
      {/* <Divider /> */}

      {/* {loading && <View style={{ justifyContent: "center" }}><ActivityIndicator animating={true} color={theme.colors.colorPrimary} /></View>} */}

      <View style={styles.root}>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.title}>{selectedTab.sub_title}</Text>
            <Image source={icons.question_mark_black} style={{ width: 12, height: 12, alignSelf: "center" }} />
          </View>
          {data && data.length>0 ? (
            <Text style={[styles.score_low, { color: selectedTab.key == 'risk_score' ? textColor : theme.colors.green_color },]}>
              {selectedTab.key == 'risk_score' ? lastDayData : (lastActivityScore ? lastActivityScore + "%" : "")}
            </Text>
          ) : null}
        </View>
        {/* <Divider /> */}

        <Row style={styles.descrptionView}>
          <Col>
            <Text style={{ color: theme.colors.grey_shade_1, textAlign: "center" }}>Weekly Average</Text>
            <Text style={{ fontWeight: "600", fontSize: 18, textAlign: "center" }}>{weeklyAverage || '0'}</Text>
          </Col>

          <Col flex={"auto"}><View style={{width:20}} /></Col>

          <Col>
            <Text style={{ color: theme.colors.grey_shade_1, textAlign: "center" }}>{selectedTab.key == 'risk_score' ? "Last Risk Score " : "Last Week "}</Text>
            <Text style={{ fontWeight: "600", fontSize: 18, textAlign: "center" }}>{selectedTab.key == 'risk_score' ? lastRiskScore : "N/A"}</Text>
          </Col>
        </Row>

        {/* {loading ? <View style={{height:200}}><NoDataState text="Loading..." /></View> : null} */}
        {loading ? <View style={{ height: 200 }}><NoDataState text="Loading..."><ActivityIndicator size="large" animating={true} color={theme.colors.colorPrimary} /></NoDataState></View> : null}
        {error ? <NoDataState text="Error in Rendering Charts" /> : null}

        {!loading && !error && <this.RenderChart chartData={processedData} />}

        {(role === "senior" && selectedTab.key == 'risk_score') &&
          <Button
            raised type="solid" title="Start Screening"
            icon={{ name: "edit", color: theme.colors.white, size: 22, }}
            onPress={()=>this.onPressStartScreening()}
            containerStyle={{ alignSelf: "center" }}
            titleStyle={{ fontFamily: theme.fonts.SFProSemibold, fontSize: 17, paddingRight: 10 }}
            buttonStyle={{ borderRadius: 50, backgroundColor: theme.colors.colorPrimary, }}
          />
        }

      </View>

      </>
    )
  }
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgba(248, 248, 248, 0.92)",
    margin: 8,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: theme.fonts.SFProBold,
    color: theme.colors.black,
    margin: 16,
    marginLeft: 32,
    justifyContent: "center",
  },
  descrptionView: { marginHorizontal: 32, marginVertical: 8 },
  descriptionText: { marginBottom: 8, fontWeight: "600" },
  averageView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
    alignItems: "baseline",
  },
  average: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  buttonGroupText: {
    fontSize: 22,
    fontWeight: "600",
    color: theme.colors.grey_shade_1,
    fontFamily: theme.fonts.SFProBold,
    paddingVertical: 6
  },
  selectedButton: {
    backgroundColor: "transparent",
    borderBottomColor: theme.colors.colorPrimary,
    borderBottomWidth: 3,
  },
  selectedButtonText: {
    color: theme.colors.black,
    fontFamily: theme.fonts.SFProBold,
  },
  progressChartRoot: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    padding: 8,
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
  },
  headerTitle: {
    color: theme.colors.black,
    fontFamily: theme.fonts.SFProBold,
    fontSize: 22,
    flexGrow: 1,
  },
  score_low: {
    color: theme.colors.green_color,
    fontFamily: theme.fonts.SFProBold,
    fontSize: 36,
    textAlign: "right",
    marginRight: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10
  },
  tabSubcontainer: {
    width: '50%',
    alignItems: 'center',
    paddingBottom: 5,
    justifyContent: 'center',
    zIndex: 999
  },
  tabIndicator: {
    width: '90%',
    // borderBottomColor: theme.colors.colorPrimary,
    borderBottomWidth: 3,
  }
});
