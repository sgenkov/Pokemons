import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { HeroType } from '../Hero/HeroType';
export class SelectHeroScreen extends PIXI.Container {
    constructor(app) {
        super();
        this.width = app.view.width;
        this.height = app.view.height;
        this.background = new PIXI.Sprite.from(app.loader.resources['MainMenuBackground'].url);
        this.background.scale.x = app.view.width / 500;
        this.background.scale.y = app.view.height / 300;
        this.visible = false;
        this.isCompleted = false;
        this.addChild(this.background);
    };

    init(app, heroes, soundProvider) {
        this.soundProvider = soundProvider;
        this.visible = true;
        heroes.forEach(hero => {
            hero.showYourself(this, Math.random() * app.view.width, Math.random() * app.view.height);
        });
        this.previewHeroes(heroes);
        heroes.forEach((hero) => {
            hero.sprite.on("pointerdown", () => {
                soundProvider.mainMenu.stop();
                soundProvider.battleSound.play();
                this.hideHeroes(heroes, app);
                hero.heroType = HeroType.Player;
                hero.setBattleMode(true);
                setTimeout(() => {
                    this.visible = false;
                    this.isCompleted = true; 
                    this.clearContainer();
                }, 1500);
            });
            hero.sprite.on("pointerover", () => {
                hero.sprite.tint = 0x1AE8EA;
                hero.heroInfo.toggleVisible();
            });
            hero.sprite.on("pointerout", () => {
                hero.sprite.tint = 16777215;
                hero.heroInfo.toggleVisible();
            });
        });
    };

    previewHeroes(heroes) {
        heroes.forEach(hero => {
            gsap.to(hero.sprite, {
                x: Math.floor(hero.appearance.x),
                y: Math.floor(hero.appearance.y),
                duration: 1.0,
                repeat: 0,
                yoyo: false,
                rotation: 2 * Math.PI,
            });
        });
    };

    async hideHeroes(heroes, app) {
        heroes.forEach(hero => {
            gsap.to(hero.sprite, {
                x: Math.random() * app.view.width,
                y: Math.random() * app.view.height + app.view.height + 100,
                duration: 1.0,
                repeat: 0,
                yoyo: false,
                rotation: 2 * Math.PI,
            });
        });
    };

    clearContainer() {
        this.children.splice(1, this.children.length - 1);
    };

};