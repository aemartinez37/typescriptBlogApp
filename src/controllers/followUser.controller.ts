import { Request, Response } from "express";
import { FollowUser, FollowUserInterface } from "../models/followUser.model";
import * as followUserServices from "../services/followUser.service";
import * as sessionServices from "../services/session.service";
import * as viewService from "../services/views.service";

export class FollowUserController {

    /** FollowUser CRUD functions for Rest API **/

    /* Create new following */
    public create(req: Request, res: Response) {
        var followUser: FollowUserInterface = {
            user_id: req.user['id'],
            followed_user_id: Number(req.params.id)
        };
        followUserServices.create(followUser)
            .then((followedUser: FollowUser) => {
                sessionServices.saveAndRedirect('info', 'User followed', '/profile/user/' + followedUser.followed_user_id, req, res);
            })
            .catch(err => {
                sessionServices.saveAndRedirect('error', err || 'Error while following user', '/profile/user/' + followUser.followed_user_id, req, res);
            });
    }

    /* Delete following */
    public delete(req: Request, res: Response) {
        const user_id: number = Number(req.user['id']);
        const followed_user_id: number = Number(req.params.id)
        followUserServices.getFollowBetweenUsers(user_id, followed_user_id)
            .then((followingUser: FollowUserInterface) => {
                followUserServices.deleteFollowUser(followingUser.id)
                    .then(data => {
                        sessionServices.saveAndRedirect('info', 'User unfollow', '/profile/user/' + followed_user_id, req, res);
                    })
                    .catch(err => {
                        sessionServices.saveAndRedirect('error', err || 'Error deleting follow', '/profile/user/' + followed_user_id, req, res);
                    });
            })
            .catch(err => {
                sessionServices.saveAndRedirect('error', err || 'Error deleting follow', '/profile/user/' + followed_user_id, req, res);
            });
    }

}