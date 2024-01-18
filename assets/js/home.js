const map = L.map('map', {
    zoom: 16,
    doubleClickZoom: false,
    center: [30.291904, 74.981839],
    layers: L.tileLayer('http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', { maxZoom: 22, attribution: 'Prison Jammer' })
});

const markerGroup = L.markerClusterGroup({
    chunkedLoading: true,
});

const onJammer = L.icon({
    iconUrl: './assets/icon/on.png',
    iconSize: [90, 90],
    iconAnchor: [50, 60],
    className: 'jammer-icon',
    name: "on"
});

const offJammer = L.icon({
    iconUrl: './assets/icon/off.png',
    iconSize: [90, 90],
    iconAnchor: [50, 60],
    className: 'jammer-icon',
    name: "off"
});

// DOM Selector :- 
const drawerSelector = document.querySelector("#drawer");
const addJammerModalSelector = document.querySelector("#static-modal");
const closeJammerSelector = document.querySelector("#modalClose");
const addJammerFormSelector = document.querySelector("#jammer-form");

const toggleDrawer = () => drawerSelector.classList.toggle('hidden');

async function onDblClick(ev) {
    let latlng = ev.latlng;

    const userPermission = await Swal.fire({
        title: "Are you sure?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Add Jammer!"
    })
    if (userPermission.isConfirmed) {
        addJammerFormSelector.lat.value = latlng.lat;
        addJammerFormSelector.lng.value = latlng.lng;
        addJammerModalSelector.classList.remove("hidden");
    }

}

function onJammerMarkerClick(ev) {
    const id = this.options.jammerId;
    // alert(id)
}

map.on("dblclick", onDblClick)

function validateIP(ip) {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!regex.test(ip)) return false
    return true;
}

function validatePort(port) {
    var portFormat = new RegExp('^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$');
    return portFormat.test(port);
}

function isValidLatitude(latitude) {
    if (typeof latitude !== 'number') {
        return false;
    }

    const latDegrees = Math.floor(Math.abs(latitude));
    const latMinutes = Math.floor((Math.abs(latitude) * 60) % 60);
    const latSeconds = (Math.abs(latitude) * 3600) % 60;

    return (latDegrees >= 0 && latDegrees <= 90) &&
        (latMinutes >= 0 && latMinutes <= 59) &&
        (latSeconds >= 0 && latSeconds <= 59);
}

function isValidLongitude(longitude) {
    // Longitude ranges from -180 to 180
    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
        return false;
    }
    return true;
}

function ipValidation() {
    const isTrue = validateIP(addJammerFormSelector.ipAddress.value)
    isTrue ? document.querySelector("#ipError").classList.add('hidden') : document.querySelector("#ipError").classList.remove("hidden");
}

function portValidation() {
    const isTrue = validatePort(addJammerFormSelector.ipPort.value)
    isTrue ? document.querySelector("#portError").classList.add("hidden") : document.querySelector("#portError").classList.remove("hidden");
}

function latValidation() {
    isValidLatitude(Number(addJammerFormSelector.lat.value)) ?
        document.querySelector("#latError").classList.add("hidden") : document.querySelector("#latError").classList.remove("hidden");
}

function lngValidation() {
    isValidLatitude(Number(addJammerFormSelector.lat.value)) ?
        document.querySelector("#lngError").classList.add("hidden") : document.querySelector("#lngError").classList.remove("hidden");
}

async function onBlockCLick(ev) {
    let blockId = ev.getAttribute("blockId");

    document.querySelector("#drawerTitle").innerHTML = `BLOCK ${blockId} - JAMMERS`;

    const get = await fetch(`/api/jammer/block?id=${blockId}`, {
        method: "GET", headers: {
            "Content-Type": "application/json",
        }
    });

    if (get.status === 200) {
        let { block } = await get.json();

        const jammersDivSelector = document.querySelector("#jammers-div");
        jammersDivSelector.innerHTML = '';

        block.forEach((el, idx) => {
            if (!el.status) blockStatus = false;
            jammersDivSelector.innerHTML += `<button class="p-4 grid grid-rows-2 text-black ${el.status ? "bg-green-500" : "bg-red-500"} border rounded" jammerId="${el.id}" block="${el.blockId}" title="${el.name}" ip="${el.ipAddress}" port="${el.ipPort}"
            onclick="jammerToggle(this)">
            <span class="font-bold ">J ${idx + 1}</span>
            <span class="text-sm shadow rounded-full">${String(el.name).toLocaleLowerCase()}</span>
            </button>`
        });

        toggleDrawer();
        return;
    }
    Toast.fire({ icon: "warning", title: "Something went wrong!" })
}

// async function onBlockLoad() {
//     const get = await fetch("/api/jammer", {
//         method: "GET", headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${localStorage.getItem("token")}`
//         }
//     });

//     let response = await get.json();
// if (get.status === 200) {
//     markerGroup.clearLayers();
//     response.jammers.forEach(el => {
//         let marker = L.marker([el.lat, el.lng], { icon: el.status ? onJammer : offJammer, jammerId: el.id })
//             .bindPopup(`<table class="text-lg font-bold text-center">
//                             <tr>
//                                 <td scope="col" class="px-3 py-1 text-right">Name</td>
//                                 <td scope="col" class="px-3 py-1 text-left">${el.name}</td>
//                             </tr>
//                             <tr>
//                                 <td scope="col" class="px-3 py-1 text-right">Block</td>
//                                 <td scope="col" class="px-3 py-1 text-left">${el.blockId}</td>
//                             </tr>
//                             <tr>
//                                 <td scope="col" class="px-3 py-1 text-right">IP</td>
//                                 <td scope="col" class="px-3 py-1 text-left">${el.ipAddress}</td>
//                             </tr>
//                             <tr>
//                                 <td scope="col" class="px-3 py-1 text-right">PORT</td>
//                                 <td scope="col" class="px-3 py-1 text-left">${el.ipPort}</td>
//                             </tr>
//                         </table>`)
//         markerGroup.addLayer(marker);
//     });

//     map.addLayer(markerGroup);
//     map.fitBounds(markerGroup.getBounds());

//         const blocksDivSelector = document.querySelector('#blocks-div');
//         blocksDivSelector.innerHTML = "";

//         const jammers = removeDuplicates(response.jammers);

//         let BlockStatus = true;
//         response.jammers.forEach((el) => !el.status ? BlockStatus = false : null);

//         jammers.forEach((el) => {
//             blocksDivSelector.innerHTML += `<button class="${BlockStatus ? "bg-green-500" : "bg-red-500"} border text-center font-bold text-2xl text-black p-6 rounded" onclick="onBlockCLick(this)" blockId="${el.blockId}" title="Jammer Block">B ${el.blockId}</button>`
//         });
//     } else {
//         Toast.fire({ icon: "error", title: response.message })
//     }
// }


async function onBlockLoad() {
    const blocksAPI = await fetch("/api/jammer/blocks", {
        method: "GET", headers: {
            'Content-Type': 'application/json'
        }
    });

    if (blocksAPI.status === 200) {
        const { payload } = await blocksAPI.json();

        const blocksDivSelector = document.querySelector('#blocks-div');
        blocksDivSelector.innerHTML = "";
        let BlockStatus = false

        payload.forEach((block, i) => {
            blocksDivSelector.innerHTML += `<button class="block-btn ${BlockStatus ? "bg-green-500" : "bg-red-500"} border text-center font-bold text-2xl text-black p-6 rounded" onclick="onBlockCLick(this)" blockId="${block.blockId}" title="Jammer Block">B ${block.blockId}</button>`
        });
        return;
    }
    Toast.fire({ icon: "error", title: "Something went wrong!" });

}

async function onJammerLoadOnMap(jammers) {
    const jammerAPI = await fetch("/api/jammer", {
        method: "GET", headers: {
            'Content-Type': 'application/json'
        }
    });

    if (jammerAPI.status === 200) {
        let { jammers } = await jammerAPI.json();
        markerGroup.clearLayers();
        jammers.forEach((el, i) => {
            markerGroup.addLayer(L.marker([el.lat, el.lng], { icon: el.status ? onJammer : offJammer, jammerId: el.id })
                .bindPopup(`<table class="text-lg font-bold text-center">
                            <tr>
                                <td scope="col" class="px-3 py-1 text-right">Name</td>
                                <td scope="col" class="px-3 py-1 text-left">${el.name}</td>
                            </tr>
                            <tr>
                                <td scope="col" class="px-3 py-1 text-right">Block</td>
                                <td scope="col" class="px-3 py-1 text-left">${el.blockId}</td>
                            </tr>
                            <tr>
                                <td scope="col" class="px-3 py-1 text-right">IP</td>
                                <td scope="col" class="px-3 py-1 text-left">${el.ipAddress}</td>
                            </tr>
                            <tr>
                                <td scope="col" class="px-3 py-1 text-right">PORT</td>
                                <td scope="col" class="px-3 py-1 text-left">${el.ipPort}</td>
                            </tr>
                        </table>`));
        });
        map.addLayer(markerGroup);
        map.fitBounds(markerGroup.getBounds());
        return;
    }
    Toast.fire({ icon: "error", title: "Something went wrong!" })
}

async function closeModal() {
    addJammerModalSelector.classList.add("hidden");
}

async function onFormSubmit(ev) {
    ev.preventDefault();
    const form = new FormData(ev.target);
    const formData = Object.fromEntries(form.entries());
    const port = await fetch("/api/jammer", {
        method: "POST", headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
    });
    const response = await port.json();
    if (port.status === 201) {
        Toast.fire({ icon: "success", title: response.message });
        addJammerFormSelector.reset();
    } else {
        console.error(response.err);
        Toast.fire({ icon: "warning", title: response.message });
    }
    await onBlockLoad();
    closeModal();
    console.log('model close')
}

async function initial() {
    onJammerLoadOnMap();
    await onBlockLoad();
    document.querySelectorAll(".block-btn").forEach(block => checkBlockStatusByid(block.getAttribute("blockId")))
    // setInterval(checkPing, 5000);
}

async function jammerToggle(ev) {
    let id = ev.getAttribute("jammerId");
    let ip = ev.getAttribute("ip");
    let port = ev.getAttribute("port");
    let name = ev.getAttribute("title");
    let block = ev.getAttribute("block")

    markerGroup.eachLayer(async (marker) => {
        if (marker.options.jammerId === Number(id)) {
            let currentStatus = (String(marker.options.icon.options.name).includes("off"))
            let onOffJammer = currentStatus ? await fetch(`/api/jammer-toggle?id=${id}&name=${name}&block=${block}&ip=${ip}&port=${port}&mode=1`, {
                method: "GET", headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            }) :
                await fetch(`/api/jammer-toggle?id=${id}&name=${name}&block=${block}&ip=${ip}&port=${port}&mode=0`, {
                    method: "GET", headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

            if (onOffJammer.status === 200) {
                let response = await onOffJammer.json();
                if (response.status) {
                    marker.setIcon(onJammer);
                    ev.classList.replace("bg-red-500", "bg-green-500")
                } else {
                    marker.setIcon(offJammer);
                    ev.classList.replace("bg-green-500", "bg-red-500")
                }
                checkBlockStatusByid(block);


            } else if (onOffJammer.status === 404) {
                Toast.fire({ icon: "info", title: response.message })
            }
        }
    })


}

async function checkBlockStatusByid(id) {
    let info = {
        current: true,
        change: function (state) { this.current = state }
    }

    const get = await fetch(`/api/jammer/block?id=${id}`, {
        method: "GET", headers: {
            "Content-Type": "application/json",
        }
    });

    if (get.status === 200) {
        let { block } = await get.json();
        block.forEach(jammer => (!jammer.status) ? info.change(false) : null);
        document.querySelectorAll('.block-btn').forEach(block => (block.getAttribute('blockid') === id) ? (info.current) ? block.classList.replace("bg-red-500", "bg-green-500") : block.classList.replace("bg-green-500", "bg-red-500") : null);
        return;
    }
}

async function checkPing() {
    const API = await fetch("/api/ping", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (API.status === 200) {
        const response = await API.json();
        console.log(response.payload)
    }
}

initial();

document.querySelector("#drawer-close").addEventListener("click", toggleDrawer);
closeJammerSelector.addEventListener("click", closeModal)
addJammerFormSelector.addEventListener("submit", onFormSubmit);

// validation event.
addJammerFormSelector.ipAddress.addEventListener("input", ipValidation)
addJammerFormSelector.ipPort.addEventListener("input", portValidation)
addJammerFormSelector.lat.addEventListener("input", latValidation)
addJammerFormSelector.lng.addEventListener("input", lngValidation)



