// frontend/src/pages/login/index.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRequest } from "@/lib/hooks/useRequest";

import { Select } from "@/components/ui/select";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [store, setStore] = useState("mercato-online");

  const lojas = [
    { label: "Mercato Online", value: "mercato-online" },
    { label: "Loja do Zé", value: "loja-ze" },
    { label: "SuperTech", value: "supertech" },
  ];

  const { authRequest } = useRequest();
  const navigate = useNavigate();

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleLogin = () => {
    authRequest(
      {
        email: email,
      },
      navigate
    );
  };

  const handleStoreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStore(event.target.value);
  };
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 bg-teal-500 flex flex-col justify-center items-start p-12 text-white">
        <h1 className="text-4xl font-bold mb-6 text-yellow-300">
          Bem-vindo ao Gameficato Online!
        </h1>
        <p className="text-lg mb-4">
          Aproveite os jogos e ganhe prêmios na sua loja
        </p>
      </div>

      <div className="flex-1 bg-yellow-100 flex flex-col justify-center items-center p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-left mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">LOGIN</h2>
            <p className="text-gray-600">Faça Login com o email da sua loja</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Escreva seu e-mail ou telefone aqui!"
                value={email}
                onChange={handleEmail}
                className="mt-1 bg-white/70 border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="store" className="text-gray-700 font-medium">
                Loja
              </Label>
              <Select
                id="store"
                value={store}
                onChange={handleStoreChange}
                options={lojas}
                className="mt-1 bg-white/70 border-gray-300"
              />
            </div>
            <Button
              onClick={handleLogin}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-full"
            >
              Entre agora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
