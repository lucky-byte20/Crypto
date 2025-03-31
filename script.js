function startECBSimulation() {
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

    const encryptedBlocks = plaintextBlocks.map(block => {
        const blockBytes = CryptoJS.enc.Utf8.parse(block);
        const encrypted = CryptoJS.AES.encrypt(blockBytes, keyBytes, { 
            mode: CryptoJS.mode.ECB, 
            padding: CryptoJS.pad.Pkcs7 
        });
        return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    });

    plaintextBlocks.forEach((block, index) => {
        const blockContainer = document.createElement("div");
        blockContainer.classList.add("block-container");

        const plaintextBox = document.createElement("div");
        plaintextBox.classList.add("box", "plaintext-box");
        plaintextBox.textContent = block;

        const arrow1 = document.createElement("div");
        arrow1.classList.add("arrow");
        arrow1.textContent = "↓";

        const encryptionWrapper = document.createElement("div");
        encryptionWrapper.classList.add("encryption-wrapper");

        const keyBox = document.createElement("div");
        keyBox.classList.add("box", "key-box");
        keyBox.textContent = "Key";

        const arrow3= document.createElement("div");
        arrow3.classList.add("arrow");
        arrow3.textContent="→";

        const encryptionBox = document.createElement("div");
        encryptionBox.classList.add("box", "encryption-box");
        encryptionBox.textContent = "Encrypting...";
        
        encryptionWrapper.appendChild(keyBox);
        encryptionWrapper.appendChild(arrow3);
        encryptionWrapper.appendChild(encryptionBox);

        const arrow2 = document.createElement("div");
        arrow2.classList.add("arrow");
        arrow2.textContent = "↓";

        const ciphertextBox = document.createElement("div");
        ciphertextBox.classList.add("box", "ciphertext-box");
        ciphertextBox.textContent = "Processing...";

        blockContainer.appendChild(plaintextBox);
        blockContainer.appendChild(arrow1);
        blockContainer.appendChild(encryptionWrapper);
        blockContainer.appendChild(arrow2);
        blockContainer.appendChild(ciphertextBox);
        blocksContainer.appendChild(blockContainer);

        setTimeout(() => {encryptionBox.textContent = "Encrypted"; }, 3000);
        setTimeout(() => {keyBox.classList.add("key-animation"); }, 1500 * index);
        setTimeout(() => {ciphertextBox.textContent = encryptedBlocks[index];}, 4500);
    });

    setTimeout(() => {
        finalCiphertextDisplay.textContent = encryptedBlocks.join(" ");
    }, 6000);
}
