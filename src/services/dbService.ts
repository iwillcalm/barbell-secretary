import { Collection, Db, MongoClient } from "mongodb";

const COLLECTION_NAME_DICT = {};

interface DocumentTypeDict {}

export interface DBServiceOptions {
  host: string;
  port: number;
  name: string;
}

export class DBService {
  protected db!: Db;

  readonly ready: Promise<void>;

  constructor(options: DBServiceOptions) {
    this.ready = this.initialize(options);
  }

  collectionOfType<TType extends keyof DocumentTypeDict>(
    type: TType
  ): Collection<DocumentTypeDict[TType]> {
    let name = COLLECTION_NAME_DICT[type];
    return this.db.collection(name);
  }

  collection<T>(name: string): Collection<T> {
    return this.db.collection(name);
  }

  async dropDatabase(): Promise<void> {
    return this.db.dropDatabase();
  }

  private async initialize({
    host,
    port,
    name
  }: DBServiceOptions): Promise<void> {
    let uri = `mongodb://${host}:${port}`;

    let client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      ignoreUndefined: true
    });

    this.db = client.db(name);

    console.log(`Connected to MongoDB ${uri}`);
  }
}
