import html2pdf from "html2pdf.js";

export const exportToPdf = (questions: any[], fileName: string) => {
  if (!questions || questions.length === 0) {
    console.error("No questions provided for export!");
    return;
  }

  const container = document.createElement("div");
  container.style.padding = "20px";
  container.style.fontFamily = "Arial, sans-serif";

  // Title
  const title = document.createElement("h1");
  title.innerText = "Study Questions";
  title.style.textAlign = "center";
  title.style.color = "#500080";
  container.appendChild(title);

  if (fileName) {
    const fileInfo = document.createElement("p");
    fileInfo.innerText = fileName;
    fileInfo.style.textAlign = "center";
    fileInfo.style.color = "#999";
    fileInfo.style.marginTop = "-10px";
    container.appendChild(fileInfo);
  }

  questions.forEach((q: any, index: number) => {
    const questionDiv = document.createElement("div");
    questionDiv.style.marginTop = "20px";

    const questionText = document.createElement("p");
    questionText.innerHTML = `<strong>${index + 1}. ${q.text}</strong>`;
    questionDiv.appendChild(questionText);

    if (q.answer) {
      const answerText = document.createElement("p");
      answerText.innerHTML = `<span style="color: #0066cc;">Answer:</span> ${q.answer}`;
      questionDiv.appendChild(answerText);
    }

    if (q.explanation) {
      const explanationText = document.createElement("p");
      explanationText.innerHTML = `<span style="color: #888;">Explanation:</span> ${q.explanation}`;
      questionDiv.appendChild(explanationText);
    }

    container.appendChild(questionDiv);
  });

  html2pdf()
    .from(container)
    .set({
      margin: 10,
      filename:
        (fileName ? fileName.replace(/\.[^/.]+$/, "") : "questions") + ".pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .save();
};
