const form = document.querySelector('#login-form')

function formSubmit (e) {
    e.preventDefault()
    const usernameInput = document.querySelector('#username-input')
    const passwordInput = document.querySelector('#password-input')
    const body = {
        username: usernameInput.value,
        password: passwordInput.value
    }
    axios.post('http://localhost:4000/user/login', body).then(res => {
        window.location.replace('./home.html')
    })

}

form.addEventListener('submit', formSubmit)