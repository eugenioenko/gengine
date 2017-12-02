class Sound extends Component{
	constructor(params, engine){
		super(params, engine);
		this.extra = 'extra algo';
	}
	init(){
		/**
		 * llamado cuando el componente es agregado al motor
		 * Aqui se podrian precargar algunos sonidos default del motor
		 */

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


	load(src){

	}
	play(name){

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