const project_list = document.querySelector('.project-list');
async function checkAuth() {
    try {
        const response = await fetch('http://localhost:3000/check-session', {
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) {
            window.location.href = '../pages/login.html';
        } 
        else {
            if(data.is_admin){
                document.body.style.display = 'flex';
                loadProjects();
                loadUserInfo();
                loadUsers();
            }
            else{
                document.body.style.display = 'block';
                loadProjects();
                loadUserInfo();
            } 
        }
    } catch (error) {
        window.location.href = '../pages/login.html';
    }
}
checkAuth();

async function loadProjects() {
    project_list.innerHTML = '';
    try {
        const response = await fetch('http://localhost:3000/my-projects', {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            data.projects.forEach(project => {
                console.log(project, project.id);
                project_list.innerHTML += `
                    <div class="project-item">
                        <p class="project-title">Project Name: <span class="project-name">${project.name}</span></p>
                        <div class = "line"></div>
                        <p>${project.description}</p>
                        <div class="line"></div>
                        <div class="edit-delete">
                            <button class="edit-btn">Edit</button>
                            <button class="delete-btn" data-id="${project.id}">Delete</button>
                        </div>
                        <div class="edit-mode" style="display:none">
                        <input class="edit-name" value="${project.name}">
                        <input class="edit-desc" value="${project.description}">
                        <button class="save-btn" data-id="${project.id}">Save</button>
                        <button class="cancel-btn">Cancel</button>
                    </div>
                    </div>`;
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

const create_project_button = document.getElementById('create-button');
create_project_button.addEventListener('click', async () => {
    const name = document.getElementById('project-name').value;
    const description = document.getElementById('project-description').value;

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
            loadProjects();
        }
    } catch (error) {
        console.error("Error during project creation:", error);
    }
});

project_list.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        await fetch(`http://localhost:3000/delete-project/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        project_list.innerHTML = '';
        await loadProjects();
    }
    else if (e.target.classList.contains('edit-btn')) {
        const projectItem = e.target.closest('.project-item');
        projectItem.querySelector('.edit-mode').style.display = 'block';
        projectItem.querySelector('.edit-delete').style.display = 'none';
    }
    else if (e.target.classList.contains('cancel-btn')) {
        const projectItem = e.target.closest('.project-item');
        projectItem.querySelector('.edit-mode').style.display = 'none';
        projectItem.querySelector('.edit-delete').style.display = 'block';
    }
    else if (e.target.classList.contains('save-btn')) {
        const projectItem = e.target.closest('.project-item');
        const newName = projectItem.querySelector('.edit-name').value;
        const newDescription = projectItem.querySelector('.edit-desc').value;
        const id = e.target.dataset.id;

        await fetch(`http://localhost:3000/update-project/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ name: newName, description: newDescription })
        });

        projectItem.querySelector('.edit-mode').style.display = 'none';
        projectItem.querySelector('.edit-delete').style.display = 'block';
        await loadProjects();
    }
});

const user_info_menu = document.getElementById("dropdown-content");

async function loadUserInfo() {
    try {
        const response = await fetch('http://localhost:3000/user-info', {
            credentials: 'include'
        });
        const { user } = await response.json();
        user_info_menu.innerHTML = `
            <p><strong>Name:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Admin:</strong> ${user.is_admin ? 'Yes' : 'No'}</p>
            <button id="delete-account" class="bg-red-500 text-white px-2  rounded">Delete Account</button>
        `;
    } catch (error) {
        console.error("Error during user info loading:", error);
    }
}

document.addEventListener('click', async (e) => {
    if (e.target.id === 'delete-account') {
        try {
            const response = await fetch('http://localhost:3000/delete-account', {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                window.location.href = '../pages/login.html';
            }
        } catch (error) {
            console.error("Error during account deletion:", error);
        }
    }
});
 
const users_data_div = document.getElementById('user-container');

const loadUsers = async () => {
    try {
        const response = await fetch('http://localhost:3000/all-users', {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();

            data.users.forEach(user => {
                users_data_div.innerHTML += `
                    <div class="user-item">
                        <p><strong>Name:</strong> ${user.username}</p>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Admin:</strong> ${user.is_admin ? 'Yes' : 'No'}</p>
                        <div class="line"></div>
                        <div class="set-admin-delete">
                            <button class="set-admin-btn" data-id="${user.id}">Set Admin</button>
                            <button class="delete-admin-btn" data-id="${user.id}">Remove Admin</button>
                        </div>
                    </div>
                `;
            });

        }
    } catch (error) {
        console.error("Error during users loading:", error);
    }
}

const users_data = document.getElementById('user-container');
users_data.addEventListener('click', async (e) => {
    if (e.target.classList.contains('set-admin-btn')) {
        const userId = e.target.dataset.id;
        await fetch(`http://localhost:3000/set-admin/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });
        users_data.innerHTML = '';
        await loadUsers();
    }
    else if (e.target.classList.contains('delete-admin-btn')) {
        const userId = e.target.dataset.id;
        await fetch(`http://localhost:3000/remove-admin/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });
        users_data.innerHTML = '';
        await loadUsers();
    }
}); 