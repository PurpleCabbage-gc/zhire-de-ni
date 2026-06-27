const App = {
    currentPage: 'splash',

    init() {
        const settings = AppData.getSettings();
        AppData.applyFontSize(settings.fontSize);

        if (this.shouldShowSplash()) {
            SplashPage.render();
        } else {
            this.enterApp();
        }
    },

    shouldShowSplash() {
        const lastSplash = localStorage.getItem('zr_last_splash');
        if (!lastSplash) return true;
        const elapsed = Date.now() - parseInt(lastSplash, 10);
        return elapsed > 24 * 60 * 60 * 1000;
    },

    enterApp() {
        localStorage.setItem('zr_last_splash', Date.now().toString());
        document.getElementById('bottom-nav').classList.remove('hidden');
        this.navigate('know');
    },

    navigate(page) {
        this.currentPage = page;
        Nav.render(page);

        switch (page) {
            case 'know':
                KnowPage.render();
                break;
            case 'record':
                RecordPage.render();
                break;
            case 'dashboard':
                DashboardPage.render();
                break;
            case 'settings':
                SettingsPage.render();
                break;
        }
    },

    showToast(message, duration = 2000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.remove('hidden');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, duration);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
