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
    const API = await fetch(`/auth/login?username=${username}&password=${password}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    const response = await API.json();
    if (API.status === 200) {
        await Swal.fire({
            icon: "success",
            title: response.message,
            showConfirmButton: false,
            timer: 1000
        });
        localStorage.setItem("token", JSON.stringify(response.user));
        window.location.href = "/";
        return;
    } else {
        Toast.fire({ icon: "warning", title: response.message })
    }
}






document.querySelector("#login-form").addEventListener("submit", onLoginUser)