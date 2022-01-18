import { Droppable, Draggable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { IToDo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import React from "react";

const Wrapper = styled.div<{ isDragging: Boolean }>`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  border: 1px solid #aeaca6;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  input {
    width: 100%;
    font-size: 16px;
    border: 0;
    background-color: white;
    width: 80%;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    margin: 0 auto;
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  width: 25px;
  height: 25px;
  border-radius: 10px;
  position: absolute;
  top: 0px;
  right: 3px;
  border: 0;
  outline: none;
  &:hover {
    opacity: 0.6;
  }
`;

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

/**
  Store a toDos,boardId,index
 */
interface IBoardProps {
  toDos: IToDo[];
  boardId: string;
  index: number;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId, index }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);

  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    // console.log(newToDo.text);
    // console.log(newToDo); //{id:"xxxxx",text:"입력한 내용"}
    setValue("toDo", "");
  };

  const removeBoard = (id: string) => {
    setToDos((allBoards) => {
      const copiedBoard = { ...allBoards };
      delete copiedBoard[id];
      return copiedBoard;
    });
  };

  return (
    <Draggable key={boardId} draggableId={boardId} index={index}>
      {(magic, snapshot) => (
        <Wrapper
          {...magic.dragHandleProps}
          ref={magic.innerRef}
          {...magic.draggableProps}
          isDragging={snapshot.isDragging}
        >
          <Title>{boardId}</Title>

          <Form onSubmit={handleSubmit(onValid)}>
            <input
              {...register("toDo", { required: true })}
              type="text"
              placeholder={`Add Task on ${boardId}`}
            />
          </Form>
          <Button
            onClick={() =>
              removeBoard(magic.draggableProps["data-rbd-draggable-id"])
            }
          >
            ❌
          </Button>
          <Droppable droppableId={boardId}>
            {(magic, snapshot) => (
              <Area
                isDraggingOver={snapshot.isDraggingOver}
                isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
                ref={magic.innerRef}
                {...magic.droppableProps}
              >
                {toDos.map((toDo, index) => (
                  <DraggableCard
                    key={toDo.id}
                    index={index}
                    toDoId={toDo.id}
                    toDoText={toDo.text}
                  />
                ))}
                {magic.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}
export default React.memo(Board);
