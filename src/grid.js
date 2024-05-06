import styled from "styled-components";
import React from "react";

const StyledButton = styled.button`
    padding: 0px;
    margin: 0px;
    aspect-ratio: 1/1;
    background-color: rgba(0, 0, 0, 0);
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
    background-color: gainsboro;
    border-radius: 10%;
    padding: 20px;
    margin: 20px;
`;

const StyledRow = styled.div`
    display: flex;
`;

class Grid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            grid: [],
        }
        this.updateGrid = this.updateGrid.bind(this);
        this.handleButtonMouseEnterMobileWrapper = this.handleButtonMouseEnterMobileWrapper.bind(this);
    }

    componentDidMount() {
        this.updateGrid();
    }

    updateGrid() {
        let tempRefs = Array.from({ length: this.props.gridSize }, (t, x) =>
            Array.from({ length: this.props.gridSize }, (t, y) => React.createRef())
        );
        this.props.setButtonRefs(tempRefs);
        this.setState({
            grid:
                Array.from({ length: this.props.gridSize }, (t, x) =>
                    Array.from({ length: this.props.gridSize }, (t, y) => (
                        <StyledButton row={x} col={y}>
                            <StyledText
                                className="circle"
                                ref={tempRefs[x][y]}
                                onMouseDown={this.props.handleButtonMouseDown}
                                onTouchStart={this.props.handleButtonMouseDown}

                                onMouseEnter={this.props.handleButtonMouseEnter}
                                onTouchMove={this.handleButtonMouseEnterMobileWrapper}
                                //touch={this.props.handleButtonMouseEnter}
                                onPointerEnter={this.props.handleButtonMouseEnter}
                                onMouseUp={this.props.handleButtonMouseUp}
                                onTouchEnd={this.props.handleButtonMouseUp}

                                x={x}
                                y={y}
                            >
                                {this.props.tempGrid[x][y]}
                            </StyledText>
                        </StyledButton>
                    ))
                ),
        });
    }

    handleButtonMouseEnterMobileWrapper(e) {

        let t = { target: document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY) }
        if (t.target !== undefined && t.target !== null && t.target.classList.contains("circle")) {
            this.props.handleButtonMouseEnter(t);
        }
    }

    render() {
        return (
            <>
                <StyledGridWrapper style={{ width: "100%", minWidth: "275px", maxWidth: "575px", touchAction: "none" }}>
                    <StyledButtonContainer>
                        {this.state.grid.map((row, rowIndex) => (
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
}

export default Grid;