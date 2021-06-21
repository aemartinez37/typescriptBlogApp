import { User, UserInterface } from "../models/user.model";
import { Micropost, MicropostInterface } from "../models/micropost.model";
import { FollowUserInterface } from "models/followUser.model";

export interface ViewMessages {
    title?: string;
    usersList?: UserInterface[];
    postsList?: MicropostInterface[];
    user?: UserInterface;
    userFollowed?: FollowUserInterface;
    avatar?: string;
    infoMessage?: string[];
    errorMessage?: string[];
    tokenCsrf?: string;
}