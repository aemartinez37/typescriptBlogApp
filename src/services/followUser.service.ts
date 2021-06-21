import { UpdateOptions, DestroyOptions, Op } from "sequelize";
import { FollowUser, FollowUserInterface } from "../models/followUser.model";

/** FollowUser CRUD functions for Database **/

/* Create new followUser */
export function create(followUser: FollowUserInterface): Promise<FollowUserInterface> {
    return FollowUser.create(followUser);
}

/* Delete micropost */
export function deleteFollowUser(followUserId: number): Promise<{}> {
    const destroyFollowUserOptions: DestroyOptions = {
        where: { id: followUserId },
        limit: 1,
    };

    return FollowUser.destroy(destroyFollowUserOptions);
}

/** FollowUser additional functions for database **/

/* Find followUser by user follower id and user followed id */
export function getFollowBetweenUsers(userId: number, followedUserId: number): Promise<FollowUserInterface> {
    return FollowUser.findOne<FollowUser>({ where: { [Op.and]: [{ user_id: userId }, { followed_user_id: followedUserId }] } });
}

/* Find followers by id */
export function getFollowers(userId: number): Promise<FollowUserInterface[]> {
    return FollowUser.findAll<FollowUser>({ where: { followed_user_id: userId } });
}

/* Find following by id */
export function getFollowing(userId: number): Promise<FollowUserInterface[]> {
    return FollowUser.findAll<FollowUser>({ where: { user_id: userId } });
}