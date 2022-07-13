# Konva Demo

## Demo
You can checkout demo [here](https://webcat12345.github.io/konva-demo/)
## Project Details

#### Angular 5.2.0 + Angular-CLI + Konva.js

* [Angular](https://github.com/angular/angular)
* [Anugular-CLi](https://github.com/angular/angular-cli)
* [Konva.js](https://github.com/konvajs/konva)

``` 
@angular/cdk: 5.2.1
@angular/cli: 1.6.8
@angular/material: 5.2.1
@angular-devkit/build-optimizer: 0.0.42
@angular-devkit/core: 0.0.29
@angular-devkit/schematics: 0.0.52
@ngtools/json-schema: 1.1.0
@ngtools/webpack: 1.9.8
@schematics/angular: 0.1.17
typescript: 2.5.3
webpack: 3.10.0
```

## Requirements

https://blogs.mulesoft.com/wp-content/uploads/2011/08/Studio-screenshot.png

Setup a fresh Angular 5 app that user can just run by doing:

`npm install`

`npm run`

The app will start and provide a canvas and a object pallete. The pallette will
have different kinds of object that user can drag and drop to the canvas. The
user can then connect to an existing object and provide a direction for the
connection.  User can then group multiple objects into a group (just like in
the image).

Each of the object can have its own properties. So clicking on an object will
open a property editor where use can specify certain values to property keys.
This will need to be stored in localStorage or sessionStorage so clicking it
back again we can see existing values. For this task, you can choose any kind
of property to be attached to a component. If an object can have multiple
properties then it will be even better. This would also showcase how you would
build a complex property editor.

Constraints:

* You can only connect one object to maximum 3 objects.
* A group of object behaves as one single object when you try to connect it with
another component. E.g. component1 -> group1 -> component2. Now inside
group1, you can have components: foo -> bar -> baz. You cannot connect
component1 with foo, bar or baz. Nor you can connect them with component2.
* Moving around component/group will also correctly redraw the connection line
and setup the correct path to the object.

Deliverables

* Push your code to a github respoitory. It can be public.
* Provide docs on how to setup to run the app and code comments.
* One document on your algorithms and how code is structured.
* You can use any external libraries to complete this task.
* Use Angular 5 + any material design library
* Should be able to add 100s of objects with any performance degradation
