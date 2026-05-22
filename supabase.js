const SUPABASE_URL = "https://rfzsampwrppvqacctrco.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_d30709notWexlfK0ENZVNg_6T6VNmpc";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/* -----------------------------
   GET LOCATION FROM FORM
------------------------------*/
function getLocation(form) {
  return form.dataset.location;
}

/* -----------------------------
   LOAD REVIEWS
------------------------------*/
async function loadReviews(location, container) {
  if (!container) return;

  const { data, error } = await supabaseClient
    .from("reviews")
    .select("*")
    .eq("location", location)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Load error:", error);
    container.innerHTML = "<p>Unable to load reviews at this time.</p>";
    return;
  }

  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML = "<p>No reviews yet.</p>";
    return;
  }

  container.innerHTML = data.map(r => {
    const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);

    return `
      <div class="review">
        <blockquote>« ${r.text} »</blockquote>
        <p>— ${r.name} ${stars}</p>
      </div>
    `;
  }).join("");
}

/* -----------------------------
   INIT FORM HANDLING
------------------------------*/
function initReviews() {
  document.querySelectorAll(".review-form").forEach(form => {

    if (form.dataset.bound) return;
    form.dataset.bound = "true";

    const location = getLocation(form);
    const container = form.parentElement.querySelector(".reviews-container");

    if (!container) return;

    // initial load
    loadReviews(location, container);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = form.querySelector(".reviewer-name").value.trim();
      const text = form.querySelector(".review-text").value.trim();
      const rating =
        Number(form.querySelector("input[type='radio']:checked")?.value || 0);

      // validation (fixes blank reviews)
      if (!name || !text || !rating) return;

      const { error } = await supabaseClient
        .from("reviews")
        .insert([
          {
            name,
            text,
            rating,
            location
          }
        ]);

      if (error) {
        console.error("Insert error:", error);
        return;
      }

      form.reset();
      loadReviews(location, container);
    });
  });
}

document.addEventListener("DOMContentLoaded", initReviews);