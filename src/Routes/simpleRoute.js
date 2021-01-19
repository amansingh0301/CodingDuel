import React, { Component, useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import methods from '../methods';


function SimpleRoute ({component : Component, ...rest}){
    const [refferrer,setRefferrer] = useState(false);

    useEffect(async () => {
        const response = await methods.check()
        console.log('logged in or not : ',response)
        setRefferrer(response);
    },[])
     
    return (
        <Route {...rest} render={(props) => refferrer == true ? <Redirect to='/ready'/> : <Component {...props}/> }/>
    )
}

export default SimpleRoute