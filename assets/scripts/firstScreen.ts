import { _decorator, AudioSource, Component, director, Node, tween, Tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('firstScreen')
export class firstScreen extends Component {


    
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



    private isAnimatingSnakeAndladderLogo : boolean = false ;
    private isAnimatingPlayIcon : boolean = false ;

    
    

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


    SnakeAndladderLogoAnimation()
    {
        // let snakeLadderLogoX = this.snakeLadderLogo.position.x ;
        // let snakeLadderLogoY = this.snakeLadderLogo.position.y ;
        this.isAnimatingSnakeAndladderLogo = true ;
        tween(this.snakeLadderLogo)
        .to(0.7 , { scale: new Vec3(1.1 , 1.1 , 1.1) } )
        .to(0.7 , { scale: new Vec3(1 , 1 , 1) }, {
            easing: 'smooth',
            onComplete: () => { 
                this.isAnimatingSnakeAndladderLogo = false ;
            }
        })
        .start();
    }
    
    playIconAnimation()
    {
        // let playIconX = this.playIcon.position.x ;
        // let playIconY = this.playIcon.position.y ;
        this.isAnimatingPlayIcon = true ;
        tween(this.playIcon)
        .to(2 , { scale: new Vec3(1.2 , 1.2 , 1.2) } )
        .to(2 , { scale: new Vec3(1 , 1 , 1) }, {
            easing: 'smooth',
            onComplete: () => { 
                this.isAnimatingPlayIcon = false ;
            }
        })
        .start();
    }






    start() {

    }

    update(deltaTime: number) 
    {
        if( ! this.isAnimatingSnakeAndladderLogo ) this.SnakeAndladderLogoAnimation() ;
        if( ! this.isAnimatingPlayIcon ) this.playIconAnimation() ;
    }







}

