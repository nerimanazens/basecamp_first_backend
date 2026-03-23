const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            alert("Login successful!");
            if (data.is_admin) {
                window.location.href = "../pages/admin.html";
            }
            else window.location.href = "../pages/project.html";
        }
        
        else if (data.message == 'Invalid password!') {
            alert("Invalid password!");
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
});