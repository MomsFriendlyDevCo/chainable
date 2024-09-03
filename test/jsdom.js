import chainable from '../lib/chainable.js';
import {expect} from 'chai';
import {JSDOM} from 'jsdom';

describe('chainable DOM', ()=> {

	// Make a fake browser document analogue
	const {document, Event} = (new JSDOM(`...`)).window;

	let chainedEl = chainable(document.createElement('div'));

	it('DOM object', ()=> {
		expect(chainedEl.addEventListener).to.be.a('function');
	});

	it('DOM object events', ()=> {
		let clicked = false;

		chainedEl
			.addEventListener('click', ()=> clicked = true)
			.dispatchEvent(new Event('click'))

		expect(clicked).to.be.ok;
	});


	it.skip('DOM class manipulation', ()=> {
		chainedEl
			.$tap(c => c.classList.add('red'))

		expect(chainedEl.value().classList.has('red')).to.be.ok;
	});

});
