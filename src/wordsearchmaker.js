import React from "react";
import "./board.css";
import "./shared.css";
import { Alert } from "react-bootstrap";
import AddWordForm from "./makeboard";

class WordSearchMaker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
    };
    this.errorAlertCallback = this.errorAlertCallback.bind(this);
  }

  errorAlertCallback() {
    this.setState({ showAlert: true });
  }

  render() {
    return (
      <>
        <div style={{ flexDirection: "column", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Alert
            className="alert"
            show={this.state.showAlert}
            onClose={() => {
              this.setState({ showAlert: false });
            }}
            variant="danger"
            dismissible
          >
            <Alert.Heading>Board not big enough!</Alert.Heading>
            <p>Try increasing the size or use less words</p>
          </Alert>
          <AddWordForm errorAlertCallback={this.errorAlertCallback}></AddWordForm>
        </div>
      </>
    );
  }
}

export default WordSearchMaker;
