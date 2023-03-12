// use async/await method
async function signupFormHandler(event) {
    event.preventDefault();

    // POST the username, email, and password from the form to our server

    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    // must have all three before making POST request: username, email, password
    if (username && email && password) {
    // make a fetch() POST request to /api/users/ - assign this to variable "response" in order to avoid using .catch or .then in the argument
    // to use await, just add "await" before the function
    const response = await fetch('/api/users', {
        method: 'post',
        body: JSON.stringify({
        username,
        email,
        password
        }),
        headers: { 'Content-Type': 'application/json' }
    });
        // check the response status - add error handling by using ".ok" after response call.  If response is OK, perform action.  Otherwise, perform other action.
        if (response.ok) {
            console.log('success');
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);

async function loginFormHandler(event) {
    event.preventDefault();

    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
    
    if (email && password) {
    const response = await fetch('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
        email,
        password
        }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        document.location.replace('/');
        console.log("login successful.")
    } else {
        alert(response.statusText);
        console.log("login did not work.")
    }
    }
}

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);