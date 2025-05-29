// import 에러헤결 - START

// Three.js에서 OrbitControls.js는 단순히 three.module.js에서 모든 걸 불러오는 게 아니라, three라는 패키지에서 다양한 클래스들을 개별 import합니, 이건 모듈 번들러 (Webpack, Vite 등) 환경에서는 문제없지만, 브라우저 환경에서는 상대 경로가 없어서 에러가 납니다.
// Uncaught TypeError: Failed to resolve module specifier "three". Relative references must start with either "/", "./", or "../".Understand this error
// import * as Three from '../../build/three.module.js';
// import { OrbitControls } from '../../examples/jsm/controls/OrbitControls.js';

// three.module.js와 OrbitControls.js를 CDN으로 불러오고 있는데 OrbitControls.js 내부에서 여전히 import { ... } from 'three'를 사용하고 있기 때문에 에러가 발생합니다. 브라우저는 import { ... } from 'three'를 Node.js처럼 처리하지 못하고, 이를 상대 경로로 바꾸라고 요구합니다.
// Uncaught TypeError: Failed to resolve module specifier "three". Relative references must start with either "/", "./", or "../".
// import * as Three from 'https://unpkg.com/three@0.157.0/build/three.module.js';
// import { OrbitControls } from 'https://unpkg.com/three@0.157.0/examples/jsm/controls/OrbitControls.js';


// esm.sh 사용 (Skypack 대체, 안정적임)
// GET https://cdn.skypack.dev/new/three@v0.157.0/... net::ERR_ABORTED 500 (Internal Server Error)
import * as Three from 'https://esm.sh/three@0.157.0';
import { OrbitControls } from 'https://esm.sh/three@0.157.0/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'https://esm.sh/three@0.157.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://esm.sh/three@0.157.0/examples/jsm/geometries/TextGeometry.js';

// import 에러헤결 - END


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
        
        // 모델 설정
        // this._setupModel(); 
        // this._setupModel_shapeTest(); 
        // this._setupModelHeart(); 
        // this._setupModelCurve(); 
        // this._setupModelLatheLine();
        // this._setupModel_Extrude();
        this._setupModel_Text();

        this._setupControls(); // OrbitControls 추가

        
        window.onresize = this.resize.bind(this);
        this.resize();

        
        requestAnimationFrame(this.render.bind(this));
    }

    //_setupControls 메서드 추가
    _setupControls() {
        // OrbitControls를 사용하여 카메라를 제어합니다.
        new OrbitControls(this._camera, this._divContainer);
    }

    
    _setupCamera() {
        const width = this._divContainer.clientWidth; 
        const height = this._divContainer.clientHeight; 

        const camera = new Three.PerspectiveCamera(75, width / height, 0.1, 100); 
        
        // 카메라의 z 위치를 조정하기
        // camera.position.z = 2; 
        camera.position.z = 15;

        this._camera = camera; 
    }

    
    _setupLight() {
        const color = 0xffffff; 
        const intensity = 2; 
        const light = new Three.DirectionalLight(color, intensity); 
        light.position.set(-1, 2, 4); 
        this._scene.add(light); 
    }

    _setupModel() {
        // BoxGeometry(가로, 세로, 높이, 각각에 대한 분할 수 있는 세그먼트의 수)
        // const geometry = new Three.BoxGeometry(1, 1, 1, 2, 2, 2); // 세그먼트 수를 늘려서 더 많은 면을 생성해보기

        // 원판
        // const geometry = new Three.CircleGeometry(0.9, 8, 0, Math.PI); // CircleGeometry(반지름, 분할개수,시작각도, 끝각도)

        // 원뿔
        // const geometry = new Three.ConeGeometry(0.5, 1.6, 16, 9, true, 0, Math.PI); // ConeGeometry(반지름, 높이, 분할개수, 높이분할개수, 원뿔밑면을 open할것인가, 시작각도, 끝각도)

        // 막대
        // const  geometry = new Three.CylinderGeometry(0.9, 0.7, 1, 15, 3, true, 0, Math.PI); // CylinderGeometry(위쪽반지름, 아래쪽반지름, 높이, 분할개수, 높이분할개수, 원통밑면을 open할것인가, 시작각도, 끝각도)

        // 원   
        // const geometry = new Three.SphereGeometry(0.8, 32, 16, 0, Math.PI, 0, Math.PI/2); // SphereGeometry(반지름, 수직 세그먼트수, 수평 세그먼트수, 수직 시작각도, 수직끝각도, 수평 시작각도, 수평 끝각도)

        // 링
        // const geometry = new Three.RingGeometry(0.2, 0.9, 32, 3, 0, Math.PI); // RingGeometry(내부반지름, 외부반지름, 분할개수, 높이분할개수, 시작각도, 끝각도)

        // 사각형
        // const geometry = new Three.PlaneGeometry(1, 1, 2, 2); // PlaneGeometry(가로, 세로, 가로분할개수, 세로분할개수)

        // 3차원 반지 - 원통형
        // const geometry = new Three.TorusGeometry(0.8, 0.3, 10, 36, Math.PI); // TorusGeometry(반지름, 두께, 분할개수(표면각), 분할개수(링의 각), 시작각도)

        // 3차원 반지 - 매듭
        // TorusKnotGeometry는 매듭 모양의 3D 기하학을 생성합니다. 멋진 모양과 다르게 활용도가 아주 낮다.
        const geometry = new Three.TorusKnotGeometry(0.6, 0.1, 100, 16, 3, 4); // TorusKnotGeometry(반지름, 두께, 분할개수(표면각), 분할개수(링의 각), 매듭의 수, 꼬임의 수)
        

        const material = new Three.MeshStandardMaterial({ color: 0x515151 });  // 색상변경
        const cube = new Three.Mesh(geometry, material); 

        // line 추가 - STAR
        // Three.EdgesGeometry를 사용하여 기하학의 에지를 추출
        const lineMaterial = new Three.LineBasicMaterial({ color: 0xffff00 });
        const line = new Three.LineSegments(
            new Three.WireframeGeometry(geometry), lineMaterial); // 모든 엣지를 표시
            // new Three.EdgesGeometry(geometry), lineMaterial); //사각형 엣지만 표시
        
        const group = new Three.Group();
        group.add(cube);
        group.add(line);
        // line 추가 - END

        this._scene.add(group); // cube를 group으로 변경하여 line과 함께 추가합니다.
        this._cube = group;  // cube를 group으로 변경하여 line과 함께 추가합니다.
    }

    // ShapeGeometry 를 사용하여 하트 모양을 생성하는 메서드
    _setupModelHeart() {
       
        const shape = new Three.Shape();

        const x = -2.5, y = -5;
        shape.moveTo(x + 2.5, y + 2.5);
        shape.bezierCurveTo(x + 2.5, y + 1, x + 1.5, y, x, y);
        shape.bezierCurveTo(x - 3, y, x - 3, y + 2.5, x - 3, y + 2.5);
        shape.bezierCurveTo(x - 3, y + 4, x - 1.5, y + 6, x + 2.5, y + 8);
        shape.bezierCurveTo(x + 6, y + 6, x + 8, y + 4, x + 8, y + 2.5);
        shape.bezierCurveTo(x + 8, y + 2.5, x + 8, y, x + 5, y);
        shape.bezierCurveTo(x + 3, y, x + 2.5, y + 1, x + 2.5, y + 2.5);
        shape.closePath();

        const geometry = new Three.ShapeGeometry(shape);

        const fillMaterial = new Three.MeshStandardMaterial({ color: 0x515151 });
        const cube = new Three.Mesh(geometry, fillMaterial);

        const lineMaterial = new Three.LineBasicMaterial({ color: 0xffff00 });
        const line = new Three.LineSegments(
            new Three.WireframeGeometry(geometry), lineMaterial);

        const group = new Three.Group();
        group.add(cube);
        group.add(line);

        this._scene.add(group);
        this._cube = group; 
    }


    // CurveGeometry를 사용하여 곡선 모델 생성
    _setupModelCurve() {
        class CustomCurve extends Three.Curve {
           constructor(scale){
            super();
            this.scale = scale;
           }
           getPoint(t) {
                const tx = t * 3 - 1.5;
                const ty = Math.sin(2 * Math.PI * t);
                const tz = 0;
                return new Three.Vector3(tx, ty, tz).multiplyScalar(this.scale);
            }
        }

        const path = new CustomCurve(4);

        // 곡선 - start
        // const geometry = new Three.BufferGeometry();
        // const points = path.getPoints(310);
        // geometry.setFromPoints(points);

        // const material = new Three.LineBasicMaterial({ color: 0xff0000 });
        // const line = new Three.Line(geometry, material);

        // this._scene.add(line);
        // 곡선 - end
        
        // 곡선 - 튜브형 - start
        // TubeGeometry(곡선, 분할개수, 반지름, 세그먼트수, open여부)
        const geometry = new Three.TubeGeometry(path, 100, 0.9, 8, false); 

        const fillMaterial = new Three.MeshStandardMaterial({ color: 0x515151 });
        const cube = new Three.Mesh(geometry, fillMaterial);

        const lineMaterial = new Three.LineBasicMaterial({ color: 0xffff00 });
        const line = new Three.LineSegments(
            new Three.WireframeGeometry(geometry), lineMaterial);
        
        const group = new Three.Group();
        group.add(cube);
        group.add(line);

        this._scene.add(group);
        this._cube = group;
        // 곡선 - 튜브형 - end
    }


    // LatheLine을 사용하여 직선을 회전시켜 모델을 생성
    _setupModelLatheLine() {
        const points = [];
        for (let i = 0; i < 10; ++i) {
            points.push(new Three.Vector3(Math.sin(i * 0.2) * 3 + 3, (i - 5) * .8));
        }

        // LatheGeometry(점들, 분할개수, 시작각도, 끝각도)
        const geometry = new Three.LatheGeometry(points, 32, 0, Math.PI ); 

        const fillMaterial = new Three.MeshStandardMaterial({ color: 0x515151 });
        const cube = new Three.Mesh(geometry, fillMaterial);

        const lineMaterial = new Three.LineBasicMaterial({ color: 0xffff00 });
        const line = new Three.LineSegments(
            new Three.WireframeGeometry(geometry), lineMaterial);

        const group = new Three.Group();
        group.add(cube);
        group.add(line);

        this._scene.add(group);
        this._cube = group;
    }

    // 하트에 두께와 바벨 추가해서 입체감주기
    // 베벨링 mesh의 윗면과 밑면은 비스듬하게 처리  
    _setupModel_Extrude() {
        const shape = new Three.Shape();

        const x = -2.5, y = -5;
        shape.moveTo(x + 2.5, y + 2.5);
        shape.bezierCurveTo(x + 2.5, y + 1, x + 1.5, y, x, y);
        shape.bezierCurveTo(x - 3, y, x - 3, y + 2.5, x - 3, y + 2.5);
        shape.bezierCurveTo(x - 3, y + 4, x - 1.5, y + 6, x + 2.5, y + 8);
        shape.bezierCurveTo(x + 6, y + 6, x + 8, y + 4, x + 8, y + 2.5);
        shape.bezierCurveTo(x + 8, y + 2.5, x + 8, y, x + 5, y);
        shape.bezierCurveTo(x + 3, y, x + 2.5, y + 1, x + 2.5, y + 2.5);
        shape.closePath();

        const settings = {
            steps: 2, // 세그먼트 수
            depth: 4, // 깊이
            bevelEnabled: true, // 베벨링 활성화
            bevelThickness: 1.6, // 베벨 두께
            bevelSize: 1.5, // 베벨 크기
            bevelOffset: 0, // 베벨 오프셋
            bevelSegments: 1 // 베벨 세그먼트 수
        }

        const geometry = new Three.ExtrudeGeometry(shape, settings);

        const fillMaterial = new Three.MeshStandardMaterial({ color: 0x515151 });
        const cube = new Three.Mesh(geometry, fillMaterial);

        const lineMaterial = new Three.LineBasicMaterial({ color: 0xffff00 });
        const line = new Three.LineSegments(
            new Three.WireframeGeometry(geometry), lineMaterial);

        const group = new Three.Group();
        group.add(cube);
        group.add(line);

        this._scene.add(group);
        this._cube = group; 
    }


    _setupModel_Text() {
        
        const fontLoader = new FontLoader();

        async function loadFont(that) {
            const url = 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';
            const font = await new Promise((resolve, reject) => {
                fontLoader.load(url, resolve, undefined, reject);
            });

            const geometry = new TextGeometry('Hello Three.js', {
                font: font, // 로드한 폰트 사용
                size: 1, // 글자 크기
                height: 0.2, // 글자 두께
                curveSegments: 12, // 곡선 세그먼트 수
                bevelEnabled: true, // 베벨링 활성화
                bevelThickness: 0.1, // 베벨 두께
                bevelSize: 0.05, // 베벨 크기
                bevelOffset: 0, // 베벨 오프셋
                bevelSegments: 5 // 베벨 세그먼트 수
            });

            const fillMaterial = new Three.MeshStandardMaterial({ color: 0x515151 });
            const cube = new Three.Mesh(geometry, fillMaterial);
            const lineMaterial = new Three.LineBasicMaterial({ color: 0xffff00 });
            const line = new Three.LineSegments(
                new Three.WireframeGeometry(geometry), lineMaterial);

            const group = new Three.Group();
            group.add(cube);
            group.add(line);
            that._scene.add(group);
        }

        // 로드하지않으면 화면에 아무것도 나타나지 않습니다.
        loadFont(this); 
    }

    _setupModel_shapeTest() {

        const shape = new Three.Shape();
        
        // shape을 지정하지않으면 빈화면만 나올뿐이다.
        // 사각형
        // shape.moveTo(1, 1);
        // shape.lineTo(1, -1);
        // shape.lineTo(-1, -1);   
        // shape.lineTo(-1, 1);
        // shape.closePath();


        // 하트모양
        const x = -2.5, y = -5;
        shape.moveTo(x + 2.5, y + 2.5);
        shape.bezierCurveTo(x + 2.5, y + 1, x + 1.5, y, x, y);
        shape.bezierCurveTo(x - 3, y, x - 3, y + 2.5, x - 3, y + 2.5);
        shape.bezierCurveTo(x - 3, y + 4, x - 1.5, y + 6, x + 2.5, y + 8);
        shape.bezierCurveTo(x + 6, y + 6, x + 8, y + 4, x + 8, y + 2.5);
        shape.bezierCurveTo(x + 8, y + 2.5, x + 8, y, x + 5, y);
        shape.bezierCurveTo(x + 3, y, x + 2.5, y + 1, x + 2.5, y + 2.5);
        shape.closePath(); 


        const geometry = new Three.BufferGeometry();
        const points = shape.getPoints();
        geometry.setFromPoints(points);
        
        const material = new Three.LineBasicMaterial({ color: 0xffff00 });
        const line = new Three.Line(geometry, material);
        
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

        // 주석시 cube가 회전하지 않습니다.
        // this._cube.rotation.x = time; 
        // this._cube.rotation.y = time; 
    }

}


window.onload = () => {
    new App();
}