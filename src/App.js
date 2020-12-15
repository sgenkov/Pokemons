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
import { Button } from './Utils/Button';

export class App {
    constructor(app, resources) {
        console.log('App created');
        document.body.appendChild(app.view);
        this.app = app;
        this.resources = resources;
        this.selectHeroScreen = new SelectHeroScreen(app);
        this.battleScreen = new BattleScreen(app);
        this.battleScreen.visible = false;

        this.winnerText = new PIXI.Text("default", {
            fontSize: 100,
            fill: 0x000000,
            align: "center",
            stroke: "#bbbbbb",
            strokeThickness: 0,
        });
        this.winnerText.position.x = app.view.width / 2;
        this.winnerText.position.y = app.view.height / 3;
        this.winnerText.anchor.set(0.5);
        this.heroes = resources.map(hero => new Hero(Hero.getHeroStats(hero), this));
        // this.heroes.forEach(hero => app.stage.addChild(hero.sprite))

        this.soundProvider = new SoundProvider();
        this.soundProvider.mainMenu.play();   //           ==========================================UNCOMMENT THIS AT DEPLOY
        this.timeline = gsap.timeline();
        this.init(app);
    };

    newGame() {
        console.log('New Game');
        this.soundProvider.mainMenu.play();   //           ==========================================UNCOMMENT THIS AT DEPLOY
        this.battleScreen.visible = false;
        this.selectHeroScreen.visible = true;
        Hero.appearancePosition = { x: 0, y: 60 };
        this.battleScreen.children = [];
        this.selectHeroScreen.children = [];
        this.heroes = this.resources.map(hero => new Hero(Hero.getHeroStats(hero), this));
        console.log(this.battleScreen);
        this.init(this.app);
    };
    async battle() {
        const sequnce = this.determineSequence();
        const fasterCreature = sequnce[0];
        const slowerCreature = sequnce[1];
        console.log(`fasterCreature : ${fasterCreature.name}`);
        console.log(`slowerCreature : ${slowerCreature.name}`);
        await this.battleScreen.addChild(fasterCreature.sprite);
        await this.battleScreen.addChild(slowerCreature.sprite);
        // fasterCreature.healthBar.toggleBar(true);
        // slowerCreature.healthBar.toggleBar(true);


        while (fasterCreature.currentHitPoints > 0 && slowerCreature.currentHitPoints > 0) {
            if (fasterCreature.currentHitPoints > 0 && slowerCreature.currentHitPoints > 0) {
                await Hero.creatureAttackAnimation(fasterCreature, this.timeline, this.app);
                this.soundProvider.hitSound.play();   //           ==========================================UNCOMMENT THIS AT DEPLOY
            } else {
                break;
            };
            const fasterCreatureDamage = fasterCreature.attackEnemy(slowerCreature);

            if (slowerCreature.currentHitPoints > 0 && fasterCreatureDamage > 0 && fasterCreature.currentHitPoints > 0) {
                await Hero.creatureBlinkAnimation(slowerCreature, this.timeline);
            } else {
                break;
            };

            if (slowerCreature.currentHitPoints > 0 && fasterCreature.currentHitPoints > 0) {
                await Hero.creatureAttackAnimation(slowerCreature, this.timeline, this.app);
                this.soundProvider.hitSound.play();   //           ==========================================UNCOMMENT THIS AT DEPLOY
            } else {
                break;
            };
            const slowerCreatureDamage = slowerCreature.attackEnemy(fasterCreature);

            if (fasterCreature.currentHitPoints > 0 && slowerCreatureDamage > 0 && slowerCreature.currentHitPoints > 0) {
                await Hero.creatureBlinkAnimation(fasterCreature, this.timeline);
            } else {
                break;
            };
        };
        if (fasterCreature.currentHitPoints <= 0) {
            this.soundProvider.battleSound.stop();   //           ==========================================UNCOMMENT THIS AT DEPLOY
            fasterCreature.sprite.tint = 0x000000;
            this.winner = this.determineWinner(slowerCreature);
        };
        if (slowerCreature.currentHitPoints <= 0) {
            this.soundProvider.battleSound.stop();   //           ==========================================UNCOMMENT THIS AT DEPLOY
            slowerCreature.sprite.tint = 0x000000;
            this.winner = this.determineWinner(fasterCreature);
        };

        this.winnerText.text = this.winner;
        this.battleScreen.addChild(this.winnerText);
        // app.stage.addChild(App.text);
        if(this.winner === 'You Win') {
            this.soundProvider.winBattle.play();   //           ==========================================UNCOMMENT THIS AT DEPLOY
        } else {
            this.soundProvider.loseBattle.play();   //           ==========================================UNCOMMENT THIS AT DEPLOY
        };

        this.button = new Button(this.app, this.battleScreen);
        this.button.button.on("pointerdown", () => {
            this.newGame();
        });
    };

    determineWinner(creature) {
        return (creature.heroType === HeroType.Player) ? 'You Win' : 'You Lose';
    };

    determineSequence() {
        const sequence = [this.playerHero, this.opponentHero];
        if (this.playerHero.speed != this.opponentHero.speed) {
            sequence.sort((creature1, creature2) => creature2.speed - creature1.speed);
        } else {
            sequence.sort((creature1, creature2) => creature2.id - creature1.id);
        };
        return sequence;
    };








    selectOpponent() {
        let id = Math.random() * 19;
        this.opponentHero = this.heroes[Math.floor(id)];
        this.opponentHero.heroType = HeroType.Opponent;
        this.opponentHero.setBattleMode(true);
    };

    readyForBattle() {
        console.log('Ready for battle');
        
        this.heroes = this.heroes.filter(hero => hero.heroType !== HeroType.Player);
        this.selectOpponent();
        console.log(`PLayer Hero : ${this.playerHero.name}`);
        console.log(`Opponent Hero : ${this.opponentHero.name}`);
        this.selectHeroScreen.visible = false;
        this.battleScreen.visible = true;
        this.battle()
    };
    async init(app) {
        await this.heroes.forEach(hero => {
            hero.showYourself(this.selectHeroScreen, Math.random() * app.view.width, Math.random() * app.view.height);
        });
        app.stage.addChild(this.selectHeroScreen, this.battleScreen);
        app.ticker.start();
        Hero.previewHeroes(this.heroes);
        this.heroes.forEach((hero) => {
            hero.sprite.on("pointerdown", () => {
                this.soundProvider.mainMenu.stop();   //           ==========================================UNCOMMENT THIS AT DEPLOY
                this.soundProvider.battleSound.play();   //           ==========================================UNCOMMENT THIS AT DEPLOY
                Hero.hideHeroes(this);
                this.playerHero = hero;
                this.playerHero.heroType = HeroType.Player;
                this.playerHero.setBattleMode(true);
                // this.healthBar.type = HeroType.Player;
                setTimeout(() => {

                    this.readyForBattle();
                }, 2000);
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