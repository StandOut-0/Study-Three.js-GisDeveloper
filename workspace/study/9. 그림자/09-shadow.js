
import * as Three from '../../build/three.module.js';
import { OrbitControls } from 'https://esm.sh/three@0.157.0/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'https://esm.sh/three@0.157.0/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'https://esm.sh/three@0.157.0/examples/jsm/helpers/RectAreaLightHelper.js';

class App{
    constructor() {

        const divContainer = document.getElementById('webgl-container');
        this._divContainer = divContainer;
       
        const renderer = new Three.WebGLRenderer({ antialias: true });       renderer.setPixelRatio(window.devicePixelRatio);
        
        // 그림자맵 활성화
        // 그림자 설정을 위해 renderer 설정 추가
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        
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
        const camera = new Three.PerspectiveCamera(
            75, 
            window.innerWidth / Window.innerHeight, 
            0.1, 
            100 
        );

        camera.position.set(7, 7, 0); 
        camera.lookAt(0, 0, 0); 
        this._camera = camera; 
    }

    
    _setupLight() {
       
        // RectAreaLightUniformsLib.init();
        // const light = new Three.RectAreaLight(0xffffff, 10, 6, 0.5); 
        // light.position.set(0, 5, 0);
        // light.rotation.x = Three.MathUtils.degToRad(-90);
        
        // const helper = new RectAreaLightHelper(light);
        // light.add(helper);

        // const light = new Three.DirectionalLight(0xffffff, 0.5);
        // light.target.position.set(0, 0, 0);    
        // this._scene.add(light.target);

       // PointLight 
        // const light = new Three.PointLight(0xffffff, 1);
        // light.position.set(0, 5, 0);

        // SpotLight
        const light = new Three.SpotLight(0xffffff,50);
        light.position.set(0, 5, 0);
        light.target.position.set(0, 0, 0);    
        light.angle = Three.MathUtils.degToRad(30);
        light.penumbra = 0.2;
        this._scene.add(light.target);

        // 그림자가 짤리지않기 위한 설정
        // 카메라의 절두체를 벗어나는 객체는 모두 잘려나가게 되기때문에 잘려나갈수있다.
        light.shadow.camera.top = light.shadow.camera.right = 6;
        light.shadow.camera.bottom = light.shadow.camera.left = -6;

        // 그림자의 경계가 매우 선명해진다.
        light.shadow.mapSize.width = light.shadow.mapSize.height = 2048;
        
        // 그림자에 블러처리를 한다.
        light.shadow.radius = 30;

        const cameraHelper = new Three.CameraHelper(light.shadow.camera);
        this._scene.add(cameraHelper);

       this._scene.add(light); 
       this._light = light; 

       // 광원에서 그림자 여부 활성화
       light.castShadow = true;
    }

    _setupModel() {
        const groudGeometry = new Three.PlaneGeometry(10, 10); 
        const groundMaterial = new Three.MeshStandardMaterial({ 
            color: 0x808080,
            roughness: 0.5, 
            metalness: 0.1, 
            side: Three.DoubleSide 
         }); 

        const ground = new Three.Mesh(groudGeometry, groundMaterial); 
        ground.rotation.x = Three.MathUtils.degToRad(-90); 

        // ground에서 그림자를 표현하도록 활성화
        ground.receiveShadow = true;

        this._scene.add(ground); 

        // const bigSphereGeometry = new Three.SphereGeometry(1.5, 64, 64, 0, Math.PI); 
        const bigSphereGeometry = new Three.TorusKnotGeometry(1, 0.3, 128, 64, 2, 3); 
        const bigSphereMaterial = new Three.MeshStandardMaterial({ 
            color: "#ffffff", 
            roughness: 0.1, 
            metalness: 0.2 
        }); 
        const bigSphere = new Three.Mesh(bigSphereGeometry, bigSphereMaterial); 
        // bigSphere.rotation.x = Three.MathUtils.degToRad(-90); 
        bigSphere.position.y = 1.6;
        
        // 토러스가 그림자를 표현하도록 활성화
        bigSphere.castShadow = true; // 그림자를 만들기도 하고
        bigSphere.receiveShadow = true; // 그림자를 표현하기도 함

        this._scene.add(bigSphere); 

        const torusGeometry = new Three.TorusGeometry(0.4, 0.1, 32, 32); 
        const torusMaterial = new Three.MeshStandardMaterial({
            color: 0xff0000, 
            roughness: 0.5, 
            metalness: 0.1 
        }); 

        for (let i = 0; i < 8; i++) {
            const tourusPivot = new Three.Object3D(); 
            const torus = new Three.Mesh(torusGeometry, torusMaterial); 
            tourusPivot.rotation.y = Three.MathUtils.degToRad(45 * i); 
            torus.position.set(3, 0.5, 0); 
            tourusPivot.add(torus); 

            // 그림자를 표현하도록 활성화
            torus.castShadow = true; // 그림자를 만들기도 하고
            torus.receiveShadow = true; // 그림자를 표현하기도 함

            this._scene.add(tourusPivot); 
        }

        const smallSphereGeometry = new Three.SphereGeometry(0.3, 32, 32); 
        const smallSphereMaterial = new Three.MeshStandardMaterial({
            color: 0x0000ff, 
            roughness: 0.5, 
            metalness: 0.1 
        }); 

        const smallSpherePivot = new Three.Object3D(); 
        const smallSphere = new Three.Mesh(smallSphereGeometry, smallSphereMaterial);
        smallSphere.position.set(3, 0.5, 0); 
        smallSpherePivot.add(smallSphere);
        smallSpherePivot.name = "smallSpherePivot";

         // 그림자를 표현하도록 활성화
        smallSphere.castShadow = true; // 그림자를 만들기도 하고
        smallSphere.receiveShadow = true; // 그림자를 표현하기도 함

        this._scene.add(smallSpherePivot); 
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

        const smallSpherePivot = this._scene.getObjectByName("smallSpherePivot"); 
        if (smallSpherePivot) {
            smallSpherePivot.rotation.y = Three.MathUtils.degToRad(time*50); 

             if(this._light.target){
                const smallSphere = smallSpherePivot.children[0];
                smallSphere.getWorldPosition(this._light.target.position);
                if(this._lightHelper) this._lightHelper.update();
            }

            // PointLight의 위치를 회전하는 구의 위치에 놓이게 한다.
            if(this._light instanceof Three.PointLight){
                const smallSphere = smallSpherePivot.children[0];
                smallSphere.getWorldPosition(this._light.position);
            }
        }   
       
    }

}


window.onload = () => {
    new App();
}