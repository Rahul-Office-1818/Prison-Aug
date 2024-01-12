const diagnosisModal = document.querySelector("#modal-div");

const onToggleModal = (ev) => {
    console.log('click is fired')
    diagnosisModal.classList.add("hidden")
}













document.querySelector("#modal-close").addEventListener("click", onToggleModal)