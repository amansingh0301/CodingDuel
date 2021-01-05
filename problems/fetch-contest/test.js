const contest = require('./contest.js');
contest.getContest('1472')
.then(questions => {
    console.log(questions);
})
.catch(err => {
    console.log(err);
})