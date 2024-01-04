const modalDivSelector = document.querySelector("#static-modal");
const modalForm = document.querySelector("#jammer-form");
const modalTitleSelector = document.querySelector("#model-title");
const jammerTableBodySelector = document.querySelector("#jammer-table tbody");

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
    const isTrue = validateIP(modalForm.ipAddress.value)
    isTrue ? document.querySelector("#ipError").classList.add('hidden') : document.querySelector("#ipError").classList.remove("hidden");
}

function portValidation() {
    const isTrue = validatePort(modalForm.ipPort.value)
    isTrue ? document.querySelector("#portError").classList.add("hidden") : document.querySelector("#portError").classList.remove("hidden");
}

function latValidation() {
    isValidLatitude(Number(modalForm.lat.value)) ?
        document.querySelector("#latError").classList.add("hidden") : document.querySelector("#latError").classList.remove("hidden");
}

function lngValidation() {
    isValidLatitude(Number(modalForm.lat.value)) ?
        document.querySelector("#lngError").classList.add("hidden") : document.querySelector("#lngError").classList.remove("hidden");
}



async function onAddJammer(ev) {
    modalTitleSelector.innerHTML = "Add Jammer";
    if (modalDivSelector.classList.contains("hidden")) modalDivSelector.classList.remove("hidden");
}

async function onEditJammer(id) {
    modalTitleSelector.innerHTML = "Edit Jammer";
    modalTitleSelector.setAttribute("jammerId", id);
    const get = await fetch(`/api/jammer?id=${id}`, {
        method: "GET", headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });
    const response = await get.json();
    if (get.status === 200) {
        const jammer = response.jammer;
        modalForm.jammerId.value = jammer.id;
        modalForm.name.value = jammer.name;
        modalForm.blockId.value = jammer.blockId;
        modalForm.ipAddress.value = jammer.ipAddress;
        modalForm.ipPort.value = jammer.ipPort;
        modalForm.lat.value = jammer.lat;
        modalForm.lng.value = jammer.lng;
        if (modalDivSelector.classList.contains("hidden")) modalDivSelector.classList.remove("hidden");
    }
    else if (get.status === 404) {
        Toast.fire({ icon: "warning", title: response.message });
    }
}

async function onDelJammer(id) {
    const permission = await Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    })

    if (permission.isConfirmed) {
        const del = await fetch(`/api/jammer/${id}`, {
            method: "DELETE", headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const response = await del.json();
        if (del.status === 200) {
            Toast.fire({ icon: "success", title: response.message });
            await onJammerLoad();
            return;
        } else {
            Toast.fire({ icon: "error", title: response.message });
            return;
        }
    }


}

async function onJammerLoad() {
    const get = await fetch("/api/jammer", {
        method: "GET", headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

    const response = await get.json();
    if (get.status === 200) {
        jammerTableBodySelector.innerHTML = '';
        response.jammers.forEach((el, idx) => {
            jammerTableBodySelector.innerHTML += `
            <tr class="divide-x text-center hover:bg-sky-600 hover:divide-y">
                <td scope="col" class="text-lg py-2">${idx + 1}</td>
                <td scope="col" class="text-lg py-2">${el.name}</td>
                <td scope="col" class="text-lg py-2">Block ${el.blockId}</td>
                <td scope="col" class="text-lg py-2">${el.ipAddress}</td>
                <td scope="col" class="text-lg py-2">${el.ipPort}</td>
                <td scope="col" class="text-lg py-2">${Number(el.lat).toFixed(6)}</td>
                <td scope="col" class="text-lg py-2">${Number(el.lng).toFixed(6)}</td>
                <td scope="col" class="text-lg py-2 flex justify-center ">
                    <button type="button" name="edit-jammer-btn" title="edit jammer" class="bg-green-700 py-2 px-3 me-1 rounded-md hover:bg-gray-700 edit-jammer" onclick="onEditJammer('${el.id}')">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button type="button" name="delete-jammer-btn" title="Delete jammer" class="bg-red-700 py-2 px-3 ml-1 rounded-md hover:bg-gray-700 delete-jammer" onclick="onDelJammer('${el.id}')"> 
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`
        })
    } else {
        Toast.fire({ icon: "warning", title: response.message });
    }
}

async function onFormSubmit(ev) {
    ev.preventDefault();
    const form = new FormData(ev.target);
    const formData = Object.fromEntries(form.entries());

    const mode = modalTitleSelector.innerHTML;

    if (mode.split(" ")[0].trim().toLowerCase() === "add") {
        const post = await fetch("/api/jammer", {
            method: "POST", body: JSON.stringify(formData), headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        const response = await post.json();
        if (post.status === 201) {
            Toast.fire({ icon: "success", title: response.message });
            modalDivSelector.classList.add("hidden");
            modalForm.reset();
            await onJammerLoad();
        } else {
            Toast.fire({ icon: "warning", title: response.message });
        }
    } else if (mode.split(" ")[0].trim().toLowerCase() === "edit") {
        const id = modalForm.jammerId.value;
        const put = await fetch(`/api/jammer/${id}`, {
            method: "PUT", body: JSON.stringify(formData), headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        const response = await put.json();
        if (put.status === 200) {
            Toast.fire({ icon: "success", title: response.message });
            modalDivSelector.classList.add("hidden");
            modalForm.reset();
            await onJammerLoad();
        } else {
            Toast.fire({ icon: "warning", title: response.message });
        }
    }

}




async function initial() {
    await onJammerLoad();
}

initial();

document.querySelector("#add-jammer").addEventListener("click", onAddJammer)
document.querySelector("#modalClose").addEventListener('click', () => { modalForm.reset(); modalDivSelector.classList.add("hidden") });
document.querySelector("#jammer-form").addEventListener("submit", onFormSubmit)

// validation event.
modalForm.ipAddress.addEventListener("input", ipValidation)
modalForm.ipPort.addEventListener("input", portValidation)
modalForm.lat.addEventListener("input", latValidation)
modalForm.lng.addEventListener("input", lngValidation)