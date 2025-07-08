const logsTableBodySelector = document.querySelector("#logs-table tbody");

async function onLogsLoad() {
  let start = document.querySelector("#startdate").value;
  let end = document.querySelector("#enddate").value;
  let selectedBlock = document.querySelector("#blockOptions").value;

  console.log(start, end);

  const get = await fetch(
    "/api/logs?start=" +
    start +
    "&end=" +
    end +
    "&blockId=" +
    selectedBlock +
    "",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (get.status === 200) {
    let { payload } = await get.json();
    logsTableBodySelector.innerHTML = "";
    payload.forEach((el, idx) => {
      let d = new Date(el.dateTime);
      let seconds = d.getSeconds().toString().padStart(2, "0");
      let minutes = d.getMinutes().toString().padStart(2, "0");
      let hours = d.getHours().toString().padStart(2, "0");
      let months = (d.getMonth() + 1).toString().padStart(2, "0");
      let date = d.getDate().toString().padStart(2, "0");
      let datetime = `${date}/${months}/${d.getFullYear()} ${hours}:${minutes}:${seconds}`;
      let seconds2 = d.getSeconds().toString().padStart(2, "0");
      let StatTime = `${d.getDate()}/${d.getMonth() + 1
        }/${d.getFullYear()} ${hours}:${minutes}:${seconds2}`;
      const tr = document.createElement("tr");
      tr.classList.add("text-center", "text-xl", "divide-gray-200");
      tr.setAttribute("status", el.status);
      tr.setAttribute("blockId", el.blockId);
      tr.innerHTML = `<td scope="col" class="py-2">${idx + 1}</td>
            <td scope="col" class="py-2">${el.jammerName}</td>
            <td scope="col" class="py-2" >Block ${el.blockId}</td>
            <td scope="col" class="py-2" datetime="${StatTime}">${el.jammer_on
        }</td>
            <td scope="col" class="py-2">${el.jammer_off}</td>
            <td scope="col" class="py-2" >${el.diffrence}</td>
            `;
      logsTableBodySelector.appendChild(tr);
    });
    //

    return;
  }
  Toast.fire({ icon: "warning", title: response.message });
}

const filter_log = document.querySelector("#date-filter");
const filter_remove_log = document.querySelector("#date-filter-remove");

async function initial() {
  onLogsLoad();
  blocks();
}
async function onStatusChange() {
  document
    .querySelector("#blockOptions")
    .querySelectorAll("option")[0].selected = true;
  this.querySelectorAll("option").forEach((option) => {
    if (option.selected) {
      let selectedValue = option.value;
      let iter = 1;
      logsTableBodySelector.querySelectorAll("tr").forEach((row) => {
        if (row.getAttribute("status") === selectedValue) {
          row.querySelectorAll("td")[0].innerHTML = iter++;
          row.style.display = "";
          return;
        }
        row.style.display = "none";
      });
    }
  });
}

async function onLogsReload(ev) {
  document
    .querySelector("#statusOptions")
    .querySelectorAll("option")[0].selected = true;
  document
    .querySelector("#blockOptions")
    .querySelectorAll("option")[0].selected = true;
  logsTableBodySelector
    .querySelectorAll("tr")
    .forEach((row) => (row.style.display = ""));
  Toast.fire({ icon: "success", title: "Reload jammer logs!" });
}

async function blocks() {
  const api = await fetch("/api/jammer/blocks", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (api.status === 200) {
    let { payload } = await api.json();
    let blockOptions = document.querySelector("#blockOptions");
    blockOptions.innerHTML =
      '<option value="0" selected disabled>select</option>';
    payload.forEach(
      (el, i) =>
        (blockOptions.innerHTML += `<option value="${el.blockId}" >Block ${el.blockId}</option>`)
    );
  }
}

function onBlockOptionChange() {
  document
    .querySelector("#statusOptions")
    .querySelectorAll("option")[0].selected = true;
  this.querySelectorAll("option").forEach((option) => {
    if (option.selected) {
      let selectedValue = option.value;
      let iter = 1;
      logsTableBodySelector.querySelectorAll("tr").forEach((row) => {
        if (row.getAttribute("blockId") === selectedValue) {
          row.querySelectorAll("td")[0].innerHTML = iter++;
          row.style.display = "";
          return;
        }
        row.style.display = "none";
      });
    }
  });
}

async function pflogs() {
  alert("hi i m clicked");
}

initial();

document.querySelector("#date-filter").addEventListener("click", onLogsLoad);
document.querySelector("#logs-reload").addEventListener("click", onLogsReload);
document.querySelector("#date-filter-remove").addEventListener("click", onLogsLoad);
// document.querySelector("#powerfailure-logs").addEventListener("click", pflogs);

document
  .querySelector("#statusOptions")
  .addEventListener("change", onStatusChange);
document
  .querySelector("#blockOptions")
  .addEventListener("change", onBlockOptionChange);
// document.querySelector("#all").addEventListener("change", onLogsLoad);
