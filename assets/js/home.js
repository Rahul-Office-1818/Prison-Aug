const map = L.map('map', {
    doubleClickZoom: false,
    center: [28.617224, 77.101703],
    zoom: 16
})
const markerGroup = L.markerClusterGroup();

const jammerIcon = L.icon({
    iconUrl: './assets/icon/project-icon.png',
    iconSize: [60, 80],
    iconAnchor: [60, 80],
    className: 'jammer-icon',
});

// DOM Selector :- 
const drawerSelector = document.querySelector("#drawer")


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
    maxZoom: 20,
    minZoom: 15,
    attribution: 'Prison Jammer'
}).addTo(map);

function onMapClick(ev) {
    console.log(ev.latlng)

}
function onDblClick(ev){
    let latlng = ev.latlng;
    console.log(ev.latlng)

}

map.on("click", onMapClick);
map.on("dblclick", onDblClick)


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
            jammersDivSelector.innerHTML += `<button class="bg-green-500 border text-center font-bold text-xl text-black p-6 rounded hover:bg-yellow-200" jammerId="${el.id}" title="${el.name}">J ${idx + 1}</button>`
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
        map.removeLayer(markerGroup);
        response.jammers.forEach(el => {
            let popUpContent = `<div class="grid grid-cols-2 gap-2 w-10">
                                    <div>Name : </div>
                                    <div>${el.name}</div>
                                    <div>Ip : </div>
                                    <div>${el.ipAddress}</div>
                                    <div>lat :</div>
                                    <div>${el.lat.fixed(4)}</div>
                                    <div>lng : </div>
                                    <div>${el.lng.fixed(4)}</div>
                                </div>`
            markerGroup.addLayer(L.marker([el.lat, el.lng], { icon: jammerIcon, }).bindPopup(popUpContent))
        });
        map.addLayer(markerGroup);

        const jammers = removeDuplicates(response.jammers);
        const blocksDivSelector = document.querySelector('#blocks-div');
        blocksDivSelector.innerHTML = "";
        jammers.forEach((el) => {
            blocksDivSelector.innerHTML += `<button class="bg-green-500 border text-center font-bold text-2xl text-black p-6 rounded hover:bg-yellow-200" onclick="onBlockCLick(this)" blockId="${el.blockId}" title="Jammer Block">B ${el.blockId}</button>`
        })
    } else {
        Toast.fire({ icon: "warning", title: response.message })
    }
}

async function initial() {
    await onBlockLoad();
}


initial();

document.querySelector("#drawer-close").addEventListener("click", drawerClose);



