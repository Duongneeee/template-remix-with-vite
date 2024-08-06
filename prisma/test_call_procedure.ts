import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
// run job:  npx ts-node prisma/test_call_procedure.ts
async function callStoredProcedure() {
  const result = await prisma.$queryRaw`CALL proc_event()`;
  console.log(result);
}

// Example Usage
callStoredProcedure()
.then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
