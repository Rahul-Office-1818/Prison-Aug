const logsTableBodySelector = document.querySelector("#logs-table tbody");

document.querySelector("#date-filter").addEventListener("click", onLogsLoad);
document.querySelector("#logs-reload").addEventListener("click", onLogsReload);
document.querySelector("#date-filter-remove").addEventListener("click", onLogsLoadWithoutDateFilter);
document.querySelector("#statusOptions").addEventListener("change", onStatusChange);
document.querySelector("#blockOptions").addEventListener("change", onBlockOptionChange);

async function initial() {
  await onLogsLoad();
  await blocks();
}
initial();


async function onLogsLoad() {
  let start = document.querySelector("#startdate").value;
  let end = document.querySelector("#enddate").value;
  let selectedBlock = document.querySelector("#blockOptions").value;

  try {
    const response = await fetch(`/api/logs?start=${start}&end=${end}&blockId=${selectedBlock}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      const { payload } = await response.json();
      renderLogsTable(payload);
    } else {
      const { message } = await response.json();
      Toast.fire({ icon: "warning", title: message });
    }
  } catch (err) {
    console.error(err);
    Toast.fire({ icon: "error", title: "Failed to fetch logs" });
  }
}


async function onLogsLoadWithoutDateFilter() {
  document.querySelector("#startdate").value = "";
  document.querySelector("#enddate").value = "";
  let selectedBlock = document.querySelector("#blockOptions").value;

  try {
    const url = selectedBlock ? `/api/logs?blockId=${selectedBlock}` : `/api/logs`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      const { payload } = await response.json();
      renderLogsTable(payload);
      Toast.fire({ icon: "success", title: "Date filter removed!" });
    } else {
      const { message } = await response.json();
      Toast.fire({ icon: "warning", title: message });
    }
  } catch (err) {
    console.error(err);
    Toast.fire({ icon: "error", title: "Failed to remove filter" });
  }
}


function renderLogsTable(payload) {
  logsTableBodySelector.innerHTML = "";

 
  const groupedLogs = {};
  payload.forEach((log) => {
    const key = `${log.jammerId}-${log.jammerName}-${log.ipAddress}-${log.ipPort}`;
    if (!groupedLogs[key]) groupedLogs[key] = [];
    groupedLogs[key].push(log);
  });

  const offDurationMap = {};
  for (const key in groupedLogs) {
    const logs = groupedLogs[key];
    logs.sort((a, b) => new Date(a.jammer_on) - new Date(b.jammer_on));

    for (let i = 1; i < logs.length; i++) {
      const prev = logs[i - 1];
      const curr = logs[i];

      const prevOff = new Date(prev.jammer_off);
      const currOn = new Date(curr.jammer_on);
      const diffMs = currOn - prevOff;

      offDurationMap[curr.id] = !isNaN(diffMs) && diffMs > 0 ? formatDurationMs(diffMs) : "--";
    }

    const firstId = logs[0]?.id;
    if (firstId) offDurationMap[firstId] = "New Jammer Added";
  }

  payload.forEach((el, idx) => {
    const d = new Date(el.dateTime);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const seconds = d.getSeconds().toString().padStart(2, "0");
    const date = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    const datetime = `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    const StatTime = `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    const offDuration = offDurationMap[el.id] || "--";

    const tr = document.createElement("tr");
    tr.classList.add("text-center", "text-xl", "divide-gray-200");
    tr.setAttribute("status", el.status);
    tr.setAttribute("blockId", el.blockId);

    tr.innerHTML = `
      <td class="py-2">${idx + 1}</td>
      <td class="py-2">${el.jammerName}</td>
      <td class="py-2">Block ${el.blockId}</td>
      <td class="py-2" datetime="${StatTime}">${formatDateTime(el.jammer_on)}</td>
      <td class="py-2">${safeFormatDateTime(el.jammer_off)}</td>
      <td class="py-2">${el.diffrence}</td>
      <td class="py-2">${offDuration}</td>
    `;
    logsTableBodySelector.appendChild(tr);
  });
}


function formatDurationMs(ms) {
  if (isNaN(ms) || ms < 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let result = "";
  if (days > 0) result += `${days}d `;
  if (hours > 0 || result) result += `${hours.toString().padStart(2, "0")}h `;
  result += `${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
  return result.trim();
}


function safeFormatDateTime(value) {
  const date = new Date(value);
  return !isNaN(date.getTime()) ? formatDateTime(value) : value;
}


function formatDateTime(value) {
  const d = new Date(value);
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const seconds = d.getSeconds().toString().padStart(2, "0");
  const date = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}


async function onLogsReload() {
  document.querySelector("#statusOptions").selectedIndex = 0;
  document.querySelector("#blockOptions").selectedIndex = 0;
  logsTableBodySelector.querySelectorAll("tr").forEach((row) => {
    row.style.display = "";
  });
  Toast.fire({ icon: "success", title: "Reloaded jammer logs!" });
  await onLogsLoadWithoutDateFilter(); // reload all logs
}


async function blocks() {
  const api = await fetch("/api/jammer/blocks", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (api.status === 200) {
    const { payload } = await api.json();
    const blockOptions = document.querySelector("#blockOptions");
    blockOptions.innerHTML = '<option value="0" selected disabled>select</option>';
    payload.forEach((el) => {
      blockOptions.innerHTML += `<option value="${el.blockId}">Block ${el.blockId}</option>`;
    });
  }
}


function onStatusChange() {
  document.querySelector("#blockOptions").selectedIndex = 0;
  const selectedValue = this.value;
  let iter = 1;
  logsTableBodySelector.querySelectorAll("tr").forEach((row) => {
    if (row.getAttribute("status") === selectedValue) {
      row.querySelectorAll("td")[0].innerHTML = iter++;
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}


function onBlockOptionChange() {
  document.querySelector("#statusOptions").selectedIndex = 0;
  const selectedValue = this.value;
  let iter = 1;
  logsTableBodySelector.querySelectorAll("tr").forEach((row) => {
    if (row.getAttribute("blockId") === selectedValue) {
      row.querySelectorAll("td")[0].innerHTML = iter++;
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}
