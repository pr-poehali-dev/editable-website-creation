import React, { useState, useEffect } from "react";
import TreeNode from "./TreeNode";
import HintFlag from "./HintFlag";
import { Word } from "@/services/wordApi";

interface WordTreeProps {
  words: Word[];
  isAdmin: boolean;
  onUpdateWord: (id: number, newWord: string) => void;
  onUpdateWords: (words: Word[]) => void;
}

const WordTree: React.FC<WordTreeProps> = ({
  words,
  isAdmin,
  onUpdateWord,
  onUpdateWords,
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

  const handleUpdateHint = (wordId: number, hint: Word["hint"]) => {
    const updatedWords = words.map((word) =>
      word.id === wordId ? { ...word, hint } : word,
    );
    onUpdateWords(updatedWords);
  };

  const handleDeleteHint = (wordId: number) => {
    const updatedWords = words.map((word) =>
      word.id === wordId ? { ...word, hint: undefined } : word,
    );
    onUpdateWords(updatedWords);
    setVisibleHints((prev) => {
      const newSet = new Set(prev);
      newSet.delete(wordId);
      return newSet;
    });
  };

  return (
    <div className="relative min-h-screen py-8">
      <div className="flex flex-col items-center space-y-8">
        {words.map((word, index) => {
          const isUnlocked = index === 0 || completedNodes.has(word.id - 1);
          const isCompleted = completedNodes.has(word.id);

          return (
            <TreeNode
              key={word.id}
              id={word.id}
              correctWord={word.word}
              isUnlocked={isUnlocked}
              isCompleted={isCompleted}
              onComplete={handleNodeComplete}
              isAdmin={isAdmin}
              onUpdateWord={onUpdateWord}
            />
          );
        })}
      </div>

      {/* Отображение подсказок */}
      {words.map((word) => {
        if (!word.hint || !visibleHints.has(word.id)) return null;

        return (
          <HintFlag
            key={`hint-${word.id}`}
            hint={word.hint}
            isAdmin={isAdmin}
            onUpdateHint={(hint) => handleUpdateHint(word.id, hint)}
            onDeleteHint={() => handleDeleteHint(word.id)}
          />
        );
      })}
    </div>
  );
};

export default WordTree;
