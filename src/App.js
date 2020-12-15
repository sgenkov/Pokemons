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
export class App {
    constructor(app, resources) {
        console.log('App created');
        document.body.appendChild(app.view);
        this.app = app;
        this.selectHeroScreen = new SelectHeroScreen(app);
        this.battleScreen = new BattleScreen(app);

        this.heroes = resources.map(hero => new Hero(Hero.getHeroStats(hero), this));
        // this.heroes.forEach(hero => app.stage.addChild(hero.sprite))

        this.soundProvider = new SoundProvider();
        // this.soundProvider.mainMenu.play();              ==========================================UNCOMMENT THIS AT DEPLOY
        this.timeline = gsap.timeline();
        this.init(app);
    };

    async init(app) {
        await this.heroes.forEach(hero => {
            hero.showYourself(this.selectHeroScreen, Math.random() * app.view.width, Math.random() * app.view.height);
        });
        app.stage.addChild(this.selectHeroScreen);
        app.ticker.start();
        Hero.previewHeroes(this.heroes);
    };

};