# CineNest

[Visit CineNest](https://cinenest.onrender.com)

**CineNest** is a personalized streaming platform that offers users a lightweight, user-friendly environment to watch movies and series. Inspired by the concept of mainstream streaming services like Netflix and Prime, CineNest was built as an accessible alternative where entertainment comes without cost—perfect for learning, experimentation, and innovation.

---

## Why CineNest?

While major platforms like Netflix and Prime have extensive content libraries and infrastructure, CineNest focuses on simplicity and accessibility. Here’s why CineNest stands out:

- **Cost-Free Entertainment:**  
  CineNest is built with free-tier hosting and database services, demonstrating that you can create a compelling streaming experience without large budgets.

- **Learning and Innovation:**  
  The project serves as a practical showcase of full-stack development, integrating front-end design with a secure backend using PHP and MySQL.

- **Customization & Flexibility:**  
  CineNest is designed to be a platform you can build upon. Future enhancements (such as a fully functioning movie player and user accounts) can be implemented as you grow your skills and platform capabilities.

---

## Features & Major Changes

- **Front-End Interface:**  
  - Built using **HTML5** and **CSS3** to provide a modern, responsive design.
  - Utilizes **JavaScript** for dynamic interactions, including animations and improved user experiences.
  - Incorporates animated poster sections for a visually engaging interface.

- **Backend Integration:**  
  - **PHP** is used in `log.php` and `register.php` to handle user authentication and registration.
  - The site connects to a **MySQL** database (hosted via InfinityFree's free MySQL service) managed through phpMyAdmin on cinenest.great-site.net.
  - Secure practices include password hashing and prepared statements to protect against SQL injection.

- **Progressive Web App (PWA) Readiness:**  
  - Recent improvements include adding a **manifest.json** and **service-worker.js** to allow the site to be installed as a PWA.
  - This enables offline caching and an app-like experience for users.

- **Media & Content:**  
  - Although the movie player is still a work in progress, the platform demonstrates the integration of APIs (such as The Movie Database API) to fetch ratings and posters.

---

## Technologies and Skills Learned

1. **HTML5:**  
   - Structured the web pages using semantic tags (e.g., `<header>`, `<form>`, `<div>`, `<img>`).
   - Ensured accessibility and SEO best practices with proper tag usage.

2. **CSS3:**  
   - Created a modern design using external stylesheets (`styles.css`), Flexbox, and CSS animations (keyframes for scrolling poster images).
   - Maintained a consistent dark theme with accent colors for a cinematic look.

3. **JavaScript:**  
   - Added interactivity for dynamic video playback and UI components.
   - Managed DOM manipulation for form validation and event handling in `j.js` and `player.js`.

4. **PHP & MySQL:**  
   - Built backend functionality for user authentication in `log.php` and registration in `register.php`.
   - Implemented secure database interactions using prepared statements and password hashing.
   - Utilized InfinityFree’s free hosting and MySQL service (with phpMyAdmin) for deployment.

5. **Git and GitHub:**  
   - Managed code versioning and collaborated via Git.
   - Deployed the site using Render’s free tier (and redirected domain via cinenest.great-site.net).

6. **PWA Enhancements:**  (still in improvement)
   - Added manifest and service worker files to enhance user experience and provide offline support.

---

## Project Structure

```
CineNest/
├── index.html         # Landing page
├── log.php            # Login functionality
├── register.php       # User registration functionality
├── h.html             # Homepage for logged in users
├── player.html        # Media player page
├── j.js               # General JavaScript functions
├── player.js          # Media player-specific scripts
├── styles.css         # Global CSS styles
└── image/             # Directory for images and icons
```

---

## Setup & Deployment

1. **Development:**  
   - Build the front-end with HTML, CSS, and JavaScript.
   - Develop backend features using PHP and manage the database via MySQL.
  
2. **Deployment:**  
   - Host your static pages on Render (free tier) and connect your database through InfinityFree’s phpMyAdmin.
   - Configure domain redirection from cinenest.onrender.com to cinenest.great-site.net for better accessibility.

3. **PWA Conversion:**  (doesn't work still in improvement)
   - Add a `manifest.json` and register a service worker (`service-worker.js`) to allow users to install CineNest as an app and work offline.

---

## Future Goals

- **Enhanced Media Playback:**  
  - Improve the movie player functionality to support seamless streaming.
  
- **User Accounts & Personalization:**  
  - Enable multi-device support, user profiles, and saved watchlists.
  
- **Advanced Design Elements:**  
  - Integrate more animations and refined UI elements to boost the overall user experience.
  
- **Backend Expansion:**  
  - Build out a more robust backend to support additional features like content recommendations, comments, and reviews.

---

## Credits

- **APIs & Images:**  
  - Posters and ratings are fetched using [The Movie Database API](https://www.themoviedb.org/).
  - Special thanks to streaming platforms like [Streamtape](https://streamtape.com/) for inspiration.
  
- **Hosting & Tools:**  
  - Deployed on [Render](https://render.com/) and managed the database using InfinityFree’s phpMyAdmin.
  - Additional assets and AJAX libraries were sourced from [cdnjs](https://cdnjs.cloudflare.com/).

- **Learning Resources:**  
  - Tutorials, online courses, and tools (including ChatGPT) helped guide the project’s development.

---

## Feedback & Contributions

If you have suggestions or feedback, please create an issue or submit a pull request in the [GitHub repository](#).

---

## Conclusion

CineNest is not meant to directly compete with giants like Netflix or Prime. Instead, it’s a passion project and a learning platform—demonstrating how to build a full-stack streaming service with a focus on simplicity, cost-effectiveness, and user satisfaction. I truly enjoyed the journey of building CineNest and look forward to expanding its capabilities in the future. 😊

THANK YOU
