const projectName = "Prison Jammer"

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

async function onLogoutClick(ev) {
    ev.preventDefault();
    Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Log out!"
    })
        .then((res) => {
            if (res.isConfirmed) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return;
            }
        })
}

async function onLoad(ev) {
    let pathname = window.location.pathname.replace('/', "");
    let title = pathname.replace(pathname.charAt(0), pathname.charAt(0).toUpperCase());
    if(window.location.pathname != "/"){
        document.title = title;
    }

    if (!localStorage.getItem("token")) return window.location.href = "/login";
    $("#open-mobile").on('click', () => $("#mobile-menu").toggle(500));
}



document.querySelector("#logout-btn").addEventListener("click", onLogoutClick);
window.addEventListener("load", onLoad);