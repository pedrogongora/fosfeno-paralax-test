import * as fosfeno from 'fosfeno';
import * as states from './state/states';


declare let window: any;

window.addEventListener('load', function () {
    const engine = new fosfeno.Engine({
        pixiProperties: {
            width: 640,
            height: 288,
            resizeTo: null,
            resolution: 1,
            antialias: false,
            backgroundColor: 0x000000,
        }
    });
    const container = document.getElementById('container');
    container.appendChild( engine.pixiApp.view );

    const sts: fosfeno.StateTransitionDescription = {
        start: 'SimpleLevelState',
        startLoadResources: true,
        transitions: [
            /* {
                current:        'StartLevelState',
                event:          'StartLevel',
                next:           'RandomLevelState',
                destroyCurrent: true,
                forceNewNext:   true,
                resetEngine:    false,
                loadResources:  false
            },
            {
                current:        'RandomLevelState',
                event:          'Reset',
                next:           'StartLevelState',
                destroyCurrent: true,
                forceNewNext:   true,
                resetEngine:    true,
                loadResources:  true
            },
            {
                current:        'RandomLevelState',
                event:          'Pause',
                next:           'PauseState',
                destroyCurrent: false,
                forceNewNext:   true,
                resetEngine:    false,
                loadResources:  false
            },
            {
                current:        'PauseState',
                event:          'Reset',
                next:           'StartLevelState',
                destroyCurrent: true,
                forceNewNext:   true,
                resetEngine:    true,
                loadResources:  true
            },
            {
                current:        'PauseState',
                event:          'Pause',
                next:           'RandomLevelState',
                destroyCurrent: true,
                forceNewNext:   false,
                resetEngine:    false,
                loadResources:  false
            },
            {
                current:        'RandomLevelState',
                event:          'GoalReached',
                next:           'GoalReachedState',
                destroyCurrent: false,
                forceNewNext:   true,
                resetEngine:    false,
                loadResources:  false
            },
            {
                current:        'GoalReachedState',
                event:          'NextLevel',
                next:           'StartLevelState',
                destroyCurrent: true,
                forceNewNext:   true,
                resetEngine:    true,
                loadResources:  true
            },
            {
                current:        'RandomLevelState',
                event:          'PlayerDied',
                next:           'PlayerDiedState',
                destroyCurrent: false,
                forceNewNext:   true,
                resetEngine:    false,
                loadResources:  false
            },
            {
                current:        'PlayerDiedState',
                event:          'Reset',
                next:           'StartLevelState',
                destroyCurrent: true,
                forceNewNext:   true,
                resetEngine:    true,
                loadResources:  true
            }, */
        ]
    };

    engine.setTransitionSystem( sts, states );
    engine.start();
    window.engine = engine;
});