/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


import {PropTypes } from 'react';
import {getStreams} from 'common/webServices/dropdownList'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as itemActionCreators from 'common/webServices/itemService';
import {logEventsConfig, filterLogParams} from 'common/AWSConfig/config.js';
import {urlobj} from 'common/apiurls';
import moment from 'moment';
import { Button, Subheader, COLOR } from 'react-native-material-design';
import gobutton from '../resources/unnamed.png';
import {serverUrl} from 'common/constants/loginConstants.js'


 import React, {
   StyleSheet,
   Image,
   ListView,
   View,
   TextInput,
   TouchableHighlight,  
   ProgressBarAndroid,
   Text,
   Component,  
   Switch, 
   TouchableWithoutFeedback,
   DatePickerAndroid,
  Alert
} from 'react-native';

 
class SearchLogsView extends Component {

constructor(props) {
  super(props);
  this.state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.guid !== row2.guid,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }),
    loading: false,
    isSearching: false,
    searchString : "",
    resultArray:[],
    isLiveLogs : false,
    getLogEvents : {},
    eventSwitchIsOn: false,
    //Filter initializations
    filterPattern: '',
    startTime:0,
    endTime:0,
    value:'0',
    simpleText: 'pick a date',
    localLogEventsConfig: {},
    isPagingNext: false,
    isNextPrevDisabled:false, 
    txtStartDate:'Start Date', 
    txtEndDate:'End Date',   
  }
 }

 componentWillMount (){
    /*this.props.itemactions.getItems(urlobj.getItems,undefined, logEventsConfig,this.successcb);
    this.setState({ loading: true });*/
    this.loadDefaultLogs();
    //  this.props.itemactions.getFilteredLogs(urlobj.getFilterLogEvents,undefined, filterLogParams,this.successcb);
 }

 loadDefaultLogs(){
      let userName = this.props.userName;
      let password = this.props.password;      
      let url = "http://"+ serverUrl + urlobj.getItems;


   this.props.itemactions.getItems(url,userName,password,undefined, logEventsConfig,this.successcb);
   this.setState({ loading: true });
 }
 componentDidMount() {
  //  this.setState({searchString : "TRACE PerformanceMonitorInterceptor"})
  //  console.log("searchString = " + this.state.searchString);
 }

 componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps");
     if(this.state.isPagingNext === true) { 
     //console.log("isPagingNext");// paging Next, Prev
      if(nextProps.items[0].events.length) { 
      console.log("isPagingNext");/// if dtata is there, update tokens and reload list
        this.setState({
          isPagingNext: false,
          localLogEventsConfig: {
            'nextForwardToken':nextProps.items[0].nextForwardToken,
            'nextBackwardToken': nextProps.items[0].nextBackwardToken
          },
          dataSource: this.state.dataSource.cloneWithRows(nextProps.items[0].events),
          loading:false,
        });
      } else {
        this.setState({
          isPagingNext: false,
        });
      }
    }else if(this.state.isLiveLogs === true) {      
      console.log("live logs....");
      var index = nextProps.items.length > 0 ? nextProps.items.length -1 : 0
      console.log(nextProps.items[index].events);
      let result = nextProps.items[index].events      
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
      
    } else if(this.state.isSearching === true) {
      console.log("isSearching....")
      console.log(nextProps.items[0].events);
    
     this.setState({
       isSearching: false,      
       dataSource: this.state.dataSource.cloneWithRows(nextProps.items[0].events),
       loading: false
     });
    
   } else {
     console.log("default log loading....")
     console.log(nextProps.items[0].events);

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
   console.log(this.state.searchString);
  }


  epochToJsDate(incomingUTCepoch){
      var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
      date.setUTCSeconds(incomingUTCepoch / 1000);
      return date.toLocaleString() //date.toGMTString()
   }

 /*renderSectionHeader(sectionData, sectionID) {
     return (
       
      );
}*/

search(){
  if(this.state.isLiveLogs===true){
      this.setState({eventSwitchIsOn: false})
       this.setState({
            loading: true,
            dataSource: this.state.dataSource.cloneWithRows([]),            
            isLiveLogs: false,
            isNextPrevDisabled:true,
            startTime:0,
            endTime:0,
          });     
       console.log('LiveLogHandler unsubscribe...');
       console.log(this.props.LiveLogHandler.LiveLogHandler);      
       this.props.LiveLogHandler.LiveLogHandler.unsubscribe();
       
      }

      this.setState({simpleDate:''});
      console.log("search query = " + this.state.searchString);
          this.setState({
            loading: true,
            dataSource: this.state.dataSource.cloneWithRows([]),
            isSearching : true,
            isNextPrevDisabled:true,
            
          });
         
          filterLogParams.filterPattern = this.state.searchString;
          let userName = this.props.userName;
          let password = this.props.password;      
          let url = "http://"+ serverUrl + urlobj.getFilterLogEvents;
          this.props.itemactions.getFilteredLogs(url,userName,password,undefined, filterLogParams,this.successcb);
          
}

  showLiveLogs(value) {

       console.log('***Live Log***');
       console.log(value);
       this.setState({simpleDate:''});
       this.searchInput.setNativeProps({text:''});
       if (value === true) {
         this.subscribeLiveLogs();
       } else {
         this.unsubscribeLiveLogs();
       }
       return this.setState({eventSwitchIsOn: value})
     }

     subscribeLiveLogs() {
       console.log('LiveLog subscribe...');      
       var _getLogEvents = {}
       //this.setState({ isLiveLogs: true });

        this.setState({
            loading: true,
            dataSource: this.state.dataSource.cloneWithRows([]),            
            isLiveLogs: true,
            isNextPrevDisabled:true,
            startTime:0,            
            endTime:0,
            txtStartDate:'Start Date',
            txtEndDate:'End Date',
            searchString:'',
          });
        filterLogParams.filterPattern=null;
          let userName = this.props.userName;
          let password = this.props.password;      
          let url = "http://"+ serverUrl + urlobj.getLiveLogs;

       this.props.itemactions.getLiveLogs(url,userName,password,_getLogEvents,this.successcb);
        
     }

     unsubscribeLiveLogs() {
      //this.setState({ isLiveLogs: false });
      this.setState({
            loading: true,
            dataSource: this.state.dataSource.cloneWithRows([]),            
            isLiveLogs: false,
            isNextPrevDisabled:false,
            startTime:0,            
            endTime:0,
            txtStartDate:'Start Date',
            txtEndDate:'End Date'
          });     
       console.log('LiveLogHandler unsubscribe...');
       console.log(this.props.LiveLogHandler.LiveLogHandler);
      
       this.props.LiveLogHandler.LiveLogHandler.unsubscribe();
       this.loadDefaultLogs();
     }

     onDefaultButtonClicked(){

       this.setState({
            loading: true,
            dataSource: this.state.dataSource.cloneWithRows([]),
            isNextPrevDisabled:false,
            startTime:0,            
            endTime:0,
            searchString:'',            
            txtStartDate:'Start Date',
            txtEndDate:'End Date'
          }); 
       this.searchInput.setNativeProps({text:''});    
       console.log('LiveLogHandler unsubscribe...');
       console.log(this.props.LiveLogHandler.LiveLogHandler);
        if(this.state.isLiveLogs){
        this.setState({isLiveLogs: false, eventSwitchIsOn:false,   
                     });  
        this.props.LiveLogHandler.LiveLogHandler.unsubscribe();
       
      }
      this.loadDefaultLogs();
       
     }
   

    onHandleStartDateChange(value){ 

      if(this.state.isLiveLogs===true){      
          this.setState({
            loading: true,
            dataSource: this.state.dataSource.cloneWithRows([]),            
            isLiveLogs: false,
            isNextPrevDisabled:true,
            eventSwitchIsOn:false,           
          }); 

        filterLogParams.startTime=null;
        filterLogParams.endTime=null;

       console.log('LiveLogHandler unsubscribe...');
       console.log(this.props.LiveLogHandler.LiveLogHandler); 

       this.props.LiveLogHandler.LiveLogHandler.unsubscribe();       
      }

        
        this.setState({
            loading: true,
            dataSource: this.state.dataSource.cloneWithRows([]), 
            isNextPrevDisabled:true,           
          });

          filterLogParams.filterPattern = this.state.searchString;

          if(value ==='start'){  
            filterLogParams.startTime =this.state.startTime;
            }else{
            filterLogParams.endTime =this.state.endTime;
          }
           
            console.log("Bipin -startTime :", this.state.startTime);
            console.log("Bipin -endTime :", this.state.endTime)
            console.log("Bipin -filterLogParams-searchstring :", filterLogParams.filterPattern);
            console.log("filterLogParams:",filterLogParams);
            
            let userName = this.props.userName;
            let password = this.props.password;      
            let url = "http://"+ serverUrl + urlobj.getFilterLogEvents;

            this.props.itemactions.getFilteredLogs(url,userName,password,undefined, filterLogParams,this.successcb);
        
    }



onNextPressed() {
      console.log('**Next**');
      console.log(this.state.localLogEventsConfig);
      if(this.state.isLiveLogs === true) {
        this.showLiveLogs(false)
      }
      this.setState({
        loading: true,
        isPagingNext: true,
        dataSource: this.state.dataSource.cloneWithRows([]),

        // dataSource: this.state.dataSource.cloneWithRows([])
      });
      let userName = this.props.userName;
      let password = this.props.password;      
      let url = "http://"+ serverUrl + urlobj.getItems;           
      this.props.itemactions.getItems(url,userName,password,'Next', this.state.localLogEventsConfig, this.successcb);
     }

onPrevPressed() {
       console.log('**Prev**');
       console.log(this.state.localLogEventsConfig);
       if(this.state.isLiveLogs === true) {
         this.showLiveLogs(false)
       }
       this.setState({
        loading: true,
         isPagingNext: true,
         dataSource: this.state.dataSource.cloneWithRows([]),
       });
      let userName = this.props.userName;
      let password = this.props.password;      
      let url = "http://"+ serverUrl + urlobj.getItems;           
      this.props.itemactions.getItems(url,userName,password,'Prev', this.state.localLogEventsConfig, this.successcb);
     }

async showPicker(stateKey, options) {
           
    console.log('BIPIN',stateKey);
    try {        
        const {action, year, month, day} = await DatePickerAndroid.open(options);
        if (action === DatePickerAndroid.dismissedAction) {
          //newState[stateKey + 'Text'] = 'dismissed';
        } else {
          
          var date = new Date(year, month, day); 
          
          var dateTime = date.getTime(); 
          
         if(stateKey==='start'){
          if(this.state.endTime>=dateTime || this.state.endTime===0){
              this.setState({startTime:dateTime,txtStartDate:date.toLocaleDateString(),simpleDate:'Logs filtered By Start Date '+date.toLocaleDateString()});
              this.onHandleStartDateChange('start');
            }else{
              Alert.alert( 'Invalid Date Range', 'End Date should always be greater than Start Date', [ {text: 'OK', onPress: () => console.log('OK Pressed!')}, ] )
            }
          }else if(this.state.startTime<=dateTime){
                   console.log('**inside check condition**');
              this.setState({endTime:dateTime,txtEndDate:date.toLocaleDateString(),simpleDate:'Logs filtered By End Date '+date.toLocaleDateString()});
              this.onHandleStartDateChange('end');

          }else{
            Alert.alert( 'Invalid Date Range', 'Start Date should always be less than End Date', [ {text: 'OK', onPress: () => console.log('OK Pressed!')}, ] )
          }

      }
      
        } catch ({code, message}) {
          console.warn(`Error in example '${stateKey}': `, message);
    }
  }
renderFooter() {
   if (this.state.loading) {
   return (
     <View style={styles.loadingFooterContainer}>
       <ProgressBarAndroid
         animating={true}
         size={'small'} />
        <Text style={styles.loadingText}> Loading </Text>
     </View>
     );
   } else {
     return null;
   }
 }

 onContentSizeChange(){
  if(this.state.loading){
      this.listView.scrollTo({y:0});
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
 render() {
   return (
    
   <View style={styles.container}>
    <View style={styles.toolbar}>
                <TouchableHighlight                
                onPress={this.onCancel.bind(this)}
                underlayColor='#dddddd'>                
                  <Text style={styles.toolbarButton}>Back</Text>
                </TouchableHighlight>  

                <Text style={styles.toolbarTitle}>Logs</Text> 
                
               
                  <View style={styles.toolbarContainerVertical}> 
                    
                    <View style={styles.toolbar}>
                    <Text >Reset   </Text>
                    <TouchableHighlight 
                    underlayColor='#F5FCFF'
                    onPress={this.onDefaultButtonClicked.bind(this)}>                    
                    <Image style={styles.image} source={gobutton} />
                    </TouchableHighlight>
                    </View>
                   <View style={styles.toolbar}>
                    <Text >Live</Text>
                    
                   
                    <Switch onValueChange={this.showLiveLogs.bind(this)}
                    value={this.state.eventSwitchIsOn}
                    />
                    </View>
                    </View>
                
     
                                       
    </View>
    <View style={styles.buttonContainer}>  
    <Button
          
          style={styles.buttonPrev}
          text="<<Previous"
          disabled={this.state.isNextPrevDisabled}        
          onPress={this.onPrevPressed.bind(this)}>        
    </Button>

     <View style={styles.buttonContainerVertical}>
        
        <Text style={styles.buttonTextSmall}>Date Range</Text>
       
          <View style={styles.buttonContainer}>    
        
            <TouchableHighlight 
              style={styles.buttonSmall}
              onPress={this.showPicker.bind(this, 'start', {})}> 
              <Text style={styles.buttonText}>{this.state.txtStartDate}</Text> 
            </TouchableHighlight>
           

            <TouchableHighlight 
              style={styles.buttonSmall}
              onPress={this.showPicker.bind(this, 'end', {})}> 
              <Text style={styles.buttonText}>{this.state.txtEndDate}</Text> 
            </TouchableHighlight>

        </View>

       
        <Text style={styles.buttonTextSmall}>{this.state.simpleDate}</Text>
       
       
        
    </View>

    <Button       
        style={styles.buttonNext}
        text="Next>>"
        disabled={this.state.isNextPrevDisabled}        
        onPress={this.onNextPressed.bind(this)}>        
    </Button>

       </View>
      
      

      <View style={styles.sectionContainer}>
          <TextInput style={styles.searchInput}
            ref={ref => this.searchInput = ref}
            placeholder='Search'            
            onChange={this.onSearchTextChangedEvent.bind(this)}
            keyboardType = 'default'
            keyboardAppearance = 'dark'
            clearButtonMode = 'always'                       
            onSubmitEditing={this.search.bind(this)}            
          />
      </View>

    <ListView
    ref={ref => this.listView = ref}
     dataSource={this.state.dataSource}
     renderRow={this.renderRow.bind(this)}
     //renderSectionHeader={this.renderSectionHeader.bind(this)}
     renderFooter={this.renderFooter.bind(this)}
     onContentSizeChange={this.onContentSizeChange.bind(this)}
     />
     </View>
     
  
   );
 }
  onCancel(){
    this.props.navigator.pop();
  }
}

const mapStateToProps = (state) => ({
    items: state.Items,
    LiveLogHandler:state.liveLogHandler,
});

const mapDispatchToProps = (dispatch) => ({
    itemactions : bindActionCreators(itemActionCreators, dispatch),
})

export default connect(mapStateToProps,mapDispatchToProps)(SearchLogsView);

var styles = StyleSheet.create({
    
  container: {
       flex: 1,    
       backgroundColor: '#FFF',
    },
  textContainer: {
       flex: 1
     },
  loadingFooterContainer: {
       flex: 1,
       backgroundColor: '#dddddd',
       flexDirection: 'row',     
       justifyContent: 'center',
       padding:10,
     },
  separator: {
       height: 1,
       backgroundColor: '#fefefe'
     },
  loadingText: {
       fontSize: 14,
       color: 'gray',
       textAlign:'center'    

     },
  title: {
       fontSize: 14,
       color: '#0d0d0d'
     },
  log: {
       fontSize: 12,
       color: '#656565'
     },
  rowContainer: {
       flexDirection: 'row',
       padding: 10
     },
  sectionContainer: {
         flexDirection: 'row',
         padding: 5,
         backgroundColor: '#C9C9C9',
     },
  searchInput: {
        height: 31,
        flex: 1,
        padding:5,
        marginRight: 5,     
        marginLeft: 5,
        fontSize: 15,
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
  toolbar:{ 
  alignItems:'center', 
                 
        backgroundColor:'#EEB211',        
        flexDirection:'row'    
    },
  toolbarButton:{ 
        width: 50,      
        marginLeft:5,
        textAlign:'center',
        fontSize:20
    },
  toolbarTitle:{        
        fontSize:25,
        textAlign:'center',
        fontWeight:'bold',
        flex:1                //Step 3
    },
  button: {               
        width:70,
        height: 40,
        
        backgroundColor: '#EEB211',
        borderColor: '#EEB211',
        borderWidth: 1,
        borderRadius: 8,      
        justifyContent: 'center'
    },
    buttonPrev: {               
        width:70,
        height: 40,
        
        backgroundColor: '#EEB211',
        borderColor: '#EEB211',
        borderWidth: 1,
        borderRadius: 8,      
        justifyContent: 'center',
       
    },
    buttonNext: {               
        width:70,
        height: 40,
        
        backgroundColor: '#EEB211',
        borderColor: '#EEB211',
        borderWidth: 1,
        borderRadius: 8,      
        justifyContent: 'center',
        
    },
    buttonSmall: {               
        width:70,
        height: 25,
        margin:1,
        backgroundColor: '#EEB211',
        borderColor: '#EEB211',
        borderWidth: 1,
        borderRadius: 5,
      
      justifyContent: 'center'
    },
  buttonText: {
        fontSize: 16,
        textAlign: 'center',
        margin: 2,
        color: 'white'
    },
    buttonTextSmall: {
        fontSize: 10,
        textAlign: 'center',        
        color: 'white'
    },
  buttonContainer: { 
        alignItems: 'center',
        flexDirection: 'row',        
        backgroundColor: '#C9C9C9',
   },

   buttonContainerVertical:{   
    alignItems: 'center',
    flex:1,    
    backgroundColor: '#C9C9C9',
   },
   toolbarContainerVertical:{   
    alignItems: 'center',   
   },

   image:{
    padding:5,
    width:25,
    height:25,
   }


 });

