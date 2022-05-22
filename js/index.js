document.addEventListener('click', (e) => {
    const { href } = e.target.dataset
    if (href == '../') return (document.location = `../`)
    href && (document.location = `/${href}/index.html`)
})
