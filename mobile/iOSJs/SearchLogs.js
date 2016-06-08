/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 'user strict'

var React = require('react-native')
import {PropTypes } from 'react';
import {getStreams} from 'common/webServices/dropdownList'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as itemActionCreators from 'common/webServices/itemService';
import {logEventsConfig, filterLogParams} from 'common/AWSConfig/config.js';
import {urlobj} from 'common/apiurls';
import {serverUrl} from 'common/constants/loginConstants.js'

var DismissKeyboard = require('dismissKeyboard');
var deepcopy = require("deepcopy");

var Subscribable = require('Subscribable');

 var {
   StyleSheet,
   Image,
   ListView,
   View,
   TextInput,
   TouchableHighlight,
   ListView,
   Text,
   Component,
   ActionSheetIOS,
   Switch,
   ActivityIndicatorIOS,
   DatePickerIOS,
   TouchableWithoutFeedback,
   TouchableOpacity,
   LayoutAnimation,
   SegmentedControlIOS

 } = React;

 var styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: 'white',
     justifyContent: 'center',
   },
   listcontainer: {
     flex: 1,
     marginTop: 0,
     backgroundColor: 'white',
   },
   buttonsContainer: {
     flex: 1,
     backgroundColor: 'white',
     flexDirection: 'row',
     justifyContent: 'center',
     padding: 3,
   },
   textContainer: {
     flex: 1,
   },
   loadingFooterContainer: {
     flex: 1,
     backgroundColor: 'white',
     flexDirection: 'row',
     justifyContent: 'center',
     padding: 5,
   },
   separator: {
     height: 1,
     //  backgroundColor: '#dddddd'
     backgroundColor: '#fefefe'
   },
   loadingText: {
     fontSize: 14,
     color: 'gray'
   },
   title: {
     fontSize: 14,
     color: '#0d0d0d'
   },
   liveText: {
     fontSize: 18,
     color: '#0d0d0d',
     textAlign: 'center',
     padding: 4,
     marginLeft: 10
   },
   log: {
     fontSize: 12,
     color: '#656565'
   },
   rowContainer: {
     flexDirection: 'row',
     padding: 10
   },
   sectionHeaderContainer: {
     marginTop: 64,
     marginRight: 0,
     marginLeft: 0,
     marginBottom: 0,
     backgroundColor: '#fefefe',
    justifyContent: 'center',
   },
   sectionContainer: {
     flexDirection: 'row',
     marginRight: 0,
     marginLeft: 0,
     marginTop: 0, // 64
     backgroundColor: '#C9C9C9',
   },
   searchInput: {
     height: 31,
     flex: 1,
     marginRight: 5,
     marginLeft: 5,
     fontSize: 15,
     marginTop: 5,
     marginBottom: 5,
     borderWidth: 1,
     borderColor: '#b4b4b4',
     borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  rowStyle: {
     backgroundColor: '#CABEAD',
  },
  evenRowStyle: {
     backgroundColor: '#F0E197',
  },
button: {
  height: 25,
  marginLeft: 5,
  backgroundColor: '#F8CA1E',
  borderColor: 'gray',
  borderWidth: 1,
  borderRadius: 3,
  justifyContent: 'center'
},
buttonText: {
  fontSize: 17,
  textAlign: 'center',
  margin: 10,
  color: 'black'
},
centering: {
    alignItems: 'center',
    // justifyContent: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  gray: {
    backgroundColor: '#cccccc',
  },
  DateInput : {
    flex: 1,
    height: 21,
    marginLeft: 3,
    marginRight: 3,
    backgroundColor: '#F8CA1E',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 3,
  },
  datePicker : {
    borderTopWidth:1,
    position:'absolute',
    bottom:0,
    right:0,
    left:0,
    height : 220,
    borderColor:'#CCC',
    backgroundColor:'#FFF',
  },
 });

 var BUTTONS = [
  'Start Date',
  'End Date',
  'Cancel',
];
var CANCEL_INDEX = 2;

class SearchLogs extends Component {

constructor(props) {
  super(props);
  this.state = {
    dataSource: new ListView.DataSource({
      // rowHasChanged: (row1, row2) => row1 !== row2,
      rowHasChanged: function (row1, row2) {
           console.log('row1', row1, 'row2', row2);
           return row1 !== row2;
        },
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }),
    loading: false,
    resultArray:[],
    isSearching: false,
    searchString : "",
    isLiveLogs : false,
    getLogEvents : {},
    eventSwitchIsOn: false,
    isPagingNext: false,
    isPagingPrev: false,
    localLogEventsConfig: {},
    startDateString: "",
    EndDateString: "",
    datePickerMode: 'hidden',
    startDate: new Date(),
    endDate : new Date(),
    selectedDatePicker: 'start', // or 'end'
    isSearchingWithDateFilter: false,
    mixins: [Subscribable.Mixin],
    isAdvanceFilterOn: false,
    selectedIndex: 0
  }
 }

 componentWillMount (){
   this.props.events.addListener('rightButtonPressed', this.onAdvancePress.bind(this));

   let userName = this.props.userName;
   let password = this.props.password;
   let url = "http://" + userName +':' + password + '@' + serverUrl + urlobj.getItems
    this.props.itemactions.getItems(url,undefined, logEventsConfig,this.successcb);
    this.setState({ loading: true });
    // var _getLogEvents = {}
    //  this.props.itemactions.getLiveLogs(urlobj.getLiveLogs,_getLogEvents,this.successcb);
    //  this.setState({ isLiveLogs: true });
    //  this.props.itemactions.getFilteredLogs(urlobj.getFilterLogEvents,undefined, filterLogParams,this.successcb);
 }

 componentDidMount() {
  //  this.setState({searchString : "TRACE PerformanceMonitorInterceptor"})
  //  console.log("searchString = " + this.state.searchString);
 }

 onAdvancePress(){
   console.log('onAdvancePress');
       // Spring
    var CustomLayoutSpring = {
        duration: 400,
        create: {
          type: LayoutAnimation.Types.spring,
          property: LayoutAnimation.Properties.scaleXY,
          springDamping: 0.7,
        },
        update: {
          type: LayoutAnimation.Types.spring,
          springDamping: 0.7,
        },
      };

    // Linear with easing
     var CustomLayoutLinear = {
        duration: 200,
        create: {
          type: LayoutAnimation.Types.linear,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.curveEaseInEaseOut,
        },
      };
      LayoutAnimation.configureNext(CustomLayoutSpring);
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
       this.setState({
           isAdvanceFilterOn: !(this.state.isAdvanceFilterOn)
       });
       console.log("isAdvanceFilterOn");
       console.log(this.state.isAdvanceFilterOn);
    }

 componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps");
    if(this.state.isPagingNext === true) { // paging Next, Prev
      if(nextProps.items[0].events.length) { // if dtata is there, update tokens and reload list
        this.setState({
          isPagingNext: false,
          localLogEventsConfig: {
            'nextForwardToken':nextProps.items[0].nextForwardToken,
            'nextBackwardToken': nextProps.items[0].nextBackwardToken
          },
          dataSource: this.state.dataSource.cloneWithRows(nextProps.items[0].events)
        });
      } else {
        this.setState({
          isPagingNext: false,
        });
      }
    }
    else if(this.state.isLiveLogs === true) { // live logs
      var index = nextProps.items.length > 0 ? nextProps.items.length -1 : 0
      let result = nextProps.items[index].events
      // modify code to append live data and unscribe live logs
      if (nextProps.items[index].events.length > 0 ) {
        index = nextProps.items.length > 0 ? nextProps.items.length -1 : 0
      }
      this.setState({
        resultArray: this.state.resultArray.concat(result),
        dataSource: this.state.dataSource.cloneWithRows(this.state.resultArray),
        loading: false,
        localLogEventsConfig: {
          'nextForwardToken':nextProps.items[0].nextForwardToken,
          'nextBackwardToken': nextProps.items[0].nextBackwardToken
        }
      });
    } else if(this.state.isSearchingWithDateFilter === true) { // search logs
     this.setState({
       isSearching: false,
       dataSource: this.state.dataSource.cloneWithRows(nextProps.items[0].events),
       loading: false,
       isSearchingWithDateFilter: false
     });
   }
     else if(this.state.isSearching === true) { // search logs
     this.setState({
       isSearching: false,
       dataSource: this.state.dataSource.cloneWithRows(nextProps.items[0].events),
       loading: false
     });
   } else { // default logs
    this.setState({
      localLogEventsConfig: {
        'nextForwardToken':nextProps.items[0].nextForwardToken,
        'nextBackwardToken': nextProps.items[0].nextBackwardToken
      },
        dataSource: this.state.dataSource.cloneWithRows(nextProps.items[0].events),
        loading: false,
      });
   }
 }

 successcb(resJson){
   console.log('in success block');
 }

 rowPressed(guid) {
   console.log('row pressed' + {guid});
 }

 onSearchTextChangedEvent(event) {
   this.setState({ searchString: event.nativeEvent.text });
  }

  onSearchFocus(event) {
    console.log('test begin editng');
    this.setState({datePickerMode:'hidden'});
  }
  onStartDateTextChangedEvent(event) {
    this.setState({ startDateString: event.nativeEvent.text });
   }

  onkeyPressEvent(event) {
    if(event.nativeEvent.key === "Enter"){
          console.log("search query = " + this.state.searchString);
          console.log(this.state.isLiveLogs);
          this.turnOffLiveLogs();

          this.setState({
            datePickerMode:'hidden',
            loading: true,
            dataSource: this.state.dataSource.cloneWithRows([]),
            isSearching : true,
          });

          filterLogParams.filterPattern = this.state.searchString;

          switch (this.state.selectedIndex) {
            case 0:
            let userName = this.props.userName;
            let password = this.props.password;
            let url = "http://" + userName +':' + password + '@' + serverUrl + urlobj.getFilterLogEvents
              this.props.itemactions.getFilteredLogs(url,undefined, filterLogParams,this.successcb);
              break;
            case 2:
            case 3:
            case 4:
              this.doneDatePicker();
              break;
            default:

          }
    }
   }

  epochToJsDate(incomingUTCepoch){
      var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
      date.setUTCSeconds(incomingUTCepoch / 1000);
      return date.toLocaleString() //date.toGMTString()
   }

   onFilter() {
     console.log('Filter');
     this.showActionSheet();
   }

   showActionSheet() {
       ActionSheetIOS.showActionSheetWithOptions({
         options: BUTTONS,
         cancelButtonIndex: CANCEL_INDEX,
       },
       (buttonIndex) => {
         this.setState({ clicked: BUTTONS[buttonIndex] });
       });
     }

     onNextPressed() {
      console.log('**Next**');
      console.log(this.state.localLogEventsConfig);
      this.turnOffLiveLogs();
      this.setState({
        isPagingNext: true,
        // dataSource: this.state.dataSource.cloneWithRows([])
      });

      let userName = this.props.userName;
      let password = this.props.password;
      let url = "http://" + userName +':' + password + '@' + serverUrl + urlobj.getItems
      this.props.itemactions.getItems(url,'Next', this.state.localLogEventsConfig, this.successcb);
     }

     onPrevPressed() {
       console.log('**Prev**');
       console.log(this.state.localLogEventsConfig);
       this.turnOffLiveLogs();
       this.setState({
         isPagingNext: true,
         //dataSource: this.state.dataSource.cloneWithRows(['1'])
       });

       let userName = this.props.userName;
       let password = this.props.password;
       let url = "http://" + userName +':' + password + '@' + serverUrl + urlobj.getItems
       this.props.itemactions.getItems(url,'Prev', this.state.localLogEventsConfig, this.successcb);
     }

     showLiveLogs(value) {
       console.log('***Live Log***');
       console.log(value);
       if (value === true) {
         this.subscribeLiveLogs();
          this.setState({eventSwitchIsOn: true})
       } else {
         this.unsubscribeLiveLogs();
          this.setState({eventSwitchIsOn: false})
       }
     }

     subscribeLiveLogs() {
       console.log('LiveLog subscribe...');
       //  this.setState({
      //   // loading: true,
      //    dataSource: this.state.dataSource.cloneWithRows([])
      //  });
       console.log('dataSource::-');
       console.log(this.state.dataSource);
       var _getLogEvents = {}
       let userName = this.props.userName;
       let password = this.props.password;
       let url = "http://" + userName +':' + password + '@' + serverUrl + urlobj.getLiveLogs
        this.props.itemactions.getLiveLogs(url, _getLogEvents,this.successcb);
        this.setState({
           isLiveLogs: true,
           loading: true,
           dataSource: this.state.dataSource.cloneWithRows([]),
         });
     }

     unsubscribeLiveLogs() {
       this.setState({ isLiveLogs: false });
       this.props.LiveLogHandler.LiveLogHandler.unsubscribe();
       console.log('\n\n****** unsubscribeLiveLogs **********\n\n');
     }

     turnOffLiveLogs() {
       if (this.state.isLiveLogs === true) {
         this.unsubscribeLiveLogs();
         console.log('turnOffLiveLogs: done');
       }
       this.setState({eventSwitchIsOn: false});
     }

renderFooter() {
   if (this.state.loading) {
   return (
     <View style={styles.loadingFooterContainer}>
       <ActivityIndicatorIOS
         animating={true}
         size={'small'} />
        <Text style={styles.loadingText}> Loading... </Text>
     </View>);
   } else {
     return null;
   }
 }

 renderRow(rowData, sectionID, rowID) {
   //{ timestamp: 1462275978058, message: 'Exception in thread "ActiveMQ InactivityMonitor Worker" ', ingestionTime: 1462275983749 }
   var time = this.epochToJsDate(rowData.timestamp)
   var message = rowData.message
   var ingestionTime  = this.epochToJsDate(rowData.ingestionTime)
   let rowStyle = rowID % 2 === 0 ?  styles.rowStyle : styles.evenRowStyle
   return (
 <TouchableHighlight onPress={() => this.rowPressed(rowData)}
     underlayColor='#dddddd' style={rowStyle}>
   <View>
     <View style={styles.rowContainer}>
       <View  style={styles.textContainer}>
         <Text style={styles.title}>timestamp:
            <Text style={styles.log}>{time}</Text>
            <Text style={styles.title}>, message: </Text>
            <Text style={styles.log}>{message}</Text>
            <Text style={styles.title}>, ingestionTime: </Text>
            <Text style={styles.log}>{ingestionTime}</Text>
         </Text>
       </View>
     </View>
     <View style={styles.separator}/>
   </View>
 </TouchableHighlight>
 );
}

renderSearchBar() {
  return (
    <View style={styles.sectionContainer}>
      <TextInput style={styles.searchInput}
        placeholder='Search'
        value = {this.state.searchString}
        onChange={this.onSearchTextChangedEvent.bind(this)}
        keyboardType = 'default'
        keyboardAppearance = 'dark'
        clearButtonMode = 'while-editing'
        enablesReturnKeyAutomatically = {true}
        returnKeyType = 'search'
        onKeyPress = {this.onkeyPressEvent.bind(this)}
        onFocus = {this.onSearchFocus.bind(this)}
      />
    </View>
  );
}

renderSegmentedControl() {
  return (
    <View style={styles.buttonsContainer}>
      <SegmentedControlIOS style={{flex:1}}
        values={['Default','Pages','StartDt', 'EndDt', "Range", 'Live']}
        selectedIndex={this.state.selectedIndex}
        onChange={(event) => {
        this.setState({selectedIndex: event.nativeEvent.selectedSegmentIndex});
        }}
        tintColor = '#F8CA1E'
      />
    </View>
  );
}

renderSegmentedControlStartDate() {
  return(
    <View style = {styles.buttonsContainer}>
        <Text>StartDate</Text>
        <TouchableWithoutFeedback onPress={this.toggleStartDatePicker.bind(this)} >
          <View style={styles.DateInput}>
            <Text>{this.state.startDate.getMonth()}/{ this.state.startDate.getDate() }/{this.state.startDate.getFullYear()}T
            {this.state.startDate.getHours()}:{this.state.startDate.getMinutes()}</Text>
          </View>
        </TouchableWithoutFeedback>
    </View>
  );
}
renderSegmentedControlEndDate() {
  return(

    <View style = {styles.buttonsContainer}>
        <Text>EndDate</Text>
        <TouchableWithoutFeedback onPress={this.toggleEndDatePicker.bind(this)} >
        <View style={styles.DateInput}>
          <Text>{this.state.endDate.getMonth()}/{ this.state.endDate.getDate() }/{this.state.endDate.getFullYear()}T
          {this.state.endDate.getHours()}:{this.state.endDate.getMinutes()}</Text>
        </View>
        </TouchableWithoutFeedback>
    </View>
  );
}
renderSegmentedControlDateRange() {
  return(
    <View style = {styles.buttonsContainer}>
      <View style = {{padding:0, flex: 1}}>
        <Text>StartDate</Text>
        <TouchableWithoutFeedback onPress={this.toggleStartDatePicker.bind(this)} >
          <View style={styles.DateInput}>
            <Text>{this.state.startDate.getMonth()}/{ this.state.startDate.getDate() }/{this.state.startDate.getFullYear()}T
            {this.state.startDate.getHours()}:{this.state.startDate.getMinutes()}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style = {{padding:0, flex: 1}}>
        <Text>EndDate</Text>
        <TouchableWithoutFeedback onPress={this.toggleEndDatePicker.bind(this)} >
        <View style={styles.DateInput}>
          <Text>{this.state.endDate.getMonth()}/{ this.state.endDate.getDate() }/{this.state.endDate.getFullYear()}T
          {this.state.endDate.getHours()}:{this.state.endDate.getMinutes()}</Text>
        </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

renderSegmentedControlLive() {
  return(
    <View style={styles.buttonsContainer}>
    <Text style={styles.buttonText}>Live Logs</Text>
      <Switch style = {{padding: 0}}
        onValueChange={this.showLiveLogs.bind(this)}
        value={this.state.eventSwitchIsOn}
       />
    </View>
  );
}
renderSegmentedControlPaging() {
  return(
    <View style={styles.buttonsContainer}>
         <TouchableHighlight style={styles.button}
             underlayColor='#F5FCFF'
             onPress={this.onPrevPressed.bind(this)}>
             <Text style={styles.buttonText}>Prev</Text>
         </TouchableHighlight>
         <TouchableHighlight style={styles.button}
             underlayColor='#F5FCFF'
             onPress={this.onNextPressed.bind(this)}>
             <Text style={styles.buttonText}>Next</Text>
         </TouchableHighlight>
    </View>
  );
}

renderselectedIndex() {

  var CustomLayoutLinear = {
     duration: 200,
     create: {
       type: LayoutAnimation.Types.linear,
       property: LayoutAnimation.Properties.opacity,
     },
     update: {
       type: LayoutAnimation.Types.curveEaseInEaseOut,
     },
   };
   var CustomLayoutSpring = {
       duration: 400,
       create: {
         type: LayoutAnimation.Types.spring,
         property: LayoutAnimation.Properties.scaleXY,
         springDamping: 0.7,
       },
       update: {
         type: LayoutAnimation.Types.spring,
         springDamping: 0.7,
       },
     };
     LayoutAnimation.configureNext(CustomLayoutSpring);

  var view_ = <View/>
  switch (this.state.selectedIndex) {
    case 1:
        view_ = this.renderSegmentedControlPaging()
      break;
    case 2:
        view_ = this.renderSegmentedControlStartDate()
    break;
    case 3:
        view_ = this.renderSegmentedControlEndDate()
    break;
    case 4:
        view_ = this.renderSegmentedControlDateRange()
    break;
    case 5:
        view_ = this.renderSegmentedControlLive()
    break;
    default:
    view_ = <View/>

  }
  return(
    <View>
      {view_}
    </View>
  );
}



renderPrevNextAndLiveFilters(){
  return (
    <View style={styles.buttonsContainer}>
         <TouchableHighlight style={styles.button}
             underlayColor='#F5FCFF'
             onPress={this.onPrevPressed.bind(this)}>
             <Text style={styles.buttonText}>Prev</Text>
         </TouchableHighlight>
         <TouchableHighlight style={styles.button}
             underlayColor='#F5FCFF'
             onPress={this.onNextPressed.bind(this)}>
             <Text style={styles.buttonText}>Next</Text>
         </TouchableHighlight>
            <Text style={styles.liveText}>Live</Text>
         <Switch
              onValueChange={this.showLiveLogs.bind(this)}
              value={this.state.eventSwitchIsOn}
               />
    </View>
  );
}

doneDatePicker()  {
  console.log('done pressed');
  this.setState({datePickerMode :'hidden'});
  // search logs
  this.turnOffLiveLogs();
  filterLogParams.filterPattern = this.state.searchString;
  var filterLogParamsCopy = deepcopy(filterLogParams);
  // if(this.state.selectedDatePicker === 'start') {
  //   filterLogParamsCopy.startTime = this.state.startDate.getTime();
  // } else {
  //   filterLogParamsCopy.endTime = this.state.endDate.getTime();
  // }
  switch (this.state.selectedIndex) {
    case 2:
      filterLogParamsCopy.startTime = this.state.startDate.getTime();
      break;
    case 3:
      filterLogParamsCopy.endTime = this.state.endDate.getTime();
      break;
    case 4:
      filterLogParamsCopy.endTime = this.state.endDate.getTime();
      filterLogParamsCopy.startTime = this.state.startDate.getTime();
      break;
    default:
  }


  console.log('Search query advance filer:-');
  console.log(filterLogParamsCopy);

  let userName = this.props.userName;
  let password = this.props.password;
  let url = "http://" + userName +':' + password + '@' + serverUrl + urlobj.getFilterLogEvents

  this.props.itemactions.getFilteredLogs(url,undefined, filterLogParamsCopy,this.successcb);
  this.setState({
    isSearchingWithDateFilter:true,
    loading: true
  });
}

toggleStartDatePicker(){
  DismissKeyboard()
  var mode = 'visible'
  if(this.state.selectedDatePicker !== 'end') {
    console.log('in not end' );
    mode = this.state.datePickerMode == 'hidden' ? 'visible' : 'hidden' ;
  }
  this.setState({datePickerMode:mode});
  this.setState({selectedDatePicker:'start'});
}
toggleEndDatePicker() {
  DismissKeyboard()
  var mode = 'visible'
  if(this.state.selectedDatePicker !== 'start') {
    console.log('in not start' );
    mode = this.state.datePickerMode == 'hidden' ? 'visible' : 'hidden' ;
  }
  this.setState({datePickerMode:mode});
  this.setState({selectedDatePicker:'end'});
}

onDateChange(date) {
  console.log('date');
  console.log(date);
  if( this.state.selectedDatePicker === 'start') {
    this.setState({startDate: date});
  } else if (this.state.selectedDatePicker === 'end') {
    this.setState({endDate: date});
  }
}

renderDateFilters() {
  return (
    <View style = {styles.buttonsContainer}>
      <View style = {{padding:0, flex: 1}}>
        <Text>StartDate</Text>
        <TouchableWithoutFeedback onPress={this.toggleStartDatePicker.bind(this)} >
          <View style={styles.DateInput}>
            <Text>{this.state.startDate.getMonth()}/{ this.state.startDate.getDate() }/{this.state.startDate.getFullYear()}T
            {this.state.startDate.getHours()}:{this.state.startDate.getMinutes()}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style = {{padding:0, flex: 1}}>
        <Text>EndDate</Text>
        <TouchableWithoutFeedback onPress={this.toggleEndDatePicker.bind(this)} >
        <View style={styles.DateInput}>
          <Text>{this.state.endDate.getMonth()}/{ this.state.endDate.getDate() }/{this.state.endDate.getFullYear()}T
          {this.state.endDate.getHours()}:{this.state.endDate.getMinutes()}</Text>
        </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

rendeListView() {
  return(
    <ListView style={styles.listcontainer}
        automaticallyAdjustContentInsets={false}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        keyboardDismissMode='interactive'
        // renderFooter={this.renderFooter.bind(this)}
        //renderSectionHeader={this.renderSectionHeader.bind(this)}
        //renderHeader={this.renderHeader.bind(this)}
        //enableEmptySections= {true}
      >
      </ListView>
  );
}

renderActivityIndicator() {
  return (
    <ActivityIndicatorIOS
        style={[styles.centering, {height: 40}]}
      />
  );
}

datePicker() {
  var date = this.state.selectedDatePicker === 'start' ? this.state.startDate : this.state.endDate
  return(
    <View style = { styles.datePicker }>
      <TouchableOpacity onPress = { this.doneDatePicker.bind(this)} style = {{ padding:5 ,alignItems:'flex-end'}}>
      <Text>Done</Text>
      </TouchableOpacity>
      <DatePickerIOS
      date={date}
      mode="datetime"
      onDateChange={this.onDateChange.bind(this)} />
    </View>
  );
}

renderAdvancefilter() {
  return(
    <View>
      {this.renderSegmentedControl()}
      {this.renderselectedIndex()}
  </View>);
}

render() {
    var spinner = (this.state.loading || this.state.isPagingNext) ? this.renderActivityIndicator(): ( null);
    var datePicker = (this.state.datePickerMode === 'visible') ? this.datePicker() : <View/>
    var advancefilterView = this.state.isAdvanceFilterOn ? this.renderAdvancefilter() : <View/>
    return (
     <View style={styles.container}>
        <View style={styles.sectionHeaderContainer}>
          {this.renderSearchBar()}
          {advancefilterView}
          {spinner}
        </View>
        {this.rendeListView()}
        {datePicker}
     </View>
   );
 }

}

const mapStateToProps = (state) => ({
    items: state.Items,
    LiveLogHandler:state.liveLogHandler,
});

const mapDispatchToProps = (dispatch) => ({
    itemactions : bindActionCreators(itemActionCreators, dispatch),
})

export default connect(mapStateToProps,mapDispatchToProps)(SearchLogs);
