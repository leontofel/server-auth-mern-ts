import express, { Request, Response, Router} from "express";
import playlists from "./playlistRoutes";
import users from './userRoutes';


const routes = (app) => {
    app.route('/').get((req: Request, res: Response) => {
        return res.status(200).send({ title: "Music app" });
    });
    app.use(
        express.json(),
        playlists,
        users
    )
}

export default routes;