export class Chainable {
	/**
	* Source object to work on
	* @type {*}
	*/
	$source;


	/**
	* Settings for how chainable should function
	*
	* @type {Object}
	*/
	settings = {
		proxyMethods: true,
	};


	/**
	* Call a method on the source object and return this chainable
	*
	* @param {String} method The source method to call
	* @param {*...} [args] Additional arguments to pass to the method
	*
	* @returns {Chainable} This chainable wrapper
	*/
	$method(method, ...args) {
		console.log('$METHOD', method);
		this.$source[method](...args);
		return this;
	}


	/**
	* Set one or more properties within a source object
	*
	* @param {String|Object} key Either a single key to set as a string OR an object to assign
	* @param {*} [val] If passing a string key, specify the value to set
	*
	* @returns {Chainable} This chainable wrapper
	*/
	$set(key, val) {
		if (typeof key == 'string') {
			this.$source[key] = val;
		} else if (typeof key == 'object') {
			Object.assign(this.$source, key);
		} else {
			throw new Error('Unknown $set type - need a string/object');
		}
		return this;
	}



	/**
	* Return the source object
	*
	* @returns {*} The source object
	*/
	$value() {
		return this.$source;
	}


	/**
	* Proxy wrapper for the chainable object
	* This method glues dynamic method calls to the source object
	*/
	$proxy() {
		let chainable = this;
		return new Proxy(chainable, {
			get(target, prop) {
				console.log('ASK PROP', prop);
				return (
					prop.startsWith('$') ? chainable[prop] // Route all top level handlers to this class instance
					// : prop in chainable && typeof chainable[prop] == 'function' ? chainable[prop]
					: prop in chainable.$source && typeof chainable.$source[prop] == 'function' ? chainable.$method.bind(chainable, prop)
					: undefined
				);
			},
		});
	}


	/**
	* Create a new chainable instance, setting the source
	* @param {*} source The source object to set
	*/
	constructor(source) {
		this.$source = source;
	}
}


/**
* Chainable worker function
* Any content passed will be wrapped in a Chainable class instance
*
* @returns {Chainable} The chainable class instance from the source object
*/
export default function chainable(source) {
	return new Chainable(source).$proxy();
}
