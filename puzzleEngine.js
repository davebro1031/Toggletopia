const gameMap = new Map();

gameMap.set('1', [1, 3, 5, 7, 8])
gameMap.set('2', [1, 2, 3, 6, 7])
gameMap.set('3', [1, 2, 3, 4, 5])
gameMap.set('4', [2, 4, 6, 7, 8])
gameMap.set('5', [1, 4, 5, 6, 7])
gameMap.set('6', [2, 4, 5, 6, 8])
gameMap.set('7', [2, 3, 5, 7, 8])
gameMap.set('8', [1, 3, 4, 6, 8])


function toggle(buttonId){
    const targetButtons = gameMap.get(buttonId)

    targetButtons.forEach(item =>{
        currentButton = document.getElementById(item.toString(10))        
        if(currentButton.getAttribute("class") == "on"){
            currentButton.setAttribute("class","off")
        }else{
            currentButton.setAttribute("class", "on")
        }
        
    })
}