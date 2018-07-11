/* exported Utils */

class Utils {

	constructor() {

		let autoIncrementGen = (function*() {
			let count = 0;
			while(count++ < Number.MAX_SAFE_INTEGER) {
				yield count;
			}
		})();

		/**
		 * Auto Increment generator, starts with 1
		 * @return {number} An autoIncremented number
		 */
		this.autoIncrementId = function() {
			return autoIncrementGen.next().value;
		};

		this.characters = [
			'A','a','B','b','C','c','D','d','E','e','F','f','G','g','H','h','I','i',
			'J','j','K','k','L','l','M','m','N','n','O','o','P','p','Q','q','R','r',
			'S','s','T','t','U','u','V','v','W','w','X','x','Y','y','Z','z'
		];
	}

	randomId(length=6) {
		let result = '';
		for (let i = 0; i < length; ++i) {
			result += this.characters[Math.floor(Math.random() * this.characters.length)];
		}
		return result;
	}

}
