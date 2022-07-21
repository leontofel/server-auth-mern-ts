import playlists from "../models/Playlist";
import mongoose from 'mongoose';
import { Request, Response } from "express";
import { hasAuthorization } from "../middleware/auth";
import IPlaylist from "../interface/IPlaylist";

export class PlaylistController {
    static listPlaylists = (req: Request, res: Response) => {
        playlists.find()
            .exec((err, playlists) => {
                if (err) console.log(err);
                return res.status(200).json(playlists);
            });
    }
    static addPlaylist = (req: Request, res: Response) => {
        playlists.create({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            genre: req.body.genre,
            musics: req.body.musics,
            user_id: req.body.user_id
        }, function (err) {
            if (err) {
                return res.status(500).send({ message: `${err.message} - failed to add playlist.` });
            }
            return res.status(201).send("playlist created");
        }
        )

    }


    static updatePlaylist = (req: Request, res: Response) => {
        const id = req.params.id;

        playlists.findById(id, (err, playlist: IPlaylist) => {
            console.log(hasAuthorization(req, res, playlist.user_id, id) === true)
            if (hasAuthorization(req, res, playlist.user_id, id) === true) {
                playlists.findById(id).updateOne({ $set: req.body }, (err) => {
                    if (!err) {
                        res.status(200).send({ message: 'The playlist was updated.' });
                    } else {
                        return res.status(401).send("user doesn't have authorization")
                    }
                });
            }
        })

    }

    static deletePlaylist = (req: Request, res: Response) => {
        const id = req.params.id;
        playlists.findById(id, (err, playlist: IPlaylist) => {

            if (hasAuthorization(req, res, playlist.user_id, id) === true) {
                playlists.findById(id)
                    .deleteOne()
                    .exec((err) => {
                        if (!err) {
                            res.status(200).send({ message: 'playlist was successfully deleted' })
                        } else {
                            res.status(500).send({ message: err.message })
                        }
                    })
            }
        })
}
}
