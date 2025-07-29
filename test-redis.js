// eslint-disable-next-line @typescript-eslint/no-require-imports
const Redis = require('ioredis');
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: '.env.local' });

// const redisHost = process.env.REDIS_HOST || 'localhost';

// local redis host
const redisHost = 'localhost';

async function testRedis() {
  const redis = new Redis({
    host: redisHost,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
  });

  try {
    console.log('🔄 Testing Redis connection...');
    
    // Test ping
    const pong = await redis.ping();
    console.log('✅ PING:', pong);
    
    // Test set/get
    await redis.set('test', 'Hello Redis!');
    const value = await redis.get('test');
    console.log('✅ SET/GET:', value);
    
    // Test info
    const info = await redis.info('server');
    console.log('✅ Server info available', info);
    
    // Cleanup
    await redis.del('test');
    await redis.disconnect();
    
    console.log('🎉 Redis connection test successful!');
  } catch (error) {
    console.error('❌ Redis test failed:', error);
  }
}

testRedis();