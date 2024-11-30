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
                'stun:stun2.l.google.com:19302',
                'stun:stun3.l.google.com:19302',
                'stun:stun4.l.google.com:19302'
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
    } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Error accessing camera and microphone');
    }
}

async function createRoom() {
    roomId = Math.random().toString(36).substring(7);
    roomInput.value = roomId;
    
    peerConnection = new RTCPeerConnection(servers);
    
    // Add local tracks to peer connection
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    // Set up remote stream handling
    remoteStream = new MediaStream();
    remoteVideo.srcObject = remoteStream;

    // Set up event handlers
    setupPeerConnectionHandlers();

    // Create and set offer
    try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        const roomRef = database.ref(`rooms/${roomId}`);
        await roomRef.set({
            'offer': {
                type: offer.type,
                sdp: offer.sdp
            }
        });

        // Listen for answer
        roomRef.on('value', async snapshot => {
            const data = snapshot.val();
            if (!peerConnection.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer);
                await peerConnection.setRemoteDescription(answerDescription);
            }
        });

        // Listen for remote ICE candidates
        roomRef.child('answerCandidates').on('child_added', async snapshot => {
            if (snapshot.val()) {
                try {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(snapshot.val()));
                } catch (e) {
                    console.error('Error adding answer candidate:', e);
                }
            }
        });
    } catch (error) {
        console.error('Error creating room:', error);
    }
}

async function joinRoom() {
    roomId = roomInput.value;
    if (!roomId) {
        alert('Please enter a room ID');
        return;
    }

    peerConnection = new RTCPeerConnection(servers);
    
    // Add local tracks to peer connection
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    // Set up remote stream handling
    remoteStream = new MediaStream();
    remoteVideo.srcObject = remoteStream;

    // Set up event handlers
    setupPeerConnectionHandlers();

    try {
        const roomRef = database.ref(`rooms/${roomId}`);
        const roomSnapshot = await roomRef.get();
        
        if (!roomSnapshot.exists()) {
            alert('Room does not exist');
            return;
        }

        const data = roomSnapshot.val();
        if (data?.offer) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            await roomRef.update({
                'answer': {
                    type: answer.type,
                    sdp: answer.sdp
                }
            });
        }

        // Listen for remote ICE candidates
        roomRef.child('offerCandidates').on('child_added', async snapshot => {
            if (snapshot.val()) {
                try {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(snapshot.val()));
                } catch (e) {
                    console.error('Error adding offer candidate:', e);
                }
            }
        });
    } catch (error) {
        console.error('Error joining room:', error);
    }
}

function setupPeerConnectionHandlers() {
    // Handle remote tracks
    peerConnection.ontrack = (event) => {
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
            console.log('Adding track to remote stream:', track);
            remoteStream.addTrack(track);
        });
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            const isOffer = peerConnection.localDescription.type === 'offer';
            const candidatesPath = isOffer ? 'offerCandidates' : 'answerCandidates';
            database.ref(`rooms/${roomId}/${candidatesPath}`).push(event.candidate.toJSON());
        }
    };

    // Log connection state changes
    peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
    };

    peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection.iceConnectionState);
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