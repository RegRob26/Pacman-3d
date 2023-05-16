import {Component} from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  constructor() {
  }

  ngOnInit() {
    let maze = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 2, 0, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]


    //const canvas = <HTMLCanvasElement>document.getElementById('miCanvas');
    const scene = new THREE.Scene();

    agregarLampara(scene, -30, 30, -10)
    agregarLampara(scene, 0, 30, 10)
    agregarLampara(scene, 0, 30, 0)
    agregarLampara(scene, 0, 0, 0)
    agregarLampara(scene, 30, 30, 30)


    scene.background = new THREE.Color(0x000000)

    //camera.lookAt(pacman);

    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth /
      window.innerHeight, 1, 1000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 0;
    //const controls = new OrbitControls(camera, canvas)
    //renderer.render(scene, camera);
    document.body.appendChild(renderer.domElement)


    mostrarGuias(scene)
    marcarCentro(scene)
    agregarPared(scene)

    let laberinto = dibujarLaberinto(maze, scene)
    let pacman = dibujarPacman(scene, camera, maze)
    let orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enableDamping = true
    orbitControls.minDistance = 5
    orbitControls.maxDistance = 100
    orbitControls.enablePan = false
    orbitControls.maxPolarAngle = Math.PI / 2 - 0.05
    orbitControls.update()
    let key: any


    function detectarColisiones(pacman: any, laberinto: any) {
      // Obtener la posición actual del pacman
      const posX = pacman.x;
      const posZ = pacman.z;
      console.log("posX: ", posX, "posZ: ", posZ, maze[posZ][posX])
      return maze[posZ][posX] === 1
    }


    function vistazo(key: any, pacman_origi: any, speed_ori: any, laberinto: any) {
      let speed = speed_ori + 0.025
      let pacman = pacman_origi.clone()

      // Si no hay colisión, procesar la tecla presionada
      switch (key) {
        case 87: // Tecla "w"
          pacman.position.x += speed;
          pacman.userData['direccionActual'] = 87
          break;
        case 83: // Tecla "s"
          pacman.rotation.y += Math.PI // Gira 180 grados a la izquierda
          pacman.position.x -= speed;
          pacman.userData['direccionActual'] = 83
          break;
        case 65: // Tecla "a"
          pacman.rotation.y += 1.5708 // Gira 90 grados a la izquierda
          pacman.userData['direccionActual'] = 65
          pacman.position.z -= speed;
          break;
        case 68: // Tecla "d"
          pacman.rotation.y -= 1.5708 // Gira 90 grados a la izquierda
          pacman.userData['direccionActual'] = 68
          pacman.position.z += speed;
          break;
      }

      if (detectarColisiones(pacman, laberinto)) {
        console.log('El movimiento no es seguro')
        return true
      } else {
        console.log('Movimiento seguro')
        return false
      }
    }


    function onKeyDown(event: any, pacman: any, laberinto: any) {
      //TODO arreglar los controles porque no detecta cuando no esta viendo hacia el lado en el que inicia, entonces
      // se desorientan los controles y gira para lados poco naturales
      let speed = 0.05;
      let posicionNueva;
      //let colision = detectarColisiones(pacman, laberinto);
      // Si no hay colisión, procesar la tecla presionada
      switch (event) {

        case 87: // Tecla "w"
          posicionNueva = new THREE.Vector3(Math.round(pacman.position.x + speed + 0.5),
            pacman.position.y,
            Math.round(pacman.position.z))
          if (detectarColisiones(posicionNueva, laberinto)) return;
          pacman.position.x += speed;
          pacman.userData['direccionActual'] = 87
          break

        case 83: // Tecla "s"
          posicionNueva = new THREE.Vector3(Math.round(pacman.position.x - speed - 0.5),
            pacman.position.y,
            Math.round(pacman.position.z))
          if (detectarColisiones(posicionNueva, laberinto)) return;

          pacman.position.x -= speed;
          pacman.userData['direccionActual'] = 83
          break;

        case 65: // Tecla "a"

          posicionNueva = new THREE.Vector3(Math.round(pacman.position.x),
            pacman.position.y,
            Math.round(pacman.position.z + speed - 0.5))
          if (detectarColisiones(posicionNueva, laberinto)) return;

          pacman.userData['direccionActual'] = 65
          pacman.position.z -= speed;
          break;

        case 68: // Tecla "d"

          posicionNueva = new THREE.Vector3(Math.round(pacman.position.x),
            pacman.position.y,
            Math.round(pacman.position.z + speed + 0.5))
          if (detectarColisiones(posicionNueva, laberinto)) return;

          pacman.userData['direccionActual'] = 68
          pacman.position.z += speed;
          break;
      }
    }

    function dibujarPacman(scene: any, camera: any, matrix: any) {
      const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({color: 0xff0000, roughness: 0.3, metalness: 1});
      let pacman = new THREE.Mesh(cubeGeometry, material);

      for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
          if (matrix[i][j] == 2) {
            pacman.position.x = j;
            pacman.position.z = i;
            pacman.position.y = 0.5
            console.log("Pacman: ", i, j, pacman.position.x, pacman.position.z)
            //pacman.position.set(j - matrix.length / 2, 0.5, -i + matrix.length);
          }
        }
      }

      pacman.userData['direccionActual'] = new THREE.Vector3(0, 0, 1)
//    pacman.geometry.computeBoundingBox();
      scene.add(pacman);
      return pacman
    }

    function agregarPared(scene: any) {
      // Cargar la textura de imagen del fondo
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load('../../assets/stars.jpg');
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

    function agregarLampara(scene: any, x: any, y: any, z: any) {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(x, y, z);
      scene.add(light);
    }

    function marcarCentro(scene: any) {
      const centerGeometry = new THREE.SphereGeometry(0.02, 16, 16);
      const centerMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
      const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
      centerMesh.position.set(0, 0, 0);
      scene.add(centerMesh);
    }

    function mostrarGuias(scene: any) {
      const axesHelper = new THREE.AxesHelper(20);
      scene.add(axesHelper);
      const gridHelper = new THREE.GridHelper(20, 100);
      gridHelper.position.set(0, 0, 0);
      //gridHelper.rotation.x = -Math.PI / 2;
      scene.add(gridHelper);
    }


    function dibujarLaberinto(matrix: any, scene: any) {
      let labyrinth = []
      // Recorrer la matriz y dibujar las paredes
      for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
          if (matrix[i][j] === 1) {
            var geometry = new THREE.BoxGeometry(1, 1, 1);
            geometry.computeBoundingBox();

            var material = new THREE.MeshStandardMaterial({color: 0x0000ff, roughness: 0.3, metalness: 1});
            var wall = new THREE.Mesh(geometry, material);

            wall.position.x = j;
            wall.position.z = i;
            wall.position.y = 0.5

            labyrinth.push(wall)
            scene.add(wall)
          }
        }
      }
      return labyrinth
    }

    function actualizarDireccionCamara(pacman: any, camera: any) {
      let distancia = 5
      let velocidad_cambio = 0.02
      let direccion = pacman.userData['direccionActual']
      switch (direccion) {
        case 87: // tecla 'w'
          camera.lookAt(pacman.position)
          if (camera.position.x > pacman.position.x - distancia)
            camera.position.x -= velocidad_cambio

          camera.position.y = pacman.position.y + distancia
          camera.position.z = pacman.position.z;
          break
        case 83:
          camera.lookAt(pacman.position)
          if (camera.position.x < pacman.position.x + distancia)
            camera.position.x += velocidad_cambio
          
          //camera.position.x = pacman.position.x + distancia
          camera.position.y = pacman.position.y + distancia
          camera.position.z = pacman.position.z;
          break
        case 65: // Tecla "a"
          camera.lookAt(pacman.position)
          if (camera.position.z < pacman.position.z + distancia)
            camera.position.z += velocidad_cambio

          camera.position.x = pacman.position.x
          camera.position.y = pacman.position.y + distancia
          break;
        case 68: // Tecla "d"
          camera.lookAt(pacman.position)
          if (camera.position.z > pacman.position.z - distancia)
            camera.position.z -= velocidad_cambio

          camera.position.x = pacman.position.x;
          camera.position.y = pacman.position.y + distancia
          break;

      }
    }

    function animate() {
      requestAnimationFrame(animate)
      //console.log(camera.position)
      // Actualiza la posición de la cámara en relación al objeto

      actualizarDireccionCamara(pacman, camera)
      // Hace que la cámara mire al objeto a seguir
      //camera.lookAt(pacman.position)
      onKeyDown(key, pacman, laberinto);
      renderer.render(scene, camera)
    }

    animate()
    window.addEventListener('keydown', (event: any) => {
      pacman.userData['direccionAnterior'] = key
      key = event.keyCode
      onKeyDown(key, pacman, laberinto)

    })

  }


}
