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

interface AdminAuthProps {
  onAuthenticated: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthenticated }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === "подсолнух") {
      onAuthenticated();
      setError("");
    } else {
      setError("Неверный код доступа");
      setCode("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-96">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-montserrat text-primary">
            Админ-доступ
          </CardTitle>
          <CardDescription>
            Введите код для редактирования сайта
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Введите код"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-center"
            />
            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
