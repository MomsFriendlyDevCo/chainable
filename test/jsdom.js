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


	it('DOM class manipulation', ()=> {
		expect(
			chainedEl
				.set('style.position', 'absolute')
				.set('style.top', '0px')
				.set('style.left', '0px')
				.tap(c => c.$source.classList.add('red'))
		).to.not.throw;
	});

});
