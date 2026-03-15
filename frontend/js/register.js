

let createAccountButton = document.getElementById("create-account-btn");

createAccountButton.addEventListener("click", async () => {
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if(!username || !email || !password){
        alert("Bütün sahələri doldurun!");
        return;
    }
    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    });
    const data = await response.json();
    if(response.ok){
        window.location.href = '/login.html';
    }
    else{
        alert(data.message);
    }
});
    