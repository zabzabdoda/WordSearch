import styled from "styled-components";
import React, { useEffect, useState } from "react";

const StyledButton = styled.button`
    padding: 0px;
    margin: 0px;
    aspect-ratio: 1/1;
    background-color: rgba(0, 0, 0, 0);
    font-weight: 500;
    border: none;
    flex: 1;
    justify-content: center;
`;

const StyledText = styled.div`
    font-size: x-large;
    width: 100%;
    height: 100%;
    align-content: center;
    @media screen and (max-width: 570px){
        font-size: large;
    }
    @media screen and (max-width: 450px){
        font-size: medium;
    }
    
    @media screen and (min-width: 900px){
        font-size: xx-large;
    }
`;

const StyledGridWrapper = styled.div`
    justify-content: center;
    display: flex;
    align-items: center;
    
`;

const StyledButtonContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 10%;
    border: thick lightgray solid;
    padding: 20px;
`;

const StyledRow = styled.div`
    display: flex;
`;

export const Grid = ({ tempGrid, gridSize, buttonRefs, handleButtonMouseEnter, handleButtonMouseUp, handleButtonMouseDown }) => {

    const [grid, setGrid] = useState([]);


    useEffect(() => {
        updateGrid();
    }, [tempGrid]);

    function getGridCoord(x, y, cols) {
        return x * cols + y;
    }

    const mUp = () => {
        handleButtonMouseUp();
    }

    const mDown = (e) => {
        handleButtonMouseDown(e);
    }

    const mEnter = (e) => {
        handleButtonMouseEnter(e);

    }

    const updateGrid = () => {
        if (tempGrid) {
            setGrid(
                Array.from({ length: gridSize }, (t, x) =>
                    Array.from({ length: gridSize }, (t, y) => (
                        <StyledButton row={x} col={y} key={`${x}-${y}`}>
                            <StyledText
                                key={`${x}-${y}`}
                                className="circle"
                                ref={element => (buttonRefs.current[getGridCoord(x, y, gridSize)] = element)}
                                onMouseDown={mDown}
                                onTouchStart={mDown}

                                onMouseEnter={mEnter}
                                onTouchMove={handleButtonMouseEnterMobileWrapper}
                                //touch={this.props.handleButtonMouseEnter}
                                onPointerEnter={mEnter}
                                onMouseUp={mUp}
                                onTouchEnd={mUp}
                                x={x}
                                y={y}
                            >
                                {tempGrid[x][y]}
                            </StyledText>
                        </StyledButton>
                    ))
                ),
            );
        }
    }

    const handleButtonMouseEnterMobileWrapper = (e) => {

        let t = { target: document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY) }
        if (t.target !== undefined && t.target !== null && t.target.classList.contains("circle")) {
            handleButtonMouseEnter(t);
        }
    }

    return (
        <>
            <StyledGridWrapper style={{ width: "100%", minWidth: "275px", maxWidth: "775px", touchAction: "none", padding: "20px" }}>
                <StyledButtonContainer>
                    {grid.map((row, rowIndex) => (
                        <StyledRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <>{cell}</>
                            ))}
                        </StyledRow>
                    ))}
                </StyledButtonContainer>
            </StyledGridWrapper>
        </>
    );
}

export default Grid;