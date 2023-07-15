const form = document.querySelector('#new-user-form');

function createUser(e) {
    e.preventDefault()
    const username = document.querySelector('#username-input');
    const password = document.querySelector('#password-input');
    
    const body = {
        username: username.value,
        password: password.value
    }
    axios.post('http://localhost:4000/user/create', body).then(res => {
        const message = document.querySelector('#message');
        message.innerHTML='Your account has been created, you will be redirected to login in 4 seconds'
        setTimeout(()=>{
            window.location.replace('./login.html')
        }, 4000)
    })

}

form.addEventListener('submit', createUser)