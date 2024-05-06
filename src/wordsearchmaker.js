import React from "react";
import "./board.css";
import { Alert } from "react-bootstrap";
import AddWordForm from "./makeboard";
import styled from "styled-components";

const StyledWrapper = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center
`;

const StyledAlert = styled(Alert)`
  margin: 20px;
  width: 600px;
  text-align: center;
`;

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
        <StyledWrapper>
          <StyledAlert
            show={this.state.showAlert}
            onClose={() => {
              this.setState({ showAlert: false });
            }}
            variant="danger"
            dismissible
          >
            <Alert.Heading>Board not big enough!</Alert.Heading>
            <p>Try increasing the size or use less words</p>
          </StyledAlert>
          <AddWordForm errorAlertCallback={this.errorAlertCallback}></AddWordForm>
        </StyledWrapper>
      </>
    );
  }
}

export default WordSearchMaker;
