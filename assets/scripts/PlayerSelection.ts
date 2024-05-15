import { _decorator, AudioSource, Button, Component, director, EditBox, instantiate, Label, Layout, Node, Prefab, Scene, Sprite, SpriteFrame, Tween } from 'cc';
const { ccclass, property } = _decorator;

import { Singleton } from './manager/Singleton';
import { switchSoundButton } from './Utility';
import { loadScene, GameplayScene } from './constants';

@ccclass('PlayerSelection')
export class PlayerSelection extends Component {

    @property( {type : AudioSource} )
    backgroundMusic: AudioSource | null = null; 

    @property({type :Node})
    OffAudio_icon : Node | null = null ;

    @property({type :Node})
    OnAudio_icon : Node | null = null ;

    @property( {type : EditBox} )
    ladderInput : EditBox | null = null ;
    
    @property( {type : EditBox} )
    snakeInput : EditBox | null = null ;

    @property( {type : Node} )
    TwoplayerMode: Node | null = null;

    @property( {type : Node} )
    ColorOptions: Node | null = null;
    
    @property( {type : Prefab} )
    playersColorsPrefabSecondScreen: Prefab | null = null;

    @property( { type : [SpriteFrame]} )
    colors : SpriteFrame[] = [] ;


    private userInputLadder : number = 0 ;
    private userInputSnake : number = 0 ;

    private playerCount :number = 0 ;
    private  player1 : Node ;
    private  player2 : Node ;



    OnOffMusicButton()
    {
        if( this.backgroundMusic.playing ) this.backgroundMusic.stop() ;
        else this.backgroundMusic.play() ;
        
        switchSoundButton(this.OnAudio_icon, this.OffAudio_icon,  ! this.OnAudio_icon.active);
    }


    start() 
    {
        this.backgroundMusic.play() ;
        for(let i = 0; i<6; i++)
        {
            let colorNode = instantiate( this.playersColorsPrefabSecondScreen ) ;
            colorNode.getComponent(Sprite).spriteFrame = this.colors[i] ;
            colorNode.addComponent(Button) ;
            let colorNodeButtonComponent = colorNode.getComponent(Button) ;
            colorNodeButtonComponent.transition = Button.Transition.SCALE ;
            colorNodeButtonComponent.zoomScale = 0.7 ;
            colorNodeButtonComponent.duration = 0.1 ;
            this.ColorOptions.addChild(colorNode) ; 
            colorNode.on(Button.EventType.CLICK, () => this.playerSelectButton(i), this);
        }

        
        this.ladderInput.node.on(EditBox.EventType.TEXT_CHANGED, this.onEditBegan, this);
        this.snakeInput.node.on(EditBox.EventType.TEXT_CHANGED, this.onEditBegan, this);
        this.TwoplayerMode.on(Button.EventType.CLICK, this.TwoplayerModeClicked, this);
    }
    
    playerSelectButton(index:number)
    {
        this.playerCount ++ ;
        console.log( " player button " , index , " player count " , this.playerCount) ;
        if( this.playerCount == 1 ) console.log("player count1") , this.player1 = this.ColorOptions.children[index] ;
        else if( this.playerCount == 2 )  console.log("player count2") , this.player2 = this.ColorOptions.children[index] ;

        this.ColorOptions.children[index].active = false ;
        let textSelectColorNodelabel = this.ColorOptions.parent.getChildByName('SelectPlayersColorsText');
        if(this.playerCount == 2 )
        {
            this.TwoplayerModeClicked() ;
            return ;
        }
        textSelectColorNodelabel.getComponent(Label).string = `Select Player ${this.playerCount+1} Color` ;
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

    TwoplayerModeClicked() 
    {
        console.log( "2nd screen clicked" )
        if ( ! this.ladderInput.string ||  ! this.snakeInput.string ) 
        {
            console.log("Please fill in both ladder and snake inputs.");
            return ;
        }
        if ( this.userInputLadder == 0 || this.userInputLadder == 50 || this.userInputSnake == 0 || this.userInputSnake == 50 ) 
        {
            console.log("Please give any other number except 0 ");
            return ;
        }
        Tween.stopAll();
        Singleton.getInstance().playerOne = this.player1.getComponent(Sprite).spriteFrame ;
        Singleton.getInstance().playerTwo = this.player2.getComponent(Sprite).spriteFrame ;
        Singleton.getInstance().totalLadders = this.userInputLadder ;
        Singleton.getInstance().totalSnakes = this.userInputSnake ;
        director.loadScene(GameplayScene, () => {
            // console.log( " 11access "  )
            // const ComponentCanvas = director.getScene().getChildByName('Canvas');
            // // console.log( " Canvas " , ComponentCanvas )
            // const createBoardComponent = ComponentCanvas.getChildByName('BoardBase').getComponent(createBoard);
            // // console.log( " BoardBase " , ComponentCanvas.getChildByName('BoardBase') )
            // if (createBoardComponent) 
            // {
            //     // console.log("2nd screen     ladder:", this.userInputLadder, "and snake:", this.userInputSnake);
            //     // createBoardComponent.takeInputFromSecondScreen( this.player1 , this.player2 , this.userInputLadder, this.userInputSnake );
            // } else
            // {
            //     console.error("createBoard component not found in mainScene!");
            // }
        });
    }
}










