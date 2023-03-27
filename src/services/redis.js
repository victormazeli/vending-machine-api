import Redis from 'ioredis'

const redis = new Redis(); // on production environment use credentials

export default redis;