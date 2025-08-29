const pflogsTableBodySelector = document.querySelector(
  "#powerfailure-logs-table tbody"
);


function renderPFTable(payload) {
  pflogsTableBodySelector.innerHTML = "";
  payload.forEach((el, idx) => {
    const d = new Date(el.createdAt);
    const formattedDate = `${d.getDate().toString().padStart(2, "0")}/${
      (d.getMonth() + 1).toString().padStart(2, "0")
    }/${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${
      d.getMinutes().toString().padStart(2, "0")
    }:${d.getSeconds().toString().padStart(2, "0")}`;

    const tr = document.createElement("tr");
    tr.classList.add("text-center", "text-xl", "divide-gray-200");
    tr.setAttribute("status", el.status);
    tr.setAttribute("blockId", el.blockId);

    tr.innerHTML = `
      <td scope="col" class="py-2">${idx + 1}</td>
      <td scope="col" class="py-2">${el.jammer_id}</td>
      <td scope="col" class="py-2">${el.jammer_name}</td>
      <td scope="col" class="py-2">${el.status ? "Jammer ON" : "Jammer Connectivity Lost"}</td>
      <td scope="col" class="py-2">${formatDateTime(el.FROM)}</td>
      <td scope="col" class="py-2">${formatDateTime(el.To)}</td>
      <td scope="col" class="py-2">${el.Duration}</td>
    `;

    pflogsTableBodySelector.appendChild(tr);
  });
}




async function onPFLogsLoad() {
  let start = document.querySelector("#startdate").value;
  let end = document.querySelector("#enddate").value;

  try {
    const response = await fetch(`/api/pflogs?start=${start}&end=${end}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const { payload } = await response.json();
      renderPFTable(payload);
    } else {
      const { message } = await response.json();
      Toast.fire({ icon: "warning", title: message });
    }
  } catch (error) {
    console.error("Error fetching filtered PF logs:", error);
    Toast.fire({ icon: "error", title: "Failed to apply date filter." });
  }
}

onPFLogsLoad();


async function onPFLogsLoadclearFilter() {
  document.querySelector("#startdate").value = "";
  document.querySelector("#enddate").value = "";

  try {
    const response = await fetch("/api/pflogs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const { payload } = await response.json();
      renderPFTable(payload);
      Toast.fire({ icon: "success", title: "Date filter removed and data reloaded" });
    } else {
      const { message } = await response.json();
      Toast.fire({ icon: "warning", title: message });
    }
  } catch (error) {
    console.error("Error clearing PF logs filter:", error);
    Toast.fire({ icon: "error", title: "Something went wrong loading the logs." });
  }
}





async function onLogsReload(ev) {
  // document.querySelector('#statusOptions').querySelectorAll("option")[0].selected = true;
  // document.querySelector('#blockOptions').querySelectorAll("option")[0].selected = true;
  pflogsTableBodySelector
    .querySelectorAll("tr")
    .forEach((row) => (row.style.display = ""));
  onPFLogsLoad();
  Toast.fire({ icon: "success", title: "Filter Applied Successfully" });
}

document
  .querySelector("#pflogs-reload")
  .addEventListener("click", onLogsReload);
document
  .querySelector("#pfdate-filter")
  .addEventListener("click", onLogsReload);

document.querySelector("#date-filter-remove-pf").addEventListener("click", onPFLogsLoadclearFilter);

// document.querySelector("#powerfailure-logs").addEventListener("click", onPFLogsLoad);
// document.querySelector("#all").addEventListener("change", onPFLogsLoad);
