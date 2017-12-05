class BufferSounds extends GameObject {

  constructor(params) { 
    super(params); 
    this.context;
    this.buffer = [];
  }
  __params__(){
    return ['urls'];
  }
  init(){
      this.getContext();

      super.init();
      for(let url of this.urls){
        this.context.decodeAudioData(url, this.loaded.bind(this), this.error);
      }
    
  }

  getContext(){
      try {
        window.AudioContext = window.AudioContext||window.webkitAudioContext||window.mozAudioContext||window.oAudioContext||window.msAudioContext;
        this.context = new AudioContext();
      } catch(e) {
        alert('Este navegador no soporta la API de audio');
      }
  }

  error(error){
    console.log(error);
  }

  loaded(buffer) {
    this.buffer.push(buffer);
  }

  getSoundByIndex(index) {
    return this.buffer[index];
  }

  play(){
    var source =  this.context.createBufferSource();
    source.buffer = this.buffer;
    source.connect( this.context.destination);
    source.start(0);
  }
}