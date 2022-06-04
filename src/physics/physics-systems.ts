import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import * as fosfeno from 'fosfeno';


let fps = 60;
let dt = 1000 / fps;

const min = (a: number, b: number) => { return a < b ? a : b };
const max = (a: number, b: number) => { return a > b ? a : b };


export class MatterPhysicsSystem extends fosfeno.System {

    private scene: fosfeno.Scene;
    private matterEngine: Matter.Engine;
    private subscriptions: [string, (e: fosfeno.GameEvent) => void][];

    constructor(engine: fosfeno.Engine) {
        super(engine);
        this.scene = engine.scene;
        this.matterEngine = this.scene.physicsEngine;
        this.subscriptions = [
            ['KeyDown-ArrowLeft', this.onKeyLeft.bind(this)],
            ['KeyDown-ArrowRight', this.onKeyRight.bind(this)],
            ['KeyDown-ArrowUp', this.onKeyUp.bind(this)],
            ['TouchStart', this.onKeyUp.bind(this)],
            ['MouseClick', this.onKeyUp.bind(this)],
            ['TriggerEnter', this.onTriggerEnter.bind(this)],
            ['TriggerActive', this.onTrigger.bind(this)],
            ['TriggerLeave', this.onTriggerLeave.bind(this)],
        ];
        this.initMatterWorld();
        engine.pixiApp.ticker.maxFPS = fps;
    }

    update(delta: number): void {
        let a = 0,
            alpha = this.engine.input.mobile.mobileStatus.orientation.alpha,
            beta  = this.engine.input.mobile.mobileStatus.orientation.beta,
            gamma = this.engine.input.mobile.mobileStatus.orientation.gamma;
        a = beta;
        a = a * Math.PI / 180;
        let gx = 1.5*Math.sin( a );
        let gy = 1;
        this.matterEngine.world.gravity.x = gx;
        this.matterEngine.world.gravity.y = gy;

        Matter.Engine.update( this.matterEngine, dt/3 );
        Matter.Engine.update( this.matterEngine, dt/3 );
        Matter.Engine.update( this.matterEngine, dt/3 );

        const entities = new fosfeno.EntitySignature(
            this.engine,
            [fosfeno.PositionComponent, fosfeno.FixtureComponent],
            []
        );
        entities.forEach((entity: fosfeno.Entity, position: fosfeno.PositionComponent, fixture: fosfeno.FixtureComponent) => {
            position.x = fixture.physicsObject.position.x + fixture.shape.offsetx;
            position.y = fixture.physicsObject.position.y + fixture.shape.offsety;
        });
    }

    stage(): void {
        this.subscribeToEvents( this.subscriptions );
    }
    
    unstage(): void {
        this.unsubscribeToEvents( this.subscriptions );
    }

    cleanup(): void {}

    destroy(): void {}

    private initMatterWorld() {
        const matterWorld = this.matterEngine.world;
        matterWorld.gravity.x = 0.0;
        matterWorld.gravity.y = 1;
    }

    private onKeyLeft(event: fosfeno.GameEvent) {
        const player: fosfeno.Entity = this.engine.stateProperties.get( 'player' );
        const fixture = <fosfeno.FixtureComponent> player.getComponentOfClass( fosfeno.FixtureComponent );
        fixture.physicsObject.torque = -5;
    }
    private onKeyRight(event: fosfeno.GameEvent) {
        const player: fosfeno.Entity = this.engine.stateProperties.get( 'player' );
        const fixture = <fosfeno.FixtureComponent> player.getComponentOfClass( fosfeno.FixtureComponent );
        fixture.physicsObject.torque = 5;
    }
    private onKeyUp(event: fosfeno.GameEvent) {
        const player: fosfeno.Entity = this.engine.stateProperties.get( 'player' );
        const fixture = <fosfeno.FixtureComponent> player.getComponentOfClass( fosfeno.FixtureComponent );
        fixture.physicsObject.force.y = -0.3;
        if ( event.type === 'TouchStart' ) {
            this.publishEvent({ type: 'RenderDebug', msg: undefined });
        }
    }

    private onTrigger(event: fosfeno.GameEvent) {
    }

    private onTriggerEnter(event: fosfeno.GameEvent) {
        const player: fosfeno.Entity = this.engine.stateProperties.get( 'player' );
        const animations = <fosfeno.AnimationsComponent> player.getComponentOfClass( fosfeno.AnimationsComponent );
        animations.animations.forEach(a => { a.off = false });
    }

    private onTriggerLeave(event: fosfeno.GameEvent) {
        const player: fosfeno.Entity = this.engine.stateProperties.get( 'player' );
        const animations = <fosfeno.AnimationsComponent> player.getComponentOfClass( fosfeno.AnimationsComponent );
        animations.animations.forEach(a => { a.off = true });
        const sprite = <fosfeno.SpriteComponent> player.getComponentOfClass( fosfeno.SpriteComponent );
        sprite.alpha = 1.0;
    }
}