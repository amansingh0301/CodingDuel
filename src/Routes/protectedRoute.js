import React, { Component,useState , useEffect } from 'react';
import { Redirect, Route, } from 'react-router-dom';
import methods from '../methods'
import GotoLogin from '../Components/gotoLogin'

function ProtectedRoute ({component : Component, ...rest}){
    const [refferrer,setRefferrer] = useState(false);
    useEffect(async () => {
        const response = await methods.check()
        console.log('logged in or not : ',response)
        setRefferrer(response)
    },[])
    return (
        <Route {...rest} render={(props) => refferrer == true ? <Component {...props} /> : <GotoLogin />}/>
    )
}

export default ProtectedRoute