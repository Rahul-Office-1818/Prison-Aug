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
    const jammers = fetch("/alljammer", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            const AllJammer = data.jammers
            const jammerArray = AllJammer.map(element => ({ ipAddress: element.ipAddress, ipPort: element.ipPort }))
            fetch("/last_status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jammerArray)
            })
                .then(res => res.json())
                .then(data => {
                    const results = data.results
                    const container = document.getElementById("jammers-div")
                    Object.keys(results).forEach((address) => {
                        const button = document.querySelector(`button[data-address="${address}"]`);
                        if (button) {
                            const marker = markerGroup.getLayers().find(layer => layer.options.id == button.getAttribute("data-id"));
                            results[address].payload.includes("ON") ? button.setAttribute("data-status", "1") : button.setAttribute("data-status", "0");
                            const state = button.dataset.status;
                            if (state == 1 && marker) {
                                removeAllClasses(button, "bg-");
                                marker.setIcon(onJammer);

                                button.classList.add("bg-green-500")
                            } else {
                                removeAllClasses(button, "bg-");
                                button.classList.add("bg-red-500")
                                marker.setIcon(offJammer);
                            }
                        }
                    });
                })
        })


}
function downloadTableAsExcel(tableName) {
    var currentdate = new Date();
    var datetime =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();

    console.log(datetime);
    var filename = "Jammer_LoGs" + "-" + datetime + ".xlsx";
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