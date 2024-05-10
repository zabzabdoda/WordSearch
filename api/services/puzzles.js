const db = require('../services/db');
const short = require('short-uuid');
const listPerPage = 10;


function getMultiple(page = 1) {
    const offset = (page - 1) * listPerPage;
    const data = db.query(`SELECT * FROM puzzles LIMIT ?,?`, [offset, listPerPage]);
    const meta = { page };

    return {
        data,
        meta
    };
}

function findByUUID(uuid = 0) {
    const data = db.query(`SELECT * FROM puzzles WHERE uuid = ?`, uuid);
    const meta = { uuid };

    return {
        data,
        meta
    }
}

function validateCreate(puzzle) {
    let messages = [];
    console.log(puzzle);

    if (!puzzle) {
        messages.push('No object is provided');
    }

    if (!puzzle.grid) {
        messages.push('Grid is empty');
    }

    if (!puzzle.wordList) {
        messages.push('Word List is empty');
    }

    if (!puzzle.gridSize) {
        messages.push('Grid Size is empty');
    }

    if (messages.length) {
        let error = new Error(messages.join());
        error.statusCode = 400;

        throw error;
    }

}

function create(puzzleObj) {
    validateCreate(puzzleObj);
    const { grid, gridSize, wordList } = puzzleObj;
    //let wordList = puzzleObj.wordList;//.replace('\"', '\'');
    console.log(puzzleObj);
    let uuid = short.generate();
    //let uuid = crypto.randomUUID();
    const result = db.run('INSERT INTO puzzles (grid, gridSize, uuid, wordList) VALUES (@grid, @gridSize, @uuid, @wordList)', { grid, gridSize, uuid, wordList });

    let message = 'Error in creating puzzle';
    if (result.changes) {
        message = 'Puzzle created successfully';
    }

    return { message, uuid };
}



module.exports = {
    getMultiple,
    create,
    findByUUID
};