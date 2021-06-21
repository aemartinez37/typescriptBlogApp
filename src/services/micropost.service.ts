import { UpdateOptions, DestroyOptions, Op } from "sequelize";
import { Micropost, MicropostInterface } from "../models/micropost.model";

/** Microposts CRUD functions for Database **/

/* Find all microposts */
export function getAll(): Promise<MicropostInterface[]> {
    return Micropost.findAll();
}

/* Create new micropost */
export function create(micropost: MicropostInterface): Promise<MicropostInterface> {
    return Micropost.create(micropost);
}

/* Find one micropost */
export function getOne(postId: number): Promise<MicropostInterface> {
    return Micropost.findByPk<Micropost>(postId)
}

/* Update micropost */
export function updateUser(postId: number, micropost: MicropostInterface): Promise<{}> {
    const updateMicropostOptions: UpdateOptions = {
        where: { id: postId },
        limit: 1,
    };
    return Micropost.update(micropost, updateMicropostOptions);
}

/* Delete micropost */
export function deleteMicropost(postId: number): Promise<{}> {
    const destroyMicropostOptions: DestroyOptions = {
        where: { id: postId },
        limit: 1,
    };

    return Micropost.destroy(destroyMicropostOptions);
}


/** Microposts additional functions for database **/

/* Find micropost by user owner id */
export function getMicropostsByUserId(userId: number): Promise<MicropostInterface[]> {
    return Micropost.findAll<Micropost>({ where: { user_id: userId } });
}

/* Find micropost by user owner id */
export function getMicropostsByUserIdsArray(userIds: number[]): Promise<MicropostInterface[]> {
    return Micropost.findAll<Micropost>({
        where: { user_id: userIds },
        order: [
            ['updatedAt', 'DESC']
        ]
    });
}