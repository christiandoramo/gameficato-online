// frontend/src/pages/home/index.tsx
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const games = [
    {
      id: 1,
      title: "Check-in diário",
      description: "Entre diariamente e progrida em prêmios",
      img: "./checkin-thumb.png",
    },
    {
      id: 2,
      title: "Roleta das moedas",
      description:
        "Roleta e ganhe moedas grátis diariamente, ganhe o azar de ganhar aqui",
      img: "https://via.placeholder.com/400x200?text=Roleta+Premiada",
    },
  ];

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {games.map((g) => (
        <div
          key={g.id}
          className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden cursor-pointer"
          onClick={() => navigate(`/gameplay/${g.id}`)}
        >
          <img src={g.img} alt={g.title} className="w-full h-48 object-cover" />
          <div className="p-4 bg-[#D9D9D9]">
            <h3 className="text-xl font-semibold mb-2">{g.title}</h3>
            <p className="text-gray-700">{g.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
