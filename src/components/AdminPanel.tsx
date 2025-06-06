import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface Word {
  id: number;
  word: string;
}

interface AdminPanelProps {
  words: Word[];
  onUpdateWords: (words: Word[]) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  words,
  onUpdateWords,
  onClose,
}) => {
  const [newWord, setNewWord] = useState("");

  const handleAddWord = () => {
    if (newWord.trim()) {
      const nextId = Math.max(...words.map((w) => w.id), 0) + 1;
      onUpdateWords([...words, { id: nextId, word: newWord.trim() }]);
      setNewWord("");
    }
  };

  const handleRemoveWord = (id: number) => {
    onUpdateWords(words.filter((w) => w.id !== id));
  };

  const handleUpdateWord = (id: number, newWordText: string) => {
    onUpdateWords(
      words.map((w) => (w.id === id ? { ...w, word: newWordText } : w)),
    );
  };

  const handleAddHint = (wordId: number) => {
    onUpdateWords(
      words.map((w) =>
        w.id === wordId
          ? {
              ...w,
              hint: {
                text: "Новая подсказка",
                position: { x: 200, y: 100 },
                size: "medium" as const,
              },
            }
          : w,
      ),
    );
  };

  const handleRemoveHint = (wordId: number) => {
    onUpdateWords(
      words.map((w) => (w.id === wordId ? { ...w, hint: undefined } : w)),
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-96 max-h-[80vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-montserrat">
                Админ-панель
              </CardTitle>
              <CardDescription>Управление словами дерева</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          {/* Добавление нового слова */}
          <div className="flex space-x-2 mb-4">
            <Input
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Новое слово"
              onKeyPress={(e) => e.key === "Enter" && handleAddWord()}
            />
            <Button onClick={handleAddWord} disabled={!newWord.trim()}>
              <Icon name="Plus" size={16} />
            </Button>
          </div>

          {/* Список слов */}
          <div className="space-y-2">
            {words.map((word, index) => (
              <WordItem
                key={word.id}
                word={word}
                index={index + 1}
                onUpdate={handleUpdateWord}
                onRemove={handleRemoveWord}
                onAddHint={handleAddHint}
                onRemoveHint={handleRemoveHint}
              />
            ))}

            {words.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Добавьте первое слово для дерева
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface WordItemProps {
  word: Word;
  index: number;
  onUpdate: (id: number, newWord: string) => void;
  onRemove: (id: number) => void;
  onAddHint: (id: number) => void;
  onRemoveHint: (id: number) => void;
}

const WordItem: React.FC<WordItemProps> = ({
  word,
  index,
  onUpdate,
  onRemove,
  onAddHint,
  onRemoveHint,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(word.word);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(word.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(word.word);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-500 w-6">#{index}</span>

      {isEditing ? (
        <>
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-1"
            onKeyPress={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
          <Button size="sm" variant="ghost" onClick={handleSave}>
            <Icon name="Check" size={16} />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            <Icon name="X" size={16} />
          </Button>
        </>
      ) : (
        <>
          <span className="flex-1 font-medium">{word.word}</span>
          {word.hint && (
            <span className="text-xs bg-yellow-100 px-2 py-1 rounded">
              Подсказка: {word.hint.text.slice(0, 20)}...
            </span>
          )}
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
            <Icon name="Edit" size={16} />
          </Button>
          {word.hint ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemoveHint(word.id)}
            >
              <Icon name="Flag" size={16} className="text-yellow-500" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAddHint(word.id)}
            >
              <Icon name="Plus" size={16} className="text-gray-400" />
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => onRemove(word.id)}>
            <Icon name="Trash2" size={16} />
          </Button>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
