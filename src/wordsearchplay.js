import React from "react";
import Grid from "./grid";
import * as utils from "./utils";
import FinishModal from "./finishmodal";
import WordBank from "./wordbank";
import styled from "styled-components";

const StyledBoardWrapper = styled.div`
    justify-content: center;
    display: flex;
    align-items: center;
    @media screen and (max-width: 570px) {
        flex-direction: column;
    }
`;

const StyledGridWrapper = styled(StyledBoardWrapper)`
    width: 60%;
`;

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
            foundWords: gameState.wordList.reduce((acc, word) => {
                acc[word] = false;
                return acc;
            }, {}),
            showConfetti: false,
        }
        console.log(this.state.foundWords);
        this.setButtonRefs = this.setButtonRefs.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }


    handleButtonMouseDown = (e) => {
        this.setState({ isDragging: true });
        this.setState({ startCoordX: e.target.parentNode.getAttribute("row") });
        this.setState({ startCoordY: e.target.parentNode.getAttribute("col") });
        e.target.classList.add("selected");
        document.addEventListener("mouseup", this.handleButtonMouseUp)
    };

    handleButtonMouseEnter = (e) => {
        if (this.state.isDragging) {
            const elements = document.querySelectorAll("*");
            elements.forEach((element) => {
                element.classList.remove("secondary");
            });
            this.setState({ endCoordX: e.target.parentNode.getAttribute("row") });
            this.setState({ endCoordY: e.target.parentNode.getAttribute("col") });
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
                        this.setState({ selectedWord: word }, () => {
                            if (
                                this.state.wordList.includes(word) &&
                                !this.state.foundWords[word]
                            ) {
                                this.setState(prevState => ({
                                    foundWords: {
                                        ...prevState.foundWords,
                                        [word]: true,
                                    }
                                }), () => {
                                    let test = Object.values(this.state.foundWords).every(value => value === true);
                                    if (test) {
                                        this.setState({ showConfetti: true })
                                    }
                                });
                                //this.setState({ foundWords: {...this.state.foundWords, word} });
                                currentWord.forEach((e) => {
                                    this.state.buttonRefs[e.x1][e.y1].current.classList.add("completed");
                                });
                            }
                        });

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
                <div ref={this.windowRef}>
                    <FinishModal show={this.state.showConfetti} onClose={this.closeModal}></FinishModal>
                    <StyledBoardWrapper>
                        <StyledGridWrapper>
                            <Grid
                                tempGrid={this.state.tempGrid}
                                handleButtonMouseDown={this.handleButtonMouseDown}
                                handleButtonMouseUp={this.handleButtonMouseUp}
                                handleButtonMouseEnter={this.handleButtonMouseEnter}
                                buttonRefs={this.state.buttonRefs}
                                setButtonRefs={this.setButtonRefs}
                                gridSize={this.state.gridSize}
                            />
                        </StyledGridWrapper>
                        <StyledBoardWrapper >
                            <WordBank colCount={2} canEdit={false} crossWordsOff={true} gridSize={this.state.gridSize} wordList={this.state.wordList} foundWords={this.state.foundWords} />
                        </StyledBoardWrapper>
                    </StyledBoardWrapper>
                </div>
            </>
        );
    }

}

export default WordSearchGame;
