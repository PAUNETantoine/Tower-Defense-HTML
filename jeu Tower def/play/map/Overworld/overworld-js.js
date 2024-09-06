var btn1 = document.getElementById("menu")
var btn2 = document.getElementById("start")
var canvas = document.getElementById("canvas")
var canvasHP = document.getElementById("HP")
var HP = canvasHP.getContext('2d')
var ctx = canvas.getContext('2d')
var coo = document.getElementById('Coordo')
var xBloc = 0;
var yBloc = 0;
var blocPoser = 0;
var firstRound = true
var xChemin = 0;
var yChemin = 384;
var arrivee = false;
var plancheBois = 0;
let chronomètre =  5;
let mobsSurLaMap = [];
let vagues = 1
let mobsParVagues = 10 //Nombre de mobs au départ



let chemins = 
[//anti-erreur
    [0,0,0,0,0,0,0,0,0,0,3,3,3],//y = 64
    [0,0,0,0,0,0,0,0,0,0,3,3,3],
    [0,0,0,0,0,0,0,0,0,0,3,3,3],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],//4=Bloc de pierre, 3= cabane,1=sable
    [4,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],// y 64*13
    [7,7,7,7,7,7,7,7,7,7,7,7,7]//anti-erreur
]


function PVauDepart(){
    var i = 0;
    let hearth = new Image()
    hearth.onload = function() {
        if(i == 0)
        {
            HP.drawImage(hearth,0,0)
            i=1
        }
        while (i < 10){
            console.log(i)
            HP.drawImage(hearth,32*i,0)
            i++
        }
    }
    hearth.src = 'images/hearth.png'
}
PVauDepart()


function positionBloc(xBloc, yBloc){
    while (blocPoser < 169){//Nombre max de blocs posables
        blocPoser = blocPoser + 1
        let bloc = new Image()//Création de l'image "bloc d'herbe" et positionne celle ci dans le canvas
        bloc.onload = function() {
            ctx.drawImage(bloc, xBloc, yBloc);
            xBloc = xBloc + 64

            if (xBloc == 832)//Retour vers Y + 1
            {
                xBloc = 0
                yBloc = yBloc + 64
            }
        }
    bloc.src = 'images/herbe64x64.jpg';
    }
}




function mapGenerator(){
    let spawn = new Image()// Bloc de pierre pour le spawn
    spawn.onload = function() {
        ctx.drawImage(spawn, 0, 448 -64)
    
        let player = new Image()
        player.onload = function() {
            ctx.drawImage(player, 0, 384)
        }
        player.src="images/steve right.png"

    }
    spawn.src = 'images/pierre.png'

    let houseWhitoutSteve = new Image()// Maison sans Steve
    houseWhitoutSteve.onload = function() {
        ctx.drawImage(houseWhitoutSteve, 640, 0)
    }
    houseWhitoutSteve.src = "images/house whithout steve.png"
    playerMoves()
}



window.addEventListener('load', function loading(){//Charge la carte
    positionBloc(xBloc,xBloc)
    mapGenerator()
})



let player = new Image()
player.onload = function() {
    ctx.drawImage(player, 0, 384)
}
player.src="images/steve right.png"



btn1.addEventListener('click', function menu(){//Retour Menu
    location.replace("../../../main.html")
})



btn2.addEventListener('click', function start(){// Initialise le joueur

})



function playerMoves()
{
    playerPostionX = 0;
    playerPostionY = 384;
    let player = new Image()
    player.onload = function() {
        ctx.drawImage(player, 0, 384)
    }
    player.src="images/steve right.png"
    return playerPostionX, playerPostionY, player
}



function PostionCurseurX(canvas, event) {//Permet de trouver la postion du curseur lors du clic sur la canvas et de retourner sa valeur x.
    const rect = canvas.getBoundingClientRect()
    const xSour = event.clientX - rect.left  
    return (xSour)
}



function PostionCurseurY(canvas, event) {//Permet de trouver la postion du curseur lors du clic sur la canvas et de retourner sa valeur y.
    const rect = canvas.getBoundingClientRect()
    const ySour = event.clientY - rect.top 
    return (ySour)
}



canvas.addEventListener('mousedown', function(e)// Permet de lancer une fonction lors d'un clic sur le canvas.
{
    xSouris = PostionCurseurX(canvas, e)
    ySouris = PostionCurseurY(canvas, e)
    PostionChemin(xSouris, ySouris)
})




function PostionChemin(xS, yS)
{
    if (arrivee == false)
    {
        var compteurX = 0;
        var compteurY = 0;


        while (xS > 0){//Trouver la position du clic x
            xS = xS - 64
            compteurX++
        }
        while (yS > 0){//Trouver la position du clic y en coordonnée non multipliée par 64
            yS = yS - 64
            compteurY++
        }




        xChemin = compteurX * 64 //coordonnées x 64
        yChemin = compteurY * 64



        //EMPECHER DE REMETTRE LE PERSONNAGE SUR UN BLOC DE SABLE DEJA PLACER !
        if (chemins[compteurY-1][compteurX-1])//Ne pas recliquer sur la même case
        {
            return
        }


        if(compteurY-1>0){//Empecher de poser du sable côte à côte


            if(chemins[compteurY-1][compteurX-2]==1 && chemins[compteurY-1][compteurX]==1)//Empecher de poser du sable côte à côte
            {
                return
            }   

            if(chemins[compteurY-2][compteurX-1]==1 && chemins[compteurY][compteurX-1]==1)//Empecher de poser du sable côte à côte
            {
                return
            }

            if(chemins[compteurY][compteurX-2]==1 && chemins[compteurY][compteurX]==1)//Empecher de poser du sable côte à côte
            {
                return
            }

            if(chemins[compteurY][compteurX-2]==1 && chemins[compteurY-2][compteurX-1]==1)//Empecher de poser du sable côte à côte
            {
                return
            }

            if(chemins[compteurY-2][compteurX-1]==1 && chemins[compteurY-1][compteurX]==1)//Empecher de poser du sable côte à côte
            {
                return
            }

            if(chemins[compteurY-2][compteurX-1]==1 && chemins[compteurY-1][compteurX-2]==1)//Empecher de poser du sable côte à côte
            {
                return
            }

            if(chemins[compteurY-1][compteurX-2]==1 && chemins[compteurY][compteurX-1]==1)//Empecher de poser du sable côte à côte
            {
                return
            }

            if(chemins[compteurY-2][compteurX-2]==1 && chemins[compteurY-1][compteurX]==1)//Empecher de poser du sable côte à côte
            {
                return
            }

            if(chemins[compteurY-2][compteurX-2]==1 && chemins[compteurY][compteurX-1]==1)//Empecher de poser du sable côte à côte
            {
                return
            }
        
        }//Fin empecher de poser du sable côte à côte


        if (xChemin == 64 && yChemin == 448 || xChemin >= 704 && yChemin == 64 || xChemin >= 704 && yChemin == 128 || xChemin >= 704 && yChemin == 192){//Empêche de faire des chemins sur la cabane
            return
        }
        if (xChemin-64 > playerPostionX +64)//Début de la règle des déplacmement(seulement gauche droite haut bas sur les blocs a côter)
        {
            return
        }else if (xChemin < playerPostionX){
            return
        }else if (yChemin-64 > playerPostionY +64){
            return
        }else if (yChemin < playerPostionY)
        {
            return
        }else if (yChemin-64 < playerPostionY && xChemin-64 < playerPostionX)
        {
            return
        }else if (yChemin-64 > playerPostionY && xChemin-64 > playerPostionX)
        {
            return
        }else if (yChemin-64 < playerPostionY && xChemin-64 > playerPostionX)
        {
            return
        }else if (yChemin-64 > playerPostionY && xChemin-64 < playerPostionX)
        {
            return
        }//fin règle des déplacements

        let chemin = new Image()//Création de l'image "bloc d'herbe" et positionne celle ci dans le canvas
        chemin.onload = function() {
            ctx.drawImage(chemin, xChemin -64, yChemin -64);
            if (firstRound == true){
                let player = new Image()
                player.onload = function() {
                    ctx.drawImage(player, xChemin -64, yChemin -64)
                }
                player.src="images/steve right.png"
                firstRound = false
            }    
        }
        chemin.src = 'images/sand.png';

        var coo = document.getElementById('Coordo')
        coo.textContent = "x="+xChemin + 'y='+ yChemin

        moving(xChemin -64,yChemin - 64)

        
        if (xChemin == 768 && yChemin == 256)
        {
            arrivee = true
        }

        plancheBois = plancheBois + 10//Augmentation du nombre de planches pour chaques blocs placés

        let planches = document.getElementById("nbPlanche")
        planches.innerHTML = "      : "+ plancheBois//compteur de blocs

        stockerChemin(xChemin,yChemin)

        return firstRound, arrivee, plancheBois
    }
}



function moving(x, y)// Pose le joueur sur la case qui viens d'être cliquée
{
    //Rentre le joueur dans la cabane
    if (x == 704 && y == 192)
    {
        let houseWithSteve = new Image();
        houseWithSteve.onload = function(){
            ctx.drawImage(houseWithSteve, 640, 0)
            ctx.clearRect(704, 192, 64, 64)
            let chemin = new Image();
            chemin.onload = function()
            {
                ctx.drawImage(chemin, 704, 192)
            }
            chemin.src = "images/sand.png"
        }
        houseWithSteve.src = "images/steve in house.png"


    }
    //Si c'est le spawn, remplacer par la pierre
    if(playerPostionX == 0 && playerPostionY == 384){
        ctx.clearRect(playerPostionX, playerPostionY, 64, 64)// enlève l'ancien bloc sur lequel était le joueur
        let spawn = new Image()// Bloc de pierre pour le spawn
        spawn.onload = function() 
        {
            ctx.drawImage(spawn, 0, 448 -64)
        }
        spawn.src = 'images/pierre.png'
        playerPostionY = y;
        playerPostionX = x;
        return playerPostionX, playerPostionY
    }else if (playerPostionX == x && playerPostionY == y)//Redessine le joueur si reclic sur la même case
    {
        let player = new Image()
        player.onload = function() {
            ctx.drawImage(player, x, y)
        }
        player.src="images/steve right.png"
        
        return
    }else{
    //Sinon, mettre le joueur sur la nouvelle case et remplacer par le sable l'ancienne
    ctx.clearRect(playerPostionX, playerPostionY, 64, 64)// enlève l'ancien bloc sur lequel était le joueur
    


    let chemin = new Image()//Redessine le chemin à l'emplacement précédent
    chemin.onload = function() {
        ctx.drawImage(chemin, playerPostionX, playerPostionY)//Permet de changer la position du joueur selont sa direction
        if (x > playerPostionX || x < playerPostionX){
            let player = new Image()
            player.onload = function() {
                ctx.drawImage(player, x, y)
            }
            player.src="images/steve right.png"
            }else if (y > playerPostionY || y < playerPostionY){//Permet de changer la position du joueur selont sa direction
                let player = new Image()
                player.onload = function() {
                    ctx.drawImage(player, x, y)
                }
                player.src="images/steve.png"
            }
        playerPostionX = x;
        playerPostionY = y;
        
    }
    chemin.src="images/sand.png";



    return playerPostionX, playerPostionY
}

}


function stockerChemin(xChem, yChem)//Permet de stocker là ou sont les bloc de sable sur la map et empêche de mettre côte a côte2 blocs de sable
{
    x = xChem / 64 
    y = yChem / 64

    chemins[y-1][x-1] = 1//Ajoute 1 là ou est le bloc de sable

    console.log(chemins)

    if (chemins[y-1][x-1] == 3)
    {
        return
    }
    return chemins
}

btn2.onclick = function(){//Début des vagues
    if (arrivee == true){// Seulement si on a fini de tracer le parcour
        btn2.remove()


        function ChronoAugmenter(){//Augmentation du chrnomètre et changement de l'affichage sur le HTML                                                                                     1ère
            chronomètre--
            let affichageChrono = document.getElementById("chrono")
            affichageChrono.innerHTML = chronomètre
            if (chronomètre == 0)
            {
                chronomètre == 20
                affichageChrono.innerHTML = "incoming"
                clearInterval(compteARebour)
                mobsTypeForThisWave()
            }
            return chronomètre, compteARebour
        }



        function relancerCompteARebourd(){//Relancer le compte à rebourd à chaques nouvelles vagues
            compteARebour = setInterval(ChronoAugmenter,1000)
            return compteARebour
        }

        relancerCompteARebourd()



        class Mobs{//Initialisation des Mobs
            constructor(PV,speed,advantage,loot,texture,posX,posY){//PV= vie,speed = vitesse de déplacement, advantage = prend des dégats dans l'eau / la lave /se divise quand il meurt ?, loot = nombre de planche données si tuer, texture = src de texture
                this.PV = PV;
                this.speed = speed;
                this.advantage = advantage;
                this.loot = loot;
                this.texture = texture;
                this.x = posX*64
                this.y = posY*64
            }

            damages(degats){//mettre des dégats au mob
                this.PV = this.PV - degats
                if (this.PV <= 0){
                    plancheBois = plancheBois + this.loot//Ajout des planches
                }
            }

            spawn(){//Faire spawn la texture sur le bon bloc
                x = this.x
                y = this.y
                let mobTexture = new Image();
                mobTexture.onload = function(){
                    ctx.drawImage(mobTexture,y,x+12)
                }
                mobTexture.src = this.texture;
            }

            walk(){
                console.log(chemins[this.x/64][this.y/64])
                if(chemins[this.x/64][this.y/64+1] == 1){
                    ctx.clearRect(this.y,this.x,64,64)
                    this.x +=5
                    this.y +=5
                    let i = 0
                    while(i<mobsSurLaMap.length)
                    {
                        
                        mobsSurLaMap[i].spawn()
                        i++
                    }
                    i = 0 
                }
            }

        }


        function spawnAutomatiqueDesMobs(PV,speed,advantage,loot,texture,posX,posY){//Fonction qui fera spawn les mobs en les mettans dans la variable mobsSurLaMap (tableau)                   3ème fct
            let derniereVague = 1 //Garder en mémoire la dernière vague

            if (vagues > derniereVague){ //Augmenter le nombre de PV des mobs à chaques vagues
                derniereVague = vagues
                mobsParVagues += 10
                PV = PV * 1,25 + derniereVague * 10//Augmentation des PVs de 25% et 10HP/vague
            }
    
            
            mobsSurLaMap.push(new Mobs(PV,speed,advantage,loot,texture,posX,posY))

            mobsEnTout.innerHTML = " : "+mobsSurLaMap.length
    

            //Spawn sur la carte//////////////////////////
            let indentation = 0
            while (indentation < mobsSurLaMap.length){//Faire spawn les images sur la Map au spawn
                mobsSurLaMap[indentation].spawn()
                console.log("yo")
                indentation++
            }

            
            return mobsSurLaMap, derniereVague, mobsParVagues, derniereVague, mobsParVagues
        }
        

        function mobsTypeForThisWave(){//Juste mobs de base                                                                                                                        2ème fct
            var i = 0
                interval = setInterval(function(){
                    i++
                    function entierAleatoire(min, max)//Choix d'un mob aléatoire (1=Zombie,2=Squelette,3=creeper,4=spider)
                    {
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    }
                
                    var entier = entierAleatoire(1,4);

                    console.log(entier)

                    if(i==mobsParVagues){
                        clearInterval(interval)
                    }


                    if (entier == 1)
                    {
                        spawnAutomatiqueDesMobs(50,1,null,10,"images/zombie1.png",6,0)
                    }else if (entier == 2)
                    {
                        spawnAutomatiqueDesMobs(50,1,null,10,"images/squelette1.png",6,0)
                    }
                    else if (entier == 3)
                    {
                        spawnAutomatiqueDesMobs(50,1,null,10,"images/creeper1.png",6,0)
                    }
                    else if (entier == 4)
                    {
                        spawnAutomatiqueDesMobs(50,1,null,10,"images/spider1.png",6,0)
                    }
                    walking()
                }
                    ,3000)
            }
        function walking(){
            mobsSurLaMap[0].walk()
        }

    }
}


