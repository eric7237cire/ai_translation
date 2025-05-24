import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { isNil } from "lodash";
import { ref } from "vue";

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

export class StorageService {
  private static DB_NAME = "translation-db";
  private static PAIRS_STORE_NAME: keyof TranslationDB & "pairs" =
    "pairs" as const;
  private static META_STORE_NAME: keyof TranslationDB & "meta" =
    "meta" as const;
  private static DB_VERSION = 1;
  private db: IDBPDatabase<TranslationDB> | null = null;
  //Used in watchEffect to load on data update
  public versionTracker = ref(0);

  public async init(): Promise<void> {
    if (this.db) {
      return;
    }

    this.db = await openDB<TranslationDB>(
      StorageService.DB_NAME,
      StorageService.DB_VERSION,
      {
        upgrade(db) {
          for (const storeName of [
            StorageService.META_STORE_NAME,
            StorageService.PAIRS_STORE_NAME,
          ]) {
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName);
            }
          }
        },
      }
    );

    this.versionTracker.value += 1;
  }

  public async savePairAtIndex(
    index: number,
    pair: TranslationDB["pairs"]["value"]
  ): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    /*
    console.log(
      `Saving pair ${index}  ${pair.english.length}  ${pair.spanish.length}`
    );*/
    await this.db!.put(StorageService.PAIRS_STORE_NAME, pair, index);
  }

  public async getPairAtIndex(
    index: number
  ): Promise<TranslationDB["pairs"]["value"] | undefined> {
    if (!this.db) {
      await this.init();
    }
    return this.db!.get(StorageService.PAIRS_STORE_NAME, index);
  }

  public async getMeta<K extends keyof MetaStoreMap>(
    key: K
  ): Promise<MetaStoreMap[K] | undefined> {
    if (!this.db) {
      await this.init();
    }
    return this.db!.get(StorageService.META_STORE_NAME, key) as unknown as
      | MetaStoreMap[K]
      | undefined;
  }

  public async setMeta<K extends keyof MetaStoreMap>(
    key: K,
    value: MetaStoreMap[K]
  ): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    await this.db!.put(StorageService.META_STORE_NAME, value, key);
  }

  public async exportTranslationDB(): Promise<string> {
    if (!this.db) {
      await this.init();
    }

    if (isNil(this.db)) {
      return "";
    }

    const pairs = await this.db.getAll(StorageService.PAIRS_STORE_NAME);
    const metaKeys = await this.db.getAllKeys(StorageService.META_STORE_NAME);

    const meta: Record<string, unknown> = {};
    for (const key of metaKeys) {
      meta[key as string] = await this.db.get("meta", key);
    }

    const data = { pairs, meta };
    return JSON.stringify(data, null, 2);
  }

  public async importTranslationDB(json: string) {
    const parsed = JSON.parse(json) as {
      pairs: { english: string; spanish: string }[];
      meta: Record<string, unknown>;
    };

    if (!this.db) {
      await this.init();
    }

    if (isNil(this.db)) {
      return;
    }

    const tx = this.db.transaction(
      [StorageService.PAIRS_STORE_NAME, StorageService.META_STORE_NAME],
      "readwrite"
    );

    // Clear old data
    await tx.objectStore(StorageService.PAIRS_STORE_NAME).clear();
    await tx.objectStore(StorageService.META_STORE_NAME).clear();

    // Add new data
    for (const [index, pair] of parsed.pairs.entries()) {
      await tx.objectStore(StorageService.PAIRS_STORE_NAME).add(pair, index);
    }

    for (const [key, value] of Object.entries(parsed.meta)) {
      await tx
        .objectStore(StorageService.META_STORE_NAME)
        .put(value as number, key as keyof MetaStoreMap);
    }

    await tx.done;

    this.versionTracker.value += 1;
  }
}
