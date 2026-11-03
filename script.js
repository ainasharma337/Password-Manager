// Professional Toast Notification Function
const showToast = (message, type = "info") => {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icons = {
        success: "fa-circle-check",
        danger: "fa-circle-xmark",
        info: "fa-circle-info"
    };

    toast.innerHTML = `
        <i class="fa-solid ${icons[type]}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

const mask = () => "••••••••";

const copyText = (txt) => {
    navigator.clipboard.writeText(txt).then(() => {
        showToast("Copied to clipboard!", "success");
    });
};

const toggleView = (id, actualPass) => {
    const span = document.getElementById(`pass-${id}`);
    const icon = document.getElementById(`eye-${id}`);

    if (span.innerText === "••••••••") {
        span.innerText = actualPass;
        icon.classList.replace("fa-eye", "fa-eye-slash");
        icon.style.color = "#6366f1";
    } else {
        span.innerText = "••••••••";
        icon.classList.replace("fa-eye-slash", "fa-eye");
        icon.style.color = "#94a3b8";
    }
};

const deletePassword = (index) => {
    let data = JSON.parse(localStorage.getItem("passwords") || "[]");
    const webName = data[index].website;
    data.splice(index, 1);
    localStorage.setItem("passwords", JSON.stringify(data));
    showPasswords();
    showToast(`${webName} removed from vault`, "danger");
};

const showPasswords = () => {
    const tableBody = document.querySelector("#passwordTable tbody");
    const data = JSON.parse(localStorage.getItem("passwords") || "[]");

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#94a3b8; padding:30px;">Your vault is empty.</td></tr>`;
        return;
    }

    tableBody.innerHTML = data.map((el, i) => `
        <tr>
            <td>${el.website}</td>
            <td>${el.username}</td>
            <td>
                <div class="password-container">
                    <span id="pass-${i}">${mask()}</span>
                    <button class="btn-icon" onclick="toggleView(${i}, '${el.password}')">
                        <i id="eye-${i}" class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
            <td>
                <div class="actions-container">
                    <button class="btn-icon copy" title="Copy Password" onclick="copyText('${el.password}')">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="btn-icon delete" title="Delete" onclick="deletePassword(${i})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
};

// URL Validation Regex function
const isValidUrl = (string) => {
    // Regex to check valid domains like google.com, https://google.com, sub.domain.org, etc.
    const res = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return res.test(string);
};

document.getElementById("submitBtn").addEventListener("click", (e) => {
    e.preventDefault();
    const website = document.getElementById("website");
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    if (!website.value.trim() || !username.value.trim() || !password.value.trim()) {
        showToast("Please fill all fields", "danger");
        return;
    }

    // Check strict URL validation as requested by sir
    if (!isValidUrl(website.value.trim())) {
        showToast("Please enter a valid website URL (e.g., google.com)", "danger");
        website.focus();
        return;
    }

    const data = JSON.parse(localStorage.getItem("passwords") || "[]");
    data.push({ website: website.value.trim(), username: username.value.trim(), password: password.value.trim() });
    localStorage.setItem("passwords", JSON.stringify(data));

    website.value = ""; 
    username.value = ""; 
    password.value = "";
    showPasswords();
    showToast("Password saved successfully!", "success");
});

showPasswords();
