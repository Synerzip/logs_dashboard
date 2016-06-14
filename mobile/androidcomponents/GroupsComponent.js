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
  TouchableOpacity,
  ToolbarAndroid,
  Navigator,
  ListView,
  BackAndroid,
  Alert
} from 'react-native';

import StreamsView from './StreamsView'
import BaseComponent from './BaseComponent';
import {PropTypes } from 'react';

import {getGroups} from 'common/webServices/dropdownList'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as groupWebActionCreators from 'common/webServices/dropdownList';
import * as groupActionCreators from 'common/actions/dropdown';
import {urlobj} from 'common/apiurls';
import {serverUrl} from 'common/constants/loginConstants.js'

 


 //var MOCKED_DATA =  ['Group 1', 'Group 2', 'Group 3', 'Group 4'];


class Groups extends BaseComponent {

constructor(props) {
  super(props)
     this.state = {
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
      let url = "http://"+ serverUrl + urlobj.getGroups;
      console.log("BPN" + url);
      this.props.groupwebactions.getGroups(url,userName,password);
      console.log('this.props: ');
      console.log(this.props);
  }

componentWillReceiveProps(nextProps) {
  this.setState({
    dataSource: this.state.dataSource.cloneWithRows(nextProps.groups.groups)
  });
}
  onGroupSelected(e,obj){
      // e.preventDefault();
      console.log("selected Group:",e.target.value);
  }


  rowPressed(guid) {
    console.log('row pressed' + {guid});
    console.log('in rowPressed');
      this.props.navigator.push ({
        title: 'Streams',
        component: StreamsView,
        passProps: {
          userName: this.props.userName,
          password: this.props.password,
        }
      });
  }


  renderSectionHeader(sectionData, sectionID) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.title}>Sample Section added for study</Text>
    </View>
  );
}

renderFooter() {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.title}>Sample Footer </Text>
              </View>);
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
                <TouchableOpacity                
                   onPress={this.onCancel.bind(this)}
                   underlayColor='#dddddd'>
                <Text style={styles.toolbarButton}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.toolbarTitle}>Groups</Text>
                   
      </View>

      <ListView
      dataSource={this.state.dataSource}
      renderRow={this.renderRow.bind(this)}
      // renderSectionHeader={this.renderSectionHeader}
      // renderFooter={this.renderFooter} style={styles.listView}
      />
      </View>
     
  );
  }
  onCancel() {
     super.onBackPressed();
  }
}

const mapStateToProps = (state) => ({
    groups:state.groups.groups
});

const mapDispatchToProps = (dispatch) => ({
    groupactions:bindActionCreators(groupActionCreators, dispatch),
    groupwebactions:bindActionCreators(groupWebActionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Groups);

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
   sectionContainer: {
     flexDirection: 'row',
     padding: 5,
     backgroundColor: '#dfdfdf',
   }
 });


