import React, { useEffect, useState, useRef } from "react";
import Grid from "./grid";
import * as utils from "./utils";
import FinishModal from "./finishmodal";
import WordBank from "./wordbank";
import styled from "styled-components";
import ReactDOM from "react-dom";
import useStateRef from "react-usestateref";

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

export const WordSearchGame = (props) => {

    const [tempGrid, setTempGrid] = useState(null);
    const buttonRefs = useRef({});
    const [startCoordX, setStartCoordX] = useState(null);
    const [endCoordX, setEndCoordX] = useState(null);
    const [startCoordY, setStartCoordY] = useState(null);
    const [endCoordY, setEndCoordY] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [wordList, setWordList] = useState([]);
    const [gridSize, setGridSize] = useState(10);
    const [foundWords, setFoundWords] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);

    const useMountEffect = (fun) => useEffect(fun, []);

    let scx = useRef(null);
    let scy = useRef(null);
    let ecx = useRef(null);
    let ecy = useRef(null);
    let dragRef = useRef(false);
    let foundRef = useRef(null);
    /*let mD = useRef(null);
    let mE = useRef(null);
    let mU = useRef(null);
*/

    useEffect(() => {
        ecx.current = endCoordX;
        ecy.current = endCoordY;
        scx.current = startCoordX;
        scy.current = startCoordY;
        dragRef.current = isDragging;
        foundRef.current = foundWords;

        /* mD.current = handleButtonMouseDown;
         mE.current = handleButtonMouseEnter;
         mU.current = handleButtonMouseUp;*/
    }, [startCoordX, startCoordY, endCoordX, endCoordY, isDragging, foundWords]);

    function getGridCoord(x, y, cols) {
        return parseInt(x) * parseInt(cols) + parseInt(y);
    }

    const handleButtonMouseDown = (e) => {
        setIsDragging(true);
        setStartCoordX(e.target.parentNode.getAttribute("row"));
        setStartCoordY(e.target.parentNode.getAttribute("col"));
        e.target.classList.add("selected");
    };

    const handleButtonMouseEnter = (e) => {
        if (dragRef.current) {
            const elements = document.querySelectorAll("*");
            elements.forEach((element) => {
                element.classList.remove("secondary");
            });
            setEndCoordX(e.target.parentNode.getAttribute("row"));
            setEndCoordY(e.target.parentNode.getAttribute("col"));
            if (!e.target.classList.contains("selected")) {
                e.target.classList.add("secondary");
            }
            if (
                utils.checkLineType(
                    scx.current,
                    scy.current,
                    e.target.parentNode.getAttribute("row"),
                    e.target.parentNode.getAttribute("col")
                )
            ) {
                let points = utils.bresenham(
                    scx.current,
                    e.target.parentNode.getAttribute("row"),
                    scy.current,
                    e.target.parentNode.getAttribute("col")
                );
                points.slice(1).forEach((e) => {
                    buttonRefs.current[getGridCoord(e.x1, e.y1, gridSize)].classList.add("secondary");
                });
            }
        }
    };


    const handleButtonMouseUp = () => {
        if (dragRef.current) {
            setIsDragging(false);
            if (
                scx.current !== ecx.current ||
                ecy.current !== scy.current
            ) {
                if (
                    scx.current !== null &&
                    ecx.current !== null &&
                    ecy.current !== null &&
                    scy.current !== null
                ) {
                    let straight = utils.checkLineType(
                        scx.current,
                        scy.current,
                        ecx.current,
                        ecy.current
                    );
                    if (straight) {
                        let currentWord = utils.bresenham(
                            scx.current,
                            ecx.current,
                            scy.current,
                            ecy.current
                        );
                        let word = "";
                        currentWord.forEach((e) => {
                            word += buttonRefs.current[getGridCoord(e.x1, e.y1, gridSize)].textContent;
                        });
                        if (
                            wordList.includes(word) &&
                            !foundRef.current[word]
                        ) {
                            let t = { ...foundRef.current, [word]: true };
                            setFoundWords(t);

                            let test = Object.values(t).every(value => value === true);
                            if (test) {
                                setShowConfetti(true);
                            }

                            currentWord.forEach((e) => {
                                buttonRefs.current[getGridCoord(e.x1, e.y1, gridSize)].classList.add("completed");
                            });
                        }
                    }
                }
            }
            setStartCoordX(null);
            setStartCoordY(null);
            setEndCoordX(null);
            setEndCoordY(null);
            const elements = document.querySelectorAll("*");

            elements.forEach((element) => {
                element.classList.remove("selected");
                element.classList.remove("secondary");
            });
        }
    };

    let closeModal = () => {
        setShowConfetti(false);
    }

    useMountEffect(() => {
        let params = window.location.href.split("/play/");
        let puzzleBase64 = "";

        fetch("http://localhost:9000/puzzles?uuid=" + params[1])
            .then(res => res.json())
            .then(res => {
                puzzleBase64 = res.data[0];
                let wordList = JSON.parse(puzzleBase64.wordList.replaceAll("\'", "\""));
                setWordList(wordList);
                setGridSize(puzzleBase64.gridSize);
                setTempGrid(JSON.parse(atob(puzzleBase64.grid)).grid);
                setFoundWords(wordList.reduce((acc, word) => {
                    acc[word] = false;
                    return acc;
                }, {}),);
            }
            );
    });

    return (
        <>
            <div>
                <FinishModal show={showConfetti} onClose={closeModal}></FinishModal>
                <StyledBoardWrapper>
                    <StyledGridWrapper>
                        <Grid
                            tempGrid={tempGrid}
                            handleButtonMouseDown={handleButtonMouseDown}
                            handleButtonMouseUp={handleButtonMouseUp}
                            handleButtonMouseEnter={handleButtonMouseEnter}
                            buttonRefs={buttonRefs}
                            gridSize={gridSize}
                        />
                    </StyledGridWrapper>
                    <StyledBoardWrapper >
                        <WordBank colCount={2} canEdit={false} crossWordsOff={true} gridSize={gridSize} wordList={wordList} foundWords={foundWords} />
                    </StyledBoardWrapper>
                </StyledBoardWrapper>
            </div>
        </>
    );
}

export default WordSearchGame;
