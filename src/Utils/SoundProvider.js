import { Howl } from "howler";

export class SoundProvider {
    constructor() {
        this.battleSound = new Howl({
            src: ['../assets/battle.mp3'],
            volume: 0.5,
        });

        this.hitSound = new Howl({
            src: ['../assets/hit.wav'],
            volume: 1,
        });

        this.mainMenu = new Howl({
            src: ['../assets/MAINMENU.MP3'],
            volume: 0.5,
        });

        this.winBattle = new Howl({
            src: ['../assets/WinBattle.mp3'],
            volume: 0.5,
        });

        this.loseBattle = new Howl({
            src: ['../assets/LoseCombat.mp3'],
            volume: 0.5,
        });
    }

};