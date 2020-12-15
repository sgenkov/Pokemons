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
        this.selectHeroScreen = new SelectHeroScreen(app);
        this.battleScreen = new BattleScreen(app);

        this.heroes = resources.map(hero => new Hero(Hero.getHeroStats(hero), app));
        // this.heroes.forEach(hero => app.stage.addChild(hero.sprite))

        this.soundProvider = new SoundProvider();
        // this.soundProvider.mainMenu.play();              ==========================================UNCOMMENT THIS AT DEPLOY
        this.timeline = gsap.timeline();
        this.init(app);
        console.log('Hero screen', this.selectHeroScreen);
    };

    async init(app) {
        console.log('Test 1');
        await this.heroes.forEach(hero => {
            hero.showYourself(this.selectHeroScreen, Math.random() * app.view.width, Math.random() * app.view.height);
        });
        console.log('Test 2');
        // AnimationsProvider.previewHeroes();
        app.stage.addChild(this.selectHeroScreen);
        console.log('Test 3');
        app.ticker.start();
        console.log('Test 4');
        Hero.previewHeroes(this.heroes);
    };

};