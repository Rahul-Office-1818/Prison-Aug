const pflogsTableBodySelector = document.querySelector(
  "#powerfailure-logs-table tbody"
);

async function onPFLogsLoad() {
  let start = document.querySelector("#startdate").value;
  let end = document.querySelector("#enddate").value;
//   let selectedBlock = document.querySelector("#blockOptions").value;
  console.log(start, end);

  const get = await fetch(
    "/api/pflogs?start=" +
      start +
      "&end=" +
      end +
      
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
    pflogsTableBodySelector.innerHTML = "";
    payload.forEach((el, idx) => {
      let d = new Date(el.createdAt);
      let seconds = d.getSeconds().toString().padStart(2, "0");
      let minutes = d.getMinutes().toString().padStart(2, "0");
      let hours = d.getHours().toString().padStart(2, "0");
      let months = (d.getMonth() + 1).toString().padStart(2, "0");
      let date = d.getDate().toString().padStart(2, "0");
      let datetime = `${date}/${months}/${d.getFullYear()} ${hours}:${minutes}:${seconds}`;
      const tr = document.createElement("tr");
      tr.classList.add("text-center", "text-xl", "divide-gray-200");
      tr.setAttribute("status", el.status);
      tr.setAttribute("blockId", el.blockId);
      tr.innerHTML = `<td scope="col" class="py-2">${idx + 1}</td>
            <td scope="col" class="py-2">${el.jammer_id}</td>
            <td scope="col" class="py-2">${el.jammer_name}</td>
            <td scope="col" class="py-2">${
              el.status ? "Jammer ON" : "Jammer Connectivity Lost"
            }</td>
            <td scope="col" class="py-2">${el.FROM}</td>
            <td scope="col" class="py-2">${el.To}</td>
            <td scope="col" class="py-2">${el.Duration}</td>
            `;
      pflogsTableBodySelector.appendChild(tr);
    });

    return;
  }
  Toast.fire({ icon: "warning", title: response.message });
}
onPFLogsLoad();

async function onLogsReload(ev) {
  // document.querySelector('#statusOptions').querySelectorAll("option")[0].selected = true;
  // document.querySelector('#blockOptions').querySelectorAll("option")[0].selected = true;
  pflogsTableBodySelector
    .querySelectorAll("tr")
    .forEach((row) => (row.style.display = ""));
  onPFLogsLoad();
  Toast.fire({ icon: "success", title: "Reload jammer logs!" });
}

document
  .querySelector("#pflogs-reload")
  .addEventListener("click", onLogsReload);
document
  .querySelector("#pfdate-filter")
  .addEventListener("click", onLogsReload);

// document.querySelector("#powerfailure-logs").addEventListener("click", onPFLogsLoad);
// document.querySelector("#all").addEventListener("change", onPFLogsLoad);
