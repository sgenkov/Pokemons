import * as PIXI from 'pixi.js';
import { HeroType } from './HeroType';
import { gsap } from 'gsap';
import { HeroInfo } from './HeroInfo';
export class Hero {
    static appearancePosition = { x: 0, y: 60 };

    constructor(heroStats, ref) {
        console.log('Hero created');
        this.ref = ref;
        this.id = heroStats.id - 1;
        this.name = heroStats.name;
        this.ability = heroStats.ability;
        this.moves = heroStats.moves;
        this.speed = heroStats.primaryStats.speed;
        this.special_defense = heroStats.primaryStats['special-defense'];
        this.special_attack = heroStats.primaryStats['special-attack'];
        this.defense = heroStats.primaryStats.defense;
        this.attack = heroStats.primaryStats.attack;
        this.hitPoints = heroStats.primaryStats.hp;
        this.currentHitPoints = this.hitPoints;
        this.appearance = { ...Hero.getAppearancePosition(ref.app)};
        this.heroType = HeroType.Not_selected;
        this.battleMode = false;
        // this.healthBar = new HealthBar(this.hitPoints, this.currentHitPoints);
        // this.healthBar.type = HeroType.Not_selected;

        this.sprite_front_default = PIXI.Sprite.from(ref.app.loader.resources[`${this.name}_front_default`].url);
        this.sprite_back_default = PIXI.Sprite.from(ref.app.loader.resources[`${this.name}_back_default`].url);
        this.sprite = this.sprite_front_default;
        this.heroInfo = new HeroInfo(heroStats, ref);
    };
    

    attack(victim) {
        const damage = (this.attack / victim.defense) * Math.round(Math.random() * 30); // 200 is too much, isn't it?

        (damage > 0) && (victim.currentHitPoints -= damage);
        victim.healthBar.updateHitpoints(victim.currentHitPoints);
        App.hitSound.play();
        return damage;
    };

    showYourself(
        container,
        xPosition = container.view.width / 2,
        yPosition = container.view.height / 2,
        heroType = HeroType.Not_selected,
        scaleX = 1,
        scaleY = 1,
    ) {
        switch (heroType) {
            case HeroType.Opponent:
                this.sprite = this.sprite_front_default;
                break;
            case HeroType.Player:
                this.sprite = this.sprite_back_default;
                break;
        };

        this.sprite.scale.x = scaleX;
        this.sprite.scale.y = scaleY;
        this.sprite.x = xPosition;
        this.sprite.y = yPosition;
        this.sprite.anchor.set(0.5);
        this.sprite.buttonMode = true;
        this.sprite.interactive = true;

        container.addChild(this.sprite);
    };

    setBattleMode(mode) {
        this.battleMode = mode;
        if (this.battleMode) {
            if (this.heroType === HeroType.Player) {
                this.sprite = this.sprite_back_default;
                this.sprite.x = this.ref.app.view.width / 9;
                this.sprite.y = this.ref.app.view.height / 2;
            } else if (this.heroType === HeroType.Opponent) {
                this.sprite.x = this.ref.app.view.width * 9 / 10;
                this.sprite.y = this.ref.app.view.height / 2;
            }
            this.sprite.anchor.set(0.5);
            this.sprite.scale.x = 3.4;
            this.sprite.scale.y = 3.4;
            this.sprite.buttonMode = false;
            this.sprite.interactive = false;
            this.sprite.visible = true;
        } else {
            this.sprite = this.sprite_front_default;
            this.sprite.scale.x = 1;
            this.sprite.scale.y = 1;
            this.sprite.visible = true;
        };
    };

    static getHeroStats(heroFullStack) {
        const id = heroFullStack.id;
        const ability = heroFullStack.abilities.find((ability) => {
            return ability.is_hidden === false;
        }).ability.name;
        const moves = heroFullStack.moves.slice().splice(0, 4).map((move) => {
            return move.move.name;
        });

        const primaryStats = heroFullStack.stats.reduce((heroStatsContainer, stat) => {
            heroStatsContainer = Object.assign({ ...heroStatsContainer }, { [stat.stat.name]: stat.base_stat });
            return heroStatsContainer;
        }, {});

        return {
            id,
            name: heroFullStack.name,
            ability,
            moves,
            primaryStats
        };
    };

    static getAppearancePosition(app) {
        if (Hero.appearancePosition.x > app.view.width * 18 / 20) {//* 9 / 10
            Hero.appearancePosition.x = 0;
            Hero.appearancePosition.y += app.view.height * 3 / 20   //+= 100;
        };
        Hero.appearancePosition.x += app.view.width / 11;
        return Hero.appearancePosition;
    };
    static async creatureAttackAnimation(creature) {
        await App.timeline.to(creature.sprite, {
            x: (creature.heroType === HeroType.Player)
                ? ref.app.view.width * 17 / 20
                : ref.app.view.width * 4 / 20,
            duration: 0.5,
            repeat: 1,
            yoyo: true,
        });
    };

    static async creatureBlinkAnimation(creature) {
        await App.timeline.to(creature.sprite, {
            alpha: 0,
            duration: 0.1,
            repeat: 5,
            yoyo: true,
        });
    };

    static previewHeroes(heroes) {
        console.log('Preview heroes');
        heroes.forEach(hero => {
            gsap.to(hero.sprite, {
                x: Math.floor(hero.appearance.x),
                y:  Math.floor(hero.appearance.y),
                duration: 1.0,
                repeat: 0,
                yoyo: false,
                rotation: 2 * Math.PI,
            });
        })
    };

    static hideHeroes(ref) {
        console.log('Hide Heroes');
        ref.heroes.forEach(hero => {
            gsap.to(hero.sprite, {
                x: Math.random() * ref.app.view.width,
                y: Math.random() * ref.app.view.height + ref.app.view.height + 100,
                duration: 1.0,
                repeat: 0,
                yoyo: false,
                rotation: 2 * Math.PI,
            });
        });
    };

};
