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
        if (response.ok) {
            alert("Login successful!");
            const data = await response.json();
            window.location.href = "../pages/project.html";
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
});