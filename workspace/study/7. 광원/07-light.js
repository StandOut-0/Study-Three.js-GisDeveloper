// Three.js를 import합니다.
import * as Three from '../../build/three.module.js';
import { OrbitControls } from 'https://esm.sh/three@0.157.0/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'https://esm.sh/three@0.157.0/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'https://esm.sh/three@0.157.0/examples/jsm/helpers/RectAreaLightHelper.js';

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
        const camera = new Three.PerspectiveCamera(
            75, // 시야각 (FOV)
            window.innerWidth / Window.innerHeight, // 종횡비
            0.1, // 근거리 클리핑 평면
            100 // 원거리 클리핑 평면
        );

        camera.position.set(7, 7, 0); // 카메라 위치 설정
        camera.lookAt(0, 0, 0); // 카메라가 바라보는 방향 설정
        this._camera = camera; // 카메라를 인스턴스 변수에 저장
    }

    // 조명 설정
    _setupLight() {
       // AmbientLight  주변광, 환경광 단일색상으로 렌더링되도록 한다. 대부분 매우 약하게 지정한다. 
       // const light = new Three.AmbientLight(0xff0000, 5); 

       // HemisphereLight 위에서, 아래에서 비추는 색상
       // const light = new Three.HemisphereLight("blue", "red", 3); 

       // DirectionalLight 태양과 같은 빛, 빛과 물체간의 거리에 상관없이 동일하게 비춰진다.
        // const light = new Three.DirectionalLight(0xfffffff, 1); 
        // light.position.set(0, 5, 0);
        // light.target.position.set(0, 0, 0);
        // this._scene.add(light.target);
        // // DirectionalLight를 보다 더 잘 이해하기 위한 코드 1/2
        // const helper = new Three.DirectionalLightHelper(light);
        // this._scene.add(helper);
        // this._lightHelper = helper;


        // PointLight 특정 포인트를 비춘다
        // const light = new Three.PointLight(0xffffff, 9);
        // light.position.set(0, 5, 0);
        // light.distance = 0; //지정된 거리까지의 물체가 보인다.
        // // PointLight를 보다 더 잘 이해하기 위한 코드 1/2
        // const helper = new Three.PointLightHelper(light);
        // this._scene.add(helper);
        
        // SpotLight 원뿔모양으로 비춘다.
        // const light = new Three.SpotLight(0xffffff, 9);
        // light.position.set(0, 5, 0);
        // light.target.position.set(0, 0, 0);
        // light.angle = Three.MathUtils.degToRad(40);
        // light.penumbra = 2;
        // this._scene.add(light.target);
        // // SpotLight를 보다 더 잘 이해하기 위한 코드 1/2
        // const helper = new Three.SpotLightHelper(light);
        // this._scene.add(helper);
        // this._lightHelper = helper;

        // RectAreaLight 형광등이나 창문등같이 자연스럽게 비춤
        RectAreaLightUniformsLib.init();
        const light = new Three.RectAreaLight(0xffffff, 10, 6, 0.5); // 광원 가로세로크기
        light.position.set(0, 5, 0);
        light.rotation.x = Three.MathUtils.degToRad(-90);
        // RectAreaLight를 보다 더 잘 이해하기 위한 코드 1/2
        const helper = new RectAreaLightHelper(light);
        light.add(helper);

       this._scene.add(light); // 씬에 조명 추가
       this._light = light; // 조명을 인스턴스 변수에 저장
    }

    _setupModel() {
        const groudGeometry = new Three.PlaneGeometry(10, 10); // 평면 지오메트리 생성
        const groundMaterial = new Three.MeshStandardMaterial({ 
            color: 0x808080,
            roughness: 0.5, // 거칠기 설정
            metalness: 0.1, // 금속성 설정
            side: Three.DoubleSide // 양면 렌더링
         }); // 표준 재질 생성

        const ground = new Three.Mesh(groudGeometry, groundMaterial); // 메쉬 생성
        ground.rotation.x = Three.MathUtils.degToRad(-90); // 평면을 x축으로 -90도 회전
        this._scene.add(ground); // 씬에 평면 추가

        const bigSphereGeometry = new Three.SphereGeometry(1.5, 64, 64, 0, Math.PI); // 구 지오메트리 생성
        const bigSphereMaterial = new Three.MeshStandardMaterial({ 
            color: 0x00ff00, // 초록색
            roughness: 0.1, // 거칠기 설정
            metalness: 0.2 // 금속성 설정
        }); // 표준 재질 생성
        const bigSphere = new Three.Mesh(bigSphereGeometry, bigSphereMaterial); // 메쉬 생성
        bigSphere.rotation.x = Three.MathUtils.degToRad(-90); // 구를 x축으로 -90도 회전
        this._scene.add(bigSphere); // 씬에 구 추가

        const torusGeometry = new Three.TorusGeometry(0.4, 0.1, 32, 32); // 토러스 지오메트리 생성
        const torusMaterial = new Three.MeshStandardMaterial({
            color: 0xff0000, // 빨간색
            roughness: 0.5, // 거칠기 설정
            metalness: 0.1 // 금속성 설정
        }); // 표준 재질 생성

        for (let i = 0; i < 8; i++) {
            const tourusPivot = new Three.Object3D(); // 오브젝트 피벗 생성
            const torus = new Three.Mesh(torusGeometry, torusMaterial); // 토러스 메쉬 생성
            tourusPivot.rotation.y = Three.MathUtils.degToRad(45 * i); // 토러
            torus.position.set(3, 0.5, 0); // 토러스 위치 설정
            tourusPivot.add(torus); // 피벗에 토러스 추가   
            this._scene.add(tourusPivot); // 씬에 피벗 추가
        }

        const smallSphereGeometry = new Three.SphereGeometry(0.3, 32, 32); // 작은 구 지오메트리 생성
        const smallSphereMaterial = new Three.MeshStandardMaterial({
            color: 0x0000ff, // 파란색
            roughness: 0.5, // 거칠기 설정
            metalness: 0.1 // 금속성 설정
        }); // 표준 재질 생성

        const smallSpherePivot = new Three.Object3D(); // 피벗은 원점에 둔다
        const smallSphere = new Three.Mesh(smallSphereGeometry, smallSphereMaterial);
        smallSphere.position.set(3, 0.5, 0); // 작은 구를 피벗에서 떨어진 곳에 위치
        smallSpherePivot.add(smallSphere);
        smallSpherePivot.name = "smallSpherePivot";
        this._scene.add(smallSpherePivot); // 피벗을 씬에 추가
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

        const smallSpherePivot = this._scene.getObjectByName("smallSpherePivot"); // 작은 구 피벗 가져오기
        if (smallSpherePivot) {
            smallSpherePivot.rotation.y = Three.MathUtils.degToRad(time*50); // 작은 구 피벗 회전

            // DirectionalLight를 보다 더 잘 이해하기 위한 코드 2/2
            // 광원에 첫번째 자식의 좌표계 위치를 구해서 광원의 target 위치에 지정했다. 광원이 position에만 영향을 받음을 잘 보여줌
            // if(this._light.target){
            //     const smallSphere = smallSpherePivot.children[0];
            //     smallSphere.getWorldPosition(this._light.target.position);
            //     if(this._lightHelper) this._lightHelper.update();
            // }

            // PointLight를 보다 더 잘 이해하기 위한 코드 2/2
            // if(this._light){
            //     const smallSphere = smallSpherePivot.children[0];
            //     smallSphere.getWorldPosition(this._light.position);
            //     if(this._lightHelper) this._lightHelper.update();
            // }

            // SpotLight를 보다 더 잘 이해하기 위한 코드 2/2
             if(this._light.target){
                const smallSphere = smallSpherePivot.children[0];
                smallSphere.getWorldPosition(this._light.target.position);
                if(this._lightHelper) this._lightHelper.update();
            }
        }   
       
    }

}

// 앱 실행
window.onload = () => {
    new App();
}