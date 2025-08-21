async function onAdminLogin(ev) {
    ev.preventDefault();
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const query = new URLSearchParams({ username, password });
    const API = await fetch(`/auth/admin/login?${query}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    if (API.status === 200) {
        const { user } = await API.json();
        alert(`Welcome Admin ${user.username}!`);
        window.location.href = "/setting";
    } else {
        const response = await API.json();
        alert(response.message);
    }
}
document.querySelector("#admin-login-form").addEventListener("submit", onAdminLogin);
