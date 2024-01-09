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
    await onLogsLoad();
}

async function filterByDateTime(ev) {
    let start = document.querySelector("#startdate");
    let end = document.querySelector("#enddate");
    let logsSelector = document.querySelectorAll("#logs-table tbody tr");
    if (!start.value) { Toast.fire({ icon: "info", title: "PLEASE FILL THE START DATE!" }); return; }
    if (!end.value) { Toast.fire({ icon: "info", title: "PLEASE FILL THE END DATE!" }); return; }
    start = new Date(start.value);
    end = new Date(end.value);
    logsSelector.forEach(el => {
        let td = el.querySelectorAll("td")[4];
        if (td) {
            let tdDate = new Date(td.textContent || td.innerText);
            console.log(tdDate, start, end);

            (tdDate >= start && tdDate <= end)
                ? el.style.display = ""
                : el.style.display = "none";
        }
    })

}




initial();

document.querySelector("#date-filter").addEventListener("click", filterByDateTime)