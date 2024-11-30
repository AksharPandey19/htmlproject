let localStream;
let peerConnections = {};
let roomId;
let isVideoEnabled = true;
let isAudioEnabled = true;
let userId = Math.random().toString(36).substring(2, 15);

const servers = {
    iceServers: [
        {
            urls: [
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302'
            ]
        }
    ]
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Get DOM elements
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const roomInput = document.getElementById('roomId');
const createButton = document.getElementById('createButton');
const joinButton = document.getElementById('joinButton');
const videoButton = document.getElementById('videoButton');
const audioButton = document.getElementById('audioButton');

async function init() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        localVideo.srcObject = localStream;
    } catch (err) {
        console.error('Error getting media:', err);
    }
}

async function createRoom() {
    roomId = roomInput.value || Math.random().toString(36).substring(7);
    roomInput.value = roomId;

    const peerConnection = new RTCPeerConnection(servers);
    peerConnections['host'] = peerConnection;

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = ({ streams: [stream] }) => {
        remoteVideo.srcObject = stream;
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    await database.ref(`rooms/${roomId}`).set({
        offer: {
            type: offer.type,
            sdp: offer.sdp
        },
        hostId: userId
    });

    database.ref(`rooms/${roomId}/answer`).on('value', async snapshot => {
        const answer = snapshot.val();
        if (answer && !peerConnection.currentRemoteDescription) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        }
    });

    database.ref(`rooms/${roomId}/candidates`).on('child_added', snapshot => {
        const candidate = snapshot.val();
        if (candidate) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
    });

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            database.ref(`rooms/${roomId}/hostCandidates`).push(event.candidate.toJSON());
        }
    };

    alert(`Room Created: ${roomId}`);
}

async function joinRoom() {
    roomId = roomInput.value;
    if (!roomId) {
        alert('Please enter a room ID');
        return;
    }

    const roomRef = database.ref(`rooms/${roomId}`);
    const roomSnapshot = await roomRef.get();

    if (!roomSnapshot.exists()) {
        alert('Room does not exist');
        return;
    }

    const peerConnection = new RTCPeerConnection(servers);
    peerConnections['peer'] = peerConnection;

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = ({ streams: [stream] }) => {
        remoteVideo.srcObject = stream;
    };

    const offer = roomSnapshot.val().offer;
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    await roomRef.update({
        answer: {
            type: answer.type,
            sdp: answer.sdp
        }
    });

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            database.ref(`rooms/${roomId}/candidates`).push(event.candidate.toJSON());
        }
    };

    database.ref(`rooms/${roomId}/hostCandidates`).on('child_added', snapshot => {
        const candidate = snapshot.val();
        if (candidate) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
    });
}

function toggleVideo() {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            isVideoEnabled = !isVideoEnabled;
            videoTrack.enabled = isVideoEnabled;
            videoButton.classList.toggle('disabled', !isVideoEnabled);
            videoButton.innerHTML = isVideoEnabled ? 
                '<i class="fas fa-video"></i>' : 
                '<i class="fas fa-video-slash"></i>';
        }
    }
}

function toggleAudio() {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            isAudioEnabled = !isAudioEnabled;
            audioTrack.enabled = isAudioEnabled;
            audioButton.classList.toggle('disabled', !isAudioEnabled);
            audioButton.innerHTML = isAudioEnabled ? 
                '<i class="fas fa-microphone"></i>' : 
                '<i class="fas fa-microphone-slash"></i>';
        }
    }
}

createButton.addEventListener('click', createRoom);
joinButton.addEventListener('click', joinRoom);
videoButton.addEventListener('click', toggleVideo);
audioButton.addEventListener('click', toggleAudio);

window.addEventListener('load', init); 