const auth = new AuthKit('/auth/'); 

async function Init() {
    const token = await auth.getToken(); 

    if (token) {
        console.log(token);
    }
}

Init();