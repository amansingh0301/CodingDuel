import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import Contest from './Pages/Page3'
// var HOST = location.origin.replace(/^http/, 'ws')
var webSocket = new WebSocket('ws://localhost:4000');

const check = async () =>{
    // console.log('header :',fun.header)
    const response = await fetch('http://localhost:4000/check',{
        headers:{
            'Authorization' : `Bearer ${localStorage.getItem('jwtToken')}`
        }
    })
                        .then(res => res.json())
                        .catch(err => console.log(err))
    console.log('checking : ',response)
    return response
}

function getRoomName() {
    return document.getElementById('room-name').value
}

webSocket.onmessage = (event) => {
    handleSignallingData(JSON.parse(event.data))
}

function handleSignallingData(data) {
    switch (data.type) {
        case "answer":
            peerConn.setRemoteDescription(data.answer)
            break
        case "offer":
            peerConnj.setRemoteDescription(data.offer)
            .then(() => {
                createAndSendAnswerj()
            })
            break
        case "candidate":
            if(data.from == 'receiver')
                peerConn.addIceCandidate(data.candidate)
            else
                peerConnj.addIceCandidate(data.candidate)
    }
}

function sendData(data) {
    data.username = username
    data.from = 'sender'
    webSocket.send(JSON.stringify(data))
}

let localStream
let peerConn
let username

function goToVideoCall(){
    document.querySelector('p').style.display="inline";
    username = getRoomName();
    sendData({
        type: "store_user"
    })
    console.log('videocall')
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })
    .then((stream) => {
        console.log('her')
        localStream = stream
        let configuration = {
            iceServers: [
                {
                    "urls": ["stun:stun.l.google.com:19302", 
                    "stun:stun1.l.google.com:19302", 
                    "stun:stun2.l.google.com:19302"]
                },
                {
                    "urls": [
                        "turn:numb.viagenie.ca"
                        ],
                        "username": "webrtc@live.com",
                        "credential": "muazkh"
                }
            ]
        }

        peerConn = new RTCPeerConnection(configuration)
        localStream.getTracks().forEach(function(track) {
            peerConn.addTrack(track, localStream);
          });

          peerConn.onconnectionstatechange = (e) => {
              console.log(peerConn.connectionState)
          }

        peerConn.ontrack = (e) => {
            ReactDOM.render(<Contest/>,document.getElementById('root'))
            const remoteStream = e.streams[0];
            const remoteVideo = document.querySelector("video");
            remoteVideo.srcObject = remoteStream;
            console.log('adding')
            peerConn.addEventListener('track', async (event) => {
                remoteStream.addTrack(event.track, remoteStream);
                console.log('zero')
            });
            remoteVideo.playsInline=true;
            remoteVideo.autoplay=true;
            
        }

        peerConn.onicecandidate = ((e) => {
            if (e.candidate == null)
                return
            sendData({
                type: "store_candidate",
                candidate: e.candidate
            })
        })

        createAndSendOffer()
    },(error) => {
        console.log(error)
    })
}

function createAndSendOffer() {
    peerConn.createOffer()
    .then(offer => 
        {
            peerConn.setLocalDescription(offer)
            sendData({
                type: "store_offer",
                offer: offer
            })
        })
            
    .catch((error) => {
        console.log(error)
    })
}

let peerConnj
let usernamej


function joinVideoCall(){
    document.querySelector('p').style.display="inline";
    usernamej = getRoomName();
    navigator.mediaDevices.getUserMedia({
        video: {
            frameRate: 24,
            width: {
                min: 480, ideal: 720, max: 1280
            },
            aspectRatio: 1.33333
        },
        audio: true
    })
    .then((stream) => {
        localStream = stream
        console.log(stream)
        let configuration = {
            iceServers: [
                // {
                //     'urls': 'stun:stun.l.google.com:19302'
                //   },
                //   {
                //     'urls': 'turn:192.158.29.39:3478?transport=udp',
                //     'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                //     'username': '28224511:1379330808'
                //   },
                //   {
                //     'urls': 'turn:192.158.29.39:3478?transport=tcp',
                //     'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                //     'username': '28224511:1379330808'
                //   }
                {
                    "urls": ["stun:stun.l.google.com:19302", 
                    "stun:stun1.l.google.com:19302", 
                    "stun:stun2.l.google.com:19302"]
                },
                {
                    "urls": [
                        "turn:numb.viagenie.ca"
                        ],
                        "username": "webrtc@live.com",
                        "credential": "muazkh"
                }
            ]
        }

        peerConnj = new RTCPeerConnection(configuration)
        localStream.getTracks().forEach(function(track) {
            peerConnj.addTrack(track, localStream);
          });

          peerConnj.onconnectionstatechange = (e) => {
            console.log(peerConnj.connectionState)
        }

        peerConnj.ontrack = (e) => {
            ReactDOM.render(<Contest/>,document.getElementById('root'))
            const remoteStream = e.streams[0];
            const remoteVideo = document.querySelector("video");
            remoteVideo.srcObject = remoteStream;
            console.log('adding')
            peerConnj.addEventListener('track', async (event) => {
                remoteStream.addTrack(event.track, remoteStream);
                console.log('zero')
            });
            remoteVideo.playsInline=true;
            remoteVideo.autoplay=true;
            
        }

        peerConnj.onicecandidate = ((e) => {
            if (e.candidate == null)
                return
            
            sendDataj({
                type: "send_candidate",
                candidate: e.candidate
            })
        })

        sendDataj({
            type: "join_call"
        })

    },(error) => {
        console.log(error)
    })
}

function createAndSendAnswerj () {
    peerConnj.createAnswer((answer) => {
        peerConnj.setLocalDescription(answer)
        sendDataj({
            type: "send_answer",
            answer: answer
        })
    }, error => {
        console.log(error)
    })
}

function sendDataj(data) {
    data.username = usernamej
    data.from = 'receiver'
    webSocket.send(JSON.stringify(data))
}

export default {
    goToVideoCall,
    joinVideoCall,
    check
}