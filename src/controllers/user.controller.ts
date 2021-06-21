import { NextFunction, Request, Response } from "express";
import { User, UserInterface } from "../models/user.model";
import { UpdateOptions, DestroyOptions, Op } from "sequelize";
import * as userService from "../services/user.service";
import * as sessionServices from "../services/session.service";
import * as viewService from "../services/views.service";
import { UserNotFoundException, UsersNotFoundException, UserIncompleteDataException } from "../exceptions/UserException";

export class UserController {

    /** Users CRUD functions for Rest API **/

    /* Find all users */
    public findAll(req: Request, res: Response, next: NextFunction) {
        userService.getAll()
            .then((users: Array<User>) => {
                if (users) {
                    res.json(users)
                } else {
                    next(new UsersNotFoundException());
                }
            })
    }

    /* Create new user */
    public create(req: Request, res: Response, next: NextFunction) {
        const user: UserInterface = req.body;
        if (!user) {
            next(new UserIncompleteDataException())
        }
        userService.create(user)
            .then((user: User) => {
                sessionServices.saveAndRedirect('info', 'User created', '/login', req, res);
            })
            .catch(err => {
                req.flash('error', err);
                viewService.renderView(req, res, 'signup', { title: "Signup Page", user: user });
            });
    }

    /* Find one user */
    public findOne(req: Request, res: Response, next: NextFunction) {
        const id: number = Number(req.params.id);
        userService.getOne(id)
            .then((user: User | null) => {
                if (user) {
                    res.json(user);
                } else {
                    next(new UserNotFoundException(id));
                }
            });
    }

    /* Update user */
    public update(req: Request, res: Response) {
        const id: number = Number(req.params.id);
        const userEdit: UserInterface = req.body;

        userService.getOne(id)
            .then((userDb: User) => {
                userEdit.id = userDb.id;
                userEdit.pwdHash = userDb.pwdHash;
                userService.updateUser(id, userEdit)
                    .then((user: User) => {
                        sessionServices.saveAndRedirect('info', 'User updated', '/profile', req, res);
                    })
                    .catch(err => {
                        req.flash('error', err || 'Error updating User @' + userDb.userName);
                        viewService.renderView(req, res, 'editUser', { title: "Edit user @" + userDb.userName, user: userDb });
                    });
            })
            .catch(err => {
                req.flash('error', err || 'Error updating User');
                viewService.renderView(req, res, 'editUser', { title: "Edit user", user: userEdit });
            });
    }

    /* Delete user */
    public delete(req: Request, res: Response) {
        const id: number = Number(req.params.id);
        userService.deleteUser(id)
            .then((user: User) => {
                sessionServices.saveAndRedirect('info', 'User deleted', '/login', req, res);
            })
            .catch(err => {
                sessionServices.saveAndRedirect('error', err || 'Error deleting User with id=' + id, '/profile', req, res);
            });
    }


    /** Users additional functions for Rest API **/

    /* Find user by username or email */
    public findByUserNameOrEmail(req: Request, res: Response) {
        const userNameOrEmail: string = req.body.userNameOrEmail;

        userService.getByUsernameOrEmail(userNameOrEmail)
            .then((users: Array<User>) => res.json(users))
            .catch(err => {
                console.log(err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving users."
                });
            });
    }
}