# NoxVoid Software — Official Website & Markdown Blog

Official website for **NoxVoid Software** (`noxvoid.github.io`), featuring all 5 products, dynamic Markdown-powered blog, automated sitemap/robots generation, and GitHub Actions CI/CD deployment.

---

## ✍️ How to write a new blog post in Markdown

1. Add a new `.md` file in `content/blog/`, for example `my-new-post.md`:
   ```markdown
   ---
   title: "Your Post Title"
   description: "Short summary of the post for SEO and preview cards."
   date: "2026-11-20"
   category: "Engineering"
   readTime: "4 min read"
   slug: "my-new-post"
   ---

   Your article content in standard Markdown...
   ```
2. Commit and push:
   ```bash
   git add .
   git commit -m "feat: new article"
   git push
   ```
3. **GitHub Actions automatically:**
   - Converts Markdown to responsive HTML with OpenGraph and Schema.org JSON-LD.
   - Updates `blog.html` with the new article card.
   - Updates `sitemap.xml` with the new URL, date, and priority.
   - Updates `robots.txt`.
   - Deploys the site live to GitHub Pages in ~30 seconds!

---

## 🛠 Local Development & Testing

```bash
# Install dependencies
npm install

# Build Markdown articles, blog index, sitemap.xml & robots.txt
npm run build

# Preview locally
python3 -m http.server 8085
```
Open [http://localhost:8085](http://localhost:8085) to view changes.

---

## 🚀 Initial GitHub Setup

1. Create a public repository on GitHub: `https://github.com/NoxVoidSoftware/NoxVoidSoftware.github.io` (or `noxvoid.github.io`).
2. Go to **Settings** &rarr; **Pages** &rarr; **Build and deployment**.
3. Under **Source**, select **GitHub Actions** (the official modern GitHub Pages workflow).
4. Push your code:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit with markdown blog and github actions"
   git branch -M main
   git remote add origin https://github.com/NoxVoidSoftware/NoxVoidSoftware.github.io.git
   git push -u origin main
   ```
5. GitHub Actions will build and deploy your site automatically!
