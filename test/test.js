import chainable from '../lib/chainable.js';
import {expect} from 'chai';

describe('example chainables', ()=> {
	let obj = {
		a() { return 'a!' },
		setV(newV) { obj.v = newV },
		x: {
			xx: 1,
		},
		v: 1,
		z: 1,
	};
	let chained = chainable(obj);


	it('wrap source object', ()=> {
		expect(chained).to.have.property('$call');
		expect(chained.$call).to.be.a('function');

		expect(chained).to.have.property('$source');
		expect(chained.$source).to.be.an('object');
	});


	it('call pure chainable methods', ()=> {
		expect(chained.$call('a')).to.equal(chained);
	});


	it('call mutating chainable methods', ()=> {
		expect(chained.$call('setV', 2)).to.equal(chained);
		expect(chained.$source.v).to.equal(2);
		expect(chained.$value().v).to.equal(2);
	});

	it('use getters', ()=> {
		expect(chained.$get('v')).to.equal(2);
		expect(chained.$get('x.xx')).to.equal(1);
		expect(chained.$get(['x', 'xx'])).to.equal(1);
	})


	it('use simple getters/setters', ()=> {
		expect(chained.$set('v', 3)).to.equal(chained);
		expect(chained.$source.v).to.equal(3);
		expect(chained.$value().v).to.equal(3);
		expect(chained.$get('v')).to.equal(3);

		expect(chained.$set({v: 4, z: 2})).to.equal(chained);
		expect(chained.$source.v).to.equal(4);
		expect(chained.$value().v).to.equal(4);
		expect(chained.$get('v')).to.equal(4);
		expect(chained.$source.z).to.equal(2);
		expect(chained.$value().z).to.equal(2);
		expect(chained.$get('z')).to.equal(2);
	});


	it('use nested setters', ()=> {
		expect(chained.$set('x.xx', 2));
		expect(chained.$source.x.xx).to.equal(2);
		expect(chained.$value().x.xx).to.equal(2);

		expect(chained.$set(['x', 'xx'], 3));
		expect(chained.$source.x.xx).to.equal(3);
		expect(chained.$value().x.xx).to.equal(3);

		expect(chained.$set('x.y.z', 1));
		expect(chained.$source.x.y.z).to.equal(1);
		expect(chained.$value().x.y.z).to.equal(1);
	});


	it('proxy methods', ()=> {
		expect(chained.a).to.be.a('function');
		expect(chained.a()).to.not.throw;

		expect(chained
			.setV(5)
			.$value()
		).to.have.property('v', 5);
	});


	it('dynamically proxy new methods', ()=> {
		chained.$set({
			setZ(newZ) { // Glue new method to source
				this.z = newZ;
			},
		});

		expect(chained
			.setZ(3)
			.$value()
		).to.have.property('z', 3);
	});


	it('access methods without dollar prefix', ()=> {
		expect(chained
			.setV(6)
			.value()
		).to.have.property('v', 6);
	});


	it('use tap', ()=> {
		let tapped = false;

		expect(chained
			.tap(v => {
				tapped = true;
				return null;
			})
		).to.not.throw;

		expect(tapped).to.be.ok;
	});

	it('use thru', ()=> {
		let thruCalled = false;

		expect(chained
			.thru(v => {
				thruCalled = true;
				return {c: 1};
			})
			.value()
		).to.be.deep.equal({c: 1});

		expect(thruCalled).to.be.ok;
	});

});
