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
import { apiPost, apiDelete } from "../frontendUtils/fetchHelpers";
import theme from "../frontendUtils/theme";
import { Memory } from "../types";
import useSession from "../frontendUtils/hooks/useSession";

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

type MemoriesState = {
  queue: Memory[];
  displayedMemory: Memory | undefined;
};

type GetMemoriesResponse = {
  memories: Memory[];
};

const Memories = () => {
  const [newMemoryInput, setNewMemoryInput] = useState("");

  const [memoriesState, setMemoriesState] = useState<MemoriesState>({
    queue: [],
    displayedMemory: undefined,
  });

  const resetQueue = (memories: Memory[]): MemoriesState => ({
    displayedMemory: memories[memories.length - 1],
    queue: memories.slice(0, -1),
  });

  const advanceQueue = (previousQueue: Memory[]): MemoriesState => ({
    displayedMemory: previousQueue[previousQueue.length - 1],
    queue: previousQueue.slice(0, -1),
  });

  const {
    data,
    mutate,
    error,
  }: responseInterface<GetMemoriesResponse, any> = useSWR("/api/memories", {
    revalidateOnFocus: false,
    onSuccess: (data) => {
      setMemoriesState(resetQueue(data.memories));
    },
  });

  const handleNewMemoryInput = (e: ChangeEvent) => {
    const target = e.target as HTMLTextAreaElement;
    setNewMemoryInput(target.value);
  };

  const handleAddMemory = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMemoryInput) return;

    const newMemory = await apiPost("api/memories", {
      text: newMemoryInput,
    });
    mutate({ memories: [...data.memories, newMemory] }, false);

    setMemoriesState((prev) => ({
      ...prev,
      displayedMemory: prev.displayedMemory ? prev.displayedMemory : newMemory,
    }));
    setNewMemoryInput("");
  };

  const handleDeleteMemory = async (id: string) => {
    await apiDelete(`api/memories/${id}`);
    mutate(
      {
        memories: data.memories.filter((memory) => memory.id !== id),
      },
      false
    );

    setMemoriesState((prev) => advanceQueue(prev.queue));
  };

  const handleShowNext = () => {
    setMemoriesState((prev) =>
      prev.queue.length === 0
        ? resetQueue(data.memories)
        : advanceQueue(prev.queue)
    );
  };

  const { displayedMemory } = memoriesState;

  const [session, sessionLoading] = useSession();
  if (sessionLoading) return null;

  return (
    <Container>
      <Heading variant="h2">Here's one of your memories:</Heading>
      {data ? (
        displayedMemory ? (
          <Body
            variant="body1"
            onClick={() => handleDeleteMemory(memoriesState.displayedMemory.id)}
          >
            {memoriesState.displayedMemory.text}
          </Body>
        ) : (
          <Body>Add your first memory below!</Body>
        )
      ) : (
        <Body>...loading</Body>
      )}
      <Button
        variant="contained"
        onClick={handleShowNext}
        disabled={!displayedMemory}
      >
        Show me another one
      </Button>
      <form onSubmit={handleAddMemory}>
        <TextField
          label="New Memory"
          value={newMemoryInput}
          onChange={handleNewMemoryInput}
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

export default Memories;
