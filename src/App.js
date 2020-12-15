import { BlurFilter } from '@pixi/filter-blur';
import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Sprite } from '@pixi/sprite';
import * as PIXI from 'pixi.js';
import { Hero } from './Hero/Hero';

export class App {
    constructor(app, resources) {
        document.body.appendChild(app.view);
       console.log('App created');
    //    new Hero();
    };
    
};