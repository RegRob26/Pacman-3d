import { Component } from '@angular/core';
import * as THREE from 'three';
import {Scene} from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls"

import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls"
import {group} from "@angular/animations";
import {cameraPosition} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
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

   detectarColisiones(pacman : any, laberinto : any) {
    // Crear un rayo que apunte en la dirección del movimiento de Pacman
    var rayo = new THREE.Raycaster(pacman.position, pacman.getWorldDirection());

    // Detectar colisiones entre el rayo y los muros
    var colisiones = rayo.intersectObjects(laberinto.children);

    // Si se detecta una colisión, entonces Pacman está chocando contra un muro
    if (colisiones.length > 0) {
      return true;
    } else {
      return false;
    }
  }


  onKeyDown(event:any, pacman : any,  controls : any, laberinto : any) {
    //console.log(this.detectarColisiones(pacman, laberinto))
    let speed = 0.2
    let Y_position = controls.camera.position.y
    console.log(controls.camera.position)

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
    console.log(controls.camera.position)
    pacman.position.copy(controls.getObject().position);
    pacman.rotation.copy(controls.getObject().rotation);
    console.log(pacman.position)
  }

  dibujarPacman(scene : any, camera : any){

// Crear la geometría del Pacman
    const pacmanGeometry = new THREE.SphereGeometry(0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.8);

// Crear el material del Pacman
    const pacmanMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });

// Crear la malla del Pacman
    const pacman = new THREE.Mesh(pacmanGeometry, pacmanMaterial);
// Añadir la malla del Pacman a la escena
    scene.add(pacman);

// Ajustar la posición y rotación del Pacman
    pacman.position.set(.5, 0.5, 1.5);
    //pacman.rotation.x = -1;
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
    let laberinto = new THREE.Group()
    // Recorrer la matriz y dibujar las paredes
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          var geometry = new THREE.BoxGeometry(1, 1, 1);
          var material = new THREE.MeshStandardMaterial({color: 0x0000ff, roughness : 0.3, metalness : 1});
          var wall = new THREE.Mesh(geometry, material);
          wall.position.x = j - matrix.length/2;
          wall.position.z = -i + matrix.length/2;
          wall.position.y = 0.5
          laberinto.add(wall)
        }
      }
    }
    scene.add(laberinto)
    return laberinto
  }

}
