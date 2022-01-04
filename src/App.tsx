import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState, IToDoStateProps } from "./atoms";
import Board from "./Components/Board";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faStar } from "@fortawesome/free-solid-svg-icons";

const Line = styled.div`
  width: 85%;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
`;

const HeaderClock = styled.button`
  display: flex;
  justify-content: space-around;
  gap: 20px;
  margin: 30px 20px;
  border: none;
  background-color: transparent;
  &:hover {
    background-color: #8d8686;
    border-radius: 5px;
  }
`;

const HeaderStar = styled.button`
  display: flex;
  justify-content: space-around;
  gap: 20px;
  margin: 30px 20px;
  border: none;
  background-color: transparent;
  &:hover {
    background-color: #8d8686;
    border-radius: 5px;
  }
`;

const Main = styled.title`
  margin-top: 20px;
  display: flex;
  margin-left: 100px;
  align-items: center;
  font-size: 60px;
  font-weight: 600;
`;

const Wrapper = styled.div`
  display: flex;
  max-width: 950px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;

const AddBoard = styled.form`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 200px;
  input {
    background-color: rgb(29, 161, 242);
    border: none;
    border-radius: 3px;
    padding: 30px;

    ::placeholder {
      color: white;
      text-align: center;
      font-size: 25px;
    }
  }
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  // console.log(toDos); //{To Do: Array(0), DOING: Array(0), DONE: Array(0)} : 아무것도 없을 때 상태
  const addBoard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.boardName;
    // console.log(input);
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [input.value]: [],
      };
    });
    input.value = "";
    input.blur();
  };
  const onDragEnd = (info: DropResult) => {
    const { destination, source, type, draggableId } = info;
    if (!destination) return;
    if (type === "board") {
      if (destination.index === source.index) return;
      setToDos((allBoards) => {
        const board = Object.keys(allBoards);
        board.splice(source.index, 1);
        board.splice(destination?.index, 0, draggableId);

        const newBoard: IToDoStateProps = {};
        board.forEach((key) => {
          newBoard[key] = allBoards[key];
        });
        return newBoard;
      });
      return;
    }
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      //same board movement.
      setToDos((prevBoards) => {
        const copiedBoard = [...prevBoards[source.droppableId]];
        const taskObj = copiedBoard[source.index]; //옮기려고 하는 to do object 전체를 가져다줌
        copiedBoard.splice(source.index, 1);
        copiedBoard.splice(destination?.index, 0, taskObj);
        // console.log("copiedBoard", copiedBoard); //최종적으로 옮겨진 Board
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
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...prevBoards[destination.droppableId]]; //움직임이 끝난 board의 복사본
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
  useEffect(() => {
    const localStorageToDoCards = localStorage.getItem("myList");
    if (localStorageToDoCards === "{}" || localStorageToDoCards === null)
      return;
    setToDos(JSON.parse(localStorageToDoCards));
    console.log(typeof localStorageToDoCards, localStorageToDoCards);
  }, []);
  useEffect(() => {
    localStorage.setItem("myList", JSON.stringify(toDos));
  }, [toDos]);
  console.log(typeof localStorage, localStorage);

  return (
    <>
      <Header>
        <HeaderStar>
          <FontAwesomeIcon icon={faStar} style={{ fontSize: "30px" }} />
        </HeaderStar>
        <HeaderClock>
          <FontAwesomeIcon icon={faClock} style={{ fontSize: "30px" }} />
        </HeaderClock>
      </Header>
      <Main>✔ To Do list</Main>
      <AddBoard onSubmit={addBoard}>
        <input id="boardName" placeholder="New Board" autoComplete="off" />
      </AddBoard>
      <Line>
        <hr />
      </Line>
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
    </>
  );
}

export default App;
