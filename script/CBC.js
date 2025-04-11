function startCBCSimulation() {
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

    const iv = CryptoJS.lib.WordArray.random(16);
    let previousCipher = iv;
    const encryptedBlocks = [];

    plaintextBlocks.forEach((block, index) => {
        const blockBytes = CryptoJS.enc.Utf8.parse(block);
        const xored = xorWordArrays(blockBytes, previousCipher);

        const encrypted = CryptoJS.AES.encrypt(xored, keyBytes, {
            iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000"),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.NoPadding
        });

        const ciphertext = encrypted.ciphertext;
        encryptedBlocks.push(ciphertext.toString(CryptoJS.enc.hex));
        previousCipher = ciphertext;

        const blockContainer = document.createElement("div");
        blockContainer.classList.add("block-container");

        const plaintextBox = document.createElement("div");
        plaintextBox.classList.add("box", "plaintext-box");
        plaintextBox.textContent = block;

        const arrow5 = document.createElement("div");
        arrow5.classList.add("arrow");
        arrow5.textContent = "↓";

        const xorWrapper = document.createElement("div");
        xorWrapper.classList.add("xor-wrapper");

        const xorStack = document.createElement("div");
        xorStack.classList.add("xor-stack");

        const xorSource = document.createElement("div");
        xorSource.classList.add("box", "nonce");
        xorSource.textContent = index === 0 ? "IV" : "Prev CT";

        const arrow4 = document.createElement("div");
        arrow4.classList.add("arrow");
        arrow4.textContent = "→";

        const xorop = document.createElement("div");
        xorop.classList.add("xor");
        const xorImage = document.createElement("img");
        xorImage.src = "../assets/xor.png";
        xorImage.alt = "xor";
        xorImage.classList.add("icon");
        xorop.appendChild(xorImage);

        xorStack.appendChild(xorSource);
        xorStack.appendChild(arrow4);
        xorStack.appendChild(xorop);

        xorWrapper.appendChild(xorStack);

        const arrow1 = document.createElement("div");
        arrow1.classList.add("arrow");
        arrow1.textContent = "↓";

        const encryptionWrapper = document.createElement("div");
        encryptionWrapper.classList.add("encryption-wrapper");

        const keyBox = document.createElement("div");
        keyBox.classList.add("box", "key-box");
        keyBox.textContent = "Key";

        const arrow3 = document.createElement("div");
        arrow3.classList.add("arrow");
        arrow3.textContent = "→";

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
        blockContainer.appendChild(xorWrapper);
        blockContainer.appendChild(arrow5);
        blockContainer.appendChild(encryptionWrapper);
        blockContainer.appendChild(arrow2);
        blockContainer.appendChild(ciphertextBox);
        const wrapper = document.createElement("div");
        wrapper.classList.add("cbc-wrapper");
        wrapper.appendChild(blockContainer);
        blocksContainer.appendChild(wrapper);

        blockContainer.style.setProperty('--i', index);

        const initialdelay=5000;

        setTimeout(() => { xorSource.classList.add("nonce-animation"); }, initialdelay * index+0);
        setTimeout(() => { encryptionBox.textContent = "Encrypted"; }, initialdelay * index+2500);
        setTimeout(() => { keyBox.classList.add("key-animation"); }, initialdelay * index+1000);
        setTimeout(() => { ciphertextBox.textContent = encryptedBlocks[index]; }, initialdelay * index+3500);
    });

    setTimeout(() => {
        finalCiphertextDisplay.textContent = encryptedBlocks.join(" ");
    }, 7000);

    function xorWordArrays(wordArray1, wordArray2) {
        const result = wordArray1.clone();
        for (let i = 0; i < result.words.length; i++) {
            result.words[i] ^= wordArray2.words[i];
        }
        return result;
    }
}
