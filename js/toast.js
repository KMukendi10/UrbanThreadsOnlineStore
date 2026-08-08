// toast.js
//
// Small, non-blocking notification bar instead of alert()/confirm()
// popups. Any page that wants to use it needs a `<div class="toast"

let hideTimer = null;

export function showToast(message, duration = 2200) {

    const toast = document.getElementById("toast");

    if (!toast) {

        return;

    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(hideTimer);

    hideTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, duration);

}
