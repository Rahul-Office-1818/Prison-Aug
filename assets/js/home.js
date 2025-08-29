const options = {
  maxZoom: 18,
  minZoom: 2,
  doubleClickZoom: false,
  zoomControl: false,
};
const map = L.map("map", options).setView(
  [30.95258895138585, 76.50578061482715],
  14
);

const jammerAlarm = new Audio("./assets/audio/drone_alarm.mp3");

// const map = L.map("map", options).setView([30.290276810492884,74.98112098094168], 17);

// Offline Map
// const layer = new L.TileLayer('http://127.0.0.1:8000/tileserver?z={z}&x={x}&y={y}.jpeg');
// map.addLayer(layer);
// const googleHybrid = L.tileLayer(`http://127.0.0.1:8000/tileserver/{z}/{x}/{y}.jpeg`, { maxZoom: 18, attribution: 'Prison Jammer' });
// map.addLayer(googleHybrid);

// Offline Map

// Online Map
const googleHybrid = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
  {
    maxZoom: 22,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);
map.addLayer(googleHybrid);
// Online Map

const markerGroup = L.markerClusterGroup({
  chunkedLoading: true,
});

const onJammer = L.icon({
  iconUrl: "./assets/icon/toweron1.png",
  iconSize: [60, 60],
  iconAnchor: [50, 60],
  className: "jammer-icon",
  name: "on",
});

const offJammer = L.icon({
  iconUrl: "./assets/icon/toweroff2.png",
  iconSize: [60, 60],
  iconAnchor: [50, 60],
  className: "jammer-icon",
  name: "off",
});

// DOM Selector :-
const drawerSelector = document.querySelector("#drawer");
const addJammerModalSelector = document.querySelector("#static-modal");
const closeJammerSelector = document.querySelector("#modalClose");
const addJammerFormSelector = document.querySelector("#jammer-form");
const jammerAlarmSelector = document.querySelector("#jammer-alarm");

const toggleDrawer = () => drawerSelector.classList.toggle("hidden");

async function onDblClick(ev) {
  let latlng = ev.latlng;

  const userPermission = await Swal.fire({
    title: "Are you sure?",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Add Jammer!",
  });
  if (userPermission.isConfirmed) {
    addJammerFormSelector.lat.value = latlng.lat;
    addJammerFormSelector.lng.value = latlng.lng;
    addJammerModalSelector.classList.remove("hidden");
  }
}

function onJammerMarkerClick(ev) {
  const id = this.options.jammerId;
  // alert(id)
}

map.on("dblclick", onDblClick);

function validateIP(ip) {
  const regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (!regex.test(ip)) return false;
  return true;
}

function validatePort(port) {
  var portFormat = new RegExp(
    "^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$"
  );
  return portFormat.test(port);
}

function isValidLatitude(latitude) {
  if (typeof latitude !== "number") {
    return false;
  }

  const latDegrees = Math.floor(Math.abs(latitude));
  const latMinutes = Math.floor((Math.abs(latitude) * 60) % 60);
  const latSeconds = (Math.abs(latitude) * 3600) % 60;

  return (
    latDegrees >= 0 &&
    latDegrees <= 90 &&
    latMinutes >= 0 &&
    latMinutes <= 59 &&
    latSeconds >= 0 &&
    latSeconds <= 59
  );
}

function isValidLongitude(longitude) {
  // Longitude ranges from -180 to 180
  if (typeof longitude !== "number" || longitude < -180 || longitude > 180) {
    return false;
  }
  return true;
}

function ipValidation() {
  const isTrue = validateIP(addJammerFormSelector.ipAddress.value);
  isTrue
    ? document.querySelector("#ipError").classList.add("hidden")
    : document.querySelector("#ipError").classList.remove("hidden");
}

function portValidation() {
  const isTrue = validatePort(addJammerFormSelector.ipPort.value);
  isTrue
    ? document.querySelector("#portError").classList.add("hidden")
    : document.querySelector("#portError").classList.remove("hidden");
}

function latValidation() {
  isValidLatitude(Number(addJammerFormSelector.lat.value))
    ? document.querySelector("#latError").classList.add("hidden")
    : document.querySelector("#latError").classList.remove("hidden");
}

function lngValidation() {
  isValidLatitude(Number(addJammerFormSelector.lat.value))
    ? document.querySelector("#lngError").classList.add("hidden")
    : document.querySelector("#lngError").classList.remove("hidden");
}

async function onBlockCLick(ev) {
  let blockId = ev.getAttribute("blockId");
  document.querySelector(
    "#drawerTitle"
  ).innerHTML = `BLOCK ${blockId} - JAMMERS`;

  const get = await fetch(`/api/jammer/block?id=${blockId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (get.status === 200) {
    let { block } = await get.json();

    const jammersDivSelector = document.querySelector("#jammers-div");
    jammersDivSelector.innerHTML = "";

    block.forEach((el, idx) => {
      jammersDivSelector.innerHTML += `<button class="Block_Jammer_Btn h-[100px] cursor-pointer p-4 grid grid-rows-2 text-black ${el.status ? "bg-green-500" : "bg-red-500"
        } border rounded" onclick="jammerToggle(this)" data-id='${el.id
        }' data-block-id='${el.blockId}' data-address='${el.ipAddress
        }' data-port='${el.ipPort}' title='${el.name}' data-name='${el.name
        }'  data-status='${el.status}'>
            <span class="font-bold ">J ${idx + 1}</span>
            <span class="text-sm shadow border rounded-full size-4"></span>
            <span class="text-sm shadow  rounded-full">${String(el.name)}</span>
            </button>`;
    });

    toggleDrawer();

    const pingInfo = localStorage.getItem("ping");
    if (pingInfo) {
      const payload = JSON.parse(pingInfo);
      document
        .querySelector("#jammers-div")
        .querySelectorAll("button")
        .forEach((item) => {
          const jammerId = item.getAttribute("data-id");
          const info = payload.find((el) => String(el.jammerId) === jammerId);
          if (info.alive) return;
          removeAllClasses(item, "bg-");
          if (!info.alive) item.classList.add("bg-yellow-500");
        });
    }
    return;
  }
  Toast.fire({ icon: "warning", title: "Something went wrong!" });
}
const voltageColor = "red";

async function onBlockLoad() {
  const jammerAPI = await fetch("/api/jammer", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let { jammers } = await jammerAPI.json();

  markerGroup.clearLayers();
  jammers.forEach((el, i) => {
    markerGroup.addLayer(
      L.marker([el.lat, el.lng], {
        icon: el.status ? onJammer : offJammer,
        id: el.id,
        status: el.status,
      }).bindPopup(`<table class="text-lg font-bold text-center">
                        <tr>
                            <td scope="col" class="px-3 py-1 text-right">Name</td>
                            <td scope="col" class="px-3 py-1 text-left">${el.name}</td>
                        </tr>
                        <tr>
                            <td scope="col" class="px-3 py-1 text-right">Block</td>
                            <td scope="col" class="px-3 py-1 text-left">${el.blockId}</td>
                        </tr>
                        <tr>
                            <td scope="col" class="px-3 py-1 text-right">IP</td>
                            <td scope="col" class="px-3 py-1 text-left">${el.ipAddress}</td>
                        </tr>
                        <tr>
                            <td scope="col" class="px-3 py-1 text-right">PORT</td>
                            <td scope="col" class="px-3 py-1 text-left">${el.ipPort}</td>
                        </tr>
                    </table>`)
    );
  });
  map.addLayer(markerGroup);
  map.fitBounds(markerGroup.getBounds());

  
  // if ((await jammers.length) <= 10) { this is chnaged by Rahul at 9th April
  if ((await jammers.length) <= 150) {
    document.getElementById("drawer-close").style.display = "none";
    if (jammerAPI.status === 200) {
      document.querySelector("#drawerTitle").innerHTML = `JAMMERS`;
      const jammersDivSelector = document.querySelector("#jammers-div");
      jammersDivSelector.innerHTML = "";
      jammers.forEach((el, idx) => {
        jammersDivSelector.innerHTML += `
                <button class="Jammer-btn h-[100px] p-4 grid grid-rows-2 cursor-pointer text-black ${el.status ? "bg-green-500" : "bg-red-500"
          } border rounded" onclick="jammerToggle(this)" data-id='${el.id
          }' data-block-id='${el.blockId}' data-address='${el.ipAddress
          }' data-port='${el.ipPort}' title='${el.name}' data-name='${el.name
          }'  data-status='${el.status}'>
            <span class="font-bold ">J ${idx + 1}</span>
            <span disabled class="text-sm shadow border-4  border-double rounded-full size-4 bg-red-500" connection="f" host="${el.ipAddress
          }" id="jammer-connection"></span>

            <span disabled class="text-sm shadow rounded-full">${String(
            el.name
          )}</span>
            </button>`;

        jammersDivSelector.querySelectorAll("*").forEach((btn) => {
          btn.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            let pcuIp = e.target.getAttribute("data-address");
            let pcuPort = e.target.getAttribute("data-port");
            fetch(
              "/api/voltageandtemp?pcuIp=" + pcuIp + "&pcuPort=" + pcuPort + "",
              { method: "GET" }
            )
              .then((response) => response.json())
              .then((data) => {
                let item = document.querySelector("#voltage-span");
                let span = document.querySelector("#temp-span");
                let volt = document.querySelector("#volt-d");
                const voltage = data.payload.voltage.split(":")[1];
                const temperature = data.payload.temperature.split(":")[1];
                // const voltage = 330;
                // const temperature = 220;
                console.log(`Voltage: ${voltage}`);
                if (voltage > 220.0) {
                  removeAllClasses(item, "bg-");
                  item.classList.add("bg-green-500");
                  volt.textContent = voltage + "V"; // <--- Display value
                } else if (voltage >= 200.0 && voltage < 100.0) {
                  removeAllClasses(item, "bg-");
                  item.classList.add("bg-yellow-500");
                  volt.textContent = voltage + "V"; // <--- Display value
                } else {
                  console.log("Red: else is called");
                  volt.textContent = voltage + "V"; // <--- Display value

                  removeAllClasses(item, "bg-");
                  item.classList.add("bg-red-500");
                }
                if (temperature < 60.0) {
                  removeAllClasses(span, "bg-");
                  span.classList.add("bg-green-500");
                } else if (temperature <= 65.0 && temperature > 60.0) {
                  removeAllClasses(span, "bg-");
                  span.classList.add("bg-yellow-500");
                } else {
                  console.log("Red: else is called");
                  removeAllClasses(span, "bg-");
                  span.classList.add("bg-red-500");
                }
                console.log(` ${temperature}`);
              }); 

            // // res.json();
            // const  payload = res.json();
            // console.log("need this data", payload.payload);

            // if (res.status === 200) {
            //   removeAllClasses(item, "bg-");
            //   removeAllClasses(span, "bg-");
            //   item.classList.add("bg-green-500")
            //   span.classList.add("bg-green-500")
            // } else {
            //   if (item) {
            //     item.classList.add("bg-red-500");
            //     span.classList.add("bg-red-500")
            //   }
            // }
            // })
            if (!e.target.getAttribute("data-status")) return;
            const jammerName = e.target.getAttribute("data-name");
            const popup = document.createElement("div");
            popup.id = "popup";
            popup.innerHTML = `
                            <table>
                                <tr>
                                <td scope="col" class="px-3 py-1 text-right font-bold text-black">Name</td>
                                <td scope="col" class="px-3 py-1 text-left font-bold text-black">${jammerName}</td>
                                </tr>
                                <tr>
                                <td scope="col" class="px-3 py-1 text-right font-bold text-black">Temp :</td>
                                <td class="px-3 py-1 text-left" ><span id ="temp-span" class=" flex text-sm shadow border-4   border-double rounded-full size-4 bg-red-500" connection="f" " id="jammer-connection"></span></td>
                                </tr>
                                <tr>
                                <td scope="col" class="px-3 py-1 text-right font-bold text-black">Volt :</td>
                                <td scope="col" class="px-3 py-1 text-left"><span id ="voltage-span" class=' flex text-sm shadow border-4   border-double rounded-full size-4 bg-red-500' connection="f" " id="jammer-connection"></span></td>
                                
                                
                            </table>
              `;
              // </tr><td scope="col" class="px-3 py-1 text-left" id="volt-d" ></td>
            popup.style.position = "absolute";
            popup.style.zIndex = "9999";
            popup.style.padding = "10px";
            popup.style.border = "1px solid black";
            popup.style.background = "white";
            popup.style.top = e.clientY + "px";
            popup.style.left = e.clientX + "px";
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const rect = e.target.getBoundingClientRect();
            popup.style.top = `${rect.top + rect.height}px`;
            popup.style.left = `${rect.left}px`;
            popup.addEventListener("click", () => {
              popup.remove();
            });
            if (document.getElementById("popup")) {
              document.getElementById("popup").remove();
              document.body.appendChild(popup);
            }
            document.body.appendChild(popup);
          });
        });
      });

      jammersDivSelector.querySelectorAll("button");
      toggleDrawer();

      const pingInfo = localStorage.getItem("ping");

      if (pingInfo) {
        const payload = JSON.parse(pingInfo);
        document
          .querySelector("#jammers-div")
          .querySelectorAll("button")
          .forEach((item) => {
            const jammerId = item.getAttribute("data-id");
            const info = payload.find((el) => String(el.jammerId) === jammerId);
            if (
              info &&
              !info.alive &&
              !item.classList.contains("bg-yellow-500")
            ) {
              removeAllClasses(item, "bg-");
              item.classList.add("bg-yellow-500");
            }
          });
      }
      return;
    }
  } else {
    const blocksAPI = await fetch("/api/jammer/blocks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (blocksAPI.status === 200) {
      const { payload } = await blocksAPI.json();

      const blocksDivSelector = document.querySelector("#blocks-div");
      blocksDivSelector.innerHTML = "";
      let BlockStatus = false;
      payload.forEach((block, i) => {
        blocksDivSelector.innerHTML += `< button class="block-btn relative cursor-pointer ${BlockStatus ? "bg - green - 500" : "bg - red - 500"
          } border text - center font - bold text - 2xl text - black p - 6 h - [100px] rounded" onclick="onBlockCLick(this)" blockId="${block.blockId
          }" data-status='${BlockStatus}' title="Jammer Block">B ${block.blockId
          }</button > `;
      });
      return;
    }

    Toast.fire({ icon: "error", title: "Something went wrong!" });
  }
}

async function closeModal() {
  addJammerModalSelector.classList.add("hidden");
}

async function onFormSubmit(ev) {
  ev.preventDefault();
  const form = new FormData(ev.target);
  const formData = Object.fromEntries(form.entries());
  const port = await fetch("/api/jammer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const response = await port.json();
  if (port.status === 201) {
    Toast.fire({ icon: "success", title: response.message });
    addJammerFormSelector.reset();
  } else {
    console.error(response.err);
    Toast.fire({ icon: "warning", title: response.message });
  }
  onJammerLoadOnMap();
  await onBlockLoad();
  document
    .querySelectorAll(".block-btn")
    .forEach((block) => checkBlockStatusByid(block.getAttribute("blockId")));
  closeModal();
}

async function initial() {
  const homePage = document.querySelector("#home-page");
  if (homePage) {
    console.log("home : ", homePage);
  }
  // onJammerLoadOnMap();
  await onBlockLoad();
  setInterval(checkPingConnection, 2000);
  document
    .querySelectorAll(".block-btn")
    .forEach((block) => checkBlockStatusByid(block.getAttribute("blockId")));
}

async function checkAllBlockStatus() {
  document
    .querySelectorAll(".block-btn")
    .forEach(
      async (item) => await checkBlockStatusByid(item.getAttribute("blockId"))
    );
  return;
}

async function jammerToggle(ev) {
  const info = {
    id: ev.getAttribute("data-id"),
    block: ev.getAttribute("data-block-id"),
    name: ev.getAttribute("data-name"),
    currentstatus: ev.getAttribute("data-status"),
    address: ev.getAttribute("data-address"),
    port: ev.getAttribute("data-port"),
  };

  const query = new URLSearchParams(info);

  const service = await fetch("/api/automation/jammer?" + query, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (service.status === 200) {
    const { payload } = await service.json();
    ev.classList.remove("bg-green-500", "bg-red-500");
    ev.setAttribute("data-status", payload);

    payload ? ev.classList.add("bg-green-500") : ev.classList.add("bg-red-500");

    markerGroup.eachLayer((marker) =>
      marker.options.id === Number(info.id)
        ? marker.setIcon(payload ? onJammer : offJammer)
        : null
    );
    Toast.fire({ icon: "success", title: `Jammer ${payload ? "on" : "off"}` });
  } else {
    const { payload } = await service.json();
    Toast.fire({ icon: "error", title: payload.message });
  }
}

function removeAllClasses(domSelector, prefix) {
  [...domSelector.classList].forEach((value) =>
    value.startsWith(prefix) ? domSelector.classList.remove(value) : null
  );
}

async function checkBlockStatusByid(id) {
  let info = {
    current: true,
    change: function (state) {
      this.current = state;
    },
  };

  const get = await fetch(`/ api / jammer / block ? id = ${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (get.status === 200) {
    let { block } = await get.json();
    block.forEach((jammer) => (!jammer.status ? info.change(false) : null));
    document.querySelectorAll(".block-btn").forEach((item) => {
      if (item.getAttribute("blockId") === id) {
        removeAllClasses(item, "bg-");
        info.current
          ? item.classList.add("bg-green-500")
          : item.classList.add("bg-red-500");
      }
    });
    return;
  }
}

async function checkPingConnection() {
  const service = await fetch("/api/ping/all");

  if (service.status === 200) {
    const { payload } = await service.json();

    const isJammersConnectionLost = payload.filter((item) => !item.alive);
    if (isJammersConnectionLost.length) {
      Toastify({
        text: `<div>
                <strong style="Text-align: center; width: 100%;">Jammer Connection Lost!!!</strong>
                <p style="margin: 0; font-size: 22px ;" class="text-base">
                Jammer Name: ${isJammersConnectionLost.map(item => `${item.jammerName} (J${item.blockId})`).join(", ")}
                </p>
              </div>`,
        duration: 2200,
        newWindow: true,
        position: "center",
        gravity: "bottom",
        stopOnFocus: true,
        close: false,
        escapeMarkup: false,
        style: {
          color: "black",
          fontWeight: "bold",
          fontSize: "32px", 
          border: "1px solid #FEEC6F",
          borderRadius: "10px",
          background: "rgb(255, 77, 77)",
        },
      }).showToast();
      jammerAlarm.play().catch((error) => {
        console.log("Error while play jammer alarm");
      });
    } else {
      jammerAlarm.pause();
    }

    //  <p style="margin: 0;" class="text-base">Jammer ID: ${isJammersConnectionLost.map(item => item.jammerId).join(",")}</p>

    localStorage.setItem("ping", JSON.stringify(payload));
    try {
      if (document.querySelectorAll(".block-btn").length > 0) {
        document
          .querySelectorAll(".block-btn")
          .forEach(async (blockSelector) => {
            let blockId = blockSelector.getAttribute("blockId");

            let isDivExists = blockSelector.querySelector("div");

            let info = payload.filter(
              (item) => String(item.blockId) === blockId
            );

            let isConnection = info.some((item) => item.alive === false);

            if (!!isDivExists) blockSelector.removeChild(isDivExists);

            if (isConnection) {
              let cout = 0;
              const badge = document.createElement("div");

              [...blockSelector.classList].forEach((el) =>
                el.startsWith("bg-") ? blockSelector.classList.remove(el) : null
              );

              info.forEach((item) => (item.alive ? null : cout++));
              blockSelector.classList.add("bg-yellow-500");
              badge.classList.add("upper-badge");
              badge.innerText = cout;
              blockSelector.appendChild(badge);
              cout = 0;
              // jammerToast.fire({ icon: "error", title: 'Jammer connection lost!' });
              return;
            } else {
              const item = blockSelector.querySelector("div");
              if (item) {
                Number(item.dataset.status)
                  ? item.classList.add("bg-green-500")
                  : item.classList.add("bg-red-500");
                item.classList.remove("bg-yellow-500");
              }
            }
            await checkBlockStatusByid(blockId);
            return;
          });
      } else {
        const JammerBtnDiv = document.querySelectorAll(".Jammer-btn");
        JammerBtnDiv.forEach(async (item) => {
          let info = payload.filter(
            (item1) => String(item1.host) === item.dataset.address
          );
          const jammerConnectionSpans = document.querySelectorAll(
            "span#jammer-connection"
          );

          let isConnection = info.some((item2) => item2.alive === false);

          if (isConnection) {
            jammerConnectionSpans.forEach((span) => {
              const matchingInfo = info.find(
                (item) => item.host === span.getAttribute("host")
              );
              if (matchingInfo && !matchingInfo.alive) {
                span.setAttribute("connection", "red");
              }
            });

            // jammerToast.fire({ icon: "error", title: 'Jammer connection lost!' });
            item.classList.remove("bg-green-500", "bg-red-500");
            item.classList.add("bg-yellow-500");
          } else {
            jammerConnectionSpans.forEach((span) => {
              const matchingInfo = info.find(
                (item) => item.host === span.getAttribute("host")
              );
              if (matchingInfo) {
                span.setAttribute("connection", "green");
              }
            });

            Number(item.dataset.status)
              ? item.classList.add("bg-green-500")
              : item.classList.add("bg-red-500");
            item.classList.remove("bg-yellow-500");
          }
        });
      }

      const jammerConnectionSpans = document.querySelectorAll(
        "span#jammer-connection"
      );

      jammerConnectionSpans.forEach((span) => {
        if (span.getAttribute("connection") === "red") {
          span.classList.add("bg-red-500");
          span.classList.remove("bg-green-600");
        } else if (span.getAttribute("connection") === "green") {
          span.classList.add("bg-green-600");
          span.classList.remove("bg-red-500");
        }
      });
    } catch (error) {
      console.log(error, "error Home.js checkPingConnection");
    }
  }
}

function removeDublicateBlocks(value) {
  let valueInSet = new Set(value);
  return [...valueInSet].sort();
}

initial();



// // This code for prevent the page from being refreshed/reloaded while the Jammer are ON. 27 Aug  Rahul
// function hexToRgb(hex) {
//   hex = hex.replace("#", "");
//   if (hex.length === 3) {
//     hex = hex.split("").map(ch => ch + ch).join("");
//   }
//   const r = parseInt(hex.substring(0, 2), 16);
//   const g = parseInt(hex.substring(2, 4), 16);
//   const b = parseInt(hex.substring(4, 6), 16);
//   return `rgb(${r}, ${g}, ${b})`;
// }

// // Store green reference values
// const greenValues = [
//   "rgb(34, 197, 94)",       // Tailwind green-500
//   hexToRgb("#22c55e")       // Hex equivalent
// ];

// function isJammerGreen() {
//   const jammer = document.querySelector(".Jammer-btn");
//   if (!jammer) return false;

//   const style = getComputedStyle(jammer);
//   const bgColor = style.backgroundColor.trim();
//   return greenValues.includes(bgColor);
// }


// // Block refresh if green
// window.addEventListener("beforeunload", function (event) {
//   if (isJammerGreen()) {
//     event.preventDefault();
//     // Chrome requires returnValue to show confirmation dialog
//     event.returnValue = "Jammer is green, page reload is restricted!";
//     return "Jammer is ON, page reload is restricted!";
//   }
// });


// This code for prevent the page from being refreshed/reloaded while the Jammer are ON. 29 Aug  Rahul using Tower

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("beforeunload", (event) => {
    const imgs = document.querySelectorAll(".jammer-icon");
    let blockReload = false;

    imgs.forEach(img => {
      if (img.src.includes("toweron1.png")) {
        blockReload = true;
      }
    });

    if (blockReload) {
      event.preventDefault();
      event.returnValue = "A jammer is ON. Leaving will stop monitoring.";
      return "A jammer is ON. Leaving will stop monitoring.";
    }
  });
});



document.querySelector("#drawer-close").addEventListener("click", toggleDrawer);
closeJammerSelector.addEventListener("click", closeModal);
addJammerFormSelector.addEventListener("submit", onFormSubmit);

// validation event.
addJammerFormSelector.ipAddress.addEventListener("input", ipValidation);
addJammerFormSelector.ipPort.addEventListener("input", portValidation);
addJammerFormSelector.lat.addEventListener("input", latValidation);
addJammerFormSelector.lng.addEventListener("input", lngValidation);
