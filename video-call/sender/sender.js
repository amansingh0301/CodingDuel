const webSocket = new WebSocket("ws://localhost:3000")

webSocket.onmessage = (event) => {
    handleSignallingData(JSON.parse(event.data))
}

function handleSignallingData(data) {
    switch (data.type) {
        case "answer":
            peerConn.setRemoteDescription(data.answer)
            break
        case "candidate":
            peerConn.addIceCandidate(data.candidate)
    }
}

let username
function sendData(data) {
    data.username = username
    webSocket.send(JSON.stringify(data))
}


let localStream
let peerConn

/*
This 'startCall' function takes the user ID of the person who starts the call.
And this function is soul function require this function in another module and call it, then it starts a call with user ID as room name.
*/
function startCall(userId) {
    username = userId;
    sendData({
        type: "store_user"
    })
    document.getElementById("video-call-div")
    .style.display = "inline"
    navigator.getWebcam = (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.moxGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    navigator.getWebcam({
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
        console.log('here');
        document.getElementById("local-video").srcObject = localStream

        let configuration = {
            iceServers: [
                {
                    "urls": ["stun:stun.l.google.com:19302", 
                    "stun:stun1.l.google.com:19302", 
                    "stun:stun2.l.google.com:19302"]
                }
            ]
        }

        peerConn = new RTCPeerConnection(configuration)
        peerConn.addStream(localStream)

        peerConn.onaddstream = (e) => {
            document.getElementById("remote-video")
            .srcObject = e.stream
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
    })
    .catch((error) => {
        console.log(error)
        console.log('mo')
    })
}

function createAndSendOffer() {
    peerConn.createOffer((offer) => {
        sendData({
            type: "store_offer",
            offer: offer
        })

        peerConn.setLocalDescription(offer)
    }, (error) => {
        console.log(error)
    })
}


/*
require these two functions and mute and unmute video and audio 
*/
function muteAudio(isAudio) {
    isAudio = !isAudio
    localStream.getAudioTracks()[0].enabled = isAudio
}

function muteVideo(isVideo) {
    isVideo = !isVideo
    localStream.getVideoTracks()[0].enabled = isVideo
}

module.exports = {
    startCall,
    muteAudio,
    muteVideo
}