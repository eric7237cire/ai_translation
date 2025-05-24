import type { StorageService } from "@services/storage.service";
import { ref } from "vue";

export function useSaveLoad(storageService: StorageService) {
  const fileInput = ref<HTMLInputElement | null>(null);

  async function triggerFile(): Promise<void> {
    const isFileSystemAPISupported = "showSaveFilePicker" in window;

    if (!isFileSystemAPISupported) {
      fileInput.value?.click();
      return;
    }

    //Android load
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: "application/json",
          accept: {
            "application/json": [".json"],
          },
        },
      ],
      multiple: false,
    });

    const file = await handle.getFile();
    const jsonString = await file.text();

    storageService.importTranslationDB(jsonString);
  }
  async function saveToFile(): Promise<void> {
    const jsonString = await storageService.exportTranslationDB();

    const isFileSystemAPISupported = "showSaveFilePicker" in window;

    if (!isFileSystemAPISupported) {
      //const jsonString = JSON.stringify(json);
      //console.log(jsonString);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "data.json"; // filename
      link.click();

      URL.revokeObjectURL(url); // cleanup
    } else {
      //Android save
      const handle = await window.showSaveFilePicker({
        suggestedName: "data.json",
        types: [
          { description: "JSON", accept: { "application/json": [".json"] } },
        ],
      });

      const writable = await handle.createWritable();
      const jsonString = await storageService.exportTranslationDB();
      await writable.write(jsonString);
      await writable.close();
    }
  }

  async function loadFromFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const jsonString = reader.result as string;
        //const json = JSON.parse();
        //console.log(`Loaded JSON length: ${}:", json);
        storageService.importTranslationDB(jsonString);
        // Do something with json...
      } catch (err) {
        console.error("Invalid JSON file", err);
      }
    };

    reader.readAsText(file);
  }

  return { saveToFile, loadFromFile, triggerFile, fileInput };
}
