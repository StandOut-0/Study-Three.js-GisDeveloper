// Three.js를 import합니다.
import * as Three from '../../build/three.module.js';
import { OrbitControls } from 'https://esm.sh/three@0.157.0/examples/jsm/controls/OrbitControls.js';
import { VertexNormalsHelper } from 'https://esm.sh/three@0.157.0/examples/jsm/helpers/VertexNormalsHelper.js'; 


class App{
    constructor() {

        // #webgl-container 객체를 다른 메서드에서 사용하기 위해서 this._divContainer에 저장
        const divContainer = document.getElementById('webgl-container');
        this._divContainer = divContainer;

        // 렌더러 생성 및 설정 - start
        // WebGLRenderer: 3D 그래픽을 브라우저에 렌더링하는 엔진.
        // antialias: true: 계단 현상(깍두기 픽셀)을 줄이기 위해 부드럽게 렌더링.
        const renderer = new Three.WebGLRenderer({ antialias: true });
        
        // setPixelRatio: 디바이스 픽셀 비율에 맞춰 고해상도로 출력.
        renderer.setPixelRatio(window.devicePixelRatio);

        // renderer.domElement: canvas 요소를 실제 웹 페이지에 추가.
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;
        // 렌더러 생성 및 설정 - end

        // 씬(Scene) 생성
        const scene = new Three.Scene();
        this._scene = scene;

        //  카메라, 조명, 모델 구성
        this._setupCamera(); // _setupCamera(): 카메라 위치와 방향 설정
        this._setupLight(); // _setupLight(): 조명 설정 (예: 햇빛, 점광원 등)
        this._setupModel(); // _setupModel(): 3D 오브젝트 불러오기 또는 생성

        this._setUpControls();

        // 창 크기 변경 처리
        // 윈도우 크기 변경 시 resize() 메서드 호출하여 캔버스 사이즈 재설정.
        window.onresize = this.resize.bind(this);
        this.resize();

        // 렌더링 루프 시작
        // 한 프레임 렌더링 후 다음 프레임을 요청하여 계속 반복 실행.
        requestAnimationFrame(this.render.bind(this));
    }
    
    _setUpControls() {
        new OrbitControls(this._camera, this._divContainer);
    }

    // 카메라 설정
    _setupCamera() {
        const width = this._divContainer.clientWidth; // 캔버스 너비
        const height = this._divContainer.clientHeight; // 캔버스 높이

        // PerspectiveCamera: 원근 카메라로, 3D 씬을 2D 화면에 투영.
        const camera = new Three.PerspectiveCamera(75, width / height, 0.1, 100); // 원근 카메라 생성
        camera.position.z = 2; // 카메라 위치 설정 (z축으로 2만큼 이동)
        this._camera = camera; // 카메라를 인스턴스 변수에 저장
    }

    // 조명 설정
    _setupLight() {
        const color = 0xffffff; // 흰색 조명
        const intensity = 2; // 조명 세기
        const light = new Three.DirectionalLight(color, intensity); // 조명 생성
        light.position.set(-1, 2, 4); // 조명 위치 설정
        this._scene.add(light); // 씬에 조명 추가
    }

    _setupModel() {
        // 커스텀 지오메트리 생성
       const rawPositions = [
        -1, -1, 0,
        1, -1, 0, 
        -1, 1, 0, 
        1, 1, 0
       ];

       const rawNormals = [
        0, 0, 1, 
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
       ];

       const rawColors = [
        1, 0, 0, // 빨강
        0, 1, 0, // 초록
        0, 0, 1, // 파랑
        1, 1, 0  // 노랑
       ];

       const rawUVs = [
        0, 0, // 좌하단
        1, 0, // 우하단
        0, 1, // 좌상단
        1, 1  // 우상단
         ];

       // Float32Array: 부동 소수점 숫자를 저장하는 배열로, Three.js에서 버퍼 지오메트리를 만들 때 사용.
       const positions = new Float32Array(rawPositions); // Float32Array로 변환
       const normals = new Float32Array(rawNormals); // Float32Array로 변환
       const colors = new Float32Array(rawColors); // Float32Array로 변환 (색상은 현재 사용하지 않음)
       const uvs = new Float32Array(rawUVs); // Float32Array로 변환 (UV 좌표는 현재 사용하지 않음)

       const geometry = new Three.BufferGeometry(); // 버퍼 지오메트리 생성
       geometry.setAttribute('position', new Three.BufferAttribute(positions, 3)); // 위치
       geometry.setAttribute('normal', new Three.BufferAttribute(normals, 3)); // 법선 벡터 설정
       geometry.setAttribute('color', new Three.BufferAttribute(colors, 3)); // 색상 설정 (현재 사용하지 않음)
       geometry.setAttribute('uv', new Three.BufferAttribute(uvs, 2)); // UV 좌표 설정 (현재 사용하지 않음)

       geometry.setIndex([
        0, 1, 2, 
        2, 1, 3
        ]); // 인덱스 설정
        
        const textureLoader = new Three.TextureLoader(); // 텍스처 로더 생성 (현재 사용하지 않음)
        const map = textureLoader.load('https://threejs.org/examples/textures/crate.gif'); // 텍스처 로드 (현재 사용하지 않음)

       // geometry.computeVertexNormals(); // 정점 법선 계산 (조명 효과를 위해 필요)
       // MeshPhongMaterial: 조명 효과를 적용할 수 있는 재질로, 표면의 반사와 광택을 표현.
       const material = new Three.MeshPhongMaterial({ 
        color: 0xffffff, 
        vertexColors: true, 
        map: map 
    }); // 재질 생성
       const box = new Three.Mesh(geometry, material); // 메쉬 생성
       this._scene.add(box); // 씬에 메쉬 추가

       const helper = new VertexNormalsHelper(box, 0.1, 0xff0000); // 정점 법선 헬퍼 생성
       this._scene.add(helper); // 씬에 헬퍼 추가
    }

    resize() {
        const width = this._divContainer.clientWidth; // 캔버스 너비
        const height = this._divContainer.clientHeight; // 캔버스 높이

        this._camera.aspect = width / height; // 카메라 종횡비 설정
        this._camera.updateProjectionMatrix(); // 카메라 투영 행렬 업데이트

        this._renderer.setSize(width, height); // 렌더러 크기 설정
    }

    render(time){
        this._renderer.render(this._scene, this._camera); // 씬과 카메라로 렌더링
        this.update(time); // 애니메이션 업데이트
        requestAnimationFrame(this.render.bind(this)); // 다음 프레임 요청
    }

    update(time){
        time *= 0.001; // 시간 단위 변환 (밀리초 -> 초)
    }

}

// 앱 실행
window.onload = () => {
    new App();
}