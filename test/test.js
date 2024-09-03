import chain from '../lib/chainable.js';
import {expect} from 'chai';

describe('example chainables', ()=> {
	let obj = {
		a() { return 'a!' },
		setV(newV) { obj.v = newV },
		v: 1,
		z: 1,
	};
	let chained = chain(obj);

	it('wrap source object', ()=> {
		// expect(chained).to.be.an('object');
		expect(chained).to.have.property('$method');
		expect(chained.$method).to.be.a('function');

		expect(chained).to.have.property('$source');
		expect(chained.$source).to.be.an('object');
	});

	it('call pure chainable methods', ()=> {
		expect(chained.$method('a')).to.equal(chained);
	});

	it('call mutating chainable methods', ()=> {
		expect(chained.$method('setV', 2)).to.equal(chained);
		expect(chained.$source.v).to.equal(2);
		expect(chained.$value().v).to.equal(2);
	});

	it('use setters', ()=> {
		expect(chained.$set('v', 3)).to.equal(chained);
		expect(chained.$source.v).to.equal(3);
		expect(chained.$value().v).to.equal(3);

		expect(chained.$set({v: 4, z: 2})).to.equal(chained);
		expect(chained.$source.v).to.equal(4);
		expect(chained.$value().v).to.equal(4);
		expect(chained.$source.z).to.equal(2);
		expect(chained.$value().z).to.equal(2);
	});

	it('dynamicly proxy methods', ()=> {
		expect(chained.a).to.be.a('function');
		expect(chained.a()).to.not.throw;

		expect(chained
			.setV(5)
			.$value()
		).to.have.property('v', 5);
	});

});
