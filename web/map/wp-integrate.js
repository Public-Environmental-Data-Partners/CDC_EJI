// Move the full-screen to the banner header
document.body.classList.add("full-screen");
const mapLinks = document.querySelector(".map-links");
document.querySelector(".cdc-page-title h1").appendChild(mapLinks);
document.querySelector(".map-links").style.display = "block";
document.querySelector(".cdc-page-title.cdc-page-offset.syndicate h1").style.display = "flex";

// Add Interactive functionality to map resize on DFE
document.getElementById('mapFull').addEventListener('click', function (e) {
    e.preventDefault();
    document.body.classList.remove('sidebar');
    document.body.classList.add('full-screen');
    window.dispatchEvent(new Event('resize'));
});

document.getElementById('mapSmall').addEventListener('click', function (e) {
    e.preventDefault();
    document.body.classList.add('sidebar');
    document.body.classList.remove('full-screen');
    window.dispatchEvent(new Event('resize'));
});
function sizeMap() {}
window.addEventListener('resize', sizeMap);