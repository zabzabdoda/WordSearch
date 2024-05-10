import React, { useEffect, useState } from "react";
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

export const WordSearchMaker = (props) => {

  const [alert, showAlert] = useState(false);

  useEffect(() => {

  }, []);

  const errorAlertCallback = () => {
    showAlert(true);
  }

  return (
    <>
      <StyledWrapper>
        <StyledAlert
          show={alert}
          onClose={() => {
            showAlert(false);
          }}
          variant="danger"
          dismissible
        >
          <Alert.Heading>Board not big enough!</Alert.Heading>
          <p>Try increasing the size or use less words</p>
        </StyledAlert>
        <AddWordForm errorAlertCallback={errorAlertCallback}></AddWordForm>
      </StyledWrapper>
    </>
  );
}

export default WordSearchMaker;
