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
        },
        {  // Add TURN server for better connectivity
            urls: 'turn:turn.example.com:3478',
            username: 'username',
            credential: 'password'
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
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: true
        });
        localVideo.srcObject = localStream;
        console.log('Got local stream');
    } catch (err) {
        console.error('Error getting media:', err);
        // Show avatar if camera access fails
        localAvatar.classList.remove('hidden');
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
        remoteStream = event.streams[0];
        remoteVideo.srcObject = remoteStream;
        
        // Handle remote video state
        if (event.track.kind === 'video') {
            event.track.onmute = () => {
                remoteAvatar.classList.remove('hidden');
            };
            event.track.onunmute = () => {
                remoteAvatar.classList.add('hidden');
            };
        }
    };

    // Handle connection state
    peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
        if (peerConnection.connectionState === 'connected') {
            console.log('Peers connected successfully');
        }
    };

    // Handle ICE state
    peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE state:', peerConnection.iceConnectionState);
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            const candidatePath = peerConnection.localDescription.type === 'offer' 
                ? 'offerCandidates' 
                : 'answerCandidates';
            database.ref(`rooms/${roomId}/${candidatePath}`).push(event.candidate.toJSON());
        }
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

        // Update remote video state when peer toggles their video
        listenToRemoteVideoState();

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

        // Update remote video state when peer toggles their video
        listenToRemoteVideoState();

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
            
            // Toggle avatar
            localAvatar.classList.toggle('hidden', isVideoEnabled);

            // Notify peer about video state
            database.ref(`rooms/${roomId}/videoState`).set({
                enabled: isVideoEnabled
            });
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

// Update remote video state when peer toggles their video
function listenToRemoteVideoState() {
    database.ref(`rooms/${roomId}/videoState`).on('value', (snapshot) => {
        const state = snapshot.val();
        if (state) {
            remoteAvatar.classList.toggle('hidden', state.enabled);
        }
    });
}

window.addEventListener('load', init); 