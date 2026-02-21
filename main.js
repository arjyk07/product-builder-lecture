// Teachable Machine Model URL
const URL = "https://teachablemachine.withgoogle.com/models/cc5cMJXrn/";

let model, labelContainer, maxPredictions;

// Load the image model
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById("label-container");
    setupFileInput();
}

function setupFileInput() {
    const imageInput = document.getElementById("image-input");
    const imagePreview = document.getElementById("image-preview");

    imageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.src = event.target.result;
                imagePreview.style.display = "block";
                imagePreview.onload = () => {
                    predict(imagePreview);
                };
            };
            reader.readAsDataURL(file);
        }
    });
}

// run the image through the image model
async function predict(imageElement) {
    const prediction = await model.predict(imageElement);
    
    // Clear previous results
    labelContainer.innerHTML = "";
    
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = prediction[i].probability.toFixed(2);
        
        const labelDiv = document.createElement("div");
        labelDiv.className = "prediction-bar";
        labelDiv.innerHTML = `
            <div class="class-label">${className}</div>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${probability * 100}%"></div>
            </div>
            <div class="probability-label">${(probability * 100).toFixed(0)}%</div>
        `;
        labelContainer.appendChild(labelDiv);
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

// Initialize on page load
init();
