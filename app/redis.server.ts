import { createClient } from 'redis';
// import { createPool } from 'generic-pool';

// const factory = {
//   create: async () => {
//     const client = createClient({
//             url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
//             password: process.env.REDIS_PASSWORD,
//           });

//     client.on('error', (err) => console.log('Redis Client Error', err));

//     await client.connect();
//     console.log('Connected to Redis');
//     return client;
//   },
//   destroy: async (client: RedisClientType) => {
//     await client.quit();
//   },
// };

// const redisPool = createPool(factory, {
//   max: 10, // Số lượng kết nối tối đa trong pool
//   min: 2,  // Số lượng kết nối tối thiểu trong pool
// });

// export default redisPool;

let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!redisClient || !redisClient.isOpen) {
    redisClient = createClient({
      url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
      password: process.env.REDIS_PASSWORD,
    });

    redisClient.on('error', (error) => {
      console.error('Redis Client Error', error);
    });
    
    await redisClient.connect();
    console.log('Connected to Redis');
  }
  return redisClient;
}

export default getRedisClient;

export async function closeRedisConnection() {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
    console.log('Redis connection closed');
  }
}