# Serverless URL Shortener Template

[![Built with Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC)](https://tailwindcss.com/)
[![GitHub Issues](https://img.shields.io/badge/Storage-GitHub%20Issues-181717)](https://github.com/features/issues)

A professional, lightweight **URL Shortener Template** that demonstrates the power of serverless architecture by using **GitHub Issues as a NoSQL database**.

This project is designed as a **template** to showcase how to build functional, persistent web applications on static hosting platforms (like GitHub Pages) without needing a traditional backend or database server.

---

## 🚀 Key Features

*   **Serverless Storage**: Revolutionary approach using GitHub Repository Issues to store URL mappings.
*   **Zero-Cost Hosting**: Fully compatible with static hosting providers like GitHub Pages.
*   **Secure Client-Side Logic**: Direct interaction with GitHub API from the browser using Personal Access Tokens (PAT).
*   **Base62 Encoding**: Efficiently converts Issue IDs into concise, 6-character short codes.
*   **Smart Redirection**: Implements a "Smart 404" strategy to handle dynamic routing on static servers.
*   **Premium UI**: Built with modern Tailwind CSS v4, supporting Dark Mode and Glassmorphism aesthetics.

## 🏗️ Technical Architecture

### "GitHub Issues as a Database"
Instead of connecting to MySQL, PostgreSQL, or MongoDB, this application treats a GitHub Repository as a database:
1.  **Writes**: Creating a short link creates a new **Issue** in the target repository. The *Issue Body* stores the long URL.
2.  **Reads**: The *Issue Number* serves as the unique ID. We convert this ID to a Base62 string (e.g., Issue #100 -> `1C`) to generate the short code.
3.  **Lookup**: When a user visits a short link, the app decodes the string back to the Issue Number, fetches the Issue via GitHub API, and redirects to the URL found in the body.

### Static Hosting Compatibility
Since GitHub Pages handles static files, we cannot use dynamic server routes (like `/api/[code]`). instead, we rely on a **client-side 404 fallback**:
*   Requests to `/short_url/1C` return `404.html`.
*   Our custom `404` page parses the URL, detects the code `1C`, fetches the data, and performs the redirect.

## 🛠️ Usage

### Prerequisites
*   A GitHub Account.
*   A target repository (can be private or public) to create issues in.
*   A **GitHub Personal Access Token** with `repo` scope.

### Installation

```bash
# Clone the repository
git clone https://github.com/johnson1205/short_url.git

# Install dependencies
npm install

# Run development server
npm run dev
```

### Deployment (GitHub Pages)

This template includes a pre-configured workflow for `gh-pages`.

1.  **Update Config**: Ensure `next.config.js` has the correct `basePath` if deploying to a project page.
2.  **Deploy**:
    ```bash
    npm run deploy
    ```
3.  **Activate**: Go to your Repo Settings -> Pages -> Source -> Select `gh-pages` branch.

## 📝 Configuration

To personalize this template, update the following constants in `lib/github.ts`:

```typescript
const OWNER = "your-username";
const REPO = "your-storage-repo";
```

## 📄 License

This project is open-source and available under the MIT License.
