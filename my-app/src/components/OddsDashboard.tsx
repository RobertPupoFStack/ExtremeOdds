"use client";

import { Box, Grid, GridItem, Heading, Text, Stack } from "@chakra-ui/react";
import { useOdds } from "../hooks/useOdds";

const OddsDashboard = () => {
  const { odds, isLoading, error } = useOdds();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box padding="5">
      <Heading mb={6}>Odds Dashboard</Heading>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {odds.map((game) => (
          <GridItem key={game.id} p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">
              {game.teams ? game.teams.join(" vs ") : "Teams não disponíveis"}
            </Heading>
            {game.bookmakers.map((bookmaker) => (
              <Box key={bookmaker.title} mt={4}>
                <Text fontWeight="bold">{bookmaker.title}</Text>
                {bookmaker.markets[0]?.outcomes.map((outcome) => (
                  <Stack
                    direction="row"
                    spacing={4}
                    justify="space-between"
                    key={outcome.name}
                  >
                    <Text>{outcome.name}</Text>
                    <Text>{outcome.price}</Text>
                  </Stack>
                ))}
              </Box>
            ))}
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default OddsDashboard;
