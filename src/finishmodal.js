import React from "react";
import { Modal, ModalTitle, ModalHeader, ModalBody, ModalFooter } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Confetti from "react-confetti";


class FinishModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cookies: false,
    }
  }


  render() {
    return (
      <>
        <Confetti numberOfPieces={150 * this.props.show} recycle={this.props.show} gravity={0.07} drawShape={ctx => {
          if (!this.state.cookies) {
            let n = Math.floor(Math.random() * (3 - 1 + 1) + 1);
            if (n === 1) {
              ctx.fillRect(0, 0, 10, 10);
            } else if (n === 2) {
              ctx.arc(0, 0, 10, 0, 2 * Math.PI, false);
            } else {
              ctx.fillRect(0, 0, 10, 15);
            }
          } else {
            let n = Math.floor(Math.random() * (64 - 24 + 1) + 24);
            ctx.font = n + "px serif";
            ctx.strokeText("🍪", 0, 0);
          }
        }} />
        <Modal
          show={this.props.show}
          onHide={this.props.onClose}
          backdrop="static"
          keyboard={false}
        >
          <ModalHeader closeButton>
            <ModalTitle>Modal title</ModalTitle>
          </ModalHeader>
          <ModalBody style={{ textAlign: "center" }}>
            You finished the word search! Here have a cookie<p onClick={() => { this.setState({ cookies: !this.state.cookies }) }}>🍪</p>
            To make a word search puzzle go to <a href="http://zabzabdoda.com">zabzabdoda.com</a>
          </ModalBody>

          <ModalFooter>
            <Button variant="secondary" onClick={this.props.onClose}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

FinishModal.defaultProps = {
  show: true, // Set your desired default value here
};

export default FinishModal;