const form = document.getElementById("contact-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameEl = document.getElementById("contact-name");
    const emailEl = document.getElementById("contact-email");
    const messageEl = document.getElementById("contact-message");
    const submitBtn = form.querySelector('button[type="submit"]');

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = messageEl.value.trim();

    // Validation
    if (!name || !email || !message) {
      alert("All fields are required.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Disable submit button to prevent double submission
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    try {
      const res = await fetch("https://rfzsampwrppvqacctrco.supabase.co/functions/v1/contact-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, message })
      });

      if (res.ok) {
        alert("Message sent successfully! We'll get back to you soon.");
        form.reset();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || "Error sending message. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      // Re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Envoyer";
      }
    }
  });
}