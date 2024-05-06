import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import styled from "styled-components";


const StyledListItem = styled(ListGroupItem)`
    min-width: 100px;
    max-width: 500px;
    break-inside: avoid;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: ${props => {
        //console.log(props.$found);
        //console.log(props);
        if (props.$found) {
            return "rgba(61, 165, 58,0.5)";
        } else if (props.$toobig) {
            return "rgba(255, 255, 0, 0.5)";
        } else {
            return "white";
        }
    }};
    ${props => props.$canEdit && `
        &:hover {
            background-color: rgba(255, 0, 0, 0.5);
            text-decoration: line-through;
            cursor: pointer;
        }
    `}
    text-decoration: ${props => (props.$found ? "line-through solid" : "none")};
    `;

const StyledListWrapper = styled.div`
    column-count: ${props => props.$colCount};
    column-gap: 0px;
    border: 1px solid darkgrey;
    margin: 20px;
    max-width: fit-content;
    width: 100%;
`;

const StyledWordBankWrapper = styled.div`
    justify-content: center;
    display: flex;
    align-items: center;
    width: 100%;
    flex-direction: column;
`;

const StyledTitle = styled.h3`
    margin: 0;
    width: 100%;
    text-align: center;
`;


class WordBank extends React.Component {

    deleteWord(wordToDelete) {
        const updatedWordList = [...this.props.wordList];
        const indexToRemove = updatedWordList.indexOf(wordToDelete);
        if (indexToRemove !== -1) {
            updatedWordList.splice(indexToRemove, 1);
        }
        this.props.updateWordList(updatedWordList);
    }

    render() {
        return (
            <StyledWordBankWrapper>
                <StyledTitle>
                    Word Bank
                </StyledTitle>
                {(() => {
                    if (this.props.wordList.length > 0) {
                        return (<StyledListWrapper $colCount={this.props.colCount}>
                            <ListGroup>
                                {this.props.wordList.map((word, index) => (
                                    <StyledListItem
                                        key={index}
                                        $toobig={this.props.canEdit && word.length > this.props.gridSize}
                                        $found={this.props.crossWordsOff && this.props.foundWords[word]}
                                        $canEdit={this.props.canEdit}
                                        onClick={() => {
                                            if (this.props.canEdit) {
                                                this.deleteWord(word)
                                            }
                                        }}
                                    >
                                        {word}
                                    </StyledListItem>
                                ))}
                            </ListGroup>
                        </StyledListWrapper>);
                    } else {
                        return <></>;
                    }
                })()}

            </StyledWordBankWrapper>
        );
    }
}

export default WordBank;
