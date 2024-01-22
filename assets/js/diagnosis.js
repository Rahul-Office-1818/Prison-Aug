class Diagnosys {
    constructor(blockSelector) {
        this.blockContainer = document.querySelector(blockSelector);
    }

    async onBlockLoad(uri) {
        this.blocks = await fetch(uri, { method: "GET", headers: { "Content-Type": "application/json" } });
        if (this.blocks.status === 200) {
            let { payload } = await this.blocks.json();
            this.blockContainer.innerHTML = "";
            payload.forEach(block => {
                this.blockContainer.innerHTML += `<button type="button" onclick="blockClick(this)" class="block-btn w-11/12 mx-auto bg-red-500 border text-center font-bold sm:text-base lg:text-xl text-black p-6 rounded hover:bg-gray-400 hover:transition-all delay-75 ease-in-out" blockId="${block.blockId}">Block ${block.blockId}</button>`
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

    async

}

const init = new Diagnosys("#block-container");
init.onBlockLoad("/api/jammer/blocks");


async function blockClick(ev) {
    console.log(ev)
}