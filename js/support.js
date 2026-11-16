
// ========================================
// PRODEMIC SUPPORT FORM
// ========================================

const feedbackForm = document.getElementById("feedbackForm");
const feedbackMessage = document.getElementById("feedbackMessage");
const characterCount = document.getElementById("characterCount");
const formStatus = document.getElementById("formStatus");

const submitButton = feedbackForm.querySelector(
    ".submit-feedback-btn"
);


// ========================================
// CHARACTER COUNTER
// ========================================

feedbackMessage.addEventListener("input", function () {

    characterCount.textContent = feedbackMessage.value.length;

});


// ========================================
// FORM SUBMISSION
// ========================================

feedbackForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    // Disable button while submitting
    submitButton.disabled = true;

    submitButton.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        Sending...
    `;

    formStatus.textContent = "";
    formStatus.style.color = "#64748b";

    try {

        const response = await fetch(
            "https://formspree.io/f/xnpdjbnj",
            {
                method: "POST",

                body: new FormData(feedbackForm),

                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (response.ok) {

            // Success message
            formStatus.textContent =
                "Thank you! Your feedback has been sent successfully.";

            formStatus.style.color = "#16a34a";

            // Clear form
            feedbackForm.reset();

            // Reset character counter
            characterCount.textContent = "0";

        } else {

            const result = await response.json();

            formStatus.textContent =
                result.errors?.map(error => error.message).join(", ") ||
                "Something went wrong. Please try again.";

            formStatus.style.color = "#dc2626";

        }

    } catch (error) {

        formStatus.textContent =
            "Unable to send your feedback. Please check your internet connection.";

        formStatus.style.color = "#dc2626";

    }

    // Re-enable button
    submitButton.disabled = false;

    submitButton.innerHTML = `
        <i class="fas fa-paper-plane"></i>
        Submit Feedback
    `;

});
