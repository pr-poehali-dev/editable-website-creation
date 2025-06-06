import React, { useState, useEffect } from "react";
import AdminAuth from "@/components/AdminAuth";
import WordTree from "@/components/WordTree";
import AdminPanel from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface Word {
  id: number;
  word: string;
}

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [words, setWords] = useState<Word[]>([
    { id: 1, word: "солнце" },
    { id: 2, word: "луна" },
    { id: 3, word: "звезды" },
  ]);

  // Сохранение в localStorage
  useEffect(() => {
    const savedWords = localStorage.getItem("wordTreeWords");
    if (savedWords) {
      setWords(JSON.parse(savedWords));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wordTreeWords", JSON.stringify(words));
  }, [words]);

  const handleAdminAuth = () => {
    setIsAdmin(true);
    setShowAdminAuth(false);
  };

  const handleUpdateWords = (newWords: Word[]) => {
    setWords(newWords);
  };

  const handleUpdateWord = (id: number, newWord: string) => {
    setWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, word: newWord } : w)),
    );
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setShowAdminPanel(false);
  };

  return (
    <div className="min-h-screen">
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
    </div>
  );
};

export default Index;
