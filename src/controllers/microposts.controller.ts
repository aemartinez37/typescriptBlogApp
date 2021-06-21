import { Request, Response } from "express";
import { Micropost, MicropostInterface } from "../models/micropost.model";
import * as micropostService from "../services/micropost.service";
import * as sessionServices from "../services/session.service";
import * as viewService from "../services/views.service";

export class MicropostController {

    /** Micropost CRUD functions for Rest API **/

    /* Create new micropost */
    public create(req: Request, res: Response) {
        const micropost: MicropostInterface = req.body;
        micropost.user_id = req.user['id'];
        if (!micropost) {
            res.status(400).json({
                error: "Incomplete information!",
            });
        }

        micropostService.create(micropost)
            .then((micropost: Micropost) => {
                sessionServices.saveAndRedirect('info', 'Post created', '/profile', req, res);
            })
            .catch(err => {
                sessionServices.saveAndRedirect('error', err || 'Error while creating post', '/profile', req, res);
            });
    }

    /* Delete micropost */
    public delete(req: Request, res: Response) {
        const id: number = Number(req.params.id);
        micropostService.deleteMicropost(id)
            .then((micropost: Micropost) => {
                sessionServices.saveAndRedirect('info', 'Post deleted', '/profile', req, res);
            })
            .catch(err => {
                sessionServices.saveAndRedirect('error', err || 'Error deleting post', '/profile', req, res);
            });
    }

    /* Update micropost */
    public update(req: Request, res: Response) {
        const id: number = Number(req.params.id);
        const micropostEdit: MicropostInterface = req.body;

        micropostService.getOne(id)
            .then((micropostDb: Micropost) => {
                micropostEdit.id = micropostDb.id;
                micropostEdit.user_id = micropostDb.user_id;
                micropostService.updateUser(id, micropostEdit)
                    .then((micropost: Micropost) => {
                        sessionServices.saveAndRedirect('info', 'Post updated', '/profile', req, res);
                    })
                    .catch(err => {
                        sessionServices.saveAndRedirect('error', err || 'Error updating post', '/profile', req, res);
                    });
            })
            .catch(err => {
                sessionServices.saveAndRedirect('error', err || 'Error updating - post not found', '/profile', req, res);
            });
    }

}