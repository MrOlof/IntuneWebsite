const basicSettings = [
    { id: 'basic1', label: 'Require Password' },
    { id: 'basic2', label: 'Enable Encryption' },
    { id: 'basic3', label: 'Disable USB' },
    { id: 'basic4', label: 'Limit Sign-In Attempts' },
    { id: 'basic5', label: 'Require Screen Lock' },
    { id: 'basic6', label: 'Enforce Password Complexity' },
    { id: 'basic7', label: 'Enable Firewall' },
    { id: 'basic8', label: 'Disable Camera' },
    { id: 'basic9', label: 'Disable Bluetooth' },
    { id: 'basic10', label: 'Enable BitLocker' },
    { id: 'basic11', label: 'Enable Anti-Virus' },
    { id: 'basic12', label: 'Require Updates' }
];

const intermediateSettings = [
    { id: 'intermediate1', label: 'Require Multi-Factor Authentication (MFA)' },
    { id: 'intermediate2', label: 'Enable Device Compliance Policies' },
    { id: 'intermediate3', label: 'Enforce TLS 1.2' },
    { id: 'intermediate4', label: 'Enable Application Control' },
    { id: 'intermediate5', label: 'Enable Data Loss Prevention' },
    { id: 'intermediate6', label: 'Enforce Device Encryption' },
    { id: 'intermediate7', label: 'Monitor Device Compliance' },
    { id: 'intermediate8', label: 'Require Strong Authentication' },
    { id: 'intermediate9', label: 'Enable Mobile Threat Defense' },
    { id: 'intermediate10', label: 'Enable Network Protection' },
    { id: 'intermediate11', label: 'Disable Insecure Protocols' },
    { id: 'intermediate12', label: 'Enable Endpoint Detection' }
];

const expertSettings = [
    { id: 'expert1', label: 'Advanced Threat Protection (ATP)' },
    { id: 'expert2', label: 'Conditional Access Policies' },
    { id: 'expert3', label: 'Enable SIEM Integration' },
    { id: 'expert4', label: 'Enable Insider Risk Management' },
    { id: 'expert5', label: 'Enable Automated Investigation' },
    { id: 'expert6', label: 'Enable Remediation' },
    { id: 'expert7', label: 'Enforce Zero Trust Policies' },
    { id: 'expert8', label: 'Enable Device Health Monitoring' },
    { id: 'expert9', label: 'Require Privileged Access Management' },
    { id: 'expert10', label: 'Enforce Least Privilege' },
    { id: 'expert11', label: 'Enable Multi-Geo Capabilities' },
    { id: 'expert12', label: 'Enable Risk-Based Conditional Access' }
];

function generateSettings(settingsArray, containerId) {
    const container = document.getElementById(containerId);
    settingsArray.forEach(setting => {
        const div = document.createElement('div');
        div.className = 'setting';
        div.innerHTML = `<input type="checkbox" id="${setting.id}" name="${setting.id}">
                         <label for="${setting.id}">${setting.label}</label>`;
        container.appendChild(div);
    });
}

function selectAll(baseline) {
    const container = document.getElementById(`${baseline}Settings`);
    const checkboxes = container.getElementsByTagName('input');
    const selectAllBox = document.getElementById(`selectAll${capitalizeFirstLetter(baseline)}`).checked;
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = selectAllBox;
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Generate settings on page load
window.onload = function() {
    generateSettings(basicSettings, 'basicSettings');
    generateSettings(intermediateSettings, 'intermediateSettings');
    generateSettings(expertSettings, 'expertSettings');
};

function exportSettings() {
    const intuneConfig = {
        "@odata.type": "#microsoft.graph.deviceConfiguration",
        "displayName": "Intune MDM Configuration",
        "description": "Generated by Intune MDM Setup Guide",
        "version": 1,
        "settings": []
    };

    // Collect settings from all baselines
    collectSettings(basicSettings, 'basic');
    collectSettings(intermediateSettings, 'intermediate');
    collectSettings(expertSettings, 'expert');

    function collectSettings(settingsArray, baseline) {
        settingsArray.forEach(setting => {
            if (document.getElementById(setting.id).checked) {
                intuneConfig.settings.push({
                    "@odata.type": "#microsoft.graph.deviceConfigurationSetting",
                    "settingName": setting.id,
                    "value": true
                });
            }
        });
    }

    const settingsJson = JSON.stringify(intuneConfig, null, 2);
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'intune-settings.json';
    a.click();
    URL.revokeObjectURL(url);
}
