
import * as Three from '../../build/three.module.js';

// 화면을 조작할 수 있는 OrbitControls를 가져옵니다.
import { OrbitControls } from 'https://esm.sh/three@0.157.0/examples/jsm/controls/OrbitControls.js';

class App{
    constructor() {

        const divContainer = document.getElementById('webgl-container');
        this._divContainer = divContainer;

        
        const renderer = new Three.WebGLRenderer({ antialias: true });
        
        renderer.setPixelRatio(window.devicePixelRatio);

        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;
        
        const scene = new Three.Scene();
        this._scene = scene;

        this._setupCamera(); 
        this._setupLight(); 
        this._setupModel(); 
        this._setUpControls();

        
        window.onresize = this.resize.bind(this);
        this.resize();

        
        requestAnimationFrame(this.render.bind(this));
    }

    _setUpControls() {
        new OrbitControls(this._camera, this._divContainer);
    }
    
    _setupCamera() {
        const width = this._divContainer.clientWidth; 
        const height = this._divContainer.clientHeight; 

        const camera = new Three.PerspectiveCamera(75, width / height, 0.1, 100); 
        camera.position.z = 7; 
        this._camera = camera; 
    }

    
    _setupLight() {
        const color = 0xffffff; 
        const intensity = 2; 
        const light = new Three.DirectionalLight(color, intensity); 
        light.position.set(-1, 2, 4); 
        this._scene.add(light); 
    }

    // 하트모양
    _setupModelHeart() {
        const vertices = [];
        for (let i = 0; i < 10000; i++) {
            // Math.randomFloatSpread(5): -2.5에서 2.5 사이의 랜덤한 값을 생성
            // 이 부분에서 오류가 발생할 수 있습니다.
            // Three.js r0.125.0 이후 더이상 지원되지않고 Three.MathUtils.randomFloatSpread()로 변경되었습니다.
            // 05-material.js:56 Uncaught TypeError: Cannot read properties of undefined (reading 'randomFloatSpread') at App._setupModel (05-material.js:56:34)at new App (05-material.js:24:14)at window.onload (05-material.js:101:5)
            const x = Three.MathUtils.randFloatSpread(5);
            const y = Three.MathUtils.randFloatSpread(5);
            const z = Three.MathUtils.randFloatSpread(5);
            vertices.push(x, y, z);
        }

        // Three.BufferGeometry를 사용하여 포인트 클라우드 생성
        const geometry = new Three.BufferGeometry();
        geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));

        const sprite = new Three.TextureLoader().load('heart.png'); // 포인트의 모양을 정의하는 스프라이트 이미지

        // 포인트 클라우드의 재질 설정
        const material = new Three.PointsMaterial({
            map: sprite,  // 스프라이트 이미지 사용
            alphaTest: 0.5, // 값이 높을 수록 더 많은 픽셀이 잘려나감 0이면 항상렌더링, 1이면 불투명한 부분만 렌더링
            color: 0x888888, 
            // size: 5,  // 이미지에 맞게 크기조정
            size: 50,  
            sizeAttenuation: false,  // 포인트 크기가 카메라와의 거리에 따라 변하도록 설정
        });

        // Three.Points를 사용하여 포인트 클라우드 생성
        const points = new Three.Points(geometry, material);
        this._scene.add(points);
    }

     _setupModel() {

        // vertices는 4개의 정점으로 구성된 사각형을 정의합니다.
        const vertices = [
            -1, 1, 0, 
            1, 1, 0, 
            -1, -1, 0, 
            1, -1, 0
        ];

        // Three.BufferGeometry를 사용하여 선을 생성합니다.
        const geometry = new Three.BufferGeometry();
        geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));

        // 선의 재질을 정의합니다.
        // LineBasicMaterial: 기본 선 재질
        // const material = new Three.LineBasicMaterial({
        //     color: 0x00ff00
        // });

        // Three.Line을 사용하여 선을 생성합니다.
        // Line: 순서대로 점을 연결해 하나의 선을 만든다 Z
        // LineSegments: 두점씩 짝지어 선을 만든다 =
        // LineLoop: Line + 마지막점과 첫번째 점을 연결한다. ⧖
        // const line = new Three.Line(geometry, material);
        

        // LineDashedMaterial: 대시선 재질
        // 선의 길이를 참조해서 재질이 적용됨으로 선의 길이를 계산해 줘야한다.
        const material =  new Three.LineDashedMaterial({
            color: 0x00ff00, // 선의 색상
            dashSize: 0.1, // 대시 크기
            gapSize: 0.1, // 간격 크기
            scale: 1 // 대시와 간격의 크기를 조정하는 스케일
        });
        const line = new Three.Line(geometry, material);
        line.computeLineDistances(); // 대시선 재질을 사용하기 위해 선의 길이를 계산






        this._scene.add(line);
        
    }

    resize() {
        const width = this._divContainer.clientWidth; 
        const height = this._divContainer.clientHeight; 

        this._camera.aspect = width / height; 
        this._camera.updateProjectionMatrix(); 

        this._renderer.setSize(width, height); 
    }

    render(time){
        this._renderer.render(this._scene, this._camera); 
        this.update(time); 
        requestAnimationFrame(this.render.bind(this)); 
    }

    update(time){
        time *= 0.001; 

        // 이 예재에서는 cube를 사용하지 않음으로 주석처리
        // 05-material.js:106 Uncaught TypeError: Cannot read properties of undefined (reading 'rotation') at App.update (05-material.js:106:20) at App.render (05-material.js:100:14)
        // this._cube.rotation.x = time; 
        // this._cube.rotation.y = time; 
    }

}


window.onload = () => {
    new App();
}