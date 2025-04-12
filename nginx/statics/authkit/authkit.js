class AuthKit {
    // 各種Auth URL
    static DiscordAuthURL = "/oauth/discord";
    static GoogleAuthURL = "/oauth/google";
    static GithubAuthURL = "/oauth/github";
    static MicrosoftAuthURL = "/oauth/microsoftonline";

    constructor(url) {
        // 最後が/ なら削除
        if (url.endsWith("/")) {
            url = url.slice(0, -1);
        }

        // ベースURL
        this.baseURL = url;
    }

    async login(username, password) {
        const response = await fetch(this.baseURL + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            return data.token;
        } else {
            throw new Error('Login failed');
        }
    }

    async OauthLogin(provider,LoginCallback) {
        // ポップアップ
        if (provider == "discord") {
            this.openPopup(this.baseURL + AuthKit.DiscordAuthURL);
        }

        if (provider == "google") {
            this.openPopup(this.baseURL + AuthKit.GoogleAuthURL);
        }

        if (provider == "github") {
            this.openPopup(this.baseURL + AuthKit.GithubAuthURL);
        }

        if (provider == "microsoftonline") {
            this.openPopup(this.baseURL + AuthKit.MicrosoftAuthURL);
        }

        // コールバック
        this.LoginCallback = LoginCallback;
    }

    async getToken() {
        const req = await fetch(this.baseURL + '/token', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": localStorage.getItem("token")
            }
        });

        if (req.ok) {
            const data = await req.json();
            return data.token;
        }

        return null;
    }

    openPopup(url) {
        window.open(url + "?popup=1", "popupWindow", "width=600,height=600");

        window.addEventListener("message", (event) => {
            if (event.data == "Login-Success") {
                // コールバック
                this.LoginCallback();
            }
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthKit;
}

if (typeof window !== 'undefined') {
    window.AuthKit = AuthKit;
}