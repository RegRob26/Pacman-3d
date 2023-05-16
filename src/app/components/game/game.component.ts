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

    type MazeElement = {
      valor: number;
      objeto: any; // Replace 'any' with the appropriate type for the objects in the maze
    };

    let mazeObject: MazeElement[][] = []; // Define the type for 'maze' as an array of 'MazeElement'


    let pacman: any
    let puntos: number = 0;
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
    let orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enableDamping = true
    orbitControls.minDistance = 5
    orbitControls.maxDistance = 100
    orbitControls.enablePan = false
    orbitControls.maxPolarAngle = Math.PI / 2 - 0.05
    orbitControls.update()
    let key: any


    function detectarColisionBarrera(pacman: any, laberinto: any) {
      // Obtener la posición actual del pacman
      const posX = pacman.x;
      const posZ = pacman.z;
      console.log("posX: ", posX, "posZ: ", posZ, maze[posZ][posX])

      return maze[posZ][posX] === 1
    }

    function actualizarContador() {
      let contador = document.getElementById("contador")
      if (contador !== null) {
        contador.innerHTML = "Puntos: " + puntos
        // Aplica un tamaño de fuente mayor al elemento
        contador.style.fontSize = "30px";
      }

    }

    function detectarColisionPunto(pacman: any) {
      // Obtener la posición actual del pacman

      const pacmanPosicion = new THREE.Vector3(
        Math.round(pacman.position.x),
        pacman.position.y,
        Math.round(pacman.position.z)
      );
      let arreglo = mazeObject[pacmanPosicion.z][pacmanPosicion.x].objeto

      if (maze[pacmanPosicion.z][pacmanPosicion.x] === 0) {
        maze[pacmanPosicion.z][pacmanPosicion.x] = -1
        scene.remove(arreglo)
        mazeObject[pacmanPosicion.z][pacmanPosicion.x].objeto = -1
        mazeObject[pacmanPosicion.z][pacmanPosicion.x].valor = -1
        puntos++
        console.log("punto ganado", maze)
      }
    }

    /**
     * @deprecated
     */
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

      if (detectarColisionBarrera(pacman, laberinto)) {
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
      let pacmanRadio = 0.5
      // Si no hay colisión, procesar la tecla presionada
      switch (event) {

        case 87: // Tecla "w"
          posicionNueva = new THREE.Vector3(Math.round(pacman.position.x + speed + pacmanRadio),
            pacman.position.y,
            Math.round(pacman.position.z))
          if (detectarColisionBarrera(posicionNueva, laberinto)) return;
          pacman.position.x += speed;
          pacman.userData['direccionActual'] = 87
          break

        case 83: // Tecla "s"
          posicionNueva = new THREE.Vector3(Math.round(pacman.position.x - speed - pacmanRadio),
            pacman.position.y,
            Math.round(pacman.position.z))
          if (detectarColisionBarrera(posicionNueva, laberinto)) return;

          pacman.position.x -= speed;
          pacman.userData['direccionActual'] = 83
          break;

        case 65: // Tecla "a"

          posicionNueva = new THREE.Vector3(Math.round(pacman.position.x),
            pacman.position.y,
            Math.round(pacman.position.z + speed - pacmanRadio))
          if (detectarColisionBarrera(posicionNueva, laberinto)) return;

          pacman.userData['direccionActual'] = 65
          pacman.position.z -= speed;
          break;

        case 68: // Tecla "d"

          posicionNueva = new THREE.Vector3(Math.round(pacman.position.x),
            pacman.position.y,
            Math.round(pacman.position.z + speed + pacmanRadio))
          if (detectarColisionBarrera(posicionNueva, laberinto)) return;

          pacman.userData['direccionActual'] = 68
          pacman.position.z += speed;
          break;

      }

    }

    function agregarPared(scene: any) {
      // Cargar la textura de imagen del fondo
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load('../../assets/137910.jpg');
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

    function actualizarPuntos(scene: any) {
      for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
          if (maze[i][j] === 0) {
            dibujarPuntos(scene, j, 0.5, i)
          }
        }
      }
    }

    function dibujarPuntos(scene: any, x: any, y: any, z: any) {
      const esferaGeometria = new THREE.SphereGeometry(0.1, 64, 64)
      const material = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.3, metalness: 1});
      let punto = new THREE.Mesh(esferaGeometria, material);

      punto.position.x = x
      punto.position.z = z
      punto.position.y = y

      scene.add(punto);
      return punto
    }


    function dibujarPacman(scene: any, x: any, y: any, z: any) {
      const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshStandardMaterial({color: 0xff0000, roughness: 0.3, metalness: 1});
      let pacman = new THREE.Mesh(cubeGeometry, material);

      pacman.position.x = x
      pacman.position.z = z
      pacman.position.y = y

      pacman.userData['direccionActual'] = 87

      scene.add(pacman);
      return pacman
    }

    function dibujarLaberinto(matrix: any, scene: any) {
      let labyrinth = []
      // Recorrer la matriz y dibujar las paredes
      for (let i = 0; i < matrix.length; i++) {
        mazeObject[i] = []
        for (let j = 0; j < matrix[i].length; j++) {
          if (matrix[i][j] === 1) {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            geometry.computeBoundingBox();

            const material = new THREE.MeshStandardMaterial({color: 0x0000ff, roughness: 0.3, metalness: 1});
            const wall = new THREE.Mesh(geometry, material);

            wall.position.x = j;
            wall.position.z = i;
            wall.position.y = 0.5

            mazeObject[i][j] = {
              valor: matrix[i][j],
              objeto: wall
            };
            labyrinth.push(wall)
            scene.add(wall)
          }
          if (matrix[i][j] === 2) {
            pacman = dibujarPacman(scene, j, 0.5, i)
            mazeObject[i][j] = {
              valor: matrix[i][j],
              objeto: pacman
            };
          }
          if (matrix[i][j] === 0) {
            const punto = dibujarPuntos(scene, j, 0.5, i)
            mazeObject[i][j] = {
              valor: matrix[i][j],
              objeto: punto
            };

          }
        }
      }
      return labyrinth
    }


    function actualizarDireccionCamara(pacman: any, camera: any) {
      let distancia = 5
      let direccion = pacman.userData['direccionActual']
      switch (direccion) {
        case 87: // tecla 'w'
          camera.position.x = pacman.position.x - distancia
          camera.position.y = pacman.position.y + distancia
          camera.position.z = pacman.position.z;
          break
        case 83:
          camera.position.x = pacman.position.x + distancia
          camera.position.y = pacman.position.y + distancia
          camera.position.z = pacman.position.z;
          break
        case 65: // Tecla "a"
          camera.position.x = pacman.position.x
          camera.position.y = pacman.position.y + distancia
          camera.position.z = pacman.position.z + distancia
          break;
        case 68: // Tecla "d"
          camera.position.x = pacman.position.x;
          camera.position.y = pacman.position.y + distancia
          camera.position.z = pacman.position.z - distancia
          break;

      }
    }

    function animate() {
      requestAnimationFrame(animate)
      //console.log(camera.position)
      // Actualiza la posición de la cámara en relación al objeto

      actualizarDireccionCamara(pacman, camera)
      // Hace que la cámara mire al objeto a seguir
      camera.lookAt(pacman.position)
      onKeyDown(key, pacman, laberinto)
      detectarColisionPunto(pacman)
      actualizarContador()
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
