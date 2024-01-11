import Mainscene from "./scene.js"
//import  Playscene from "./play.js";

//import Main2 from "./main2.js";

const config ={
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
	scale: {
		mode: Phaser.Scale.RESIZE,
		autoCenter: Phaser.Scale.CENTER
	},
    physics: {
        default: "arcade",
      },
    backgroundColor:0x1B1B1D,
    scene: [Mainscene]

  
}



var game = new Phaser.Game(config)
