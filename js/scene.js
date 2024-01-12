export default class Mainscene extends Phaser.Scene{
    
  constructor(){
      super("Mainscene")
  }
  preload(){
      this.load.image('bs' ,'../assets/BookShelf.png');
      this.load.image('bg' ,'../assets/bg.png');
      this.load.image('theme' ,'../assets/Theme.png');
      this.load.image('play' ,'../assets/play.png');
      this.load.image('learn' ,'../assets/learn.png');
      this.load.image('info' ,'../assets/info.png');
      this.load.image('g1' ,'../assets/g1.png');
      this.load.image('g2' ,'../assets/g2.png');
      this.load.image('g3' ,'../assets/g3.png');
      this.load.image('g4' ,'../assets/g4.png');
      this.load.image('g5' ,'../assets/g5.png');
      this.load.image('g6' ,'../assets/g6.png');
      this.load.image('g9' ,'../assets/g9.png');
      this.load.image('next' ,'../assets/next.png');
      this.load.image('nextg' ,'../assets/nextg.png');
      this.load.audio('Click', '../assets/music/click.mp3');
      this.load.audio('game', '../assets/music/game.mp3');
  }
  create(){
     const Theme = this.add.image(1518/2, 668/2, 'theme')
     Theme.setScale(0.6)
     this.sound.play('game', { volume:  0.1
      
     });

      const playbtn = this.add.sprite(2400/2, 1100/2, 'play')
      playbtn.setInteractive();
      this.sound.play('Click', { volume:   3.5 });
      playbtn.on('pointerdown',()=>{
          console.log('Nhấn nút play')
         const g1  = this.add.image(1518/2, 668/2, 'g1')
		 g1.setScale(1)
         {
          const nextg = this.add.sprite(2650/2, 860/2, 'nextg')
          nextg.setScale(0.7);
          nextg.setInteractive();
          this.sound.play('Click', { volume:  3.5  });
          nextg  .on('pointerdown',()=>{
           console.log('Nhấn nút play')
           window.location.href = "/js/play.html";
           // this.scene.start("Playscene");
          })
          {
            const next = this.add.sprite(2680/2, 1250/2, 'next')
            
            next  .setInteractive();
            this.sound.play('Click', { volume: 3.5  });
            next  .on('pointerdown',()=>{
          console.log('Nhấn nút play')
          const g2  = this.add.image(1468/2, 768/2, 'g2')
          {
            const nextg = this.add.sprite(2600/2, 960/2, 'nextg')
          nextg.setScale(0.7);
          nextg.setInteractive();
          this.sound.play('Click', { volume:  3.5  });
          nextg  .on('pointerdown',()=>{
           console.log('Nhấn nút play')
           window.location.href = "/js/play.html";
            //this.scene.start("Playscene");
          })
          {
            const next = this.add.sprite(2630/2, 1350/2, 'next')
            
            next  .setInteractive();
            this.sound.play('Click', { volume: 3.5  });
            next  .on('pointerdown',()=>{
          console.log('Nhấn nút play')
          const g3  = this.add.image(1468/2, 768/2, 'g3')
          {
            const nextg = this.add.sprite(2600/2, 960/2, 'nextg')
          nextg.setScale(0.7);
          nextg.setInteractive();
          this.sound.play('Click', { volume:  3.5  });
          nextg  .on('pointerdown',()=>{
           console.log('Nhấn nút play')
           window.location.href = "/js/play.html";
            //this.scene.start("Playscene");
          })
          {
            const next = this.add.sprite(2630/2, 1350/2, 'next')
            
            next  .setInteractive();
            this.sound.play('Click', { volume: 3.5  });
            next  .on('pointerdown',()=>{
          console.log('Nhấn nút play')
          const g4  = this.add.image(1468/2, 768/2, 'g4')
          {
            {
              const nextg = this.add.sprite(2600/2, 1150/2, 'nextg')
            nextg.setScale(0.7);
            nextg.setInteractive();
            this.sound.play('Click', { volume:  3.5  });
            nextg  .on('pointerdown',()=>{
             console.log('Nhấn nút play')
             window.location.href = "/js/play.html";
              //this.scene.start("Playscene");
            })
            {
              const next = this.add.sprite(2630/2, 1400/2, 'next')
              
              next  .setInteractive();
              this.sound.play('Click', { volume: 3.5  });
              next  .on('pointerdown',()=>{
            console.log('Nhấn nút play')
            const g5  = this.add.image(1468/2, 768/2, 'g5')
            {
              
                const nextg = this.add.sprite(2600/2, 960/2, 'nextg')
              nextg.setScale(0.7);
              nextg.setInteractive();
              this.sound.play('Click', { volume:  3.5  });
              nextg  .on('pointerdown',()=>{
               console.log('Nhấn nút play')
               window.location.href = "/js/play.html";
                //this.scene.start("Playscene");
              })
              {
                const next = this.add.sprite(2630/2, 1350/2, 'next')
                
                next  .setInteractive();
                this.sound.play('Click', { volume: 3.5  });
                next  .on('pointerdown',()=>{
              console.log('Nhấn nút play')
              const g6  = this.add.image(1468/2, 768/2, 'g6')
              {
                {
                  const nextg = this.add.sprite(2600/2, 960/2, 'nextg')
                nextg.setScale(0.7);
                nextg.setInteractive();
                this.sound.play('Click', { volume:  3.5  });
                nextg  .on('pointerdown',()=>{
                 console.log('Nhấn nút play')
                 window.location.href = "/js/play.html";
                  //this.scene.start("Playscene");
                })
                {
                  const nextg = this.add.sprite(2630/2, 1350/2, 'next')
               
                nextg.setInteractive();
                this.sound.play('Click', { volume:  3.5  });
                nextg  .on('pointerdown',()=>{
                 console.log('Nhấn nút play')
                 const g9  = this.add.image(1468/2, 768/2, 'g9')
                  //this.scene.start("Playscene");
                  {
                      const nextg = this.add.sprite(2400/2, 1350/2, 'nextg')
              nextg.setScale(0.7);
              nextg.setInteractive();
              this.sound.play('Click', { volume:  3.5  });
              nextg  .on('pointerdown',()=>{
               console.log('Nhấn nút play')
               window.location.href = "/js/play.html";
                //this.scene.start("Playscene");
              
                  })
                  }
                })
              }
              }
              }})
          
            }
          }
          })
          }
          }
          }
        })
      }
        }
          
        })
       
          }

          }
            })

          }
          
          
          

           
          
         
      
          //this.scene.start("Playscene");
      
         }
      })
    


      const infobtn = this.add.sprite(600/2, 1100/2, 'info')
      infobtn .setInteractive();
      this.sound.play('Click', { volume:  3.5 });
      infobtn .on('pointerdown',()=>{
          console.log('Nhấn nút play')
          window.location.href = "/js/info.html";
          
      })
      

   
      

      const learnbtn = this.add.sprite(1500/2, 1100/2, 'learn')
      learnbtn .setInteractive();
      this.sound.play('Click', { volume: 3.5  });
      learnbtn .on('pointerdown',()=>{
          console.log('Nhấn nút play')
          
          window.location.href = "/js/learn.html";
          
      })



   
  }

    };
  

