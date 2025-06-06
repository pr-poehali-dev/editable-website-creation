// Симуляция глобального API для слов
interface Word {
  id: number;
  word: string;
  hint?: {
    text: string;
    position: { x: number; y: number };
    size: "small" | "medium" | "large";
  };
}

// Используем простой глобальный объект для демонстрации
// В реальном проекте это был бы Firebase/Supabase
const GLOBAL_STORAGE_KEY = "word_tree_global_data";

class WordAPI {
  private baseUrl = "https://api.jsonbin.io/v3/b/word-tree-data";

  // Fallback к глобальному хранилищу в памяти для демо
  private globalData: Word[] = [
    {
      id: 1,
      word: "солнце",
      hint: {
        text: "Ночное светило появляется после дня",
        position: { x: 200, y: 100 },
        size: "medium",
      },
    },
    {
      id: 2,
      word: "луна",
      hint: {
        text: "Мерцающие точки на небе",
        position: { x: 300, y: 150 },
        size: "small",
      },
    },
    { id: 3, word: "звезды" },
  ];

  async getWords(): Promise<Word[]> {
    try {
      // Пытаемся получить из sessionStorage (имитация глобального API)
      const globalData = sessionStorage.getItem(GLOBAL_STORAGE_KEY);
      if (globalData) {
        return JSON.parse(globalData);
      }

      // Если данных нет, возвращаем дефолтные
      await this.saveWords(this.globalData);
      return this.globalData;
    } catch (error) {
      console.error("Ошибка загрузки слов:", error);
      return this.globalData;
    }
  }

  async saveWords(words: Word[]): Promise<void> {
    try {
      // Сохраняем в sessionStorage (имитация глобального API)
      sessionStorage.setItem(GLOBAL_STORAGE_KEY, JSON.stringify(words));
      this.globalData = words;

      // Уведомляем все открытые вкладки об изменениях
      window.dispatchEvent(
        new CustomEvent("wordsUpdated", {
          detail: { words },
        }),
      );
    } catch (error) {
      console.error("Ошибка сохранения слов:", error);
    }
  }

  // Подписка на изменения от других вкладок
  onWordsUpdated(callback: (words: Word[]) => void) {
    const handler = (event: CustomEvent) => {
      callback(event.detail.words);
    };

    window.addEventListener("wordsUpdated", handler as EventListener);

    // Также слушаем storage events для синхронизации между вкладками
    const storageHandler = (event: StorageEvent) => {
      if (event.key === GLOBAL_STORAGE_KEY && event.newValue) {
        callback(JSON.parse(event.newValue));
      }
    };

    window.addEventListener("storage", storageHandler);

    return () => {
      window.removeEventListener("wordsUpdated", handler as EventListener);
      window.removeEventListener("storage", storageHandler);
    };
  }
}

export const wordApi = new WordAPI();
export type { Word };
