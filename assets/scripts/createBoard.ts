import { _decorator, AudioSource, Button, Color, Component, director, EditBox, Graphics, HorizontalTextAlignment, instantiate, Intersection2D, Layout, macro, Node, Prefab, Quat, randomRangeInt, Sprite, SpriteFrame, Tween, tween, UITransform, utils, Vec2, Vec3 } from 'cc';
import { setCell } from './setCell';
import { Singleton } from './manager/Singleton';
const { ccclass, property } = _decorator;

@ccclass('createBoard')
export class createBoard extends Component {



    @property( {type : Prefab} )
    cellPrefab : Prefab | null = null ;
    @property( {type : Prefab} )
    rowPrefab : Prefab | null = null ;

    @property({ type: [SpriteFrame] })
    diceImgArray: SpriteFrame[] = [];
    @property({type :Node})
    diceImg : Node | null = null ;
    @property({type :Button})
    rollDiceButton : Button | null = null ;


    @property({type :Node})
    player1Img : Node | null = null ;
    @property({type :Node})
    player1ArrowImg : Node | null = null ;
    @property({type :Node})
    player2Img : Node | null = null ;
    @property({type :Node})
    player2ArrowImg : Node | null = null ;
    
    
    
    @property({type :Node})
    OffAudio_icon : Node | null = null ;
    @property({type :Node})
    OnAudio_icon : Node | null = null ;


    @property({type : Node})
    BGblackWhenSettingsOpen : Node | null = null ;
    @property({type : Node})
    settingsImgButtom : Node | null = null ;
    // @property( {type : Prefab} )
    // ladderPrefab : Prefab | null = null ;
    // // // use it in the function addLaddersToBoard in 2nd way od making fullLadder
    //
    //
    @property( {type : Prefab} )
    ladderPartPrefab : Prefab | null = null ;
    @property( {type : Prefab} )
    snakePrefab : Prefab | null = null ;


    // @property( {type : Prefab} )
    // winPrefab : Prefab | null = null ;


    @property( {type : Node} )
    allLadders : Node | null = null ;
    @property( {type : Node} )
    allsnakes : Node | null = null ;



    @property( {type : AudioSource} )
    backgroundMusic: AudioSource | null = null; 
    @property( {type : AudioSource} )
    playerMoveMusic: AudioSource | null = null; 
    @property( {type : AudioSource} )
    diceRollMusic: AudioSource | null = null; 
    @property( {type : AudioSource} )
    ladderClimbMusic: AudioSource | null = null; 
    @property( {type : AudioSource} )
    snakeBiteMusic: AudioSource | null = null; 
    @property( {type : AudioSource} )
    firstSixSound_GetReady: AudioSource | null = null; 
    

    private player0thPosition : number = 0 ;

    // private player1Color : number  ;
    // private player2Color : number ;
    private player1CurrCell : number = -1 ;
    private player2CurrCell : number = -1 ;
    private player1SixCount : number = 0 ;
    private player2SixCount : number = 0 ;
    private player1SixPrevCell : number = 0 ;
    private player2SixPrevCell : number = 0 ;
    private player1Turn : boolean = true ;
    private player2Turn : boolean = false ;
    private isAnimating : boolean = false ;
    private isArrowAnimating : boolean = false ;
    private totalLadders : number = 0 ;
    private totalSnakes : number = 0 ;
    private isSettingOpens : boolean = false ;




    private cellNodesMap: Map<string, Node> = new Map();
    private ladderTopCellsExits: number[] = new Array(100);
    private ladderBottomCellsExits: number[] = new Array(100);
    private snakeTopCellsExits: number[] = new Array(100);
    private snakeBottomCellsExits: number[] = new Array(100);
    // private allLadder: Node[] = new Array();  // // //  for bounding box  
    
    

    private player1 : Node ;
    private player2 : Node ;

    settingsButtom()
    {
        console.log( " settigns button " ) ;
        let settingLayout = this.settingsImgButtom.getComponent(Layout) ;
        if( ! this.isSettingOpens  )
        {
            console.log( " vertcal " ) ;
            settingLayout.type = Layout.Type.VERTICAL  ;
            settingLayout.verticalDirection = Layout.VerticalDirection.TOP_TO_BOTTOM ;
            let spacing = 10 ;
            settingLayout.paddingTop = this.settingsImgButtom.height + spacing  ;
            settingLayout.spacingY = spacing ;
            this.settingsImgButtom.children.forEach( ( child , index ) => {
                child.active = true ;
            } )
            this.isSettingOpens = true; 
            this.BGblackWhenSettingsOpen.active = true ;
            this.scheduleOnce( () => {
                director.pause() ;
            } , 0.1 )
        }
        else
        {
            director.resume() ;
            this.BGblackWhenSettingsOpen.active = false ;
            this.isSettingOpens = false; 
            // console.log( " none" ) ;
            settingLayout.type = Layout.Type.NONE  ;
            this.settingsImgButtom.children.forEach( (child) => {
                child.setPosition( new Vec3(0,0,0) ) ;
                child.active = false ;
            } )
        }
    }

    
    restartGameToSecondScreen()
    {
        console.log( "restart Game To Second Screen" ) ;
        Tween.stopAll() ;
        director.loadScene('secondScene') ;
    }
    exitGameToFirstScreen()
    {
        console.log( "exit screen first screen" ) ;
        Tween.stopAll() ;
        director.loadScene('firstScene') ;
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
    


    // // // // not needed as now we are taking the input using singleton 
    // // // // not needed as now we are taking the input using singleton 
    // // // // not needed as now we are taking the input using singleton 
    // takeInputFromSecondScreen( pl1Img:Node , pl2Img:Node , ladderInputFromSecondScreen : number , snakeInputFromSecondScreen : number  )
    // {
    //     this.totalLadders = ladderInputFromSecondScreen ;
    //     this.totalSnakes = snakeInputFromSecondScreen ;
    //     console.log( " take take input from second screen " ) ;

    //     // this.node.parent.addChild(pl1Img);
    //     // this.node.parent.addChild(pl2Img);
    //     console.log("Img",pl1Img,pl2Img)
    //     // this.player1 = pl1Img ;
    //     // this.player2 = pl2Img ;


    //     // console.log( ladderInputFromSecondScreen , "  ladder " , snakeInputFromSecondScreen ) ;
    //     // console.log( this.totalLadders , "  snakes " , this.totalSnakes ) ;
    // }







    start( ) 
    {
        console.log( " strt main scene screate board" ) ;   
        this.player1Img.getComponent(Sprite).spriteFrame = Singleton.getInstance().playerOne;
        this.player2Img.getComponent(Sprite).spriteFrame = Singleton.getInstance().playerTwo;

        this.totalLadders = Singleton.getInstance()._totalLadders ;
        this.totalSnakes = Singleton.getInstance()._totalSnakes ;

        this.BGblackWhenSettingsOpen.active = false ;    
        this.settingsImgButtom.children.forEach( (child) => {
            child.setPosition( new Vec3(0,0,0) ) ;
            child.active = false ;
        } ) 
        this.cellNodesMap.set(this.player0thPosition.toString(), this.player1Img);
        // this.cellNodesMap.set(this.player0thPosition.toString(), this.player2Img);
        let cellNo = 1 ;
        for (let i = 0; i < 10; i++) 
        {
            const rowNode =instantiate(this.rowPrefab);
            let layout = rowNode.getComponent(Layout);
            if(i % 2 === 0)  layout.horizontalDirection = Layout.HorizontalDirection.LEFT_TO_RIGHT;
            else  layout.horizontalDirection = Layout.HorizontalDirection.RIGHT_TO_LEFT;    
            for (let j = 0; j < 10; j++) 
            {
                const cellNode = instantiate(this.cellPrefab);
                cellNode.getComponent(setCell).setCellNumber(cellNo++);
                rowNode.addChild(cellNode);
                this.cellNodesMap.set(cellNode.getComponent(setCell).cellNumber.string, cellNode);
            }
            this.node.addChild(rowNode);
            rowNode.getComponent(Layout).updateLayout(true);
        }
        // console.log( "1 board base " , this.node.getComponent(UITransform).contentSize)
        this.node.getComponent(Layout).updateLayout(true);
        // console.log( "2 board base " , this.node.getComponent(UITransform).contentSize)




        this.rollDiceButton.node.on('click', this.RollDiceRandomaly, this);


        // //  now add the ladders after getting the input from the secondScreen
        // //  now add the ladders after getting the input from the secondScreen
        for(let i=0; i<this.totalLadders; i++)
        {
            console.log( "another " ) ;
            this.addLaddersToBoard() ;
        }


        // //  now add the snakes after getting the input from the secondScreen
        // //  now add the snakes after getting the input from the secondScreen
        // for(let i=0; i<5; i++)
        for(let i=0; i<this.totalSnakes; i++)
        {
            console.log( "another " ) ;
            this.addSnakesToBoard() ;
        }



        this.ArrowplayerAnimation() ;
        this.player2ArrowImg.active = false ;
    }


    update(deltaTime: number) 
    {
        if( ! this.isArrowAnimating )
        {
            this.ArrowplayerAnimation() ;
        }

        if( ! this.isAnimating && ! this.firstSixSound_GetReady.playing  )
        {
            this.rollDiceButton.interactable = true ;
        }
    }









    
    checkLadderAndSnake( topCell : number , bottomCell : number ) : boolean
    {
        if( this.ladderTopCellsExits[topCell] || this.ladderBottomCellsExits[bottomCell] ) return true ;
        if( this.ladderTopCellsExits[bottomCell] || this.ladderBottomCellsExits[topCell] ) return true ;
        if( this.snakeTopCellsExits[topCell] || this.snakeBottomCellsExits[bottomCell] ) return true ;
        if( this.snakeTopCellsExits[bottomCell] || this.snakeBottomCellsExits[topCell] ) return true ;
        return false ;
    }

    addLaddersToBoard()
    {
        console.log( " add ladder function "   ) ; 
        let cell1 = randomRangeInt(1,100) ;
        let cell2 = randomRangeInt(1,100) ;
        let topCell = Math.max(cell1, cell2);
        let bottomCell = Math.min(cell1, cell2);
        while( Math.abs(cell1 - cell2 ) <= 10  || this.checkLadderAndSnake(topCell , bottomCell) )
        {
            cell1 = randomRangeInt(1,100) ;
            cell2 = randomRangeInt(1, 100); 
            topCell = Math.max(cell1, cell2);
            bottomCell = Math.min(cell1, cell2);
        } 
        // topCell = 81;
        // bottomCell = 3;
        // topCell = 86;
        // bottomCell = 22;
        // topCell = 83;
        // bottomCell = 37;
        this.ladderTopCellsExits[topCell] = bottomCell ;
        this.ladderBottomCellsExits[bottomCell] = topCell ;


        console.log( "top " , topCell , "bottom " , bottomCell ) ;
        

        let topcellPositionLocal = this.cellNodesMap.get(topCell.toString()).getWorldPosition();
        let topcellPositionWorld = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(topcellPositionLocal);
        let bottomcellPositionLocal = this.cellNodesMap.get(bottomCell.toString()).getWorldPosition();
        let bottomcellPositionWorld = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(bottomcellPositionLocal);

        let dx = topcellPositionWorld.x - bottomcellPositionWorld.x;
        // dx = Math.abs(topcellPositionWorld.x - bottomcellPositionWorld.x);
        let dy = Math.abs(topcellPositionWorld.y - bottomcellPositionWorld.y);
        // console.log( "5dx hjngjgjgjh ") ;
        // console.log( "ps tp => " , topcellPositionWorld.x , "dy=> ", topcellPositionWorld.y ) ;
        // console.log( "ps bt => " , bottomcellPositionWorld.x , "dy=> ", bottomcellPositionWorld.y ) ;
        // console.log( "dx => " , dx , "dy=> ", dy ) ;
        let distance = Math.sqrt(dx * dx + dy * dy );
        // // angle from bottom to top
        let angleRadians = Math.atan2(dy, dx);
        let angleDegrees = angleRadians * (180 / Math.PI)  ;
        // console.log( "angleDegrees => " , angleRadians * (180 / Math.PI) , "  degee" , angleDegrees   ) ;
        




        // //  1st way  make sprite type  Tiled and then jsut change the contentn size height
        let fullLadderNode = instantiate(this.ladderPartPrefab) ;
        let fullLadderNodeWidth = fullLadderNode.getComponent(Sprite).spriteFrame.width ;
        fullLadderNode.getComponent(UITransform).setContentSize( fullLadderNodeWidth  , distance ) ;
        //
        //
        // // //  2nd way using one more prefab and also itis not optimized  1st way(just above ) is optimized
        // let fullLadderNode = instantiate(this.ladderPrefab) ;
        // let fullLadderNodeHeight = 0;
        // while(fullLadderNodeHeight < distance) 
        // {
        //     let ladderPart = instantiate(this.ladderPartPrefab);
        //     fullLadderNode.addChild(ladderPart);
        //     fullLadderNodeHeight += ladderPart.getComponent(UITransform).contentSize.height;
        // }
        // console.log( fullLadderNodeHeight , " dis " , distance  ) ;




        // console.log("full111 ladder contentn size  ====> " , fullLadderNode.getComponent(UITransform).contentSize )


        fullLadderNode.getComponent(UITransform).setAnchorPoint(new Vec2(0.5 , 0)) ;
        fullLadderNode.eulerAngles = new Vec3(0, 0, -(90-angleDegrees));
        fullLadderNode.setPosition(bottomcellPositionWorld) ;
        // this.node.parent.addChild(fullLadderNode) ;
        this.allLadders.addChild(fullLadderNode) ;

        // // code so that all ladders placed without collision
        // const fullLadderBoundingBox = fullLadderNode.getComponent(UITransform).getBoundingBoxToWorld();
        // let i=0 ;
        // while(i<this.allLadder.length)
        // {
        //     const otherladder = this.allLadder[i].getComponent(UITransform).getBoundingBoxToWorld();
        //     console.log("ootherladder contentn size  ====> " , this.allLadder[i].getComponent(UITransform).contentSize )
        //     console.log( "ful " , fullLadderBoundingBox , " other   " ,  otherladder  ) ;
        //     console.log(" check detected!");
        //     if (Intersection2D.rectRect(fullLadderBoundingBox , otherladder) ) 
        //     {
        //         console.log(" collision detected!");
        //         this.node.parent.removeChild(fullLadderNode) ;
        //         fullLadderNode.destroy() ;
        //         this.addLaddersToBoard() ;
        //         return;
        //     }
        //     console.log(" after detected!");
        //     i++;
        // }
        // this.allLadder.push(fullLadderNode) ;
        

    }




    addSnakesToBoard()
    {
        console.log( " add snakes function =============>  "   ) ; 
        let cell1 = randomRangeInt(1,100) ;
        let cell2 = randomRangeInt(1,100) ;
        let topCell = Math.max(cell1, cell2);
        let bottomCell = Math.min(cell1, cell2);
        while( Math.abs(cell1 - cell2 ) <= 10 || this.checkLadderAndSnake(topCell , bottomCell) )
        {
            cell1 = randomRangeInt(1,100) ;
            cell2 = randomRangeInt(1, 100); 
            topCell = Math.max(cell1, cell2);
            bottomCell = Math.min(cell1, cell2);
        } 
        // topCell = 99;
        // bottomCell = 1;
        // topCell = 86;
        // bottomCell = 22;
        // topCell = 6;
        // bottomCell = 2;


        this.snakeTopCellsExits[topCell] = bottomCell ;
        this.snakeBottomCellsExits[bottomCell] = topCell ;


        console.log( "sntop " , topCell , "snbottom " , bottomCell ) ;
        

        let topcellPositionLocal = this.cellNodesMap.get(topCell.toString()).getWorldPosition();
        let topcellPositionWorld = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(topcellPositionLocal);
        let bottomcellPositionLocal = this.cellNodesMap.get(bottomCell.toString()).getWorldPosition();
        let bottomcellPositionWorld = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(bottomcellPositionLocal);

        let dx = topcellPositionWorld.x - bottomcellPositionWorld.x;
        // dx = Math.abs(topcellPositionWorld.x - bottomcellPositionWorld.x);
        let dy = Math.abs(topcellPositionWorld.y - bottomcellPositionWorld.y);
        // console.log( "5dx hjngjgjgjh ") ;
        // console.log( "ps tp => " , topcellPositionWorld.x , "dy=> ", topcellPositionWorld.y ) ;
        // console.log( "ps bt => " , bottomcellPositionWorld.x , "dy=> ", bottomcellPositionWorld.y ) ;
        // console.log( "dx => " , dx , "dy=> ", dy ) ;
        let distance = Math.sqrt(dx * dx + dy * dy );
        console.log( "dis  " , distance , "  in integer " , Math.floor(distance) ) ;
        // // angle from bottom to top
        let angleRadians = Math.atan2(dy, dx);
        let angleDegrees = angleRadians * (180 / Math.PI)  ;
        // console.log( "angleDegrees => " , angleRadians * (180 / Math.PI) , "  degee" , angleDegrees   ) ;
        




        
        let fullSnakeNode = instantiate(this.snakePrefab) ;
        let fullSnakeNodeWidth = fullSnakeNode.getComponent(Sprite).spriteFrame.width ;
        let fullSnakeNodeHeight = fullSnakeNode.getComponent(Sprite).spriteFrame.height ;
        let fullSnakeNodeTOP = fullSnakeNode.getComponent(Sprite).spriteFrame.insetTop ;
        let fullSnakeNodeBottom = fullSnakeNode.getComponent(Sprite).spriteFrame.insetBottom ;
        // console.log( fullSnakeNodeWidth , "  width sprite frame height   " , fullSnakeNodeHeight ) ;
        // console.log( fullSnakeNodeTOP , "  Top sprite frame Bottom   " , fullSnakeNodeBottom ) ;
        let snakeHeadHeight = fullSnakeNodeTOP  ;
        let snakeTailHeight = fullSnakeNodeBottom ;
        let repetitionPartHeight = fullSnakeNodeHeight - snakeHeadHeight - snakeTailHeight ;
        let noOfrepetitionOfImage = Math.floor( (distance-snakeHeadHeight-snakeTailHeight)/repetitionPartHeight ) ;
        console.log( repetitionPartHeight , "  repetition   " , noOfrepetitionOfImage , " ok " , repetitionPartHeight * noOfrepetitionOfImage  ) ;
        
        let contentSizeHeight = snakeHeadHeight + repetitionPartHeight * noOfrepetitionOfImage + snakeTailHeight ;
        fullSnakeNode.getComponent(UITransform).setContentSize( fullSnakeNodeWidth  ,  contentSizeHeight  ) ;
        console.log( contentSizeHeight , "  contentSizeHeight   " ) ;




        // let diff = distance - contentSizeHeight ;
        // if( diff < 25 ) diff = 0 ;
        // fullSnakeNode.setPosition(new Vec3( bottomcellPositionWorld.x+diff/2 , bottomcellPositionWorld.y + diff/2 ) ) ;




        fullSnakeNode.setPosition(new Vec3( bottomcellPositionWorld.x , bottomcellPositionWorld.y  ) ) ;
        // fullSnakeNode.getComponent(UITransform).setAnchorPoint(new Vec2(0 , 0)) ;
        fullSnakeNode.eulerAngles = new Vec3(0, 0, -(90-angleDegrees));
        const randomR = Math.random() * 255;
        const randomG = Math.random() * 255;
        const randomB = Math.random() * 255;
        let randomColor = new Color(randomR, randomG, randomB);
        randomColor = new Color(255, 245, 0, 255)
        fullSnakeNode.getComponent(Sprite).color = randomColor;
        // this.node.parent.addChild(fullSnakeNode) ;
        this.allsnakes.addChild(fullSnakeNode) ;

    }














    ArrowplayerAnimation(  )
    {
        let player1CurrPositionX = this.player1ArrowImg.position.x ;
        let player1CurrPositionY = this.player1ArrowImg.position.y ;
        this.isArrowAnimating = true ;
        tween(this.player1ArrowImg)
        .to(0.5 ,{ position: new Vec3( player1CurrPositionX , player1CurrPositionY + 15 , 0) , scale: new Vec3(1.3 , 1 , 1.3) } )
        .to(0.5, { position: new Vec3( player1CurrPositionX , player1CurrPositionY , 0) , scale: new Vec3(1 , 1 , 1) }, {
            easing: 'quadInOut',
            onComplete: () => { 
                
            }
        })
        .start();
        let player2CurrPositionX = this.player2ArrowImg.position.x ;
        let player2CurrPositionY = this.player2ArrowImg.position.y ;
        tween(this.player2ArrowImg)
        .to(0.5 ,{ position: new Vec3( player2CurrPositionX , player2CurrPositionY + 15 , 0) , scale: new Vec3(1.3 , 1 , 1.3) } )
        .to(0.5, { position: new Vec3( player2CurrPositionX , player2CurrPositionY , 0) , scale: new Vec3(1 , 1 , 1) }, {
            easing: 'quadInOut',
            onComplete: () => { 
                this.isArrowAnimating = false ;
            }
        })
        .start();
    }



    RollDiceRandomaly()
    {
        let randomNumber = Math.floor(Math.random() * 6) + 1 ;
        this.diceImg.getComponent(Sprite).spriteFrame = this.diceImgArray[randomNumber-1] ;
        if(this.player1Turn  )
        {
            this.rollDiceButton.interactable = false;
            this.player1rollDiceRandomaly(randomNumber) ;
        }
        else this.rollDiceButton.interactable = false , this.player2rollDiceRandomaly(randomNumber) ;
    }


    player1rollDiceRandomaly(randomNumber : number)
    {
        
        // if( ! this.player1Turn  )
        // {
        //     window.alert(" It's Player 2 Turn ") ;
        //     return ;
        // }
        this.diceRollMusic.play();
        
        
        console.log( " player 1 roll dice randomly => " ) ;
        if( this.player1CurrCell == -1  &&  randomNumber != 6 )
        {
            this.player1ArrowImg.active = false ;
            this.player2ArrowImg.active = true ;
            this.player1Turn = false ;
            this.player2Turn = true ;
            console.log( " no move until 6 comes" ) ;
            return ;
        }
        if( this.player1CurrCell == -1  && randomNumber == 6 )
        {
            this.player1CurrCell = 0 ;
            console.log( " ready to play ") ;
            this.firstSixSound_GetReady.play() ;
            return ;
        }
        this.isAnimating = true ;
        if( randomNumber == 6 )
        {
            this.player1SixCount ++ ;
            if( this.player1SixCount == 1 ) this.player1SixPrevCell = this.player1CurrCell ;
            else if( this.player1SixCount == 3 ) 
            {
                console.log(this.player1CurrCell , " strt three six animation " , this.player1SixPrevCell ) ;
                this.threeSixAnimation(this.player1Img , this.player1CurrCell-1 , this.player1SixPrevCell  , 1 ) ;
                
                return ;
            }
        }
        else
        {
            this.player1Turn = false ;
            this.player2Turn = true ;
            this.player1SixCount = 0 ;
            this.player1SixPrevCell =0 ;
        }
        // this.diceRollMusic.stop();
        // this.scheduleOnce(() => {
        //     this.diceRollMusic.stop();
        // }, 0.5);
        this.scheduleOnce(() => {
            this.diceRollMusic.stop();
            this.scheduleOnce(() => {
                this.player1ArrowImg.active = false ;
                this.movePlayer1(randomNumber) ;
                // this.movePlayer1(6) ;
            }, 0.3);
        }, 0.5);
        
    }

    player2rollDiceRandomaly( randomNumber : number )
    {
        if( this.isAnimating )
        {
            window.alert(" Player is currently playing ") ;
            return ;
        }
        if( ! this.player2Turn  )
        {
            window.alert(" It's Player 1 Turn ") ;
            return ;
        }
        this.diceRollMusic.play();
        console.log( " player 2 roll dice randomly => " ) ;
        if( this.player2CurrCell == -1  &&  randomNumber != 6 )
        {
            this.player2ArrowImg.active = false ;
            this.player1ArrowImg.active = true ;
            this.player2Turn = false ;
            this.player1Turn = true ;
            console.log( " no move until 6 comes" ) ;
            return ;
        }
        if( this.player2CurrCell == -1  && randomNumber == 6 )
        {
            this.player2CurrCell = 0 ;
            console.log( " ready to play ") ;
            this.firstSixSound_GetReady.play() ;
            return ;
        }
        this.isAnimating = true ;
        if( randomNumber == 6 )
        {
            this.player2SixCount ++ ;
            if( this.player2SixCount == 1 ) this.player2SixPrevCell = this.player2CurrCell ;
            else if( this.player2SixCount == 3 ) 
            {
                console.log(this.player2CurrCell , " strt three six animation " , this.player2SixPrevCell ) ;
                this.threeSixAnimation(this.player2Img , this.player2CurrCell-1 , this.player2SixPrevCell  , 1 ) ;
                this.player2Turn = false ;
                this.player1Turn = true ;
                this.player2SixCount = 0 ;
                this.player2SixPrevCell =0 ;
                return ;
            }
        }
        else
        {
            this.player2Turn = false ;
            this.player1Turn = true ;
            this.player2SixCount = 0 ;
            this.player2SixPrevCell =0 ;
        }
        // this.diceRollMusic.stop();
        // this.scheduleOnce(() => {
        //     this.diceRollMusic.stop();
        // }, 0.5);
        this.scheduleOnce(() => {
            this.diceRollMusic.stop();
            this.scheduleOnce(() => {
                this.player2ArrowImg.active = false ;
                this.movePlayer2(randomNumber) ;
                // this.movePlayer2(6) ;
            }, 0.3);
        }, 0.5);
    }

    threeSixAnimation( playerImg : Node , playerCurrCell : number, playerPrevCell : number, playerindex : number  )
    {
        this.playerMoveMusic.play();
        console.log( " three six animation funciton " ) ;
        if( playerindex == 1 ) this.player1CurrCell = playerCurrCell ;
        else this.player2CurrCell = playerCurrCell ;
        let playerCurrCellPositionX = playerImg.position.x ;
        let playerCurrCellPositionY = playerImg.position.y ;
        let posNode=this.cellNodesMap.get(playerCurrCell.toString())
        let worldpos = posNode.getWorldPosition(); 
        let NextCellPosition=  this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(worldpos);
        let NextCellPositionX =  NextCellPosition.x;
        let NextCellPositionY =  NextCellPosition.y;
        console.log( "currCell " , playerCurrCell ) ;
        tween(playerImg)
        .to(0.1 ,{ position: new Vec3(playerCurrCellPositionX , playerCurrCellPositionY + 10) } )
        .to(0.2 ,{ position: new Vec3(NextCellPositionX , NextCellPositionY + 10) } )
        .to(0.1, { position: NextCellPosition }, {
            easing: 'quadInOut',
            
            onComplete: () => { 
                this.playerMoveMusic.stop();
                console.log( "currCell " , playerCurrCell , " prev " , playerPrevCell ) ;
                if( playerCurrCell == playerPrevCell  )
                {
                    this.isAnimating = false ;
                    this.player1Turn = false ;
                    this.player2Turn = true ;
                    this.player1SixCount = 0 ;
                    this.player1SixPrevCell =0 ;
                    return ;
                }
                this.threeSixAnimation( playerImg , playerCurrCell-1 , playerPrevCell , playerindex ) ;
            }
        })
        .start();
    }




    movePlayer1( diceNumber : number )
    {
        console.log( " moveplayer1 fucntion " ) ;
        let pl1currCell = this.player1CurrCell;
        let pl1FinalCell = this.player1CurrCell + diceNumber;
        console.log( "currCell " , pl1currCell , "  finalcell " , pl1FinalCell ) ;
        this.playerTweenAnimation( this.player1Img , pl1currCell+1 , pl1FinalCell , 1 ) ;
        console.log( "currCell print" , this.player1CurrCell  ) ;
        
    }

    movePlayer2( diceNumber : number )
    {
        console.log( " moveplayer1 fucntion " ) ;
        let pl2currCell = this.player2CurrCell;
        let pl2FinalCell = this.player2CurrCell + diceNumber;
        console.log( "currCell " , pl2currCell , "  finalcell " , pl2FinalCell ) ;
        this.playerTweenAnimation( this.player2Img , pl2currCell+1 , pl2FinalCell , 2 ) ;
        console.log( "currCell  print" , this.player2CurrCell  ) ;
    }





    playerTweenAnimation( playerImg : Node , currCell : number , finalCell:number , playerindex : number )
    {
        
        if( currCell > 100 )
        {
            console.log( 'its a 101th cell ' ) ;
            console.log( "curr => " , currCell , " chn " , currCell-2 , " finalcell => " , finalCell , " steps " , finalCell-currCell+1  )
            this.ifLastCell( playerImg , currCell-2 , finalCell-currCell+1 ,  playerindex ) ;
            return ;
        }
        if( currCell > finalCell ) 
        {
            // if( playerindex == 1 && this.player1SixCount == 0 ) this.player1ArrowImg.active = false , this.player2ArrowImg.active = true ;
            // else if( playerindex == 1 && this.player1SixCount >= 1 ) this.player1ArrowImg.active = true ;
            // else if( playerindex == 2 && this.player2SixCount == 0 ) this.player2ArrowImg.active = false ,this.player1ArrowImg.active = true ;
            // else if( playerindex == 2 && this.player2SixCount >= 1 ) this.player2ArrowImg.active = true ;
            if( playerindex == 1 )
            {
                this.player1ArrowImg.active = this.player1SixCount >= 1 ;
                this.player2ArrowImg.active = this.player1SixCount < 1 ;
            }
            else
            {
                this.player2ArrowImg.active = this.player2SixCount >= 1 ;
                this.player1ArrowImg.active = this.player2SixCount < 1 ;
            }
            //
            //
            this.playerMoveMusic.stop();
            this.isAnimating = false ;
            console.log( " final curr  cell " , currCell-1 ) ;
            if( this.ladderBottomCellsExits[currCell-1] ) this.playerLadderClimbAnimation( playerImg  , currCell-1 , playerindex ) ;
            if( this.snakeTopCellsExits[currCell-1] ) this.playerSnakeBiteAnimation( playerImg  , currCell-1 , playerindex ) ;
            if( this.player1CurrCell == this.player2CurrCell )
            {
                let playerCurrCellPositionX = playerImg.position.x ;
                let playerCurrCellPositionY = playerImg.position.y ;
                tween(playerImg)
                .to(0.1, { position : new Vec3(playerCurrCellPositionX+10, playerCurrCellPositionY+10, 0) }, {
                    easing: 'quadInOut',
                    onComplete: () => { 
                    }
                }).start() ;
            }
            return ;
        }
        this.playerMoveMusic.play();
        if( playerindex == 1 ) this.player1CurrCell = currCell ;
        else this.player2CurrCell = currCell ;
        let posNode=this.cellNodesMap.get(currCell.toString())
        let worldpos = posNode.getWorldPosition(); 
        let NextCellPosition=  this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(worldpos);
        let NextCellPositionX =  NextCellPosition.x;
        let NextCellPositionY =  NextCellPosition.y;

        let playerCurrCellPositionX = playerImg.position.x ;
        let playerCurrCellPositionY = playerImg.position.y ;
        tween(playerImg)
        .to(0.1 ,{ position: new Vec3(playerCurrCellPositionX , playerCurrCellPositionY + 10) } )
        .to(0.2 ,{ position: new Vec3(NextCellPositionX , NextCellPositionY + 10) } )
        .to(0.1, { position: NextCellPosition }, {
            easing: 'quadInOut',
            onComplete: () => { 
                this.playerMoveMusic.stop();
                if( currCell == finalCell && finalCell == 100 )
                {   
                    window.alert(` Player ${playerindex} is winner `) ;
                    Tween.stopAll()
                    window.alert('Play Again ') ;
                    director.loadScene('secondScene') ;
                    // return currCell ; // // check it 
                }
                this.playerTweenAnimation( playerImg , currCell+1 , finalCell , playerindex) ;
            }
        })
        .start();
    }

    ifLastCell(playerImg : Node , currCell : number , remainingSteps:number , playerindex : number)
    {
        if( remainingSteps == 0 )
        {
            this.playerMoveMusic.stop();
            this.isAnimating = false ;
            return ;
        }
        this.playerMoveMusic.play();
        if( playerindex == 1 ) this.player1CurrCell = currCell ;
        else this.player2CurrCell = currCell ;
        //
        let posNode=this.cellNodesMap.get(currCell.toString())
        let worldpos = posNode.getWorldPosition(); 
        let pl1NextCellPosition=  this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(worldpos);
        console.log( "currCell " , currCell , "  remainingSteps " , remainingSteps ) ;
        tween(playerImg)
        .to(1, { position: pl1NextCellPosition }, {
            easing: 'quadInOut',
            
            onComplete: () => { 
                this.playerMoveMusic.stop();
                this.ifLastCell( playerImg , currCell-1 , remainingSteps-1 , playerindex ) ;
            }
        })
        .start();
    }

    playerLadderClimbAnimation(  playerImg : Node , playerCell : number, playerindex : number )
    {
        this.ladderClimbMusic.play();
        console.log( " Player ladder move animation ") ;
        this.isAnimating = true ;
        let laddeBottomCell = playerCell ;
        let laddeTopCell = this.ladderBottomCellsExits[playerCell] ;
        // let laddeBottomCellPosition = this.cellNodesMap.get(laddeBottomCell.toString()).getWorldPosition() ;
        // let laddeBottomCellWorldPosition = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(laddeBottomCellPosition);
        let laddeTopCellPosition = this.cellNodesMap.get(laddeTopCell.toString()).getWorldPosition() ;
        let laddeTopCellWorldPosition = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(laddeTopCellPosition);
        // if( playerindex == 1 ) this.player1CurrCell = laddeTopCell ;
        // else this.player2CurrCell = laddeTopCell ;
        console.log( "bot => " , laddeBottomCell , "top => " , laddeTopCell ) ;
        tween(playerImg)
        .to(3, { position: laddeTopCellWorldPosition }, {
            easing: 'quadInOut',
            onComplete: () => { 
                console.log( " Player ladder move animation ") ;
                this.isAnimating = false ;
                this.ladderClimbMusic.stop();
                if( laddeTopCell == 100 )
                {   
                    window.alert(` Player ${playerindex} is winner `) ;
                    Tween.stopAll()
                    window.alert('Play Again ') ;
                    director.loadScene('secondScene') ;
                    // return currCell ; // // check it 
                }
                if( playerindex == 1 ) this.player1CurrCell = laddeTopCell ;
                else this.player2CurrCell = laddeTopCell ;
                if( this.player1CurrCell == this.player2CurrCell )
                {
                    let playerCurrCellPositionX = playerImg.position.x ;
                    let playerCurrCellPositionY = playerImg.position.y ;
                    tween(playerImg)
                    .to(0.2, { position : new Vec3(playerCurrCellPositionX+10, playerCurrCellPositionY+10, 0) }, {
                        easing: 'quadInOut',
                        onComplete: () => { 
                        }
                    }).start() ;
                }
            }
        }).start() ;
    }
  
    
    playerSnakeBiteAnimation( playerImg : Node , playerCell : number, playerindex : number   )
    {
        console.log( " Player snake bite animation ") ;
        this.snakeBiteMusic.play();
        this.isAnimating = true ;
        let snakeTopCell = playerCell ;
        let snakeBottomCell = this.snakeTopCellsExits[playerCell] ;
        let snakeBottomCellPosition = this.cellNodesMap.get(snakeBottomCell.toString()).getWorldPosition() ;
        let snakeBottomCellWorldPosition = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(snakeBottomCellPosition);
        // if( playerindex == 1 ) this.player1CurrCell = laddeTopCell ;
        // else this.player2CurrCell = laddeTopCell ;
        console.log( "bot => " , snakeBottomCell , "top => " , snakeTopCell ) ;
        tween(playerImg)
        .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1) })
        .to(1, { scale: new Vec3(0, 0, 0) })
        .to(1, { position: snakeBottomCellWorldPosition  } )
        .to(0.5, { scale : new Vec3(1, 1, 1) }, {
            easing: 'quadInOut',
            onComplete: () => { 
                console.log( " Player snake bite move animation ") ;
                this.isAnimating = false ;
                this.snakeBiteMusic.stop();
                if( playerindex == 1 ) this.player1CurrCell = snakeBottomCell ;
                else this.player2CurrCell = snakeBottomCell ;
                if( this.player1CurrCell == this.player2CurrCell )
                {
                    let playerCurrCellPositionX = playerImg.position.x ;
                    let playerCurrCellPositionY = playerImg.position.y ;
                    tween(playerImg)
                    .to(0.2, { position : new Vec3(playerCurrCellPositionX+10, playerCurrCellPositionY+10, 0) }, {
                        easing: 'quadInOut',
                        onComplete: () => { 
                        }
                    }).start() ;
                }
            }
        }).start() ;
    }

    



}



