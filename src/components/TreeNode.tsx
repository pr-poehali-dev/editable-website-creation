import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface TreeNodeProps {
  id: number;
  correctWord: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  onComplete: (id: number, word: string) => void;
  isAdmin: boolean;
  onUpdateWord: (id: number, newWord: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  id,
  correctWord,
  isUnlocked,
  isCompleted,
  onComplete,
  isAdmin,
  onUpdateWord,
}) => {
  const [userInput, setUserInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editWord, setEditWord] = useState(correctWord);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toLowerCase().trim() === correctWord.toLowerCase().trim()) {
      onComplete(id, userInput);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    } else {
      setUserInput("");
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 1500);
    }
  };

  const handleEditSave = () => {
    onUpdateWord(id, editWord);
    setIsEditing(false);
  };

  return (
    <div
      className={`relative transition-all duration-500 ${isUnlocked ? "opacity-100" : "opacity-40"}`}
    >
      {/* Ветка дерева */}
      <div className="flex flex-col items-center">
        {id > 1 && (
          <div className="w-1 h-16 bg-gradient-to-b from-primary/60 to-primary/30 mb-4"></div>
        )}

        {/* Узел */}
        <div
          className={`relative bg-white rounded-full p-8 shadow-lg border-4 transition-all duration-300 ${
            isCompleted
              ? "border-green-400 bg-green-50"
              : isUnlocked
                ? "border-primary"
                : "border-gray-300"
          }`}
        >
          {/* Админ-кнопка редактирования */}
          {isAdmin && !isEditing && (
            <Button
              size="sm"
              variant="ghost"
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full"
              onClick={() => setIsEditing(true)}
            >
              <Icon name="Edit" size={16} />
            </Button>
          )}

          {/* Режим редактирования админа */}
          {isAdmin && isEditing ? (
            <div className="flex flex-col items-center space-y-2">
              <Input
                value={editWord}
                onChange={(e) => setEditWord(e.target.value)}
                className="text-center w-32"
                placeholder="Правильное слово"
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleEditSave}>
                  <Icon name="Check" size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditWord(correctWord);
                  }}
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Обычный режим */}
              {isCompleted ? (
                <div className="text-center">
                  <Icon
                    name="Check"
                    size={32}
                    className="text-green-500 mx-auto mb-2"
                  />
                  <p className="text-green-700 font-semibold">{correctWord}</p>
                </div>
              ) : isUnlocked ? (
                <form onSubmit={handleSubmit} className="text-center">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Icon
                        name="HelpCircle"
                        size={24}
                        className="text-primary"
                      />
                    </div>
                    <p className="text-sm text-gray-600">Узел #{id}</p>
                  </div>
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Введите слово"
                    className="text-center mb-3 w-32"
                    disabled={!isUnlocked}
                  />
                  <Button type="submit" size="sm" disabled={!userInput.trim()}>
                    Проверить
                  </Button>
                </form>
              ) : (
                <div className="text-center">
                  <Icon
                    name="Lock"
                    size={32}
                    className="text-gray-400 mx-auto mb-2"
                  />
                  <p className="text-gray-500 text-sm">Заблокировано</p>
                </div>
              )}
            </>
          )}

          {/* Обратная связь */}
          {showFeedback && (
            <div
              className={`absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-sm font-medium ${
                isCompleted
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isCompleted ? "✓ Правильно!" : "✗ Попробуй еще"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreeNode;
