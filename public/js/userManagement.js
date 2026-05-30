document.querySelectorAll(".blockBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const isBlocked = btn.dataset.blocked === "true";
        const result = await Swal.fire({
            title: isBlocked ? "Unblock User?" : "Block User?",
            text: isBlocked ? "User can access again." : "User will be blocked.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes"
        })
        if (!result.isConfirmed) return;
        const response = await fetch(`/admin/users/${id}/block`, {
            method: "PUT",
            headers:{"Content-Type":"application/json"}
        })
        const data = await response.json();
        // console.log(data)
        if (data.success) {
            Swal.fire("Success!", data.message, "success")
                .then(() => location.reload());
        } else {
            Swal.fire("Error!", data.message, "error");
        }

    });

});