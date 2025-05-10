import express, { Express, Request, Response, NextFunction } from "express";
import websocket, { WebSocket, WebSocketServer, RawData } from "ws";
import { Session } from "./modules/Session"

const CORS_ORIGINS = "*" //"http://localhost:5173"
const CORS_METHODS = "POST, GET"
const API_PORT = 10000
const SOCKET_PORT = 10000
const WS_URL = `ws://talkdirect-api.onrender.com:${SOCKET_PORT}/`

const app: Express = express();
var allSessions = new Map<string, Session>();
var socket = new WebSocketServer({ port: SOCKET_PORT });

enum DataIdentifier {
	VIDEO = 0,
	AUDIO = 1,
	STRING = 2,
	ERROR = 3,
	INKBD = 4,
};


// Simple Session Retrieval Function
function RetrieveSession(sessionid: string) {

	return allSessions.get(sessionid);

}

//Create a new session object that will hold client connection info
function CreateNewSession(sessionid: string): Session {

	let newsession: Session = new Session(sessionid);
	allSessions.set(sessionid, newsession); // add session to session map
	return newsession;

}

//Attempt to add client IP to a session
function JoinSession(sessionid: string, ip: string): boolean {

	var desiredsession = RetrieveSession(sessionid); // Attempt to find session
	let clientAmount = RetrieveClients(sessionid);
	if (desiredsession !== undefined) {
		desiredsession.AddClient(ip); // Add client if session exists
		return true; // Return if the session was joined successfully or not
	}
	return false;

}

function RemoveSession(sessionid: string): boolean {
	var targetSession = RetrieveSession(sessionid);
	if (targetSession !== undefined) {
		targetSession.CloseSession()
		allSessions.delete(sessionid);
		return true; // Return if the session was closed successfully or not
	}
	return false;
}

function RetrieveClients(sessionid: string): number {
	let targetSession = RetrieveSession(sessionid);
	if (targetSession !== undefined) {
		return targetSession.RetrieveClientListLength();
	}
	return -1;
}

//Attempt to retrieve session asyncronously with a set amount of retries.
async function tryRetrieveSession(sessionid: string, maxRetries = 3, currentRetries = 0) : Promise<Session> {
	
	var mysession: Session | undefined = RetrieveSession(sessionid); // Try and retrieve a session

	if (mysession == undefined) { 

		if (currentRetries < maxRetries) {

			// If session does not exist, and there are retries left, recursively call tryRetrieveSession to start another attempt.

			console.log("Session not found, trying again in 3 seconds...");
			await new Promise((resolve) => {setTimeout(resolve, 3000)}); // goofy ass 3 second delay
			mysession = await tryRetrieveSession(sessionid, maxRetries, currentRetries + 1);

		} else {

			//Throw an error to be caught and handled by whatever is attempting to retrieve a session.

			console.log("Session could not be found.");
			throw new Error("Failed to find a session after 3 tries");

		}

	}

	// If another attempt hasnt been made, we can assume that the session has been found and we can return it
	return mysession;

}


// SESSION SOCKET 

socket.on("connection", (clientsocket: WebSocket, req: Request) => {
	//TODO: Need to make the whole websocket system to be more RFC compliant, right now it's not and I believe that's why I'm receiving errors
	let sessionid: string = req.url.substring(1); // the URL of a connection is localhost:PORT/[sessionid]. this grabs the sessionid from the end of the URL

	let clientaddress: string = "::1" //default to localhost if address is undefined. this should be changed to terminate the socket in the future.
	if (req.socket.remoteAddress !== undefined) {
		clientaddress = req.socket.remoteAddress;
	}

	tryRetrieveSession(sessionid) // Attempt to find a session
	.then((mysession: Session) => {// Begin accepting messages from client
		console.log("API Accepting messages.");
		mysession.AddClient(clientaddress);

		// Start recieving network messages
		clientsocket.on("message", (data: Uint8Array) => {
			const dataID = data.at(0);

			// Remember that INMSEMOVE's content should be read as a signed integer due to it having negative numbers (acceleration/velocity)			
			if (dataID == DataIdentifier.STRING || dataID == DataIdentifier.ERROR) { // Turn if statement into to switch statement later			
				// This also doesn't work properly, i need to come up with something better
				const stringMessage = new TextDecoder().decode(data.subarray(1));
				console.log(stringMessage);
			}

			// Send out data to the sockets that didn't come from the original socket
			socket.clients.forEach(client => {
				if (client != clientsocket) {
					client.send(data);
				}
			});
		})

		clientsocket.on("close", () => {
			mysession.RemoveClient(clientaddress);
		})

	}).catch((err:Error) => {
		//An error is thrown if tryRetrieveSession is unable to find a session.

		//Close the connection
		console.log("Session retrival failiure. Closing connection...");

		//Close and deallocate socket
		clientsocket.close();
		clientsocket.terminate();

	})

})



//HTML API ENDPOINT

//Configure CORS headers for a single response
function ConfigureCORSHeaders(res: Response) {
	res.header("Access-Control-Allow-Origin", CORS_ORIGINS);
	res.header("Access-Control-Allow-Methods", CORS_METHODS);
}

app.use((req: Request, res: Response, next: NextFunction) => {
	//When any HTTP request is made, configure the CORS header
	ConfigureCORSHeaders(res);
	//Then move onto handling the actual request
	next();
})

//Host session request w/ Session ID
app.get("/api/host/:sessionid", (req: Request, res: Response) => {

	if (req.params.sessionid !== undefined && req.ip !== undefined) {

		let sessionid: string = req.params.sessionid;
		let ip: string = req.ip;

		//create new session
		let newsession = CreateNewSession(sessionid);
		console.log("Created session " + sessionid);

		if (newsession) {
			res.status(201).json(
				{
					status: "Successfully created session",
					sessionid: req.params.sessionid, 
				}
			);
			JoinSession(sessionid, ip);
			return; //guard clause
		}

	}

	res.status(400).send();
	return;

});

//Join session request w/ Session ID
app.get("/api/join/:sessionid", (req: Request, res: Response) => {
	
	if (req.params.sessionid !== undefined && req.ip !== undefined) {
		
		let sessionid: string = req.params.sessionid;
		let ip: string = req.ip;

 		//attempt to join 
		let success = JoinSession(sessionid, ip);

		if (success) {
			res.status(202).json(
				{
					status: "Successfully joined session",
					sessionid: req.params.sessionid,
				}
			);
			return; //guard clause 
		} 

	}

	res.status(400).send();
	return;

});

// Find a Session via it's session ID and retrieve all the data about said session
app.get("/api/find/:sessionid", (req: Request, res: Response) => {
	
	if (req.params.sessionid !== undefined) {
		
		let sessionid: string = req.params.sessionid;

 		//attempt to get the session based on ID
		let session = RetrieveSession(sessionid);
		if (session !== undefined) {
			// Assume that the 0th position in clients[] is always equal to the host
			res.status(202).json(
				{
					status: "Successfully Retrieved session",
					sessionid: req.params.sessionid,
					socketinfo: WS_URL+sessionid,
					host: session.clients[0],
					clients: session.clients,
				}
			);
			return; //guard clause 
		} else {
			res.status(404).json({
				status: "Unsuccessfully attempted to retrieved session",
				sessionid: req.params.sessionid,
				socketinfo: WS_URL+sessionid,
			});
		}

	}

	res.status(400).send();
	return;

});

// Close a Session down and inturn that session's websocket connection. Can only be called by the first connected client's IP (App)
app.get("/api/close/:sessionid"), (req: Request, res: Response) => {
	if (req.params.sessionid !== undefined && req.ip !== undefined) {
		
		let sessionid: string = req.params.sessionid;
		let ip: string = req.ip;

 		//attempt to join 
		let session = RetrieveSession(sessionid);

		if (session && ip == session.RetrieveLastClient()) {
			RemoveSession(sessionid);
			res.status(202).json(
				{
					status: "Successfully closing down session",
					sessionid: req.params.sessionid,
				}
			);
			return; //guard clause 
		} 

	}

	res.status(400).send();
	return;

}

//Begin the server
app.listen(API_PORT, () => {
	console.log("server started");
});