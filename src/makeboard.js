import { Form, InputGroup, Button } from "react-bootstrap";
import React from "react";
import WordBank from "./wordbank";
import RangeSlider from "react-bootstrap-range-slider";
import * as utils from "./utils";
import 'bootstrap/dist/css/bootstrap.css';
import styled from "styled-components";


const StyledWrapper = styled.div`
    justify-content: center;
    border: 2px gray solid;
    padding: 30px;
    border-radius: 20px;
    margin: 30px;
    width: 75%;
    align-items: center;
    display: flex;
    flex-direction: column;
    max-width: 500px;
    min-width: 330px;
`;

const StyledTextBoxWrapper = styled.div`
    display: flex;
    width: 100%;
`;

const StyledTextBox = styled(InputGroup)`
    display: flex;
    width: 100%;
    padding: 1rem;
`;

const StyledSliderWrapper = styled.div`
    justify-content: center;
    display: flex;
    align-items: center;
    margin: 0.5rem;
    padding: 0.5rem;
`;

const StyledTitle = styled.h1`
    text-align: center;
`;

const StyledButton = styled(Button)`
    width: 100%;
`;

const StyledSliderLabel = styled.div`
    margin: 10px;
`;

const StyledSlider = styled(RangeSlider)`
    height: 100%;
`;

const StyledSliderWrapperInner = styled.div`
    display: flex;
`;

class AddWordForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addWord: "",
            url: "",
            letterGrid: [],
            wordList: [],
            gridSize: 10,
        }
        this.handleAddWord = this.handleAddWord.bind(this);
        this.updateWordList = this.updateWordList.bind(this);
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        this.generate = this.generate.bind(this);

    }

    generateURL() {
        let temp = Array.from({ length: this.state.gridSize }, (t, x) =>
            Array.from({ length: this.state.gridSize }, (t, y) => "")
        );

        for (let i = 0; i < temp.length; i++) {
            for (let j = 0; j < temp.length; j++) {
                temp[i][j] = this.state.letterGrid[i][j];
            }
        }
        const gameState = {
            grid: temp,
            gridSize: this.state.gridSize,
            wordList: this.state.wordList,
        };

        const base64String = "https://zabzabdoda.com/play/" + btoa(JSON.stringify(gameState));
        return base64String;
    }

    handleAddWord() {
        this.setState({ wordList: [...this.state.wordList, this.state.addWord] });
        this.setState({ addWord: "" });
        this.inputRef.current.focus();
    }

    generate() {
        this.setState({
            letterGrid: Array.from({ length: this.state.gridSize }, (t, x) =>
                Array.from({ length: this.state.gridSize }, (t, y) => (" ")))
        }, () => {
            if (this.populateBoard(this.state.wordList, this.state.gridSize)) {
                this.fillWithRandomLetters();
                this.setState({
                    url: this.generateURL(),
                }, () => {
                    window.location.href = this.state.url;
                });
                this.setState({ addWord: "" });
            }
        });
    }


    populateBoard(wordList, gridSize) {
        let cantPlace = false;
        wordList
            .sort((a, b) => b.length - a.length)
            .forEach((e) => {
                let times = 0;
                while (true) {
                    times++;
                    if (times >= 50) {
                        cantPlace = true;
                        break;
                    }
                    let x = utils.getRandomInt(0, gridSize - 1);
                    let y = utils.getRandomInt(0, gridSize - 1);
                    let dir = utils.getRandomInt(1, 3);
                    let invertNum = Math.random() < 0.5 ? 1 : -1;
                    if (this.checkIfWordFits(e, x, y, dir, invertNum)) {
                        this.placeWord(e, x, y, dir, invertNum);
                        break;
                    }
                }
            });

        if (cantPlace) {
            this.props.errorAlertCallback();
            return false;
        }
        return true;
    }

    fillWithRandomLetters() {
        let updatedButtonRefs = [...this.state.letterGrid];
        for (let i = 0; i < this.state.gridSize; i++) {
            for (let j = 0; j < this.state.gridSize; j++) {
                if (this.state.letterGrid[i][j] === " ") {
                    let newLetter = utils.getRandomLetter();

                    updatedButtonRefs[i][j] = newLetter;

                }
            }
        }
        this.setState({ letterGrid: updatedButtonRefs });
    }

    placeWord(word, x, y, dir, invertNum) {
        if (dir === 1) {
            //horizontal
            let updatedButtonRefs = [...this.state.letterGrid];
            for (let i = 0; i < word.length; i++) {
                updatedButtonRefs[x + i * invertNum][y] = word[i];
            }
            this.setState({ letterGrid: updatedButtonRefs });

        } else if (dir === 2) {
            //vertical
            let updatedButtonRefs = [...this.state.letterGrid];
            for (let i = 0; i < word.length; i++) {
                updatedButtonRefs[x][y + i * invertNum] = word[i];
            }
            this.setState({ letterGrid: updatedButtonRefs });
        } else if (dir === 3) {
            //diagonal
            let updatedButtonRefs = [...this.state.letterGrid];
            for (let i = 0; i < word.length; i++) {
                updatedButtonRefs[x + i * invertNum][
                    y + i * invertNum
                ] = word[i];
            }
            this.setState({ letterGrid: updatedButtonRefs });
        }
    }

    checkIfWordFits(word, row, col, dir, invertNum) {
        if (dir === 1) {
            //horizontal
            for (let i = 0; i < word.length; i++) {
                if (
                    row + i * invertNum > this.state.gridSize - 1 ||
                    row + i * invertNum < 0
                ) {
                    return false;
                }

                if (
                    this.state.letterGrid[row + i * invertNum][col] !== " "
                ) {
                    return false;
                }
            }
            return true;
        } else if (dir === 2) {
            //vertical
            for (let i = 0; i < word.length; i++) {
                if (
                    col + i * invertNum > this.state.gridSize - 1 ||
                    col + i * invertNum < 0
                ) {
                    return false;
                }
                if (
                    this.state.letterGrid[row][col + i * invertNum] !== " "
                ) {
                    return false;
                }
            }
            return true;
        } else if (dir === 3) {
            //diagonal
            for (let i = 0; i < word.length; i++) {
                if (
                    row + i * invertNum > this.state.gridSize - 1 ||
                    col + i * invertNum > this.state.gridSize - 1 ||
                    row + i * invertNum < 0 ||
                    col + i * invertNum < 0
                ) {
                    return false;
                }
                if (
                    this.state.letterGrid[row + i * invertNum][col + i * invertNum]
                    !== " "
                ) {
                    return false;
                }
            }
            return true;
        }
    }


    clearBoard() {
        let updatedButtonRefs = [...this.state.letterGrid];
        for (let i = 0; i < this.state.gridSize; i++) {
            for (let j = 0; j < this.state.gridSize; j++) {
                updatedButtonRefs[i][j] = " ";
            }
        }
        this.setState({ letterGrid: updatedButtonRefs });
    }

    updateWordList(wordList) {
        this.setState({ wordList: wordList });
    }

    render() {
        return (
            <StyledWrapper>

                <div><StyledTitle>Create Word Search</StyledTitle>
                    <div>
                        <WordBank colCount={1} canEdit={true} crossWordsOff={false} gridSize={this.state.gridSize} wordList={this.state.wordList} updateWordList={this.updateWordList}></WordBank>
                        <StyledTextBoxWrapper>
                            <StyledTextBox>
                                <Form.Control
                                    placeholder="Add word..."
                                    maxLength={this.state.gridSize}
                                    value={this.state.addWord}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            this.handleAddWord();
                                        }
                                    }}
                                    onChange={(e) => {
                                        this.setState({
                                            addWord: e.target.value.toUpperCase().trim(),
                                        });
                                    }}
                                    ref={this.inputRef}
                                />
                                <Button onClick={this.handleAddWord}>Add</Button>
                            </StyledTextBox>
                        </StyledTextBoxWrapper>
                        <StyledSliderWrapper>
                            <div>Grid Size:</div>
                            <StyledSliderWrapperInner>
                                <StyledSliderLabel>
                                    {this.state.gridSize}
                                </StyledSliderLabel>
                                <StyledSlider
                                    value={this.state.gridSize}
                                    onChange={(e) => {
                                        this.setState({ gridSize: e.target.value });
                                    }}

                                    min={4}
                                    max={20}
                                    tooltip="off"
                                />
                            </StyledSliderWrapperInner>
                        </StyledSliderWrapper>
                        <StyledButton onClick={this.generate}>
                            Generate Game
                        </StyledButton>
                        <Form.Control id="textarea" readOnly value={this.state.url} as="textarea" />
                    </div>
                </div>
            </StyledWrapper>
        );
    }
}

export default AddWordForm;
