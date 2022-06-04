import * as PIXI from 'pixi.js';
import * as fosfeno from 'fosfeno';



abstract class BaseInputSystem extends fosfeno.System {

    readonly touchPointer: fosfeno.Entity;
    private touchHandlers: { start: (ev: TouchEvent)=>void, move: (ev: TouchEvent)=>void, end: (ev: TouchEvent)=>void };

    constructor(engine: fosfeno.Engine) {
        super(engine);
        //this.touchPointer = engine.entityManager.createNewEntity();
        //this.touchPointer.addComponent( new PositionComponent(0, 0, 'screen', 0) ); // TODO: mainLayer
    }

    update(delta: number) {
    }

    stage(): void {
        this.setupKeys();
        this.setupTouch();
        this.setupMouse();
    }
    
    unstage(): void {
        this.cleanKeys();
        this.cleanTouch();
        this.cleanMouse();
    }

    cleanup() {}

    destroy() {
    }

    protected registerKeys() {
    }

    protected registerTouch() {
        this.touchHandlers = {
            start: touchStart.bind(this),
            move: touchMove.bind(this),
            end: touchEnd.bind(this)
        };
    }

    private setupKeys() {
        this.engine.input.keyboard.listenBasicStatus();
        this.registerKeys();
    }

    private setupTouch() {
        this.engine.input.mobile.listenBasicStatus();
        this.registerTouch();
        if ( this.touchHandlers ) {
            this.engine.input.mobile.registerMobileEvent({
                eventType: "touchstart",
                //callback: this.touchHandlers.start,,
                publishGameEvents: true,
                target: this.engine.pixiApp.view
            });

            this.engine.input.mobile.registerMobileEvent({
                eventType: "touchmove",
                //callback: this.touchHandlers.move,
                publishGameEvents: true,   
                target: this.engine.pixiApp.view
            });
            this.engine.input.mobile.registerMobileEvent({
                eventType: "touchend",
                //callback: this.touchHandlers.end,
                publishGameEvents: true,
                target: this.engine.pixiApp.view
            });
        }
    }

    private setupMouse() {
        this.engine.input.mouse.listenBasicStatus();
        this.engine.input.mouse.registerMouseEvent({
            eventType: 'mousedown',
            callback: mousedown.bind(this),
            publishGameEvents: true
        });
        this.engine.input.mouse.registerMouseEvent({
            eventType: 'mouseup',
            callback: mouseup.bind(this),
            publishGameEvents: true
        });
        this.engine.input.mouse.registerMouseEvent({
            eventType: 'mousemove',
            callback: mousemove.bind(this),
            publishGameEvents: true,
            //throttle: 100
        });
        this.engine.input.mouse.registerMouseEvent({
            eventType: 'click',
            publishGameEvents: true
        });
        this.engine.input.mouse.registerMouseEvent({
            eventType: 'contextmenu',
            passive: false,
            preventDefault: true,
            stopPropagation: true
        });
    }

    private cleanKeys() {
        this.engine.input.keyboard.stopListeningingBasicStatus();
        this.engine.input.keyboard.unregisterAll();
    }

    private cleanTouch() {
        this.engine.input.mobile.stopListeningBasicStatus();
        this.engine.input.mobile.unregisterAll();
    }

    private cleanMouse() {
        this.engine.input.mouse.stopListeningingBasicStatus();
        this.engine.input.mouse.unregisterAll();
    }
}



export class InputSystem extends BaseInputSystem {

    registerKeys() {
        this.engine.input.keyboard.registerKeyEventHandler({
            key: 'ArrowUp',
            publishGameEvents: true,
        });
        this.engine.input.keyboard.registerKeyEventHandler({
            key: 'ArrowDown',
            publishGameEvents: true,
        });
        this.engine.input.keyboard.registerKeyEventHandler({
            key: 'ArrowLeft',
            publishGameEvents: true,
        });
        this.engine.input.keyboard.registerKeyEventHandler({
            key: 'ArrowRight',
            publishGameEvents: true,
        });
        this.engine.input.keyboard.registerKeyEventHandler({
            key: 'f',
            publishGameEvents: true,
            keyupGameEventType: 'Fullscreen'
        });
        this.engine.input.keyboard.registerKeyEventHandler({
            key: '.',
            publishGameEvents: true,
            keyupGameEventType: 'RenderDebug'
        });
    }

    update(delta: number) {
        /* const keys = this.engine.input.keyboard.keyboardStatus.keys;
        const orientation = this.engine.input.mobile.mobileStatus.orientation;
        const inputComponents = this.getComponentsOfClass( InputComponent );
        inputComponents.forEach((input: InputComponent) => {
            input.up = keys[ 'ArrowUp' ] === true;
            input.down = keys[ 'ArrowDown' ] === true;
            input.left = keys[ 'ArrowLeft' ] === true;
            input.right = keys[ 'ArrowRight' ] === true;
            input.space = keys[ 'Space' ] === true;
            keys[ 'Space' ] = false;
            if ( orientation ) {
                input.alpha = orientation.alpha;
                input.beta = orientation.beta;
                input.gamma = orientation.gamma;
            }
        }); */
    }
}



function touchStart(ev: TouchEvent) {
    const inputComponents = this.getEntitiesBySignature([fosfeno.InputComponent], [fosfeno.PositionComponent]);
    inputComponents.forEach((entity: fosfeno.Entity, input: fosfeno.InputComponent, position: fosfeno.PositionComponent) => {
        input.touch = true;
        if ( position && position.type === 'screen' && ev.changedTouches.length === 1 ) {
            position.x = ev.changedTouches[0].clientX / this.engine.pixiApp.renderer.resolution;
            position.y = ev.changedTouches[0].clientY / this.engine.pixiApp.renderer.resolution;
        }
    });
    const pointer = <fosfeno.PositionComponent> this.engine.entityManager.getEntityComponentOfClass( fosfeno.PositionComponent, this.touchPointer );
    pointer.x = ev.changedTouches[0].clientX / this.engine.pixiApp.renderer.resolution;
    pointer.y = ev.changedTouches[0].clientY / this.engine.pixiApp.renderer.resolution;
    this.publishEvent({
        type: 'TouchStart',
        msg: { x: ev.changedTouches[0].clientX / this.engine.pixiApp.renderer.resolution, y: ev.changedTouches[0].clientY / this.engine.pixiApp.renderer.resolution }
    });
}



function touchMove(ev: TouchEvent) {
    const inputComponents = this.getEntitiesBySignature([fosfeno.InputComponent], [fosfeno.PositionComponent]);
    inputComponents.forEach((entity: fosfeno.Entity, input: fosfeno.InputComponent, position: fosfeno.PositionComponent) => {
        input.touch = true;
        if ( position && position.type === 'screen' && ev.changedTouches.length === 1 ) {
            position.x = ev.changedTouches[0].clientX / this.engine.pixiApp.renderer.resolution;
            position.y = ev.changedTouches[0].clientY / this.engine.pixiApp.renderer.resolution;
        }
    });
    const pointer = <fosfeno.PositionComponent> this.engine.entityManager.getEntityComponentOfClass( fosfeno.PositionComponent, this.touchPointer );
    pointer.x = ev.changedTouches[0].clientX / this.engine.pixiApp.renderer.resolution;
    pointer.y = ev.changedTouches[0].clientY / this.engine.pixiApp.renderer.resolution;
    this.publishEvent({
        type: 'TouchMove',
        msg: { x: ev.changedTouches[0].clientX / this.engine.pixiApp.renderer.resolution, y: ev.changedTouches[0].clientY / this.engine.pixiApp.renderer.resolution }
    });
}



function touchEnd(ev: TouchEvent) {
    const inputComponents = this.getEntitiesBySignature([fosfeno.InputComponent], [fosfeno.PositionComponent]);
    inputComponents.forEach((entity: fosfeno.Entity, input: fosfeno.InputComponent, position: fosfeno.PositionComponent) => {
        input.touch = false;
        if ( position && position.type === 'screen' && ev.changedTouches.length === 1 ) {
            position.x = ev.changedTouches[0].clientX / this.engine.pixiApp.renderer.resolution;
            position.y = ev.changedTouches[0].clientY / this.engine.pixiApp.renderer.resolution;
        }
    });
    const pointer = <fosfeno.PositionComponent> this.engine.entityManager.getEntityComponentOfClass( fosfeno.PositionComponent, this.touchPointer );
    pointer.x = ev.changedTouches[0].clientX / this.engine.pixiApp.renderer.resolution;
    pointer.y = ev.changedTouches[0].clientY / this.engine.pixiApp.renderer.resolution;
    this.publishEvent({
        type: 'TouchEnd',
        msg: { x: ev.changedTouches[0].clientX / this.engine.pixiApp.renderer.resolution, y: ev.changedTouches[0].clientY / this.engine.pixiApp.renderer.resolution }
    });
}

function mousemove(ev: MouseEvent) {
    let inputComponents = this.engine.entityManager.getComponentsOfClass(fosfeno.InputComponent);
    if ( inputComponents ) {
        inputComponents.forEach((component: fosfeno.InputComponent) => {
            component.mouseX = ev.clientX / this.engine.pixiApp.renderer.resolution;
            component.mouseY = ev.clientY / this.engine.pixiApp.renderer.resolution;
        });
    }
}

function mousedown(ev: MouseEvent) {
    let inputComponents = this.engine.entityManager.getComponentsOfClass(fosfeno.InputComponent);
    if ( inputComponents ) {
        inputComponents.forEach((component: fosfeno.InputComponent) => {
            if ( ev.button === 0 ) {
                component.mouseLeft = true;
            } else if ( ev.button === 1 ) {
                component.mouseMiddle = true;
            } else if ( ev.button === 2 ) {
                component.mouseRight = true;
            }
            component.mouseX = ev.clientX / this.engine.pixiApp.renderer.resolution;
            component.mouseY = ev.clientY / this.engine.pixiApp.renderer.resolution;
        });
    }
}

function mouseup(ev: MouseEvent) {
    let inputComponents = this.engine.entityManager.getComponentsOfClass(fosfeno.InputComponent);
    if ( inputComponents ) {
        inputComponents.forEach((component: fosfeno.InputComponent) => {
            if ( ev.button === 0 ) component.mouseLeft = false;
            component.mouseX = ev.clientX / this.engine.pixiApp.renderer.resolution;
            component.mouseY = ev.clientY / this.engine.pixiApp.renderer.resolution;
        });
    }
}