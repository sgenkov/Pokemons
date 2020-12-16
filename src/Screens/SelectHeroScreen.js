import * as PIXI from 'pixi.js';
export class SelectHeroScreen extends PIXI.Container {
    constructor(app) {
        super();
        this.width = app.view.width;
        this.height = app.view.height;
        this.background = new PIXI.Sprite.from(app.loader.resources['MainMenuBackground'].url);
        this.background.scale.x = app.view.width / 500;
        this.background.scale.y = app.view.height / 300;
        this.addChild(this.background);
    };
    clearContainer() {
        while (this.children.length > 1) {
            this.children.pop();
        };
    };

};