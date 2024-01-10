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
            logsTableBodySelector.innerHTML += `<tr class="text-center text-xl divide-x divide-gray-200" status="${el.status}">
                                                    <td scope="col" class="py-2">${idx + 1}</td>
                                                    <td scope="col" class="py-2">${el.jammerName}</td>
                                                    <td scope="col" class="py-2">Block ${el.blockId}</td>
                                                    <td scope="col" class="py-2">${el.status ? "Jammer ON" : "Jammer OFF"}</td>
                                                    <td scope="col" class="py-2">${new Date(el.createdAt).toLocaleString("in").replace(",", "").replaceAll(".", ":", 2)}</td>
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
    
    if (!start.value) { Toast.fire({ icon: "info", title: "PLEASE FILL THE START DATE!" }); return; }
    if (!end.value) { Toast.fire({ icon: "info", title: "PLEASE FILL THE END DATE!" }); return; }

    start = new Date(start.value);
    end = new Date(end.value);

    let i = 1;
    
    logsTableBodySelector.querySelectorAll("tr").forEach(row => {
        let itemDate = new Date(row.querySelectorAll('td')[4].innerText)
        console.log(`item ${itemDate.getTime()} | start : ${start.getTime()} | end : ${end.getTime()} condition ${itemDate.getTime() >= start.getTime()}`);
        
    })
   

}

async function onStatusChange(ev) {
    let options = document.querySelectorAll("#status option");

    options.forEach((op) => {
        if (op.selected && op.value) {
            let i = 1;
            logsTableBodySelector.querySelectorAll("tr").forEach((row) => {
                if(row.getAttribute("status") ===  op.value) {
                    row.style.display = "";
                    row.querySelectorAll("td")[0].innerHTML = i;
                    i++;
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