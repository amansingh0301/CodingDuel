const request = require('request-promise');
const methods = require('../methods.js');

const getContest = (contestId) => {
    return new Promise((resolve,reject) => {
        request.get(`https://codeforces.com/contest/${contestId}`,
        {
            headers:{
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66"
                }
        })
        .then(res => {
            const totalQuestions = methods.getTotalQuestions(res);
            var questions = [];
            var acquired = 0;

            for(var i=0;i<totalQuestions;i++){
                const problemIndex = String.fromCharCode('A'.charCodeAt()+i);
                const problem = {
                    contestId:contestId,
                    index:problemIndex
                }
                methods.getBodyOfProblem(problem)
                    .then(Question => {
                        questions.push(Question);
                        //console.log(Question);
                        acquired++;
                        if(acquired == totalQuestions){
                            resolve(questions);
                        }
                    })
                    .catch(err => reject(err));
            }
        })
        .catch(err => {
            reject(err);
        })
    })
}

module.exports = {
    getContest
}