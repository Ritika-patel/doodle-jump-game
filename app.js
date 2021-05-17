document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint    
    let upTimerId
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let score = 0


 //                  PLATFORM 
    class Platform {
      constructor(newPlatBottom) {
        this.left = Math.random() * 315 + 0.7
        this.bottom = newPlatBottom
        this.visual = document.createElement('div')
  
        const visual = this.visual
        visual.classList.add('platform')
        visual.style.left = this.left + 'px'
        visual.style.bottom = this.bottom + 'px'
        grid.appendChild(visual)
      }
    }
  
 //                    CREATE PLATFORM 
    function createPlatforms() {
      for(let i =0; i < platformCount; i++) {
        let platGap = 600 / platformCount
        let newPlatBottom = 100 + i * platGap
        let newPlatform = new Platform (newPlatBottom)
        platforms.push(newPlatform)
        console.log(platforms)
      }
    }
//                  MOVE PLATFORM
    function movePlatforms() {
      if (doodlerBottomSpace > 200) {
          platforms.forEach(platform => {
            platform.bottom -= 4
            let visual = platform.visual
            visual.style.bottom = platform.bottom + 'px'


            if(platform.bottom < 10) {
              let firstPlatform = platforms[0].visual
              firstPlatform.classList.remove('platform')
              platforms.shift()
              console.log(platforms)
              score++
              var newPlatform = new Platform(700)
              platforms.push(newPlatform)
            }
  
        }) 
      }
      
    }
 //                 CREATING DOODLER 
    function createDoodler() {
      grid.appendChild(doodler)
      doodler.classList.add('doodler')
      doodlerLeftSpace = platforms[0].left
      doodler.style.left = doodlerLeftSpace + 'px'
      doodler.style.bottom = doodlerBottomSpace + 'px'
    }
 //                    FALL 
  function fall() {
    isJumping = false
      clearInterval(upTimerId)
      downTimerId = setInterval(function () {
        doodlerBottomSpace -= 5
        doodler.style.bottom = doodlerBottomSpace + 'px'
        if (doodlerBottomSpace <= 0) {
          gameOver()
        }
        platforms.forEach(platform => {
          if (
            (doodlerBottomSpace >= platform.bottom) &&
            (doodlerBottomSpace <= (platform.bottom + 15)) &&
            ((doodlerLeftSpace + 60) >= platform.left) && 
            (doodlerLeftSpace <= (platform.left + 85)) &&
            !isJumping
            ) {
              console.log('landed')
              startPoint = doodlerBottomSpace
              jump()
              
 //            isJumping = true
            }
        })
  
      },20)
  }
 //                      JUMP 
    function jump() {
      clearInterval(downTimerId)
      isJumping = true
      upTimerId = setInterval(function () {

        doodlerBottomSpace += 20
        doodler.style.bottom = doodlerBottomSpace + 'px'
        if (doodlerBottomSpace > startPoint + 200) {
          fall()
          isJumping = false
        }
      },30)
    }
  
    
  

    //                  MOVE LEFT
    function moveLeft(){
        if(isGoingRight){
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(function(){
            if(doodlerLeftSpace >= 0){
            doodlerLeftSpace -= 5
            doodler.style.left = doodlerLeftSpace + 'px'
            }else moveRight()
        },20)
    }

    //               MOVE RIGHT
    function moveRight(){
        if(isGoingLeft){
          clearInterval(leftTimerId) 
          isGoingLeft = false 
        }
        isGoingRight = true
        rightTimerId = setInterval(function(){
            if(doodlerLeftSpace <= 313){
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            }else moveLeft()
        },20)
    }
 //                         MOVE STRAIGHT
 function moveStraight(){
     isGoingRight = false
     isGoingLeft = false
     clearInterval(rightTimerId)
     clearInterval(leftTimerId)
 }


     //             assign functions to keyCodes
     function control(e) {
      doodler.style.bottom = doodlerBottomSpace + 'px'
      if(e.key === 'ArrowLeft') {
        moveLeft()
      } else if (e.key === 'ArrowRight') {
        moveRight()
      } else if (e.key === 'ArrowUp') {
        moveStraight()
      }
    }

    //                 GAME OVER
    function gameOver() {
      isGameOver = true
      while(grid.firstChild){
        grid.removeChild(grid.firstChild)
      }
      grid.innerHTML = score
      console.log("game over")
      clearInterval(upTimerId)
      clearInterval(downTimerId)
      clearInterval(leftTimerId)
      clearInterval(rightTimerId)

    }
  
 //                     START 
    function start() {
      if (!isGameOver) {
        createPlatforms()
        createDoodler()
        setInterval(movePlatforms,30)
        jump(startPoint)
        document.addEventListener('keyup', control)
    
      } 
    }
    start()
  })