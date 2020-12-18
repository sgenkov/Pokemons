import * as PIXI from 'pixi.js';
import { HeroType } from '../Hero/HeroType';
import { Button } from '../Utils/Button';

export class BattleScreen extends PIXI.Container {
    constructor(app, soundProvider) {
        super();
        this.app = app;
        this.soundProvider = soundProvider;
        this.width = app.view.width;
        this.height = app.view.height;
        this.visible = false;
        this.isCompleted = false;
        this.background = new PIXI.Sprite.from(app.loader.resources['battleBackground'].url);
        this.background.scale.x = app.view.width / 290;
        this.background.scale.y = app.view.height / 162;
        this._winnerText = new PIXI.Text(" ", {
            fontSize: 100,
            fill: 0x000000,
            align: "center",
            stroke: "#bbbbbb",
            strokeThickness: 0,
        });
        this._winnerText.position.x = app.view.width / 2;
        this._winnerText.position.y = app.view.height / 3;
        this._winnerText.anchor.set(0.5);
        this._winnerText.visible = false;
        this.addChild(this.background, this._winnerText);
    };
    
    readyForBattle(heroes) {
        this.playerHero = heroes.find((hero) => hero.heroType === HeroType.Player);
        heroes = heroes.filter(hero => hero.heroType !== HeroType.Player); // ??
        this.visible = true;
        this.selectOpponent(heroes);
        this.battle()
    };

    selectOpponent(heroes) {
        let id = Math.random() * 19;
        this.opponentHero = heroes[Math.floor(id)];
        this.opponentHero.heroType = HeroType.Opponent;
        this.opponentHero.setBattleMode(true);
    };

    async battle() {

        const sequnce = this.determineSequence();
        const [fasterCreature, slowerCreature] = sequnce;
        
        this.addChild(fasterCreature.sprite);
        this.addChild(slowerCreature.sprite);
        this.addChild(fasterCreature.healthBar.bar);
        this.addChild(slowerCreature.healthBar.bar);

        while (fasterCreature.currentHitPoints > 0 && slowerCreature.currentHitPoints > 0) {
            if (fasterCreature.currentHitPoints > 0 && slowerCreature.currentHitPoints > 0) {
                await fasterCreature.creatureAttackAnimation(this.app);
                this.soundProvider.hitSound.play();
            } else {
                break;
            };
            const fasterCreatureDamage = fasterCreature.attackEnemy(slowerCreature);

            if (slowerCreature.currentHitPoints > 0 && fasterCreatureDamage > 0 && fasterCreature.currentHitPoints > 0) {
                await slowerCreature.creatureBlinkAnimation(this.app);
            } else {
                break;
            };

            if (slowerCreature.currentHitPoints > 0 && fasterCreature.currentHitPoints > 0) {
                await slowerCreature.creatureAttackAnimation(this.app);
                this.soundProvider.hitSound.play();
            } else {
                break;
            };
            const slowerCreatureDamage = slowerCreature.attackEnemy(fasterCreature);

            if (fasterCreature.currentHitPoints > 0 && slowerCreatureDamage > 0 && slowerCreature.currentHitPoints > 0) {
                await fasterCreature.creatureBlinkAnimation(this.app);
            } else {
                break;
            };
        };
        sequnce.forEach((creature) => {
            if (creature.currentHitPoints <= 0) {
                this.soundProvider.battleSound.stop();
                creature.sprite.tint = 0x000000;
                this.winner = this.determineWinner(creature);
            };
        });

        this.winnerText = this.winner;

        if (this.winner === 'You Win') {
            this.soundProvider.winBattle.play();
        } else {
            this.soundProvider.loseBattle.play();
        };

        this.button = new Button(this.app, this);
        this.button.button.on("pointerdown", () => {
            this.isCompleted = true;
            this.visible = false;
            this.soundProvider.loseBattle.stop();
            this.soundProvider.winBattle.stop();
            this.clearContainer();
        });
    };

    determineWinner(creature) {
        return (creature.heroType === HeroType.Opponent) ? 'You Win' : 'You Lose';
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

    set winnerText(text) {
        this._winnerText.text = text;
        this._winnerText.visible = (text === ' ') ? false : true;
    };

    clearContainer() {
        this.children.splice(2, this.children.length - 1);
    };

};