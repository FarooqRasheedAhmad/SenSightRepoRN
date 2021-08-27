import React, { Component } from "react";
import { Image, SafeAreaView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";

import { NavigationHeader, AssessmentListItem } from "../../../components/";
import { Divider } from "react-native-elements";
import { HeaderBackButton } from "react-navigation-stack";
import { ScrollView } from "react-native-gesture-handler";
import Snackbar from "react-native-snackbar";
import { icons } from "../../../assets";
import { styles } from "./styles";
import { theme } from "../../../theme";
import { sendRequest } from '../../../apicall'
import { ADD_RISK_ASSESMENT } from '../../../api'
import { AppConstants, StorageUtils } from "../../../utils";


const { heading, heading2, container, questionTextStyle, resultHeading, resultSubtHeading, divider, resultInstruction, bullet, } = styles;

let self;
export class InfectionAssessment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      busy:false,
      questionIndex: 0,
      checked: false,
      checkedItemIndex: -1,
      showResult: false,
      assessmentItems: [
        {
          question: "Are you experiencing any of the following new or worsening symptoms?",
          type: 'checkbox',
          answers: [
            {
              value: "Fever or chills",
              isSelected: false,
            },
            {
              value: "Difficulty breathing or shortness of breath",
              isSelected: false,
            },
            {
              value: "Cough",
              isSelected: false,
            },
            {
              value: "Sore throat, trouble Swallowing",
              isSelected: false,
            },
            {
              value: "Runny nose/stuffy nose or nasal congestion",
              isSelected: false,
            },
            {
              value: "Decrease or loss of smell or taste",
              isSelected: false,
            },
            {
              value: "Nausea, vomiting, diarrhea, abdominal pain",
              isSelected: false,
            },
            {
              value: "Not feeling well, extreme tiredness, sore muscles",
              isSelected: false,
            },
            {
              value: "None of above",
              isSelected: false,
            },
          ],
        },
        {
          question: "Have you travelled outside of Canada in the past 14 days?",
          type: 'radio',
          answers: [
            { value: "Yes", isSelected: false },
            { value: "No", isSelected: false },
          ],
        },
        {
          question: "Have you had close contact with a confirmed or probable case of COVID-19",
          type: 'radio',
          answers: [
            { value: "Yes", isSelected: false },
            { value: "No", isSelected: false },
          ],
        },
      ],
    };
    self = this;
  }

  onPressAnswerItem = (index) => {
    const { assessmentItems, questionIndex } = this.state;

    const current_q = assessmentItems[questionIndex];

    let selectedItem = current_q.answers;
    const type = current_q.type;

    if(type=='checkbox'){ }

    if(type=='radio'){ // clear all selection/
      selectedItem = selectedItem.map(row => ({ ...row, isSelected: false }))
    }

    if (questionIndex == 0 && index == 8) { // none of above is pressed, clear all selection
      selectedItem = selectedItem.map(row => ({ ...row, isSelected: false }))
    }
    else if (questionIndex == 0 && index != 8){ // uncheck if other option is selected
      selectedItem[8].isSelected = false;
    }

    // select current clicked item
    selectedItem = selectedItem.map((row, i) => {
      if (i == index) return { ...row, isSelected:true }
      return row;
    })

    // console.log("selectedItem: ", selectedItem);

    Object.assign(current_q, { answers: selectedItem })
    let _assessmentItems = assessmentItems.slice();
        _assessmentItems[questionIndex] = current_q;

    this.setState({ assessmentItems: _assessmentItems });


    return;

    

    if (questionIndex == 0 && index==8){ // none of above is pressed, clear all selection
      selectedItem = selectedItem.map(row => ({ ...row, isSelected:false}))
    }

    if (questionIndex === 0) {
      selectedItem = selectedItem.map((item, itemIndex) => {
        return {
          value: item.value,
          isSelected: index === itemIndex ? true : false,
        };
      });
    }
    else if(questionIndex === 1){
      selectedItem = selectedItem.map((item, itemIndex) => {
        return {
          value: item.value,
          isSelected: index === itemIndex ? true : false,
        };
      });
    }
    else
    {
      selectedItem = selectedItem.map((item, itemIndex) => {
        return {
          value: item.value,
          isSelected: index === itemIndex ? true : false,
        };
      });
    }

    this.setState((prevState) => {
      let assessmentItemsArray = prevState.assessmentItems;
      assessmentItemsArray[questionIndex] = {
        question: prevState.assessmentItems[questionIndex].question,
        answers: selectedItem,
      };
      return { assessmentItems: assessmentItemsArray };
    });
  };

  assessmentValidation = () => {
    const { questionIndex, assessmentItems } = this.state;
    let selectedItem = assessmentItems[questionIndex].answers;
    const listHasPilots = selectedItem.some((item) => item.isSelected == true);

    return listHasPilots;
  };

  onPressNextButton = async() => {
    const { questionIndex, assessmentItems } = this.state;

    if (!this.assessmentValidation()){
      Snackbar.show({
        text: questionIndex === 0 ? "Please select an option" : "Please select atleast one option",
        duration: Snackbar.LENGTH_LONG,
      });
      return;
    }

    if (questionIndex === assessmentItems.length - 1){ // ended
      // console.log("assessmentItems: ", assessmentItems);
      this.setState({ busy: true })

      const seniorId = await StorageUtils.getValue(AppConstants.SP.USER_ID);

      const results = { seniorId };
      for (let a=0; a<assessmentItems.length; a++){
        let answers = assessmentItems[a].answers;
        let ansArr = [];
        for (let ii=0; ii<answers.length; ii++){
          if (answers[ii].isSelected) ansArr.push(ii+1);
        }
        Object.assign(results, { [`answerno${a + 1}`]: ansArr.toString() })
      }

      if (results.answerno1 == '9') results.answerno1 = 'no';
      
      results.answerno2 = results.answerno2 == '1' ? 'yes' : 'no';
      results.answerno3 = results.answerno3 == '1' ? 'yes' : 'no';


      // this.setState({ busy: false })
      // console.log("results: ", results);
      // return;
      
      // curl - X POST "https://stage01.sensights.ai:8080/api/Seniors/RiskAssessment/add" 
      // - H "accept: application/json" 
      // - H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b3RvbmFAZ2V0bmFkYS5jb20iLCJqdGkiOiJiNDlkYmM0Zi1iYTc3LTRiYTQtYjAzZi05YTRmZWVlYmU1OTIiLCJpYXQiOjE2MTMxMjEzNzIsInJvbCI6InNlbmlvciIsImlkIjoiMTkzIiwibmJmIjoxNjEzMTIxMzcxLCJleHAiOjE2MjM0ODkzNzEsImlzcyI6IlNlblNpZ2h0cy1hcGkiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvIn0.kmgjlku27LEFH7UKGa1ZrmCm4jx4o-ppv8qINOmVEbs" 
      // - H "Content-Type: application/json" 
      // - d "{ \"seniorId\": \"193\", \"answerno1\": \"1,2,6,7,8\", \"answerno2\": \"2\", \"answerno3\": \"3\"}"      


     await sendRequest({
          uri: ADD_RISK_ASSESMENT,
          method: "post",
          body: JSON.stringify(results)
        }).then(r=>{
          console.log("result: ", r);        
          this.setState({ busy: false, showResult:true })
        }).catch(err=>{
          console.log("ERROR: ", err);
          this.setState({ busy: false })
        })
      

      // let result = assessmentItems.map((row, i)=>{ })

      return;
    }
    
    this.setState({ questionIndex: questionIndex + 1, });

    return;

    if (this.assessmentValidation()) {
      if (questionIndex < assessmentItems.length - 1) {
        this.setState({ questionIndex: questionIndex + 1, });
      } else if (questionIndex === assessmentItems.length - 1) {
        this.setState({ showResult: true });
      }
    }
    else {
      Snackbar.show({
        text: questionIndex === 0 ? "Please select an option" : "Please select atleast one option",
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  goToHomeScreen = () => {
    this.props.navigation.goBack();
  };

  renderQuestions = () => {
    const { questionIndex, assessmentItems } = this.state;
    const questionItem = assessmentItems[questionIndex];
    const buttonLable = questionIndex !== 2 ? theme.strings.next : theme.strings.submit;

    return (
      <View style={container}>
        <Text style={heading}>{`Question ${questionIndex + 1}`}</Text>
        <Text style={questionTextStyle}>{questionItem.question}</Text>
        <ScrollView style={{ width: "100%" }}>
          <View style={{ marginTop: 26 }}>
            {questionItem.answers.map((item, index) => {
              return (
                <AssessmentListItem
                  type={questionItem.type}
                  key={index}
                  title={item.value}
                  callBackFunction={this.onPressAnswerItem}
                  isSelected={item.isSelected}
                  // icon={item.isSelected ? icons.checked_icon : icons.empty}
                  index={index}
                />
              );
            })}
          </View>
        </ScrollView>
        {this.renderButton(buttonLable, this.onPressNextButton)}
      </View>
    );
  };

  renderAssessmentResult = () => {    
    const { assessmentItems } = this.state;    

    if (assessmentItems[0].answers[8].isSelected && assessmentItems[1].answers[1].isSelected && assessmentItems[2].answers[1].isSelected)
      return theme.strings.result_no_test_needed;
    else
      return theme.strings.result_test_needed;
  };

  renderAssessmentResultIcon = () => {
    const { assessmentItems } = this.state;    
   
    if (assessmentItems[0].answers[8].isSelected && assessmentItems[1].answers[1].isSelected && assessmentItems[2].answers[1].isSelected)
      return icons.icon_tick;
    else
      return icons.icon_cross;   
  };

  renderButton = (buttonLable, callBackMethod) => {
    const { busy } = this.state;

    return (
      <View style={{ height: 60, alignItems: "center", bottom: 0, width: "100%", justifyContent: "flex-end", }}>
        <TouchableOpacity onPress={callBackMethod} activeOpacity={0.8} style={[theme.palette.nextButton, { width: 160 }]}>
          {busy && <ActivityIndicator color="#FFFFFF" />}
          {!busy && <Text style={theme.palette.buttonText}>{buttonLable}</Text>}
        </TouchableOpacity>
      </View>
    );
  };
  
  rendorAssessmentResult = () => {
    const { questionIndex } = this.state;
    const buttonLable = theme.strings.home;
    const instructionArray = theme.strings.infection_result_array;
    const result_screen_bottom=theme.strings.result_screen_bottom;
    const result_screen_bottom_link_one=theme.strings.result_screen_bottom_link_one;
    const result_screen_bottom_link_two=theme.strings.result_screen_bottom_link_two;

    return (
      <View style={container}>
        <ScrollView style={{ width: "100%", }}>
          <View style={{justifyContent:'center', alignItems:'center'}}><Image source={this.renderAssessmentResultIcon()} style={{ marginTop: 10 }} /></View>
          <Text style={resultSubtHeading}>{this.renderAssessmentResult()}</Text>
          <Divider style={divider} />
          <View style={{ margin: 10 }}>
            <Text style={resultInstruction}>All of us have a responsibility to help prevent the spread of COVID-19.</Text>
            <Text style={[resultInstruction, { marginTop: 20, marginBottom: 20 }]}>There are steps you can take to protect yourself and others.</Text>
            {instructionArray.map((item, i) => {
              return (
                <View style={{ flexDirection: "row", margin: 10 }} key={i}>
                  <Text style={bullet}>{"\u2022" + " "}</Text>
                  <Text style={[resultInstruction]}>{item}</Text>
                </View>
              );
            })}

          </View>
          {this.renderButton(buttonLable, this.goToHomeScreen)}
          <View style={{justifyContent:'center', marginVertical:20, marginHorizontal:5}}>
            <Text style={{fontSize:8,textAlign: 'center', alignItems: 'center',fontWeight:'bold'}}>{result_screen_bottom}</Text>
            <Text style={{fontSize:8,marginVertical:5, color:'blue',textAlign: 'center',}}>{result_screen_bottom_link_one}</Text>
            <Text style={{fontSize:8,color:'blue',textAlign: 'center',}}>{result_screen_bottom_link_two}</Text>
          </View>
        </ScrollView>

      </View>
    );
  };

  goBackHandle = (navigation) => {
    const { questionIndex } = this.state;
    if (questionIndex === 0) {
      navigation.goBack();
    } else {
      this.setState((prevState) => {
        return {
          questionIndex: prevState.questionIndex - 1,
          showResult: false,
        };
      });
    }
  };


  render() {
    const { showResult } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <NavigationHeader leftText={'Back'} navigation={this.props.navigation} />
        {showResult ? this.rendorAssessmentResult() : this.renderQuestions()}
      </SafeAreaView>
    );
  }


  static navigationOptions = ({ navigation }) => {
    return {
      headerBackTitle: null,
      title: navigation.getParam(
        "title",
        theme.strings.infection_risk_string
      ),
      headerTintColor: theme.colors.white,
      headerTitleStyle: {
        fontSize: 17,
      },
      headerStyle: { backgroundColor: theme.colors.colorPrimary},
      headerLeft: () => (
        <HeaderBackButton
          tintColor={theme.colors.white}
          onPress={() => {
            if (self && self.goBackHandle) {
              self.goBackHandle(navigation);
            } else {
              navigation.goBack();
            }
          }}
        />
      ),
    };
  };
}
