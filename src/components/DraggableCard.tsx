import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import React from "react";
import { useSetRecoilState } from "recoil";
import { toDoState } from "../atoms";

const Card = styled.div<{ isDragging: boolean }>`
  border-radius: 5px;
  margin-bottom: 15px;
  padding: 10px 10px;
  background-color: ${(props) =>
    props.isDragging ? "#0984e3" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "2px 10px 25px rgba(0,0,0,0.3)" : "none"};
`;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

function DraggableCard({ toDoId, toDoText, index }: IDraggableCardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const onDeleteClick = (id: string) => {
    setToDos((toDoCards) => {
      const copiedBoard = { ...toDoCards };
      const keys = Object.keys(copiedBoard);
      keys.forEach((key) => {
        copiedBoard[key] = toDoCards[key].filter(
          (toDoCard) => toDoCard.id !== Number(id)
        );
      });
      return copiedBoard;
    });
  };
  return (
    <Draggable key={toDoId} draggableId={toDoId + ""} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}
        >
          {toDoText}
          <button
            onClick={() =>
              onDeleteClick(magic.draggableProps["data-rbd-draggable-id"])
            }
          >
            ❌
          </button>
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
