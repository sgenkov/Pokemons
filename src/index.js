import * as PIXI from 'pixi.js';
import { ResourcesProvider } from "./Utils/ResourcesProvider";
import { App } from './App';
import { AssetsHandler } from './Utils/AssetsHandler';

const app = new PIXI.Application({
    width: window.innerWidth - 15,
    height: window.innerHeight - 25,
    backgroundColor: 0xAAFFFF,
});

let resources;
(async () => {
    resources = await ResourcesProvider.fetchUnits();
    // console.log('res type: ', typeof resources);
    // console.log('resources', resources);
    // console.log('app', app);
    new AssetsHandler(app, resources);
    app.loader.onComplete.add(() => new App(app, resources));
})();




