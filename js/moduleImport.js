const pdfInput = document.getElementById("pdfInput");
const fileName = document.getElementById("fileName");
const continueBtn = document.getElementById("continueBtn");

pdfInput.addEventListener("change", () => {

    if (pdfInput.files.length) {
        fileName.textContent = pdfInput.files[0].name;
    } else {
        fileName.textContent = "No file selected";
    }

});

continueBtn.addEventListener("click", async () => {

    if (!pdfInput.files.length) {
        alert("Please select a PDF first.");
        return;
    }

    const formData = new FormData();
    formData.append("pdf", pdfInput.files[0]);

    try {

        const response = await fetch(
            "http://localhost:3000/api/module-import/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.json();

        alert(result.message);

        console.log(result);

    } catch (error) {

        console.error(error);

        alert("Upload failed.");

    }

});