"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
class Session {
    constructor() {
        this.sessionid = "123abc";
        this.clients = [];
    }
    AddClient(address) {
        //Create a new client and add to array of currently connected clients
        var newClient = { address: address, name: "User" };
        this.clients.push(newClient);
        console.log("Added client " + address);
    }
    RemoveClient(address) {
        //find client within array, and remove them
        for (let i = 0; i < this.clients.length; i++) {
            if (this.clients[i].address = address) {
                this.clients.splice(i - 1, i);
                console.log("Removed client " + address);
                break;
            }
        }
        console.log("Remove client " + address + " failed.");
    }
}
exports.Session = Session;
