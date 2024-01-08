const logsTableBodySelector = document.querySelector("#logs-table tbody");

async function onLogsLoad() {
    const get = await fetch("/api/logs", {
        method: "GET", headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

    const response = await get.json();
    if (get.status === 200) {
        response.logs.forEach((el, idx) => {
            logsTableBodySelector.innerHTML += `<tr class="text-center text-xl divide-x divide-gray-200">
                                                    <td scope="col" class="py-2">${idx + 1}</td>
                                                    <td scope="col" class="py-2">${el.jammerName}</td>
                                                    <td scope="col" class="py-2">${el.blockId}</td>
                                                    <td scope="col" class="py-2">${el.status ? "ON" : "OFF"}</td>
                                                    <td scope="col" class="py-2">${new Date(el.createdAt).toLocaleString("in").replace(",", "").replaceAll(".", ":",  2)}</td>
                                                </tr>`
        })
        return;
    }
    Toast.fire({ icon: "warning", title: response.message });
}

async function initial() {
    await onLogsLoad();
}






initial();