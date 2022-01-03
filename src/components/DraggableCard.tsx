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
  const onDelete = (event: React.FormEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { parentElement },
    } = event;

    setToDos((toDoCards) => {
      const newToDoCard = toDoCards.filter(
        (toDoCard) => toDoCard.id !== Number(parentElement?.id)
      );
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
          <button onClick={onDelete}>❌</button>
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
