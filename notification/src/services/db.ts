import pg from 'pg';

class DBPool {
  private static instance: DBPool;
  private pool:pg.Pool | undefined;

  private constructor() {
    console.log('loggerutils:contructor');
  }

  public static getInstance(): DBPool {
    if (!DBPool.instance) {
      DBPool.instance = new DBPool();
    }
    return DBPool.instance;
  }

  private getConfig(DB_HOST:string, DB_USER:string, DB_PASSWORD:string, DB_DATABASE:string) {
    return {
      host: DB_HOST,
      user: DB_USER, 
      database: DB_DATABASE,
      password: DB_PASSWORD,
      port: 5432,
      max: 10, // max number of clients in the pool
      idleTimeoutMillis: 30000,
    };
  }

  public startPool = (DB_HOST:string, DB_USER:string, DB_PASSWORD:string, DB_DATABASE:string) => {
    this.pool = new pg.Pool(this.getConfig(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE));
    console.log('DBPool::Starting Pool');

    this.pool.on('connect', () => {
      console.log('DBPool::Connected to the Database');
    });

    this.pool.on('acquire', () => {
      console.log('DBPool::client acquired');
      console.log(`DBPool::pool.totalCount=${this.pool?.totalCount}, pool.idleCount=${this.pool?.idleCount}`)
    });

    this.pool.on('release', () => {
      console.log('DBPool::client released');
      console.log(`DBPool::pool.totalCount=${this.pool?.totalCount}, pool.idleCount=${this.pool?.idleCount}`)
    });

    this.pool.on('error', (err: Error) => {
      console.log('DBPool::client error', err.message);
    });
  }

  public async endPool(){
    console.log('Ending Pool');
    await this.pool?.end();
  }

  public async acquireClient(){
    const client = await this.pool?.connect()
    return client;
  }
}

export default DBPool;