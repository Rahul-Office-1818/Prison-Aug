
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

jammerToast = Swal.mixin({ toast: true, position: "top-end", timer: 3000, timerProgressBar: true, showConfirmButton: false });


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
}

async function onLoad(ev) {
    let pathname = window.location.pathname.replace('/', "");
    let title = pathname.replace(pathname.charAt(0), pathname.charAt(0).toUpperCase());
    if (window.location.pathname != "/") {
        document.title = title;
    }

    $("#open-mobile").on('click', () => $("#mobile-menu").toggle(500));
}
function downloadTableAsExcel(tableName) {
    var currentdate = new Date();
    var datetime =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear()+
        " " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();

    console.log(datetime);
    var filename = "Jammer_LoGs" +"-"+ datetime + ".xlsx";
    TableToExcel.convert(document.getElementById(`${tableName}`), {
        name: filename,
        sheet: {
            name: "sheet 1",
            content: "BHARAT AERO"
        },
    });
}
// document.querySelector("#logs-download").addEventListener("click", downloadTableAsExcel);
document.querySelector("#logout-btn").addEventListener("click", onLogoutClick);
window.addEventListener("load", onLoad);