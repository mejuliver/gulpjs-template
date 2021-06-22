import tt from './includes/test.js';
import $ from 'jquery';
window.$ = $;
window.jQuery = $;

var app = {
	init : ()=>{
		const t = [
			{ name : 'Jay', age : 12 }
		];

		console.log( t.find( i => i.age == 12 ) );

		tt();
	}
}

app.init();