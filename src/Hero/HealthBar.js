import * as PIXI from 'pixi.js';
import { HeroType } from './HeroType';

export class HealthBar {
    constructor(hitPoints, currentHitPoints, ref) {
        this.ref = ref;
        this.bar = new PIXI.Graphics();
        this.hitPoints = hitPoints;
        this.currentHitPoints = currentHitPoints;
        this.createHpBar(this.currentHitPoints, this.hitPoints, 0x84F10F);
    };

    createHpBar(currentHitPoints, hitPoints, color) {
        this.bar.beginFill(color);
        let hpPortion = currentHitPoints / hitPoints;
        this.bar.drawPolygon([
            50, 80,
            50 + (400 * hpPortion), 80,
            32 + (400 * hpPortion), 150,
            32, 150,
        ]);
        this.bar.endFill();
    };

    async updateHitpoints(value) {
        this.createHpBar(this.currentHitPoints, this.hitPoints, 0x0050FF);
        this.currentHitPoints = value;
        let hpPortion = this.currentHitPoints / this.hitPoints;
        let currentColor;
        if (hpPortion < 1 && hpPortion >= 0.5) {
            currentColor = 0x84F10F;
        } else if (hpPortion < 0.5 && hpPortion >= 0.1) {
            currentColor = 0xF18A0F;
        } else {
            currentColor = 0xE40000;
        };

        this.bar.beginFill(currentColor);

        (hpPortion < 0) && (hpPortion = 0);

        this.bar.drawPolygon([
            50, 80,
            50 + (400 * hpPortion), 80,
            32 + (400 * hpPortion), 150,
            32, 150,
        ]);
        this.bar.endFill();
    };
    setType(type) {
        this.bar.position.x =
            (type === HeroType.Player)
                ? this.ref.app.view.width / 27
                : this.ref.app.view.width * 6.5 / 10;
        this.bar.position.y = this.ref.app.view.height * 8 / 10;
    };
};