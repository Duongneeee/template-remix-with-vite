import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/*
 run job:  npm run prisma:seeding
*/

async function main() {
  const currentDateTime = new Date();

const year = currentDateTime.getFullYear();
const month = String(currentDateTime.getMonth() + 1).padStart(2, '0');
const day = String(currentDateTime.getDate()).padStart(2, '0');
const hours = String(currentDateTime.getHours()).padStart(2, '0');
const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');

const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  const data = {
    content: formattedDateTime
  }
  // await prisma.test.upsert({
  //     where: { id: 1 },
  //     update: {},
  //     create:[{data},]
  //   });
  await prisma.test.create({data});
  await prisma.test.create({data});
  await prisma.test.create({data});
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })