// Function to change language
function changeLanguage() {
    const lang = document.getElementById('language-select').value;

    // Helper function to fetch and set content
    function fetchAndSetContent(url, titleId, elementId, property) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data[lang]) {
                    if (data[lang].title) {
                        document.getElementById(titleId).innerText = data[lang].title;
                    }
                    if (data[lang][property]) {
                        if (Array.isArray(data[lang][property])) {
                            const contentElement = document.getElementById(elementId);
                            contentElement.innerHTML = '';
                            data[lang][property].forEach(item => {
                                const category = document.createElement('h3');
                                category.innerText = item.category;
                                const list = document.createElement('ul');
                                item.items.forEach(subItem => {
                                    const listItem = document.createElement('li');
                                    listItem.innerText = subItem;
                                    list.appendChild(listItem);
                                });
                                contentElement.appendChild(category);
                                contentElement.appendChild(list);
                            });
                        } else {
                            document.getElementById(elementId).innerText = data[lang][property];
                        }
                    } else {
                        document.getElementById(elementId).innerText = '';
                    }
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Fetch and set content for each section
    fetchAndSetContent('json/about.json', 'about-title', 'about-lead', 'lead');
    fetchAndSetContent('json/interests.json', 'interests-title', 'interests-content', 'content');

    // Fetch and display publications
    fetch('json/publications.json')
        .then(response => response.json())
        .then(data => {
            const publicationsList = document.getElementById('publications-list');
            const publicationsTitle = document.getElementById('publications-title');
            publicationsList.innerHTML = '';
            if (data[lang]) {
                publicationsTitle.innerText = data[lang].title || '';
                if (data[lang].list) {
                    data[lang].list.forEach(publicationType => {
                        const typeDiv = document.createElement('div');
                        typeDiv.innerHTML = `<h3>${publicationType.type}</h3>`;
                        publicationType.publications.forEach(pub => {
                            const div = document.createElement('div');
                            div.className = 'd-flex flex-column flex-md-row justify-content-between mb-5';
                            div.innerHTML = `
                                <div class="flex-grow-1">
                                    <a href="${pub.link}" target="_blank">${pub.link ? '' : ''}
                                    <h4 class="mb-0"> ${pub.id} - ${pub.title} - version ${pub.language}</h4> </a>
                                    <p>${pub.abstract} <a href="${pub.link}" target="_blank">${pub.link ? '...' : ''}</a></p>
                                    <p><b>${pub.keywords}</b></p>
                                    <div class="subheading mb-3">
                                        ${pub.event || pub.journal || pub.conference || ''}
                                    </div>
                                </div>
                                <div class="flex-shrink-0"><span class="text-primary">${pub.date}</span></div>
                            `;
                            typeDiv.appendChild(div);
                        });
                        publicationsList.appendChild(typeDiv);
                    });
                }
            }
        })
        .catch(error => console.error('Error fetching data:', error));

    // Fetch and display experience
    fetch('json/experience.json')
        .then(response => response.json())
        .then(data => {
            const experienceList = document.getElementById('experience-list');
            const experienceTitle = document.getElementById('experience-title');
            experienceList.innerHTML = '';
            if (data[lang]) {
                experienceTitle.innerText = data[lang].title || '';
                if (data[lang].list) {
                    data[lang].list.forEach(experience => {
                        const div = document.createElement('div');
                        div.className = 'd-flex flex-column flex-md-row justify-content-between mb-5';
                        div.innerHTML = `
                            <div class="flex-grow-1">
                                <h3 class="mb-0">${experience.title}</h3>
                                <div class="subheading mb-3">${experience.company}</div>
                                <p>${experience.description}</p>
                            </div>
                            <div class="flex-shrink-0"><span class="text-primary">${experience.date}</span></div>
                        `;
                        experienceList.appendChild(div);
                    });
                }
            }
        })
        .catch(error => console.error('Error fetching data:', error));

    // Fetch and display skills
    fetch('json/skills.json')
        .then(response => response.json())
        .then(data => {
            const skillsList = document.getElementById('skills-list');
            const skillsTitle = document.getElementById('skills-title');
            skillsList.innerHTML = '';
            if (data[lang]) {
                skillsTitle.innerText = data[lang].title || '';
                if (data[lang].list) {
                    data[lang].list.forEach(skill => {
                        const div = document.createElement('div');
                        if (skill.icons) {
                            div.innerHTML += `
                                <div class="subheading mb-3">${skill.category}</div>
                                <ul class="list-inline dev-icons">
                                    ${skill.icons.map(icon => `<li class="list-inline-item"><i class="${icon}"></i></li>`).join('')}
                                </ul>
                            `;
                        }
                        if (skill.workflow) {
                            div.innerHTML += `
                                <div class="subheading mb-3">${skill.category}</div>
                                <ul class="fa-ul mb-0">
                                    ${skill.workflow.map(flow => `<li><span class="fa-li"><i class="fas fa-check"></i></span>${flow}</li>`).join('')}
                                </ul>
                            `;
                        }
                        if (skill.skills) {
                            div.innerHTML += `
                                <div class="subheading mb-3">${skill.category}</div>
                                <ul class="fa-ul mb-0">
                                    ${skill.skills.map(skill => `<li><span class="fa-li"><i class="fas fa-check"></i></span>${skill}</li>`).join('')}
                                </ul>
                            `;
                        }
                        skillsList.appendChild(div);
                    });
                }
            }
        })
        .catch(error => console.error('Error fetching data:', error));


    // Fetch and display education
    fetch('json/education.json')
        .then(response => response.json())
        .then(data => {
            const educationList = document.getElementById('education-list');
            const educationTitle = document.getElementById('education-title');
            educationList.innerHTML = '';
            if (data[lang]) {
                educationTitle.innerText = data[lang].title || '';
                if (data[lang].list) {
                    data[lang].list.forEach(education => {
                        const div = document.createElement('div');
                        div.className = 'd-flex flex-column flex-md-row justify-content-between mb-5';
                        div.innerHTML = `
                            <div class="flex-grow-1">
                                <h3 class="mb-0">${education.school}</h3>
                                <div class="subheading mb-3">${education.degree}</div>
                                <p>${education.description}</p>
                            </div>
                            <div class="flex-shrink-0"><span class="text-primary">${education.date}</span></div>
                        `;
                        educationList.appendChild(div);
                    });
                }
            }
        })
        .catch(error => console.error('Error fetching data:', error));

    // Fetch and display awards
    fetch('json/awards.json')
        .then(response => response.json())
        .then(data => {
            const awardsList = document.getElementById('awards-list');
            const awardsTitle = document.getElementById('awards-title');
            awardsList.innerHTML = '';
            if (data[lang]) {
                awardsTitle.innerText = data[lang].title || '';
                if (data[lang].list) {
                    data[lang].list.forEach(award => {
                        const div = document.createElement('div');
                        div.innerHTML = `
                            <li>
                                <span class="fa-li"><i class="fas fa-trophy text-warning"></i></span>
                                <b>${award.date}</b> : ${award.title}
                            </li>
                        `;
                        awardsList.appendChild(div);
                    });
                }
            }
        })
        .catch(error => console.error('Error fetching data:', error));

    // Fetch and display services
    fetch('json/services.json')
        .then(response => response.json())
        .then(data => {
            const servicesList = document.getElementById('services-list');
            const servicesTitle = document.getElementById('services-title');
            servicesList.innerHTML = '';
            if (data[lang]) {
                servicesTitle.innerText = data[lang].title || '';
                if (data[lang].list) {
                    data[lang].list.forEach(service => {
                        const li = document.createElement('li');
                        li.innerHTML = `
                            <span class="fa-li"><i class="fas fa-check"></i></span>
                            ${service}
                        `;
                        servicesList.appendChild(li);
                    });
                }
            }
        })
        .catch(error => console.error('Error fetching data:', error));

    // Fetch and display gallery
    fetch('json/gallery.json')
        .then(response => response.json())
        .then(data => {
            const galleryList = document.getElementById('gallery-list');
            const galleryTitle = document.getElementById('gallery-title');
            galleryList.innerHTML = '';
            if (data[lang]) {
                galleryTitle.innerText = data[lang].title || '';
                if (data[lang].list) {
                    data[lang].list.forEach(photo => {
                        const div = document.createElement('div');
                        div.className = 'col-lg-4 col-sm-6';
                        div.innerHTML = `
                            <a class="portfolio-box" href="${photo.link}" title="${photo.title}">
                                <img class="img-fluid" src="${photo.src}" alt="${photo.title}">
                                <div class="portfolio-box-caption">
                                    <div class="project-category text-white-50">${photo.category}</div>
                                    <div class="project-name">${photo.title}</div>
                                </div>
                            </a>
                        `;
                        galleryList.appendChild(div);
                    });
                }
            }
        })
        .catch(error => console.error('Error fetching data:', error));

    // Initialize map
    if (document.getElementById('map-container')) {
        const map = L.map('map-container').setView([0, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        fetch('json/map.json')
            .then(response => response.json())
            .then(data => {
                if (data[lang]) {
                    data[lang].forEach(location => {
                        const marker = L.marker([location.latitude, location.longitude]).addTo(map);
                        marker.bindPopup(location.description);
                    });
                }
            })
            .catch(error => console.error('Error fetching map data:', error));
    }

    // Fetch and set menu items
    fetch('json/menu.json')
        .then(response => response.json())
        .then(data => {
            if (data[lang]) {
                document.querySelectorAll('#navbar-menu .nav-link').forEach(link => {
                    const key = link.getAttribute('data-key');
                    if (data[lang][key]) {
                        link.innerText = data[lang][key];
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Set default language on page load
document.addEventListener('DOMContentLoaded', () => {
    changeLanguage();
});

// Function to handle contact form submission
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const contactStatus = document.getElementById('contact-status');

    emailjs.send('service_0yhlrii', 'template_3bvruq2', {
        from_name: name,
        from_email: email,
        message: message
    })
    .then(function(response) {
        contactStatus.innerHTML = '<div class="alert alert-success" role="alert">Message sent successfully!</div>';
    }, function(error) {
        contactStatus.innerHTML = '<div class="alert alert-danger" role="alert">Failed to send message. Please try again later.</div>';
    });
});


// Function to download content as PDF
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 10;

    // Helper function to add section to PDF
    function addSection(title, content) {
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(title, 10, y);
        y += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(content, 180); // Adjust text wrapping within page width
        doc.text(lines, 10, y);
        y += lines.length * 10; // Adjust y position based on number of lines
        if (y > 270) { // Add new page if content exceeds page height
            doc.addPage();
            y = 10;
        }
    }

    const sections = [
        { title: 'About', content: document.getElementById('about-lead').innerText },
        { title: 'Interests', content: document.getElementById('interests-content').innerText },
        { title: 'Publications', content: document.getElementById('publications-list').innerText },
        { title: 'Experience', content: document.getElementById('experience-list').innerText },
        { title: 'Skills', content: document.getElementById('skills-list').innerText },
        { title: 'Education', content: document.getElementById('education-list').innerText },
        { title: 'Awards', content: document.getElementById('awards-list').innerText }
    ];

    sections.forEach(section => {
        if (section.content) {
            addSection(section.title, section.content);
            y += 10; // Add extra space between sections
        }
    });

    doc.save('resume_Aboul-Hassane-CISSE.pdf');
}
