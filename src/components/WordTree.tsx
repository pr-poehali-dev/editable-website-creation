import React, { useState, useEffect } from "react";
import TreeNode from "./TreeNode";
import HintFlag from "./HintFlag";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Word } from "@/services/wordApi";

interface WordTreeProps {
  words: Word[];
  isAdmin: boolean;
  onUpdateWord: (id: number, newWord: string) => void;
  onOpenAdminPanel: () => void;
  onShowAdminAuth: () => void;
  onLogout: () => void;
}

const WordTree: React.FC<WordTreeProps> = ({
  words,
  isAdmin,
  onUpdateWord,
  onOpenAdminPanel,
  onShowAdminAuth,
  onLogout,
}) => {
  const [completedNodes, setCompletedNodes] = useState<Set<number>>(new Set());
  const [visibleHints, setVisibleHints] = useState<Set<number>>(new Set());

  const handleNodeComplete = (id: number, word: string) => {
    const newCompleted = new Set(completedNodes);
    newCompleted.add(id);
    setCompletedNodes(newCompleted);

    // Показать подсказку к следующему слову, если она есть
    const nextWord = words.find((w) => w.id === id + 1);
    if (nextWord?.hint) {
      setVisibleHints((prev) => new Set([...prev, id + 1]));
    }
  };

  const handleReset = () => {
    setCompletedNodes(new Set());
    setVisibleHints(new Set());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Верхняя панель */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Icon name="TreePine" size={28} />
            Дерево слов
          </h1>
          <div className="flex items-center gap-2">
            <Button onClick={handleReset} variant="outline" size="sm">
              <Icon name="RotateCcw" size={16} />
              Сброс
            </Button>
            {isAdmin ? (
              <div className="flex gap-2">
                <Button onClick={onOpenAdminPanel} variant="outline" size="sm">
                  <Icon name="Settings" size={16} />
                  Панель
                </Button>
                <Button onClick={onLogout} variant="ghost" size="sm">
                  <Icon name="LogOut" size={16} />
                  Выход
                </Button>
              </div>
            ) : (
              <Button onClick={onShowAdminAuth} variant="ghost" size="sm">
                <Icon name="Shield" size={16} />
                Админ
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-4xl mx-auto p-8">
        {words.length === 0 ? (
          <div className="text-center py-12">
            <Icon
              name="TreePine"
              size={48}
              className="mx-auto text-gray-400 mb-4"
            />
            <p className="text-gray-500 text-lg">Дерево слов пусто</p>
            <p className="text-gray-400 text-sm mt-2">
              Войдите в админ-панель, чтобы добавить слова
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {words.map((word, index) => (
              <div key={word.id} className="relative">
                <TreeNode
                  word={word}
                  isCompleted={completedNodes.has(word.id)}
                  isDisabled={
                    index > 0 && !completedNodes.has(words[index - 1].id)
                  }
                  onComplete={handleNodeComplete}
                  onUpdateWord={onUpdateWord}
                  isAdmin={isAdmin}
                />

                {word.hint && visibleHints.has(word.id) && (
                  <HintFlag
                    hint={word.hint}
                    onClose={() => {
                      setVisibleHints((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(word.id);
                        return newSet;
                      });
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordTree;
