let localStream;
let peerConnections = {};  // Store multiple peer connections
let roomId;
let isVideoEnabled = true;
let isAudioEnabled = true;
let userId = generateUserId();  // Generate unique ID for each user

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
const videoContainer = document.querySelector('.video-container');
const localAvatar = document.querySelector('.avatar-container');
const roomInput = document.getElementById('roomId');
const createButton = document.getElementById('createButton');
const joinButton = document.getElementById('joinButton');
const videoButton = document.getElementById('videoButton');
const audioButton = document.getElementById('audioButton');

function generateUserId() {
    return Math.random().toString(36).substring(2, 15);
}

function createVideoElement(userId) {
    const videoWrapper = document.createElement('div');
    videoWrapper.className = 'video-wrapper';
    videoWrapper.id = `video-wrapper-${userId}`;

    const video = document.createElement('video');
    video.id = `video-${userId}`;
    video.autoplay = true;
    video.playsinline = true;

    const avatar = document.createElement('div');
    avatar.className = 'avatar-container hidden';
    avatar.innerHTML = '<i class="fas fa-user-circle"></i>';

    videoWrapper.appendChild(video);
    videoWrapper.appendChild(avatar);
    videoContainer.appendChild(videoWrapper);

    return { video, avatar };
}

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

    // Add yourself to the room's users
    await database.ref(`rooms/${roomId}/users/${userId}`).set({
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    // Listen for other users joining
    database.ref(`rooms/${roomId}/users`).on('child_added', async (snapshot) => {
        const joinedUserId = snapshot.key;
        if (joinedUserId !== userId && !peerConnections[joinedUserId]) {
            await createPeerConnection(joinedUserId);
        }
    });

    // Listen for users leaving
    database.ref(`rooms/${roomId}/users`).on('child_removed', (snapshot) => {
        const leftUserId = snapshot.key;
        if (peerConnections[leftUserId]) {
            removePeerConnection(leftUserId);
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

    // Add yourself to the room
    await database.ref(`rooms/${roomId}/users/${userId}`).set({
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    // Connect to existing users
    const usersSnapshot = await database.ref(`rooms/${roomId}/users`).get();
    usersSnapshot.forEach((userSnapshot) => {
        const existingUserId = userSnapshot.key;
        if (existingUserId !== userId && !peerConnections[existingUserId]) {
            createPeerConnection(existingUserId);
        }
    });

    // Listen for new users
    database.ref(`rooms/${roomId}/users`).on('child_added', async (snapshot) => {
        const joinedUserId = snapshot.key;
        if (joinedUserId !== userId && !peerConnections[joinedUserId]) {
            await createPeerConnection(joinedUserId);
        }
    });

    // Listen for users leaving
    database.ref(`rooms/${roomId}/users`).on('child_removed', (snapshot) => {
        const leftUserId = snapshot.key;
        if (peerConnections[leftUserId]) {
            removePeerConnection(leftUserId);
        }
    });
}

async function createPeerConnection(remoteUserId) {
    const peerConnection = new RTCPeerConnection(servers);
    peerConnections[remoteUserId] = peerConnection;

    // Add local tracks
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    // Create video element for remote user
    const { video: remoteVideo, avatar: remoteAvatar } = createVideoElement(remoteUserId);

    // Handle incoming tracks
    peerConnection.ontrack = ({ streams: [stream] }) => {
        remoteVideo.srcObject = stream;
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            database.ref(`rooms/${roomId}/connections/${userId}-${remoteUserId}/candidates`)
                .push(event.candidate.toJSON());
        }
    };

    // Create offer if you're the newer user
    const userRef = database.ref(`rooms/${roomId}/users/${userId}`);
    const remoteUserRef = database.ref(`rooms/${roomId}/users/${remoteUserId}`);
    const [userSnapshot, remoteUserSnapshot] = await Promise.all([
        userRef.get(),
        remoteUserRef.get()
    ]);

    if (userSnapshot.val().timestamp > remoteUserSnapshot.val().timestamp) {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        await database.ref(`rooms/${roomId}/connections/${userId}-${remoteUserId}/offer`).set({
            type: offer.type,
            sdp: offer.sdp
        });
    }

    // Listen for remote offer/answer
    database.ref(`rooms/${roomId}/connections`).on('child_added', async (snapshot) => {
        const connection = snapshot.val();
        const connectionId = snapshot.key;

        if (connectionId.includes(userId) && connectionId.includes(remoteUserId)) {
            if (connection.offer && !connection.answer && connectionId.split('-')[1] === userId) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(connection.offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);

                await database.ref(`rooms/${roomId}/connections/${connectionId}/answer`).set({
                    type: answer.type,
                    sdp: answer.sdp
                });
            } else if (connection.answer && connectionId.split('-')[0] === userId) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(connection.answer));
            }
        }
    });

    // Listen for ICE candidates
    database.ref(`rooms/${roomId}/connections`).on('child_added', (snapshot) => {
        const connectionId = snapshot.key;
        if (connectionId.includes(userId) && connectionId.includes(remoteUserId)) {
            database.ref(`rooms/${roomId}/connections/${connectionId}/candidates`).on('child_added', (candidateSnapshot) => {
                const candidate = candidateSnapshot.val();
                if (candidate && peerConnection.remoteDescription) {
                    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                }
            });
        }
    });
}

function removePeerConnection(remoteUserId) {
    const videoWrapper = document.getElementById(`video-wrapper-${remoteUserId}`);
    if (videoWrapper) {
        videoWrapper.remove();
    }

    if (peerConnections[remoteUserId]) {
        peerConnections[remoteUserId].close();
        delete peerConnections[remoteUserId];
    }
}

// Clean up when leaving
window.addEventListener('beforeunload', () => {
    if (roomId && userId) {
        database.ref(`rooms/${roomId}/users/${userId}`).remove();
    }
});

// ... rest of your existing toggle functions ...

createButton.addEventListener('click', createRoom);
joinButton.addEventListener('click', joinRoom);
videoButton.addEventListener('click', toggleVideo);
audioButton.addEventListener('click', toggleAudio);

window.addEventListener('load', init); 