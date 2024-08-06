export const testTransaction = async () => {
    return await prisma.$transaction([
        prisma.$queryRaw`SELECT * FROM Test`,
        prisma.$queryRaw`SELECT * FROM EventNameConfigs`,
      ])
}