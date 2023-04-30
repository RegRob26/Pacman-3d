import { Component } from '@angular/core';
import * as THREE from 'three';
import {Scene} from 'three';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  constructor() {
  }
  ngOnInit(){
    const canvas = <HTMLCanvasElement>document.getElementById('miCanvas');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000)
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth /
      window.innerHeight, 0.1, 20);
    camera.position.z = 3;
    const renderer = new THREE.WebGLRenderer({ canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);


    this.mostrarGuias(scene)
    this.marcarCentro(scene)
    let prueba = this.algoritmoLaberinto(10, 10)
    console.log(prueba)
    renderer.render(scene, camera);


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
    gridHelper.rotation.x = -Math.PI / 2;
    scene.add(gridHelper);
  }

  algoritmoLaberinto(n : any, m : any){
    let matrix = this.creaMatriz(n, m)
    const celdasVisitadas = new Set();
    let celdaInicial = {row: n/2, col: m/2}
    celdasVisitadas.add(celdaInicial);

    let vecinos = this.crearFronteras(celdaInicial)
    return vecinos

  }
  crearFronteras(inicial : any){
    let row = inicial['row']
    let col = inicial['col']
    const fronteras = new Set();

    const vecinos = [
      {row: row - 1, col: col}, //arriba
      {row: row + 1, col: col}, //abajo
      {row: row, col: col - 1}, //izquierda
      {row: row, col: col + 1} //derecha
    ]

    for (const vecino of vecinos) {
      fronteras.add(vecino);
    }

    return vecinos
  }

  creaMatriz(n : any, m : any){
    let matrix: number[][] = [];

    for (let i = 0; i < n; i++) {
      matrix[i] = [];
      for (let j = 0; j < m; j++) {8
        matrix[i][j] = 0;
      }
    }
    return matrix
  }

}
