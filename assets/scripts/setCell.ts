import { _decorator, Color, Component, Label, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('setCell')
export class setCell extends Component {


    @property({type:Label})
    cellNumber:Label = null;




    setCellNumber(cellno:number)
    {
        const randomR = Math.random() * 255;
        const randomG = Math.random() * 255;
        const randomB = Math.random() * 255;

        const randomColor = new Color(randomR, randomG, randomB);
        this.node.getComponent(Sprite).color = randomColor;
        this.cellNumber.string = cellno.toString();
    }






    start() {

    }

    update(deltaTime: number) {
        
    }
}

