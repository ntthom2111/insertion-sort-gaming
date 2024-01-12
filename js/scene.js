export default class Mainscene extends Phaser.Scene {
  constructor() {
    super("Mainscene");
  }

  preload() {
    this.load.image('bs', '../assets/BookShelf.png');
    this.load.image('bg', '../assets/bg.png');
    this.load.image('theme', '../assets/Theme.png');
    this.load.image('play', '../assets/play.png');
    this.load.image('learn', '../assets/learn.png');
    this.load.image('info', '../assets/info.png');
    this.load.image('g1', '../assets/g1.png');
    this.load.image('g2', '../assets/g2.png');
    this.load.image('g3', '../assets/g3.png');
    this.load.image('g4', '../assets/g4.png');
    this.load.image('g5', '../assets/g5.png');
    this.load.image('g6', '../assets/g6.png');
    this.load.image('g9', '../assets/g9.png');
    this.load.image('next', '../assets/next.png');
    this.load.image('nextg', '../assets/nextg.png');
    this.load.audio('Click', '../assets/music/click.mp3');
    this.load.audio('game', '../assets/music/game.mp3');
  }

  create() {
    this.background = this.add.image(1468 / 2, 768 / 2, 'bg');
    this.sound.play('game', { volume: 0.1 });

    this.playbtn = this.add.sprite(2400 / 2, 1100 / 2, 'play').setInteractive();
    this.sound.play('Click', { volume: 3.5 });
    this.playbtn.on('pointerdown', () => {
      console.log('Nhấn nút play');
      const g1 = this.add.image(1468 / 2, 768 / 2, 'g1');

      this.nextg = this.add.sprite(2600 / 2, 960 / 2, 'nextg').setScale(0.7).setInteractive();
      this.sound.play('Click', { volume: 3.5 });
      this.nextg.on('pointerdown', () => {
        console.log('Nhấn nút play');
        window.location.href = "/js/play.html";
      });

      this.next = this.add.sprite(2630 / 2, 1350 / 2, 'next').setInteractive();
      this.sound.play('Click', { volume: 3.5 });
      this.next.on('pointerdown', () => {
        console.log('Nhấn nút play');
        const g2 = this.add.image(1468 / 2, 768 / 2, 'g2');

        this.nextg = this.add.sprite(2600 / 2, 960 / 2, 'nextg').setScale(0.7).setInteractive();
        this.sound.play('Click', { volume: 3.5 });
        this.nextg.on('pointerdown', () => {
          console.log('Nhấn nút play');
          window.location.href = "/js/play.html";
        });

        this.next = this.add.sprite(2630 / 2, 1350 / 2, 'next').setInteractive();
        this.sound.play('Click', { volume: 3.5 });
        this.next.on('pointerdown', () => {
          console.log('Nhấn nút play');
          const g3 = this.add.image(1468 / 2, 768 / 2, 'g3');

          this.nextg = this.add.sprite(2600 / 2, 960 / 2, 'nextg').setScale(0.7).setInteractive();
          this.sound.play('Click', { volume: 3.5 });
          this.nextg.on('pointerdown', () => {
            console.log('Nhấn nút play');
            window.location.href = "/js/play.html";
          });

          this.next = this.add.sprite(2630 / 2, 1350 / 2, 'next').setInteractive();
          this.sound.play('Click', { volume: 3.5 });
          this.next.on('pointerdown', () => {
            console.log('Nhấn nút play');
            const g4 = this.add.image(1468 / 2, 768 / 2, 'g4');

            this.nextg = this.add.sprite(2600 / 2, 1150 / 2, 'nextg').setScale(0.7).setInteractive();
            this.sound.play('Click', { volume: 3.5 });
            this.nextg.on('pointerdown', () => {
              console.log('Nhấn nút play');
              window.location.href = "/js/play.html";
            });

            this.next = this.add.sprite(2630 / 2, 1400 / 2, 'next').setInteractive();
            this.sound.play('Click', { volume: 3.5 });
            this.next.on('pointerdown', () => {
              console.log('Nhấn nút play');
              const g5 = this.add.image(1468 / 2, 768 / 2, 'g5');

              this.nextg = this.add.sprite(2600 / 2, 960 / 2, 'nextg').setScale(0.7).setInteractive();
              this.sound.play('Click', { volume: 3.5 });
              this.nextg.on('pointerdown', () => {
                console.log('Nhấn nút play');
                window.location.href = "/js/play.html";
              });

              this.next = this.add.sprite(2630 / 2, 1350 / 2, 'next').setInteractive();
              this.sound.play('Click', { volume: 3.5 });
              this.next.on('pointerdown', () => {
                console.log('Nhấn nút play');
                const g6 = this.add.image(1468 / 2, 768 / 2, 'g6');

                this.nextg = this.add.sprite(2600 / 2, 960 / 2, 'nextg').setScale(0.7).setInteractive();
                this.sound.play('Click', { volume: 3.5 });
                this.nextg.on('pointerdown', () => {
                  console.log('Nhấn nút play');
                  window.location.href = "/js/play.html";
                });

                this.nextg = this.add.sprite(2630 / 2, 1350 / 2, 'next').setInteractive();
                this.sound.play('Click', { volume: 3.5 });
                this.nextg.on('pointerdown', () => {
                  console.log('Nhấn nút play');
                  const g9 = this.add.image(1468 / 2, 768 / 2, 'g9');

                  this.nextg = this.add.sprite(2400 / 2, 1350 / 2, 'nextg').setScale(0.7).setInteractive();
                  this.sound.play('Click', { volume: 3.5 });
                  this.nextg.on('pointerdown', () => {
                    console.log('Nhấn nút play');
                    window.location.href = "/js/play.html";
                  });
                });
              });
            });
          });
        });
      });
    });

    this.infobtn = this.add.sprite(600 / 2, 1100 / 2, 'info').setInteractive();
    this.sound.play('Click', { volume: 3.5 });
    this.infobtn.on('pointerdown', () => {
      console.log('Nhấn nút play');
      window.location.href = "/js/info.html";
    });

    this.learnbtn = this.add.sprite(1500 / 2, 1100 / 2, 'learn').setInteractive();
    this.sound.play('Click', { volume: 3.5 });
    this.learnbtn.on('pointerdown', () => {
      console.log('Nhấn nút play');
      window.location.href = "/js/learn.html";
    });

    // Đăng ký sự kiện thay đổi kích thước cửa sổ trình duyệt
    this.scale.on('resize', this.resizeGame, this);

    // Gọi hàm resizeGame để cài đặt kích thước ban đầu
    this.resizeGame();
  }

  resizeGame() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.background.setSize(width, height);

    this.playbtn.setPosition(width / 2, height / 2);
    // Các dòng sau đây có thể cập nhật kích thước và vị trí của các phần tử khác tương tự
    // this.infobtn.setPosition(newX, newY);
    // this.learnbtn.setPosition(newX, newY);

    this.scale.resize(width, height);
  }
}
