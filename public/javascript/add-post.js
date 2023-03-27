// use async/await method
async function postFormHandler(event) {
    event.preventDefault();

    
    if (loggedIn) {
    const response = await fetch('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
        email,
        password
        }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
        document.location.replace('/');
        console.log('response.statusText')
    }
    }
}

document.querySelector('.add-post').addEventListener('submit', postFormHandler);