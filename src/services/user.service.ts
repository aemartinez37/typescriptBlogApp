import { UpdateOptions, DestroyOptions, Op } from "sequelize";
import { User, UserInterface } from "../models/user.model";
import * as followUserServices from "../services/followUser.service";
import * as bcrypt from 'bcrypt-nodejs';
import * as gravatar from "gravatar";
import { FollowUserInterface } from "models/followUser.model";

/** Users CRUD functions for Database **/

/* Find all users */
export function getAll(): Promise<UserInterface[]> {
    return User.findAll();
}

/* Create new user */
export function create(user: UserInterface): Promise<UserInterface> {
    return validateUserData(user)
        .then(data => {
            return hashUserPassword(user.pwdHash)
                .then(hash => {
                    user.pwdHash = hash;
                    user.firstName = user.firstName.toUpperCase();
                    user.lastName = user.lastName.toUpperCase();
                    return User.create(user);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        })
        .catch(err => {
            return Promise.reject(err);
        });
}

/* Find one user */
export function getOne(userId: number): Promise<UserInterface> {
    return User.findByPk<User>(userId)
}

/* Update user */
export function updateUser(userId: number, user: UserInterface): Promise<{}> {
    const updateUserOptions: UpdateOptions = {
        where: { id: userId },
        limit: 1,
    };
    return validateUserData(user)
        .then(data => {
            user.firstName = user.firstName.toUpperCase();
            user.lastName = user.lastName.toUpperCase();
            return User.update(user, updateUserOptions);
        })
        .catch(err => {
            return Promise.reject(err);
        });
}

/* Delete user */
export function deleteUser(userId: number): Promise<{}> {
    const destroyUserOptions: DestroyOptions = {
        where: { id: userId },
        limit: 1,
    };

    return User.destroy(destroyUserOptions);
}


/** Users additional functions for database **/

/* Find user by username or email */
export function getByUsernameOrEmail(userNameOrEmail: string): Promise<UserInterface[]> {
    return User.findAll<User>({ where: { [Op.or]: [{ userName: userNameOrEmail }, { email: userNameOrEmail }] } });
}

/* Find user followers by user id*/
export function getFollowers(userId: number): Promise<UserInterface[]> {
    return followUserServices.getFollowers(userId)
        .then((userFollows: FollowUserInterface[]) => {
            const followersOnlyIds: number[] = userFollows.reduce(function (followersIds, follow) { return followersIds.concat(follow.user_id) }, []);
            return User.findAll({
                where: {
                    id: followersOnlyIds
                }
            });
        })
        .catch(err => {
            return Promise.reject(err);
        });
}

/* Find user following by user id*/
export function getFollowing(userId: number): Promise<UserInterface[]> {
    return followUserServices.getFollowing(userId)
        .then((userFollows: FollowUserInterface[]) => {
            const followingOnlyIds: number[] = userFollows.reduce(function (followingIds, follow) { return followingIds.concat(follow.followed_user_id) }, []);
            return User.findAll({
                where: {
                    id: followingOnlyIds
                }
            });
        })
        .catch(err => {
            return Promise.reject(err);
        });
}

/* Get all users and add avatar to profile */
export function getAllUsersProfile(): Promise<UserInterface[]> {
    return getAll()
        .then((users: UserInterface[]) => {
            users = users.map(x => {
                x['dataValues'].avatar = gravatar.url(x.email, { s: '100', r: 'x', d: 'retro' }, true).toString();
                return x;
            })
            return Promise.resolve(users)
        })
        .catch(err => {
            return Promise.reject(err)
        });
}

/** User Data Control Functions **/

/* Hashed user password */
function hashUserPassword(password: string): Promise<string> {
    return validateSecurePassword(password)
        .then(data => {
            var salt = bcrypt.genSaltSync(12);
            var hash = bcrypt.hashSync(password, salt);
            return Promise.resolve(hash)
        })
        .catch(err => {
            return Promise.reject(err)
        });
};

/* Validate user information */
function validateUserData(user: UserInterface): Promise<string> {
    if (!user.userName || !user.firstName || !user.lastName || !user.email) {
        return Promise.reject('Incomplete User data');
    }
    return validateUserEmail(user.email)
        .then(data => {
            return usernameOrEmailAlreadyCreated(user.userName, user.email)
                .then((users: Array<User>) => {
                    if (users.length > 0 && user.id != users[0].id) {
                        return Promise.reject('Username or email already used.');
                    }
                    else {
                        return Promise.resolve('OK Data');
                    }
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        })
        .catch(err => {
            return Promise.reject(err)
        });
}

/* Validate secure password */
export function validateSecurePassword(password: string): Promise<string> {
    const regex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?/~_+-=|]).{8,}$/);
    return new Promise(function (res, rej) {
        if (regex.test(password)) {
            res('OK password')
        } else {
            rej('Password must contain: \n*Minimum eight characters\n*At least: \n\tOne digit\n\tOne uppercase letter\n\tOne lowercase letter\n\tOne special character');
        }
    });
};

/* Validate user email */
function validateUserEmail(email: string): Promise<string> {
    const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return new Promise(function (res, rej) {
        if (regex.test(email)) {
            res('OK Email');
        } else {
            rej('Wrong Email');
        }
    });
};

/* Username or email already created*/
function usernameOrEmailAlreadyCreated(userName: string, email: string): Promise<UserInterface[]> {
    return User.findAll<User>({ where: { [Op.or]: [{ userName: userName }, { email: email }] } });
}

/* Compare user password */
export function validateUserPassword(password: string, hashedPassword: string): Promise<boolean> {
    return new Promise(function (res, rej) {
        if (bcrypt.compareSync(password, hashedPassword)) {
            res(true);
        } else {
            rej('Password not match.');
        }
    });
};