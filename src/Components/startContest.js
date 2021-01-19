import React, { Component } from 'react';
import methods from '../methods'

function StartContest(){
    return (
        <div>
            <input id='room-name' type='textarea' placeholder='Enter Room Name'></input>
            <button id='startBtn' onClick={methods.goToVideoCall}>start</button>
            <button id='joinBtn' onClick={methods.joinVideoCall}>Join</button>
            <p className='wait'>Waiting for Opponent</p>
        </div>
    )
}

export default StartContest