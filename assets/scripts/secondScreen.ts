import { _decorator, AudioSource, Component, director, EditBox, Node, Scene, Tween } from 'cc';
const { ccclass, property } = _decorator;

import { createBoard } from './createBoard';

@ccclass('secondScreen')
export class secondScreen extends Component {

    @property({type :Node})
    OffAudio_icon : Node | null = null ;
    @property({type :Node})
    OnAudio_icon : Node | null = null ;



    @property( {type : AudioSource} )
    backgroundMusic: AudioSource | null = null; 

    @property( {type : EditBox} )
    ladderInput : EditBox | null = null ;
    @property( {type : EditBox} )
    snakeInput : EditBox | null = null ;

    @property( {type : Node} )
    startPlayingButton: Node | null = null;

    private userInputLadder : number = 0 ;
    private userInputSnake : number = 0 ;







    start() 
    {
        this.ladderInput.node.on('text-changed', this.onEditBegan, this);
        this.snakeInput.node.on('text-changed', this.onEditBegan, this);
        this.startPlayingButton?.on('click', this.startPlayingButtonClicked, this);
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


    

    onEditBegan() 
    {
        // if ( ! this.ladderInput.string ||  ! this.snakeInput.string) 
        // {
        //     console.log("Please fill in both ladder and snake inputs.");
        //     return ;
        // }
        
        this.userInputLadder = parseInt(this.ladderInput.string) ;
        this.userInputSnake = parseInt(this.snakeInput.string) ;
        console.log( "lad1  " , this.userInputLadder , " sn1 " , this.userInputSnake ) ;
        if( isNaN(this.userInputLadder) || isNaN(this.userInputSnake) ) 
        {
            console.log( "Please enter the valid number " ) ;
            return  ;
        }
        console.log( "lad2  " , this.userInputLadder , " sn2 " , this.userInputSnake ) ;
    }

    startPlayingButtonClicked() 
    {
        console.log( "2nd screen clicked" )
        if ( ! this.ladderInput.string ||  ! this.snakeInput.string ) 
        {
            console.log("Please fill in both ladder and snake inputs.");
            return ;
        }
        if ( this.userInputLadder ==0 || this.userInputSnake == 0 ) 
        {
            console.log("Please give any other number except 0 ");
            return ;
        }
        Tween.stopAll();
        director.loadScene('mainScene', () => {
            // console.log( " 11access "  )
            const ComponentCanvas = director.getScene().getChildByName('Canvas');
            // console.log( " Canvas " , ComponentCanvas )
            const createBoardComponent = ComponentCanvas.getChildByName('BoardBase').getComponent(createBoard);
            // console.log( " BoardBase " , ComponentCanvas.getChildByName('BoardBase') )
            if (createBoardComponent) 
            {
                // console.log("2nd screen     ladder:", this.userInputLadder, "and snake:", this.userInputSnake);
                createBoardComponent.takeInputFromSecondScreen(this.userInputLadder, this.userInputSnake );
            } else
            {
                console.error("createBoard component not found in mainScene!");
            }
        });
    }
}










