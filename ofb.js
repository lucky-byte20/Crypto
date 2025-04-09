function startOFBSimulation() {
    const plaintext = document.getElementById("plaintext").value;
    const key = document.getElementById("key").value;
    let ivInput = document.getElementById("iv");
    let iv = ivInput && ivInput.value ? ivInput.value : generateRandomIV();    
    const blocksContainer = document.getElementById("blocks-container");
    const finalCiphertextDisplay = document.getElementById("final-ciphertext");
    const plaintextDisplay = document.getElementById("plaintext-display");

    blocksContainer.innerHTML = "";
    finalCiphertextDisplay.textContent = "";
    plaintextDisplay.textContent = plaintext;

    if (!plaintext || key.length !== 16 || iv.length !== 16) {
        alert("Please enter plaintext, a 16-character key, and a 16-character IV.");
        return;
    }

    const keyBytes = CryptoJS.enc.Utf8.parse(key);
    let currentIV = CryptoJS.enc.Utf8.parse(iv);
    const blockSize = 16;
    const plaintextBlocks = [];

    for (let i = 0; i < plaintext.length; i += blockSize) {
        plaintextBlocks.push(plaintext.substring(i, i + blockSize).padEnd(blockSize, ' '));
    }

    const encryptedBlocks = [];

    plaintextBlocks.forEach((block, index) => {
        // Step 1: Encrypt current IV (previous output)
        const encryptedOutput = CryptoJS.AES.encrypt(currentIV, keyBytes, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.NoPadding
        }).ciphertext;

        const outputWordArray = CryptoJS.lib.WordArray.create(encryptedOutput.words.slice(0), 16);
        const plaintextWordArray = CryptoJS.enc.Utf8.parse(block);

        // Step 2: XOR the output with plaintext block
        const ciphertextBlock = plaintextWordArray.clone();
        for (let i = 0; i < plaintextWordArray.words.length; i++) {
            ciphertextBlock.words[i] ^= outputWordArray.words[i];
        }

        const base64Ciphertext = CryptoJS.enc.Base64.stringify(ciphertextBlock);
        encryptedBlocks.push(base64Ciphertext);
        currentIV = outputWordArray;

        // === UI Rendering ===
        const blockContainer = document.createElement("div");
        blockContainer.classList.add("block-container");

        // 1. Nonce / Output Box
        const nonceBox = document.createElement("div");
        nonceBox.classList.add("box", "nonce-box");
        nonceBox.textContent = index === 0 ? "IV" : `Pervious Encryption`;
        blockContainer.appendChild(nonceBox);

        // ↓
        const arrow1 = document.createElement("div");
        arrow1.classList.add("arrow");
        arrow1.textContent = "↓";
        blockContainer.appendChild(arrow1);

        // 2. Encryption: Key → Output
        const encryptionWrapper = document.createElement("div");
        encryptionWrapper.classList.add("encryption-wrapper");

        const keyBox = document.createElement("div");
        keyBox.classList.add("box", "key-box");
        keyBox.textContent = "Key";

        const arrowEnc = document.createElement("div");
        arrowEnc.classList.add("arrow");
        arrowEnc.textContent = "→";

        const outputBox = document.createElement("div");
        outputBox.classList.add("box", "encryption-box");
        outputBox.textContent = "Encrypting...";

        encryptionWrapper.appendChild(keyBox);
        encryptionWrapper.appendChild(arrowEnc);
        encryptionWrapper.appendChild(outputBox);
        blockContainer.appendChild(encryptionWrapper);

        // ↓
        const arrow2 = document.createElement("div");
        arrow2.classList.add("arrow");
        arrow2.textContent = "↓";
        blockContainer.appendChild(arrow2);

        // 3. XOR Step
        const xorWrapper = document.createElement("div");
        xorWrapper.classList.add("xor-wrapper");

        const xorStack = document.createElement("div");
        xorStack.classList.add("xor-stack");

        const plaintextLine = document.createElement("div");
        plaintextLine.classList.add("plaintext-line");
        plaintextLine.textContent = block;

        const arrow3 = document.createElement("div");
        arrow3.classList.add("arrow");
        arrow3.textContent = "→";

        const xorop = document.createElement("div");
        xorop.classList.add("xor");
        const xorImage = document.createElement("img");
        xorImage.src = "xor.png";
        xorImage.alt = "xor";
        xorImage.classList.add("icon");
        xorop.appendChild(xorImage);

        xorStack.appendChild(plaintextLine);
        xorStack.appendChild(arrow3);
        xorStack.appendChild(xorop);
        xorWrapper.appendChild(xorStack);
        blockContainer.appendChild(xorWrapper);

        // ↓
        const arrow4 = document.createElement("div");
        arrow4.classList.add("arrow");
        arrow4.textContent = "↓";
        blockContainer.appendChild(arrow4);

        // 4. Ciphertext
        const ciphertextBox = document.createElement("div");
        ciphertextBox.classList.add("box", "ciphertext-box");
        ciphertextBox.textContent = "Processing...";
        blockContainer.appendChild(ciphertextBox);

        // Add block to container
        blocksContainer.appendChild(blockContainer);
    
        // === Animations ===
        setTimeout(() => {
            outputBox.textContent = "Encrypt";
        }, 1000 * index);

        setTimeout(() => {
            ciphertextBox.textContent = base64Ciphertext;
        }, 1500 * index);

        setTimeout(() => {
            keyBox.classList.add("key-animation");
            nonceBox.classList.add("key-animation");
        }, 500 * index);
    });

    setTimeout(() => {
        finalCiphertextDisplay.textContent = encryptedBlocks.join(" ");
    }, 2000 * plaintextBlocks.length + 1000);

    function generateRandomIV(length = 16) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
}

