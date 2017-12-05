class Utils{
	constructor(){
		this.autoIncrementGen = (function*(){
			let count = 0;
			while(count++ < Number.MAX_SAFE_INTEGER){
				yield count;
			}
		})();

		this.characters = ['A','a','B','b','C','c','D','d','E','e','F','f','G','g','H','h','I','i','J','j','K','k','L','l','M','m','N','n','O','o','P','p','Q','q','R','r','S','s','T','t','U','u','V','v','W','w','X','x','Y','y','Z','z','$'];
	}
	randomId(length=6){
		let result = '';
		for(let i = 0; i < length; ++i){
			result += this.characters[Math.floor(Math.random() * this.characters.length)];
		}
		return result;
	}
	/**
	 * Auto Increment generator
	 * @return {Number} An autoIncremented Number
	 */
	autoIncrement(){
		return this.autoIncrementGen.next().value;
	}
}
