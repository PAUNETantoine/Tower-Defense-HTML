btn1 = document.getElementById("btnOW")
btn2 = document.getElementById("btnNether")
btn3 = document.getElementById("btnEnd")
btn4 = document.getElementById("btnMenu")


btn4.addEventListener('click', function menu(){
    location.replace("../main.html")
})

btn1.addEventListener('click', function overworld(){
    console.log("oe")
    location.replace("map/overworld/overworld.html")
})