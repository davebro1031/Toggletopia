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
    targetStates.set(id, 1)
})

// Set the target IDs:
// let targetIds = buttonIds.map(item => item+"t")

function setDifficulty(choice){
    currentMap = choice   
    buttonIds = [...currentMap.keys()] 


    // targetIds = buttonIds.map(item => item+"t")

    targetStates.clear()
    buttonStates.clear()
    
    // clear old buttonboard
    let buttonboard = document.getElementById("buttons")
    
    while(buttonboard.firstChild){
        buttonboard.removeChild(buttonboard.firstChild)
    }

    // add new buttons
    buttonIds.forEach(item =>{
        let itemdiv = document.createElement("div")
        buttonboard.append(itemdiv)
        itemdiv.id = item
        itemdiv.onclick = function() {toggle(item)}        

    })

    // clear targetboard
    // let targetboard = document.getElementById("targetSequence")
    // while(targetboard.firstChild){
    //     targetboard.removeChild(targetboard.firstChild)
    // }

    // create new targets
    // targetIds.forEach(item =>{
    //     let itemdiv = document.createElement("div")
    //     targetboard.append(itemdiv)
    //     itemdiv.className = "off"
    //     itemdiv.id = item
    // })

    newTarget()
}

// Default to medium difficulty when loading the page
setDifficulty(gameMapS8)



// Generate the levels

// random integer generator 
function randInt(max){
    return Math.floor(Math.random()*max)
} 

// create target sequence

// function newTarget(){

//     for(i in targetIds){
//         document.getElementById(targetIds[i]).setAttribute("class", "off")

//         if(randInt(2)==1){
//             document.getElementById(targetIds[i]).setAttribute("class", "on")
//         }
//     }
    
//     resetButtons()
// }

function newTarget(){

    buttonIds.forEach(id => {
        targetStates.set(id, randInt(2))
    })
    
    // renderTargets()
    resetButtons()
}

// function renderTargets(){
//     buttonIds.forEach(id =>{
//         if(targetStates.get(id)==1){
//             document.getElementById(id+"t").setAttribute("class", "on")
//         }else{
//             document.getElementById(id+"t").setAttribute("class", "off")
//         }
//     })    
// }


// Button press function
// function toggle(buttonId){
    
//     const targetButtons = currentMap.get(buttonId)
    
//     targetButtons.forEach(item =>{
//         currentButton = document.getElementById(item.toString(10))
        
//         let currentClass = currentButton.getAttribute("class")

//         if(currentClass == "button-on"){
//             currentButton.setAttribute("class","button-off")
//         }else{
//             currentButton.setAttribute("class", "button-on")
//         }
        
//     })
    
//     checkSolve()
// }

function toggle(buttonId){
    
    const toggleButtons = currentMap.get(buttonId).map(id => id.toString(10))
   
    toggleButtons.forEach(id => {
        buttonStates.set(id, (buttonStates.get(id)+ 1) % 2)
    })


    // toggleButtons.forEach(item =>{
    //     currentButton = document.getElementById(item)
        
    //     let currentClass = currentButton.getAttribute("class")

    //     if(currentClass == "button-on"){
    //         currentButton.setAttribute("class","button-off")
    //     }else{
    //         currentButton.setAttribute("class", "button-on")
    //     }
        
    // })
    renderButtons()
    checkSolve()
}

function renderButtons(){
    buttonIds.forEach(id =>{
        
        document.getElementById(id).setAttribute("class", b10.get(buttonStates.get(id))+" "+t10.get(targetStates.get(id)))
        
        // if(buttonStates.get(id)==1){
        //     document.getElementById(id).setAttribute("class", "button-on")
        // }else{
        //     document.getElementById(id).setAttribute("class", "button-off")
        // }
    })    
}



function checkSolve(){
    let i = 0
    while(i < buttonIds.length && document.getElementById(buttonIds[i]).getAttribute("class") == document.getElementById(targetIds[i]).getAttribute("class")){
        console.log(i)
        i++
    }

    if(i == buttonIds.length){
        targetIds.forEach(item => {
            if(document.getElementById(item).getAttribute("class") == "off"){
                document.getElementById(item).setAttribute("class", "offSolved")
            }else{
                document.getElementById(item).setAttribute("class", "onSolved")
            }
        })
    }
}

function resetButtons(){
    buttonStates.clear()

    buttonIds.forEach(id =>{
        buttonStates.set(id, 0)
    })

    renderButtons()
}