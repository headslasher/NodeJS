var a = [3,1,2];

function b(v1, v2){
	console.log('c', v1, v2);
	return v1-v2;
}/*callback함수*/

a.sort(b);
console.log(a);

/* 익명함수
a.sort(
function (v1, v2){
	console.log('c', v1, v2);
	return v1-v2;	
});
*/
