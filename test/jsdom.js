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
		let el;
		expect(
			el = chainedEl
				.set('style.position', 'absolute')
				.set('style.top', '0px')
				.set('style.left', '0px')
				.call('classList.add', 'red')
		).to.not.throw;

		expect(el.value().outerHTML).to.equal('<div style="position: absolute; top: 0px; left: 0px;" class="red"></div>');

	});

});
