import { UserDetails } from "../constants/types/UserType";
import { getRequest } from "./fetchHelper"

const userServiceUrl = "/user/v1";
export const getCurrentUser = () : Promise<UserDetails> =>{
    return getRequest<UserDetails>(`${userServiceUrl}/getUser`,);
}