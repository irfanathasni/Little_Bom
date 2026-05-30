const addToCartBtn = document.getElementById(`addToCartBtn`)
addToCartBtn.addEventListener("click",async() =>{
    const productId = addToCartBtn.dataset.productId
    try{
        const response = await fetch(`/add-cart`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({productId})
        })
        const data = await response.json()
        if(data.success){
            addToCartBtn.innerHTML ='<i class="bi bi-check-lg"></i> Added!'
            setTimeout(() =>{
                addToCartBtn.innerHTML = `<i class= "bi bi-bag"></i>Add To Cart`
            },2000)
        }else{
            alert(data.message ||`something went wrong`)
        }
    }catch(err){
        console.error(`cart error:`,err)
        alert(`FAiled to add to cart. Try again.`)
    }
})

//zooming
document.querySelectorAll('.zoom-wrapper').forEach(wrapper => {
  const img = wrapper.querySelector('img')
  const lens = wrapper.querySelector('.zoom-lens')
  const result = wrapper.querySelector('.zoom-result')
  const zoomLevel = 3
img.addEventListener('mouseenter', () => {
    lens.style.display = 'block'
    result.style.display = 'block'
    result.style.backgroundImage = `url('${img.src}')`
    result.style.backgroundSize = `${img.width * zoomLevel}px ${img.height * zoomLevel}px`
  })

img.addEventListener('mouseleave', () => {
    lens.style.display = 'none'
    result.style.display = 'none'
  })
img.addEventListener('mousemove', (e) => {
  const rect = img.getBoundingClientRect()
  let x = e.clientX - rect.left - lens.offsetWidth / 2
  let y = e.clientY - rect.top - lens.offsetHeight / 2
  x = Math.max(0, Math.min(x, img.width - lens.offsetWidth))
  y = Math.max(0, Math.min(y, img.height - lens.offsetHeight))
  lens.style.left = `${x}px`
  lens.style.top = `${y}px`
  result.style.left = `${e.clientX + 20}px`
  result.style.top = `${e.clientY - 175}px`
  result.style.backgroundPosition = `-${x * zoomLevel}px -${y * zoomLevel}px`
})
})