// Three.js를 import합니다.
import * as Three from '../../build/three.module.js';
import { OrbitControls } from 'https://esm.sh/three@0.157.0/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'https://esm.sh/three@0.157.0/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'https://esm.sh/three@0.157.0/examples/jsm/helpers/RectAreaLightHelper.js';

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
        // PerspectiveCamera 원근감이 있어 가까운물체는 크게, 먼 물체는 작게 보인다. 실제사람의 눈과 같다.
        const camera = new Three.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100    
        )
        // camera.zoom = 0.15;

        // OrthographicCamera 원근감이 없어 거리에 상관없이 물체가 같은 크기로 보인다. 도면이나 설계도에 적합하다
        // const aspect = window.innerWidth / window.innerHeight;
        // const camera = new Three.OrthographicCamera(
        //     -1*aspect, 1*aspect,
        //     1, -1, 
        //     0.1, 100    
        // )
        // camera.zoom = 0.15;


        camera.position.set(7, 7, 0); 
        camera.lookAt(0, 0, 0); 
        this._camera = camera; 
    }
    
    _setupLight() {
        RectAreaLightUniformsLib.init();
        const light = new Three.RectAreaLight(0xffffff, 10, 6, 0.5); 
        light.position.set(0, 5, 0);
        light.rotation.x = Three.MathUtils.degToRad(-90);
        
        const helper = new RectAreaLightHelper(light);
        light.add(helper);

       this._scene.add(light); 
       this._light = light; 
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
        this._scene.add(ground); 

        const bigSphereGeometry = new Three.SphereGeometry(1.5, 64, 64, 0, Math.PI); 
        const bigSphereMaterial = new Three.MeshStandardMaterial({ 
            color: 0x00ff00, 
            roughness: 0.1, 
            metalness: 0.2 
        }); 
        const bigSphere = new Three.Mesh(bigSphereGeometry, bigSphereMaterial); 
        bigSphere.rotation.x = Three.MathUtils.degToRad(-90); 
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
        this._scene.add(smallSpherePivot); 

        // targetPivot 추가 회전하는 구와 흡사하게 만들었다.
        const targetPivot = new Three.Object3D;
        const target = new Three.Object3D;
        targetPivot.add(target);
        targetPivot.name = "targetPivot";
        target.position.set(3, 0.5, 0);
        this._scene.add(targetPivot);

       }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight; 
        const aspect = width / height;

        // this._camera.aspect = width / height; // 카메라 종횡비 설정

        // 카메라의 유형에 따라 설정을 달리할 수 있다.
        if(this._camera instanceof Three.PerspectiveCamera){
            this._camera.aspect = aspect;
        } else{
            this._camera.left = -1 * aspect;
            this._camera.right = 1 * aspect;
        }

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

        const smallSpherePivot = this._scene.getObjectByName("smallSpherePivot"); // 작은 구 피벗 가져오기
        if (smallSpherePivot) {
            smallSpherePivot.rotation.y = Three.MathUtils.degToRad(time*50); // 작은 구 피벗 회전

            // 카메라의 위치가 회전하는 구에 맞췄다.
            const smallSphere = smallSpherePivot.children[0];
            smallSphere.getWorldPosition(this._camera.position);

            const targetPivot = this._scene.getObjectByName("targetPivot");
            if(targetPivot){
                targetPivot.rotation.y = Three.MathUtils.degToRad(time*50 + 10);

                const target = targetPivot.children[0];
                const pt = new Three.Vector3();
                target.getWorldPosition(pt);
                this._camera.lookAt(pt);
            }

             if(this._light.target){
                const smallSphere = smallSpherePivot.children[0];
                smallSphere.getWorldPosition(this._light.target.position);
                if(this._lightHelper) this._lightHelper.update();
            }
        }   
       
    }

}


window.onload = () => {
    new App();
}