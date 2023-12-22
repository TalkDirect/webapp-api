"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Session_1 = require("./modules/Session");
const app = (0, express_1.default)();
var allSessions = new Map();
function CreateNewSession(sessionid) {
    let newsession = new Session_1.Session();
    allSessions.set(sessionid, newsession);
    return newsession;
}
function JoinSession(sessionid, ip) {
    var desiredsession = allSessions.get(sessionid);
    if (desiredsession !== undefined) {
        desiredsession.AddClient(ip);
        return true; //return if the session was joined successfully or not
    }
    return false;
}
function ConfigureCORSHeaders(res) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "POST, GET");
}
app.use((req, res, next) => {
    ConfigureCORSHeaders(res);
    next();
});
app.get("/api/host/:sessionid", (req, res) => {
    if (req.params.sessionid !== undefined && req.ip !== undefined) {
        let sessionid = req.params.sessionid;
        let ip = req.ip;
        //create new session
        let newsession = CreateNewSession(sessionid);
        //attempt to join newly created session
        let success = JoinSession(sessionid, req.ip);
        if (success) {
            res.status(201).json({
                status: "Successfully created session",
                sessionid: req.params.sessionid,
            });
            return; //guard clause
        }
    }
    res.status(400).send();
});
app.get("/api/join/:sessionid", (req, res) => {
    if (req.params.sessionid !== undefined && req.ip !== undefined) {
        let sessionid = req.params.sessionid;
        let ip = req.ip;
        //attempt to join 
        let success = JoinSession(sessionid, ip);
        if (success) {
            res.status(202).json({
                status: "Successfully joined session",
                sessionid: req.params.sessionid,
            });
            return; //guard clause 
        }
    }
    res.status(400).send();
});
app.listen(9999, () => {
    console.log("server started");
});
