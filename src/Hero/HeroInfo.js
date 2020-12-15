import * as PIXI from 'pixi.js';
export class HeroInfo {
    _isVisible = false;
    sprite;
    stats;
    info;

    constructor(heroInfo, app) {
        console.log('HeroInfo created');
        this.sprite = PIXI.Sprite.from(app.loader.resources[`${heroInfo.name}_front_default`].url);
        this.sprite.scale.x = 4;
        this.sprite.scale.y = 4;
        this.sprite.x = app.view.width / 3;
        this.sprite.y = app.view.height / 1.8;
        this.sprite.anchor.set(0.5);
        this.sprite.visible = this._isVisible;
        app.stage.addChild(this.sprite);

        this.info = new PIXI.Text(
            `        Name: ${heroInfo.name}
        Ability: ${heroInfo.ability}
        Move 1: ${heroInfo.moves[0]}
        Move 2: ${heroInfo.moves[1]}
        Move 3: ${heroInfo.moves[2]}
        Move 4: ${heroInfo.moves[3]}
        Speed: ${heroInfo.primaryStats.speed}
        Special defense: ${heroInfo.primaryStats['special-defense']}
        Special attack: ${heroInfo.primaryStats['special-attack']}
        Defense: ${heroInfo.primaryStats.defense}
        Attack: ${heroInfo.primaryStats.attack}
        HP: ${heroInfo.primaryStats.hp}
        Moral: ${heroInfo.primaryStats.moral}`);
        this.info.x = app.view.width / 1.8;
        this.info.y = app.view.height / 1.8;
        this.info.anchor.set(0.5);
        this.info.visible = this._isVisible;
        app.stage.addChild(this.info);
    };

    toggleVisible() {
        this.isVisible = !this.isVisible;
        this.sprite.visible = this.isVisible;
        this.info.visible = this.isVisible;
    };
};