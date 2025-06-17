
import * as Three from '../../build/three.module.js';

// 화면을 조작할 수 있는 OrbitControls를 가져옵니다.
import { OrbitControls } from 'https://esm.sh/three@0.157.0/examples/jsm/controls/OrbitControls.js';

import { VertexNormalsHelper } from 'https://esm.sh/three@0.157.0/examples/jsm/helpers/VertexNormalsHelper.js'; 

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
        // this._setupModel(); 

        // this._setupModel_part3(); 
        this._setupModel_part4(); 

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
        camera.position.z = 1.5; 
        this._camera = camera; 

        // 앰비언트 오클루전 맵을 위해서는 추가적인 setupuLight가 필요하다.
        this._scene.add(camera);
    }

    
    _setupLight() {
        const color = 0xffffff; 
        const intensity = 2; 
        const light = new Three.DirectionalLight(color, intensity); 
        light.position.set(-1, 2, 4); 
        // this._scene.add(light); 

        // 앰비언트 오클루전 맵을 위해서는 추가적인 setupuLight가 필요하다.
        const ambientLight = new Three.AmbientLight(0xffffff, 0.2); 
        this._scene.add(ambientLight);
        this._camera.add(light); 
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

    _setupModel_part3() {
        const textureLoader = new Three.TextureLoader();
        const map = textureLoader.load('background.jpg', texture => { // 텍스처 이미지 로드

            // 텍스처의 반복 설정 
            texture.repeat.x = 2;
            texture.repeat.y = 2;
            
            // 전체 반복
            // texture.wrapS = Three.RepeatWrapping; // 수평 반복
            // texture.wrapT = Three.RepeatWrapping; // 수직 반복

            // 한번 매핑되고 이후 반복부터는 이미지의 끝단 픽셀로 나머지 영역을 채우기
            // texture.wrapS = Three.ClampToEdgeWrapping; // 수평 반복
            // texture.wrapT = Three.ClampToEdgeWrapping; // 수직 반복

            // 이미지를 x y 축 방향으로 반복하되 짝수번째 반복에서는 거울에 반사되어 뒤집힘
            texture.wrapS = Three.MirroredRepeatWrapping; // 수평 반복
            texture.wrapT = Three.MirroredRepeatWrapping; // 수직 반복

            texture.offset.x = 0.5; // 텍스처의 x축 오프셋
            texture.offset.y = 0.5; // 텍스처의 y축 오프셋

            texture.rotation = Three.MathUtils.degToRad(45); // 텍스처 회전 (라디안 단위로 변환)
            texture.center.x = 0.5; // 텍스처의 x축 중심점
            texture.center.y = 0.5; // 텍스처의 y축 중심점

            // MipMap: 텍스처의 해상도를 줄여서 렌더링할 때 사용되는 기술
            // MipMap은 텍스처의 여러 해상도를 미리 계산하여 저장한 것입니다. 해상도가 아주 낮은 경우에도 MipMap을 사용하면 성능이 향상됩니다.
            texture.magFilter = Three.NearestFilter; // 확대 필터링 (NearestFilter: 픽셀을 확대할 때 가장 가까운 픽셀을 사용)
            texture.minFilter = Three.NearestMipMapLinearFilter; // 축소 필터링 (LinearMipMapLinearFilter: MIP 맵을 사용하여 부드럽게 축소)
        }); 

        const material = new Three.MeshStandardMaterial({
            map: map, // 텍스처 맵핑
        });

        const box = new Three.Mesh(new Three.BoxGeometry(1, 1, 1), material);
        box.position.set(-1, 0, 0); // 박스 위치 설정
        this._scene.add(box); // 박스를 씬에 추가

        const sphere = new Three.Mesh(new Three.SphereGeometry(0.7, 32, 32), material);
        sphere.position.set(1, 0, 0); // 구 위치 설정
        this._scene.add(sphere); // 구를 씬에 추가
    }


    // https://3dtextures.me
    // https://3dtextures.me/2020/07/15/glass-window-002
    _setupModel_part4() {
        const textureLoader = new Three.TextureLoader();
        const map = textureLoader.load("../images/glass/Glass_Window_002_basecolor.jpg");
        const mapAO = textureLoader.load("../images/glass/Glass_Window_002_ambientOcclusion.jpg");
        const mapHeight = textureLoader.load("../images/glass/Glass_Window_002_height.png");
        const mapNormal = textureLoader.load("../images/glass/Glass_Window_002_normal.jpg");
        const mapRoughness = textureLoader.load("../images/glass/Glass_Window_002_roughness.jpg");
        const mapMetalness = textureLoader.load("../images/glass/Glass_Window_002_metallic.jpg");
        const mapAlpha = textureLoader.load("../images/glass/Glass_Window_002_opacity.jpg");

        const material = new Three.MeshStandardMaterial({
            map: map, // 기본 색상 맵
            
            // 노멀 맵
            // 노멀 맵은 표면의 미세한 디테일을 표현하는 데 사용됩니다.
            normalMap: mapNormal, // 노멀 맵
            displacementMap: mapHeight, // 디스플레이스먼트 맵
            displacementScale: 0.2, // 디스플레이스먼트 맵의 스케일
            displacementBias: -0.15, // 디스플레이스먼트 맵의 바이어스

            aoMap: mapAO, // 앰비언트 오클루전 맵
            aoMapIntensity: 1.5, // 앰비언트 오클루전 맵의 강도

            roughnessMap: mapRoughness, // 거칠기 맵 
            roughness: 0.2, // 거칠기 값 (0.0 ~ 1.0) 보다 부드러워진 플라스틱 느낌이 난다.

            metalnessMap: mapMetalness, // 금속성 맵
            metalness: 0.9, // 금속성 값 (0.0 ~ 1.0) 유리이므로 금속성이 없음

            alphaMap: mapAlpha, // 알파 맵 (투명도 맵)
            transparent: true, // 투명도 설정
            side: Three.DoubleSide, // 양면 렌더링

        });

        const box = new Three.Mesh(new Three.BoxGeometry(1, 1, 1, 152, 152, 152), material);
        box.position.set(-1, 0, 0); // 박스 위치 설정
        box.geometry.attributes.uv2 = box.geometry.attributes.uv; // 앰비언트 오클루전 맵을 위한 UV2 속성 설정
        this._scene.add(box); // 박스를 씬에 추가

        // const boxHelper = new VertexNormalsHelper(box, 0.1, 0xff0000, 1); // 박스의 노멀 벡터를 시각화
        // this._scene.add(boxHelper); // 박스 헬퍼를 씬에 추가

        const sphere = new Three.Mesh(new Three.SphereGeometry(0.7, 512, 512), material);
        sphere.position.set(1, 0, 0); // 구 위치 설정
        sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv; // 앰비언트 오클루전 맵을 위한 UV2 속성 설정
        this._scene.add(sphere); // 구를 씬에 추가

        // const sphereHelper = new VertexNormalsHelper(sphere, 0.1, 0xff0000, 1); // 구의 노멀 벡터를 시각화
        // this._scene.add(sphereHelper); // 구 헬퍼를 씬에 추가
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