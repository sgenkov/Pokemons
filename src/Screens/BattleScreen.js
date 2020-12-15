import * as PIXI from 'pixi.js';
export class BattleScreen extends PIXI.Container {
    constructor(app){
        super();
        this.width = app.view.width;
        this.height = app.view.height;
    };

};