const { compute_column } = require('../utils/helpers');

testcases = [0, 1, 6, 26, 27, 52, 53, 676, 677, 103, 104, 105];

testcases.forEach(num => {
  var letter = compute_column(num);
  console.log(`${num}:\t${letter}`);
});

for(var i=0; i < 100; i++) {
  console.log(`${i}:\t${compute_column(i)}`);
}