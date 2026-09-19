/* =============================================================
   BLOG — static post data for the "Our Blogs" section.
   ============================================================= */

const BLOG_POSTS = [
  {
    id: "b01",
    date: "20.04.2026",
    readTime: "5 min read",
    title: "The Evolving Landscape of Furniture Design: Latest Trends and Innovations",
    excerpt: "Furniture design has come a long way in recent years, with new trends and innovations constantly emerging to push the boundaries of what's possible.",
    tags: ["Living", "Furniture Design", "Smart Home"],
    image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=700&auto=format&fit=crop"
  },
  {
    id: "b02",
    date: "14.03.2026",
    readTime: "4 min read",
    title: "Upgrade Your Home or Office with the Latest in Sleek and Stylish Designs",
    excerpt: "One of the key features of modern furniture is its versatility. Today's furniture is designed to serve multiple purposes, whether it's a sofa bed.",
    tags: ["Innovative", "Comfort", "Multi-Purpose"],
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=700&auto=format&fit=crop"
  },
  {
    id: "b03",
    date: "02.02.2026",
    readTime: "6 min read",
    title: "Functionality Meets Style: The Perfect Combination for Today's Homes and Offices",
    excerpt: "Modern furniture is a reflection of our evolving tastes and needs, combining both form and function to create pieces that are both aesthetically pleasing.",
    tags: ["Convenient", "Sleek Design", "Modern"],
    image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=700&auto=format&fit=crop"
  }
];

// Maps a blog tag to a real product category where one exists, so the
// tag becomes a working link into the catalog rather than static text.
function tagToCategoryId(tag) {
  const match = CATEGORIES.find(
    (c) => c.label.toLowerCase() === tag.toLowerCase() || c.id === tag.toLowerCase().replace(/\s+/g, "-")
  );
  return match ? match.id : null;
}

function blogCardHTML(post) {
  return `
    <article class="blog-card">
      <a class="blog-card__media" href="#shop" data-blog-link="${post.id}">
        <img src="${post.image}" alt="${post.title}" loading="lazy">
      </a>
      <div class="blog-card__body">
        <p class="blog-card__meta">${post.date} &nbsp;|&nbsp; ${post.readTime}</p>
        <h3 class="blog-card__title">
          <a href="#shop" data-blog-link="${post.id}">${post.title}</a>
        </h3>
        <p class="blog-card__excerpt">${post.excerpt}</p>
        <div class="blog-card__tags">
          ${post.tags.map((t) => {
            const catId = tagToCategoryId(t);
            return catId
              ? `<button class="blog-tag" data-type="category" data-value="${catId}">${t}</button>`
              : `<button class="blog-tag" data-type="query" data-value="${t}">${t}</button>`;
          }).join("")}
        </div>
      </div>
    </article>
  `;
}

function renderBlog() {
  const blogGrid = document.getElementById("blogGrid");
  if (!blogGrid) return;
  blogGrid.innerHTML = BLOG_POSTS.map(blogCardHTML).join("");
}
