
import { _decorator, AudioSource, Component, director, EditBox, EditBoxComponent, HorizontalTextAlignment, instantiate, Layout, Node, Prefab, randomRangeInt, Sprite, SpriteFrame, Tween, tween, UITransform, Vec3 } from 'cc';
import { setCell } from './setCell';
import { setLadders } from './setLadders';
const { ccclass, property } = _decorator;

@ccclass('createBoard')
export class createBoard extends Component {

    
    @property( {type : EditBoxComponent} )
    editBox : EditBoxComponent | null = null ;


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



    @property( {type : Prefab} )
    ladderPrefab : Prefab | null = null ;
    @property( {type : Prefab} )
    snakePrefab : Prefab | null = null ;


    @property( {type : Prefab} )
    ladderPartPrefab : Prefab | null = null ;


    // @property(AudioSource)
    private backgroundMusic: AudioSource | null = null; 
    


    private player1CurrCell : number = 0 ;
    private player2CurrCell : number = -1 ;
    private player1Turn : boolean = true ;
    private player2Turn : boolean = false ;
    //
    private isAnimating : boolean = false ;

    private cellNodesMap: Map<string, Node> = new Map();


    private totalLadders : number = 0 ;
    private totalSnakes : number = 0 ;

    start() 
    {
        
        this.backgroundMusic = this.node.getComponent(AudioSource);
        //
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
        }
        this.editBox.node.on('editing-did-ended', this.captureEnteredPageNumber, this);
        this.player1CurrCell = 0 ;
        this.player2CurrCell = 0 ;
    }

    captureEnteredPageNumber()
    {
        // this.node.getComponent(Layout).rem
        this.node.removeComponent(Layout);
        let userInput = this.editBox.string ;
        this.totalLadders = parseInt(userInput) ;
        this.editBox.string = '' ;
        if( isNaN(this.totalLadders) ) 
        {
            console.log( "Please enter the valid number " ) ;
            return  ;
        }
        this.addLaddersToBoard() ;
    }
    addLaddersToBoard()
    {
        for(let i=0; i<this.totalLadders; i++)
        {
            let row1 = randomRangeInt(1, 10); 
            let row2 = randomRangeInt(1, 10); 
            while (Math.abs(row1 - row2) <= 1) row2 = randomRangeInt(1, 10); 
            let col1 = row1 * 10 + randomRangeInt(1, 10); 
            let col2 = row2 * 10 + randomRangeInt(1, 10); 
            let topCell = Math.max(col1, col2);
            let bottomCell = Math.min(col1, col2);

            console.log( "top " , topCell , "bottom " , bottomCell ) ;

            let topcellPosition = this.cellNodesMap.get(topCell.toString()).position ;
            let bottomcellPosition = this.cellNodesMap.get(bottomCell.toString()).position ;

            let dx = topcellPosition.x - bottomcellPosition.x;
            let dy = topcellPosition.y - bottomcellPosition.y;
            let distance = Math.sqrt(dx * dx + dy * dy );
            // // angle from bottom to top
            let angleRadians = Math.atan2(dy, dx);
            let angleDegrees = angleRadians * (180 / Math.PI);
            
            let fullLadderNode = instantiate(this.ladderPrefab) ;
            // while(fullLadderNode.height < distance)
            // {
            //     const ladderPart = instantiate(this.ladderPartPrefab);
            //     // ladderPart.getComponent(setCell).setCellNumber(cellNo++);
            //     fullLadderNode.addChild(ladderPart);
            // }
            // console.log( fullLadderNode.height , " dis " , distance ) ;
            let fullLadderNodeheight = fullLadderNode.getComponent(UITransform).contentSize.height ;
            let ct = 0 ;
            while(fullLadderNodeheight < distance) 
            {
                console.log( fullLadderNodeheight , " dis " , distance , " ct  " , ct ) ;
                let ladderPart = instantiate(this.ladderPartPrefab);
                fullLadderNode.addChild(ladderPart);
                ct++; 
                fullLadderNodeheight =  ct * ladderPart.getComponent(Sprite).spriteFrame.height ;
            }
            fullLadderNode.setRotationFromEuler(angleDegrees, angleDegrees , angleDegrees);

            this.node.addChild(fullLadderNode) ;


            // // // // // not using 

            // let ladderNode = instantiate(this.ladderPrefab) ;
            // ladderNode.getComponent(setLadders).setLadderImage(i+1) ;
            // let width = ladderNode.getChildByName('ladderImg').getComponent(Sprite).spriteFrame.width  ;        
            // let height = ladderNode.getChildByName('ladderImg').getComponent(Sprite).spriteFrame.height  ;        
            // console.log( "width => " , width , " height => " , height ) ;
            // let newPos = new Vec3( 100*i , 100*i , 0 )
            // ladderNode.setPosition(newPos) ;
            // this.node.addChild(ladderNode) ;
        }
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
        this.backgroundMusic.play();
        this.isAnimating = true ;
        this.player1Turn = false ;
        this.player2Turn = true ;
        console.log( " player 1 roll dice randomly => " ) ;
        let randomNumber = Math.floor(Math.random() * 6);
        this.diceImg.getComponent(Sprite).spriteFrame = this.diceImgArray[randomNumber] ;
        this.scheduleOnce(() => {
            this.movePlayer1(randomNumber+1) ;
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
        this.backgroundMusic.play();
        this.isAnimating = true ;
        this.player2Turn = false ;
        this.player1Turn = true ;
        console.log( " player 2 roll dice randomly => " ) ;
        let randomNumber = Math.floor(Math.random() * 6);
        this.diceImg.getComponent(Sprite).spriteFrame = this.diceImgArray[randomNumber] ;
        this.scheduleOnce(() => {
            this.movePlayer2(randomNumber+1) ;
        }, 0.5);
    }



    ifLastCell(playerImg : Node , currCell : number , remainingSteps:number , playerindex : number)
    {
        if( remainingSteps == 0 )
        {
            this.backgroundMusic.stop();
            this.isAnimating = false ;
            return ;
        }
        if( playerindex == 1 ) this.player1CurrCell = currCell ;
        else this.player2CurrCell = currCell ;
        //
        let posNode=this.cellNodesMap.get(currCell.toString())
        let worldpos = posNode.getWorldPosition(); 
        let pl1NextCellPosition=  this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(worldpos);
        console.log( "currCell " , currCell , "  remainingSteps " , remainingSteps ) ;
        tween(playerImg)
        .to(0.1, { position: pl1NextCellPosition }, {
            easing: 'quadInOut',
            onComplete: () => { 
                this.ifLastCell( playerImg , currCell-1 , remainingSteps-1 , playerindex ) ;
            }
        })
        .start();
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
            return ;
        }
        if( playerindex == 1 ) this.player1CurrCell = currCell ;
        else this.player2CurrCell = currCell ;
        let posNode=this.cellNodesMap.get(currCell.toString())
        console.log("Our Node",posNode)
        let worldpos = posNode.getWorldPosition(); 
        let NextCellPosition=  this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(worldpos);

        tween(playerImg)
        .to(0.1, { position: NextCellPosition }, {
            easing: 'quadInOut',
            onComplete: () => { 
                if( currCell == finalCell && finalCell == 100 )
                {
                    
                    window.alert(` Player ${playerindex} is winner `) ;
                    Tween.stopAll()
                    window.alert('Play Again ') ;
                    director.loadScene('mainScene') ;
                    return currCell ;
                }
                this.playerTweenAnimation( playerImg , currCell+1 , finalCell , playerindex) ;
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
    }

    movePlayer2( diceNumber : number )
    {
        console.log( " moveplayer1 fucntion " ) ;
        let pl2currCell = this.player2CurrCell;
        let pl2FinalCell = this.player2CurrCell + diceNumber;
        console.log( "currCell " , pl2currCell , "  finalcell " , pl2FinalCell ) ;
        this.playerTweenAnimation( this.player2Img , pl2currCell+1 , pl2FinalCell , 2 ) ;
        console.log( "currCell " , this.player2CurrCell  ) ;
    }


   
    
  


    

    update(deltaTime: number) 
    {
        
    }





}


