function startCFBSimulation() {
    const plaintext = document.getElementById("plaintext").value;
    const key = document.getElementById("key").value;
    const blocksContainer = document.getElementById("blocks-container");
    const finalCiphertextDisplay = document.getElementById("final-ciphertext");
    const plaintextDisplay = document.getElementById("plaintext-display");
  
    blocksContainer.innerHTML = "";
    finalCiphertextDisplay.textContent = "";
    plaintextDisplay.textContent = plaintext;
  
    if (!plaintext || key.length !== 16) {
        alert("Enter plaintext and a 16-character key.");
        return;
    }
  
    const blockSize = 16;
    const sBits = 8;
    const keyBytes = CryptoJS.enc.Utf8.parse(key);
    const plaintextBlocks = [];
    for (let i = 0; i < plaintext.length; i += sBits) {
        plaintextBlocks.push(plaintext.substring(i, i + sBits));
    }
  
    let shiftRegister = CryptoJS.lib.WordArray.random(16);
    const ciphertextBlocks = [];
  
    plaintextBlocks.forEach((block, index) => {
        const blockContainer = document.createElement("div");
        blockContainer.classList.add("block-container");
        blockContainer.style.position = "relative";
        blockContainer.style.opacity = "0";
        blockContainer.style.transition = "opacity 0.5s";
        blockContainer.style.marginTop = "100px";
  
        const inputBox = document.createElement("div");
        inputBox.classList.add("box", "input-box");
        inputBox.textContent = index === 0 ? "IV" : `PREVIOUS CT`;
  
        const arrow1 = createArrow();
  
        const encryptionRow = document.createElement("div");
        encryptionRow.classList.add("encryption-wrapper");
  
        const keyBox = document.createElement("div");
        keyBox.classList.add("box", "key-box");
        keyBox.textContent = "Key";
  
        const arrowRight = createArrow("→", "arrow-horizontal");
  
        const encryptBox = document.createElement("div");
        encryptBox.classList.add("box", "encryption-box");
        encryptBox.textContent = "Encrypting...";
  
        encryptionRow.appendChild(keyBox);
        encryptionRow.appendChild(arrowRight);
        encryptionRow.appendChild(encryptBox);
  
        const arrow2 = createArrow();
  
        const sBitsWrapper = document.createElement("div");
        sBitsWrapper.classList.add("sbits-wrapper-horizontal");
        sBitsWrapper.style.display = "flex";
        sBitsWrapper.style.justifyContent = "center";
        sBitsWrapper.style.gap = "0px";
  
        const selectBox = document.createElement("div");
        selectBox.classList.add("box", "sbits-box", "small-box");
        selectBox.textContent = "Select s bits";
  
        const discardBox = document.createElement("div");
        discardBox.classList.add("box", "discard-box", "small-box");
        discardBox.textContent = "Discard (b - s)";
  
        sBitsWrapper.appendChild(selectBox);
        sBitsWrapper.appendChild(discardBox);
  
        const arrow3 = createArrow();
  
        const xorWrapper = document.createElement("div");
        xorWrapper.classList.add("xor-wrapper");
  
        const xorStack = document.createElement("div");
        xorStack.classList.add("xor-stack");
        
        xorStack.style.alignItems = "center";
        xorStack.style.gap = "10px";
  
        const perBlockPlaintextDisplay = document.createElement("div");
        perBlockPlaintextDisplay.textContent = block;
        perBlockPlaintextDisplay.classList.add("plaintext-line");
  
        const arrow4 = createArrow("→", "arrow-horizontal");
  
        const xorOp = document.createElement("div");
        xorOp.classList.add("xor");
        const xorImage = document.createElement("img");
        xorImage.src = "../assets/xor.png";
        xorImage.alt = "xor";
        xorImage.classList.add("icon");
        xorOp.appendChild(xorImage);
  
        xorStack.appendChild(perBlockPlaintextDisplay);
        xorStack.appendChild(arrow4);
        xorStack.appendChild(xorOp);
        xorWrapper.appendChild(xorStack);
  
        const arrow5 = createArrow();

        blockContainer.appendChild(inputBox);
        
        if(index>0){
        const shiftregister =  document.createElement("div");
        shiftregister.classList.add("box", "shift-register");
        shiftregister.textContent = "← Shift Register";
        blockContainer.appendChild(shiftregister);
        }
  
       
      const encryptedRegister = CryptoJS.AES.encrypt(shiftRegister, keyBytes, {
          iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000"),
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.NoPadding
      }).ciphertext;
  
      const encryptedChars = CryptoJS.enc.Hex.stringify(encryptedRegister).substring(0, sBits);
  
      let result = "";
      for (let i = 0; i < sBits; i++) {
          result += String.fromCharCode(encryptedChars.charCodeAt(i) ^ block.charCodeAt(i));
      }
  
      const hexResult = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(result));
      ciphertextBlocks.push(hexResult);
      shiftRegister = CryptoJS.enc.Utf8.parse(result.padEnd(blockSize, '\0')); 

      
  
  
        const ciphertextBox = document.createElement("div");
        ciphertextBox.classList.add("box", "ciphertext-box");
        ciphertextBox.textContent = "Processing...";
  
        blockContainer.append(
            arrow1,
            encryptionRow,
            arrow2,
            sBitsWrapper,
            arrow3,
            xorWrapper,
            arrow5,
            ciphertextBox
        );
  
        blocksContainer.appendChild(blockContainer);
  
        blockContainer.style.setProperty('--i', index);
        
        const initialdelay=4000;
        setTimeout(() => { blockContainer.style.opacity = "1"; }, initialdelay * index+0);
        setTimeout(() => { encryptBox.textContent = "Encrypted"; }, initialdelay * index+2000);
        setTimeout(() => { keyBox.classList.add("key-animation"); }, initialdelay * index+1000);
        setTimeout(() => { ciphertextBox.textContent = hexResult; }, initialdelay * index+3500);
  
    });
  
    setTimeout(() => {
        finalCiphertextDisplay.textContent = `Final Ciphertext: ${ciphertextBlocks.join(" ")}`;
    }, (plaintextBlocks.length-1), 7000);
  }
  
  function createArrow(label = "↓", className = "arrow") {
    const arrow = document.createElement("div");
    arrow.className = className;
    arrow.textContent = label;
    return arrow;
  }
