const project_list = document.querySelector('.project-list');
async function checkAuth() {
    try {
        const response = await fetch('http://localhost:3000/check-session', {
            credentials: 'include'
        });
        if (!response.ok) {
            window.location.href = '../pages/login.html';
        } else {
            alert("Session is valid!"); 
            document.body.style.display = 'block';
            loadProjects();
        }
    } catch (error) {
        window.location.href = '../pages/login.html';
    }
}
checkAuth();

async function loadProjects() {
    try {
        const response = await fetch('http://localhost:3000/my-projects', {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            data.projects.forEach(project => {
                project_list.innerHTML += `
                    <div class="project-item">
                        <p>Project Name: ${project.name}</p>
                        <p>${project.description}</p>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error("Error during project loading:", error);
    }
}


const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/logout', {
            method: 'POST',
            credentials: 'include'
        });
        if (response.ok) {
            window.location.href = '../pages/login.html';
        }
    } catch (error) {
        console.error("Error during logout:", error);
    }
});

const create_project_button=document.getElementById('create-button');
create_project_button.addEventListener('click',async()=>{
    const name=document.getElementById('project-name').value;
    const description=document.getElementById('project-description').value;

    try {
        const response = await fetch('http://localhost:3000/create-project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ name, description })
        });
        if (response.ok) {
            const result = await response.json();
            alert(result.message);
        }
    } catch (error) {
        console.error("Error during project creation:", error);
    }

    
    project_list.innerHTML = `
        <div class="project-item">
            <p>Project Name: ${name}</p>
            <p>${description}</p>
        </div>
    `;
});