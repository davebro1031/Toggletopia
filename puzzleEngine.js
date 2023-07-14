const t10 = new Map()
t10.set(1, "target-on")
t10.set(0, "target-off")

const b10 = new Map()
b10.set(1, "button-on")
b10.set(0, "button-off")

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

const hints = document.getElementById('hints')

const select = hints.querySelector('.select')
const menu = hints.querySelector('.menu')

select.addEventListener('click', () => {
    select.classList.toggle('select-clicked')
    menu.classList.toggle('menu-open')
})

// Close menus when you click somewhere other than inside it

document.onclick = function(event){
    if(!select.contains(event.target) && !menu.contains(event.target)){
        select.classList.remove('select-clicked')
        menu.classList.remove('menu-open') 
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





// Choose the specific game map to be played

// default
let currentMap = gameMapS8
// Set button IDs:
let buttonIds = [...currentMap.keys()]

let buttonStates = new Map();
buttonIds.forEach(id =>{
    buttonStates.set(id, 0)
})

let targetStates = new Map();
buttonIds.forEach(id => {
    targetStates.set(id, 0)
})

let switchStates = new Map();
buttonIds.forEach(id => {
    switchStates.set(id, 0)
})

function setDifficulty(choice){
    currentMap = choice   
    buttonIds = [...currentMap.keys()] 
    
    // clear old buttonboard
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

// Default to medium difficulty when loading the page
setDifficulty(gameMapS8)


// Generate the levels

// random integer generator 
function randInt(max){
    return Math.floor(Math.random()*max)
} 

// create Target Sequence
function newTargetSequence(){

    targetStates.clear()
    buttonIds.forEach(id => {
        targetStates.set(id, randInt(2))
    })   
}

// Render New Targets
function newTarget(){
    newTargetSequence()
    resetButtons()
    renderButtons()
}

switchdiv = document.querySelector(".switchdiv")

function renderSwitchStates(){
    switchdiv.innerHTML = ""
    buttonIds.forEach(id =>{
        switchdiv.innerText += switchStates.get(id).toString(10)
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

function switchStateToggle(){
    let switchdiv = document.querySelector(".switchdiv")
    switchdiv.classList.toggle('switches-display')
}