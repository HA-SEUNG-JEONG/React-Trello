import { atom } from "recoil";

interface IToDoStateProps {
  [key: string]: string[];
}

export const toDoState = atom<IToDoStateProps>({
  key: "toDo",
  default: {
    "To Do": ["a", "b"],
    DOING: ["c", "d", "e"],
    DONE: ["f"],
  },
});
