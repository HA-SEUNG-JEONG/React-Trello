import { atom } from "recoil";

export interface IToDo {
  id: number;
  text: string;
}

interface IToDoStateProps {
  [key: string]: IToDo[];
}

export const toDoState = atom<IToDoStateProps>({
  key: "toDo",
  default: {
    "To Do": [],
    DOING: [],
    DONE: [],
  },
});
