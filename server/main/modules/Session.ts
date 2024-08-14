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

	CloseSession() {
		// Remove all clients from the session
		let i = 0;
		while (i < this.clients.length) {
			this.RemoveClient(this.clients[i].address);
		}
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

	RetrieveClient(address: string) {
		//find client within array & return that client ip
		for (let i = 0; i < this.clients.length; i++) {
			if (this.clients[i].address == address) {
				return address;
			}
		}
		return -1;
	}

	RetrieveLastClient() {
		//retrieve the last client in the array, by current logic will retrieve client who started session
		return this.clients[this.clients.length-1].address;
	}

}