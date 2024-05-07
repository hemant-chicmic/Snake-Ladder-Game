import { _decorator, AudioSource, Component, director, Node, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('firstScreen')
export class firstScreen extends Component {


    
    @property({type :Node})
    OffAudio_icon : Node | null = null ;
    @property({type :Node})
    OnAudio_icon : Node | null = null ;


    @property( {type : AudioSource} )
    backgroundMusic: AudioSource | null = null; 

    start() {

    }

    update(deltaTime: number) {
        
    }


    OnOffMusicButton()
    {
        if( this.backgroundMusic.playing ) this.backgroundMusic.stop() ;
        else this.backgroundMusic.play() ;

        if( this.OnAudio_icon.active )
        {
            this.OnAudio_icon.active = false ;
            this.OffAudio_icon.active = true ;
        }
        else
        {
            this.OnAudio_icon.active = true ;
            this.OffAudio_icon.active = false ;
        }
    }


    playGame()
    {
        Tween.stopAll() ;
        console.log( " playe game ") ;
        director.loadScene( 'secondScene' ) ;
    }









}

