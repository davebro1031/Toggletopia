// Create game maps

// Super Paper Mario map
const gameMapSPM = new Map();

gameMapSPM.set('1', [1, 3, 5, 7, 8])
gameMapSPM.set('2', [1, 2, 3, 6, 7])
gameMapSPM.set('3', [1, 2, 3, 4, 5])
gameMapSPM.set('4', [2, 4, 6, 7, 8])
gameMapSPM.set('5', [1, 4, 5, 6, 7])
gameMapSPM.set('6', [2, 4, 5, 6, 8])
gameMapSPM.set('7', [2, 3, 5, 7, 8])
gameMapSPM.set('8', [1, 3, 4, 6, 8])

/* 
Symmetric, injective map on 8 blocks

Symmetric here means that if block X targets A,B,C,D,and X, 
Then it is also targeted BY A, B, C, D, and X
 
Injective means that each of the 2^8 possible combinations of button clicks
corresponds to a unique sequence of on/off buttons (of which there are 2^8)

This means that each of the possible puzzles is solveable
*/

const gameMapS8 = new Map();

gameMapS8.set('1', [1, 2, 3, 5, 7])
gameMapS8.set('2', [1, 2, 4, 6, 8])
gameMapS8.set('3', [1, 3, 4, 6, 7])
gameMapS8.set('4', [2, 3, 4, 7, 8])
gameMapS8.set('5', [1, 5, 6, 7, 8])
gameMapS8.set('6', [1, 2, 3, 5, 7])
gameMapS8.set('7', [1, 2, 3, 5, 7])
gameMapS8.set('8', [1, 2, 3, 5, 7])

// Symmetric, injective map on 5 blocks
const gameMapS5 = new Map();

gameMapS5.set('1', [1,2,4])
gameMapS5.set('2', [1,2,3])
gameMapS5.set('3', [2,3,5])
gameMapS5.set('4', [1,4,5])
gameMapS5.set('5', [3,4,5])





// Choose the specific game map to be played
currentMap = gameMapSPM

// Set button IDs:
let buttonIds = [...currentMap.keys()]

// Set the target IDs:
let targetIds = buttonIds.map(item => item+"t")






// random integer generator 
function randInt(max){
    return Math.floor(Math.random()*max)
} 





// create target sequence

function newTarget(){

    for(i in targetIds){
        document.getElementById(targetIds[i]).setAttribute("class", "off")

        if(randInt(2)==1){
            document.getElementById(targetIds[i]).setAttribute("class", "on")
        }
    }
    
}

console.log(newTarget())


// Button press function
function toggle(buttonId){
    const targetButtons = currentMap.get(buttonId)

    targetButtons.forEach(item =>{
        currentButton = document.getElementById(item.toString(10))        
        if(currentButton.getAttribute("class") == "on"){
            currentButton.setAttribute("class","off")
        }else{
            currentButton.setAttribute("class", "on")
        }
        
    })
}