import { BlurFilter } from '@pixi/filter-blur';
import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Sprite } from '@pixi/sprite';
import * as PIXI from 'pixi.js';
import { Hero } from './Hero/Hero';
import { SoundProvider } from './Utils/SoundProvider';
import { gsap } from 'gsap';
import { SelectHeroScreen } from './Screens/SelectHeroScreen';
import { BattleScreen } from './Screens/BattleScreen';
import { HeroType } from './Hero/HeroType';
export class App {
    constructor(app, resources) {
        console.log('App created');
        document.body.appendChild(app.view);
        this.app = app;
        this.selectHeroScreen = new SelectHeroScreen(app);
        this.battleScreen = new BattleScreen(app);
        this.battleScreen.visible = false;

        this.heroes = resources.map(hero => new Hero(Hero.getHeroStats(hero), this));
        // this.heroes.forEach(hero => app.stage.addChild(hero.sprite))

        this.soundProvider = new SoundProvider();
        // this.soundProvider.mainMenu.play();              ==========================================UNCOMMENT THIS AT DEPLOY
        this.timeline = gsap.timeline();
        this.init(app);
    };

    selectOpponent() {
        let id = Math.random() * 19;
        this.opponentHero = this.heroes[Math.floor(id)];
        this.opponentHero.heroType = HeroType.Opponent;
        this.opponentHero.setBattleMode(true);
    };

    readyForBattle(){
        console.log('Ready for battle');
        this.heroes = this.heroes.filter(hero => hero.heroType !== HeroType.Player);
        this.selectOpponent();
        console.log(`PLayer Hero : ${this.playerHero.name}`);
        console.log(`Opponent Hero : ${this.opponentHero.name}`);
    };
    async init(app) {
        await this.heroes.forEach(hero => {
            hero.showYourself(this.selectHeroScreen, Math.random() * app.view.width, Math.random() * app.view.height);
        });
        app.stage.addChild(this.selectHeroScreen, this.battleScreen);
        app.ticker.start();
        Hero.previewHeroes(this.heroes);
        this.heroes.forEach(hero => {
            hero.sprite.on("pointerdown", () => {
                hero.battleMode = true;
                hero.heroType = HeroType.Player;
                console.log('Hero selected from Hero.js r72', hero.name);
                Hero.hideHeroes(this);
                this.playerHero = hero;
                // this.healthBar.type = HeroType.Player;
                this.readyForBattle();
            });
            hero.sprite.on("pointerover", () => {
                hero.sprite.tint = 0x1AE8EA;
                hero.heroInfo.toggleVisible();
            });
            hero.sprite.on("pointerout", () => {
                hero.sprite.tint = 16777215;
                hero.heroInfo.toggleVisible();
            });
        })
    };

};