import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface TreeNodeProps {
  word: {
    id: number;
    word: string;
    hint?: {
      text: string;
      position: { x: number; y: number };
      size: "small" | "medium" | "large";
    };
  };
  isCompleted: boolean;
  isDisabled: boolean;
  onComplete: (id: number, word: string) => void;
  isAdmin: boolean;
  onUpdateWord: (id: number, newWord: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  word,
  isCompleted,
  isDisabled,
  onComplete,
  isAdmin,
  onUpdateWord,
}) => {
  const [userInput, setUserInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editWord, setEditWord] = useState(word.word);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toLowerCase().trim() === word.word.toLowerCase().trim()) {
      onComplete(word.id, userInput);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    } else {
      setUserInput("");
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 1500);
    }
  };

  const handleEditSave = () => {
    onUpdateWord(word.id, editWord);
    setIsEditing(false);
  };

  return (
    <div
      className={`relative transition-all duration-500 ${!isDisabled ? "opacity-100" : "opacity-40"}`}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
        {/* Номер узла */}
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
          {word.id}
        </div>

        {/* Админ режим редактирования */}
        {isAdmin && (
          <div className="mb-4 p-2 bg-yellow-50 rounded border">
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  value={editWord}
                  onChange={(e) => setEditWord(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleEditSave} size="sm">
                  <Icon name="Check" size={16} />
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  size="sm"
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Правильное слово: {word.word}
                </span>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="ghost"
                  size="sm"
                >
                  <Icon name="Edit" size={16} />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Основная форма ввода */}
        {isCompleted ? (
          <div className="text-center">
            <div className="text-green-600 mb-2">
              <Icon name="CheckCircle" size={32} className="mx-auto" />
            </div>
            <p className="text-lg font-semibold text-gray-800">{word.word}</p>
            <p className="text-sm text-green-600 mt-1">Правильно!</p>
          </div>
        ) : !isDisabled ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">Введите слово:</p>
            </div>
            <Input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ваш ответ..."
              className="text-center text-lg"
              disabled={isDisabled}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={!userInput.trim() || isDisabled}
            >
              Проверить
            </Button>
          </form>
        ) : (
          <div className="text-center text-gray-500">
            <Icon name="Lock" size={32} className="mx-auto mb-2" />
            <p>Разблокируется после предыдущего слова</p>
          </div>
        )}

        {/* Обратная связь */}
        {showFeedback && (
          <div
            className={`mt-4 p-3 rounded text-center ${
              isCompleted
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isCompleted
              ? "Правильно! ✅"
              : "Неправильно, попробуйте еще раз ❌"}
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeNode;
