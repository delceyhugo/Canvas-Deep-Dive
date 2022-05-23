let canvas
let ctx
let flowField
let flowFieldAnimation
const mouse = {
    x: 0,
    y: 0
}


this.onload = () =>{
    canvas = document.querySelector('#canvas')
    ctx = canvas.getContext('2d')
    canvas.width = this.innerWidth
    canvas.height = this.innerHeight
    flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height)
    flowField.animate(0)
}
this.addEventListener('resize', () => {
    cancelAnimationFrame(flowFieldAnimation)
    canvas.width = this.innerWidth
    canvas.height = this.innerHeight
    flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height)
    flowField.animate(0)
})
this.addEventListener('mousemove', (e) => {
    mouse.x = e.x
    mouse.y = e.y
})




class FlowFieldEffect {
    #ctx
    #width
    #height
    constructor(ctx, width, height){
        this.#ctx = ctx
        this.#ctx.lineWidth = 1
        this.#width = width
        this.#height = height
        this.lastTime = 0
        this.interval = 1000/60
        this.timer = 0
        this.cellSize = 15
        this.gradient
        this.#createGradient()
        this.#ctx.strokeStyle = this.gradient
        this.radius = 0
        this.vr = 0.03
    }
    #createGradient(){
        this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height)
        this.gradient.addColorStop('0.1', '#FF5C33')
        this.gradient.addColorStop('0.2', '#FF66B3')
        this.gradient.addColorStop('0.4', '#CCCCFF')
        this.gradient.addColorStop('0.6', '#B3FFFF')
        this.gradient.addColorStop('0.8', '#80FF80')
        this.gradient.addColorStop('0.9', '#FFFF33')
    }
    #drawLine(angle, x, y){
        let positionX = x
        let positionY = y
        let dx = mouse.x - positionX
        let dy = mouse.y - positionY
        let distance = dx * dx + dy * dy
        if(distance > 500000) distance = 500000
        let length = distance * 0.0001

        this.#ctx.beginPath()
        this.#ctx.moveTo(x, y)
        this.#ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
        this.#ctx.stroke()
    }
    animate(timeStamp){
        let deltaTime = timeStamp - this.lastTime
        this.lastTime = timeStamp
        if(this.timer > this.interval){
            this.#ctx.clearRect(0, 0, this.#width, this.#height)
            this.radius += this.vr
            if(this.radius > 5 || this.radius < -5) this.vr *= -1
            for (let y = 0; y < this.#height; y += this.cellSize) {
                for (let x = 0; x < this.#width; x += this.cellSize) {
                    const angle = (Math.cos(x * 0.01) + Math.sin(y * 0.01)) * this.radius
                    this.#drawLine(angle, x, y)
                }
            }


            this.timer = 0
        }else{
            this.timer += deltaTime
        }
        flowFieldAnimation = requestAnimationFrame(this.animate.bind(this))
    }
}
