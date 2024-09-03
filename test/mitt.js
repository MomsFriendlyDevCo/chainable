import chainable from '../lib/chainable.js';
import {expect} from 'chai';
import mitt from 'mitt';

describe('chainable mitt', ()=> {

	let chainedMitt = chainable(mitt());

	it('wrapped mitt object', ()=> {
		expect(chainedMitt.on).to.be.a('function');
		expect(chainedMitt.off).to.be.a('function');
		expect(chainedMitt.emit).to.be.a('function');
	});

	it('run mitt emit session', ()=> {
		let emitted = false;

		chainedMitt
			.on('blarp', ()=> emitted = true)
			.emit('blarp')

		expect(emitted).to.be.ok;
	});

});
