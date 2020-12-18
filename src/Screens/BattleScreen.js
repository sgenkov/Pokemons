import * as PIXI from 'pixi.js';
export class BattleScreen extends PIXI.Container {
    constructor(app){
        super();
        this.width = app.view.width;
        this.height = app.view.height;
        this.background = new PIXI.Sprite.from(app.loader.resources['battleBackground'].url);
        this.background.scale.x = app.view.width / 290;
        this.background.scale.y = app.view.height / 162;
        this.addChild(this.background);
    };

    clearContainer() {
        this.children.splice(1, this.children.length - 1);
    };

};