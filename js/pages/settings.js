const SettingsPage = {
    render() {
        const settings = AppData.getSettings();
        const container = document.getElementById('page-container');
        container.innerHTML = `
            <div class="page">
                <h1 class="section-title">我的设置</h1>

                <div class="settings-section">
                    <h3 class="settings-section-title">适老化设置</h3>

                    <div class="font-size-setting">
                        <label class="toggle-label">字号调节</label>
                        <div class="font-size-options">
                            ${['small', 'standard', 'large', 'xlarge'].map(size => {
                                const labels = { small: '小', standard: '标准', large: '大', xlarge: '超大' };
                                return `<button class="font-size-btn ${settings.fontSize === size ? 'active' : ''}"
                                    onclick="SettingsPage.setFontSize('${size}')">${labels[size]}</button>`;
                            }).join('')}
                        </div>
                        <div class="font-preview" id="fontPreview">
                            预览文字：身体在提醒你慢一点，我们一起理一理。
                        </div>
                    </div>

                    <div class="toggle-row">
                        <span class="toggle-label">大图标模式</span>
                        <div class="toggle-switch ${settings.largeIcons ? 'active' : ''}" onclick="SettingsPage.toggleSetting('largeIcons')"></div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3 class="settings-section-title">提醒设置</h3>
                    <div class="toggle-row">
                        <span class="toggle-label">早上温馨提醒</span>
                        <div class="toggle-switch ${settings.reminderMorning ? 'active' : ''}" onclick="SettingsPage.toggleSetting('reminderMorning')"></div>
                    </div>
                    <div class="toggle-row">
                        <span class="toggle-label">晚上记录提醒</span>
                        <div class="toggle-switch ${settings.reminderEvening ? 'active' : ''}" onclick="SettingsPage.toggleSetting('reminderEvening')"></div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3 class="settings-section-title">语音播报</h3>
                    <div class="toggle-row">
                        <span class="toggle-label">开启语音播报</span>
                        <div class="toggle-switch ${settings.voiceEnabled ? 'active' : ''}" onclick="SettingsPage.toggleSetting('voiceEnabled')"></div>
                    </div>
                    <p class="settings-hint">开启后，AI回答和报告中将显示「听我读」按钮</p>
                </div>

                <div class="settings-section">
                    <h3 class="settings-section-title">账号信息</h3>
                    <div class="account-info">
                        <div class="account-avatar">👩</div>
                        <div class="account-details">
                            <div class="account-row">
                                <span>昵称</span>
                                <span>${settings.userName}</span>
                            </div>
                            <div class="account-row">
                                <span>手机号</span>
                                <span>138****8888</span>
                            </div>
                            <div class="account-row">
                                <span>邮箱</span>
                                <span>u***@email.com</span>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-ghost" style="width: 100%; margin-top: 12px;" onclick="App.showToast('账号管理功能开发中')">修改账号信息</button>
                </div>

                <div class="settings-section">
                    <button class="btn btn-ghost" style="width: 100%; color: var(--alert);" onclick="SettingsPage.clearData()">清除所有数据</button>
                    <p class="settings-hint" style="text-align: center;">清除后无法恢复，请谨慎操作</p>
                </div>
            </div>
        `;
    },

    setFontSize(size) {
        const settings = AppData.getSettings();
        settings.fontSize = size;
        AppData.saveSettings(settings);
        this.render();
    },

    toggleSetting(key) {
        const settings = AppData.getSettings();
        settings[key] = !settings[key];
        AppData.saveSettings(settings);
        this.render();
    },

    clearData() {
        if (confirm('确定要清除所有记录数据吗？此操作无法撤回。')) {
            localStorage.clear();
            App.showToast('数据已清除');
            setTimeout(() => location.reload(), 1000);
        }
    }
};
