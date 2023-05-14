import { Component } from '@angular/core';
import * as THREE from 'three';
import {Scene} from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls"

import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls"
import {group} from "@angular/animations";
import {cameraPosition, label, log} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import {OBB} from "three/examples/jsm/math/OBB";
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  constructor() {
  }

  ngOnInit() {
    let maze =
      [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      ];

    //const canvas = <HTMLCanvasElement>document.getElementById('miCanvas');
    const scene = new THREE.Scene();

    this.agregarLampara(scene, -10, 10, -10)
    this.agregarLampara(scene, 0, 10, 10)


    scene.background = new THREE.Color(0x000000)

    //camera.lookAt(pacman);

    var renderer = new THREE.WebGLRenderer({antialias : true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth /
      window.innerHeight, 1, 1000);
    camera.position.x = .5;
    camera.position.y = .5;
    camera.position.z = 1.5;
    //const controls = new OrbitControls(camera, canvas)
    //renderer.render(scene, camera);
  document.body.appendChild(renderer.domElement)





    this.mostrarGuias(scene)
    this.marcarCentro(scene)
    this.agregarPared(scene)
    let laberinto = this.dibujarLaberinto(maze, scene)
    let pacman = this.dibujarPacman(scene, camera)
    //const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  //  camera.position.set(pacman.position.x, pacman.position.y, pacman.position.z);
//    camera.rotation.set(pacman.rotation.x, pacman.rotation.y, pacman.rotation.z);




    let controls = new PointerLockControls(camera, renderer.domElement)

    let clock = new THREE.Clock()

    let btn1 = document.querySelector("#but1")

    btn1?.addEventListener('click', ()=>{
      controls.lock()
    })
    function animate()
    {
      requestAnimationFrame(animate)
      //console.log(camera.position)

      renderer.render(scene, camera)
    }
    animate()

    window.addEventListener('keydown',  (event : any) => {
      this.onKeyDown(event, pacman, controls, laberinto)
    })


  }

   detectarColisiones(pacman  : any, laberinto : any) {

// Crear una caja delimitadora para pacman
     let pacmanBB = new THREE.Box3().setFromObject(pacman);

     // Iterar sobre todos los objetos del laberinto
     for (let i = 0; i < laberinto.length; i++) {
       let object = laberinto[i];

       // Crear una caja delimitadora para el objeto actual
       let objectBB = new THREE.Box3().setFromObject(object);

       // Comprobar si hay una colisión entre las cajas delimitadoras
       let collision = pacmanBB.intersectsBox(objectBB);

       // Si hay una colisión, imprimir un mensaje en la consola
       if (collision) {
         console.log("Colisión detectada con objeto ", i);
         return collision
       }

     }
      return false
   }


  onKeyDown(event:any, pacman : any,  controls : any, laberinto : any) {
    //console.log(this.detectarColisiones(pacman, laberinto))
    let colision = this.detectarColisiones(pacman, laberinto)
    let speed = 0.2
    let Y_position = controls.camera.position.y

    if (!colision){
      switch (event.keyCode) {
        case 87: // Tecla "w"
          controls.moveForward(speed);
          break;
        case 83: // Tecla "s"
          controls.moveForward(-speed);
          break;
        case 65: // Tecla "a"
          controls.getObject().rotation.y += Math.PI / 2; // Girar hacia la izquierda
          break;
        case 68: // Tecla "d"
          controls.getObject().rotation.y -= Math.PI / 2; // Girar hacia la derecha
          break;
      }
    }
    pacman.position.copy(controls.getObject().position);
    pacman.rotation.copy(controls.getObject().rotation);
  }

  dibujarPacman(scene : any, camera : any){
    const cubeGeometry = new THREE.BoxGeometry(.5, .5, .5);
    const material = new THREE.MeshStandardMaterial({color: 0xff0000, roughness : 0.3, metalness : 1});
    let pacman = new THREE.Mesh(cubeGeometry, material);
    pacman.position.set(0, 25, 0);



    scene.add(pacman);

    return pacman
  }

  agregarPared(scene : any){
    // Cargar la textura de imagen del fondo
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('../../assets/stars.jpg');
    console.log(texture)
// Crear la geometría de la caja del fondo
    const geometry = new THREE.BoxGeometry(40, 40, 40);

// Crear el material del fondo
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide // Esto asegura que el fondo siempre se muestre detrás de los demás objetos
    });
    const mesh = new THREE.Mesh(geometry, material);



    scene.add(mesh)
  }
  agregarLampara(scene : any, x : any, y : any, z : any){
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    scene.add(light);
  }
  marcarCentro(scene : any){
    const centerGeometry = new THREE.SphereGeometry(0.02, 16, 16);
    const centerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
    centerMesh.position.set(0, 0, 0);
    scene.add(centerMesh);
  }
  mostrarGuias(scene : any){
    const axesHelper = new THREE.AxesHelper( 20 );
    scene.add( axesHelper );
    const gridHelper = new THREE.GridHelper( 20, 100 );
    gridHelper.position.set(0, 0, 0);
    //gridHelper.rotation.x = -Math.PI / 2;
    scene.add(gridHelper);
  }




  dibujarLaberinto(matrix : any, scene : any){
    let labyrinth = []
    // Recorrer la matriz y dibujar las paredes
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          var geometry = new THREE.BoxGeometry(1, 1, 1);
          var material = new THREE.MeshStandardMaterial({color: 0x0000ff, roughness : 0.3, metalness : 1});
          var wall = new THREE.Mesh(geometry, material);
          wall.scale.set(1, 1, 1); // ajustar la escala de la pared

          wall.position.x = j - matrix.length/2;
          wall.position.z = -i + matrix.length/2;
          wall.position.y = 0.5

          labyrinth.push(wall)
          scene.add(wall)
        }
      }
    }

    return labyrinth
  }

}
