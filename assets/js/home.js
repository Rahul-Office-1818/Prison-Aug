const map = L.map('map', {
    zoom: 16,
    doubleClickZoom: false,
    center: [30.291904, 74.981839],
    layers: L.tileLayer('http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', { maxZoom: 19, attribution: 'Prison Jammer' })
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
            jammersDivSelector.innerHTML += `<button class="h-[11vh] p-4 grid grid-rows-2 text-black ${el.status ? "bg-green-500" : "bg-red-500"} border rounded" onclick="jammerToggle(this)" data-id='${el.id}' data-block-id='${el.blockId}' data-address='${el.ipAddress}' data-port='${el.ipPort}' title='${el.name}' data-name='${el.name}'  data-status='${el.status}'>
            <span class="font-bold ">J ${idx + 1}</span>
            <span class="text-sm shadow rounded-full">${String(el.name).toLocaleLowerCase()}</span>
            </button>`
        });

        jammersDivSelector.querySelectorAll("button")
        .forEach(btn => console.log(btn));

        toggleDrawer();

        const pingInfo = localStorage.getItem("ping");
        if (pingInfo) {
            const payload = JSON.parse(pingInfo);
            document.querySelector('#jammers-div')
                .querySelectorAll('button')
                .forEach(item => {
                    const jammerId = item.getAttribute("data-id");
                    const info = payload.find(el => String(el.jammerId) === jammerId);
                    if (info.alive) return;
                    removeAllClasses(item, "bg-");
                    if (!info.alive) item.classList.add('bg-yellow-500');
                })
        }
        return;
    }
    Toast.fire({ icon: "warning", title: "Something went wrong!" })
}

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
        let BlockStatus = false;

        payload.forEach((block, i) => {
            blocksDivSelector.innerHTML += `<button class="block-btn relative ${BlockStatus ? "bg-green-500" : "bg-red-500"} border text-center font-bold text-2xl text-black p-6 h-[11vh] rounded" onclick="onBlockCLick(this)" blockId="${block.blockId}" data-status='${BlockStatus}' title="Jammer Block">B ${block.blockId}</button>`
        });
        return;
    }
    Toast.fire({ icon: "error", title: "Something went wrong!" });

}

async function onJammerLoadOnMap(jammers) {
    const jammerAPI = await fetch("/api/jammer", {
        method: "GET", headers: {
            'Content-Type': 'application/json',
        }
    });

    if (jammerAPI.status === 200) {
        let { jammers } = await jammerAPI.json();
        markerGroup.clearLayers();
        jammers.forEach((el, i) => {
            markerGroup.addLayer(L.marker([el.lat, el.lng], { icon: el.status ? onJammer : offJammer, id: el.id, status: el.status })
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
    onJammerLoadOnMap();
    await onBlockLoad();
    document.querySelectorAll(".block-btn").forEach(block => checkBlockStatusByid(block.getAttribute("blockId")));
    closeModal();
}

async function initial() {
    onJammerLoadOnMap();
    await onBlockLoad();
    document.querySelectorAll(".block-btn").forEach(block => checkBlockStatusByid(block.getAttribute("blockId")));
    setInterval(checkPingConnection, 4000);
}

async function checkAllBlockStatus() {
    document.querySelectorAll(".block-btn")
        .forEach(async (item) => await checkBlockStatusByid(item.getAttribute("blockId")));
    return;
}

async function jammerToggle(ev) {
    const info = {
        id: ev.getAttribute('data-id'),
        block: ev.getAttribute('data-block-id'),
        name: ev.getAttribute('data-name'),
        currentstatus: ev.getAttribute('data-status'),
        address: ev.getAttribute('data-address'),
        port: ev.getAttribute('data-port'),
    }

    const query = new URLSearchParams(info)

    const service = await fetch('/api/automation/jammer?' + query, { method: "GET", headers: { "Content-Type": "application/json", } });
    if (service.status === 200) {
        const { payload } = await service.json();
        ev.classList.remove('bg-green-500', 'bg-red-500');
        ev.setAttribute('data-status', payload);

        (payload) ?
            ev.classList.add('bg-green-500') :
            ev.classList.add('bg-red-500');

        markerGroup.eachLayer(marker => (marker.options.id === Number(info.id)) ?  marker.setIcon(payload ? onJammer : offJammer): null)
        Toast.fire({ icon: "success", title: `Jammer ${payload ? "on" : "off"}` })
    } else {
        const { payload } = await service.json();
        Toast.fire({ icon: "error", title: payload.message });
    }
}

function removeAllClasses(domSelector, prefix) {
    [...domSelector.classList].forEach(value => value.startsWith(prefix) ? domSelector.classList.remove(value) : null);
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
        document.querySelectorAll('.block-btn')
            .forEach(item => {
                if (item.getAttribute('blockId') === id) {
                    removeAllClasses(item, "bg-");
                    (info.current) ? item.classList.add('bg-green-500') : item.classList.add("bg-red-500");
                }
            })
        return;
    }
}

async function checkPingConnection() {
    const service = await fetch("/api/ping/all");

    if (service.status === 200) {
        const { payload } = await service.json();
        localStorage.setItem("ping", JSON.stringify(payload));

        document.querySelectorAll(".block-btn").forEach(async (blockSelector) => {
            let blockId = blockSelector.getAttribute('blockId');
            let isDivExists = blockSelector.querySelector("div");

            let info = payload.filter(item => String(item.blockId) === blockId);
            let isConnection = info.some(item => item.alive === false);

            if (!!isDivExists) blockSelector.removeChild(isDivExists);

            if (isConnection) {
                let cout = 0;
                const badge = document.createElement('div');

                [...blockSelector.classList].forEach(el => el.startsWith('bg-') ? blockSelector.classList.remove(el) : null);

                info.forEach(item => item.alive ? null : cout++);
                blockSelector.classList.add('bg-yellow-500');
                badge.classList.add('upper-badge');
                badge.innerText = cout;
                blockSelector.appendChild(badge);
                jammerToast.fire({ icon: "error", title: 'Jammer connection lost!' });
                return;
            }
            await checkBlockStatusByid(blockId);
            return;
        });

    }

}

function removeDublicateBlocks(value) {
    let valueInSet = new Set(value);
    return [...valueInSet].sort();

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