// @ts-check;
const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: "#4a4949",
    color: "#fff",
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});



async function onLoginUser(ev) {
    ev.preventDefault();
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const query = new URLSearchParams({ username, password });
    const API = await fetch(`/auth/login?${query}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (API.status === 200) {
        const { user } = await API.json();
        await Swal.fire({
            icon: "success",
            title: `Welcome ${user.username}!`,
            showConfirmButton: false,
            timer: 1500,
            background: "#565656",
            color: "#fff",
        });
        window.location.href = "/";
    } else {
        const response = await API.json();
        Toast.fire({ icon: "info", title: response.message })
    }
}






document.querySelector("#login-form").addEventListener("submit", onLoginUser)