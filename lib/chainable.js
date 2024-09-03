export class Chainable {
	/**
	* Source object to work on
	* @type {*}
	*/
	$source;


	/**
	* Call a method on the source object and return this chainable
	*
	* @param {String} method The source method to call
	* @param {*...} [args] Additional arguments to pass to the method
	*
	* @returns {Chainable} This chainable wrapper
	*/
	$method(method, ...args) {
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
	return new Chainable(source);
}
