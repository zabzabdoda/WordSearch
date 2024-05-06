import React from "react";
import "./board.css";
import "./shared.css";
import { Alert } from "react-bootstrap";
import FinishModal from "./finishmodal";
import WordBank from "./wordbank";

class WordSearchGame extends React.Component {
  constructor(props) {
    super(props);
    console.log(window.location.href);
    const params = window.location.href.split("/play/");
    console.log(params);
    const gameState = JSON.parse(atob(params[1]));
    console.log(gameState);
    this.state = {
      selectedWord: "",
      startCoordX: null,
      endCoordX: null,
      startCoordY: null,
      endCoordY: null,
      isDragging: false,
      showAlert: false,
      gridSize: gameState.gridSize,
      foundWords: [],
      wordList: gameState.wordList,
      tempGrid: gameState.grid,
      buttonRefs: [],
      grid: [],
      showConfetti: false,
    };
    //this.wordList = this.props.wordList.map((str) => str.toUpperCase());
    //let l = this.getLongestWord(this.props.wordList) + 10;
    this.closeModal = this.closeModal.bind(this);
    this.updateGrid = this.updateGrid.bind(this);
    this.updateGrid();
  }

  updateGrid() {
    this.setState({
      buttonRefs: Array.from({ length: this.state.gridSize }, (t, x) =>
        Array.from({ length: this.state.gridSize }, (t, y) => React.createRef())
      )
    }, this.setState({
      grid: Array.from({ length: this.state.gridSize }, (t, x) =>
        Array.from({ length: this.state.gridSize }, (t, y) => (
          <button className="letter-button" row={x} col={y}>
            <div
              ref={this.state.buttonRefs[x][y]}
              className="circle"
              onMouseDown={this.handleButtonMouseDown}
              onMouseEnter={this.handleButtonMouseEnter}
              onMouseUp={this.handleButtonMouseUp}
              onMouseLeave={this.handleButtonMouseLeave}
              x={x}
              y={y}
            >
              {this.state.tempGrid[x][y]}
            </div>
          </button>
        ))
      )
    }));

  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  populateBoard(wordList, gridSize) {
    let cantPlace = false;
    wordList
      .sort((a, b) => b.length - a.length)
      .forEach((e) => {
        console.log(e);
        let times = 0;
        while (true) {
          times++;
          if (times >= 50) {
            cantPlace = true;
            break;
          }
          let x = this.getRandomInt(0, gridSize - 1); //change later to gridsize
          let y = this.getRandomInt(0, gridSize - 1);
          let dir = this.getRandomInt(1, 3);
          let invertNum = Math.random() < 0.5 ? 1 : -1;
          if (this.checkIfWordFits(e, x, y, dir, invertNum)) {
            this.placeWord(e, x, y, dir, invertNum);
            break;
          }
        }
      });

    if (cantPlace) {
      this.setState({ showAlert: true });
    }
  }

  fillWithRandomLetters() {
    let temp = [...this.state.buttonRefs];
    for (let i = 0; i < this.state.grid.length; i++) {
      for (let j = 0; j < this.state.grid.length; j++) {
        if (this.state.buttonRefs[i][j].current.innerHTML === " ") {
          temp[i][j].current.innerHTML = this.getRandomLetter();
        }
      }
    }
    this.setState({ buttonRefs: temp });

  }

  placeWord(word, x, y, dir, invertNum) {
    if (dir === 1) {
      let temp = [...this.state.buttonRefs];
      //horizontal
      for (let i = 0; i < word.length; i++) {
        temp[x + i * invertNum][y].current.textContent = word[i];
      }
      this.setState({ buttonRefs: temp });
    } else if (dir === 2) {
      let temp = [...this.state.buttonRefs];
      //vertical
      for (let i = 0; i < word.length; i++) {
        temp[x][y + i * invertNum].current.textContent = word[i];
      }
      this.setState({ buttonRefs: temp });
    } else if (dir === 3) {
      let temp = [...this.state.buttonRefs];
      //diagonal
      for (let i = 0; i < word.length; i++) {
        temp[x + i * invertNum][
          y + i * invertNum
        ].current.textContent = word[i];
      }
      this.setState({ buttonRefs: temp });
    }
  }

  // (1,1) horiz 1 "test"
  checkIfWordFits(word, row, col, dir, invertNum) {
    if (dir === 1) {
      //horizontal
      for (let i = 0; i < word.length; i++) {
        if (
          row + i * invertNum > this.state.grid.length - 1 ||
          row + i * invertNum < 0
        ) {
          return false;
        }

        if (
          this.state.buttonRefs[row + i * invertNum][col].current.textContent !== " "
        ) {
          return false;
        }
      }
      return true;
    } else if (dir === 2) {
      //vertical
      for (let i = 0; i < word.length; i++) {
        if (
          col + i * invertNum > this.state.grid.length - 1 ||
          col + i * invertNum < 0
        ) {
          return false;
        }
        if (
          this.state.buttonRefs[row][col + i * invertNum].current.textContent !== " "
        ) {
          return false;
        }
      }
      return true;
    } else if (dir === 3) {
      //diagonal
      for (let i = 0; i < word.length; i++) {
        if (
          row + i * invertNum > this.state.grid.length - 1 ||
          col + i * invertNum > this.state.grid.length - 1 ||
          row + i * invertNum < 0 ||
          col + i * invertNum < 0
        ) {
          return false;
        }
        if (
          this.state.buttonRefs[row + i * invertNum][col + i * invertNum].current
            .textContent !== " "
        ) {
          return false;
        }
      }
      return true;
    }
  }

  checkLineType(x1, y1, x2, y2) {
    // Calculate the differences in x and y coordinates
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);

    // Check if the line is vertical, horizontal, or diagonal
    if (dx === 0) {
      // Vertical line
      return true;
    } else if (dy === 0) {
      // Horizontal line
      return true;
    } else if (dx === dy) {
      // Diagonal line
      return true;
    } else {
      // Neither vertical, horizontal, nor diagonal
      return false;
    }
  }

  //to be removed later
  getRandomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
  }

  bresenham(x1, x2, y1, y2) {
    const points = [];

    x1 = parseInt(x1);
    x2 = parseInt(x2);
    y1 = parseInt(y1);
    y2 = parseInt(y2);
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    //points.push(this.grid[x1][y1]);

    while (true) {
      // Plot the point (x, y)
      //points.push(this.grid[x1][y1]);
      points.push({ x1, y1 });

      if (x1 === x2 && y1 === y2) break;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
    }
    return points;
  }

  getLongestWord(words) {
    if (words.length === 0) {
      return null; // Return null for an empty array
    }

    let longestLength = 0;

    for (const str of words) {
      if (str.length > longestLength) {
        longestLength = str.length;
      }
    }

    return longestLength;
  }

  handleButtonMouseDown = (e) => {
    // Start tracking the selected word when mouse button is pressed
    //let b = e.target.closest("button");
    this.isDragging = true;
    this.setState({ startCoordX: e.target.parentNode.getAttribute("row") });
    this.setState({ startCoordY: e.target.parentNode.getAttribute("col") });
    e.target.classList.add("selected");
  };

  handleButtonMouseEnter = (e) => {
    // Update the selected word as the mouse enters other buttons
    const elements = document.querySelectorAll("*");
    elements.forEach((element) => {
      element.classList.remove("secondary");
    });
    if (this.isDragging) {
      this.setState({ endCoordX: e.target.parentNode.getAttribute("row") });
      this.setState({ endCoordY: e.target.parentNode.getAttribute("col") });
      //let b = e.target.closest("button");
      if (!e.target.classList.contains("selected")) {
        e.target.classList.add("secondary");
      }
      if (
        this.checkLineType(
          this.state.startCoordX,
          this.state.startCoordY,
          e.target.parentNode.getAttribute("row"),
          e.target.parentNode.getAttribute("col")
        )
      ) {
        let points = this.bresenham(
          this.state.startCoordX,
          e.target.parentNode.getAttribute("row"),
          this.state.startCoordY,
          e.target.parentNode.getAttribute("col")
        );
        points.slice(1).forEach((e) => {
          this.state.buttonRefs[e.x1][e.y1].current.classList.add("secondary");
        });
      }
    }
  };

  handleButtonMouseLeave = (e) => {
    //let b = e.target.closest("button");
    //e.target.classList.remove("secondary");
  };

  handleButtonMouseUp = () => {
    // Finish tracking the selected word when mouse button is released
    if (this.isDragging) {
      this.isDragging = false;
      if (
        this.state.startCoordX !== this.state.endCoordX ||
        this.state.endCoordY !== this.state.startCoordY
      ) {
        if (
          this.state.startCoordX !== null &&
          this.state.endCoordX !== null &&
          this.state.endCoordY !== null &&
          this.state.startCoordY !== null
        ) {
          let straight = this.checkLineType(
            this.state.startCoordX,
            this.state.startCoordY,
            this.state.endCoordX,
            this.state.endCoordY
          );
          if (straight) {
            let currentWord = this.bresenham(
              this.state.startCoordX,
              this.state.endCoordX,
              this.state.startCoordY,
              this.state.endCoordY
            );
            let word = "";
            currentWord.forEach((e) => {
              word += this.state.buttonRefs[e["x1"]][e["y1"]].current.textContent;
            });
            console.log("Selected word:", word);
            this.setState({ selectedWord: word });
            if (
              this.state.wordList.includes(word) &&
              !this.state.foundWords.includes(word)
            ) {
              if (this.state.foundWords.length + 1 === this.state.wordList.length) {
                this.setState({ showConfetti: true })
              }
              this.setState({ foundWords: [...this.state.foundWords, word] });
              currentWord.forEach((e) => {
                this.state.buttonRefs[e.x1][e.y1].current.classList.add("completed");
              });
            }
          }
        }
      }
      this.setState({ startCoordX: null });
      this.setState({ startCoordY: null });
      this.setState({ endCoordX: null });
      this.setState({ endCoordY: null });
      const elements = document.querySelectorAll("*");
      elements.forEach((element) => {
        element.classList.remove("selected");
        element.classList.remove("secondary");
      });
    }
  };

  clearBoard(gridSize) {
    let temp = [...this.set.buttonRefs];
    for (let i = 0; i < this.state.grid.length; i++) {
      for (let j = 0; j < this.state.grid.length; j++) {
        temp[i][j].current.innerHTML = " ";
      }
    }
    this.setState({ buttonRefs: temp });
  }

  deleteWord = (wordToDelete) => {
    this.setState((prevState) => {
      const updatedWordList = [...prevState.wordList];
      const indexToRemove = updatedWordList.indexOf(wordToDelete);
      if (indexToRemove !== -1) {
        updatedWordList.splice(indexToRemove, 1);
      }
      return { wordList: updatedWordList };
    });
  };

  closeModal() {
    this.setState({ showConfetti: false });
  }

  //get start and end coordinate, see if it makes a straight line.
  render() {
    return (
      <>

        <FinishModal show={this.state.showConfetti} onClose={this.closeModal} />
        <div className="center">
          <Alert
            className="alert"
            show={this.state.showAlert}
            onClose={() => {
              this.setState({ showAlert: false });
            }}
            variant="danger"
            dismissible
          >
            <Alert.Heading>Board not big enough!</Alert.Heading>
            <p>Try increasing the size or use less words</p>
          </Alert>
        </div>

        <div onMouseUp={this.handleButtonMouseUp}>
          <div className="center" style={{ paddingTop: "20px" }}>
            <div style={{ width: "60%" }} className="center">
              <div className="button-container">
                {this.state.grid.map((row, rowIndex) => (
                  <div className="row-div" key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <>{cell}</>
                    ))}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
        <WordBank canEdit={false} crossWordsOff={true} gridSize={this.state.gridSize} wordList={this.state.wordList} updateWordList={this.updateWordList}></WordBank>
      </>
    );
  }
}

export default WordSearchGame;
