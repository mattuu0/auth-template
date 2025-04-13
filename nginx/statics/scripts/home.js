const auth = new AuthKit('/auth/'); 

async function Init() {
    // hello world 検証
    const hello = await auth.Get('/app/hello',{});

    console.log(hello);
}

Init();