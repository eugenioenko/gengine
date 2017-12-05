class Sound extends Component{
	constructor(params, engine){
		super(params, engine);
		this.context = '';
		this.sound = '';
		this.sounds = ['resources/sounds/sfx-stage-enter.wav', 'resources/sounds/sfx-state-leave.wav'];
		this.buffers = new BufferSounds({urls: this.sounds}); 
	}
	init(){
		
		this.getContext()

		this.buffers.init(); 
		/**
		 * llamado cuando el componente es agregado al motor
		 * Aqui se podrian precargar algunos sonidos default del motor
		 */
		this.resources = this.getComponent("Resources");
		// va al final del init, actualmente si esta activado modo Debug,
		// tira mensaje en console de que el componente fue cargado
		super.init();
	}
	move(){
		// se ejecuta cada ciclo del gameloop
		// podria estar vacio
	}
	draw(){
		// se ejecuta cada ciclo del gameloop
		// podria estar vacio
	}

	getContext(){
		  try {
		    window.AudioContext = window.AudioContext||window.webkitAudioContext||window.mozAudioContext||window.oAudioContext||window.msAudioContext;
		    this.context = new AudioContext();
		  } catch(e) {
		    alert('Este navegador no soporta la API de audio');
		  }
	}

	
	play(name){
		/*var electro;
		var getSound = new XMLHttpRequest();
		getSound.open("GET", "resources/sounds/sfx-stage-enter.wav", true);
		getSound.responseType = "arraybuffer";
		getSound.onload = function() {
		this.context.decodeAudioData(getSound.response, function(buffer){
			this.sound = buffer;
		});
		}
		getSound.send();

		var playSound = this.context.createBufferSource(); 
				playSound.buffer = this.sound; 
				playSound.connect(this.context.destination);  
				playSound.start(0); */

		
	}
	stop(name){

	}
	pause(name){

	}

	/**
	 * todo: cualquier cosa que se ocurra, sonidos podrian loopear, otros no.
	 * Musica de fondo seria un sonido?
	 */
}

/**
 * Metodo de testeo sin agregar al motor
 * el primer parametro es un object literal
 * que puede tener lo que sea que se necesite cuando se contruye
 */
// let sound = new Sound({}, null);
// ej2
// let sound = new Sound({algo: "algo"}, null);

/**
 * metodo de testeo en el motor
 * engine.addComponent("Sound", Sound, {params});
 *
 * luego desde cualquier sprite o componente
 * this.sound = this.getComponent("Sound"); //devuelve la instancia del motor de sonido del motor.
 */