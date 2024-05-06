import { Form, InputGroup, Button } from "react-bootstrap";
import React from "react";
import WordBank from "./wordbank";
import RangeSlider from "react-bootstrap-range-slider";
import * as utils from "./utils";
import "./addwordform.css";
import 'bootstrap/dist/css/bootstrap.css';
import { Redirect } from 'react-router-dom';

class AddWordForm extends React.Component {

    constructor(props) {
        super(props);
        this.navigate = useNavigate();
        this.state = {
            //wordList: this.props.wordList,
            redirect: false,
            addWord: "",
            url: "",
            letterGrid: [],
            wordList: [],
            gridSize: 10,
            //gridSize: this.props.gridSize,
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
                    url: "zabzabdoda.com/play/" + this.generateURL(),
                }, () => {
                    console.log(this.state.url);
                    this.setState({ redirect: true });
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
                    let x = utils.getRandomInt(0, gridSize - 1); //change later to gridsize
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
            <div className="center form-box">
                <Redirect to={this.state.url} />
                <div><h1 style={{ textAlign: "center" }}>Create Word Search</h1>
                    <div>
                        <WordBank canEdit={true} crossWordsOff={false} gridSize={this.state.gridSize} wordList={this.state.wordList} updateWordList={this.updateWordList}></WordBank>
                        <div className="row-div" style={{ width: "100%" }}>
                            <InputGroup className="row-div p-3" style={{ width: "100%" }}>
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
                            </InputGroup>
                        </div>
                        <div className="center m-2 p-2" >
                            <div>Grid Size:</div>
                            <div style={{ display: "flex" }}><div style={{ margin: "10px" }}>{this.state.gridSize}</div>
                                <RangeSlider
                                    style={{ height: "100%" }}
                                    value={this.state.gridSize}
                                    onChange={(e) => {
                                        this.setState({ gridSize: e.target.value });
                                    }}

                                    min={4}
                                    max={20}
                                    tooltip="off"
                                />
                            </div>
                        </div>
                        <Button style={{ width: "100%" }} onClick={this.generate}>
                            Generate Game
                        </Button>
                        <Form.Control id="textarea" readOnly value={this.state.url} as="textarea" />
                    </div>
                </div>
            </div>
        );
    }
}

export default AddWordForm;