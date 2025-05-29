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
        this._setupModel(); 
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
        camera.position.z = 2; 
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
        const geometry = new Three.BoxGeometry(1, 1, 1, 2, 2, 2); // 세그먼트 수를 늘려서 더 많은 면을 생성해보기

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