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


// Rahul - Update this code to change the format of the Excel 

function downloadTableAsExcel(tableName) {
    var currentdate = new Date();
    var datetime =
        String(currentdate.getDate()).padStart(2, '0') +
        "/" +
        String(currentdate.getMonth() + 1).padStart(2, '0') +
        "/" +
        currentdate.getFullYear() +
        " " +
        String(currentdate.getHours()).padStart(2, '0') +
        ":" +
        String(currentdate.getMinutes()).padStart(2, '0') +
        ":" +
        String(currentdate.getSeconds()).padStart(2, '0');

    var filename = "Jammer_LoGs" + "-" + datetime + ".xlsx";

    const table = document.getElementById(tableName);

    // Create a new thead section with custom info
    const infoHeader = document.createElement("thead");
    infoHeader.innerHTML = `
        <tr><th colspan="7" style="text-align:left;"><strong>COMPANY:- BHARAT AERO</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Date - ${datetime}</strong></th></tr>
        <tr><th colspan="7">******************************************************************************************************************</th></tr>
        <tr><th colspan="7" style="text-align:left;"><strong>Disclaimer-</strong></th></tr>
        <tr><th colspan="7" style="text-align:left;">* During the Jamming Operations, The Radar will not be in a Functional State.</th></tr>
        <tr><th colspan="7" style="text-align:left;">* Due to technological limitations, passive radars only show the directional data with an accuracy up to 3 degrees and the Passive Radar also cannot tell the accurate height and distance of the detected object.</th></tr>
        <tr><th colspan="7" style="text-align:left;">* Can detect drones only if their signature is pre-fed and available in the system software. It also has a permanent Blind Spot up-to 200 meters radius from the Radar, so it should not be tested under 200 meters range.</th></tr>
        <tr><th colspan="7" style="text-align:left;">* The Radar System should follow 0-Degree Alignment/North Alignment by using an arrow pointing towards North.</th></tr>
        <tr><th colspan="7">******************************************************************************************************************</th></tr>
    `;

    // Insert it before the actual <thead>
    const originalThead = table.querySelector("thead");
    table.insertBefore(infoHeader, originalThead);

    // Export the table
    TableToExcel.convert(table, {
        name: filename,
        sheet: {
            name: "Jammer Logs",
            content: "BHARAT AERO"
        },
    });

    // Clean up: remove the inserted custom thead
    infoHeader.remove();
}

// document.querySelector("#logs-download").addEventListener("click", downloadTableAsExcel);
document.querySelector("#logout-btn").addEventListener("click", onLogoutClick);
window.addEventListener("load", onLoad);


