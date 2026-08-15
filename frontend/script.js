// =========================================
// MOBILE NAVIGATION
// =========================================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("open");

    const icon = menuBtn.querySelector("i");

    if (navLinks.classList.contains("open")) {

        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
});


// Close menu after clicking a navigation link

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("open");

        const icon = menuBtn.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    });

});


// =========================================
// ACTIVE NAVIGATION
// =========================================

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 180;

        if (window.scrollY >= sectionTop) {

            currentSection = section.getAttribute("id");

        }

    });

    navItems.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            "#" + currentSection
        ) {

            link.classList.add("active");
        }

    });

});


// =========================================
// SCROLL TO TOP
// =========================================

const scrollTop = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        scrollTop.classList.add("show");

    } else {

        scrollTop.classList.remove("show");

    }

});

scrollTop.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// =========================================
// CONTACT FORM
// =========================================

const contactForm =
    document.getElementById("contactForm");

const formStatus =
    document.getElementById("formStatus");

contactForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        formStatus.textContent = "Please fill in all fields.";
        formStatus.style.color = "#ef4444";
        return;
    }

    formStatus.textContent = "Sending message...";
    formStatus.style.color = "var(--blue)";

    try {
        const response = await fetch("https://portfolio-backend-xrxg.onrender.com/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, message })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            formStatus.textContent = data.message || "Thank you! Your message has been sent successfully.";
            formStatus.style.color = "var(--blue)";
            contactForm.reset();
        } else {
            formStatus.textContent = data.message || "Failed to send message. Please try again.";
            formStatus.style.color = "#ef4444";
        }
    } catch (error) {
        console.error("Error submitting contact form:", error);
        formStatus.textContent = "Failed to connect to server. Please try again later.";
        formStatus.style.color = "#ef4444";
    }

});


// =========================================
// DARK MODE
// =========================================

const themeToggle =
    document.getElementById("themeToggle");

if (themeToggle) {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        const icon = themeToggle.querySelector("i");
        if (icon) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        }
    }

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        const isDark = document.body.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");

        const icon =
            themeToggle.querySelector("i");

        if (isDark) {

            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");

        } else {

            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");

        }

    });
}
fetch("https://portfolio-backend-xrxg.onrender.com/api")
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    })
    .catch(error => {
        console.error("Backend connection error:", error);
    });
// =========================================
// =========================================
// LOAD PROJECTS FROM BACKEND
// =========================================

const projectsGrid = document.querySelector(".projects-grid");

fetch("https://portfolio-backend-xrxg.onrender.com/api/projects")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(projects => {

        if (Array.isArray(projects) && projects.length > 0) {
            projectsGrid.innerHTML = "";

            projects.forEach((project, index) => {

                const projectCard = document.createElement("article");

                projectCard.className = "project";

                const iconClass = index === 0 ? "fa-solid fa-shield-halved" : "fa-solid fa-laptop-code";
                const labelText = index === 0 ? "01 / AI PROJECT" : index === 1 ? "02 / WEB PROJECT" : `${String(index + 1).padStart(2, "0")} / PROJECT`;
                const tagsHtml = (project.technology || "")
                    .split(",")
                    .map(tag => `<span>${tag.trim()}</span>`)
                    .join("");

                projectCard.innerHTML = `
                    <div class="project-top">

                        <div class="project-icon">
                            <i class="${iconClass}"></i>
                        </div>

                        <a href="#" class="project-link" aria-label="GitHub repository">
                            <i class="fa-brands fa-github"></i>
                        </a>

                    </div>

                    <span class="project-label">${labelText}</span>

                    <h3>
                        ${project.name}
                    </h3>

                    <p>
                        ${project.description}
                    </p>

                    <div class="project-tags">
                        ${tagsHtml}
                    </div>

                    <a href="project.html?id=${project._id}" class="view-project">
                        View project
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>
                `;

                projectsGrid.appendChild(projectCard);
            });
        }

    })
    .catch(error => {
        console.error("Error loading projects:", error);
    });