/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Navigator,
  ListView,
  component,
  Alert
} from 'react-native';

import LoginView from './LoginView'

import SearchLogsView from './SearchLogsView';

import {PropTypes } from 'react';
import {getStreams} from 'common/webServices/dropdownList'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as groupWebActionCreators from 'common/webServices/dropdownList';
import * as groupActionCreators from 'common/actions/dropdown';
import {urlobj} from 'common/apiurls';
import {serverUrl} from 'common/constants/loginConstants.js'

 


 // var MOCKED_DATA =  ['Stream 1', 'Stream 2', 'Stream 3', 'Stream 4'];


class StreamsView extends Component {

constructor(props) {
  super(props)

  this.state={
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.guid !== row2.guid,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
  };
    loaded: false;
    price: 'fix';
  }


  componentWillMount (){
      let userName = this.props.userName;
      let password = this.props.password;
      let url = "http://"+ serverUrl + urlobj.getStreams;
      console.log("BPN" + url);

    // this.props.streamwebactions.getGroups(urlobj.getGroups);
    this.props.streamwebactions.getStreams(url,userName,password);

      console.log('this.props: ');
      console.log(this.props);
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps==>');
    console.log(nextProps.streams);
  this.setState({
    dataSource: this.state.dataSource.cloneWithRows(nextProps.streams)
  });
  }


  rowPressed(guid) {
    console.log('row pressed' + {guid});
    this.props.navigator.push ({
      title: 'Search',
      component: SearchLogsView,
      passProps: {
          userName: this.props.userName,
          password: this.props.password,
        }
    });
  }


  renderRow(rowData, sectionID, rowID) {
    return (
  <TouchableHighlight onPress={() => this.rowPressed(rowData.guid)}
      underlayColor='#dddddd'>
    <View>
      <View style={styles.rowContainer}>
        <View  style={styles.textContainer}>
          <Text style={styles.title}>{rowData}</Text>
        </View>
      </View>
      <View style={styles.separator}/>
    </View>
  </TouchableHighlight>
  );
}
  render() {
    return (
     <View>
                <View style={styles.toolbar}>
                <TouchableHighlight                
                onPress={this.onCancel.bind(this)}
                underlayColor='#dddddd'>
                <Text style={styles.toolbarButton}>Back</Text>
              </TouchableHighlight>
                    <Text style={styles.toolbarTitle}>Streams</Text>
                   
                </View>

      <ListView
      dataSource={this.state.dataSource}
      renderRow={this.renderRow.bind(this)}/>
      </View>
    );
  }
  onCancel(){
    this.props.navigator.pop();
  }
}

const mapStateToProps = (state) => ({
    streams:state.streams.streams

});
const mapDispatchToProps = (dispatch) => ({
    // streamactions : bindActionCreators(groupActionCreators, dispatch),
    streamwebactions : bindActionCreators(groupWebActionCreators, dispatch),
});

export default connect(mapStateToProps,mapDispatchToProps)(StreamsView);

var styles = StyleSheet.create({
   textContainer: {
     flex: 1
   },
   separator: {
     height: 1,
     backgroundColor: '#dddddd'
   },
   title: {
     fontSize: 18,
     color: '#656565'
   },
  rowContainer: {
     flexDirection: 'row',
     padding: 20,
     marginTop:10,
     marginLeft: 10,     
     marginRight:10,
     marginBottom:10,    
     backgroundColor: '#dddddd'
     
   },
    toolbar:{
        backgroundColor:'#EEB211',
        paddingTop:30,
        paddingBottom:10,
        flexDirection:'row'    //Step 1
    },
    toolbarButton:{
        width: 50,        //Step 2
        
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
 });


