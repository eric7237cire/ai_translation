import { openDB, type DBSchema, type IDBPDatabase } from "idb";

type MetaStoreMap = {
  maxIndex: number;
  currentIndex: number;
};

interface TranslationDB extends DBSchema {
  pairs: {
    key: number;
    value: {
      english: string;
      spanish: string;
    };
  };
  meta: {
    key: keyof MetaStoreMap;
    value: MetaStoreMap[keyof MetaStoreMap];
  };
}

export class IndexedDBService {
  private static DB_NAME = "translation-db";
  private static PAIRS_STORE_NAME: keyof TranslationDB & "pairs" =
    "pairs" as const;
  private static META_STORE_NAME: keyof TranslationDB & "meta" =
    "meta" as const;
  private static DB_VERSION = 1;
  private db: IDBPDatabase<TranslationDB> | null = null;

  public async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<TranslationDB>(
      IndexedDBService.DB_NAME,
      IndexedDBService.DB_VERSION,
      {
        upgrade(db) {
          for (const storeName of [
            IndexedDBService.META_STORE_NAME,
            IndexedDBService.PAIRS_STORE_NAME,
          ]) {
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName);
            }
          }
        },
      }
    );
  }

  public async savePairAtIndex(
    index: number,
    pair: TranslationDB["pairs"]["value"]
  ): Promise<void> {
    if (!this.db) await this.init();
    console.log(
      `Saving pair ${index}  ${pair.english.length}  ${pair.spanish.length}`
    );
    await this.db!.put(IndexedDBService.PAIRS_STORE_NAME, pair, index);
  }

  public async getPairAtIndex(
    index: number
  ): Promise<TranslationDB["pairs"]["value"] | undefined> {
    if (!this.db) await this.init();
    return this.db!.get(IndexedDBService.PAIRS_STORE_NAME, index);
  }

  public async getMeta<K extends keyof MetaStoreMap>(
    key: K
  ): Promise<MetaStoreMap[K] | undefined> {
    if (!this.db) await this.init();
    return this.db!.get(IndexedDBService.META_STORE_NAME, key) as unknown as
      | MetaStoreMap[K]
      | undefined;
  }

  public async setMeta<K extends keyof MetaStoreMap>(
    key: K,
    value: MetaStoreMap[K]
  ): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put(IndexedDBService.META_STORE_NAME, value, key);
  }
}
