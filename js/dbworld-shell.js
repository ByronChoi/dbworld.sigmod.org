(() => {
  "strict";

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "css/dbworld-sigmod.css";
  document.head.appendChild(link);

  const font = document.createElement("link");
  font.rel = "stylesheet";
  font.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap";
  document.head.appendChild(font);

  document.documentElement.lang = "en";
  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("dbworld-shell");

    const legacyHeading = document.body.querySelector("h1, h2");
    let title = legacyHeading ? legacyHeading.textContent.trim().replace(/\s+/g, " ") : document.title;
    if (legacyHeading) legacyHeading.remove();

    const file = location.pathname.split("/").pop() || "index.html";
    const current = file.replace(/\.html$/, "");
    const postActive = file === "post.html" || file.startsWith("post-");

    const skip = document.createElement("a");
    skip.className = "dbworld-skip";
    skip.href = "#main";
    skip.textContent = "Skip to content";

    const header = document.createElement("header");
    header.className = "dbworld-hdr";
    header.innerHTML = `
      <div class="dbworld-wrap dbworld-hdr-in">
        <a class="dbworld-logo" href="https://www.sigmod.org/" aria-label="ACM SIGMOD home">
          <picture><source media="(max-width: 374px)" srcset="https://www.sigmod.org/favicon.svg">
          <img class="dbworld-brand" src="https://www.sigmod.org/assets/logo/sigmod-current.png" alt="ACM SIGMOD" width="200" height="64"></picture>
          <span class="dbworld-logo-tag">Special Interest Group<br>on Management of Data</span>
        </a>
        <nav aria-label="DBWorld">
          <ul class="dbworld-mnav">
            <li><a${file === "index.html" ? ' class="active" aria-current="page"' : ""} href="index.html">Home</a></li>
            <li><a href="browse.html">Browse</a></li>
            <li><a href="register.html">Register</a></li>
            <li><a${postActive ? ' class="active" aria-current="page"' : ""} href="post-dbworld.html">Post</a></li>
            <li><a${file === "faq.html" ? ' class="active" aria-current="page"' : ""} href="faq.html">FAQs</a></li>
          </ul>
        </nav>
      </div>`;

    const pageHead = document.createElement("div");
    pageHead.className = "dbworld-page-head";
    pageHead.innerHTML = `
      <div class="dbworld-wrap">
        <p class="dbworld-crumbs"><a href="https://www.sigmod.org/">SIGMOD</a><span>/</span><a href="index.html">DBWorld</a></p>
        <h1>${title.replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]))}</h1>
      </div>`;

    const nodes = Array.from(document.body.childNodes);
    const main = document.createElement("main");
    main.id = "main";
    main.className = "dbworld-wrap dbworld-page-grid";
    const article = document.createElement("article");
    article.className = "dbworld-prose";

    nodes.forEach(node => article.appendChild(node));

    const side = document.createElement("aside");
    side.className = "dbworld-side";
    side.setAttribute("aria-label", "DBWorld navigation");
    side.innerHTML = `
      <a class="dbworld-side-title" href="index.html">DBWorld</a>
      <nav class="dbworld-side-nav">
        <ul>
          <li><a${file === "index.html" ? ' class="active" aria-current="page"' : ""} href="index.html">Home</a></li>
          <li><a href="browse.html">Browse messages</a></li>
          <li><a href="register.html">Register</a></li>
          <li><a${postActive ? ' class="active" aria-current="page"' : ""} href="post-dbworld.html">Post a message</a></li>
          <li><a href="change-password.html">Change password</a></li>
          <li><a href="password-remind.html">Password reminder</a></li>
          <li><a${file === "faq.html" ? ' class="active" aria-current="page"' : ""} href="faq.html">FAQs</a></li>
        </ul>
      </nav>
      <p class="dbworld-side-contact"><strong>ACM SIGMOD resource</strong><a href="https://www.acm.org/sigmod/">Visit SIGMOD</a></p>`;

    main.append(article, side);

    const footer = document.createElement("footer");
    footer.className = "dbworld-xfoot";
    footer.innerHTML = `
      <div class="dbworld-wrap">
        <div class="dbworld-xfoot-in">
          <div><h2>About DBWorld</h2><p>DBWorld is a service for announcements and news of interest to the database research community.</p></div>
          <div><h2>DBWorld</h2><ul><li><a href="browse.html">Browse</a></li><li><a href="register.html">Register</a></li><li><a href="post-dbworld.html">Post</a></li><li><a href="faq.html">FAQs</a></li></ul></div>
          <div><h2>SIGMOD</h2><ul><li><a href="https://www.sigmod.org/">SIGMOD home</a></li><li><a href="https://www.sigmod.org/conferences/">Conferences</a></li><li><a href="https://www.sigmod.org/publications/">Publications</a></li></ul></div>
        </div>
        <div class="dbworld-xfoot-bottom"><span>&copy; ACM SIGMOD. DBWorld.</span><a href="mailto:dbworldmoderator@gmail.com">Contact moderators</a></div>
      </div>`;

    document.body.replaceChildren(skip, header, pageHead, main, footer);
  });
})();
