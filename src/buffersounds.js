class BufferSounds extends GameObject {

  constructor(params) {
    super(params);
    this.buffer = [];
  }
  __params__(){
    return ['urls'];
  }
  init(){
      super.init();
      this.getContext();
      var that = this;

      for(let url of this.urls){
        that.load(url);
      }

  }

  load(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    var that = this;

    request.onload = function() {
      that.context.decodeAudioData(request.response, function(buffer) {

        that.buffer.push(buffer);
      }, that.error);
    };
    request.send();
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
    Debug.error('BufferSounds: '+error);
  }

  getSoundByIndex(index) {
    return this.buffer[index];
  }

}