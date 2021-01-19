import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import StartContest from '../Components/startContest'
import User from '../Components/user'

function Ready() {
    const logout =() => {
        localStorage.removeItem('jwtToken')
    }
    return (
        <div>
            <User/>
            <br/>
            <StartContest/>
            <Link to='/' onClick={logout}>go to home or Logout</Link>
        </div>
    )
}

export default Ready