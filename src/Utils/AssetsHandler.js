export class AssetsHandler {
    //  static heroesData;
     static async loadAssets(app, heroesData) {
        // AssetsHandler.heroesData = heroesData;
        await heroesData.forEach((hero) => {
            app.loader
                .add(`${hero.name}_front_default`, hero.sprites.front_default)
                .add(`${hero.name}_back_default`, hero.sprites.back_default)
        });

        app.loader.onProgress.add(this.showProgress);
        // app.loader.onComplete.add(() => new App(app, resources));
        app.loader.onError.add(this.reportError);
        await app.loader.load();
        app.stage.interactive = true;
    };

    //  static doneLoading() {
    //     new App();
    // };

     static showProgress(e) {
        console.log(e.progress);
    };
     static reportError(e) {
        console.log('ERROR : ' + e.message);
    };
};