import lowdb, { LowdbAsync, LowdbSync, AdapterAsync, AdapterSync } from "lowdb";
import FileAsync from "lowdb/adapters/FileAsync";
import Memory from "lowdb/adapters/Memory";

const DB_FILE = "db.json";

export class DBService {
  private db!: LowdbAsync<AdapterAsync>;
  private memory = lowdb(new Memory(DB_FILE));

  async ready(): Promise<void> {
    this.db = await lowdb(new FileAsync(DB_FILE));

    console.log("DBService is ready ...");
  }

  async get(key: string, memory = false): Promise<unknown> {
    return memory ? this.memory.get(key).value() : this.db.get(key).value();
  }

  async set(key: string, value: unknown, memory = false): Promise<void> {
    memory
      ? this.memory.set(key, value).write()
      : this.db.set(key, value).write();
  }
}
