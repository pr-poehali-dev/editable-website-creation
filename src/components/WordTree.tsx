import React, { useState, useEffect } from "react";
import TreeNode from "./TreeNode";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface Word {
  id: number;
  word: string;
}

interface WordTreeProps {
  words: Word[];
  isAdmin: boolean;
  onOpenAdminPanel: () => void;
  onUpdateWord: (id: number, newWord: string) => void;
  onShowAdminAuth: () => void;
  onLogout: () => void;
}

const WordTree: React.FC<WordTreeProps> = ({
  words,
  isAdmin,
  onOpenAdminPanel,
  onUpdateWord,
  onShowAdminAuth,
  onLogout,
}) => {
  const [completedNodes, setCompletedNodes] = useState<Set<number>>(new Set());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressPercent =
      words.length > 0 ? (completedNodes.size / words.length) * 100 : 0;
    setProgress(progressPercent);
  }, [completedNodes, words.length]);

  const handleNodeComplete = (nodeId: number, word: string) => {
    setCompletedNodes((prev) => new Set([...prev, nodeId]));
  };

  const isNodeUnlocked = (nodeId: number) => {
    if (nodeId === 1) return true;
    return completedNodes.has(nodeId - 1);
  };

  const resetProgress = () => {
    setCompletedNodes(new Set());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Заголовок и админ-панель */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b z-40 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-montserrat font-bold text-primary">
              Дерево Слов
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="bg-gray-200 rounded-full h-2 w-32">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                {completedNodes.size}/{words.length}
              </span>
            </div>
          </div>

          <div className="flex space-x-2">
            {isAdmin ? (
              <>
                <Button variant="outline" onClick={onOpenAdminPanel}>
                  <Icon name="Settings" size={16} />
                  Настройки
                </Button>
                <Button variant="outline" onClick={onLogout}>
                  <Icon name="LogOut" size={16} />
                  Выйти
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={onShowAdminAuth}
                className="bg-white/90 backdrop-blur-sm"
              >
                <Icon name="Key" size={16} />
                Админ
              </Button>
            )}
            <Button variant="outline" onClick={resetProgress}>
              <Icon name="RotateCcw" size={16} />
              Сброс
            </Button>
          </div>
        </div>
      </div>

      {/* Дерево узлов */}
      <div className="max-w-2xl mx-auto py-8">
        {words.length === 0 ? (
          <div className="text-center py-16">
            <Icon
              name="TreePine"
              size={48}
              className="text-gray-400 mx-auto mb-4"
            />
            <p className="text-gray-600 mb-4">Дерево пустое</p>
            {isAdmin && (
              <Button onClick={onOpenAdminPanel}>
                <Icon name="Plus" size={16} />
                Добавить первое слово
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-0">
            {words.map((word) => (
              <TreeNode
                key={word.id}
                id={word.id}
                correctWord={word.word}
                isUnlocked={isNodeUnlocked(word.id)}
                isCompleted={completedNodes.has(word.id)}
                onComplete={handleNodeComplete}
                isAdmin={isAdmin}
                onUpdateWord={onUpdateWord}
              />
            ))}

            {/* Завершающий элемент */}
            {completedNodes.size === words.length && words.length > 0 && (
              <div className="text-center py-8">
                <div className="w-1 h-16 bg-gradient-to-b from-primary/30 to-transparent mx-auto mb-4"></div>
                <div className="bg-gradient-to-r from-green-400 to-primary p-6 rounded-full inline-block">
                  <Icon name="Trophy" size={32} className="text-white" />
                </div>
                <p className="text-xl font-montserrat font-bold text-primary mt-4">
                  Поздравляем! Дерево пройдено! 🎉
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordTree;
