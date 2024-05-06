import React from "react";
import "./letter.css";

class LetterButton extends React.Component {
  constructor(props) {
    super(props);
    this.char = "";
  }

  render() {
    return (
      <>
        <input
          onMouseDown={this.props.onMouseDown}
          onMouseEnter={this.props.onMouseEnter}
          onMouseUp={this.props.onMouseUp}
          col={this.props.col}
          row={this.props.row}
          type="button"
          value={this.char}
        />
      </>
    );
  }
}

export default LetterButton;
