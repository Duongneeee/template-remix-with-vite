import db from '~/db.server'

export const getAllDataFacebookCategoryLevelRepo = async ()=>{
    try {
        return await db.faceBookCategoryLevel.findMany();
    } catch (error) {
         console.log("Error getAllDataFacebookCategoryLevelRepo: ", error);
    }
}

export const getDataFacebookCategoryLevelRepo = async ( data: any )=>{
    try {
        return await db.faceBookCategoryLevel.groupBy({
            by:[data.levelAfter],
            having:{
                [data.levelAfter]:{
                    notIn: ['']
                }
            },
            where:{
                [data.levelBefore]:data.value,
            }
        })
    } catch (error) {
         console.log("Error getDataFacebookCategoryLevelRepo: ", error);
    }
}