import { _decorator, AudioSource, Component, director, EditBox, HorizontalTextAlignment, instantiate, Intersection2D, Layout, Node, Prefab, Quat, randomRangeInt, Sprite, SpriteFrame, Tween, tween, UITransform, utils, Vec2, Vec3 } from 'cc';
import { setCell } from './setCell';
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


    @property({type :Node})
    player1Img : Node | null = null ;
    @property({type :Node})
    player2Img : Node | null = null ;



    // @property( {type : Prefab} )
    // ladderPrefab : Prefab | null = null ;
    // // // use it in the function addLaddersToBoard in 2nd way od making fullLadder
    //
    //
    @property( {type : Prefab} )
    snakePrefab : Prefab | null = null ;


    @property( {type : Prefab} )
    ladderPartPrefab : Prefab | null = null ;


    private backgroundMusic: AudioSource | null = null; 
    


    private player1CurrCell : number = 0 ;
    private player2CurrCell : number = -1 ;
    private player1Turn : boolean = true ;
    private player2Turn : boolean = false ;
    private isAnimating : boolean = false ;
    private totalLadders : number = 0 ;
    private totalSnakes : number = 0 ;




    private cellNodesMap: Map<string, Node> = new Map();
    private ladderTopCellsExits: number[] = new Array(100);
    private ladderBottomCellsExits: number[] = new Array(100);
    // private allLadder: Node[] = new Array();  // // //  for bounding box  
    
    

    start( ) 
    {
        console.log( " strt main scene screate board" ) ;
        this.backgroundMusic = this.node.getComponent(AudioSource);
        
        this.cellNodesMap.set(this.player1CurrCell.toString(), this.player1Img);
        this.cellNodesMap.set(this.player2CurrCell.toString(), this.player2Img);
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
        this.player1CurrCell = 0 ;
        this.player2CurrCell = 0 ;


        // //  now add the ladders after getting the input from the secondScreen
        // //  now add the ladders after getting the input from the secondScreen
        // for(let i=0; i<this.totalLadders; i++)
        // {
        //     console.log( "another " ) ;
        //     this.addLaddersToBoard() ;
        // }


        // //  now add the snakes after getting the input from the secondScreen
        // //  now add the snakes after getting the input from the secondScreen
        for(let i=0; i<this.totalSnakes; i++)
        {
            console.log( "another " ) ;
            this.addSnakesToBoard() ;
        }


    }



    update(deltaTime: number) 
    {
        
    }


   

    takeInputFromSecondScreen( ladderInputFromSecondScreen : number , snakeInputFromSecondScreen : number)
    {
        this.totalLadders = ladderInputFromSecondScreen ;
        this.totalSnakes = snakeInputFromSecondScreen ;

        console.log( " take take input from second screen " ) ;
        console.log( ladderInputFromSecondScreen , "  ladder " , snakeInputFromSecondScreen ) ;
        console.log( this.totalLadders , "  snakes " , this.totalSnakes ) ;
    }


    addLaddersToBoard()
    {
        console.log( " add ladder function "   ) ; 
        let cell1 = randomRangeInt(1,100) ;
        let cell2 = randomRangeInt(1,100) ;
        let topCell = Math.max(cell1, cell2);
        let bottomCell = Math.min(cell1, cell2);
        while( Math.abs(cell1 - cell2 ) <= 10  ||  this.ladderTopCellsExits[topCell] || this.ladderBottomCellsExits[bottomCell] )
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
        this.node.parent.addChild(fullLadderNode) ;

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
        console.log( " add snakes function "   ) ; 
        let cell1 = randomRangeInt(1,100) ;
        let cell2 = randomRangeInt(1,100) ;
        let topCell = Math.max(cell1, cell2);
        let bottomCell = Math.min(cell1, cell2);
        while( Math.abs(cell1 - cell2 ) <= 10  )
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
        // // angle from bottom to top
        let angleRadians = Math.atan2(dy, dx);
        let angleDegrees = angleRadians * (180 / Math.PI)  ;
        // console.log( "angleDegrees => " , angleRadians * (180 / Math.PI) , "  degee" , angleDegrees   ) ;
        




        
        let fullSnakeNode = instantiate(this.snakePrefab) ;
        let fullSnakeNodeWidth = fullSnakeNode.getComponent(Sprite).spriteFrame.width ;
        fullSnakeNode.getComponent(UITransform).setContentSize( fullSnakeNodeWidth  , distance ) ;


        fullSnakeNode.getComponent(UITransform).setAnchorPoint(new Vec2(0 , 0)) ;
        fullSnakeNode.eulerAngles = new Vec3(0, 0, -(90-angleDegrees));
        fullSnakeNode.setPosition(bottomcellPositionWorld) ;
        this.node.parent.addChild(fullSnakeNode) ;

    }



















    player1rollDiceRandomaly()
    {
        if( this.isAnimating )
        {
            window.alert(" Player is currently playing ") ;
            return ;
        }
        if( ! this.player1Turn  )
        {
            window.alert(" It's Player 2 Turn ") ;
            return ;
        }
        // this.backgroundMusic.play();
        this.isAnimating = true ;
        this.player1Turn = false ;
        this.player2Turn = true ;
        console.log( " player 1 roll dice randomly => " ) ;
        let randomNumber = Math.floor(Math.random() * 6);
        this.diceImg.getComponent(Sprite).spriteFrame = this.diceImgArray[randomNumber] ;
        this.scheduleOnce(() => {
            this.movePlayer1(randomNumber+1) ;
            // this.movePlayer1(3) ;
        }, 0.5);
        
    }

    player2rollDiceRandomaly()
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
        // this.backgroundMusic.play();
        this.isAnimating = true ;
        this.player2Turn = false ;
        this.player1Turn = true ;
        console.log( " player 2 roll dice randomly => " ) ;
        let randomNumber = Math.floor(Math.random() * 6);
        this.diceImg.getComponent(Sprite).spriteFrame = this.diceImgArray[randomNumber] ;
        this.scheduleOnce(() => {
            this.movePlayer2(randomNumber+1) ;
            // this.movePlayer2(3) ;
        }, 0.5);
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
            this.backgroundMusic.stop();
            this.isAnimating = false ;
            console.log( " final curr  cell " , currCell-1 ) ;
            if( this.ladderBottomCellsExits[currCell-1] ) this.playerLadderMoveAnimation( playerImg  , currCell-1 , playerindex ) ;
            return ;
        }
        this.backgroundMusic.play();
        if( playerindex == 1 ) this.player1CurrCell = currCell ;
        else this.player2CurrCell = currCell ;
        let posNode=this.cellNodesMap.get(currCell.toString())
        let worldpos = posNode.getWorldPosition(); 
        let NextCellPosition=  this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(worldpos);

        tween(playerImg)
        .to(1, { position: NextCellPosition }, {
            easing: 'quadInOut',
            onComplete: () => { 
                this.backgroundMusic.stop();
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
            this.backgroundMusic.stop();
            this.isAnimating = false ;
            return ;
        }
        this.backgroundMusic.play();
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
                this.backgroundMusic.stop();
                this.ifLastCell( playerImg , currCell-1 , remainingSteps-1 , playerindex ) ;
            }
        })
        .start();
    }

    playerLadderMoveAnimation(  playerImg : Node , playerCell : number, playerindex : number )
    {
        this.backgroundMusic.play();
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
                this.backgroundMusic.stop();
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
            }
        }).start() ;
    }
  

    
    

    



}



