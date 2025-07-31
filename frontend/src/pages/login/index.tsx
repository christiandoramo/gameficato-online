// frontend/src/pages/login/index.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useRequest } from "@/lib/hooks/useRequest";

import { MethodsEnum } from "@/lib/utils/http-methods.enum";
import { URL_STORES } from "@/lib/api/base-urls";
import type { StoreType } from "@/lib/types/store-type";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [stores, setStores] = useState<StoreType[]>([]);
  const [selectedStore, setSelectedStore] = useState("");

  const { authRequest, request } = useRequest();
  const navigate = useNavigate();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStore(e.target.value);
  };

  const handleLogin = () => {
    authRequest(
      {
        username: email,
        password: "qualquer-coisa",
        storeId: selectedStore,
      },
      navigate
    );
  };

  useEffect(() => {
    (async () => {
      // 1) indique o tipo para o wrapper
      type ApiResponse = {
        success: boolean;
        data: StoreType[];
        error: string | null;
      };

      const resp = await request<ApiResponse>(URL_STORES, MethodsEnum.GET);
      if (resp) console.log("resp: ", resp);
      if (resp?.success && resp.data.length > 0) {
        console.log("resp: ", resp);
        setStores(resp.data); // ← aqui você pega o array verdadeiro
        setSelectedStore(resp.data[0].id);
      }
    })();
  }, []);

  // mapeia para o formato esperado pelo seu Select
  const lojaOptions = stores.map((s) => ({
    label: s.name,
    value: s.id,
  }));

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo */}
      <div className="flex-1 bg-teal-500 flex flex-col justify-center items-start p-12 text-white">
        <h1 className="text-4xl font-bold mb-6 text-yellow-300">
          Bem-vindo ao Gameficato Online!
        </h1>
        <p className="text-lg mb-4">
          Aproveite os jogos e ganhe prêmios na sua loja
        </p>
      </div>

      {/* Lado direito */}
      <div className="flex-1 bg-yellow-100 flex flex-col justify-center items-center p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-left mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">LOGIN</h2>
            <p className="text-gray-600">Faça login com o e-mail da sua loja</p>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Seu e-mail aqui"
                value={email}
                onChange={handleEmail}
                className="mt-1 bg-white/70 border-gray-300"
              />
            </div>

            {/* Select de lojas */}
            <div>
              <Label htmlFor="store" className="text-gray-700 font-medium">
                Loja
              </Label>
              <Select
                id="store"
                value={selectedStore}
                onChange={handleStoreChange}
                options={lojaOptions}
                className="mt-1 bg-white/70 border-gray-300"
              />
            </div>

            {/* Botão */}
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
