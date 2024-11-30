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
        console.log('Got local stream');
    } catch (err) {
        console.error('Error getting media:', err);
    }
}

async function createPeerConnection() {
    peerConnection = new RTCPeerConnection(servers);
    
    // Add local tracks
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
        console.log('Added local track:', track.kind);
    });

    // Handle remote tracks
    peerConnection.ontrack = event => {
        console.log('Received remote track:', event.track.kind);
        if (remoteVideo.srcObject !== event.streams[0]) {
            remoteVideo.srcObject = event.streams[0];
            remoteStream = event.streams[0];
            console.log('Set remote stream');
        }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            const candidatePath = peerConnection.localDescription.type === 'offer' 
                ? 'offerCandidates' 
                : 'answerCandidates';
            database.ref(`rooms/${roomId}/${candidatePath}`).push(event.candidate.toJSON());
            console.log('Added ICE candidate');
        }
    };

    peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
    };

    peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE state:', peerConnection.iceConnectionState);
    };
}

async function createRoom() {
    try {
        roomId = Math.random().toString(36).substring(7);
        roomInput.value = roomId;
        console.log('Creating room:', roomId);

        await createPeerConnection();

        // Create offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        console.log('Created offer');

        // Save offer to database
        const roomRef = database.ref(`rooms/${roomId}`);
        await roomRef.set({
            'offer': {
                type: offer.type,
                sdp: offer.sdp
            }
        });

        // Listen for answer
        roomRef.child('answer').on('value', async snapshot => {
            const answer = snapshot.val();
            if (answer && !peerConnection.currentRemoteDescription) {
                console.log('Setting remote description (answer)');
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        // Listen for answer candidates
        roomRef.child('answerCandidates').on('child_added', async snapshot => {
            const candidate = snapshot.val();
            if (candidate && peerConnection.remoteDescription) {
                console.log('Adding answer candidate');
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        alert(`Room created: ${roomId}`);
    } catch (err) {
        console.error('Error creating room:', err);
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

        await createPeerConnection();

        const roomRef = database.ref(`rooms/${roomId}`);
        const roomSnapshot = await roomRef.get();

        if (!roomSnapshot.exists()) {
            alert('Room does not exist');
            return;
        }

        // Get the offer
        const offer = roomSnapshot.val().offer;
        if (offer) {
            console.log('Setting remote description (offer)');
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

            // Create answer
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            console.log('Created answer');

            // Save answer
            await roomRef.update({
                'answer': {
                    type: answer.type,
                    sdp: answer.sdp
                }
            });
        }

        // Listen for offer candidates
        roomRef.child('offerCandidates').on('child_added', async snapshot => {
            const candidate = snapshot.val();
            if (candidate && peerConnection.remoteDescription) {
                console.log('Adding offer candidate');
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

    } catch (err) {
        console.error('Error joining room:', err);
    }
}

// Event listeners
createButton.addEventListener('click', createRoom);
joinButton.addEventListener('click', joinRoom);
videoButton.addEventListener('click', toggleVideo);
audioButton.addEventListener('click', toggleAudio);

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

window.addEventListener('load', init); 