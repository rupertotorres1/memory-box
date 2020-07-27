import React, { ChangeEvent, useState, FormEvent } from "react";
import {
  Button as MaterialButton,
  IconButton,
  Typography,
  TextField,
  Container as MaterialContainer,
  InputAdornment,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { styled } from "@material-ui/core/styles";
import useSWR, { responseInterface } from "swr";
import { apiPost, apiDelete } from "../fetchHelpers";
import theme from "./theme";
import { Achievement } from "../types";

const Container = styled(MaterialContainer)({
  marginTop: theme.spacing(2),
  textAlign: "center",
  maxWidth: "900px",
});

const Heading = styled(Typography)({
  marginBottom: theme.spacing(4),
});

const Body = styled(Typography)({
  marginBottom: theme.spacing(1),
});

const Button = styled(MaterialButton)({
  display: "block",
  margin: theme.spacing(0, "auto", 4, "auto"),
});

type AchievementsState = {
  queue: Achievement[];
  displayedAchievement: Achievement | undefined;
};

type GetAchievementsResponse = {
  achievements: Achievement[];
};

const Achievements = () => {
  const [newAchievementInput, setnewAchievementInput] = useState("");

  const [achievementsState, setAchievementsState] = useState<AchievementsState>(
    {
      queue: [],
      displayedAchievement: undefined,
    }
  );

  const resetQueue = (achievements: Achievement[]): AchievementsState => ({
    displayedAchievement: achievements[achievements.length - 1],
    queue: achievements.slice(0, -1),
  });

  const advanceQueue = (previousQueue: Achievement[]): AchievementsState => ({
    displayedAchievement: previousQueue[previousQueue.length - 1],
    queue: previousQueue.slice(0, -1),
  });

  const {
    data,
    mutate,
    error,
  }: responseInterface<GetAchievementsResponse, any> = useSWR(
    "/api/users/1/achievements",
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        setAchievementsState(resetQueue(data.achievements));
      },
    }
  );

  const handleNewAchievementInput = (e: ChangeEvent) => {
    const target = e.target as HTMLTextAreaElement;
    setnewAchievementInput(target.value);
  };

  const handleAddAchievement = async (e: FormEvent) => {
    e.preventDefault();
    if (!newAchievementInput) return;

    const newAchievement = await apiPost("api/users/1/achievements", {
      text: newAchievementInput,
    });
    mutate({ achievements: [...data.achievements, newAchievement] }, false);

    setAchievementsState((prev) => ({
      ...prev,
      displayedAchievement: prev.displayedAchievement
        ? prev.displayedAchievement
        : newAchievement,
    }));
    setnewAchievementInput("");
  };

  const handleDeleteAchievement = async (id: string) => {
    await apiDelete(`api/users/1/achievements/${id}`);
    mutate(
      {
        achievements: data.achievements.filter(
          (achievement) => achievement.id !== id
        ),
      },
      false
    );

    setAchievementsState((prev) => advanceQueue(prev.queue));
  };

  const handleShowNext = () => {
    setAchievementsState((prev) =>
      prev.queue.length === 0
        ? resetQueue(data.achievements)
        : advanceQueue(prev.queue)
    );
  };

  const { displayedAchievement } = achievementsState;

  return (
    <Container>
      <Heading variant="h2">Here's one of your achievements:</Heading>
      {data ? (
        displayedAchievement ? (
          <Body
            variant="body1"
            onClick={() =>
              handleDeleteAchievement(achievementsState.displayedAchievement.id)
            }
          >
            {achievementsState.displayedAchievement.text}
          </Body>
        ) : (
          <Body>Add your first achievement below!</Body>
        )
      ) : (
        <Body>...loading</Body>
      )}
      <Button
        variant="contained"
        onClick={handleShowNext}
        disabled={!displayedAchievement}
      >
        Show me another one
      </Button>
      <form onSubmit={handleAddAchievement}>
        <TextField
          label="New Achievement"
          value={newAchievementInput}
          onChange={handleNewAchievementInput}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit" disabled={!data}>
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </form>
    </Container>
  );
};

export default Achievements;
