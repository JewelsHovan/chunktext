
document.getElementById("chunk-text").addEventListener("click", () => {
  const inputText = document.getElementById("input-text").value;
  const chunkSize = 12000;
  const contextWords = 10; // Adjust this value to change the number of words included from the previous chunk
  const chunks = [];

  for (let i = 0; i < inputText.length; i += chunkSize) {
    let chunk = inputText.slice(i, i + chunkSize);
    if (i > 0) {
      const previousChunk = chunks[chunks.length - 1];
      const lastWords = previousChunk.split(" ").slice(-contextWords).join(" ");
      chunk = lastWords + " " + chunk;
    }
    chunks.push(chunk);
  }

  const output = document.getElementById("output");
  output.innerHTML = "";

  for (const [index, chunk] of chunks.entries()) {
    const chunkElement = document.createElement("div");
    chunkElement.innerHTML = `
      <h2>Chunk ${index + 1}</h2>
      <textarea readonly rows="10" cols="50">${chunk}</textarea>
      <button class="copy-chunk">Copy Chunk</button>
    `;
    output.appendChild(chunkElement);

    chunkElement.querySelector(".copy-chunk").addEventListener("click", () => {
      const textarea = chunkElement.querySelector("textarea");
      textarea.select();
      document.execCommand("copy");
    });
  }


  // Create download link for the text file
  const downloadButton = document.createElement("button");
  downloadButton.textContent = "Download Text File";
  downloadButton.classList.add("btn", "btn-primary");
  output.appendChild(downloadButton);

  downloadButton.addEventListener("click", function() {
    const chunksText = chunks.join("\n\n---\n\n"); // Separate chunks with a divider
    const blob = new Blob([chunksText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "chunks.txt";
    link.click();
    URL.revokeObjectURL(url);
  });
});

// Paraphrase a text chunk
document.getElementById("paraphrase-text").addEventListener("click", async () => {
  const chunks = getChunksFromOutput();
  const paraphrasedChunks = [];

  for (const chunk of chunks) {
    const paraphrasedChunk = await paraphraseText(chunk);
    paraphrasedChunks.push(paraphrasedChunk);
  }

  // Update the output with paraphrased chunks
  displayChunks(paraphrasedChunks);
});

async function paraphraseText(text) {
  const apiKey = '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';
  const apiUrl = 'https://api.openai.com/v1/engines/chatgpt-3.5-turbo/completions';

  try {
    const response = await axios.post(
      apiUrl,
      {
        messages: [
          { role: "system", content: "You are a helpful assistant that paraphrases text." },
          { role: "user", content: `Please paraphrase the following text: "${text}"` },
        ],
        max_tokens: 2000,
        n: 1,
        stop: null,
        temperature: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error while paraphrasing:', error);
    return text; // Return the original text in case of an error
  }
}


function getChunksFromOutput() {
  const chunkTextareas = document.querySelectorAll("#output textarea");
  const chunks = Array.from(chunkTextareas).map(textarea => textarea.value);
  return chunks;
}

function displayChunks(chunks) {
  const output = document.getElementById("output");
  output.innerHTML = "";

  chunks.forEach((chunk, index) => {
    const chunkElement = document.createElement("div");
    chunkElement.innerHTML = `
      <h2>Chunk ${index + 1}</h2>
      <textarea readonly rows="10" cols="50">${chunk}</textarea>
      <button class="copy-chunk">Copy Chunk</button>
    `;
    output.appendChild(chunkElement);

    chunkElement.querySelector(".copy-chunk").addEventListener("click", () => {
      const textarea = chunkElement.querySelector("textarea");
      textarea.select();
      document.execCommand("copy");
    });
  });
}