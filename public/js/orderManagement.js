const updateStatus = async (orderId,status) =>{
    if(!status) return 
    const res = await fetch(`/admin/orders/${orderId}/status`,{
        method:"POST",
        headers :{'Content-Type':'application/json'},
        body :JSON.stringify({status})
    })
    const data = await res.json()
    if(data.success){
        Swal.fire('Updated!','Order Status updated.','success')
        .then(()=>location.reload())
    }else{
        Swal.fire('Error',data.message,'error')
    }
}