Bước 1: Đánh dấu phần tử đầu tiên là đã sắp xếp
    Bước 2: Trích phần tử đầu tiên chưa được sắp xếp
     Bước 3: Từ j =SoSapXepCuoi xuống 0
     Bước 4: Nếu phần tử hiện tại j >= X 
                Di chuyển phần tử hiện tại đã sắp xếp sang phải 1
                
     Bước 5: Ngắt vòng lặp và chèn X vào đây




     export default class Playscene extends Phaser.Scene {
        constructor() {
          super("Playscene");
        }
      
        preload() {
          this.load.image("book", "../assets/3.png");
          this.load.image("book1", "../assets/1.png");
          this.load.image("book2", "../assets/2.png");
          this.load.image("Gameover", "../assets/gameover.jpg");
          
        }
      
        create() {
          this.bubbles = this.physics.add.group(); // Create a new Group
    
          //this.add.image(200/2, 500/2,  'book')
         // this.add.image(200/2, 500/2,  'book1')
         // this.add.image(200/2, 500/2,  'book2')
      
          const numBubbles = 6;
          const bubbleGap = 50;
      
          // Function to generate unique natural numbers
          function generateUniqueNaturalNumbers(size) {
            const uniqueNumbers = new Set();
          
            for (let i = 0; i < size; i++) {
              uniqueNumbers.add(Math.floor(Math.random() * 600) + 1);
            }
          
            return Array.from(uniqueNumbers);
          }
      
          // Generate unique numbers
          const uniqueNumbers = generateUniqueNaturalNumbers(numBubbles);
      
          for (let i = 0; i < numBubbles; i++) {
            const x =
              (this.sys.game.config.width / 2) -
              (bubbleGap * (numBubbles - 1) / 2) +
              (i * bubbleGap);
            const y = this.sys.game.config.height / 2;
      
            const bubble = this.physics.add.sprite(x, y, "book","book1","book2");
      
            // Set unique number for each bubble
            bubble.numbers = uniqueNumbers[i];
      
            // Create a text object to display the number
            const text = this.add.text(bubble.x, bubble.y, bubble.numbers, {
              font: "30px Arial",
              fill: "#ffffff",
              align: "center",
            });
      
            // Set the text as a child of the bubble
            bubble.text = text;
      
            bubble.setInteractive();
            this.input.setDraggable(bubble);
      
            this.bubbles.add(bubble);
          }
      
          this.gameOverImage = this.add.image(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2,
            "Gameover"
          );
          this.gameOverImage.setVisible(false);
      
          this.input.on("dragstart", function (pointer, gameObject) {
            gameObject.setTint(0xff0000);
          });
      
          this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
      
            // Update the text position as the bubble moves
            gameObject.text.setPosition(gameObject.x, gameObject.y);
          });
      
          this.input.on("dragend", function (pointer, gameObject) {
            gameObject.clearTint();
          });
        }
        
      }
     
      
      




      
  export default class Playscene extends Phaser.Scene {
    constructor() {
      super("Playscene");
    }
  
     preload() {
    this.load.image("bg", "../assets/bg.png");
// this.load.image("Gameover", "../assets/gameover.jpg");
      this.load.image("1", "../assets/1.png");
      this.load.image("2", "../assets/2.png");
      this.load.image("3", "../assets/3.png");
      this.load.image("4", "../assets/4.png");
      this.load.image("5", "../assets/5.png");
      this.load.image("6", "../assets/6.png");
      this.load.image("7", "../assets/7.png");
      this.load.image("8", "../assets/8.png");
      this.load.image("9", "../assets/9.png");
      this.load.image("10", "../assets/10.png");
  }
  
    create() {
      this.load.once('complete', () => {
      // Tạo sprite background
      this.add.image(0, 0, "bg").setOrigin(0, 0);
       } )
  
      // Tạo các phần tử img và logic kéo thả
      const columns = 9;
      const row = 1;
  
      const imgOrder = ["1", "4", "5", "2", "3", "7", "6", "10", "14"];

      for (let r = 0; r < row; r++) {
          for (let c = 0; c < columns; c++) {
              const tile = this.add.image(c * tileSize, r * tileSize, imgOrder.shift()).setInteractive();
              tile.setOrigin(0); // Set origin for accurate positioning

              tile.on("dragstart", this.dragStart, this);
              tile.on("dragend", this.dragEnd, this);
              tile.on("drop", this.drop, this);
        }
      }
  
      // Khởi tạo biến
      let currTile;
      let otherTile;
  
    }
  
    dragStart(pointer, tile) {
      currTile = tile;
    }
  
    dragEnd(pointer, tile) {
      if (currTile === tile) {
        return;
      }
  
      // Hoán đổi vị trí hình ảnh
      const tempImg = currTile.texture.key;
      currTile.setTexture(tile.texture.key);
      tile.setTexture(tempImg);
    }
  
    drop(pointer, tile) {
      if (currTile === tile) {
        return;
      }
  
      // Hoán đổi vị trí hình ảnh
      const tempImg = currTile.texture.key;
      currTile.setTexture(tile.texture.key);
      tile.setTexture(tempImg);
    }
  
    // ...
  }



  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game</title>

     <script src="//cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.js"></script>
    <script src="//cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js"></script>
    <script type="module" src="js/play.js"></script>

    
    <link rel="stylesheet" href="js/play.css">
    <link rel="shortcut icon" href="assets/logo.png" type="image/x-icon">


    
</head>
<body>
   
   <div id="board"></div>
   <h1>Turns: <span id="turns"></span></h1>
   


</body>
</html>







//import "./play.css";

export default class Playscene extends Phaser.Scene {
  constructor() {
    
    super("Playscene");
  }

   preload() {
  this.load.image("bg", "../assets/bg.png");
// this.load.image("Gameover", "../assets/gameover.jpg");
    this.load.image("b1", "../assets/1.png");
    this.load.image("b2", "../assets/2.png");
    this.load.image("b3", "../assets/3.png");
    this.load.image("b4", "../assets/4.png");
    this.load.image("b5", "../assets/5.png");
    this.load.image("b6", "../assets/6.png");
    this.load.image("b7", "../assets/7.png");
    this.load.image("b8", "../assets/8.png");
    this.load.image("b9", "../assets/9.png");
    this.load.image("b10", "../assets/10.png");

    this.load.image("button" ,'../assets/play.png');

}

create() {
  const BS = this.add.image(1468 / 2, 768 / 2, 'bg');

  /*const images = []; 
  const imageKeys = ["b9", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b1"];

  for (let i = 0; i < imageKeys.length; i++) {
    const image = this.add.image(1 + i * (-50.0), 150, imageKeys[i]);
    images.push(image);
    image.setInteractive();
    this.input.on('pointerdown', this.starDrag,this);
    
  }
*/

// Mảng chứa tên ảnh

const table = this.add.container();
table.setSize(300, 200);
table.setPosition(100, 400);

const images = ["b1", "b2", "b3", "b4",]; // Sắp xếp ảnh theo ý muốn

// Thêm ô
const rows = 1;
const columns = 4;
const cellWidth = 150;
const cellHeight = 100;

let imageIndex = 0; // Sử dụng biến index để lấy ảnh từ mảng

for (let y = 0; y < rows; y++) {
  for (let x = 0; x < columns; x++) {
    const cell = this.add.image(x * cellWidth, y * cellHeight, images[imageIndex]); // Sử dụng ảnh từ mảng
    cell.setSize(cellWidth, cellHeight);
    table.add(cell);
    cell.setInteractive();

    imageIndex++; // Chuyển sang ảnh tiếp theo
  }
  
}

}


  /*
  for (let i = 0; i < images.length; i++) {
    images[i].setOrigin(0, 0);
    images[i].x += i * images[i].width;
  }
  

  const button = this.add.image(100, 100, "button");
  button.setInteractive();

  // Thêm sự kiện click cho button
  button.on("pointerdown", () => {
    if (this.checkOrder(this.images)) {
      // Hình ảnh đã được sắp xếp đúng!
      console.log("Hình ảnh đã được sắp xếp đúng thứ tự!");
      // Hiển thị thông báo hoặc thực hiện hành động khác
    } else {
      console.log("Hình ảnh chưa được sắp xếp đúng thứ tự!");
    }
  });

}
*/

starDrag(pointer,targets)
{
  this.input.off('pointerdown', this.starDrag,this);
  this.dragObj = targets[0];
  this.input.on('pointermove', this.doDrag,this);
  this.input.on('pointerup', this.stopDrag,this);
}

doDrag(pointer)
{
  this.dragObj.x = pointer.x;
  this.dragObj.y = pointer.y;
}

stopDrag()
{
  this.input.on('pointerdown', this.starDrag,this);
 
  this.input.off('pointermove', this.doDrag,this);
  this.input.off('pointerup', this.stopDrag,this);

}




updatae()
{
  
}
}


checkOrder() {
    const correctOrder = [
      { textureKey: "b1", order: 1 },
      { textureKey: "b2", order: 2 },
      { textureKey: "b3", order: 3 },
      { textureKey: "b4", order: 4 },
      { textureKey: "b5", order: 5 },
      { textureKey: "b6", order: 6 },
      { textureKey: "b7", order: 7 },
      { textureKey: "b8", order: 8 },
      { textureKey: "b9", order: 9 },
    ];

    const tableChildren = this.children.list.filter(child => child instanceof Phaser.GameObjects.Image);

    // Lấy thứ tự của mỗi hình ảnh
    const currentOrder = tableChildren.map(child => {
      const textureKey = child.texture.key;
      const foundIndex = correctOrder.findIndex(item => item.textureKey === textureKey);
      return foundIndex !== -1 ? correctOrder[foundIndex].order : -1;
    });

    // So sánh thứ tự
    let isSorted = true;
    for (let i = 0; i < currentOrder.length; i++) {
      if (currentOrder[i] !== i + 1) {
        isSorted = false;
        break;
      }
    }

    // Hiển thị kết quả dựa trên trạng thái sắp xếp
    if (isSorted) {
      this.congratulationImage.setVisible(true);
      this.gameoverImage.setVisible(false); // Ẩn hình ảnh gameover nếu đã đúng
      this.resultText.setText('Chúc mừng! Bạn đã hoàn thành đúng!').setStyle({ fill: '#000000' });
    } else {
      this.gameoverImage.setVisible(true);
      this.congratulationImage.setVisible(false); // Ẩn hình ảnh chúc mừng nếu chưa đúng
      this.resultText.setText('Hình ảnh chưa sắp xếp đúng thứ tự.').setStyle({ fill: '#000000' });
    }

    // Dừng bộ đếm thời gian
    this.timerText.setText(`Time: ${this.minutes}:${this.timer}`);
    this.time.removeAllEvents();
}




const playbtn = this.add.sprite(600/2, 1100/2, 'play')
      playbtn.setInteractive();
      this.sound.play('Click', { volume:   3.5 });
      playbtn.on('pointerdown',()=>{
          console.log('Nhấn nút play')
         const g1  = this.add.image(1468/2, 768/2, 'g1')
         {
         

            const next = this.add.sprite(2600/2, 1350/2, 'next')
            
            next  .setInteractive();
            this.sound.play('Click', { volume: 3.5  });
            next  .on('pointerdown',()=>{
          console.log('Nhấn nút play')
          const g2  = this.add.image(1468/2, 768/2, 'g2')
          
          {
            const next = this.add.sprite(2600/2, 1350/2, 'next')
            next  .setInteractive();
            this.sound.play('Click', { volume:   3.5  });
            next  .on('pointerdown',()=>{
          console.log('Nhấn nút play')
          const g3  = this.add.image(1468/2, 768/2, 'g3')
          {
            const next = this.add.sprite(2600/2, 1350/2, 'next')
            next  .setInteractive();
            this.sound.play('Click', { volume:   3.5  });
            next  .on('pointerdown',()=>{
          console.log('Nhấn nút play')
          const g4  = this.add.image(1468/2, 768/2, 'g4')
          {
            const next = this.add.sprite(2630/2, 1400/2, 'next')
            next  .setInteractive();
            this.sound.play('Click', { volume:  3.5  });
            next  .on('pointerdown',()=>{
          console.log('Nhấn nút play')
          const g5  = this.add.image(1468/2, 768/2, 'g5')
          {
            const next = this.add.sprite(2600/2, 1350/2, 'next')
            next  .setInteractive();
            this.sound.play('Click', { volume:   3.5  });
            next  .on('pointerdown',()=>{
          console.log('Nhấn nút play')
          const g6  = this.add.image(1468/2, 768/2, 'g6')
          {
            const nextg = this.add.sprite(2620/2, 1300/2, 'nextg')
            nextg.setInteractive();
            this.sound.play('Click', { volume:  3.5  });
            nextg  .on('pointerdown',()=>{
             console.log('Nhấn nút play')
             //window.location.href = "play.html";
              this.scene.start("Playscene");
          
      })
          }
          
      })
          }
          
      })
          }
          
      })
          }
          
      })
          }
          
      })
         }
          //this.scene.start("Playscene");
      
         
      })