const WebSocket = require('ws')
// const config = require('./config.json')

const PORT_SOCKET = 8080
const wss = new WebSocket.Server({ port: PORT_SOCKET })
console.log(`web socket running on PORT: ${PORT_SOCKET}`)

var nextId = 1

var roomList = []

wss.on('connection', function connection(ws, req) {
    // const ip = req.socket.remoteAddress;
    ws.myId = nextId++
    console.log('client connected: ', ws.myId)


    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        let obj = JSON.parse(message);
        console.log(obj);

        if (obj.eventName == 'create') {

            console.log('create room: ', obj.roomName)
            let newRoom = {
                roomName: obj.roomName,
                host: ws,
                players: [ws]
            }
            roomList.push(newRoom)
            ws.myRoomName = obj.roomName
            console.log(roomList)

        } else if (obj.eventName == 'join') {

            console.log('join room: ', obj.roomName)
            roomList.forEach(function(room) {

                if (room.roomName == obj.roomName) {
                    console.log('found room to join')
                    room.players.push(ws)
                    ws.myRoomName = obj.roomName

                    // signal other players
                    obj.eventName = 'newMember'
                    // let json = JSON.stringify(obj)
                    room.players.forEach(function(playerWs) {

                        if (playerWs.readyState === WebSocket.OPEN &&
                            playerWs.myId != ws.myId) {
                            playerWs.send(JSON.stringify(obj))
                        }
                    })

                }
            })
            console.log(roomList)




        } else {

            console.log('other events: ' + obj)

            roomList.forEach(function(room){
                if(room.roomName == ws.myRoomName){

                    console.log('sending all in room: ' + room.roomName)
                    room.players.forEach(function(playerWs) {

                        if (playerWs.readyState === WebSocket.OPEN &&
                            playerWs.myId != ws.myId) {
                            playerWs.send(JSON.stringify(obj))
                        }
                    })

                }
            })

            // wss.clients.forEach(function each(client) {
            //     if (client.readyState === WebSocket.OPEN &&
            //         client.myId != ws.myId
            //     ) {
            //         console.log('send to client: ', client.myId)
            //         client.send(message)
            //     }
            // });

            // ws.send('hi');
        }



    });


})