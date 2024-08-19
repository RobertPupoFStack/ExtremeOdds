"use client";

import { useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Stack,
  Button,
} from "@chakra-ui/react";
import { useOdds } from "../hooks/useOdds";

interface Outcome {
  name: string;
  price: number;
  point: number;
}

interface Market {
  key: string;
  outcomes: Outcome[];
}

interface Bookmaker {
  title: string;
  markets: Market[];
}

interface Game {
  id: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

const OddsDashboard = () => {
  const { odds, isLoading, error } = useOdds();
  const [showOpportunities, setShowOpportunities] = useState(false);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const findOpportunities = () => {
    return odds.filter((game: Game) => {
      return game.bookmakers.some((bookmaker1: Bookmaker) => {
        return bookmaker1.markets.some((market1: Market) => {
          if (market1.key === "totals" || market1.key === "over_under") {
            return game.bookmakers.some((bookmaker2: Bookmaker) => {
              if (bookmaker1.title !== bookmaker2.title) {
                return bookmaker2.markets.some((market2: Market) => {
                  if (market2.key === market1.key) {
                    const overOdd1 = market1.outcomes.find((outcome: Outcome) =>
                      outcome.name.includes("Over")
                    )?.price;
                    const underOdd1 = market1.outcomes.find(
                      (outcome: Outcome) => outcome.name.includes("Under")
                    )?.price;

                    const overOdd2 = market2.outcomes.find((outcome: Outcome) =>
                      outcome.name.includes("Over")
                    )?.price;
                    const underOdd2 = market2.outcomes.find(
                      (outcome: Outcome) => outcome.name.includes("Under")
                    )?.price;

                    return (
                      (overOdd1 && overOdd2 && overOdd1 > 2 && overOdd2 > 2) ||
                      (underOdd1 && underOdd2 && underOdd1 > 2 && underOdd2 > 2)
                    );
                  }
                  return false;
                });
              }
              return false;
            });
          }
          return false;
        });
      });
    });
  };

  const opportunities = findOpportunities();

  return (
    <Box padding="5">
      <Heading mb={6} textAlign="center">
        Odds Dashboard - Total de Gols
      </Heading>
      <Button
        onClick={() => setShowOpportunities((prev) => !prev)}
        mb={6}
        colorScheme="teal"
      >
        {showOpportunities
          ? "Mostrar Todos os Jogos"
          : "Procurar Oportunidades"}
      </Button>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {(showOpportunities ? opportunities : odds).map((game: Game) => (
          <GridItem
            key={game.id}
            p={5}
            shadow="md"
            borderWidth="2px"
            borderColor="gray.300"
            borderRadius="10px"
            bg="white"
            boxShadow="lg"
          >
            <Heading fontSize="xl" mb={4}>
              {game.home_team} vs {game.away_team}
            </Heading>
            {game.bookmakers.map((bookmaker: Bookmaker) => (
              <Box
                key={bookmaker.title}
                mt={4}
                border="1px"
                borderColor="black"
                borderRadius="10px"
                boxShadow="sm"
                bg="gray.50"
                p={4}
              >
                <Text fontWeight="bold" fontSize="lg" mb={2}>
                  {bookmaker.title}
                </Text>
                {showOpportunities ? (
                  <>
                    {/* Odds Acima (Over) */}
                    <Box
                      mt={4}
                      border="1px"
                      borderColor="green.500"
                      borderRadius="10px"
                      boxShadow="sm"
                      bg="green.50"
                      p={4}
                    >
                      {bookmaker.markets
                        .filter(
                          (market: Market) =>
                            market.key === "totals" ||
                            market.key === "over_under"
                        )
                        .map((market: Market) => (
                          <Box key={market.key} mt={2}>
                            {market.outcomes
                              .filter(
                                (outcome: Outcome) =>
                                  outcome.name.includes("Over") &&
                                  outcome.price > 2
                              )
                              .map((outcome: Outcome) => (
                                <Stack
                                  direction="row"
                                  spacing={4}
                                  justify="space-between"
                                  key={outcome.name}
                                  p={2}
                                  border="1px"
                                  borderColor="gray.200"
                                  borderRadius="5px"
                                  bg="gray.50"
                                >
                                  <Text>
                                    {outcome.name} de {outcome.point} gols
                                  </Text>
                                  <Text fontWeight="bold" color="gray.700">
                                    {outcome.price.toFixed(2)}
                                  </Text>
                                </Stack>
                              ))}
                          </Box>
                        ))}
                    </Box>

                    {/* Odds Abaixo (Under) */}
                    <Box
                      mt={4}
                      border="1px"
                      borderColor="red.500"
                      borderRadius="10px"
                      boxShadow="sm"
                      bg="red.50"
                      p={4}
                    >
                      {bookmaker.markets
                        .filter(
                          (market: Market) =>
                            market.key === "totals" ||
                            market.key === "over_under"
                        )
                        .map((market: Market) => (
                          <Box key={market.key} mt={2}>
                            {market.outcomes
                              .filter(
                                (outcome: Outcome) =>
                                  outcome.name.includes("Under") &&
                                  outcome.price > 2
                              )
                              .map((outcome: Outcome) => (
                                <Stack
                                  direction="row"
                                  spacing={4}
                                  justify="space-between"
                                  key={outcome.name}
                                  p={2}
                                  border="1px"
                                  borderColor="gray.200"
                                  borderRadius="5px"
                                  bg="gray.50"
                                >
                                  <Text>
                                    {outcome.name} de {outcome.point} gols
                                  </Text>
                                  <Text fontWeight="bold" color="gray.700">
                                    {outcome.price.toFixed(2)}
                                  </Text>
                                </Stack>
                              ))}
                          </Box>
                        ))}
                    </Box>
                  </>
                ) : (
                  bookmaker.markets
                    .filter(
                      (market: Market) =>
                        market.key === "totals" || market.key === "over_under"
                    )
                    .map((market: Market) => (
                      <Box key={market.key} mt={2}>
                        {market.outcomes.map((outcome: Outcome) => (
                          <Stack
                            direction="row"
                            spacing={4}
                            justify="space-between"
                            key={outcome.name}
                            p={2}
                            border="1px"
                            borderColor="gray.200"
                            borderRadius="5px"
                            bg="gray.50"
                          >
                            <Text>
                              {outcome.name.includes("Over")
                                ? "Acima"
                                : "Abaixo"}{" "}
                              de {outcome.point} gols
                            </Text>
                            <Text fontWeight="bold" color="gray.700">
                              {outcome.price.toFixed(2)}
                            </Text>
                          </Stack>
                        ))}
                      </Box>
                    ))
                )}
              </Box>
            ))}
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default OddsDashboard;
