import React, { ChangeEvent, useState, FormEvent } from 'react';
import {
  Button as MaterialButton,
  IconButton,
  Typography,
  TextField,
  Container as MaterialContainer,
  InputAdornment,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { styled } from '@material-ui/core/styles';
import useSWR from 'swr';
import { apiPost, apiDelete } from '../fetchHelpers';
import theme from './theme';

const Container = styled(MaterialContainer)({
  marginTop: theme.spacing(2),
  textAlign: 'center',
  maxWidth: '900px',
});

const Heading = styled(Typography)({
  marginBottom: theme.spacing(4),
});

const Body = styled(Typography)({
  marginBottom: theme.spacing(1),
});

const Button = styled(MaterialButton)({
  display: 'block',
  margin: theme.spacing(0, 'auto', 4, 'auto'),
});

const AddIconButton = () => (
  <IconButton type="submit">
    <AddIcon />
  </IconButton>
);

const Achievements = () => {
  const [achievementsState, setAchievementsState] = useState({
    queue: [],
    displayedAchievement: undefined,
  });

  const [newAchievementInput, setnewAchievementInput] = useState('');

  const { data, mutate, error } = useSWR('/api/users/1/achievements', {
    revalidateOnFocus: false,
    onSuccess: (data) => {
      console.log('TEST');
      setAchievementsState({
        displayedAchievement: data.achievements[data.achievements.length - 1],
        queue: data.achievements.slice(0, -1),
      });
    },
  });

  const handleNewAchievementInput = (e: ChangeEvent) => {
    const target = e.target as HTMLTextAreaElement;
    setnewAchievementInput(target.value);
  };

  const handleAddAchievement = async (e: FormEvent) => {
    e.preventDefault();

    const newAchievement = await apiPost('api/users/1/achievements', {
      text: newAchievementInput,
    });
    mutate({ achievements: [...data.achievements, newAchievement] }, false);

    setAchievementsState((prev) => ({
      ...prev,
      queue: [newAchievement, ...prev.queue],
    }));
    setnewAchievementInput('');
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

    setAchievementsState((prev) => ({
      displayedAchievement: prev.queue[prev.queue.length - 1],
      queue: prev.queue.slice(0, -1),
    }));
  };

  const handleShowNext = () => {
    setAchievementsState((prev) => ({
      displayedAchievement: prev.queue[prev.queue.length - 1],
      queue:
        prev.queue.length === 1 ? data.achievements : prev.queue.slice(0, -1),
    }));
  };

  console.log(achievementsState);

  return (
    <Container>
      <Heading variant="h2">Here's one of your achievements:</Heading>
      {data ? (
        <Body
          variant="body1"
          onClick={() =>
            handleDeleteAchievement(achievementsState.displayedAchievement.id)
          }
        >
          {achievementsState.displayedAchievement.text}
        </Body>
      ) : (
        <div>...loading</div>
      )}
      <Button variant="contained" onClick={handleShowNext}>
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
                <AddIconButton />
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
