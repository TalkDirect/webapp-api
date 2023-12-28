import express, { Express, Request, Response, NextFunction } from "express";
import websocket, { WebSocket, WebSocketServer, RawData } from "ws";
import { Session } from "./modules/Session"

const CORS_ORIGINS = "*" //"http://localhost:5173"
const CORS_METHODS = "POST, GET"
const API_PORT = 9999
const SOCKET_PORT = 9998
const WS_URL = `ws://localhost:${SOCKET_PORT}/`

const app: Express = express();
var allSessions = new Map<string, Session>();
var socket = new WebSocketServer({ port: SOCKET_PORT });
const PacketData = [];

enum DataIdentifier {
	VIDEO = 0,
	AUDIO = 1,
	STRING = 2,
	ERROR = 3,
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
	if (desiredsession !== undefined) {
		desiredsession.AddClient(ip); // Add client if session exists
		return true; // Return if the session was joined successfully or not
	}
	return false;

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

	let sessionid: string = req.url.substring(1); // the URL of a connection is localhost:PORT/[sessionid]. this grabs the sessionid from the end of the URL

	let clientaddress: string = "::1" //default to localhost if address is undefined. this should be changed to terminate the socket in the future.
	if (req.socket.remoteAddress !== undefined) {
		clientaddress = req.socket.remoteAddress;
	}

	tryRetrieveSession(sessionid) // Attempt to find a session
	.then((mysession: Session) => {
		// Begin accepting messages from client

		console.log("Accepting messages.");
		mysession.AddClient(clientaddress);
		clientsocket.send(1); // Placeholder "Accepted" code
		clientsocket.send(2);
		clientsocket.send(3);
		clientsocket.send(4);

		//Start recieving network messages
		clientsocket.on("message", (data: Buffer[]) => {
			// Create a Uint32Bit Array to told RGB Values
			const buffer = new Uint32Array();
			// Loop thru the Buffer[] recieved and every 4 indexes place into an Int32Bit and place that into our bufferArray32
			for (let i = 0; i<data.length;) {
				let bufferIndex = Buffer.from([i, i+1, i+2, i+3]).readInt32BE(0);
				buffer[i] = bufferIndex;
				i += 4;
			}
			// Send off the buffer32Array
			clientsocket.send(buffer);
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
			return; //guard clause
		}

	}

	res.status(400).send();

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
		} 

	}

	res.status(400).send();

});

//Begin the server
app.listen(API_PORT, () => {
	console.log("server started");
});