import { Request, Response } from "express";
import { ViewMessages } from "../config/interfaces";
import { User, UserInterface } from "../models/user.model";
import * as userService from "../services/user.service";
import * as micropostService from "../services/micropost.service";
import * as followUserServices from "../services/followUser.service";
import * as gravatar from "gravatar";
import { MicropostInterface } from "models/micropost.model";
import { FollowUserInterface } from "models/followUser.model";

//Render sended view name with info or error messages
export function renderView(req: Request, res: Response, view: string, infoView: ViewMessages) {
    req.session.save(function () {
        infoView.infoMessage = req.flash('info');
        infoView.errorMessage = req.flash('error');
        //If request have a csrf token, pass it for views in message object
        if (req.csrfToken) {
            infoView.tokenCsrf = req.csrfToken();
        }
        //If infoView have a user, add gravatar of user email
        if (infoView.user) {
            infoView.avatar = gravatar.url(infoView.user.email, { s: '100', r: 'x', d: 'retro' }, true);
        }
        res.render(view, infoView);
    });
}

//Getting logged user profile
export function getUserProfile(currentUser): Promise<ViewMessages> {
    return userService.getOne(currentUser.id)
        .then((loggedInUser: User) => {
            return micropostService.getMicropostsByUserId(currentUser.id)
                .then((userPosts: MicropostInterface[]) => {
                    const viewMessage: ViewMessages = {
                        title: "User @" + loggedInUser.userName + " profile",
                        user: loggedInUser,
                        postsList: userPosts,
                        avatar: gravatar.url(loggedInUser.email, { s: '100', r: 'x', d: 'retro' }, true)
                    };
                    return viewMessage;
                }).catch(err => {
                    throw err;
                });
        }).catch(err => {
            throw err;
        });
}

//Getting profile by user id
export function getVisitantUserProfile(idVisitantUser: number, userToVisitProfileId: number): Promise<ViewMessages> {
    return userService.getOne(userToVisitProfileId)
        .then((userToVisitProfile: User) => {
            return micropostService.getMicropostsByUserId(userToVisitProfileId)
                .then((userPosts: MicropostInterface[]) => {
                    return followUserServices.getFollowBetweenUsers(idVisitantUser, userToVisitProfileId)
                        .then((followedUser: FollowUserInterface) => {
                            const viewMessage: ViewMessages = {
                                title: "User @" + userToVisitProfile.userName + " profile",
                                user: userToVisitProfile,
                                userFollowed: followedUser,
                                postsList: userPosts,
                                avatar: gravatar.url(userToVisitProfile.email, { s: '100', r: 'x', d: 'retro' }, true)
                            };
                            return viewMessage;
                        }).catch(err => {
                            throw err;
                        });
                }).catch(err => {
                    throw err;
                });
        }).catch(err => {
            throw err;
        });
}