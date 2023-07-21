const t10 = new Map()
t10.set(1, "target-on")
t10.set(0, "target-off")

const b10 = new Map()
b10.set(1, "button-on")
b10.set(0, "button-off")

let buttonSet = new Set()
let targetSet = new Set()
let switchSet = new Set()

let currentMap = new Map()
let invCurrMap = new Map()
let buttonIds = []

let buttonStates = new Map();
let targetStates = new Map();
let switchStates = new Map();

// symmetric different for sets
function symmetricDifference(setA, setB) {
    const _difference = new Set(setA);
    for (const elem of setB) {
      if (_difference.has(elem)) {
        _difference.delete(elem);
      } else {
        _difference.add(elem);
      }
    }
    return _difference;
}

// random integer generator 
function randInt(max){
    return Math.floor(Math.random()*max)
}

let switchdiv = document.querySelector(".switchdiv")
let distdiv = document.querySelector(".distance")

function switchStateToggle(){
    let switchdiv = document.querySelector(".switchdiv")
    switchdiv.classList.toggle('switches-display')
}

function distanceToSolveToggle(){
    let distdiv = document.querySelector(".distance")
    distdiv.classList.toggle('distance-display')
}

// Create Dropdown menu(s)

const dropdowns = document.querySelectorAll('.dropdown')

dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select')
    const caret = dropdown.querySelector('.caret')
    const menu = dropdown.querySelector('.menu')
    const options = dropdown.querySelectorAll('.menu li')
    const selected = dropdown.querySelector('.selected')

    select.addEventListener('click', () => {
        select.classList.toggle('select-clicked')
        
        caret.classList.toggle('caret-rotate')

        menu.classList.toggle('menu-open')

    })

    // THIS DOESN'T WORK AND IDK WHY
    // document.onclick = function(event){
    //     if(!select.contains(event.target) && !menu.contains(event.target)){
    //         select.classList.remove('select-clicked')
    //         menu.classList.remove('menu-open')
    //         caret.classList.remove('caret-rotate') 
    //     }
    // }

    options.forEach(option =>{
        option.addEventListener('click', () => {
            selected.innerText = option.innerText

            select.classList.remove('select-clicked')

            caret.classList.remove('caret-rotate')

            menu.classList.remove('menu-open')

            options.forEach(option => {
                option.classList.remove('active')
            })

            option.classList.add('active')
        })
    })

})

// Create hints menu

const settings = document.getElementById('settings')

const settingsSelect = settings.querySelector('.settingsSelect')
const settingsMenu = settings.querySelector('.settingsMenu')

settingsSelect.addEventListener('click', () => {
    settingsMenu.classList.toggle('menu-open')
})

// Close menus when you click somewhere other than inside it

document.onclick = function(event){
    if(!settingsSelect.contains(event.target) && !settingsMenu.contains(event.target)){
        settingsMenu.classList.remove('menu-open') 
    }
}

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
gameMapS8.set('6', [2, 3, 5, 6, 8])
gameMapS8.set('7', [1, 3, 4, 5, 7])
gameMapS8.set('8', [2, 4, 5, 6, 8])

// Symmetric, injective map on 5 blocks
const gameMapS5 = new Map();

gameMapS5.set('1', [1,2,4])
gameMapS5.set('2', [1,2,3])
gameMapS5.set('3', [2,3,5])
gameMapS5.set('4', [1,4,5])
gameMapS5.set('5', [3,4,5])

// Map inverter function:  
// Right now this is an extremely unintelligent/slow inverse search.
// It just checks every possible combination of buttons

// takes in a Map (str -> arr), returns a Map (str -> set)
function inverseMap(gameMap){
    idList = [...gameMap.keys()]

    gameMapSets = new Map()
    idList.forEach(id=>{
        gameMapSets.set(id, new Set(gameMap.get(id)))
    })

    const invMap = new Map();

    for(i=0; i < 2**idList.length; i++){
        
        // Each number represents a possible combination of buttons
        // Convert to binary and reverse the digits.  
        // If some digit is 1, consider that button "on", if it is 0 or blank, consider it "off"
        let num = ""
        for(j in i.toString(2)){
            num = i.toString(2)[j] + num
        }

        let outputSet = new Set()
        for(j in num){

            if(num[j]==1){
                outputSet = symmetricDifference(outputSet, gameMapSets.get(idList[j]))
            }
        }
        
        // if the combination of buttons leads to a single button being turned on, this is useful
        // we store this info in the inverse map
        if(outputSet.size == 1){
            let solveId = [...outputSet][0].toString(10)
            let solveIdSet = new Set()

            for(j in num){
                if(num[j]==1){
                    solveIdSet.add(idList[j])
                }
            }
            invMap.set(solveId, solveIdSet)
        }
    }
    return invMap
}


// Choose the specific game map to be played

function setDifficulty(choice){
    currentMap = choice
    invCurrMap = inverseMap(currentMap)

    // console.log(invCurrMap)
    buttonIds = [...currentMap.keys()] 
    
    // clear old game board
    let board = document.getElementById("board")
    board.innerHTML = ""

    // add new buttons
    buttonIds.forEach(id =>{
        let button = document.createElement("div")
        board.append(button)
        button.id = id
        button.onclick = function() {toggle(id)}        
    })

    newTarget()
}

// Render New Targets
function newTarget(){
    newTargetSequence()
    resetButtons()
    renderSwitchStates()
    renderButtons()
    console.log(solveTarget())
    distanceToSolve(solveTarget())
} 

// create Target Sequence
function newTargetSequence(){

    targetSet.clear()
    targetStates.clear()

    buttonIds.forEach(id => {
        targetStates.set(id, randInt(2))
        if(targetStates.get(id)==1){
            targetSet.add(id)
        }
    })   
}

function solveTarget(){
    let targetSolution = new Set()
    buttonIds.forEach(id =>{
        if(targetStates.get(id)==1){
            targetSolution = symmetricDifference(targetSolution, invCurrMap.get(id))
        }
    })
    return targetSolution
}


function distanceToSolve(targetSolution){
    let currentSwitchStates = new Set()

    buttonIds.forEach(id =>{
        if(switchStates.get(id)==1){
            currentSwitchStates.add(id)
        }
    })

    document.getElementById("distanceToSolve").innerText = symmetricDifference(currentSwitchStates, targetSolution).size
    console.log(symmetricDifference(currentSwitchStates, targetSolution).size)

}

function renderSwitchStates(){
    switchdiv.innerHTML = ""
    buttonIds.forEach(id =>{
        switchdiv.innerText += switchStates.get(id)
    })
}


// Button press function

function toggle(buttonId){
    
    switchStates.set(buttonId, (switchStates.get(buttonId)+ 1) % 2)
    renderSwitchStates()

    const toggleButtons = currentMap.get(buttonId).map(id => id.toString(10))
   
    toggleButtons.forEach(id => {
        buttonStates.set(id, (buttonStates.get(id)+ 1) % 2)
    })

    renderButtons()
    distanceToSolve(solveTarget())
    checkSolve()
}

function renderButtons(){
    buttonIds.forEach(id =>{
        
        document.getElementById(id).setAttribute("class", b10.get(buttonStates.get(id))+" "+t10.get(targetStates.get(id)))
        
    })    
}


function checkSolve(){
    let i = true
    buttonIds.forEach(id =>{
        i = i && (buttonStates.get(id) == targetStates.get(id))
    })

    if(i){
        solvedPuzzle()
    }
}

function solvedPuzzle(){
    console.log("YOU SOLVED IT")
}

function resetButtons(){
    buttonStates.clear()
    switchStates.clear()

    buttonIds.forEach(id =>{
        buttonStates.set(id, 0)
    })

    buttonIds.forEach(id =>{
        switchStates.set(id, 0)
    })
}


function init(){
    // Default to medium difficulty when loading the page
    setDifficulty(gameMapS8)
}

init()