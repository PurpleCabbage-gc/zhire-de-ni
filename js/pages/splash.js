const SplashPage = {
    render() {
        const container = document.getElementById('page-container');
        container.innerHTML = `
            <div class="splash-page">
                <div class="splash-illustration">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                        <path d="M40 10 C40 10, 20 32, 20 45 C20 58 29 67 40 67 C51 67 60 58 60 45 C60 32 40 10 40 10Z" fill="none" stroke="#6B9E74" stroke-width="1.5" opacity="0.6"/>
                        <path d="M40 22 C40 22, 28 38, 28 46 C28 53 33 58 40 58 C47 58 52 53 52 46 C52 38 40 22 40 22Z" fill="#6B9E74" opacity="0.15"/>
                    </svg>
                </div>
                <h1 class="splash-brand">炙热的你</h1>
                <p class="splash-slogan">炙热如你，心怀美好，向阳绽放</p>
                <div class="splash-actions">
                    <button class="btn btn-primary btn-large" onclick="App.showToast('登录功能开发中，敬请期待')">登录</button>
                    <button class="btn btn-secondary btn-large" onclick="App.enterApp()">游客体验</button>
                </div>
            </div>
        `;
        document.getElementById('bottom-nav').classList.add('hidden');
    }
};
