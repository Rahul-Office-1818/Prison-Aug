
Toast = Swal.mixin({
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
    const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Log out!"
    })

    if (isConfirmed) {
        //delete the token from local storage and redirect to login page
        const logout = await fetch('/auth/logout');
        if (logout.status === 200) {
            window.location.href = "/login";
        }
    }

    // .then((res) => {
    //     if (res.isConfirmed) {
    //         fetch("/api/logout").then()
    //         window.location.href = "/login";
    //         return;
    //     }
    // })
}

async function onLoad(ev) {
    let pathname = window.location.pathname.replace('/', "");
    let title = pathname.replace(pathname.charAt(0), pathname.charAt(0).toUpperCase());
    if (window.location.pathname != "/") {
        document.title = title;
    }

    $("#open-mobile").on('click', () => $("#mobile-menu").toggle(500));
}



document.querySelector("#logout-btn").addEventListener("click", onLogoutClick);
window.addEventListener("load", onLoad);