import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import styled from "styled-components";
import InformationHover from "./information";
import TrashIcon from "./icons";


const StyledListItem = styled(ListGroupItem)`
    min-width: 100px;
    max-width: 775px;
    break-inside: avoid;
    text-decoration: solid;
    border: none;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
    margin: 10px;
    padding: 5px;
    max-width: fit-content;
    background-color: ${props => {
        if (props.$found) {
            return "rgb(27, 194, 55)";
        } else if (props.$toobig) {
            return "rgba(255, 255, 0, 0.5)";
        } else {
            return "white";
        }
    }};
    svg {
        display: none;
    }
    ${props => props.$canEdit && `
        &:hover {
            background-color: rgba(255, 0, 0, 0.6);
            cursor: pointer;
            svg {
                display: inline-block;
                position: absolute;
                top: 30%;
                right: 5px;
            }
        }

    `}
    
    `;

const StyledListWrapper = styled.div`
    margin: 5px;
    width: 100%;
`;

const StyledWordBankWrapper = styled.div`
    justify-content: center;
    display: flex;
    align-items: center;
    width: 100%;
    flex-direction: column;
    background-color: white;
    border-radius: 10px;
    border: thick lightgray solid;
    


`;

const StyledTitle = styled.h3`
    margin: 0;
    width: 100%;
    text-align: center;
    border-bottom: dashed medium lightgrey;
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
        <div style={{ padding: "20px", width: "100%", maxWidth: "675px" }}>
            <StyledWordBankWrapper>
                <StyledTitle>
                    Word Bank
                    {(() => {
                        if (props.canEdit) {
                            return (<InformationHover style={{ margin: "5px" }} tooltip="To remove words from the Word Bank click on them" />);
                        }
                    })()}
                </StyledTitle>
                {(() => {
                    if (props.wordList.length > 0) {
                        return (<StyledListWrapper $colCount={props.colCount}>
                            <ListGroup style={{ borderRadius: "0px", display: "flex", justifyContent: "space-evenly", alignContent: "center", alignItems: "center", flexDirection: "row", flexWrap: "wrap", width: "100%", textAlign: "center" }}>
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
                                        <TrashIcon />
                                    </StyledListItem>
                                ))}
                            </ListGroup>
                        </StyledListWrapper>);
                    } else {
                        return <></>;
                    }
                })()}

            </StyledWordBankWrapper>
        </div>
    );
}

export default WordBank;
