class Diagnosys {
    constructor(blockSelector) {
        this.blockContainer = document.querySelector(blockSelector);
    }

    async run() {
        await this.onBlockLoad();
        await this.onBlockClick();
        await this.initialJammerLoad();
    }

    async onBlockLoad() {
        this.blocks = await fetch("/api/jammer/blocks", { method: "GET", headers: { "Content-Type": "application/json" } });
        if (this.blocks.status === 200) {
            let { payload } = await this.blocks.json();
            if (payload.length < localStorage.getItem("blockId")) localStorage.setItem("blockId", 1);
            this.blockContainer.innerHTML = "";
            payload.forEach(block => {
                this.blockContainer.innerHTML += `<button type="button" class="block-btn w-11/12 mx-auto bg-red-500 border text-center font-bold sm:text-base lg:text-xl text-black p-6 rounded hover:bg-gray-400 hover:transition-all delay-75 ease-in-out" blockId="${block.blockId}">Block ${block.blockId}</button>`
            });
            await this.checkAllBlockStatus();
        }
    }

    async checkAllBlockStatus() {
        this.blockContainer.querySelectorAll("button").forEach(async block => {
            let status = await this.checkBlockStatusByid(block.getAttribute("blockId"));
            status ? block.classList.replace("bg-red-500", "bg-green-500") : block.classList.replace("bg-green-500", "bg-red-500");
        });
    }

    async checkBlockStatusByid(id) {
        let info = {
            current: true,
            change: function (state) { this.current = state }
        }

        const get = await fetch(`/api/jammer/block?id=${id}`, {
            method: "GET", headers: {
                "Content-Type": "application/json",
            }
        });

        if (get.status === 200) {
            let { block } = await get.json();
            block.forEach(jammer => (!jammer.status) ? info.change(false) : null);
            return info.current;
        }
    }

    async onBlockClick() {
        this.blockContainer.querySelectorAll('button').forEach(el => {
            el.onclick = async function () {
                let id = this.getAttribute("blockId");
                localStorage.setItem("blockId", id);

                const getJammers = await fetch(`/api/jammer/block?id=${id}`, { method: "GET", headers: { "Content-Type": "application/json" } });
                if (getJammers.status === 200) {
                    const { block } = await getJammers.json();
                    let jammerContainer = document.querySelector('#jammer-container');
                    let jammerTitle = document.querySelector("#jammer-title");
                    jammerTitle.innerHTML = `Block ${id} - Jammers`
                    jammerContainer.innerHTML = "";
                    block.forEach((jammer, idx) => {

                        jammerContainer.innerHTML += (`
                        <button class="w-11/12 mx-auto p-4 grid grid-rows-2 text-black ${jammer.status ? "bg-green-500" : "bg-red-500"} border rounded-lg" onclick="onJammerClick(this)" jammerId="${jammer.id}" blockId="${id}" jammerName="${jammer.name}" data-address='${jammer.ipAddress}' data-port='${jammer.ipPort}'>
                            <span class="font-bold ">J ${idx + 1}</span>
                            <span class="text-sm shadow rounded-full">${jammer.name}</span>
                        </button>
                        `)
                    })
                    return;
                }
                Toast.fire({ icon: "error", title: "Something went wrong!" });
            }
        })
    }

    async initialJammerLoad() {
        let id = localStorage.getItem("blockId") || 1;
        if (id) {
            const getJammers = await fetch(`/api/jammer/block?id=${id}`, { method: "GET", headers: { "Content-Type": "application/json" } });
            if (getJammers.status === 200) {
                const { block } = await getJammers.json();
                let jammerContainer = document.querySelector('#jammer-container');
                let jammerTitle = document.querySelector("#jammer-title");
                jammerTitle.innerHTML = `Block ${id} - Jammers`
                jammerContainer.innerHTML = "";

                block.forEach((jammer, idx) => {

                    jammerContainer.innerHTML += (`
                    <button class="w-11/12 mx-auto p-4 grid grid-rows-2 text-black ${jammer.status ? "bg-green-500" : "bg-red-500"} border rounded-lg" onclick="onJammerClick(this)" jammerId="${jammer.id}" blockId="${id}" jammerName="${jammer.name}" data-address='${jammer.ipAddress}' data-port='${jammer.ipPort}'>
                    <span class="font-bold ">J ${idx + 1}</span>
                    <span class="text-sm shadow rounded-full">${jammer.name}</span>
                </button>
                        `)
                })
                return;
            }
            Toast.fire({ icon: "error", title: "Something went wrong!" });
        }

    }
}

const initial = async () => {
    const init = new Diagnosys(blockSelector = "#block-container").run();
}

(initial)();

async function onJammerClick(ev) {
    let info = { jammerid: ev.getAttribute("jammerId"), blockid: ev.getAttribute("blockId"), jammername: ev.getAttribute("jammerName"), address: ev.getAttribute('data-address'), port: ev.getAttribute('data-port') };
    const query = new URLSearchParams({ address: info.address, port: info.port });
    const service = await fetch('/api/automation/status?' + query, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

    const voltageQuery = new URLSearchParams({ address: info.address, port: info.port });
    const voltageService = await fetch('/api/automation/smpsvoltage?' + voltageQuery, { method: "GET", headers: { 'Content-Type': 'application/json' } });


    if (service.status === 200 && voltageService.status === 200) {
        const { payload } = await service.json();
        const isAll = payload.every((ele) => ele === true);

        document.querySelectorAll('.channel').forEach((channel, i) => {
            const button = channel.querySelector('button');

            button.classList.remove('btn-success', 'btn-error');

            if (button.getAttribute('data-channel') === 'all') {
                button.classList.add(isAll ? 'btn-success' : 'btn-error');
                button.setAttribute('data-status', isAll);
                return;
            }
            button.classList.add(payload[i] ? 'btn-success' : 'btn-error');
            button.setAttribute('data-status', payload[i]);

            const indicator = channel.querySelector('span.status');
            indicator.classList.remove('bg-green-500', 'bg-red-500');
            indicator.classList.add(payload[i] ? 'bg-green-500' : 'bg-red-500');
            indicator.setAttribute('data-status', payload[i]);
        });

        const response = await voltageService.json();
        document.querySelectorAll('.smps > button > span')
            .forEach((indicator, i) => {
                indicator.classList.remove('bg-green-600', 'bg-red-600');
                (response.payload[i] >= 25 && response.payload[i] <= 28) ?
                    indicator.classList.add('bg-green-600') :
                    indicator.classList.add('bg-red-600');

                indicator.innerHTML = `${response.payload[i].toFixed(1)}v`;

            });

        let container = document.querySelector("#channel-container")
        Object.keys(info).forEach(key => container.setAttribute("data-" + key, info[key]));
        container.querySelector("#channel-container-title").innerHTML = `${info.jammername} Channel's`.toUpperCase()
        container.showModal();
    } else {
        Toast.fire({ icon: "error", title: "Connection Lost" })
    }


}

async function onChannelClick(ev) {
    let info = {
        channelId: ev.getAttribute("data-channel"),
        jammerId: document.querySelector('#channel-container').getAttribute('data-jammerid'),
        address: document.querySelector('#channel-container').getAttribute('data-address'),
        port: document.querySelector('#channel-container').getAttribute('data-port'),
        status: ev.getAttribute('data-status')
    };

    if (info.channelId === 'all') {
        const query = new URLSearchParams({
            currentstatus: info.status,
            address: info.address,
            port: info.port
        });

        const service = await fetch('/api/automation/allchannel?' + query, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        if (service.status === 200) {
            const { payload } = await service.json();
            const isAllActive = payload.every(ele => ele === true);

            document.querySelectorAll('.channel').forEach((channel, i) => {
                const button = channel.querySelector('button');
                button.classList.remove('btn-success', 'btn-error');

                if (button.getAttribute('data-channel') === 'all') {
                    button.classList.add(isAllActive ? 'btn-success' : 'btn-error');
                    button.setAttribute('data-status', isAllActive);
                    return;
                }
                button.classList.add(payload[i] ? 'btn-success' : 'btn-error');
                button.setAttribute('data-status', payload[i]);

                const indicator = channel.querySelector('span.status');
                indicator.classList.remove('bg-green-500', 'bg-red-500');
                indicator.classList.add(payload[i] ? 'bg-green-500' : 'bg-red-500');
                indicator.setAttribute('data-status', payload[i]);
            })

        } else {
            const { payload } = await service.json();
            Toast.fire({ icon: "error", title: payload.message })
        }
    } else {
        const query = new URLSearchParams({
            channel: info.channelId,
            address: info.address,
            port: info.port,
            currentstatus: info.status
        });

        const service = await fetch('/api/automation/channel?' + query, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        if (service.status === 200) {
            const { payload } = await service.json();
            ev.classList.remove('btn-success', 'btn-error');
            ev.setAttribute('data-status', payload.status);
            payload.status ?
                ev.classList.add('btn-success') :
                ev.classList.add('btn-error');

            const indicator = document.querySelectorAll('span.status');
            indicator[info.channelId - 1].classList.remove('bg-green-500', 'bg-red-500');
            indicator[info.channelId - 1].classList.add(payload.status ? 'bg-green-500' : 'bg-red-500');
            indicator[info.channelId - 1].setAttribute('data-status', payload.status);

            //check all module / channel.
            const statusState = new Array();
            document.querySelectorAll('.channel').forEach(el =>
                (el.getAttribute('data-channel') !== 'all') ?
                    statusState.push(el.querySelector('button').getAttribute('data-status')) :
                    null
            )

            const isAll = statusState.every(ele => ele === "true")
            document.querySelector('[data-channel="all"] > button').classList.remove('btn-success', 'btn-error');
            document.querySelector('[data-channel="all"] > button').classList.add(isAll ? 'btn-success' : 'btn-error');
            document.querySelector('[data-channel="all"] > button').setAttribute('data-status', isAll);

        } else {
            const { payload } = await service.json();
            Toast.fire({ icon: 'error', title: payload.message })
        }

    }
}

function onSMPSClick(ev) {
    let info = { smpsId: ev.getAttribute("smpsId") };
    console.log(info)
}




