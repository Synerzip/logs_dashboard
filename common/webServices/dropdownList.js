/**
 * Created by amita on 4/25/2016.
 */

import {getGroupList,groupListSuccess,groupListFail,selectedGroup,getStreamList,streamListSuccess,streamListFail,selectedStream} from '../actions/dropdown.js';

export function getGroups(url,cred1,cred2){

    console.log("BPN getGroups url : ",url)
    // return fetchItems(receiveProducts,receiveProductsFail)
    return function (dispatch) { 
        const base64 = require('base-64');
        var uspass=""+cred1+":"+cred2;
        console.log("BPN get groups",uspass);
        let config={
            method: 'GET',
            credentials: 'same-origin',
            //headers: { 'Content-Type': 'application/json', 'Accept': 'application/json','Authorization': 'synerzip:password@'}
            //headers: { 'Content-Type': 'application/json', 'Accept': 'application/json',"Authorization" : auth}
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json',"Authorization": "Basic " + base64.encode(uspass)}

        };
        dispatch(getGroupList());
        return fetch(url,config)
                .then(res=> res.json())
        .then(resJson=> {
            console.log("getGroups: ",resJson)

        dispatch(groupListSuccess(resJson))

    }).catch(err=>{
        debugger;

    dispatch(groupListFail(err));

})

}
}

export function getStreams(url,cred1,cred2){
    // return fetchItems(receiveProducts,receiveProductsFail)
    return function (dispatch) {
        const base64 = require('base-64');
        var uspass=""+cred1+":"+cred2;
        console.log("BPN get streams",uspass);

        let config={
            method: 'GET',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json',"Authorization": "Basic " + base64.encode(uspass)}
        };
        dispatch(getStreamList());
        return fetch(url,config)
                .then(res=> res.json())
        .then(resJson=> {
            console.log("getStreams: ",resJson)

        dispatch(streamListSuccess(resJson))

    }).catch(err=>{

    dispatch(streamListFail(err));

})

}
}
