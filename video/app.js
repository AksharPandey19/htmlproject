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
        {
            urls: ['turn:numb.viagenie.ca'],
            credential: 'muazkh',
            username: 'webrtc@live.com'
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

// Event listeners
createButton.addEventListener('click', createRoom);
joinButton.addEventListener('click', joinRoom);
videoButton.addEventListener('click', toggleVideo);
audioButton.addEventListener('click', toggleAudio);

async function init() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
        });
        localVideo.srcObject = localStream;
        console.log('Local stream initialized successfully');
    } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Error accessing camera and microphone: ' + error.message);
    }
}

async function createRoom() {
    try {
        console.log('Creating new room...');
        roomId = Math.random().toString(36).substring(7);
        roomInput.value = roomId;
        console.log('Room ID created:', roomId);

        // Clear any existing room data
        await database.ref(`rooms/${roomId}`).remove();
        
        peerConnection = new RTCPeerConnection(servers);
        console.log('PeerConnection created');
        
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        remoteStream = new MediaStream();
        remoteVideo.srcObject = remoteStream;

        setupPeerConnectionHandlers();

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        console.log('Local description set');

        const roomRef = database.ref(`rooms/${roomId}`);
        await roomRef.set({
            'offer': {
                type: offer.type,
                sdp: offer.sdp
            },
            'status': 'waiting'
        });
        console.log('Room created in Firebase');

        // Listen for remote answer
        roomRef.on('value', async snapshot => {
            const data = snapshot.val();
            if (!peerConnection.currentRemoteDescription && data?.answer) {
                console.log('Received remote answer');
                const answerDescription = new RTCSessionDescription(data.answer);
                await peerConnection.setRemoteDescription(answerDescription);
            }
        });

        roomRef.child('answerCandidates').on('child_added', async snapshot => {
            if (snapshot.val()) {
                console.log('Adding answer candidate');
                await peerConnection.addIceCandidate(new RTCIceCandidate(snapshot.val()));
            }
        });

        alert(`Room created! Share this ID: ${roomId}`);

    } catch (error) {
        console.error('Error creating room:', error);
        alert('Error creating room: ' + error.message);
    }
}

async function joinRoom() {
    try {
        console.log('Joining room...');
        roomId = roomInput.value;
        if (!roomId) {
            alert('Please enter a room ID');
            return;
        }

        peerConnection = new RTCPeerConnection(servers);
        console.log('PeerConnection created');

        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        remoteStream = new MediaStream();
        remoteVideo.srcObject = remoteStream;

        setupPeerConnectionHandlers();

        const roomRef = database.ref(`rooms/${roomId}`);
        const roomSnapshot = await roomRef.get();
        
        if (!roomSnapshot.exists()) {
            alert('Room does not exist');
            return;
        }

        console.log('Room found');
        const data = roomSnapshot.val();
        
        if (data?.offer) {
            console.log('Setting remote description');
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            
            console.log('Creating answer');
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            console.log('Updating room with answer');
            await roomRef.update({
                'answer': {
                    type: answer.type,
                    sdp: answer.sdp
                },
                'status': 'connected'
            });
        }

        roomRef.child('offerCandidates').on('child_added', async snapshot => {
            if (snapshot.val()) {
                console.log('Adding offer candidate');
                await peerConnection.addIceCandidate(new RTCIceCandidate(snapshot.val()));
            }
        });

        console.log('Join process completed');

    } catch (error) {
        console.error('Error joining room:', error);
        alert('Error joining room: ' + error.message);
    }
}

function setupPeerConnectionHandlers() {
    peerConnection.ontrack = (event) => {
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
            console.log('Adding track to remote stream:', track);
            remoteStream.addTrack(track);
        });
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log('New ICE candidate');
            const isOffer = peerConnection.localDescription.type === 'offer';
            const candidatesPath = isOffer ? 'offerCandidates' : 'answerCandidates';
            database.ref(`rooms/${roomId}/${candidatesPath}`).push(event.candidate.toJSON());
        }
    };

    peerConnection.onconnectionstatechange = () => {
        console.log('Connection state changed:', peerConnection.connectionState);
    };

    peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state changed:', peerConnection.iceConnectionState);
    };

    peerConnection.onsignalingstatechange = () => {
        console.log('Signaling state changed:', peerConnection.signalingState);
    };
}

function toggleVideo() {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        const avatarContainer = document.querySelector('.avatar-container');
        
        if (videoTrack) {
            isVideoEnabled = !isVideoEnabled;
            videoTrack.enabled = isVideoEnabled;
            videoButton.classList.toggle('disabled', !isVideoEnabled);
            videoButton.innerHTML = isVideoEnabled ? 
                '<i class="fas fa-video"></i>' : 
                '<i class="fas fa-video-slash"></i>';
            
            avatarContainer.classList.toggle('hidden', isVideoEnabled);
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