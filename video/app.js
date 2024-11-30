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
const localAvatar = document.querySelector('.local-avatar-container');
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
        localAvatar.classList.add('hidden');
        console.log('Local stream initialized');
    } catch (err) {
        console.error('Error getting media:', err);
        localAvatar.classList.remove('hidden');
    }
}

async function createRoom() {
    try {
        roomId = roomInput.value || Math.random().toString(36).substring(7);
        roomInput.value = roomId;
        console.log('Creating room:', roomId);

        // Clear any existing room data
        await database.ref(`rooms/${roomId}`).remove();

        peerConnection = new RTCPeerConnection(servers);

        // Add local tracks
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        // Handle remote stream
        peerConnection.ontrack = event => {
            console.log('Received remote track');
            if (remoteVideo.srcObject !== event.streams[0]) {
                remoteVideo.srcObject = event.streams[0];
            }
        };

        // Create offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        console.log('Local description set');

        // Save offer to database
        await database.ref(`rooms/${roomId}`).set({
            offer: {
                type: offer.type,
                sdp: offer.sdp
            }
        });

        // Handle answer
        database.ref(`rooms/${roomId}/answer`).on('value', async snapshot => {
            const answer = snapshot.val();
            if (answer && !peerConnection.currentRemoteDescription) {
                console.log('Setting remote description from answer');
                const answerDescription = new RTCSessionDescription(answer);
                await peerConnection.setRemoteDescription(answerDescription);
            }
        });

        // Handle ICE candidates
        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                console.log('Sending ICE candidate');
                database.ref(`rooms/${roomId}/offerCandidates`).push(event.candidate.toJSON());
            }
        };

        database.ref(`rooms/${roomId}/answerCandidates`).on('child_added', snapshot => {
            const candidate = snapshot.val();
            if (candidate) {
                console.log('Adding answer ICE candidate');
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        alert(`Room Created: ${roomId}`);

        handleRemoteVideoState();
    } catch (error) {
        console.error('Error in createRoom:', error);
        alert(error.message);
    }
}

async function joinRoom() {
    try {
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

        console.log('Joining room:', roomId);
        peerConnection = new RTCPeerConnection(servers);

        // Add local tracks
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        // Handle remote stream
        peerConnection.ontrack = event => {
            console.log('Received remote track');
            if (remoteVideo.srcObject !== event.streams[0]) {
                remoteVideo.srcObject = event.streams[0];
            }
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                console.log('Sending ICE candidate');
                database.ref(`rooms/${roomId}/answerCandidates`).push(event.candidate.toJSON());
            }
        };

        // Get the room data
        const roomData = roomSnapshot.val();
        console.log('Got room data:', roomData);

        // Set remote description from offer
        if (roomData.offer) {
            console.log('Setting remote description from offer');
            await peerConnection.setRemoteDescription(new RTCSessionDescription(roomData.offer));

            // Create and set local answer
            console.log('Creating answer');
            const answer = await peerConnection.createAnswer();
            console.log('Setting local description');
            await peerConnection.setLocalDescription(answer);

            // Save answer
            await roomRef.update({
                answer: {
                    type: answer.type,
                    sdp: answer.sdp
                }
            });
        }

        // Handle ICE candidates from offer
        database.ref(`rooms/${roomId}/offerCandidates`).on('child_added', snapshot => {
            const candidate = snapshot.val();
            if (candidate) {
                console.log('Adding offer ICE candidate');
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        handleRemoteVideoState();
    } catch (error) {
        console.error('Error in joinRoom:', error);
        alert(error.message);
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
            
            // Toggle local avatar
            localAvatar.classList.toggle('hidden', isVideoEnabled);
            
            // Notify peer about video state
            if (roomId) {
                database.ref(`rooms/${roomId}/videoState`).set({
                    enabled: isVideoEnabled
                });
            }
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

// Add function to handle remote video state
function handleRemoteVideoState() {
    if (roomId) {
        database.ref(`rooms/${roomId}/videoState`).on('value', (snapshot) => {
            const state = snapshot.val();
            if (state) {
                remoteAvatar.classList.toggle('hidden', state.enabled);
            }
        });
    }
}

// Add event listener for remote video track ended
function setupRemoteVideoHandlers() {
    remoteVideo.addEventListener('loadedmetadata', () => {
        console.log('Remote video loaded');
        remoteAvatar.classList.add('hidden');
    });

    // Handle remote track ending
    if (peerConnection) {
        peerConnection.ontrack = event => {
            console.log('Received remote track');
            if (remoteVideo.srcObject !== event.streams[0]) {
                remoteVideo.srcObject = event.streams[0];
                
                event.track.onended = () => {
                    console.log('Remote track ended');
                    remoteAvatar.classList.remove('hidden');
                };

                event.track.onunmute = () => {
                    console.log('Remote track unmuted');
                    remoteAvatar.classList.add('hidden');
                };

                event.track.onmute = () => {
                    console.log('Remote track muted');
                    remoteAvatar.classList.remove('hidden');
                };
            }
        };
    }
}

// Clean up function
function cleanup() {
    if (roomId) {
        database.ref(`rooms/${roomId}`).remove();
    }
    if (peerConnection) {
        peerConnection.close();
    }
    remoteVideo.srcObject = null;
    remoteAvatar.classList.remove('hidden');
}

// Update event listeners
window.addEventListener('beforeunload', cleanup);
window.addEventListener('load', init);
createButton.addEventListener('click', createRoom);
joinButton.addEventListener('click', joinRoom);
videoButton.addEventListener('click', toggleVideo);
audioButton.addEventListener('click', toggleAudio);