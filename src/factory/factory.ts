import { BodyEntityFactory, Engine, Camera, CirceShape, Component, SpriteAnimationStep, SpriteAnimation, AnimationsComponent, SpriteComponent, RenderPhysicsAngle } from "fosfeno";



export class PlayerEntityFactory extends BodyEntityFactory {
    
    constructor( engine: Engine, camera: Camera, x: number, y: number, z: number, layer: number ) {
        super(
            engine,
            camera,
            x,
            y,
            z,
            layer,
            [
                'player.png'
            ],
            new CirceShape( 0, 0, 16 ),
            {
                density: 0.01,
                friction: 0.1,
                frictionStatic: 5,
                frictionAir: 0.01,
                restitution: 0.3
            }
        );
    }

    protected createComponents(): Component[] {
        const components = super.createComponents();

        const steps: SpriteAnimationStep[] = [
            {
                property: 'alpha',
                from: 1.0,
                to: 0.2,
                duration: 200,
                easing: 'in-cubic'
            },
            {
                property: 'alpha',
                from: 0.2,
                to: 1.0,
                duration: 200,
                easing: 'out-cubic'
            }
        ];
        const animation = new SpriteAnimation();
        animation.loop = true;
        animation.off = true;
        animation.steps = steps;
        animation.visibleWhenOff = true;
        const animations = new AnimationsComponent( [animation] );

        components.forEach(c => {
            if ( c instanceof SpriteComponent ) {
                c.anchor = { x: 0.5, y: 0.5 };
            }
        });

        return components.concat( [animations, new RenderPhysicsAngle()] );
    }
}