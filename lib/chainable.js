export class Chainable {
	/**
	* Instance to return in method calls
	* This should be a pointer to the outer proxy wrapper and NOT the actual Chainable instance
	* @type {Proxy}
	*/
	$self;

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
		return this.$self;
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
		return this.$self;
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
				return (
					typeof prop == 'string' && prop.startsWith('$') ? chainable[prop] // Route all top level handlers to this class instance
					: prop in chainable.$source && typeof chainable.$source[prop] == 'function' ? chainable.$method.bind(chainable, prop)
					: typeof prop == 'string' &&  `\$${prop}` in chainable ? chainable[`\$${prop}`] // Non '$' prefixed functions
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
* We have to use a wrapper function to work around the fact that `Chainable.$self` needs setting and this can only be done after initalization
*
* @returns {Chainable} The chainable class instance from the source object
*/
export default function chainable(source) {
	let target = new Chainable(source).$proxy();
	target.$self = target;
	return target;
}
