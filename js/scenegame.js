export default class Scencegame extends Phaser.Scene{

    constructor(){
        super("Scencegame")
    }
    preload(){

        this.load.image('bg', '../assets/bg.png');
        
    }
    create(){
    
        this.add.image(1468/2, 768/2,  'bg')
     
    }
    update(){

    }
}



