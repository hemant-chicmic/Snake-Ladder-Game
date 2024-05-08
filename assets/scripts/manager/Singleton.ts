import { _decorator, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Singleton")
export class Singleton {
  static instance: Singleton = null;
  spriteArray: SpriteFrame[] = [];
  private Singleton() {}

  public static getInstance(): Singleton {
    if (this.instance === null) {
      this.instance = new Singleton();
    }
    return this.instance;
  }


  _playerOne:SpriteFrame;
  set playerOne(val:SpriteFrame){
    this._playerOne=val
  }
  get playerOne(){
    return this._playerOne
  }
  
  _playerTwo:SpriteFrame;
  set playerTwo(val:SpriteFrame){
    this._playerTwo=val
  }
  get playerTwo(){
    return this._playerTwo
  }





  _totalLadders:number;
  set totalLadders(val:number){
    this._totalLadders = val ;
  }
  get totalLadders(){
    return this._totalLadders ;
  }

  _totalSnakes:number;
  set totalSnakes(val:number){
    this._totalSnakes = val ;
  }
  get totalSnakes(){
    return this._totalSnakes ;
  }




}
