import * as PIXI from 'pixi.js';
export class BattleScreen extends PIXI.Container {
    constructor(app){
        super();
        this.width = app.view.width;
        this.height = app.view.height;
        this.background = new PIXI.Sprite.from(app.loader.resources['battleBackground'].url);
        this.background.scale.x = app.view.width / 290;
        this.background.scale.y = app.view.height / 162;
        this.winnerText = new PIXI.Text(" ", {
            fontSize: 100,
            fill: 0x000000,
            align: "center",
            stroke: "#bbbbbb",
            strokeThickness: 0,
        });
        this.winnerText.position.x = app.view.width / 2;
        this.winnerText.position.y = app.view.height / 3;
        this.winnerText.anchor.set(0.5);
        this.winnerText.visible = false;
        this.addChild(this.background, this.winnerText);
    };

    clearContainer() {
        this.children.splice(2, this.children.length - 1);
    };

};