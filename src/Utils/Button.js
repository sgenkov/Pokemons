import * as PIXI from 'pixi.js';
export class Button {
    constructor(app, container) {
        this.container = container;
        this.button = new PIXI.Graphics();
        this.button.beginFill(0xff0000);
        this.button.lineStyle(5, 0x00ff00);
        this.button.drawRect(app.view.width / 2 - 90, app.view.height / 2 - 40, 180, 80);
        this.button.endFill();

        this.button.buttonMode = true;
        this.button.interactive = true;

        this.text = new PIXI.Text("New Game", {
            fontSize: 30,
            fill: 0x000000,
            align: "center",
            stroke: "#bbbbbb",
            strokeThickness: 0,
        });

        this.text.position.x = app.view.width / 2;
        this.text.position.y = app.view.height / 2;
        this.text.anchor.set(0.5);

        container.addChild(this.button);
        container.addChild(this.text);
    };

};