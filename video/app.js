let localStream;
let remoteStream;
let peerConnection;
let roomId;
let isVideoEnabled = true;
let isAudioEnabled = true;

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
const localAvatar = document.querySelector('.avatar-container');
const remoteAvatar = document.querySelector('.remote-avatar-container');
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
        localAvatar.classList.remove('hidden');
    }
}

async function createRoom() {
    roomId = roomInput.value || Math.random().toString(36).substring(7);
    roomInput.value = roomId;

    peerConnection = new RTCPeerConnection(servers);
    
    // Add local tracks
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    // Handle incoming tracks
    peerConnection.ontrack = ({ streams: [stream] }) => {
        remoteVideo.srcObject = stream;
    };

    // Collect ICE candidates
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            addCandidate('offerCandidates', event.candidate.toJSON());
        }
    };

    // Create offer
    const offerDescription = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offerDescription);

    const roomWithOffer = {
        offer: {
            type: offerDescription.type,
            sdp: offerDescription.sdp
        }
    };

    await database.ref(`rooms/${roomId}`).set(roomWithOffer);

    // Listen for answer
    database.ref(`rooms/${roomId}/answer`).on('value', async snapshot => {
        const data = snapshot.val();
        if (data && !peerConnection.currentRemoteDescription) {
            const answerDescription = new RTCSessionDescription(data);
            await peerConnection.setRemoteDescription(answerDescription);
        }
    });

    // Listen for answer candidates
    database.ref(`rooms/${roomId}/answerCandidates`).on('child_added', snapshot => {
        const candidate = snapshot.val();
        if (candidate) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
    });

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

    peerConnection = new RTCPeerConnection(servers);

    // Add local tracks
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    // Handle incoming tracks
    peerConnection.ontrack = ({ streams: [stream] }) => {
        remoteVideo.srcObject = stream;
    };

    // Collect ICE candidates
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            addCandidate('answerCandidates', event.candidate.toJSON());
        }
    };

    // Get the offer
    const offer = roomSnapshot.val().offer;
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // Create answer
    const answerDescription = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answerDescription);

    const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp
    };

    await roomRef.update({ answer });

    // Listen for offer candidates
    database.ref(`rooms/${roomId}/offerCandidates`).on('child_added', snapshot => {
        const candidate = snapshot.val();
        if (candidate) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
    });
}

async function addCandidate(type, candidate) {
    if (roomId) {
        await database.ref(`rooms/${roomId}/${type}`).push(candidate);
    }
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
            localAvatar.classList.toggle('hidden', isVideoEnabled);
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