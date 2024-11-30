let localStream;
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
        console.log('Local stream initialized');
    } catch (err) {
        console.error('Error getting media:', err);
    }
}

async function createRoom() {
    try {
        roomId = roomInput.value || Math.random().toString(36).substring(7);
        roomInput.value = roomId;
        console.log('Creating room:', roomId);

        peerConnection = new RTCPeerConnection(servers);

        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        peerConnection.ontrack = event => {
            console.log('Received remote track');
            remoteVideo.srcObject = event.streams[0];
        };

        // Create and set local description
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        const roomRef = database.ref(`rooms/${roomId}`);
        await roomRef.set({
            offer: {
                type: offer.type,
                sdp: offer.sdp
            }
        });

        // Listen for the answer
        roomRef.child('answer').on('value', async snapshot => {
            const answer = snapshot.val();
            if (answer && !peerConnection.currentRemoteDescription) {
                console.log('Setting remote description (answer)');
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        // Listen for remote ICE candidates
        roomRef.child('answerCandidates').on('child_added', snapshot => {
            const candidate = snapshot.val();
            if (candidate) {
                console.log('Adding answer ICE candidate');
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        // Send ICE candidates
        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                console.log('Sending ICE candidate');
                roomRef.child('offerCandidates').push(event.candidate.toJSON());
            }
        };

        alert(`Room Created: ${roomId}`);
    } catch (error) {
        console.error('Error creating room:', error);
        alert(`Error creating room: ${error.message}`);
    }
}

async function joinRoom() {
    try {
        roomId = roomInput.value;
        if (!roomId) {
            alert('Please enter a room ID');
            return;
        }
        console.log('Joining room:', roomId);

        const roomRef = database.ref(`rooms/${roomId}`);
        const roomSnapshot = await roomRef.get();

        if (!roomSnapshot.exists()) {
            alert('Room does not exist');
            return;
        }

        peerConnection = new RTCPeerConnection(servers);

        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        peerConnection.ontrack = event => {
            console.log('Received remote track');
            remoteVideo.srcObject = event.streams[0];
        };

        // Get the offer
        const offer = roomSnapshot.val().offer;
        console.log('Got offer. Setting remote description');
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

        // Create and set local answer
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        // Send answer
        await roomRef.update({
            answer: {
                type: answer.type,
                sdp: answer.sdp
            }
        });

        // Send ICE candidates
        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                console.log('Sending ICE candidate');
                roomRef.child('answerCandidates').push(event.candidate.toJSON());
            }
        };

        // Listen for remote ICE candidates
        roomRef.child('offerCandidates').on('child_added', snapshot => {
            const candidate = snapshot.val();
            if (candidate) {
                console.log('Adding offer ICE candidate');
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        console.log('Join process completed');
    } catch (error) {
        console.error('Error joining room:', error);
        alert(`Error joining room: ${error.message}`);
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