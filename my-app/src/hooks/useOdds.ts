import axios from "axios";
import { useEffect, useState } from "react";

interface Outcome {
  name: string;
  price: number;
}

interface Market {
  outcomes: Outcome[];
}

interface Bookmaker {
  title: string;
  markets: Market[];
}

interface Game {
  id: string;
  sport_key: string; // Note que a propriedade se chama sport_key
  teams: string[];
  bookmakers: Bookmaker[];
}

export const useOdds = () => {
  const [odds, setOdds] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        const response = await axios.get<Game[]>(
          "https://api.the-odds-api.com/v4/sports/soccer_epl/odds/",
          {
            params: {
              apiKey: "c789c76de9d7821293a7ae1c187bba47",
              regions: "eu",
              markets: "h2h",
              oddsFormat: "decimal",
            },
          }
        );

        // Aqui, preservamos todas as propriedades da interface Game
        const organizedOdds = response.data.map((game) => ({
          ...game, // Mantém as propriedades existentes (id, sport_key, teams, bookmakers)
          bookmakers: game.bookmakers.map((bookmaker) => ({
            ...bookmaker, // Mantém title e markets
            markets: bookmaker.markets.map((market) => ({
              ...market, // Mantém outcomes
              outcomes: market.outcomes,
            })),
          })),
        }));

        setOdds(organizedOdds);
      } catch (err) {
        setError("Erro ao buscar as odds");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOdds();
  }, []);

  return { odds, isLoading, error };
};
