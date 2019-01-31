var fs = require('fs');

//동기
console.log('데이터 로드 전');
var data = fs.readFileSync('read.txt',{encoding:'UTF8'});
console.log(data);
console.log('데이터 로드 후'+'\n');

//비동기
console.log('데이터 로드 전');
fs.readFile('read.txt', {encoding:'UTF8'}, function(err, data) {
	console.log('데이터 로드 중');
	console.log(data);
});
console.log('데이터 로드 후');