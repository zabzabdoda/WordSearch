import "./shared.css";
import React from "react";

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
                        <button className="letter-button" row={x} col={y}>
                            <div
                                ref={tempRefs[x][y]}
                                className="circle"

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
                            </div>
                        </button>
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
                <div style={{ width: "100%", minWidth: "275px", maxWidth: "575px", touchAction: "none" }} className="center">
                    <div className="button-container ">
                        {this.state.grid.map((row, rowIndex) => (
                            <div className="row-div" key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <>{cell}</>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }
}

export default Grid;