interface Client {
	address: string;
	name: string;
}

export class Session {

	sessionid: string;
	clients: Array<Client> = [];

	constructor(currentSessionid: string) {
		this.sessionid = currentSessionid;
	}

	AddClient(address: string) {
		//Create a new client and add to array of currently connected clients
		var newClient: Client = {address: address, name: "User"};
		this.clients.push(newClient);
		console.log("Added client " + address);
	}

	RemoveClient(address: string) {
		//find client within array, and remove them
		for (let i = 0; i < this.clients.length; i++) {
			if (this.clients[i].address == address) {
				this.clients.splice(i-1, i);
				console.log("Removed client " + address);
				return;
			}
		}
		console.log("Remove client " + address + " failed.");
	}

}