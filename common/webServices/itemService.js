/**
 * Created by amita on 3/18/2016.
 */
import {receiveProducts,receiveProductsFail,getAddedCartItem,receiveLogsLive,receiveLiveLogHandler,receiveFilteredLogs} from '../actions/itemActions';
import {logEventsConfig} from '../AWSConfig/config.js'
import Rx from "rxjs";

export function getItems(url,cred1,cred2,paginationAction,getLogEventsStorObj,successcb){

    return function (dispatch) {

        if(getLogEventsStorObj && paginationAction==="Next" ){
            logEventsConfig.nextToken=getLogEventsStorObj.nextForwardToken;
        }
        else if(getLogEventsStorObj && paginationAction==="Prev"){
            logEventsConfig.nextToken=getLogEventsStorObj.nextBackwardToken;
        }
        const base64 = require('base-64');
        var uspass=""+cred1+":"+cred2;
        console.log("BPN item service",uspass);
        let config={
            method: 'GET',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Logeventsparam':JSON.stringify(logEventsConfig),"Authorization": "Basic " + base64.encode(uspass)} 
        };

        return fetch(url,config)
                .then(res=> res.json())
        .then(resJson=> {
            console.log("getLogEvents: ",resJson);
        dispatch(receiveProducts(resJson))
                successcb(resJson);

    }).catch(err=>{
        debugger;

    dispatch(receiveProductsFail(err));

})

}
}


export function getLiveLogs(url,cred1,cred2,getLogEventsStorObj,successcb,errorcb){

    return function (dispatch) {

        if(getLogEventsStorObj ){
            logEventsConfig.nextToken=getLogEventsStorObj.nextForwardToken;
        }
        console.log("logEventsConfig.nextToken",logEventsConfig.nextToken);
        
        const base64 = require('base-64');
        var uspass=""+cred1+":"+cred2;
        console.log("BPN getLiveLogs",uspass);

        var config={
            method: 'GET',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json',
              'Logeventsparam':JSON.stringify(logEventsConfig),"Authorization": "Basic " + base64.encode(uspass)} 
        };
        var service = Rx.Observable.defer(function () {
            return  fetch(url,config) .then(
                    res=> res.json()
            )
        });
        var fetchInterval = Rx.Observable.empty().delay(3000);



        var subscription = service
            .concat(fetchInterval)
            .repeat()
            .do(function(item) {
            console.log("config.headers before:",config.headers );
             //   logEventsConfig.nextToken = item.nextForwardToken;
                var jobj=JSON.parse(config.headers.Logeventsparam) ;
                jobj.nextToken=item.nextForwardToken;
                config.headers.Logeventsparam=JSON.stringify(jobj);
                console.log("config.headers after:",config.headers );

            })
            .subscribe(
            function (resJson) {
                if(successcb)
                    dispatch(receiveLogsLive(resJson));
                dispatch(receiveLiveLogHandler(subscription));
                successcb(resJson)
            },
            function (err) {
                if(errorcb)
                    dispatch(receiveProductsFail(err));
               errorcb(err);
            },
            function () {
                console.log('LiveLogError-Completed');
            });
    }
}

export function getFilteredLogs(url,cred1,cred2,paginationAction,filteredLogObj,successcb){

    return function (dispatch) {

        const base64 = require('base-64');
        var uspass=""+cred1+":"+cred2;
        console.log("BPN getLiveLogs",uspass);


        let config={
            method: 'GET',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json',
              'filterLogEventsParams':JSON.stringify(filteredLogObj) ,"Authorization": "Basic " + base64.encode(uspass)} 
        };

        return fetch(url,config)
            .then(res=> res.json())
            .then(resJson=> {
                console.log("getLogEvents: ",resJson);
                dispatch(receiveFilteredLogs(resJson))
                successcb(resJson);

            }).catch(err=>{
                debugger;

                dispatch(receiveProductsFail(err));

            })

    }
}
