const {getAllProducts} = require('./firebase');

function levenshteinDistance(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 1; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            const indicator = a[j - 1] === b[i - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + indicator
            );
        }
    }

    return matrix[b.length][a.length];
}


async function checkSimilarity(word){
    const result = [];
    const list = await getAllProducts();
    for (let i = 0; i < list.length; i++) {
        const similarity = 1 - (levenshteinDistance(word, list[i].name) / Math.max(word.length, list[i].name.length));
        if(similarity > 0.75) {
            return list[i];
        }
    }
    return result;
}

module.exports = {
    checkSimilarity,
};
