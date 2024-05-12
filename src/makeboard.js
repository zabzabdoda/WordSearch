import { Form, InputGroup, Button, FormControl, FormLabel, FloatingLabel } from "react-bootstrap";
import React from "react";
import WordBank from "./wordbank";
import RangeSlider from "react-bootstrap-range-slider";
import * as utils from "./utils";
import 'bootstrap/dist/css/bootstrap.css';
import styled from "styled-components";
import FormRange from "react-bootstrap/esm/FormRange";
import { InformationHover } from "./information";

const apiUrl = process.env.REACT_APP_API_URL || "https://api.zabzabdoda.com";
const mainUrl = process.env.REACT_APP_URL || "https://zabzabdoda.com";

const StyledWrapper = styled.div`
    justify-content: center;
    border: thick lightgray solid;
    padding: 30px;
    border-radius: 20px;
    margin: 30px;
    width: 75%;
    align-items: center;
    display: flex;
    flex-direction: column;
    max-width: 500px;
    min-width: 330px;
    background-color: white;
`;

const StyledTextBoxWrapper = styled.div`
    display: flex;
    width: 100%;
`;

const StyledTextBox = styled(InputGroup)`
    display: flex;
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
`;

const StyledSliderWrapper = styled.div`
    justify-content: space-between;
    display: flex;
    align-items: center;

    padding: 0.5rem;
    border: var(--bs-border-width) solid var(--bs-border-color);
    border-radius: var(--bs-border-radius);
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

const StyledSlider = styled(FormRange)`
    
`;

const StyledSliderWrapperInner = styled.div`
flex-grow: 2;
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

        const base64String = btoa(JSON.stringify(gameState));
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
                    //window.location.href = this.state.url;
                    fetch(`${apiUrl}/puzzles/new`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "grid": this.state.url,
                            "gridSize": this.state.gridSize,
                            "wordList": JSON.stringify(this.state.wordList).replaceAll("\"", "'"),
                            "name": this.state.name
                        })
                    })
                        .then(res => res.json())
                        .then(res => {
                            window.location.href = `${mainUrl}/play/` + res.uuid;
                            //setPuzzleList(res.data);
                            //console.log(res);
                        });
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
        let updatedGrid = [...this.state.letterGrid];
        for (let i = 0; i < this.state.gridSize; i++) {
            for (let j = 0; j < this.state.gridSize; j++) {
                if (this.state.letterGrid[i][j] === " ") {
                    let newLetter = utils.getRandomLetter();

                    updatedGrid[i][j] = newLetter;

                }
            }
        }
        this.setState({ letterGrid: updatedGrid });
    }

    placeWord(word, x, y, dir, invertNum) {
        if (dir === 1) {
            //horizontal
            let updatedGrid = [...this.state.letterGrid];
            for (let i = 0; i < word.length; i++) {
                updatedGrid[x + i * invertNum][y] = word[i];
            }
            this.setState({ letterGrid: updatedGrid });

        } else if (dir === 2) {
            //vertical
            let updatedGrid = [...this.state.letterGrid];
            for (let i = 0; i < word.length; i++) {
                updatedGrid[x][y + i * invertNum] = word[i];
            }
            this.setState({ letterGrid: updatedGrid });
        } else if (dir === 3) {
            //diagonal
            let updatedGrid = [...this.state.letterGrid];
            for (let i = 0; i < word.length; i++) {
                updatedGrid[x + i * invertNum][
                    y + i * invertNum
                ] = word[i];
            }
            this.setState({ letterGrid: updatedGrid });
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
        let updatedGrid = [...this.state.letterGrid];
        for (let i = 0; i < this.state.gridSize; i++) {
            for (let j = 0; j < this.state.gridSize; j++) {
                updatedGrid[i][j] = " ";
            }
        }
        this.setState({ letterGrid: updatedGrid });
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
                            <div style={{ display: "flex", flexGrow: 1, alignItems: "center" }}>

                                Grid Size:
                                <StyledSliderLabel>
                                    {this.state.gridSize}
                                </StyledSliderLabel>
                            </div>

                            <StyledSliderWrapperInner>

                                <StyledSlider
                                    size="lg"
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
                        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                            <FloatingLabel id="floatingInput" label="Name/Theme">
                                <InformationHover tooltip="What you want to call your puzzle, or the theme it follows i.e. Star Wars" style={{ position: "absolute", left: "105px", top: "10px" }} />
                                <FormControl id="namebox" value={this.state.name} onChange={(e) => { this.setState({ name: e.target.value }) }} />

                            </FloatingLabel>
                        </div>
                        <StyledButton onClick={this.generate}>
                            Generate Game
                        </StyledButton>

                    </div>
                </div>
            </StyledWrapper>
        );
    }
}

export default AddWordForm;

//<Form.Control id="textarea" readOnly value={this.state.url} as="textarea" />