const auth = new AuthKit('/auth/');

function OauthLogin(provider) {
    auth.OauthLogin(provider,LoginSuccess);
}

function LoginSuccess() {
    window.location.href = "./home.html";
}