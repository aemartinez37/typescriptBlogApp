import { Request, Response } from "express";
import * as viewService from "../services/views.service";
import * as sessionServices from "../services/session.service";
import * as micropostService from "../services/micropost.service";
import * as utils from "../services/utils.service";
import * as userService from "../services/user.service";
import * as gravatar from "gravatar";
import { ViewMessages } from "../config/interfaces";
import { User, UserInterface } from "../models/user.model";
import { use } from "chai";
import { MicropostInterface } from "models/micropost.model";

export class ViewController {

    //Render login view
    public login(req: Request, res: Response) {
        viewService.renderView(req, res, 'login', { title: "Login Page" });
    }

    //Render user logged profile
    public userProfile(req: Request, res: Response) {
        viewService.getUserProfile(req.user)
            .then(data => {
                viewService.renderView(req, res, 'profile', data);
            }).catch(err => {
                sessionServices.saveAndRedirect('error', 'Error rendering profile view', '/profile', req, res);
            });
    }

    public visitantUserProfile(req: Request, res: Response) {
        const idVisitantUser: number = Number(req.user['id']);
        const idUserToVisitProfile: number = Number(req.params.id);
        //Check if user is trying to visit onw profile
        if (idVisitantUser === idUserToVisitProfile) {
            res.redirect("/profile");
        }
        else {
            viewService.getVisitantUserProfile(idVisitantUser, idUserToVisitProfile)
                .then(data => {
                    viewService.renderView(req, res, 'visitProfile', data);
                }).catch(err => {
                    sessionServices.saveAndRedirect('error', err || 'Error rendering profile', '/allUsers', req, res);
                });
        }
    }

    //Render edit user form
    public editUser(req: Request, res: Response) {
        viewService.getUserProfile(req.user)
            .then((data: ViewMessages) => {
                data.title = "Edit user @" + data.user.userName;
                viewService.renderView(req, res, 'editUser', data);
            }).catch(err => {
                sessionServices.saveAndRedirect('error', 'Error rendering edit user view', '/profile', req, res);
            });
    }

    //Render all users form
    public allUsers(req: Request, res: Response) {
        userService.getAllUsersProfile()
            .then((users: UserInterface[]) => {
                viewService.renderView(req, res, 'allUsers', { title: 'All users', usersList: users });
            }).catch(err => {
                sessionServices.saveAndRedirect('error', err || 'Error rendering all users view', '/profile', req, res);
            });
    }

    //Render all users alphabetically
    public allUsersAlphabetically(req: Request, res: Response) {
        userService.getAllUsersProfile()
            .then((users: UserInterface[]) => {
                viewService.renderView(req, res, 'allUsers', { title: 'All users', usersList: utils.alphabeticallyUsersOrder(users, "firstName") });
            }).catch(err => {
                sessionServices.saveAndRedirect('error', err || 'Error rendering all users view', '/profile', req, res);
            });
    }

    //Render all users starts with a, b or c
    public allUsersStartsABC(req: Request, res: Response) {
        userService.getAllUsersProfile()
            .then((users: UserInterface[]) => {
                viewService.renderView(req, res, 'allUsers', { title: 'All users', usersList: utils.abcStartsPropertyFilter(users, "firstName") });
            }).catch(err => {
                sessionServices.saveAndRedirect('error', err || 'Error rendering all users view', '/profile', req, res);
            });
    }

    //Render user followers
    public followers(req: Request, res: Response) {
        userService.getFollowers(Number(req.user['id']))
            .then((users: UserInterface[]) => {
                users = users.map(x => {
                    x['dataValues'].avatar = gravatar.url(x.email, { s: '100', r: 'x', d: 'retro' }, true).toString();
                    return x;
                })
                viewService.renderView(req, res, 'follows', { title: 'Followers', usersList: users });
            }).catch(err => {
                sessionServices.saveAndRedirect('error', err || 'Error rendering followers', '/profile', req, res);
            });
    }

    //Render user followings
    public following(req: Request, res: Response) {
        userService.getFollowing(Number(req.user['id']))
            .then((users: UserInterface[]) => {
                users = users.map(x => {
                    x['dataValues'].avatar = gravatar.url(x.email, { s: '100', r: 'x', d: 'retro' }, true).toString();
                    return x;
                })
                viewService.renderView(req, res, 'follows', { title: 'Following', usersList: users });
            }).catch(err => {
                sessionServices.saveAndRedirect('error', err || 'Error rendering following', '/profile', req, res);
            });
    }

    //Render user following posts
    public followingPosts(req: Request, res: Response) {
        userService.getFollowing(Number(req.user['id']))
            .then((users: UserInterface[]) => {
                const followingOnlyUsersId: number[] = users.reduce(function (followingUsersIds, user) { return followingUsersIds.concat(user.id) }, []);
                users = users.map(x => {
                    x['avatar'] = gravatar.url(x.email, { s: '100', r: 'x', d: 'retro' }, true).toString();
                    return x;
                })
                micropostService.getMicropostsByUserIdsArray(followingOnlyUsersId)
                    .then((followingPosts: MicropostInterface[]) => {
                        viewService.renderView(req, res, 'followingPosts', { title: 'Following Posts', usersList: users, postsList: followingPosts });
                    }).catch(err => {
                        sessionServices.saveAndRedirect('error', err || 'Error rendering following posts', '/profile', req, res);
                    });
            }).catch(err => {
                sessionServices.saveAndRedirect('error', err || 'Error rendering following posts', '/profile', req, res);
            });
    }

    //Render Signup view
    public signUpView(req: Request, res: Response) {
        viewService.renderView(req, res, 'signup', { title: "Signup Page", user: new User() });
    }

    //Logout and redirect to /login
    public logout(req: Request, res: Response) {
        req.logout();
        sessionServices.saveAndRedirect('info', 'Session closed', '/login', req, res);
    }

}