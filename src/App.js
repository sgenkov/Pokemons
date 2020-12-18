import { Hero } from './Hero/Hero';
import { SoundProvider } from './Utils/SoundProvider';
import { SelectHeroScreen } from './Screens/SelectHeroScreen';
import { BattleScreen } from './Screens/BattleScreen';
import { HeroType } from './Hero/HeroType';

export class App {
    constructor(app, resources) {
        document.body.appendChild(app.view);
        this.app = app;
        this.resources = resources;
        this.soundProvider = new SoundProvider();
        this.battleScreen = new BattleScreen(app, this.soundProvider);
        this.battleScreen.visible = false;
        this.selectHeroScreen = new SelectHeroScreen(app); 
        app.stage.addChild(this.selectHeroScreen, this.battleScreen);

        this.heroes = resources.map(heroResource => new Hero(heroResource, this));

        this.soundProvider.mainMenu.play();
        app.ticker.add(() => this.gameloop());
    };

    async gameloop() {
        if (
            !this.selectHeroScreen.visible
            && !this.battleScreen.visible
            && !this.selectHeroScreen.isCompleted
            && !this.battleScreen.isCompleted
        ) {
            this.selectHeroScreen.init(this.app, this.heroes, this.soundProvider);
        };
        if (
            !this.selectHeroScreen.visible
            && this.selectHeroScreen.isCompleted
            && !this.battleScreen.visible
            && !this.battleScreen.isCompleted
        ) {
            this.battleScreen.visible = true;
            this.battleScreen.readyForBattle(this.heroes);
        }
        if (
            !this.selectHeroScreen.visible 
            && !this.battleScreen.visible 
            && this.selectHeroScreen.isCompleted 
            && this.battleScreen.isCompleted) {
            this.newGame();
        }
    };
    readyForBattle() {
        this.heroes = this.heroes.filter(hero => hero.heroType !== HeroType.Player);
        this.selectOpponent();
        this.selectHeroScreen.visible = false;
        this.battleScreen.visible = true;
        this.battle()
    };

    newGame() {
        this.battleScreen.winnerText = " ";
        this.soundProvider.mainMenu.play();
        Hero.appearancePosition = { x: 0, y: 60 };
        this.selectHeroScreen.isCompleted = false;
        this.battleScreen.isCompleted = false;
        this.heroes = this.resources.map(heroResource => new Hero(heroResource, this));
    };

};