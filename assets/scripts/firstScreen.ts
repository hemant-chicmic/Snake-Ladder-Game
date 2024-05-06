import { _decorator, Component, director, Node, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('firstScreen')
export class firstScreen extends Component {




    start() {

    }

    update(deltaTime: number) {
        
    }


    playGame()
    {
        Tween.stopAll() ;
        console.log( " playe game ") ;
        director.loadScene( 'secondScene' ) ;
    }









}

