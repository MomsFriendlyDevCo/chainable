/**
* Chainable instance class
* Note that to get the method proxying functionality `$proxy` needs to be called
*/
export class Chainable {

	/**
	* Instance to return in method calls
	* This should be a pointer to the outer Proxy wrapper and NOT the actual Chainable instance
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
	$call(method, ...args) {
		this.$source[method].call(this.$source, ...args);
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
		if (
			typeof key == 'string'  && /\./.test(key)
			|| Array.isArray(key)
		) { // Nested key set
			let subject = this.$source;
			(typeof key == 'string' ? key.split('.') : key)
				.forEach((segment, segmentIndex, segments) => {
					if (segmentIndex == segments.length - 1) { // Is leaf node
						subject[segment] = val;
					} else { // Is branch node
						if (!subject[segment]) subject[segment] = {}; // Create non-existant nodes
						subject = subject[segment];
					}
				});
		} else if (typeof key == 'string') { // Simple key set
			this.$source[key] = val;
		} else if (typeof key == 'object') {
			Object.assign(this.$source, key);
		} else {
			throw new Error('$set needs string/object');
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
	*
	* @returns {Proxy} A proxied object which can dynamically route methods
	*/
	$proxy() {
		let chainable = this;
		return new Proxy(chainable, {
			get(target, prop) {
				return (
					typeof prop == 'string' && prop.startsWith('$') ? chainable[prop] // Route all top level handlers to this class instance
					: prop in chainable.$source && typeof chainable.$source[prop] == 'function' ? chainable.$call.bind(chainable, prop)
					: typeof prop == 'string' &&  `\$${prop}` in chainable ? chainable[`\$${prop}`] // Non '$' prefixed functions
					: null
				);
			},
		});
	}


	/**
	* Run a callback function on the current instance, ignoring the return value
	*
	* @param {Function} cb A callback to run
	*
	* @returns {Chainable} This chainable wrapper
	*/
	$tap(cb) {
		cb(this);
		return this.$self;
	}


	/**
	* Run a callback function on the current instance, replacing the source with the result
	*
	* @param {Function} cb A callback to run, the result of this function replaces `$source`
	*
	* @returns {Chainable} This chainable wrapper
	*/
	$thru(cb) {
		this.$source = cb(this);
		return this.$self;
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
* @param {*} source Source / target object to use for the chainable instance
*
* @returns {Chainable} The chainable class instance from the source object
*/
export default function chainable(source) {
	let target = new Chainable(source).$proxy();
	return target.$self = target;
}
