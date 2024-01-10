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
        logsTableBodySelector.innerHTML = "";
        response.logs.forEach((el, idx) => {
            let d = new Date(el.dateTime);
            let datetime = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
            logsTableBodySelector.innerHTML += `<tr class="text-center text-xl divide-x divide-gray-200" status="${el.status}">
                                                    <td scope="col" class="py-2">${idx + 1}</td>
                                                    <td scope="col" class="py-2">${el.jammerName}</td>
                                                    <td scope="col" class="py-2">Block ${el.blockId}</td>
                                                    <td scope="col" class="py-2">${el.status ? "Jammer ON" : "Jammer OFF"}</td>
                                                    <td scope="col" class="py-2" datetime="${el.dateTime}">${datetime}</td>
                                                </tr>`
        })
        return;
    }
    Toast.fire({ icon: "warning", title: response.message });
}

async function initial() {
    document.querySelectorAll("#status option")[0].selected = true;
    await onLogsLoad();
}

async function filterByDateTime(ev) {
    document.querySelectorAll("#status option")[0].selected = true;

    let start = document.querySelector("#startdate");
    let end = document.querySelector("#enddate");
    
    if (!start.value) { Toast.fire({ icon: "info", title: "Please fill start date!" }); return; }
    if (!end.value) { Toast.fire({ icon: "info", title: "Please fill end date!" }); return; }

    let startDate = new Date(start.value).getTime();
    let endDate = new Date(end.value).getTime(); 
    let i = 1;
    logsTableBodySelector.querySelectorAll('tr').forEach(row => {
        let itemDate = new Date(row.querySelectorAll('td')[4].getAttribute("datetime")).getTime();
        if(itemDate >= startDate && itemDate <= endDate){
            row.style.display = "";
            row.querySelectorAll("td")[0].innerHTML = i++;
            return;
        }
        row.style.display = "none";
    })
    Toast.fire({ icon: "success", title: "Filter apply successfully!" });

}

async function onStatusChange(ev) {
    let options = document.querySelectorAll("#status option");

    options.forEach((op) => {
        if (op.selected && op.value) {
            let i = 1;
            logsTableBodySelector.querySelectorAll("tr").forEach((row) => {
                if(row.getAttribute("status") ===  op.value) {
                    row.style.display = "";
                    row.querySelectorAll("td")[0].innerHTML = i++;
                    return;
                }
                row.style.display = "none";
            })
        }
    });
    Toast.fire({ icon: "success", title: "Filter apply successfully!" });
}

async function onLogsReload(ev){
    document.querySelectorAll("#status option")[0].selected = true;
    onLogsLoad();
    Toast.fire({ icon: "success", title: "Reload jammer logs!" });
}


initial();

document.querySelector("#date-filter").addEventListener("click", filterByDateTime);
document.querySelector("#status").addEventListener("change", onStatusChange);
document.querySelector("#logs-reload").addEventListener("click", onLogsReload)