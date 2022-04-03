import express from "express";
import "path";
import http from "http";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const games = new Map();
io.on("connection", (_socket) => {
    _socket.on("disconnect", () => {
        console.log("a user disconnected");
    });
    const socket = _socket;
    console.log("a user connected");
    socket.on("createGame", (game) => {
        console.log("creating game", game);
        games.set(game.roomCode, game);
    });
    socket.on("startGame", (roomCode, fromAddress) => {
        const game = games.get(roomCode);
        if (!game)
            return;
        if (game.isStarted())
            return;
    });
    socket.on("joinGame", (roomCode, player) => {
        console.log("joinGame", roomCode, player);
        const game = games.get(roomCode);
        console.log("game", game);
        console.log(games);
        if (!game)
            return;
        if (game.isStarted())
            return;
        console.log("found game", game);
        if (game.addPlayer(player)) {
            console.log("added player", player);
            io.emit("updatePlayers", { player: player, roomCode: game.roomCode });
            io.emit("joinedGame", { game });
        }
        else {
            console.log("player already exists:", player);
        }
    });
});
server.listen(3000, () => console.log("SERVER IS LISTENING!"));
//# sourceMappingURL=main.js.map