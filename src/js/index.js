import tt from './includes/test.js';

var app = {
	init : ()=>{
		const t = [
			{ name : 'Jay', age : 12 }
		];

		console.log( t.find( i => i.age == 12 ) );
	}
}

app.init();