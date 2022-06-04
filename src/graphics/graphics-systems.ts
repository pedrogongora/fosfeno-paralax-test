import * as PIXI from 'pixi.js';
import * as fosfeno from 'fosfeno';


export class LevelRenderSystem extends fosfeno.RenderableSystem {

    private renderSubsystem:    fosfeno.BasicRenderSubsystem;
    private animationSubsystem: fosfeno.AnimationSubsystem;
    private tiledSubsystem:     fosfeno.TiledSubsystem;
    private cameraSubsystem:    fosfeno.CameraFollowSubsystem;
    private tilemap:            fosfeno.TiledTilemapManager;
    private player:             fosfeno.Entity;
    private subscriptions:      [string, (event: fosfeno.GameEvent)=>void][];
    private renderDebug:        number = 0;

    constructor(engine: fosfeno.Engine) {
        super(engine);

        this.renderSubsystem = new fosfeno.BasicRenderSubsystem( engine );
        this.animationSubsystem = new fosfeno.AnimationSubsystem( engine );
        const levelCamera = this.engine.scene.cameras[0];
        this.tilemap = this.engine.stateProperties.get('tilemap');
        this.tiledSubsystem = new fosfeno.TiledSubsystem(
            this.engine,
            levelCamera,
            this.tilemap
        );
        this.player = engine.stateProperties.get( 'player' );
        this.cameraSubsystem = new fosfeno.CameraFollowSubsystem(
            engine,
            levelCamera,
            this.player,
            0.4*(levelCamera.width  - this.tilemap.layers[this.engine.scene.mainLayer].offsetx),
            0.4*(levelCamera.height - this.tilemap.layers[this.engine.scene.mainLayer].offsety),
            this.tiledSubsystem.width,
            this.tiledSubsystem.height,
            this.tilemap.layers[this.engine.scene.mainLayer].offsetx,
            this.tilemap.layers[this.engine.scene.mainLayer].offsety
        )

        this.addSubsystem( this.cameraSubsystem );
        this.addSubsystem( this.tiledSubsystem );
        this.addSubsystem( this.animationSubsystem );
        this.addSubsystem( this.renderSubsystem );
        
        this.subscriptions = [
            ['Fullscreen', this.onFullscreen.bind(this)],
            ['RenderDebug', this.onRenderDebug.bind(this)],
            //['KeyDown-ArrowUp', (()=>{this.updateCameraPositionWithKeys('up')}).bind(this)],
            //['KeyDown-ArrowDown', (()=>{this.updateCameraPositionWithKeys('down')}).bind(this)],
            //['KeyDown-ArrowLeft', (()=>{this.updateCameraPositionWithKeys('left')}).bind(this)],
            //['KeyDown-ArrowRight', (()=>{this.updateCameraPositionWithKeys('right')}).bind(this)],
        ];

        //this.subscriptions = [
        //    ['SpaceKeyPress', this.onSpaceKeyPress.bind(this)],
        //    ['SpaceKeyRelease', this.onSpaceKeyRelease.bind(this)],
        //    ['TouchStart', this.onSpaceKeyPress.bind(this)],
        //    ['TouchEnd', this.onSpaceKeyRelease.bind(this)],
        //    ['TouchMove', this.onTouchMove.bind(this)],
        //    ['TouchEnd', this.onTouchEnd.bind(this)],
        //    ['Fullscreen', this.onFullscreen.bind(this)],
        //    ['GoalReached', this.onGoalReached.bind(this)],
        //    ['DeleteEntity', this.onDeleteEntity.bind(this)],
        //    ['MouseDown', this.onMouseDown.bind(this)],
        //    ['MouseUp', this.onMouseUp.bind(this)],
        //];
        //this.touchPointerGraphics = new PIXI.Graphics();
        //this.touchPointerGraphics.zIndex = 100;
        //engine.pixiApp.stage.addChild( this.touchPointerGraphics );
    }
    
    update(delta: number) {
        //this.updateCameraPositionWithMouseCursor();
    }
    
    render(): void {
    }

    stage(): void {
        this.subscribeToEvents( this.subscriptions );
    }
    
    unstage(): void {
        this.unsubscribeToEvents( this.subscriptions );
    }

    cleanup() {
    }

    destroy() {
    }

    private onFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            this.engine.pixiApp.view.requestFullscreen();
        }
    }

    private updateCameraPositionWithKeys(dir: string) {
        const camera: fosfeno.Camera = this.engine.scene.cameras[0];
        const x = camera.layers[this.engine.scene.mainLayer].x;
        const y = camera.layers[this.engine.scene.mainLayer].y;
        if ( dir === 'up' ) camera.setScenePosition(x, y-1);
        else if ( dir === 'down' ) camera.setScenePosition(x, y+1);
        else if ( dir === 'left' ) camera.setScenePosition(x-1, y);
        else if ( dir === 'right' ) camera.setScenePosition(x+1, y);
        let s = '----------------\ncamera:' + `${camera.layers[1].id}: (${camera.layers[1].x}, ${camera.layers[1].y})`;
        camera.layers.forEach(layer => {
            s = s + `  ${layer.id}: (${layer.x}, ${layer.y})`;
        });
        console.log(s);
    }

    private onRenderDebug(event: fosfeno.GameEvent) {
        this.renderDebug = (this.renderDebug + 1) % 4;
        this.renderSubsystem.debugMode = this.renderDebug;
    }
}