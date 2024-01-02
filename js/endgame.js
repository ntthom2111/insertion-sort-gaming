export default class CongratulationsScene extends Phaser.Scene {
    constructor() {
      super("CongratulationsScene");
      // Define congratsOverlay as a class property
      this.congratsOverlay = null;
    }
  
    preload() {
      // Load your background image
      this.load.image("CongratulationsBG", "../assets/g7.png");
    }
  
    create() {
        // Add background image
        const bg = this.add.image(0, 0, "CongratulationsBG");
        bg.setOrigin(0, 0); // Set the origin to the top-left corner
    
        // Create a group for the congrats overlay
        this.congratsOverlay = this.add.group();
    
        // Access total time from scene settings
        const totalTime = this.scene.settings.data.totalTime;
    
        // Add your congratulatory message or any other content for the new scene
        const congratulationsText = this.add.text(
          this.sys.game.config.width / 2,
          this.sys.game.config.height / 2 - 50,
          //'Chúc mừng bạn đã thành công giúp hoàng tử cứu được công chúa!',
         // { font: '36px Arial', fill: '#000000', fontWeight: "bold" }
        );
        congratulationsText.setOrigin(0.5);
    
        // Add a text for displaying total time
        const timeText = this.add.text(
            this.sys.game.config.width / 2 - 50,
            this.sys.game.config.height / 2 + 70 ,
            `Thời gian hoàn thành: ${totalTime} giây`,
            { font: '30px Arial', fill: '#000000' }
          );
    
        // Initially, set the congrats overlay to invisible
        this.congratsOverlay.setVisible(false);
    
        // Add a button to play again

        const replaybtn = this.add.sprite(2000/2, 1050/2, 'replay')
        replaybtn .setInteractive();
        replaybtn .on('pointerdown',()=>{
            console.log('Nhấn nút play')
            this.scene.start("Playscene");
            
        })


       
      }
    }
  