import "./shared.css";
import "./wordbank.css"
import React from "react";
import { ListGroup, Button } from "react-bootstrap";

class WordBank extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    deleteWord(wordToDelete) {
        const updatedWordList = [...this.props.wordList];
        const indexToRemove = updatedWordList.indexOf(wordToDelete);
        if (indexToRemove !== -1) {
            updatedWordList.splice(indexToRemove, 1);
        }
        this.props.updateWordList(updatedWordList);
    }

    wordStyling = (word) => {
        let str = "word-item ";
        if (this.props.crossWordsOff && this.props.foundWords.includes(word)) {
            str += "disabled ";
        }
        if (this.props.canEdit && word.length > this.props.gridSize) {
            str += "too-big ";
        }
        if (this.props.crossWordsOff && this.props.foundWords.includes(word)) {
            str += "found";
        }
        return str;
    }

    render() {
        return (
            <div onClick={() => { console.log(this.props.wordList) }} className="center word-bank" style={{ width: "100%", flexDirection: "column" }}>
                <h3 style={{ margin: 0, width: "100%", textAlign: "center" }}>
                    Word Bank
                </h3>
                {(() => {
                    if (this.props.wordList.length > 0) {
                        return (<div className="word-bank-container" style={{ width: "100%" }}>
                            <ListGroup>
                                {this.props.wordList.map((word, index) => (
                                    <ListGroup.Item

                                        key={index}
                                        className={this.wordStyling(word)}
                                    >
                                        {(() => {
                                            if (this.props.canEdit) {
                                                return (
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="delete-btn"
                                                        onClick={() => this.deleteWord(word)}
                                                    >
                                                        X
                                                    </Button>
                                                );
                                            }
                                        })()}
                                        {word}


                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>);
                    } else {
                        return <></>;
                    }
                })()}

            </div>
        );
    }
}

export default WordBank;