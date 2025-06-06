import React, { useState, useEffect } from "react";
import AdminAuth from "@/components/AdminAuth";
import WordTree from "@/components/WordTree";
import AdminPanel from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { wordApi, Word } from "@/services/wordApi";

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка из глобального API
  useEffect(() => {
    const loadWords = async () => {
      try {
        const globalWords = await wordApi.getWords();
        setWords(globalWords);
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWords();

    // Подписка на изменения от других устройств/вкладок
    const unsubscribe = wordApi.onWordsUpdated((newWords) => {
      setWords(newWords);
    });

    return unsubscribe;
  }, []);

  const handleAdminAuth = () => {
    setIsAdmin(true);
    setShowAdminAuth(false);
  };

  const handleUpdateWords = async (newWords: Word[]) => {
    setWords(newWords);
    await wordApi.saveWords(newWords);
  };

  const handleUpdateWord = async (id: number, newWord: string) => {
    const updatedWords = words.map((w) =>
      w.id === id ? { ...w, word: newWord } : w,
    );
    setWords(updatedWords);
    await wordApi.saveWords(updatedWords);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setShowAdminPanel(false);
  };

  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Icon
              name="Loader"
              size={32}
              className="animate-spin text-primary mx-auto mb-2"
            />
            <p className="text-gray-600">Загрузка дерева слов...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Основной контент */}
          <WordTree
            words={words}
            isAdmin={isAdmin}
            onOpenAdminPanel={() => setShowAdminPanel(true)}
            onUpdateWord={handleUpdateWord}
            onShowAdminAuth={() => setShowAdminAuth(true)}
            onLogout={handleLogout}
          />

          {/* Модальные окна */}
          {showAdminAuth && <AdminAuth onAuthenticated={handleAdminAuth} />}

          {showAdminPanel && (
            <AdminPanel
              words={words}
              onUpdateWords={handleUpdateWords}
              onClose={() => setShowAdminPanel(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Index;
