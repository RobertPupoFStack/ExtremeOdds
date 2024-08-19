import { useState, useEffect } from "react";
import axios from "axios";

export const useOdds = () => {
  const [odds, setOdds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        const response = await axios.get(
          "https://api.the-odds-api.com/v4/sports/soccer/odds/", // endpoint alterado
          {
            params: {
              apiKey: "c789c76de9d7821293a7ae1c187bba47",
              regions: "eu",
              markets: "totals", // mercado de total de gols
              oddsFormat: "decimal",
            },
          }
        );
        setOdds(response.data);
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
