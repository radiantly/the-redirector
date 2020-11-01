document.body.insertAdjacentHTML("beforeend", `
<img id="fake-cursor" src="https://gettricked.online/jack.png">
<style>
#fake-cursor {
    position: fixed;
}
body {
    cursor: none !important;
}
`);
const fc = document.getElementById("fake-cursor");

$("body").on({
    mousemove: e => {
        $("#fake-cursor").show();
        $('#fake-cursor').css({
            left: e.pageX,
            top: e.pageY
        });
    },
    mouseout: e => {
        $("#fake-cursor").hide();
    }
});


