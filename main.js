// Teachable Machine Model URL
const URL = "https://teachablemachine.withgoogle.com/models/cc5cMJXrn/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const startBtn = document.getElementById("start-btn");
    startBtn.style.display = "none";

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(300, 300, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        const labelDiv = document.createElement("div");
        labelDiv.className = "prediction-bar";
        labelContainer.appendChild(labelDiv);
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = prediction[i].probability.toFixed(2);
        
        labelContainer.childNodes[i].innerHTML = `
            <div class="class-label">${className}</div>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${probability * 100}%"></div>
            </div>
            <div class="probability-label">${(probability * 100).toFixed(0)}%</div>
        `;
    }
}

// Theme toggle logic
const themeBtn = document.getElementById("theme-btn");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeBtn.textContent = "Light Mode";
}

themeBtn.addEventListener("click", () => {
    let theme = document.documentElement.getAttribute("data-theme");
    if (theme === "dark") {
        document.documentElement.removeAttribute("data-theme");
        themeBtn.textContent = "Dark Mode";
        localStorage.setItem("theme", "light");
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        themeBtn.textContent = "Light Mode";
        localStorage.setItem("theme", "dark");
    }
});

const startBtn = document.getElementById("start-btn");
if (startBtn) {
    startBtn.addEventListener("click", init);
}
