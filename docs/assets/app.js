const data = window.CV_DATA;

const labels = {
  published: "Journal Articles",
  under_review: "Under Review",
  in_preparation: "In Preparation",
  book_chapters: "Book Chapter",
  conference_proceedings: "Conference Proceedings",
  invited_talks: "Invited Talks",
};

function $(selector) {
  return document.querySelector(selector);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value || "";
}

function renderList(target, items, renderer) {
  const element = $(target);
  if (!element) return;
  element.innerHTML = items.map(renderer).join("");
}

function timelineItem(item) {
  return `
    <div class="timeline-item">
      <span class="date">${escapeHtml(item.date || "")}</span>
      <p class="item-text">${escapeHtml(item.text || item.title || item.degree || "")}</p>
    </div>
  `;
}

function grantItem(item) {
  const funding = item.funding_source ? `<p class="item-text">${escapeHtml(item.funding_source)}</p>` : "";
  const role = item.role ? `<p class="item-text">${escapeHtml(item.role)}</p>` : "";
  return `
    <div class="grant-item">
      <span class="date">${escapeHtml(item.date || "")}</span>
      <p class="item-title">${escapeHtml(item.title || "")}</p>
      ${funding}
      ${role}
    </div>
  `;
}

function publicationItem(item) {
  const doi = item.doi ? `<a href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer">DOI: ${escapeHtml(item.doi)}</a>` : "";
  const corresponding = item.corresponding_author ? `<span class="corresponding">Corresponding author</span>` : "";
  return `
    <article class="publication-item">
      <div>
        <span class="date">${escapeHtml(item.year || "")}</span>
      </div>
      <div>
        <p class="item-text">${escapeHtml(item.text || "")}${corresponding}</p>
        ${doi}
      </div>
    </article>
  `;
}

function renderPublications(kind = "published") {
  const items = data.publications[kind] || [];
  renderList("#publication-list", items, publicationItem);
}

function bindPublicationFilters() {
  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderPublications(button.dataset.filter);
    });
  });
}

function countPublications() {
  return Object.values(data.publications).reduce((total, items) => total + items.length, 0);
}

function countService() {
  return Object.values(data.service).reduce((total, items) => total + items.length, 0);
}

function init() {
  setText("#profile-name", data.profile.name);
  setText("#profile-affiliation", data.profile.affiliation);
  setText("#profile-address", data.profile.address);
  setText("#profile-contact", data.profile.contact);
  setText("#profile-interests", data.profile.interests);
  setText("#source-file", data.source.cv_file);
  setText("#generated-at", `Last regenerated ${new Date(data.source.generated_at).toLocaleString()}`);

  const email = $("#profile-email");
  if (email) {
    email.textContent = data.profile.email;
    email.href = `mailto:${data.profile.email}`;
  }

  setText("#metric-publications", countPublications());
  setText("#metric-grants", data.grants.extramural.length + data.grants.intramural.length);
  setText("#metric-teaching", data.teaching.length);
  setText("#metric-service", countService());

  renderList("#appointments", data.appointments, (item) => `
    <div class="list-item"><p class="item-text">${escapeHtml(item.title)}</p></div>
  `);
  renderList("#education", data.education, (item) => `
    <div class="list-item"><p class="item-text">${escapeHtml(item.degree)}</p></div>
  `);
  renderList("#research-experience", data.research_experience, (item) => `
    <div class="timeline-item">
      <span class="date">${escapeHtml(item.date)}</span>
      <p class="item-text">${escapeHtml(item.text)}</p>
    </div>
  `);
  renderList("#extramural-grants", data.grants.extramural, grantItem);
  renderList("#intramural-grants", data.grants.intramural, grantItem);
  renderList("#institutional-affiliations", data.affiliations.institutional, (item) => `
    <div class="list-item"><p class="item-text">${escapeHtml(item.title)}</p></div>
  `);
  renderList("#scholarly-affiliations", data.affiliations.scholarly_communities, timelineItem);
  renderList("#teaching-list", data.teaching, (item) => `
    <div class="timeline-item">
      <span class="date">${escapeHtml(item.date)}</span>
      <p class="item-title">${escapeHtml(item.institution || "")}</p>
      <p class="item-text">${escapeHtml(item.text)}</p>
    </div>
  `);
  renderList("#advising-list", data.advising, (item) => `
    <div class="timeline-item">
      <span class="date">${escapeHtml(item.date)}</span>
      <p class="item-text">${escapeHtml(item.text)}</p>
    </div>
  `);
  renderList("#editorial-service", data.service.editorial, timelineItem);
  renderList("#conference-service", data.service.conference_reviewing, timelineItem);
  renderList("#professional-service", data.service.professional, timelineItem);
  renderList("#community-service", data.service.community, timelineItem);
  renderList("#honors-list", data.honors, timelineItem);
  renderList("#skills-list", data.skills, (item) => `<li>${escapeHtml(item)}</li>`);
  setText("#language-line", data.language ? `Languages: ${data.language}` : "");
  setText("#certification-line", data.certification ? `Certification: ${data.certification}` : "");

  renderPublications("published");
  bindPublicationFilters();
}

if (data) {
  init();
}
