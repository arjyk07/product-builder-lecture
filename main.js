class LottoDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.numbers = [];
    }

    connectedCallback() {
        this.render();
    }

    generateNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        this.numbers = Array.from(numbers).sort((a, b) => a - b);
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .lotto-numbers {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                }
                .lotto-ball {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background-color: var(--main-color, #3498db);
                    color: var(--white-color, #fff);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.8rem;
                    font-weight: 600;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    transition: transform 0.3s ease;
                }
                .lotto-ball:hover {
                    transform: translateY(-5px);
                }
            </style>
            <div class="lotto-numbers">
                ${this.numbers.map(number => `<div class="lotto-ball">${number}</div>`).join('')}
            </div>
        `;
    }
}

customElements.define('lotto-display', LottoDisplay);

const generateBtn = document.getElementById("generate-btn");
const lottoDisplay = document.querySelector('lotto-display');

generateBtn.addEventListener("click", () => {
    lottoDisplay.generateNumbers();
});

// Initial generation
lottoDisplay.generateNumbers();
