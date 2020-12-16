export class AssetsHandler {
     constructor(app, heroesData) {
        heroesData.forEach((hero) => {
            app.loader
                .add(`${hero.name}_front_default`, hero.sprites.front_default)
                .add(`${hero.name}_back_default`, hero.sprites.back_default)
        });
        app.loader.add('battleBackground', '../assets/Battle_background.jpg');
        app.loader.add('MainMenuBackground', '../assets/Main_menu.jpg');
        app.loader.onProgress.add(this.showProgress);
        app.loader.onError.add(this.reportError);
        app.loader.load();
        app.stage.interactive = true;
    };

    showProgress(e) {
        console.log(e.progress);
    };
    reportError(e) {
        console.log('ERROR : ' + e.message);
    };
};