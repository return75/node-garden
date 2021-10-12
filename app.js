let canvas = document.querySelector('canvas')
let context = canvas.getContext('2d')

let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight
let nodesNumber = 350
let maxDistance = 100
let nodesMaxRadius = 4
let nodesColor = '#fff'
let nodesSpeed = 2

let nodes = []

function startAnimation () {
    context.clearRect(0, 0, width, height)
    setBackgroundForCanvas()
    moveNodes()
    drawLineBetweenNodes()
    drawNodes()
    requestAnimationFrame(startAnimation);
}
function setBackgroundForCanvas () {
    let gradient = context.createRadialGradient(width / 2, height / 2, height / 20, width / 2, height / 2, height);
    gradient.addColorStop(0, "#035773");
    gradient.addColorStop(1, "#000");

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
}
function createRandomNodes () {
    for (let i = 0; i < nodesNumber; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            xVelocity: Math.random() * nodesSpeed - nodesSpeed / 2,
            yVelocity: Math.random() * nodesSpeed - nodesSpeed / 2,
            radius: Math.random() * nodesMaxRadius
        })
    }
}
function moveNodes () {
    nodes.forEach(node => {
        if (node.x >= width || node.x <= 0) {
            node.xVelocity *= -1
        }
        if (node.y >= height || node.y <= 0) {
            node.yVelocity *= -1
        }
        node.x += node.xVelocity
        node.y += node.yVelocity
    })
}
function drawNodes () {
    nodes.forEach(node => {
        context.beginPath()
        context.arc(node.x, node.y, node.radius, 0, 2 * Math.PI)
        context.fillStyle = nodesColor
        context.fill()
    })
}
function drawLineBetweenNodes () {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            let distance = getNodesDistance(nodes[i], nodes[j])
            if (distance < maxDistance) {
                context.beginPath()
                context.moveTo(nodes[i].x, nodes[i].y)
                context.lineTo(nodes[j].x, nodes[j].y)
                context.strokeStyle = nodesColor
                context.lineWidth = 1 - distance / maxDistance
                context.stroke()
            }

        }
    }
}
function getNodesDistance (node1, node2) {
    return Math.sqrt(Math.pow((node1.x - node2.x), 2) + Math.pow((node1.y - node2.y), 2))
}

createRandomNodes()
startAnimation()

