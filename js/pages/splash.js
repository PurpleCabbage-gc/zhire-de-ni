const SplashPage = {
    wallpapers: [
        'assets/Camera_XHS_1782474634237_1782474717622edit.jpg',
        'assets/Camera_XHS_1782474638231_1782474732339edit.jpg',
        'assets/Camera_XHS_1782474656705_1782474750586edit.jpg',
        'assets/Camera_XHS_1782474664427_1782474768007edit.jpg'
    ],

    pickWallpaper() {
        const idx = Math.floor(Math.random() * this.wallpapers.length);
        return this.wallpapers[idx];
    },

    render() {
        const bg = this.pickWallpaper();
        const container = document.getElementById('page-container');
        container.innerHTML = `
            <div class="splash-page">
                <div class="splash-bg">
                    <div class="splash-placeholder"></div>
                    <img src="${bg}" alt="" loading="lazy" onload="this.classList.add('loaded')">
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
