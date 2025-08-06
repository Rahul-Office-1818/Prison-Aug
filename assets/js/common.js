Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: "#4a4949",
    color: "#fff",
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

jammerToast = Swal.mixin({ toast: true, position: "top-end", timer: 3000, timerProgressBar: true, showConfirmButton: false });


async function onLogoutClick(ev) {
    ev.preventDefault();
    const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Log out!"
    })

    if (isConfirmed) {
        //delete the token from local storage and redirect to login page
        const logout = await fetch('/auth/logout');
        if (logout.status === 200) {
            window.location.href = "/login";
        }
    }
}

async function onLoad(ev) {
    let pathname = window.location.pathname.replace('/', "");
    let title = pathname.replace(pathname.charAt(0), pathname.charAt(0).toUpperCase());
    if (window.location.pathname != "/") {
        document.title = title;
    }
    $("#open-mobile").on('click', () => $("#mobile-menu").toggle(500));
    const jammers = fetch("/alljammer", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            const AllJammer = data.jammers
            const jammerArray = AllJammer.map(element => ({ ipAddress: element.ipAddress, ipPort: element.ipPort }))
            fetch("/last_status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jammerArray)
            })
                .then(res => res.json())
                .then(data => {
                    const results = data.results
                    const container = document.getElementById("jammers-div")
                    Object.keys(results).forEach((address) => {
                        const button = document.querySelector(`button[data-address="${address}"]`);
                        if (button) {
                            const marker = markerGroup.getLayers().find(layer => layer.options.id == button.getAttribute("data-id"));
                            results[address].payload.includes("ON") ? button.setAttribute("data-status", "1") : button.setAttribute("data-status", "0");
                            const state = button.dataset.status;
                            if (state == 1 && marker) {
                                removeAllClasses(button, "bg-");
                                marker.setIcon(onJammer);

                                button.classList.add("bg-green-500")
                            } else {
                                removeAllClasses(button, "bg-");
                                button.classList.add("bg-red-500")
                                marker.setIcon(offJammer);
                            }
                        }
                    });
                })
        })


}




// Rahul - Update this code to change the format of the Excel 


//  And this code fro date and time 

var datestring;
function dateTime() {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = ("0" + date_ob.getHours()).slice(-2);
  let minutes = ("0" + date_ob.getMinutes()).slice(-2);
  let seconds = ("0" + date_ob.getSeconds()).slice(-2);
  datestring =
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  return datestring;
}
/////////////////////////////////////////////////



function addWaterMark(doc) {
  var totalPages = doc.internal.getNumberOfPages();
  for (i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setTextColor(220);
    doc.setFontSize(22);
    doc.text(70, doc.internal.pageSize.height- 10, "BHARAT AERO");
  }
  return doc;
}

function downloadTableAsExcel(tableName) {
    var currentdate = new Date();
    var datetime =
        String(currentdate.getDate()).padStart(2, '0') +
        "/" +
        String(currentdate.getMonth() + 1).padStart(2, '0') +
        "/" +
        currentdate.getFullYear() +
        " " +
        String(currentdate.getHours()).padStart(2, '0') +
        ":" +
        String(currentdate.getMinutes()).padStart(2, '0') +
        ":" +
        String(currentdate.getSeconds()).padStart(2, '0');

    var filename = "Jammer_LoGs" + "-" + datetime + ".xlsx";

    const table = document.getElementById(tableName);

    // Create a new thead section with custom info
    const infoHeader = document.createElement("thead");
    infoHeader.innerHTML = `
        <tr><th colspan="7" style="text-align:left;"><strong>COMPANY:- BHARAT AERO</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Date - ${datetime}</strong></th></tr>
        <tr><th colspan="7">******************************************************************************************************************</th></tr>
        <tr><th colspan="7" style="text-align:left;"><strong>Disclaimer-</strong></th></tr>
        <tr><th colspan="7" style="text-align:left;">* During the Jamming Operations, The Radar will not be in a Functional State.</th></tr>
        <tr><th colspan="7" style="text-align:left;">* Due to technological limitations, passive radars only show the directional data with an accuracy up to 3 degrees and the Passive Radar also cannot tell the accurate height and distance of the detected object.</th></tr>
        <tr><th colspan="7" style="text-align:left;">* Can detect drones only if their signature is pre-fed and available in the system software. It also has a permanent Blind Spot up-to 200 meters radius from the Radar, so it should not be tested under 200 meters range.</th></tr>
        <tr><th colspan="7" style="text-align:left;">* The Radar System should follow 0-Degree Alignment/North Alignment by using an arrow pointing towards North.</th></tr>
        <tr><th colspan="7">******************************************************************************************************************</th></tr>
    `;

    // Insert it before the actual <thead>
    const originalThead = table.querySelector("thead");
    table.insertBefore(infoHeader, originalThead);

    // Export the table
    TableToExcel.convert(table, {
        name: filename,
        sheet: {
            name: "Jammer Logs",
            content: "BHARAT AERO"
        },
    });

    // Clean up: remove the inserted custom thead
    infoHeader.remove();
}

function downloadTableAsPDF(filename, tablename, noOfLogs) {
  const dateString = dateTime()
  console.log(noOfLogs, "JJJJJJJJJJJJJJj", typeof noOfLogs);  
  if (noOfLogs < 10) {
    var doc = new jsPDF("portrait", "pt", "A4");
  } else {
    var doc = new jsPDF("l", "pt", "A4");
  }
  var pageHeight = 0;
  var filename = filename
  // filename = filename ? filename + ".pdf" : "pdf_data.pdf";
  pageHeight = doc.internal.pageSize.height;
  specialElementHandlers = {
    // element with id of "bypass" - jQuery style selector
    "#bypassme": function (element, renderer) {
      // true = "handled elsewhere, bypass text extraction"
      return true;
    },
  };
  var y = -40;
  doc.setFontSize(16);
  doc.setFontStyle("bold");
  doc.setTextColor("#000000");
  doc.text(20, (y), `\n\n\n\n\n\t\t\t\t\t\t\t\t\t\t ${filename}`);
  doc.setFontSize(13);
  doc.setFontStyle("bold"); 
  doc.setFont("times");
  doc.setTextColor("#000000");
  switch (noOfLogs) {
    case 6:
      doc.autoTable({
        html: `#${tablename}`,
        startY: 70,
        theme: "striped",
        headStyles: {
          fillColor: "#1b1a1a",
        },

        columnStyles: {
           0: {
            cellWidth: 35,
            fontStyle: "bold",
          },
          1: {
            cellWidth: 100,
            fontSize: 10,
            fontStyle: "bold",
          },
          2: {
            cellWidth: 60,
            fontSize: 10,
            fontStyle: "bold",
          },
          3: {
            cellWidth: 160,
            fontSize: 10,
            fontStyle: "bold",
          },
          4: {
            cellWidth: 160,
            fontSize: 10,
            fontStyle: "bold",
          },
          5: {
            cellWidth:210,
            fontSize: 10,
            fontStyle: "bold",
          },
          6: {
            cellWidth: 110,
            fontSize: 10,
            fontStyle: "bold",
          },


        },
        styles: {
          minCellHeight: 1,
        },
      });
      break;
    case 7:
      doc.autoTable({
        html: `#${tablename}`,
        startY: 70,
        theme: "striped",
        headStyles: {
          fillColor: "#1b1a1a",
        },
        columnStyles: {
          0: {
            cellWidth: 35,
            fontStyle: "bold",
          },
          1: {
            cellWidth: 35,
            fontSize: 10,
            fontStyle: "bold",
          },
          2: {
            cellWidth: 100,
            fontSize: 10,
            fontStyle: "bold",
          },
          3: {
            cellWidth: 160,
            fontSize: 10,
            fontStyle: "bold",
          },
          4: {
            cellWidth: 150,
            fontSize: 10,
            fontStyle: "bold",
          },
          5: {
            cellWidth:150,
            fontSize: 10,
            fontStyle: "bold",
          },
          6: {
            cellWidth: 140,
            fontSize: 10,
            fontStyle: "bold",
          },
          7: {
            cellWidth: 110,
            fontSize: 10,
            fontStyle: "bold",
          },
          8: {
            cellWidth: 70,
            fontSize: 10,
            fontStyle: "bold",
          },
          9: {
            cellWidth: 80,
            fontSize: 10,
            fontStyle: "bold",
          },
          10: {
            cellWidth: 60,
            fontSize: 10,
            fontStyle: "bold",
          },
        },
        styles: {
          minCellHeight: 1,
        },
      });
      break;
    case 11:
      doc.autoTable({
        html: `#${tablename}`,
        startY: 70,
        theme: "striped",
        headStyles: {
          fillColor: "#1b1a1a",
        },
        columnStyles: {
          0: {
            cellWidth: 35,
            fontStyle: "bold",
          },
          1: {
            cellWidth: 63,
            fontSize: 10,
            fontStyle: "bold",
          },
          2: {
            cellWidth: 60,
            fontSize: 10,
            fontStyle: "bold",
          },
          3: {
            cellWidth: 60,
            fontSize: 10,
            fontStyle: "bold",
          },
          4: {
            cellWidth: 55,
            fontSize: 10,
            fontStyle: "bold",
          },
          5: {
            cellWidth: 115,
            fontSize: 10,
            fontStyle: "bold",
          },
          6: {
            cellWidth: 115,
            fontSize: 10,
            fontStyle: "bold",
          },
          7: {
            cellWidth: 67,
            fontSize: 10,
            fontStyle: "bold",
          },
          8: {
            cellWidth: 70,
            fontSize: 10,
            fontStyle: "bold",
          },
          9: {
            cellWidth: 50,
            fontSize: 10,
            fontStyle: "bold",
          },
          10: {
            cellWidth: 50,
            fontSize: 10,
            fontStyle: "bold",
          },
          11: {
            cellWidth: 40,
            fontSize: 10,
            fontStyle: "bold",
          },
        },
        styles: {
          minCellHeight: 1,
        },
      });
      break;
    default:
      doc.autoTable({
        html: `#${tablename}`,
        startY: 70,
        theme: "striped",
        headStyles: {
          fillColor: "#1b1a1a",
        },
        columnStyles: {
          0: {
            cellWidth: 55,
            fontStyle: "bold",
          },
          1: {
            fontSize: 10,
            fontStyle: "bold",
          },
          2: {
            fontSize: 10,
            fontStyle: "bold",
          },
        },
        styles: {
          minCellHeight: 1,
        },
      });

  }
  doc = addWaterMark(doc);
  doc.save(filename + "-" + dateString);
}



// This is for the formate of the Date and Time to show same formate 

function formatDateTime(input) {
  const d = new Date(input);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}




// document.querySelector("#logs-download").addEventListener("click", downloadTableAsExcel);
document.querySelector("#logout-btn").addEventListener("click", onLogoutClick);
window.addEventListener("load", onLoad);


