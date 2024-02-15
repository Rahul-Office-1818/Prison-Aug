const Toast = Swal.mixin({
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


document.querySelector("#signup-form").addEventListener('submit', handleSubmit);

async function handleSubmit(ev) {
    ev.preventDefault();

    const form = new FormData(ev.target);
    const formData = Object.fromEntries(form.entries());

    await Swal.fire({
        title: "Please enter admin password",
        input: 'password',
        inputAttributes: {
            autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Verify",
        showLoaderOnConfirm: true,
        preConfirm: async (payload) => {
            const query = new URLSearchParams({ password: payload });
            const checkService = await fetch('/auth/checkpass?' + query, { method: "GET", headers: { 'Content-Type': 'application/json' } });
            if (checkService.status === 200) {
                const { payload } = await checkService.json();
                await createUser(formData, { ev: ev });
            } else {
                const { payload } = await checkService.json();
                Toast.fire({ icon: "warning", title: payload.message });
            }
        }
    });
}

async function createUser(formData, { ev }) {
    const service = await fetch("/auth/signup", {
        method: "POST", body: JSON.stringify(formData), headers: {
            "Content-Type": "application/json",
        }
    });

    if (service.status === 201) {
        const { payload } = await service.json();
        await Toast.fire({ icon: "success", title: payload.message });
        ev.target.reset();
        window.location.href = "/login";
    }
    else {
        const { payload } = await service.json();
        Toast.fire({ icon: "info", title: payload.message });
    }
}