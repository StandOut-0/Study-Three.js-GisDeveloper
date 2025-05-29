// Three.js를 import합니다.
import * as Three from '../../build/three.module.js';


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

        // 창 크기 변경 처리
        // 윈도우 크기 변경 시 resize() 메서드 호출하여 캔버스 사이즈 재설정.
        window.onresize = this.resize.bind(this);
        this.resize();

        // 렌더링 루프 시작
        // 한 프레임 렌더링 후 다음 프레임을 요청하여 계속 반복 실행.
        requestAnimationFrame(this.render.bind(this));
    }

    // 카메라 설정
    _setupCamera() {
        const width = this._divContainer.clientWidth; // 캔버스 너비
        const height = this._divContainer.clientHeight; // 캔버스 높이

        // PerspectiveCamera: 원근 카메라로, 3D 씬을 2D 화면에 투영.
        const camera = new Three.PerspectiveCamera(75, width / height, 0.1, 100); // 원근 카메라 생성
        
        // 태양계 확인을 위해 카메라 보다 멀리 위치시킴
        camera.position.z = 13; // 카메라 위치 설정 (z축으로 2만큼 이동)
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
        const solarSystem = new Three.Object3D();
        this._scene.add(solarSystem); // 씬에 태양계 오브젝트 추가

        const radius = 1;
        const widthSegments = 32; // 구의 가로 분할 수
        const heightSegments = 32; // 구의 세로 분할 수
        const SphereGeometry = new Three.SphereGeometry(radius, widthSegments, heightSegments); // 구형 지오메트리 생성

        const sunMaterial = new Three.MeshStandardMaterial({
            color: 0xffee88,
            roughness: 0.3,
            metalness: 0.5,
            flatShading: true // 평면 음영으로 각지게!
        });

        const sunMesh = new Three.Mesh(SphereGeometry, sunMaterial); // 태양 메쉬 생성
        sunMesh.scale.set(2, 2, 2); // 태양 크기 조정
        solarSystem.add(sunMesh); // 태양을 태양계 오브젝트에 추가
        







        const earthOrbit = new Three.Object3D(); // 지구 궤도 오브젝트 생성
        solarSystem.add(earthOrbit); // 태양계 오브젝트에 지구 궤도 추가

        const earthMaterial = new Three.MeshStandardMaterial({
            color: 0x3399ff,
            roughness: 0.4,
            metalness: 0.4,
            flatShading: true // 평면 음영으로 각지게!
        }); // 지구 재질 (파란색)
        const earthMesh = new Three.Mesh(SphereGeometry, earthMaterial); // 지구 메쉬 생성
        earthOrbit.position.x = 10; // 지구 궤도 위치 설정
        earthOrbit.add(earthMesh); // 지구 메쉬를 지구 궤도 오브젝트에 추가

        // 지구에 와이어프레임 추가 (선택)
        const earthWire = new Three.Mesh(
            SphereGeometry,
            new Three.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
        );
        earthMesh.add(earthWire);

        





        const moonOrbit = new Three.Object3D(); // 달 궤도 오브젝트 생성
        moonOrbit.position.x = 2; // 달 궤도 위치 설정
        earthOrbit.add(moonOrbit); // 지구 궤도 오브젝트에 달 궤도 추가
        const moonMaterial = new Three.MeshStandardMaterial({
            color: 0xdddddd,
            roughness: 0.6,
            metalness: 0.2,
            emissive: 0x222222,
            flatShading: true // 평면 음영으로 각지게!
        }); // 달 재질 (회색)
        const moonMesh = new Three.Mesh(SphereGeometry, moonMaterial); // 달 메쉬 생성
        moonMesh.scale.set(0.5, 0.5, 0.5); // 달 크기 조정
        moonOrbit.add(moonMesh);






        this._solorSystem = solarSystem; // 태양계를 인스턴스 변수에 저장
        this._earthOrbit = earthOrbit; // 지구 궤도를 인스턴스 변수에 저장
        this._moonOrbit = moonOrbit; // 달 궤도를 인스턴스 변수에 저장

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
        // this._cube.rotation.x = time; // 큐브 x축 회전

        // solarSystem 오브젝트의 회전 추가
        this._solorSystem.rotation.y = time/2; // 큐브 y축 회전
        this._earthOrbit.rotation.y = time * 2; // 지구 궤도 y축 회전
        this._moonOrbit.rotation.y = time * 5; // 달 궤도 y축 회전
    }

}

// 앱 실행
window.onload = () => {
    new App();
}