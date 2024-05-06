import React from "react";
import Grid from "./grid";
import * as utils from "./utils";
import FinishModal from "./finishmodal";
import WordBank from "./wordbank";
import "./wordsearchplay.css";

class WordSearchGame extends React.Component {

    constructor(props) {
        super(props);
        const params = window.location.href.split("/play/");
        const gameState = JSON.parse(atob(params[1]));
        this.state = {
            tempGrid: gameState.grid,
            buttonRefs: [],
            startCoordX: null,
            endCoordX: null,
            startCoordY: null,
            endCoordY: null,
            isDragging: false,
            wordList: gameState.wordList,
            gridSize: gameState.gridSize,
            foundWords: [],
            showConfetti: false,
        }
        console.log(gameState.grid);
        this.setButtonRefs = this.setButtonRefs.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    handleButtonMouseDown = (e) => {
        // Start tracking the selected word when mouse button is pressed
        //let b = e.target.closest("button");
        console.log("Mouse Down")
        this.setState({ isDragging: true });
        this.setState({ startCoordX: e.target.parentNode.getAttribute("row") });
        this.setState({ startCoordY: e.target.parentNode.getAttribute("col") });
        e.target.classList.add("selected");
    };

    handleButtonMouseEnter = (e) => {
        // Update the selected word as the mouse enters other buttons
        console.log("Mouse Down");

        if (this.state.isDragging) {
            const elements = document.querySelectorAll("*");
            elements.forEach((element) => {
                element.classList.remove("secondary");
            });
            this.setState({ endCoordX: e.target.parentNode.getAttribute("row") });
            this.setState({ endCoordY: e.target.parentNode.getAttribute("col") });
            //let b = e.target.closest("button");
            if (!e.target.classList.contains("selected")) {
                e.target.classList.add("secondary");
            }
            if (
                utils.checkLineType(
                    this.state.startCoordX,
                    this.state.startCoordY,
                    e.target.parentNode.getAttribute("row"),
                    e.target.parentNode.getAttribute("col")
                )
            ) {
                let points = utils.bresenham(
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

    handleButtonMouseUp = () => {
        // Finish tracking the selected word when mouse button is released
        console.log("Mouse Up");
        if (this.state.isDragging) {
            this.setState({ isDragging: false });
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
                    let straight = utils.checkLineType(
                        this.state.startCoordX,
                        this.state.startCoordY,
                        this.state.endCoordX,
                        this.state.endCoordY
                    );
                    if (straight) {
                        let currentWord = utils.bresenham(
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

    setButtonRefs(buttonRefs) {
        this.setState({ buttonRefs: buttonRefs })
    }

    closeModal() {
        this.setState({ showConfetti: false });
    }

    render() {
        return (
            <>
                <FinishModal show={this.state.showConfetti} onClose={this.closeModal}></FinishModal>
                <div className="center">
                    <div className="center" style={{ width: "60%" }}>
                        <Grid
                            tempGrid={this.state.tempGrid}
                            handleButtonMouseDown={this.handleButtonMouseDown}
                            handleButtonMouseUp={this.handleButtonMouseUp}
                            handleButtonMouseEnter={this.handleButtonMouseEnter}
                            buttonRefs={this.state.buttonRefs}
                            setButtonRefs={this.setButtonRefs}
                            gridSize={this.state.gridSize}
                        ></Grid></div>
                    <div className="center" ><WordBank canEdit={false} crossWordsOff={true} gridSize={this.state.gridSize} wordList={this.state.wordList} foundWords={this.state.foundWords}></WordBank></div>
                </div>
            </>
        );
    }

}

export default WordSearchGame;