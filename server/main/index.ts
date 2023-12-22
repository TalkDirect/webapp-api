import express, { Express, Request, Response } from "express";
const app: Express = express();

app.get("/api/host/sid=:sessionid", (req: Request, res: Response) => {
	res.status(201).json(
		{
			sessionid: req.params.sessionid, 
		}
	)
});

app.get("/api/join/sid=:sessionid", (req: Request, res: Response) => {
	res.status(202).json(
		{
			sessionid: req.params.sessionid,
		}
	)
});

app.listen(9999, () => {
	console.log("server started")
})