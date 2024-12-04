const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const results = document.getElementById('results');
const ctx = overlay.getContext('2d');

// Load all face-api models
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    faceapi.nets.ageGenderNet.loadFromUri('./models')   
]).then(startVideo);

// Start video stream
async function startVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error accessing camera:", err);
    }
}

// Process each frame
video.addEventListener('play', () => {
    overlay.width = video.width;
    overlay.height = video.height;
    
    setInterval(async () => {
        // Detect faces
        const detections = await faceapi.detectAllFaces(
            video, 
            new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

        // Clear previous drawings
        ctx.clearRect(0, 0, overlay.width, overlay.height);

        // Draw results
        detections.forEach(detection => {
            // Draw face box
            const box = detection.detection.box;
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.strokeRect(box.x, box.y, box.width, box.height);

            // Display results
            const age = Math.round(detection.age);
            const gender = detection.gender;
            const expressions = detection.expressions;
            const dominantExpression = Object.entries(expressions)
                .reduce((a, b) => a[1] > b[1] ? a : b)[0];

            // Suggest name based on gender
            const maleNames = ['James', 'John', 'Robert', 'Michael', 'William'];
            const femaleNames = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth'];
            const suggestedName = gender === 'male' 
                ? maleNames[Math.floor(Math.random() * maleNames.length)]
                : femaleNames[Math.floor(Math.random() * femaleNames.length)];

            // Display text above face box
            ctx.fillStyle = '#00ff00';
            ctx.font = '16px Arial';
            ctx.fillText(
                `Age: ${age} | Gender: ${gender} | Mood: ${dominantExpression}`,
                box.x, 
                box.y - 20
            );
            ctx.fillText(
                `Suggested Name: ${suggestedName}`,
                box.x,
                box.y - 5
            );

            // Update results div
            results.innerHTML = `
                <h2>Analysis Results:</h2>
                <p>Age: ${age} years</p>
                <p>Gender: ${gender}</p>
                <p>Expression: ${dominantExpression}</p>
                <p>Suggested Name: ${suggestedName}</p>
            `;
        });
    }, 100);
}); 