let canvas = document.querySelector('canvas')
let context = canvas.getContext('2d')
let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight
let nodesMaxRadius = 4, nodesColor = '#000000', nodes = []
let animationFrameId = null

let maxDistance = width < 600 ? 50 : 60
let nodesNumber = width < 600 ? 250 : 350
let nodesSpeed = width < 600 ? 1 : 1
let colors = ['#54BAB9', '#FF7396', '#F4E06D', '#53BF9D', '#5FD068', '#C70A80']

function startAnimation () {
    context.clearRect(0, 0, width, height)
    moveNodes()
    drawLineBetweenNodes()
    drawNodes()
    drawTriangles()
    animationFrameId = requestAnimationFrame(startAnimation);
}
function createRandomNodes () {
    for (let i = 0; i < nodesNumber; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            xVelocity: Math.random() * nodesSpeed - nodesSpeed / 2,
            yVelocity: Math.random() * nodesSpeed - nodesSpeed / 2,
            radius: Math.random() * nodesMaxRadius,
            connected: false,
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
function drawTriangles () {
    for (let i = 0; i < nodes.length - 1; i++) {
        let nearNodes = nodes.filter(node => !node.connected && Math.abs(nodes[i].x - node.x) < maxDistance && Math.abs(nodes[i].y - node.y) < maxDistance)
        let twoNearNode = nearNodes.sort((a,b) => a - b).slice(1, 3);
        if (twoNearNode.length < 2) {
            continue
        }
        context.beginPath()
        context.moveTo(nodes[i].x, nodes[i].y)
        context.lineTo(twoNearNode[0].x, twoNearNode[0].y)
        context.lineTo(twoNearNode[1].x, twoNearNode[1].y)
        context.closePath()
        let color = colors[Math.floor(Math.random() * colors.length)]
        context.fillStyle = 'rgba(0, 0, 0, .4)'
        context.fill()
        twoNearNode = twoNearNode.map(item => {
            item.connected = true
            return item
        })
        nodes[i].connected = true
    }
    nodes = nodes.map(item => {
        item.connected = false
        return item
    })
}

function getNodesDistance (node1, node2) {
    return Math.sqrt(Math.pow((node1.x - node2.x), 2) + Math.pow((node1.y - node2.y), 2))
}
function keyboardListener () {
    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space' && animationFrameId) {
            cancelAnimationFrame(animationFrameId)
            animationFrameId = null
        } else if (e.code === 'Space') {
            startAnimation()
        }
    })
}
createRandomNodes()
startAnimation()
keyboardListener()
