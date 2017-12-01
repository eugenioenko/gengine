
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
* Actualmente chequea las colisiones entre Todos los Sprites N^2.
* Cada Sprite puede tener varios Colliders adentro.
* Actualmente se revise colision entre los rectangulos de 2 sprites y si hay colision, revisa a fondo cada collider del sprite contra cada collider del otro sprite.
* Si hay colision, ejecuta los metodos Sprite.collision(sprite2). Le pasa como parametro el sprite con el que se colisiono.



### Tilemap uintarray16bit
* El Tilemap contiene una clase Matrix adentro qu es un Uint16Array. Con un par de pruebas anda aprox 20% mas rapido que un array comun.
* El Tilemap solo dibuja los tiles que son visibles en la pantalla. Si el mapa es de 1000x1000 y  en la pantalla entran 20x20 tiles, dibujara 20x20.
* Tiene un par de metodos para facilitar saber a que tile corresponde una posicion X e Y.
# Falta componente pathfind.

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



