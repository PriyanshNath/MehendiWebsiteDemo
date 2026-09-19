const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    nav?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }
});

const filterButtons = [...document.querySelectorAll("[data-filter]")];
const galleryTiles = [...document.querySelectorAll(".gallery-tile")];

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    galleryTiles.forEach((tile) => {
      tile.classList.toggle("is-hidden", filter !== "all" && tile.dataset.category !== filter);
    });
  });
});

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxMeta = document.querySelector("[data-lightbox-meta]");
const lightboxClose = document.querySelector(".lightbox-close");

galleryTiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxMeta) return;

    lightboxImage.setAttribute("src", tile.dataset.image || "");
    lightboxImage.setAttribute("alt", tile.querySelector("img")?.getAttribute("alt") || "");
    lightboxTitle.textContent = tile.dataset.title || "";
    lightboxMeta.textContent = tile.dataset.meta || "";

    if (typeof lightbox.showModal === "function") {
      lightbox.showModal();
    }
  });
});

lightboxClose?.addEventListener("click", () => lightbox?.close());
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

const testimonials = [
  {
    text: "Aabha heard every tiny thing I wanted in the design and still made it feel balanced. The stain came out deep, and the photos were beautiful.",
    author: "Riya, Guwahati bride",
  },
  {
    text: "The guest mehendi counter moved quickly without looking rushed. Everyone had a design they actually liked.",
    author: "Mitali, sangeet host",
  },
  {
    text: "My bridal design had our initials, a lotus and the wedding date hidden inside. It felt personal without becoming crowded.",
    author: "Ankita, Assam wedding",
  },
];

const testimonialText = document.querySelector("[data-testimonial-text]");
const testimonialAuthor = document.querySelector("[data-testimonial-author]");
const testimonialCount = document.querySelector("[data-testimonial-count]");
let testimonialIndex = 0;

function renderTestimonial() {
  const current = testimonials[testimonialIndex];
  if (testimonialText) testimonialText.textContent = current.text;
  if (testimonialAuthor) testimonialAuthor.textContent = current.author;
  if (testimonialCount) testimonialCount.textContent = `${testimonialIndex + 1} / ${testimonials.length}`;
}

document.querySelector("[data-testimonial-prev]")?.addEventListener("click", () => {
  testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
  renderTestimonial();
});

document.querySelector("[data-testimonial-next]")?.addEventListener("click", () => {
  testimonialIndex = (testimonialIndex + 1) % testimonials.length;
  renderTestimonial();
});

const bookingForm = document.querySelector(".booking-form");
const packageButtons = document.querySelectorAll("[data-package]");
const serviceSelect = bookingForm?.querySelector("[name='service']");
const statusMessage = document.querySelector(".form-status");
const emailLink = document.querySelector("[data-email-link]");
const whatsappNumber = "918812896394";
const bookingEmail = "hello@aabhamehendi.com";

function getBookingMessage() {
  if (!bookingForm) return "";
  const data = new FormData(bookingForm);
  const name = data.get("name") || "";
  const phone = data.get("phone") || "";
  const date = data.get("date") || "Date not fixed yet";
  const city = data.get("city") || "Guwahati";
  const service = data.get("service") || "Service not selected";
  const notes = data.get("message") || "No extra notes yet";

  return [
    "Hi Aabha, I would like to enquire about a mehendi booking.",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Event date: ${date}`,
    `City: ${city}`,
    `Service: ${service}`,
    `Notes: ${notes}`,
  ].join("\n");
}

function updateEmailLink() {
  if (!emailLink) return;
  const subject = encodeURIComponent("Mehendi booking enquiry");
  const body = encodeURIComponent(getBookingMessage());
  emailLink.setAttribute("href", `mailto:${bookingEmail}?subject=${subject}&body=${body}`);
}

bookingForm?.addEventListener("input", updateEmailLink);
bookingForm?.addEventListener("change", updateEmailLink);

packageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (serviceSelect && button.dataset.package) {
      serviceSelect.value = button.dataset.package;
      updateEmailLink();
    }

    document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => bookingForm?.querySelector("[name='name']")?.focus(), 450);
  });
});

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    if (statusMessage) statusMessage.textContent = "Please add your name, phone and service before sending.";
    return;
  }

  const message = encodeURIComponent(getBookingMessage());
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;
  window.open(url, "_blank", "noopener,noreferrer");
  if (statusMessage) statusMessage.textContent = "Opening WhatsApp with your enquiry ready to send.";
});

updateEmailLink();
