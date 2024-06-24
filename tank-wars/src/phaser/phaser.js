import Phaser from "phaser";

class TankWarsScene extends Phaser.Scene {
  constructor(gameParams) {
    super({ key: "MainScene" });
    this.player1 = null;
    this.player2 = null;
    this.player1_id = gameParams.player1_id;
    this.player2_id = gameParams.player2_id;
    this.path = gameParams.path;
    this.gameName = gameParams.gameName;
  }

  preload() {
    // Load assets here if necessary
  }

  create() {
    // Create game objects here
    this.add.text(100, 100, `Partida: ${this.gameName}`, { fill: "#0f0" });

    this.matter.world.setBounds(
      0,
      0,
      this.sys.game.config.width,
      this.sys.game.config.height
    );

    this.path = this.generatePath();
    this.verts = this.matter.verts.fromPath(this.path);

    this.terrainGraphics = this.add.graphics();
    this.drawTerrain(this.path);

    this.terrainCollider = this.matter.add.fromVertices(
      0,
      0,
      this.verts,
      { isStatic: true },
      true,
      0.01,
      10
    );
    this.matter.alignBody(
      this.terrainCollider,
      this.sys.game.config.width / 2,
      this.sys.game.config.height,
      Phaser.Display.Align.BOTTOM_CENTER
    );

    this.player1 = this.matter.add.image(100, 100, null);
    this.player1.setBounce(0.2);
    this.player1.setFrictionAir(0.0002);
    this.player1.setRectangle(10);
    this.player1.setFriction(1);

    this.player2 = this.matter.add.image(700, 100, null);
    this.player2.setBounce(0.2);
    this.player2.setFrictionAir(0.0002);
    this.player2.setRectangle(10);
    this.player2.setFriction(1);
  }

  generatePath() {
    const maxY = this.sys.game.config.height;
    const maxX = this.sys.game.config.width;

    let path = `0 ${maxY} ` + this.path + ` ${maxX} ${maxY}`;

    console.log(path);

    return path.trim();
  }

  drawTerrain(path) {
    this.terrainGraphics.clear();

    const points = path.split(" ").map((point) => parseFloat(point));
    this.terrainGraphics.fillStyle(0x00ff00);
    this.terrainGraphics.beginPath();

    for (let i = 0; i < points.length; i += 2) {
      if (i === 0) {
        this.terrainGraphics.moveTo(points[i], points[i + 1]);
      } else {
        this.terrainGraphics.lineTo(points[i], points[i + 1]);
      }
    }

    this.terrainGraphics.closePath();
    this.terrainGraphics.fillPath();
  }

  update() {
    // Game logic goes here
  }
}

export default TankWarsScene;
