import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Icon from "@/components/ui/icon";

interface Hint {
  text: string;
  position: { x: number; y: number };
  size: "small" | "medium" | "large";
}

interface HintFlagProps {
  hint: Hint;
  isAdmin: boolean;
  onUpdateHint: (hint: Hint) => void;
  onDeleteHint: () => void;
}

const HintFlag: React.FC<HintFlagProps> = ({
  hint,
  isAdmin,
  onUpdateHint,
  onDeleteHint,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(hint.text);
  const [editSize, setEditSize] = useState(hint.size);
  const [isDragging, setIsDragging] = useState(false);

  const sizeClasses = {
    small: "text-xs px-2 py-1 max-w-32",
    medium: "text-sm px-3 py-2 max-w-48",
    large: "text-base px-4 py-3 max-w-64",
  };

  const handleSave = () => {
    onUpdateHint({
      ...hint,
      text: editText,
      size: editSize,
    });
    setIsEditing(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isAdmin) return;

    setIsDragging(true);
    const startX = e.clientX - hint.position.x;
    const startY = e.clientY - hint.position.y;

    const handleMouseMove = (e: MouseEvent) => {
      onUpdateHint({
        ...hint,
        position: {
          x: e.clientX - startX,
          y: e.clientY - startY,
        },
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className={`fixed z-10 bg-yellow-100 border-2 border-yellow-400 rounded-lg shadow-lg ${sizeClasses[hint.size]} ${
        isAdmin ? "cursor-move" : ""
      } ${isDragging ? "opacity-75" : ""}`}
      style={{
        left: `${hint.position.x}px`,
        top: `${hint.position.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Флажок */}
      <div className="absolute -top-3 -left-1">
        <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-6 border-b-red-500"></div>
        <div className="w-1 h-8 bg-red-500 -mt-1 ml-1.5"></div>
      </div>

      {/* Админ-кнопки */}
      {isAdmin && !isEditing && (
        <div className="absolute -top-2 -right-2 flex space-x-1">
          <Button
            size="sm"
            variant="ghost"
            className="w-6 h-6 rounded-full bg-white"
            onClick={() => setIsEditing(true)}
          >
            <Icon name="Edit" size={12} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-6 h-6 rounded-full bg-white text-red-500"
            onClick={onDeleteHint}
          >
            <Icon name="Trash2" size={12} />
          </Button>
        </div>
      )}

      {/* Режим редактирования */}
      {isAdmin && isEditing ? (
        <div className="space-y-2">
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Текст подсказки"
            className="text-xs"
          />
          <Select
            value={editSize}
            onValueChange={(value: "small" | "medium" | "large") =>
              setEditSize(value)
            }
          >
            <SelectTrigger className="h-6 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Маленький</SelectItem>
              <SelectItem value="medium">Средний</SelectItem>
              <SelectItem value="large">Большой</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-1">
            <Button size="sm" onClick={handleSave} className="h-6 text-xs">
              <Icon name="Check" size={12} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditText(hint.text);
                setEditSize(hint.size);
              }}
              className="h-6 text-xs"
            >
              <Icon name="X" size={12} />
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-yellow-800 font-medium">{hint.text}</p>
      )}
    </div>
  );
};

export default HintFlag;
