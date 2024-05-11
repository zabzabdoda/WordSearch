import React, { useEffect, useState } from "react";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

export const Home = (props) => {

    const [dailyPuzzle, setDailyPuzzle] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [puzzleList, setPuzzleList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPuzzles();
    }, [currentPage]);

    const fetchPuzzles = () => {
        fetch("https://api.zabzabdoda.com/puzzles/all?page=" + currentPage)
            .then(res => res.json())
            .then(res => {
                setPuzzleList(res.data);
                console.log(res);
            });
    }



    return (
        <div style={{ display: "flex", justifyItems: "center", justifyContent: "center", alignContent: "center", margin: "20px", padding: "10px" }}>
            <div style={{ width: "60%" }}>
                <ListGroup>
                    {puzzleList.map((puzzle, index) => (
                        <ListGroupItem action onClick={() => { navigate("/play/" + puzzle.uuid) }}>
                            {puzzle.name}
                        </ListGroupItem>
                    ))}
                </ListGroup>
                <div style={{ display: "flex", justifyContent: "center", margin: "10px" }}>
                    {(() => {
                        if (currentPage > 1) {
                            return (<Button style={{ margin: "10px" }} onClick={() => { setCurrentPage(currentPage - 1) }}>Prev Page</Button>);
                        } else {
                            return (<></>);
                        }
                    })()}

                    {(() => {
                        if (currentPage < 5) {
                            return (<Button style={{ margin: "10px" }} onClick={() => { setCurrentPage(currentPage + 1) }}>Next Page</Button>);
                        } else {
                            return (<></>);
                        }
                    })()}
                </div>
            </div>
        </div>
    );
}

export default Home;
