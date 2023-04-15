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
});
