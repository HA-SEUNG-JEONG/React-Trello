import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState, IToDoStateProps } from "./atoms";
import Board from "./Components/Board";

const Wrapper = styled.div`
  display: flex;
  max-width: 950px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source, type, draggableId } = info;
    if (!destination) return;
    //Board Order Change
    if (type === "board") {
      if (destination.index === source.index) return;
      setToDos((allBoards) => {
        // console.log(allBoards); //{DOING: Array(0), To Do: Array(0), DONE: Array(0)} : 리스트에 아무것도 입력하지 않은 상태

        const boardId = Object.keys(allBoards);

        boardId.splice(source.index, 1);
        boardId.splice(destination.index, 0, draggableId);
        // console.log(boardId); //옮기고 난 후의 Board 위치

        //새로 생길 Board를 만들어야 한다.
        const newBoard: IToDoStateProps = {}; //newBoard를 IToDoStateProps의 빈 객체를 기본값으로 설정
        boardId.forEach((key) => {
          newBoard[key] = allBoards[key]; //모든 Board들을 가져와서 새로 만들어질 newBoard에 복사
        });
        return newBoard;
      });
      return;
    }
    if (destination?.droppableId === source.droppableId) {
      //same board movement.
      setToDos((prevBoards) => {
        const copiedBoard = [...prevBoards[source.droppableId]];
        const taskObj = copiedBoard[source.index]; //옮기려고 하는 to do object 전체를 가져다줌
        copiedBoard.splice(source.index, 1);
        copiedBoard.splice(destination.index, 0, taskObj);
        return {
          ...prevBoards,
          [source.droppableId]: copiedBoard,
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      //cross board movement.
      setToDos((prevBoards) => {
        const sourceBoard = [...prevBoards[source.droppableId]]; //움직임이 시작된 board의 복사본
        const destinationBoard = [...prevBoards[destination.droppableId]]; //움직임이 끝난 board의 복사본
        const taskObj = sourceBoard[source.index];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...prevBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="boardList" type="board" direction="horizontal">
        {(magic) => (
          <Wrapper>
            <Boards ref={magic.innerRef}>
              {Object.keys(toDos).map((boardId, index) => (
                <Board
                  boardId={boardId}
                  key={boardId}
                  toDos={toDos[boardId]}
                  index={index}
                />
              ))}
            </Boards>
          </Wrapper>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
