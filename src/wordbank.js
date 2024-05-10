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


export const WordBank = (props) => {

    const deleteWord = (wordToDelete) => {
        const updatedWordList = [...props.wordList];
        const indexToRemove = updatedWordList.indexOf(wordToDelete);
        if (indexToRemove !== -1) {
            updatedWordList.splice(indexToRemove, 1);
        }
        props.updateWordList(updatedWordList);
    }

    return (
        <StyledWordBankWrapper>
            <StyledTitle>
                Word Bank
            </StyledTitle>
            {(() => {
                if (props.wordList.length > 0) {
                    return (<StyledListWrapper $colCount={props.colCount}>
                        <ListGroup>
                            {props.wordList.map((word, index) => (
                                <StyledListItem
                                    key={index}
                                    $toobig={props.canEdit && word.length > props.gridSize}
                                    $found={props.crossWordsOff && props.foundWords[word]}
                                    $canEdit={props.canEdit}
                                    onClick={() => {
                                        if (props.canEdit) {
                                            deleteWord(word)
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

export default WordBank;
