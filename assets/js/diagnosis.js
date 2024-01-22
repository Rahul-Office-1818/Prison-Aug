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
            if(payload.length < localStorage.getItem("blockId")) localStorage.setItem("blockId", 1); 
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
                        <button class="w-11/12 mx-auto p-4 grid grid-rows-2 text-black ${jammer.status ? "bg-green-500" : "bg-red-500"} border rounded-lg">
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
                        <button class="w-11/12 mx-auto p-4 grid grid-rows-2 text-black ${jammer.status ? "bg-green-500" : "bg-red-500"} border rounded-lg">
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

const init = new Diagnosys(blockSelector = "#block-container");
init.run();

