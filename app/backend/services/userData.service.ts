import { deleteUserDataByPixelIdRepo, deleteUserDataRepo } from "../repositories/userData.repository"

export const deleteUserData = async (shop: string) => {
    return await deleteUserDataRepo(shop)
}
export const deleteUserDataByPixelId = async (data:any) => {
    return await deleteUserDataByPixelIdRepo(data)
}