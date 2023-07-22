let buttonSet = new Set()
let targetSet = new Set()
let switchSet = new Set()
let solutionSet = new Set()

let currentMap = new Map()
let invCurrMap = new Map()

let buttonIds = []

let hover = false

let switchdiv = document.querySelector(".switchdiv")
let distdiv = document.querySelector(".distance")
let board = document.getElementById("board")
let helpBox = document.querySelector(".helpBox")

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

function switchStateToggle(){
    // let switchdiv = document.querySelector(".switchdiv")
    switchdiv.classList.toggle('switches-display')
}

function distanceToSolveToggle(){
    // let distdiv = document.querySelector(".distance")
    distdiv.classList.toggle('distance-display')
}

function hoverEffectToggle(){
    hover = !(hover)

    buttonIds.forEach(id =>{
        let button = document.getElementById(id)
        
        if(hover){
            button.onmouseenter = function() {buttonHover(id)}
            button.onmouseleave = function() {buttonHoverOff(id)}
        }else{
            // why doesnt this code below work??
            // button.removeEventListener("mouseenter", function() {buttonHover()})
            // button.removeEventListener("mouseleave", function() {buttonHoverOff()})
            button.onmouseenter = ""
            button.onmouseleave = ""
        }
        
    })
}

function showHelp(){
    helpBox.classList.toggle("help-open")
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
    if(!helpBox.contains(event.target) && !document.getElementById("info").contains(event.target)){
        helpBox.classList.remove("help-open")
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
    board.innerHTML = ""

    // add new buttons
    buttonIds.forEach(id =>{
        let button = document.createElement("div")
        board.append(button)
        button.id = id
        button.setAttribute("class", "default")
        button.onclick = function() {toggle(id)} 
        
        if(hover){
            button.onmouseenter = function() {buttonHover(id)}
            button.onmouseleave = function() {buttonHoverOff(id)}
        }      
    })

    newTarget()
}

// Render New Targets
function newTarget(){
    newTargetSequence()
    solveTarget()
    resetButtons()
    renderSwitchStates()
    distanceToSolve()
} 

// create Target Sequence
function newTargetSequence(){

    targetSet.clear()
    solutionSet.clear()

    buttonIds.forEach(id => {
        document.getElementById(id).classList.remove("target-on")

        if(randInt(2)==1){
            targetSet.add(id)
            document.getElementById(id).classList.add("target-on")
        }
    })   
}

function solveTarget(){
    buttonIds.forEach(id =>{
        if(targetSet.has(id)){
            solutionSet = symmetricDifference(solutionSet, invCurrMap.get(id))
        }
    })
}

function resetButtons(){
    switchSet.clear()
    buttonSet.clear()

    buttonIds.forEach(id =>{
        document.getElementById(id).classList.remove("button-on")
    })
}

function renderSwitchStates(){
    switchdiv.innerHTML = ""
    switchSet.forEach(id =>{
        switchdiv.innerText += id
    })
}

// Button press function
function toggle(buttonId){
    
    switchSet = symmetricDifference(switchSet, buttonId)

    const toggleButtons = currentMap.get(buttonId).map(id => `${id}`)
    toggleButtons.forEach(id => {
        document.getElementById(id).classList.toggle("button-on")
        buttonSet = symmetricDifference(buttonSet, id)
    })

    if(hover){
        buttonHoverOff(buttonId)
        buttonHover(buttonId)
    }


    renderSwitchStates()
    distanceToSolve()
}

// Button hover over function

function buttonHover(buttonId){

    const toggleButtons = currentMap.get(buttonId).map(id => `${id}`)
    toggleButtons.forEach(id => {
        let button = document.getElementById(id)
        if(buttonSet.has(id)){
            button.classList.add("highlight-on")    
        }else{
            button.classList.add("highlight-off")
        }
    })
}

function buttonHoverOff(buttonId){
    const toggleButtons = currentMap.get(buttonId).map(id => `${id}`)
    toggleButtons.forEach(id => {
        let button = document.getElementById(id)
        button.classList.remove("highlight-on")
        button.classList.remove("highlight-off")
    })
}

function distanceToSolve(){
    let dist = symmetricDifference(switchSet, solutionSet).size
    document.getElementById("distanceToSolve").innerText = dist
    if(dist==0){
        solvedPuzzle()
    }
}

function solvedPuzzle(){
    console.log("YOU SOLVED IT")
}


function init(){
    // Default to medium difficulty when loading the page
    setDifficulty(gameMapS8)
}

init()