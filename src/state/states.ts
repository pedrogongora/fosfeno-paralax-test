import * as PIXI from 'pixi.js';
import * as fosfeno from 'fosfeno';
import { PlayerEntityFactory } from '../factory';
import { LevelRenderSystem } from '../graphics';
import { InputSystem } from '../input';
import { MatterPhysicsSystem } from '../physics';


export class SimpleLevelState extends fosfeno.GameState {

    readonly imageResources: string[];
    readonly soundResources: string[];

    private systems:        fosfeno.System[];
    private tilemap:        fosfeno.TiledTilemapManager;

    private textures =      'img_32/textures.json';
    private level =         'img_32/simple-level.json';
    private tileset =       'img_32/basic-tileset.json';

    constructor(engine: fosfeno.Engine, loadResoures: boolean) {
        super(engine, loadResoures);
        this.imageResources = [
            this.textures,
            this.level,
            this.tileset,
            'img_32/oxygen-sans.fnt',
            'img_32/play.fnt',
            'img_32/quantico.fnt',
        ];
        this.soundResources = [];
        this.setResourceUrls(this.imageResources, this.soundResources);

        this.properties.set( 'textures', this.textures );
        this.properties.set( 'level',    this.level );
        this.properties.set( 'tileset',  this.tileset );
        //PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    }

    init(): void {
        this.tilemap = new fosfeno.TiledTilemapManager( this.engine, this.level, this.tileset );
        this.properties.set( 'tilemap', this.tilemap );

        const player = this.engine.scene.add(
            new PlayerEntityFactory(
                this.engine,
                this.engine.scene.cameras[0],
                4*this.tilemap.tileSize + this.tilemap.tileSize/2,
                2*this.tilemap.tileSize + this.tilemap.tileSize/2,
                499,
                this.engine.scene.mainLayer
            )
        );
        this.properties.set( 'player', player );

        this.createSystems();
    }

    private createSystems() {
        this.systems = [
            new InputSystem( this.engine ),
            new MatterPhysicsSystem( this.engine ),
            new LevelRenderSystem( this.engine ),
        ];
    }

    getSystems(): fosfeno.System[] {
        return this.systems;
    }

    stage(): void {
    }

    unstage(): void {
    }

    destroy(): void {
        PIXI.Loader.shared.reset();
    }

}
