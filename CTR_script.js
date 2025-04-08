function startCTRSimulation() {
    const plaintext = document.getElementById("plaintext").value;
    const key = document.getElementById("key").value;
    const blocksContainer = document.getElementById("blocks-container");
    const finalCiphertextDisplay = document.getElementById("final-ciphertext");
    const plaintextDisplay = document.getElementById("plaintext-display");

    let initialCounter = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));

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
        blockContainer.style.position = "relative";
        blockContainer.style.opacity = "0";
        blockContainer.style.transition = "opacity 0.5s";
        blockContainer.style.marginTop = "100px";

        const currentCounter = initialCounter + BigInt(index);
        const { wordArray: counterBytes, displayValue: counterDisplay } = generateIncrementedCounter(currentCounter);

        const counterBox = document.createElement("div");
        counterBox.classList.add("box", "counter-box");
        counterBox.textContent = "Counter " + (index + 1) + ": " + counterDisplay;

        const arrow1 = document.createElement("div");
        arrow1.classList.add("arrow", "arrow-vertical");
        arrow1.textContent = "↓";

        const encryptionWrapper = document.createElement("div");
        encryptionWrapper.classList.add("encryption-wrapper");

        const keyBox = document.createElement("div");
        keyBox.classList.add("box", "key-box");
        keyBox.textContent = "Key";

        const arrow2 = document.createElement("div");
        arrow2.classList.add("arrow", "arrow-horizontal");
        arrow2.textContent = "→";

        const encryptionBox = document.createElement("div");
        encryptionBox.classList.add("box", "encryption-box");
        encryptionBox.textContent = "Encrypting...";

        encryptionWrapper.appendChild(keyBox);
        encryptionWrapper.appendChild(arrow2);
        encryptionWrapper.appendChild(encryptionBox);

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

        const xorStack = document.createElement("div");
        xorStack.classList.add("xor-stack");

        const arrow4 = document.createElement("div");
        arrow4.classList.add("arrow");
        arrow4.textContent = "→";

        const xorop = document.createElement("div");
        xorop.classList.add("xor");
        const xorImage = document.createElement("img");
        xorImage.src = "xor.png";
        xorImage.alt = "xor";
        xorImage.classList.add("icon");
        xorop.appendChild(xorImage);

        const perBlockPlaintextDisplay = document.createElement("div");
        perBlockPlaintextDisplay.textContent = block;
        perBlockPlaintextDisplay.classList.add("plaintext-line");

        xorStack.appendChild(perBlockPlaintextDisplay);
        xorStack.appendChild(arrow4);
        xorStack.appendChild(xorop);
        xorWrapper.appendChild(xorStack);

        const plaintextBox = document.createElement("div");
        plaintextBox.classList.add("box", "plaintext-box");

        block.split('').forEach(char => {
            const charSpan = document.createElement("span");
            charSpan.textContent = char;
            charSpan.classList.add("char-animate");
            plaintextBox.appendChild(charSpan);
        });

        const ciphertext = xorStrings(encryptedCounter, block);
        ciphertextBlocks.push(ciphertext);

        const ciphertextBox = document.createElement("div");
        ciphertextBox.classList.add("box", "ciphertext-box");
        ciphertextBox.textContent = "Processing...";

        const arrow5 = document.createElement("div");
        arrow5.classList.add("arrow", "arrow-vertical");
        arrow5.textContent = "↓";

        const arrow7 = document.createElement("div");
        arrow7.classList.add("arrow7", "arrow-vertical7");
        arrow7.textContent = "↓";

        const arrow3 = document.createElement("div");
        arrow3.classList.add("arrow", "arrow-vertical");
        arrow3.textContent = "↓";

        blockContainer.appendChild(counterBox);
        blockContainer.appendChild(arrow3);
        blockContainer.appendChild(encryptionWrapper);
        blockContainer.appendChild(arrow1);
        blockContainer.appendChild(xorWrapper);
        const spacer = document.createElement("div");
        spacer.style.height = "20px";
        blockContainer.appendChild(spacer);
        blockContainer.appendChild(arrow7);
        blockContainer.appendChild(ciphertextBox);

        const wrapper = document.createElement("div");
        wrapper.classList.add("ctr-wrapper");
        wrapper.appendChild(blockContainer);
        blocksContainer.appendChild(wrapper);

        blockContainer.style.setProperty('--i', index);

        setTimeout(() => { blockContainer.style.opacity = "1"; }, index * 1000);
        setTimeout(() => { encryptionBox.textContent = "Encrypted"; keyBox.classList.add("key-animation"); }, index * 5000 + 2000);
        setTimeout(() => { encryptedCounterBox.textContent = encryptedCounter; }, index * 5000 + 3500);
        setTimeout(() => { ciphertextBox.textContent = ciphertext; }, index * 5000 + 5000);
        setTimeout(() => { plaintextBox.classList.add("key-animation"); }, 1500 * index);
    });

    setTimeout(() => {
        finalCiphertextDisplay.textContent = `Final Ciphertext: ${ciphertextBlocks.join(" ")}`;
    }, (plaintextBlocks.length - 1) * 5000 + 6000);

    function generateIncrementedCounter(counterValue) {
        const numericString = counterValue.toString().padStart(16, '0');
        const byteArray = numericString.split('').map(d => d.charCodeAt(0));
        const wordArray = CryptoJS.lib.WordArray.create(byteArray);
    
        return {
            wordArray,
            displayValue: numericString
        };
    }

    function xorStrings(a, b) {
        let result = "";
        for (let i = 0; i < a.length; i++) {
            result += String.fromCharCode(a.charCodeAt(i) ^ (b.charCodeAt(i) || 0));
        }
        return btoa(result);
    }
    
    
}
