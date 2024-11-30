let localStream;
let remoteStream = new MediaStream();
let peerConnection;
let roomId;
let isVideoEnabled = true;
let isAudioEnabled = true;

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

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
    ]
};

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
    registerPeerConnectionListeners();

    peerConnection.addTransceiver('video', { direction: 'sendrecv' });
    peerConnection.addTransceiver('audio', { direction: 'sendrecv' });

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    const roomRef = database.ref(`rooms/${roomId}`);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    const roomWithOffer = {
        offer: {
            type: offer.type,
            sdp: offer.sdp
        }
    };

    await roomRef.set(roomWithOffer);

    roomRef.on('value', async snapshot => {
        const data = snapshot.val();
        if (!peerConnection.currentRemoteDescription && data?.answer) {
            const answerDescription = new RTCSessionDescription(data.answer);
            await peerConnection.setRemoteDescription(answerDescription);
        }
    });
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
    registerPeerConnectionListeners();

    peerConnection.addTransceiver('video', { direction: 'sendrecv' });
    peerConnection.addTransceiver('audio', { direction: 'sendrecv' });

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    const data = roomSnapshot.val();
    if (data.offer) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        const roomWithAnswer = {
            answer: {
                type: answer.type,
                sdp: answer.sdp
            }
        };

        await roomRef.update(roomWithAnswer);
    }
}

function registerPeerConnectionListeners() {
    let candidatesQueue = [];

    peerConnection.ontrack = (event) => {
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
            console.log('Adding track to remote stream:', track);
            remoteStream.addTrack(track);
        });
        remoteVideo.srcObject = remoteStream;
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            database.ref(`rooms/${roomId}/candidates/${peerConnection.localDescription.type}`).push(event.candidate.toJSON());
        }
    };

    peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection.iceConnectionState);
    };

    peerConnection.onsignalingstatechange = () => {
        console.log('Signaling state:', peerConnection.signalingState);
    };

    // Handle remote ICE candidates
    database.ref(`rooms/${roomId}/candidates/${peerConnection.localDescription?.type === 'offer' ? 'answer' : 'offer'}`).on('child_added', async snapshot => {
        const candidate = new RTCIceCandidate(snapshot.val());
        if (peerConnection.remoteDescription) {
            await peerConnection.addIceCandidate(candidate);
        } else {
            candidatesQueue.push(candidate);
        }
    });

    // Process queued candidates after remote description is set
    peerConnection.addEventListener('signalingstatechange', async () => {
        if (peerConnection.signalingState === 'stable' && candidatesQueue.length > 0) {
            while (candidatesQueue.length) {
                const candidate = candidatesQueue.shift();
                await peerConnection.addIceCandidate(candidate);
            }
        }
    });
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