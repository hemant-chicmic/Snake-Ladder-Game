import { _decorator, Component, Node, randomRange, randomRangeInt, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('setLadders')
export class setLadders extends Component {





    // @property({type : Node})
    // ladderImg : Node | null = null ; 

    // @property({type : [SpriteFrame]})
    // ladderImgArray : SpriteFrame[] = [] ; 


    setLadderImage(index)
    {
        // let ind = randomRangeInt(0 , 4) ;
        // // this.ladderImg.getComponent(Sprite).spriteFrame = this.ladderImgArray[ind+1] ;
        // this.ladderImg.getComponent(Sprite).spriteFrame = this.ladderImgArray[index%5] ;
    }






    start() {

    }

    update(deltaTime: number) {
        
    }
}

