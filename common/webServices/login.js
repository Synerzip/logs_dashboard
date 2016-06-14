/**
 * Created by amita on 3/15/2016.
 */

import {loginRequest,loginFail,loginSuccess,logout} from '../actions';


export function login(username,password,successCB){
    return function (dispatch) {
      var formData="username="+username+"&"+"password="+password;

        let config={
            method: 'POST',
            body: formData,
            headers: {  'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' }
        };
        dispatch(loginRequest());
        return fetch('http://localhost:3001/login',config)
                .then(res=>
            res.json()

        )
        .then(resJson=> {
            if(!resJson["success"])
        {
             console.log("BPN resppnse: ",resJson);
            dispatch(loginFail(resJson.message))
        }
        else{
            console.log("resppnse: ",resJson);

            dispatch(loginSuccess(resJson))

                if(successCB)
                successCB(resJson,dispatch);
        }
    }).catch(err=>{
        dispatch(loginFail({status:"403",message:err}));
                   })

}
}


/*JSON.stringify({
                username: username,
                password: password
            })*/
