export function checkLineType(x1, y1, x2, y2) {
    // Calculate the differences in x and y coordinates
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);

    // Check if the line is vertical, horizontal, or diagonal
    if (dx === 0) {
        // Vertical line
        return true;
    } else if (dy === 0) {
        // Horizontal line
        return true;
    } else if (dx === dy) {
        // Diagonal line
        return true;
    } else {
        // Neither vertical, horizontal, nor diagonal
        return false;
    }
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getLongestWord(words) {
    if (words.length === 0) {
        return null; // Return null for an empty array
    }

    let longestLength = 0;

    for (const str of words) {
        if (str.length > longestLength) {
            longestLength = str.length;
        }
    }

    return longestLength;
}


export function getRandomLetter() {
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
}


export function bresenham(x1, x2, y1, y2) {

    let points = [];
    if (x1 !== null && x2 !== null && y1 !== null && x2 !== null) {
        x1 = parseInt(x1);
        x2 = parseInt(x2);
        y1 = parseInt(y1);
        y2 = parseInt(y2);
        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);
        let sx = x1 < x2 ? 1 : -1;
        let sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;

        //points.push(this.state.grid[x1][y1]);

        while (true) {
            // Plot the point (x, y)
            //points.push(this.state.grid[x1][y1]);
            points.push({ x1, y1 });

            if (x1 === x2 && y1 === y2) break;

            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
        }
    }
    return points;

}


