const logsTableBodySelector = document.querySelector("#logs-table tbody");


async function onLogsLoad() {
    const get = await fetch("/api/logs", {
        method: "GET", headers: {
            "Content-Type": "application/json",
        }
    });

    if (get.status === 200) {
        let { payload } = await get.json();
        logsTableBodySelector.innerHTML = "";
        payload.forEach((el, idx) => {
            let d = new Date(el.dateTime);
            let datetime = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`

            const tr = document.createElement('tr');
            tr.classList.add("text-center", "text-xl", "divide-x", "divide-gray-200");
            tr.setAttribute("status", el.status);
            tr.setAttribute("blockId", el.blockId);
            tr.innerHTML = `<td scope="col" class="py-2">${idx + 1}</td>
            <td scope="col" class="py-2">${el.jammerName}</td>
            <td scope="col" class="py-2" >Block ${el.blockId}</td>
            <td scope="col" class="py-2">${el.status ? "Jammer ON" : "Jammer OFF"}</td>
            <td scope="col" class="py-2" datetime="${el.dateTime}">${datetime}</td>`
            logsTableBodySelector.appendChild(tr);
        });


        return;
    }
    Toast.fire({ icon: "warning", title: response.message });
}

async function initial() {
    onLogsLoad();
    blocks();
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
        if (itemDate >= startDate && itemDate <= endDate) {
            row.style.display = "";
            row.querySelectorAll("td")[0].innerHTML = i++;
            return;
        }
        row.style.display = "none";
    })
    Toast.fire({ icon: "success", title: "Filter apply successfully!" });

}

async function onStatusChange() {
    document.querySelector('#blockOptions').querySelectorAll("option")[0].selected = true;
    this.querySelectorAll("option").forEach(option => {
        if(option.selected){
            let selectedValue = option.value;
            let iter = 1;
            logsTableBodySelector.querySelectorAll("tr").forEach(row => {
                if(row.getAttribute('status') === selectedValue){
                    row.querySelectorAll('td')[0].innerHTML = iter++;
                    row.style.display = "";
                    return;
                }
                row.style.display = "none";
            });
        }
    });
}

async function onLogsReload(ev) {
    document.querySelector('#statusOptions').querySelectorAll("option")[0].selected = true;
    document.querySelector('#blockOptions').querySelectorAll("option")[0].selected = true;
    logsTableBodySelector.querySelectorAll('tr').forEach(row => row.style.display = "");
    Toast.fire({ icon: "success", title: "Reload jammer logs!" });
}

async function blocks() {
    const api = await fetch("/api/jammer/blocks", { method: "GET", headers: { "Content-Type": "application/json" } });
    if (api.status === 200) {
        let { payload } = await api.json();
        let blockOptions = document.querySelector("#blockOptions")
        blockOptions.innerHTML = '<option value="0" selected disabled>select</option>';
        payload.forEach((el, i) => blockOptions.innerHTML += `<option value="${el.blockId}" >Block ${el.blockId}</option>`);
    }
}

function onBlockOptionChange() {
    document.querySelector('#statusOptions').querySelectorAll("option")[0].selected = true;
    this.querySelectorAll("option").forEach(option => {
        if (option.selected) {
            let selectedValue = option.value;
            let iter = 1;
            logsTableBodySelector.querySelectorAll('tr').forEach(row => {
                if (row.getAttribute('blockId') === selectedValue){
                    row.querySelectorAll('td')[0].innerHTML = iter++;
                    row.style.display = "";
                    return;
                }
                row.style.display = "none";
            })
        }
    })
}


initial();

document.querySelector("#date-filter").addEventListener("click", filterByDateTime);
document.querySelector("#logs-reload").addEventListener("click", onLogsReload);
document.querySelector("#all").addEventListener("click", onLogsReload);

document.querySelector("#statusOptions").addEventListener("change", onStatusChange);
document.querySelector("#blockOptions").addEventListener("change", onBlockOptionChange)