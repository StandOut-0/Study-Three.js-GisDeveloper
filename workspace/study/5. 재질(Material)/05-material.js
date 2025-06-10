
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
        camera.position.z = 3; 
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

        
        // 05 material part 1 - start

        // vertices는 4개의 정점으로 구성된 사각형을 정의합니다.
        // const vertices = [
        //     -1, 1, 0, 
        //     1, 1, 0, 
        //     -1, -1, 0, 
        //     1, -1, 0
        // ];

        // Three.BufferGeometry를 사용하여 선을 생성합니다.
        // const geometry = new Three.BufferGeometry();
        // geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));

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
        // const material =  new Three.LineDashedMaterial({
        //     color: 0x00ff00, // 선의 색상
        //     dashSize: 0.1, // 대시 크기
        //     gapSize: 0.1, // 간격 크기
        //     scale: 1 // 대시와 간격의 크기를 조정하는 스케일
        // });
        // const line = new Three.Line(geometry, material);
        // line.computeLineDistances(); // 대시선 재질을 사용하기 위해 선의 길이를 계산



        // this._scene.add(line);

        
        // 05 material part 1 - end







        // 05 material part 2 - start
        
        // mesh는 Three.js에서 3D 객체를 생성하는 기본 단위입니다.
        // 재질(Material)과 지오메트리(Geometry)를 결합하여 3D 객체를 만듭니다.
        
        // Mesh에서 가장 많이 사용되는 재질은 MeshStandardMaterial, MeshPhysicalMaterial이다. 상대적으로 속도느 느리나 고품질이다.
        const material = new Three.MeshPhysicalMaterial({
        // const material = new Three.MeshStandardMaterial({
        // const material = new Three.MeshPhongMaterial({
        // const material = new Three.MeshLambertMaterial({
        // const material = new Three.MeshBasicMaterial({
            visible: true, // 재질이 보이는지 여부
            transparent: false, // 재질이 투명한지 여부
            opacity: 1.0, // 재질의 투명도 (0.0 ~ 1.0)

            // depth Buffer = 깊이버퍼, z버퍼, 객체의 깊이 정보를 저장하는 버퍼, 0과 1사이 이값이 작을수록 카메라에 가까워짐
            // MeshBasicMaterial은 기본 재질로, 조명 효과를 받지 않아 상세속성 변화를 크게 느낄 수 없습니다. 
            depthTest: true, // 깊이 테스트를 활성화
            depthWrite: true, // 깊이 쓰기를 활성화
            side: Three.DoubleSide, // 양면 렌더링
            // side: Three.FrontSide, // 정면만 렌더링

            color: "#d25383", // 재질의 색상
            emissive: 0x555500, // 방출 색상 (조명 효과를 받지 않는 부분의 색상) 입체감을 주기 좋음!
            specular : 0xffff00, // 반사 색상 (빛을 반사하는 부분의 색상 빛나는 부분의 색상을 지정)
            shininess: 10, // 광택도 (0 ~ 1000) 값이 클수록 빛나는 부분이 작아짐

            // MeshStandardMaterial - start
            roughness: 0.3, // 거칠기 (0.0 ~ 1.0) 값이 작을수록 표면이 매끄럽고 빛나는 부분이 넓어짐
            metalness: 0.5, // 금속성 (0.0 ~ 1.0) 값이 클수록 금속 재질처럼 보임
            // MeshStandardMaterial - end

            // MeshPhysicalMaterial - start
            roughness: 1, // 거칠기 (0.0 ~ 1.0) 값이 작을수록 표면이 매끄럽고 빛나는 부분이 넓어짐
            metalness: 0, // 금속성 (0.0 ~ 1.0) 값이 클수록 금속 재질처럼 보임
            clearcoat: 0.5, // 클리어코트 (0.0 ~ 1.0) 값이 클수록 표면에 유리처럼 투명한 코팅 효과가 적용됨
            clearcoatRoughness: 0.1, // 클리어코트 거칠기 (0.0 ~ 1.0) 값이 작을수록 표면이 매끄럽고 빛나는 부분이 넓어짐
            // MeshPhysicalMaterial - end

            wireframe: false, // 와이어프레임 모드로 렌더링  
            // transparent: true, // 투명도 설정
            // opacity: 0.5 // 투명도 값 (0.0 ~ 1.0)
        });

        const box = new Three.Mesh(
            new Three.BoxGeometry(1, 1, 1), // 박스 지오메트리
            material // 재질
        );
        box.position.set(-1, 0, 0); // 박스 위치 설정
        this._scene.add(box); // 박스를 씬에 추가

        const sphere = new Three.Mesh(
            new Three.SphereGeometry(0.7, 32, 32), material
        );
        sphere.position.set(1, 0, 0); // 구 위치 설정
        this._scene.add(sphere); // 구를 씬에 추가
        // 이 예제에서는 cube를 사용하지 않음

        // 05 material part 1 - end
        
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