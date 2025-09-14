// netlify/functions/work.js
import fs from "fs";
import path from "path";

export async function handler(event) {
  const { id } = event.path.match(/\/works\/(?<id>\d+)/)?.groups || {};
  if (!id) {
    return { statusCode: 404, body: "Not found" };
  }

  // Load works.json from your repo
  const jsonPath = path.join(process.cwd(), "works.json");
  const works = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const work = works.find(w => String(w.id) === id);

  if (!work) {
    return { statusCode: 404, body: "Work not found" };
  }

  // Construct meta tags
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${work.title} | Elisha Excel Obadahun</title>
  <meta name="description" content="${work.description}" />
  <meta property="og:title" content="${work.title} | Elisha Excel Obadahun" />
  <meta property="og:description" content="${work.description}" />
  <meta property="og:image" content="${work.thumbnail}" />
  <meta property="og:url" content="https://elishaobadahun.netlify.app/works/${id}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${work.title} | Elisha Excel Obadahun" />
  <meta name="twitter:description" content="${work.description}" />
  <meta name="twitter:image" content="${work.thumbnail}" />
</head>
<body>
  <!-- Fallback message for scrapers -->
  <p>Redirecting to project…</p>
  <script>
    window.location.href = "/details.html?id=${id}";
  </script>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: html
  };
}
