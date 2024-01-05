const map = L.map('map', {
    doubleClickZoom: false,
    center: [28.617224, 77.101703],
    zoom: 16,
})
const markerGroup = L.markerClusterGroup({
    chunkedLoading: true,
});

const onJammer = L.icon({
    iconUrl: './assets/icon/on.png',
    iconSize: [90, 90],
    iconAnchor: [50, 60],
    className: 'jammer-icon',
});
const offJammer = L.icon({
    iconUrl: './assets/icon/off.png',
    iconSize: [90, 90],
    iconAnchor: [50, 60],
    className: 'jammer-icon',
});

// DOM Selector :- 
const drawerSelector = document.querySelector("#drawer");
const addJammerModalSelector = document.querySelector("#static-modal");
const closeJammerSelector = document.querySelector("#modalClose");
const addJammerFormSelector = document.querySelector("#jammer-form");

function removeDuplicates(arr) {
    let outputArr = new Array();
    let uniqueObj = {};
    for (let i in arr) {
        objTitle = arr[i]["blockId"];
        uniqueObj[objTitle] = arr[i];
    }
    for (let i in uniqueObj) {
        outputArr.push(uniqueObj[i]);
    }
    return outputArr;
}

L.tileLayer('http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 22,
    minZoom: 15,
    attribution: 'Prison Jammer'
}).addTo(map);

function onMapClick(ev) {
    // console.log(ev.latlng)

}
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

map.on("click", onMapClick);
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
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });
    const response = await get.json();
    if (get.status === 200) {
        const jammersDivSelector = document.querySelector("#jammers-div");
        jammersDivSelector.innerHTML = '';
        response.block.forEach((el, idx) => {
            jammersDivSelector.innerHTML += `<button class="bg-red-500 border text-center font-bold text-xl text-black p-6 rounded" jammerId="${el.id}" title="${el.name}" onclick="jammerToggle(this)">J ${idx + 1}</button>`
        });
    } else {
        Toast.fire({ icon: "warning", title: response.message })
    }
    drawerOpen();

}

async function drawerOpen() {
    drawerSelector.classList.remove("hidden");
}

async function drawerClose() {
    console.log('im close')
    drawerSelector.classList.add("hidden");
}

async function onBlockLoad() {
    const get = await fetch("/api/jammer", {
        method: "GET", headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

    let response = await get.json();
    if (get.status === 200) {
        markerGroup.clearLayers();
        response.jammers.forEach(el => {
            let marker = L.marker([el.lat, el.lng], { icon: offJammer, jammerId: el.id })
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
                            </table>`)

            markerGroup.addLayer(marker)
        });
        map.addLayer(markerGroup);
        map.fitBounds(markerGroup.getBounds());

        const blocksDivSelector = document.querySelector('#blocks-div');
        blocksDivSelector.innerHTML = "";
        if (response.jammers.length <= 10) {
            response.jammers.forEach(async (el, idx) => {
                
                blocksDivSelector.innerHTML += `<button class="bg-red-500 border text-center font-bold text-xl text-black p-6 rounded" jammerId="${el.id}" title="${el.name}" ip="${el.ipAddress}" port="${el.ipPort}"
                 onclick="jammerToggle(this)">J ${idx + 1}</button>`
            })
            return;
        }

        const jammers = removeDuplicates(response.jammers);


        jammers.forEach((el) => {
            blocksDivSelector.innerHTML += `<button class="bg-red-500 border text-center font-bold text-2xl text-black p-6 rounded" onclick="onBlockCLick(this)" blockId="${el.blockId}" title="Jammer Block">B ${el.blockId}</button>`
        })
    } else {
        Toast.fire({ icon: "warning", title: response.message })
    }
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
    await onBlockLoad();
}

async function jammerToggle(ev) {
    let id = ev.getAttribute("jammerId");


    markerGroup.eachLayer(marker => {
        if (marker.options.jammerId === Number(id)) {
            marker.setIcon(onJammer);
        } else {
            marker.setIcon(offJammer);
        }
    })
}

initial();

document.querySelector("#drawer-close").addEventListener("click", drawerClose);
closeJammerSelector.addEventListener("click", closeModal)
addJammerFormSelector.addEventListener("submit", onFormSubmit);

// validation event.
addJammerFormSelector.ipAddress.addEventListener("input", ipValidation)
addJammerFormSelector.ipPort.addEventListener("input", portValidation)
addJammerFormSelector.lat.addEventListener("input", latValidation)
addJammerFormSelector.lng.addEventListener("input", lngValidation)



