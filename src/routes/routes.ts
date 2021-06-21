import { Request, Response } from "express";
import { UserController } from "../controllers/user.controller";
import { MicropostController } from "../controllers/microposts.controller";
import { FollowUserController } from "../controllers/followUser.controller";
import { ViewController } from "../controllers/views.controller";
import * as sessionService from "../services/session.service";
import * as csrf from 'csurf';

export class Routes {
    public userController: UserController = new UserController();
    public micropostController: MicropostController = new MicropostController();
    public followUserController: FollowUserController = new FollowUserController();
    public viewController: ViewController = new ViewController();

    public routes(app): void {

        //Using CSRF as middleware in all routes
        app.use(csrf({ cookie: true }))

        app.route("/").get(function (req: Request, res: Response) {
            res.redirect("/login");
        });

        /* Users Routes */
        app
            .route("/users")
            .get(this.userController.findAll)
            .post(this.userController.create);

        app
            .route("/users/userNameEmail")
            .get(this.userController.findByUserNameOrEmail);

        app
            .route("/users/:id")
            .get(this.userController.findOne)
            .post(sessionService.loggedInUser, this.userController.update)
            .put(this.userController.update)
            .delete(this.userController.delete);

        app
            .route("/userDelete/:id")
            .post(sessionService.loggedInUser, this.userController.delete)


        /* Micropost Routes */
        app
            .route("/microposts")
            .post(sessionService.loggedInUser, this.micropostController.create);

        app
            .route("/microposts/:id")
            .post(sessionService.loggedInUser, this.micropostController.update)

        app
            .route("/micropostDelete/:id")
            .post(sessionService.loggedInUser, this.micropostController.delete)


        /* Follow User Routes*/
        app
            .route("/followUser/:id")
            .post(sessionService.loggedInUser, this.followUserController.create);

        app
            .route("/unfollowUser/:id")
            .post(sessionService.loggedInUser, this.followUserController.delete);


        /* Views - Session Routes */
        app
            .route("/login")
            .get(this.viewController.login)
            .post(sessionService.openSessionLogin);

        app
            .route("/profile")
            .get(sessionService.loggedInUser, this.viewController.userProfile)

        app
            .route("/profile/user/:id")
            .get(sessionService.loggedInUser, this.viewController.visitantUserProfile)

        app
            .route("/signup")
            .get(this.viewController.signUpView);

        app
            .route("/logout")
            .get(this.viewController.logout)

        app
            .route("/editUser")
            .get(sessionService.loggedInUser, this.viewController.editUser)

        app
            .route("/allUsers")
            .get(sessionService.loggedInUser, this.viewController.allUsers)

        app
            .route("/allUsers/alphabetically")
            .get(sessionService.loggedInUser, this.viewController.allUsersAlphabetically)

        app
            .route("/allUsers/abcNames")
            .get(sessionService.loggedInUser, this.viewController.allUsersStartsABC)

        app
            .route("/followers")
            .get(sessionService.loggedInUser, this.viewController.followers)

        app
            .route("/following")
            .get(sessionService.loggedInUser, this.viewController.following)

        app
            .route("/posts")
            .get(sessionService.loggedInUser, this.viewController.followingPosts)

    }

}