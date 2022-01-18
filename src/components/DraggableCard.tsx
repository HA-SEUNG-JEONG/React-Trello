import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import React from "react";
import { useSetRecoilState } from "recoil";
import { toDoState } from "../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const Check = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  font-size: 18px;
  span {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
  }
`;

const Card = styled.div<{ isDragging: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-bottom: 15px;
  padding: 10px 10px;
  background-color: ${(props) =>
    props.isDragging ? "#0984e3" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "2px 5px 5px rgba(0,0,0,0.3)" : "2px 5px 5px gray"};
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
      console.log(copiedBoard["DOING"]);
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
          <Check>
            <input type="checkbox" />
            <span>{toDoText}</span>
            <button
              onClick={() =>
                onDeleteClick(magic.draggableProps["data-rbd-draggable-id"])
              }
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </Check>
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
