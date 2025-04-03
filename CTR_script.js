function startCTRSimulation() {
    const plaintext = document.getElementById("plaintext").value;
    const key = document.getElementById("key").value;
    const blocksContainer = document.getElementById("blocks-container");
    const finalCiphertextDisplay = document.getElementById("final-ciphertext");
    const plaintextDisplay = document.getElementById("plaintext-display");

    blocksContainer.innerHTML = "";
    finalCiphertextDisplay.textContent = "";
    plaintextDisplay.textContent = plaintext;

    if (!plaintext || key.length !== 16) {
        alert("Please enter plaintext and a 16-character key.");
        return;
    }

    const keyBytes = CryptoJS.enc.Utf8.parse(key);
    const blockSize = 16;
    const plaintextBlocks = [];

    for (let i = 0; i < plaintext.length; i += blockSize) {
        plaintextBlocks.push(plaintext.substring(i, i + blockSize).padEnd(blockSize, ' '));
    }

    let ciphertextBlocks = [];

    plaintextBlocks.forEach((block, index) => {
        const blockContainer = document.createElement("div");
        blockContainer.classList.add("block-container");

        const counterValue = generateRandomCounter();

        const counterBox = document.createElement("div");
        counterBox.classList.add("box", "counter-box");
        counterBox.textContent = "Counter " + (index + 1) + ": " + counterValue;

        const arrow1 = document.createElement("div");
        arrow1.classList.add("arrow");
        arrow1.textContent = "↓";

        const arrow3 = document.createElement("div");
        arrow3.classList.add("arrow");
        arrow3.textContent = "↓";

        const arrow5 = document.createElement("div");
        arrow5.classList.add("arrow");
        arrow5.textContent = "↓";

        const encryptionWrapper = document.createElement("div");
        encryptionWrapper.classList.add("encryption-wrapper");

        const keyBox = document.createElement("div");
        keyBox.classList.add("box", "key-box");
        keyBox.textContent = "Key";

        const arrow2 = document.createElement("div");
        arrow2.classList.add("arrow");
        arrow2.textContent = "→";

        const encryptionBox = document.createElement("div");
        encryptionBox.classList.add("box", "encryption-box");
        encryptionBox.textContent = "Encrypting...";

        encryptionWrapper.appendChild(keyBox);
        encryptionWrapper.appendChild(arrow2);
        encryptionWrapper.appendChild(encryptionBox);

        const counterBytes = CryptoJS.enc.Utf8.parse(counterValue);
        const encrypted = CryptoJS.AES.encrypt(counterBytes, keyBytes, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.NoPadding
        });
        const encryptedCounter = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

        const encryptedCounterBox = document.createElement("div");
        encryptedCounterBox.classList.add("box", "encrypted-counter-box");
        encryptedCounterBox.textContent = "Processing...";

        const xorWrapper = document.createElement("div");
        xorWrapper.classList.add("xor-wrapper");

        const plaintextBox = document.createElement("div");
        plaintextBox.classList.add("box", "plaintext-box");
        plaintextBox.textContent = block;

        const arrow4 = document.createElement("div");
        arrow4.classList.add("arrow");
        arrow4.textContent = "→";

        const xorOperator = document.createElement("div");
        xorOperator.classList.add("xor-operator");
        xorOperator.innerHTML = "&#8853;";

        xorWrapper.appendChild(plaintextBox);
        xorWrapper.appendChild(arrow4);
        xorWrapper.appendChild(xorOperator);

        const ciphertext = xorStrings(encryptedCounter, block);
        ciphertextBlocks.push(ciphertext);

        const ciphertextBox = document.createElement("div");
        ciphertextBox.classList.add("box", "ciphertext-box");
        ciphertextBox.textContent = "Processing...";

        blockContainer.appendChild(counterBox);
        blockContainer.appendChild(arrow1);
        blockContainer.appendChild(encryptionWrapper);
        blockContainer.appendChild(arrow3);
        blockContainer.appendChild(xorWrapper);
        blockContainer.appendChild(arrow5);
        blockContainer.appendChild(ciphertextBox);
        blocksContainer.appendChild(blockContainer);

        setTimeout(() => { encryptionBox.textContent = "Encrypted"; }, 2000);
        setTimeout(() => { encryptedCounterBox.textContent = encryptedCounter; }, 3500);
        setTimeout(() => { ciphertextBox.textContent = ciphertext; }, 5000);
    });

    setTimeout(() => {
        finalCiphertextDisplay.textContent = ciphertextBlocks.join(" ");
    }, 6000);
}

function generateRandomCounter() {
    let counter = "";
    for (let i = 0; i < 16; i++) {
        counter += Math.floor(Math.random() * 16).toString(16);
    }
    return counter;
}

function xorStrings(a, b) {
    let result = "";
    for (let i = 0; i < a.length; i++) {
        result += String.fromCharCode(a.charCodeAt(i) ^ (b.charCodeAt(i) || 0));
    }
    return btoa(result);
}
