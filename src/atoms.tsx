import { atom } from "recoil";

/**
  Store a id,number
 */
export interface IToDo {
  id: number;
  text: string;
}

export interface IToDoStateProps {
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
