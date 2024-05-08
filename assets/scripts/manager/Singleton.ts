import { _decorator, Component, Node, resources, SpriteFrame } from "cc";
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


  // loadResource(path: string) {
  //   return new Promise((resolve, reject) => {
  //     resources.loadDir(path, SpriteFrame, (err, asset) => {
  //       if (err) {
  //         console.log("reject");
  //         reject(err);
  //       } else {
  //         this.spriteArray = asset;
  //         //console.log(asset.length);
  //         resolve("exist");
  //       }
  //     });
  //   });
  // }



}
