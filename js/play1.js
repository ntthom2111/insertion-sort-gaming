export default class Playscene extends Phaser.Scene {
  constructor() {
    super("Playscene");
    this.timer = 0; // Khởi tạo thời gian
    this.minutes = 0;
    this.timerText = null; // Lưu trữ đối tượng văn bản thời gian
    this.completedTime = null;
    this.previousPlayedTimeInSeconds = 0;
    this.previousPlayedTimeInMinutes = 0;
    this.orderText = null;
    this.shuffledOrder = [];
        this.currentBookOrder = [];
    this.initialBookOrder = [];
    this.finalBookOrder = [];
    this.images = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"];
  }

  preload() {
    this.load.image("bg", "../assets/bg.png");
    this.load.image("b1", "../assets/1.png");
    this.load.image("b2", "../assets/2.png");
    this.load.image("b3", "../assets/3.png");
    this.load.image("b4", "../assets/4.png");
    this.load.image("b5", "../assets/5.png");
    this.load.image("b6", "../assets/6.png");
    this.load.image("b7", "../assets/7.png");
    this.load.image("b8", "../assets/8.png");
    this.load.image("b9", "../assets/9.png");
    this.load.image("g7", "../assets/g7.png");
    this.load.image("g8", "../assets/g8.png");
    this.load.image("main", "../assets/main.png");
    this.load.image("replay", "../assets/replay.png");
    this.load.image("mix", "../assets/mix.png");
    this.load.audio('Click', '../music/click.mp3');
    this.load.audio('drag', '../music/drag.mp3');
    this.load.audio('cm', '../music/cm.mp3');
    this.load.audio('over', '../music/gameover.mp3');
    this.load.audio('game', '../music/game.mp3');

    this.load.image("check", "../assets/check.png");
  }

  create() {
    const BS = this.add.image(1468 / 2, 768 / 2, "bg");
    const mainbtn = this.add.sprite(2760 / 2, 90 / 2, "main");
    mainbtn.setInteractive();
    this.sound.play('Click', { volume:  1.5 });
    mainbtn.on("pointerdown", () => {
      console.log("Nhấn nút play");
      window.location.href = "index.html";
    });

    const table = this.add.container();
    table.setPosition(100, 460);

    const images = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"];

    const rows = 1;
    const columns = 9;
    const cellWidth = 140;
    const cellHeight = 400;

    let imageIndex = 0;
    Phaser.Utils.Array.Shuffle(this.images);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const cell = this.add.image(
          x * cellWidth,
          y * cellHeight,
          this.images[imageIndex]
        );
        cell.setSize(cellWidth, cellHeight);
        table.add(cell);

        // Update the order property for each image
        cell.order = imageIndex + 1;

        imageIndex++;
      }
    }

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const cell = this.add.image(
          x * cellWidth,
          y * cellHeight,
          images[imageIndex]
        );
        cell.setSize(cellWidth, cellHeight);
        table.add(cell);
        imageIndex++;
      }
    }

    table.iterate((cell) => {
      cell.setInteractive({ draggable: true });
     
      cell.on("dragstart", (pointer, dragX, dragY) =>
        this.onDragStart(pointer, dragX, dragY, cell)
        
      );
      
      cell.on("drag", (pointer, dragX, dragY) =>
        this.onDrag(pointer, dragX, dragY, cell)
        
      );
      cell.on("dragend", (pointer) => this.onDragEnd(pointer, cell));
      
    });

    // Thêm nút "Kiểm tra"
    const checkButton = this.add.image(1300, 700, "check");
    checkButton.setInteractive();
    this.sound.play('Click', { volume:  1.5 });
    checkButton.on(
      "pointerup",
      () => {
       // this.updateOrder(); // Cập nhật thứ tự trước khi kiểm tra
        this.checkOrder();
        this.initializeTimer(); // Gọi hàm để reset thời gian
      },
      this
    );

    // Thêm nút "Trộn"
    const mixButton = this.add.image(1100, 700, "mix");
    mixButton.setInteractive();
    this.sound.play('Click', { volume:  1.5 });
    mixButton.on("pointerdown", () => {
      this.scene.start("Playscene");
    });

    this.congratulationImage = this.add.image(400, 300, "g7"); // Thay đổi tên ảnh nếu cần
    this.congratulationImage.setVisible(false); // Ẩn hình ảnh ban đầu

    this.gameoverImage = this.add.image(1468 / 2, 768 / 2, "g8"); // Thay đổi tên ảnh nếu cần
    this.gameoverImage.setVisible(false); // Ẩn hình ảnh ban đầu

    // Thêm text thông báo
    this.resultText = this.add.text(130, 200, "", {
      fontSize: "50px",
      fill: "#000000",
    });

    this.timerText = this.add.text(10, 10, "Time: 0", {
      fontSize: "50px",
      fill: "#fff",
    });
    this.startTime = Date.now(); // Lưu trữ thời gian bắt đầu

    // Bắt đầu bộ đếm thời gian
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.updateTimer(); // Sửa lại bằng cách gọi this.updateTimer()
      },
      loop: true,
    });
  }

  updateTimer() {
    this.timer++;

    if (this.timer === 60) {
      this.timer = 0;
      this.minutes++;
    }

    this.playedTimeInSeconds = this.minutes * 60 + this.timer; // Cập nhật thời gian đã chơi

    // Cập nhật thời gian trước khi reset

    this.updateTimerText(); // Cập nhật văn bản thời gian
    const minutesString = this.minutes.toString().padStart(2, "0");
    const secondsString = this.timer.toString().padStart(2, "0");
    this.timerText.setText(`${minutesString}:${secondsString}`);

    this.previousPlayedTimeInSeconds = secondsString;
    this.previousPlayedTimeInMinutes = minutesString;
  }

  onDragStart(pointer, dragX, dragY, gameObject) {
    
    if (gameObject instanceof Phaser.GameObjects.Image) {
      gameObject.setTint(0xff0000);
      this.children.bringToTop(gameObject);
    }
  }

  onDrag(pointer, dragX, dragY, gameObject) {
    
    if (gameObject instanceof Phaser.GameObjects.Image) {
      gameObject.x = dragX;
      gameObject.y = dragY;
    }
  }

  onDragEnd(pointer, gameObject) {
    this.sound.play('drag', { volume:  1.5 });
    
    if (gameObject instanceof Phaser.GameObjects.Image) {
      gameObject.clearTint();
     // this.updateOrder();
    }
  }



  updateTimerText() {
    const minutesString = this.previousPlayedTimeInMinutes
      .toString()
      .padStart(2, "0");
    const secondsString = this.previousPlayedTimeInSeconds
      .toString()
      .padStart(2, "0");
    this.timerText.setText(
      `Thời gian đã chơi: ${minutesString}:${secondsString}`
    );
  }

  initializeTimer() {
    this.timer = 0;
    this.minutes = 0;
    this.updateTimerText(); // Cập nhật văn bản thời gian
    this.previousPlayedTimeInMinutes = this.minutes;
    this.previousPlayedTimeInSeconds = this.playedTimeInSeconds; // Lưu thời gian trước khi reset
    this.startTime = Date.now();
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

    const tableChildren = this.children.list.filter(
      (child) => child instanceof Phaser.GameObjects.Image
    );

    const currentOrder = correctOrder.map((item) => {
      const textureKey = item.textureKey;
      return this.shuffledOrder.indexOf(textureKey) + 1;
    });

    // Kiểm tra nếu không có -1 trong currentOrder và so sánh thứ tự
    const isValidOrder =
      !currentOrder.includes(-1) &&
      currentOrder.every((order, index) => order === index + 1);

    // Hiển thị kết quả dựa trên trạng thái sắp xếp
    if (isValidOrder) {
      this.congratulationImage.setVisible(true);
      this.gameoverImage.setVisible(false);
      this.resultText
        .setText("Chúc mừng! Bạn đã hoàn thành đúng!")
        .setStyle({ fill: "#000000" });

      this.sound.play('cm', { volume:  1.5 });
      this.sound.play('game', { volume:  0 });
    } else {
      this.gameoverImage.setVisible(true);
      this.congratulationImage.setVisible(false);
      this.resultText
        //.setText("Hình ảnh chưa sắp xếp đúng thứ tự.")
        .setStyle({ fill: "#000000" });

      // Lưu thứ tự cuối cùng sau khi di chuyển
      this.finalBookOrder = this.currentBookOrder.slice();

      // Hiển thị thông báo với thứ tự đúng, thứ tự của người chơi và thứ tự cuối cùng
      const correctOrderText = correctOrder
        .map((item) => item.textureKey)
        .join(", ");
      const playerOrderText = this.initialBookOrder.join(", ");
      const finalOrderText = this.finalBookOrder.join(", ");

      this.resultText
        .setText(
          `Thứ tự đúng: ${correctOrderText}\nThứ tự của bạn: ${playerOrderText}\nThứ tự cuối cùng: ${finalOrderText}`
        )
        .setStyle({ fill: "#000000" });
      this.sound.play('over', { volume:  2.5 });
      this.sound.play('game', { volume:  0 });
    }

    const mainbtn = this.add.sprite(2760 / 2, 90 / 2, "main");
    mainbtn.setInteractive();
    this.sound.play('Click', { volume:  1.5 });
    mainbtn.on("pointerdown", () => {
      console.log("Nhấn nút play");
      window.location.href = "index.html";
    });

    const replaybtn = this.add.sprite(1500 / 2, 1250 / 2, "replay");
    replaybtn.setInteractive();
    this.sound.play('Click', { volume:  1.5 });
    replaybtn.on("pointerdown", () => {
      console.log("Nhấn nút play");
      this.scene.start("Playscene");
    });

    // Dừng bộ đếm thời gian
    this.timerText.setText(`Time: ${this.minutes}:${this.timer}`);
    this.time.removeAllEvents();
  }
}