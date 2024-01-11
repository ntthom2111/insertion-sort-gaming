export default class Scencegame extends Phaser.Scene{

    constructor(){
        super("Scencegame")
    }
    preload(){

        this.load.image('bg', '../assets/bg.png');
        
    }
    create(){
		const config = {
			type: Phaser.AUTO,
			width: window.innerWidth,
			height: window.innerHeight,
			scale: {
				mode: Phaser.Scale.RESIZE,
				autoCenter: Phaser.Scale.CENTER
	},	
     screen: this
    };
    update(){

    }
}



