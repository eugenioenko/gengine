
##  Objetivo Incial del proyecto 
Crear un motor de juegos modular basado en micro componentes. (como un lego)
Como objetivo final, estaria bueno hacer una interface que permita generar juegos sencillos programando lo menos possible. Algo entre Unity* y GameMaker. (Unity entre comillas muuuuuuuy gordas.) 


#### Sorry
No hay nada comentado de momento, apenas una estructura.



## Descripcion

El motor tiene 2 clases clave.
**Component** y **Sprites**.

#### Sprites 
Son todos aquellos que se genera una instancia nueva cada vez que se agregan. Normalmente son los visibles en pantalla.

#### Component 
Son micromodulos de unica instancia que se inyectan en el motor.
La idea es tener como componentes Display, Sound, Diversos controladores de Jugadores y enemigos.
Cada componente que se agrega al motor, el motor crea la instancia, inicializa el componente y lo deja visible a todos los otros componentes y sprites mediante getComponent(name);

El golazo seria: ir creando distintos componentes y luego agregar los escenciales al motoro. El resto a gusto del usuario.



#### Time
Es un componente de tiempo, contiene:
* contador segundos desde que se inicio el juego
* segundos que tardo en dibujarse el ultimo frame
* **deltaTime** es una unidad relativa a los fps. Si el juego corre a 60 fps es 1. si corre a 30 es 2. Basicametne es para tener el movimiento en el juego independiente de los fps

#### Maths
Una clase con metodos estaticos matematicos que no estan dentro de Math de javascript.

#### Collisions
Una clase con metodos estaticos que chequea colisiones entre colliders.


#### Collision Tree
* Actualmente chequea las colisiones entre Todos los Sprites N^2 (estaria buenisimo pasar eso a quadtrees or spacial hashmaps o alguno de esos).
* Cada Sprite puede tener varios Colliders adentro.
* Actualmente se revise colision entre los rectangulos de 2 sprites y si hay colision, revisa a fondo cada collider del sprite contra cada collider del otro sprite.
* Si hay colision, ejecuta los metodos Sprite.collision(sprite2). Le pasa como parametro el sprite con el que se colisiono.



### Tilemap uintarray16bit
* El Tilemap contiene una clase Matrix adentro qu es un Uint16Array. Con un par de pruebas anda aprox 20% mas rapido que un array comun.
* El Tilemap solo dibuja los tiles que son visibles en la pantalla. Si el mapa es de 1000x1000 y  en la pantalla entran 20x20 tiles, dibujara 20x20.
* Tiene un par de metodos para facilitar saber a que tile corresponde una posicion X e Y.
* Falta componente pathfind.

#### Sprites
* Cada sprites tiene "infinito" numero de colliders.
* un collider es basicamente una caja que actua en el momento de colision.
* Hay colliders rectangulares y circulares.
* El motor dibuja todos los sprites en pantalla pero deberia de dibujar solo los visibles.


#### Display
El display es actualmente solo es Canvas, pero se podria extender luego a un display con WebGL.


### Pendientes e idas
* Motor Fisico
* Motor de Sonido
* Pathfind


# Instalacion

>npm install

luego 
>gulp

Gulp va a combinar todos los js en uno solo y de paso corre jshint por si se olvidan algun ";".
Si se agrega un script archivo de script nuevo, hay que agregarlo manualmente en el gulpfile.js.


# Importante
Nada esta escrito en piedra, todo es cambiable y la idea es divertirse y aprender en el camino. Ya se ha hecho 3 reescrituras estructuras clave. 
Se usta usando ECMA 2016/2017... lo ultimo que soporte chrome, para cuando avance bastante tal vez IE lo soporte tambien.


# [Ideas, Dudas, Sugerencias y Conversasion]: https://github.com/eugenioenko/gengine/projects/1
[aqui]: https://github.com/eugenioenko/gengine/projects/1