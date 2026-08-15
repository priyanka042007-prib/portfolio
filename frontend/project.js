// =========================================
// MOBILE NAVIGATION
// =========================================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
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

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            const icon = menuBtn.querySelector("i");
            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        });
    });
}


// =========================================
// DARK MODE
// =========================================

const themeToggle = document.getElementById("themeToggle");

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

        const icon = themeToggle.querySelector("i");
        if (icon) {
            if (isDark) {
                icon.classList.remove("fa-moon");
                icon.classList.add("fa-sun");
            } else {
                icon.classList.remove("fa-sun");
                icon.classList.add("fa-moon");
            }
        }
    });
}


// =========================================
// SCROLL TO TOP
// =========================================

const scrollTop = document.getElementById("scrollTop");

if (scrollTop) {
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
}


// =========================================
// LOAD PROJECT DETAILS BY ID
// =========================================

const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const projectContent = document.getElementById("projectContent");
const errorTitle = document.getElementById("errorTitle");
const errorMessage = document.getElementById("errorMessage");

const projectName = document.getElementById("projectName");
const projectDescription = document.getElementById("projectDescription");
const projectTags = document.getElementById("projectTags");
const projectFeatures = document.getElementById("projectFeatures");
const featuresContainer = document.getElementById("featuresContainer");

function showError(title, message) {
    if (loadingState) loadingState.style.display = "none";
    if (projectContent) projectContent.style.display = "none";
    if (errorState) {
        if (errorTitle) errorTitle.textContent = title;
        if (errorMessage) errorMessage.textContent = message;
        errorState.style.display = "block";
    }
}

function loadProjectDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get("id");

    if (!projectId) {
        showError(
            "No Project Specified",
            "Please select a project from the portfolio page to view its details."
        );
        return;
    }

    fetch(`https://portfolio-backend-xrxg.onrender.com/api/projects/${encodeURIComponent(projectId)}`)
        .then(response => {
            if (response.status === 404) {
                throw new Error("Project not found");
            }
            if (!response.ok) {
                throw new Error(`Failed to load project (${response.status})`);
            }
            return response.json();
        })
        .then(project => {
            if (!project || !project.name) {
                showError("Project Not Found", "The requested project details could not be found.");
                return;
            }

            // Update page title
            document.title = `${project.name} | Priyanka Portfolio`;

            // Populate project name & description
            projectName.textContent = project.name;
            projectDescription.textContent = project.description;

            // Populate technology tags
            projectTags.innerHTML = "";
            if (project.technology) {
                const techs = project.technology.split(",").map(t => t.trim()).filter(Boolean);
                techs.forEach(tech => {
                    const tag = document.createElement("span");
                    tag.textContent = tech;
                    projectTags.appendChild(tag);
                });
            }

            // Populate features
            projectFeatures.innerHTML = "";
            if (Array.isArray(project.features) && project.features.length > 0) {
                project.features.forEach(feature => {
                    const li = document.createElement("li");
                    li.className = "feature-item";
                    li.innerHTML = `
                        <i class="fa-solid fa-circle-check"></i>
                        <span>${feature}</span>
                    `;
                    projectFeatures.appendChild(li);
                });
                featuresContainer.style.display = "block";
            } else {
                featuresContainer.style.display = "none";
            }

            // Show content, hide loading
            if (loadingState) loadingState.style.display = "none";
            if (errorState) errorState.style.display = "none";
            if (projectContent) projectContent.style.display = "block";
        })
        .catch(error => {
            console.error("Error fetching project details:", error);
            if (error.message === "Project not found") {
                showError("Project Not Found", "We couldn't find a project matching the requested ID.");
            } else {
                showError("Connection Error", "Unable to connect to the backend server. Please make sure the server is running.");
            }
        });
}

// Initial fetch on page load
document.addEventListener("DOMContentLoaded", loadProjectDetails);
