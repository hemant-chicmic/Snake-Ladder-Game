import { _decorator, AudioSource, Component, director, Node, tween, Tween, Vec3 } from 'cc';
import { switchSoundButton } from './Utility';
const { ccclass, property } = _decorator;
import { playerSelectionScene, GameplayScene } from './constants';

@ccclass('Loading')
export class Loading extends Component {

    @property({type : Node})
    snakeLadderLogo : Node | null = null ;

    @property({type : Node})
    playIcon : Node | null = null ;


    @property({type :Node})
    OffAudio_icon : Node | null = null ;

    @property({type :Node})
    OnAudio_icon : Node | null = null ;

    @property( {type : AudioSource} )
    backgroundMusic: AudioSource | null = null; 



   

    OnOffMusicButton()
    {
        if( this.backgroundMusic.playing ) this.backgroundMusic.stop() ;
        else this.backgroundMusic.play() ;

        switchSoundButton(this.OnAudio_icon, this.OffAudio_icon, ! this.OnAudio_icon.active);
    }


    playGame()
    {
        Tween.stopAll() ;
        console.log( " playe game ") ;
        director.loadScene( playerSelectionScene ) ;
    }

    start()
    {
        this.backgroundMusic.play() ;
        this.SnakeAndladderLogoAnimation() ;
        this.playIconAnimation() ;
    }

    // Fix this code to run tween in infinite @chandan
    // // make tween animatiojn infinit without update funciton
    SnakeAndladderLogoAnimation()
    {
        tween(this.snakeLadderLogo)
        .repeatForever(
            tween()
            .to(0.7 , { scale: new Vec3(1.1 , 1.1 , 1.1) } )
            .to(0.7 , { scale: new Vec3(1 , 1 , 1) }, {
                easing: 'smooth',
                onComplete: () => { 
                }
            })
        )
        .start()
    }
    
    
    // Fix this code to run tween in infinite @chandan
    // // make tween animatiojn infinit without update funciton
    playIconAnimation()
    {
        tween(this.playIcon)
        .repeatForever(
            tween()
            .to(2 , { scale: new Vec3(1.2 , 1.2 , 1.2) } )
            .to(2 , { scale: new Vec3(1 , 1 , 1) }, {
                easing: 'smooth',
                onComplete: () => {
                }
            })
        )
        .start()
    }









}

