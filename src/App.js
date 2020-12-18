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
        document.body.appendChild(app.view);
        this.app = app;
        this.resources = resources;
        this.selectHeroScreen = new SelectHeroScreen(app);
        this.battleScreen = new BattleScreen(app);
        this.battleScreen.visible = false;

        this.heroes = resources.map(heroResource => new Hero(heroResource, this));

        this.soundProvider = new SoundProvider();
        this.soundProvider.mainMenu.play();
        this.timeline = gsap.timeline();
        this.init(app);
    };

    newGame() {
        this.battleScreen.winnerText.visible = false;
        this.soundProvider.mainMenu.play();
        this.battleScreen.visible = false;
        this.selectHeroScreen.visible = true;
        Hero.appearancePosition = { x: 0, y: 60 };
        this.battleScreen.clearContainer();
        this.selectHeroScreen.clearContainer();
        this.heroes = this.resources.map(heroResource => new Hero(heroResource, this));
        this.init(this.app);
    };
    async battle() {
        
        const sequnce = this.determineSequence();
        const fasterCreature = sequnce[0];
        const slowerCreature = sequnce[1];
        this.battleScreen.addChild(fasterCreature.sprite);
        this.battleScreen.addChild(slowerCreature.sprite);
        this.battleScreen.addChild(fasterCreature.healthBar.bar); 
        this.battleScreen.addChild(slowerCreature.healthBar.bar);


        while (fasterCreature.currentHitPoints > 0 && slowerCreature.currentHitPoints > 0) {
            if (fasterCreature.currentHitPoints > 0 && slowerCreature.currentHitPoints > 0) {
                await fasterCreature.creatureAttackAnimation(this.timeline, this.app);
                this.soundProvider.hitSound.play(); 
            } else {
                break;
            };
            const fasterCreatureDamage = fasterCreature.attackEnemy(slowerCreature);

            if (slowerCreature.currentHitPoints > 0 && fasterCreatureDamage > 0 && fasterCreature.currentHitPoints > 0) {
                await slowerCreature.creatureBlinkAnimation(this.timeline);
            } else {
                break;
            };

            if (slowerCreature.currentHitPoints > 0 && fasterCreature.currentHitPoints > 0) {
                await slowerCreature.creatureAttackAnimation(this.timeline, this.app);
                this.soundProvider.hitSound.play(); 
            } else {
                break;
            };
            const slowerCreatureDamage = slowerCreature.attackEnemy(fasterCreature);

            if (fasterCreature.currentHitPoints > 0 && slowerCreatureDamage > 0 && slowerCreature.currentHitPoints > 0) {
                await fasterCreature.creatureBlinkAnimation(this.timeline);
            } else {
                break;
            };
        };
        if (fasterCreature.currentHitPoints <= 0) {
            this.soundProvider.battleSound.stop(); 
            fasterCreature.sprite.tint = 0x000000;
            this.winner = this.determineWinner(slowerCreature);
        };
        if (slowerCreature.currentHitPoints <= 0) {
            this.soundProvider.battleSound.stop();
            slowerCreature.sprite.tint = 0x000000;
            this.winner = this.determineWinner(fasterCreature);
        };

        this.battleScreen.winnerText.text = this.winner;
        this.battleScreen.winnerText.visible = true;
        
        if(this.winner === 'You Win') {
            this.soundProvider.winBattle.play(); 
        } else {
            this.soundProvider.loseBattle.play(); 
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
        this.heroes = this.heroes.filter(hero => hero.heroType !== HeroType.Player);
        this.selectOpponent();
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
                this.soundProvider.mainMenu.stop();  
                this.soundProvider.battleSound.play();  
                Hero.hideHeroes(this);
                this.playerHero = hero;
                this.playerHero.heroType = HeroType.Player;
                this.playerHero.setBattleMode(true);
                setTimeout(() => {
                    this.readyForBattle();
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
        })
    };

};