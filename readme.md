

##  Initial project Objective
Create a game engine based on micro components
As final objective, create a visual enviroment for creating 2d games

### Work in progress
>[demo here](https://eugenioenko.github.io/gengine/index.html)

There is no much comentary on the code yet



## Description
The engine has three basic classes
**GameObject**, **Component**, and **Sprites**.

#### GameObject
Its the base class of almost all object inside the engine.
It's main functionality is to generate an easy way to pass arguments when creating new instances.
It provides functionality to establish optional and necesary arguments. Those validation only ocurre during debug mode.

#### Component
They are mico modules singletons which are injected inside the engine.
The idea is to have every part of the engine as a Component: Display, Sound, Input, Scene, AI, etc...
Each component is added to the engine, the engine creates the instance, initialize the componend and makes it visible to
the rest of the components.

#### Time
Time is a component which contains:
* Counter of seconds since the game started
* Count of miliseconds it took do draw the last frame
* **deltaTime** is a inverse relative unit to fps. If the game runs at 60 fps, its 1. If its 30fps then 2. Used to make the movement be independent of frames

## Instalation

>npm install
>gulp


## Debug Mode
There is a Debug class to log in messages and throw errors.
* Debug.log
* Debug.warn
* Debug.error

Those method only function if debug mode is active, to activate it create a global variable and set it to true:

>window.GENGINE_DEBUG_MODE = true;


#### Tilemap uintarray16bit
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
