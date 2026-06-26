const SplashPage = {
    render() {
        const container = document.getElementById('page-container');
        container.innerHTML = `
            <div class="splash-page">
                <div class="splash-illustration">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                        <circle cx="60" cy="60" r="55" fill="#f0f7f1" stroke="#A3C9A8" stroke-width="2"/>
                        <path d="M60 25 C60 25, 40 45, 40 60 C40 73 49 82 60 82 C71 82 80 73 80 60 C80 45 60 25 60 25Z" fill="#A3C9A8" opacity="0.3"/>
                        <path d="M60 35 C60 35, 48 50, 48 60 C48 67 53 72 60 72 C67 72 72 67 72 60 C72 50 60 35 60 35Z" fill="#A3C9A8" opacity="0.6"/>
                        <circle cx="60" cy="58" r="8" fill="#A3C9A8"/>
                        <path d="M45 85 Q60 95 75 85" stroke="#A3C9A8" stroke-width="2" fill="none" stroke-linecap="round"/>
                    </svg>
                </div>
                <h1 class="splash-brand">炙热的你</h1>
                <p class="splash-slogan">炙热如你，心怀美好，向阳绽放！</p>
                <div class="splash-actions">
                    <button class="btn btn-primary btn-large" onclick="App.showToast('登录功能开发中，敬请期待')">登录</button>
                    <button class="btn btn-secondary btn-large" onclick="App.enterApp()">游客模式</button>
                </div>
            </div>
        `;
        document.getElementById('bottom-nav').classList.add('hidden');
    }
};
