import Phaser from "phaser";


class TankWarsScene extends Phaser.Scene {
  constructor(gameParams) {
    super({ key: "Example" });
    // game init attributes
    this.partida_id = gameParams.partida_id;
    this.socket = gameParams.socket;
    this.local_player_id = gameParams.local_player_id;
    this.player1_id = gameParams.player1_id;
    this.player2_id = gameParams.player2_id;
    this.path = gameParams.path;
    this.gameName = gameParams.gameName;
    this.isPlayer1 = this.local_player_id === this.player1_id;
    this.isOpen = gameParams.isStoreOpen;
    this.openStore = gameParams.openStore;
    this.closeStore = gameParams.closeStore;
    // game generic attributes
    this.gameOver = false;
    this.score = 0;
    this.stage = "buy"; // "move" o "shoot"
    this.cursors = null;
    this.localPlayer = null;
    this.enemyPlayer = null;
    this.localTurret = null;
    this.enemyTurret = null;
    this.bullets = null;
    this.fireButton = null;
    this.localTurretAngle = 0;
    this.enemyTurretAngle = 0;
    this.terrainGraphics = null;
    this.terrainCollider = null;
    this.verts = null;
    this.isPlayer1Turn = true;
    this.lastFired = 0;
    this.moveGuide = null;
    this.isMoving = true;
    this.isShooting = false;
    this.localPlayerHealth = 100;
    this.enemyPlayerHealth = 100;
    this.localHealthBar = null;
    this.enemyHealthBar = null;
    this.explosionRadius = 50;
    this.maxDamage = 20;
    this.explosionDuration = 1000;
  }

  preload() {
    this.load.image("tank", "assets/tank.png");
    this.load.image("turret", "assets/turret.png");
    this.load.image("bullet", "assets/bullet.png");
  }

  create() {
    // socket config for game duration
    console.log("store open:", this.isOpen);

    this.socket.on("enemy-move", (data) => {
      console.log("enemy moved !!!!");
      this.makeEnemyMove(data);
    });

    // titulo de la partida
    this.add.text(20, 20, `Partida: ${this.gameName}`, { fill: "#0f0" });

    // definir bounds
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

    this.matter.world.on("collisionstart", (event) => {
      event.pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        const gameObjectA = bodyA.gameObject;
        const gameObjectB = bodyB.gameObject;

        if (
          (gameObjectA instanceof Bullet && gameObjectB === this.localPlayer) ||
          (gameObjectB instanceof Bullet && gameObjectA === this.localPlayer)
        ) {
          this.handleTankHit(
            this.localPlayer,
            "localPlayer",
            this.localPlayerHealth
          );
        }

        if (
          (gameObjectA instanceof Bullet && gameObjectB === this.enemyPlayer) ||
          (gameObjectB instanceof Bullet && gameObjectA === this.enemyPlayer)
        ) {
          this.handleTankHit(
            this.enemyPlayer,
            "enemyPlayer",
            this.enemyPlayerHealth
          );
        }

        if (
          (gameObjectA instanceof Bullet || gameObjectB instanceof Bullet) &&
          (bodyA.parent.id === this.terrainCollider.id ||
            bodyB.parent.id === this.terrainCollider.id)
        ) {
          const bullet =
            gameObjectA instanceof Bullet ? gameObjectA : gameObjectB;
          this.handleBulletTerrainCollision(bullet.body.position);
          //this.explosionEffect(bullet.x, bullet.y);
          bullet.destroy();
        }
      });
    });

    if (this.isPlayer1) {
      this.localPlayer = this.matter.add.image(400, 100, null);
      this.enemyPlayer = this.matter.add.image(900, 100, null);
    } else {
      this.localPlayer = this.matter.add.image(900, 100, null);
      this.enemyPlayer = this.matter.add.image(400, 100, null);
    }
    this.localPlayer.setBounce(0.2);
    this.localPlayer.setFrictionAir(0.0002);
    this.localPlayer.setRectangle(10);
    this.localPlayer.setFriction(1);

    this.enemyPlayer.setBounce(0.2);
    this.enemyPlayer.setFrictionAir(0.0002);
    this.enemyPlayer.setRectangle(10);
    this.enemyPlayer.setFriction(1);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.fireButton = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.localTurret = this.add.image(
      this.localPlayer.x,
      this.localPlayer.y,
      null
    );
    this.localTurret.setOrigin(0.5, 1);

    this.enemyTurret = this.add.image(
      this.enemyPlayer.x,
      this.enemyPlayer.y,
      null
    );
    this.enemyTurret.setOrigin(0.5, 1);

    this.localHealthBar = this.add.graphics();
    //console.log('Player 1 Health:', this.healthPlayer1);
    //console.log('Type of player1Health:', typeof this.healthPlayer1);
    //this.player1HealthBar.fillStyle(0x00ff00, 1);
    //this.player1HealthBar.fillRect(10, 10, this.healthPlayer1 * 2, 20);

    this.enemyHealthBar = this.add.graphics();
    //console.log('Player 2 Health:', this.healthPlayer2);
    //this.player2HealthBar.fillStyle(0x00ff00, 1);
    //this.player2HealthBar.fillRect(790, 10, this.healthPlayer2 * 2, 20);

    this.bullets = this.add.group({
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true,
    });

    this.lastFired = 0;
    //this.updateHealthBar(this.player1HealthBar, this.player1, this.healthPlayer1);
    //this.updateHealthBar(this.player2HealthBar, this.player2, this.healthPlayer2);

    //console.log('Player 1 Health:', this.healthPlayer1);

    // Add a circle graphics for the move guide
    this.moveGuide = this.add.graphics();
    this.input.on("pointermove", this.updateMoveGuide, this);
    this.input.on("pointerdown", this.handlePointerDown, this);
  }

  update(time, delta) {
    if (this.gameOver) {
      return;
    }

    if (this.isOpen) {
      console.log("store open");
      this.closeStore();
    } else {
      //console.log("store closed");
    }

    // if (this.isPlayer1Turn && this.host) {
    //   this.scene.pause();
    // }
    //console.log('Player 1 Health:', this.healthPlayer1);

    this.localTurret.x = this.localPlayer.x;
    this.localTurret.y = this.localPlayer.y - 20;
    this.localTurret.rotation = this.localTurretAngle;

    this.enemyTurret.x = this.enemyPlayer.x;
    this.enemyTurret.y = this.enemyPlayer.y - 20;
    this.enemyTurret.rotation = this.enemyTurretAngle * -1;

    this.updateHealthBar(
      this.localHealthBar,
      this.localPlayer,
      this.localPlayerHealth
    );
    this.updateHealthBar(
      this.enemyHealthBar,
      this.enemyPlayer,
      this.enemyPlayerHealth
    );
   
    if (this.isOpen) {
      //this.openStore();
    } else {
      //this.closeStore();
    };

    if (
      (this.isPlayer1Turn && this.isPlayer1) ||
      (!this.isPlayer1Turn && !this.isPlayer1)
    ) {
      // verify is buy stage

      // verify is move stage

      // etc...

      // if its this local player's turn
      // make player controllable
      if (this.cursors.up.isDown) {
        this.localTurretAngle -= 0.05;
      } else if (this.cursors.down.isDown) {
        this.localTurretAngle += 0.05;
      }

      if (this.fireButton.isDown && time > this.lastFired) {
        this.socket.emit("make-move", {
          partida_id: this.partida_id,
          player_id: this.local_player_id,
          angle: this.localTurretAngle,
        });
        this.fireBullet(
          this.localPlayer,
          this.localTurret,
          this.localTurretAngle
        );
        this.lastFired = time + 500;
        this.isPlayer1Turn = !this.isPlayer1Turn;
      }
    } else {
      // disable local player
      // wait for data
      // if (this.cursors.up.isDown) {
      //   this.turret2Angle -= 0.05;
      // } else if (this.cursors.down.isDown) {
      //   this.turret2Angle += 0.05;
      // }
      // if (this.fireButton.isDown && time > this.lastFired) {
      //   this.fireBullet(this.player2, this.turret2, this.turret2.rotation);
      //   this.lastFired = time + 500;
      //   this.isPlayer1Turn = !this.isPlayer1Turn;
      // }
    }
  }
  makeEnemyMove(data) {
    this.enemyTurretAngle = data.angle;
    this.fireBullet(this.enemyPlayer, this.enemyTurret, this.enemyTurretAngle);
    this.isPlayer1Turn = !this.isPlayer1Turn;
  }

  updateHealthBar(healthBar, player, health) {
    const maxHealth = 100;
    const healthBarWidth = 50; // Width of the health bar
    const healthBarHeight = 5; // Height of the health bar
    const x = player.x - healthBarWidth / 2;
    const y = player.y - 30; // Position the bar above the player

    healthBar.clear();

    // Draw the remaining health (green part)
    const remainingHealthWidth = healthBarWidth * (health / maxHealth);
    healthBar.fillStyle(0x00ff00); // Green color for remaining health
    healthBar.fillRect(x, y, remainingHealthWidth, healthBarHeight);

    // Draw the lost health (red part)
    const lostHealthWidth = healthBarWidth * ((maxHealth - health) / maxHealth);
    healthBar.fillStyle(0xff0000); // Red color for lost health
    healthBar.fillRect(
      x + remainingHealthWidth,
      y,
      lostHealthWidth,
      healthBarHeight
    );
  }

  openStore() {
    console.log("Store opened");
  }

  closeStore() {
    console.log("Store closed");
  }

  updateMoveGuide(pointer) {
    this.moveGuide.clear();
    this.moveGuide.lineStyle(2, 0xff0000, 1);
    this.moveGuide.strokeCircle(pointer.x, pointer.y, 20);

    if (this.isValidMove(pointer.x, pointer.y)) {
      this.moveGuide.fillStyle(0x00ff00, 0.5);
    } else {
      this.moveGuide.fillStyle(0xff0000, 0.5);
    }
    this.moveGuide.fillCircle(pointer.x, pointer.y, 20);
  }

  handlePointerDown(pointer) {
    const x = pointer.x;
    const y = pointer.y;

    if (this.isValidMove(x, y)) {
      let targetPlayer;
      if (
        (this.isPlayer1Turn && this.isPlayer1) ||
        (!this.isPlayer1Turn && !this.isPlayer1)
      ) {
        targetPlayer = this.localPlayer;
      } else {
        targetPlayer = this.enemyPlayer;
      }

      // const targetPlayer = this.isPlayer1Turn ? this.player1 : this.player2;
      this.movePlayerTo(targetPlayer, x, y);
      // no queremos que cambie despues del mov sino del disparo
      //this.isPlayer1Turn = !this.isPlayer1Turn;
    }
  }

  isValidMove(x, y) {
    for (let i = 0; i < this.verts.length - 1; i++) {
      const vert1 = this.verts[i];
      const vert2 = this.verts[i + 1];

      if ((x >= vert1.x && x <= vert2.x) || (x <= vert1.x && x >= vert2.x)) {
        const slope = (vert2.y - vert1.y) / (vert2.x - vert1.x);
        const yOnLine = vert1.y + slope * (x - vert1.x);

        if (Math.abs(y - yOnLine) <= 5) {
          // Allow a small margin of error
          return true;
        }
      }
    }
    return false;
  }

  movePlayerTo(player, x, y) {
    this.tweens.add({
      targets: player,
      x: x,
      y: y - 20,
      duration: 1000,
      ease: "Power2",
      onComplete: () => {
        if (player === this.localPlayer) {
          this.localTurret.x = player.x;
          this.localTurret.y = player.y - 20;
        } else {
          this.enemyTurret.x = player.x;
          this.enemyTurret.y = player.y - 20;
        }
      },
    });
  }

  fireBullet(player, turret, turretAngle) {
    const bullet = this.bullets.get();

    if (bullet) {
      let angle = turretAngle;
      let velocity = 15;

      // Si el jugador es player2, invertimos el ángulo y la velocidad para disparar hacia la izquierda
      if (
        (player === this.localPlayer && !this.isPlayer1) ||
        (player === this.enemyPlayer && this.isPlayer1)
      ) {
        angle = Phaser.Math.DegToRad(180) + turretAngle; // Invierte el ángulo
      }

      bullet.fire(turret.x, turret.y, angle, velocity);
    }
  }

  generatePath() {
    const maxY = this.sys.game.config.height;
    const maxX = this.sys.game.config.width;

    let path = `0 ${maxY} ` + this.path + ` ${maxX} ${maxY}`;

    console.log(path);

    return path.trim();
  }

  // RANDOM PATH GENERATOR
  // generateRandomPathString() {
  //   const numPoints = Phaser.Math.Between(20, 30);
  //   const minY = 300;
  //   const maxY = this.sys.game.config.height;

  //   let path = `0 ${maxY} `;

  //   let lastY = 0;

  //   for (let i = 1; i < numPoints; i++) {
  //     const x = (this.sys.game.config.width / numPoints) * i;
  //     if (i % 2 === 0) {
  //       const y = lastY;
  //       path += `${x} ${y} `;
  //     } else {
  //       const y = Phaser.Math.Between(minY, maxY);
  //       path += `${x} ${y} `;
  //       lastY = y;
  //     }
  //   }

  //   path += `${this.sys.game.config.width} ${maxY}`;

  //   return path.trim();
  // }

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

  explosionEffect(x, y) {
    const explosionGraphics = this.add.graphics();
    explosionGraphics.fillStyle(0xff0000, 0.5);
    explosionGraphics.fillCircle(x, y, this.explosionRadius);
    this.time.delayedCall(
      this.explosionDuration,
      () => {
        explosionGraphics.destroy();
      },
      [],
      this
    );

    // Apply damage to objects within the radius
    this.applyExplosionDamage(x, y, this.explosionRadius, this.maxDamage);
  }

  /* Chat */

  applyExplosionDamage(x, y, radius, maxDamage) {
    const players = [this.localPlayer, this.enemyPlayer];
    players.forEach((player) => {
      const distance = Phaser.Math.Distance.Between(x, y, player.x, player.y);
      if (distance <= radius) {
        const damage = maxDamage * (1 - distance / radius);
        if (player === this.localPlayer) {
          this.localPlayerHealth = Math.max(0, this.localPlayerHealth - damage);
          console.log("Local Health:", this.localPlayerHealth);
          this.updateHealthBar(
            this.localHealthBar,
            this.localPlayer,
            this.localPlayerHealth
          );
          if (this.localPlayerHealth <= 0) {
            this.endGame("enemyPlayer");
          }
        } else if (player === this.enemyPlayer) {
          this.enemyPlayerHealth = Math.max(0, this.enemyPlayerHealth - damage);
          console.log("Enemy Health:", this.enemyPlayerHealth);
          this.updateHealthBar(
            this.enemyHealthBar,
            this.enemyPlayer,
            this.enemyPlayerHealth
          );
          if (this.enemyPlayerHealth <= 0) {
            this.endGame("Player 1");
          }
        }
      }
    });
  }

  handleBulletTerrainCollision(position) {
    // Handle terrain deformation
    this.explosionEffect(position.x, position.y);
  }

  handleTankHit(tank, playerKey, health) {
    if (playerKey === "localPlayer") {
      //console.log('Before collision - Player 1 Health:', this.player1Health);
      //this.player1Health -= 10;
      health = Math.max(0, health - 20);
      console.log("After collision - localPlayer Health:", health); // Reduce la salud del jugador 1 en 10
      this.localPlayerHealth = health;
      //this.updateHealthBar(this.player1HealthBar, this.player1, this.healthPlayer1);
      if (health <= 0) {
        this.updateHealthBar(
          this.localHealthBar,
          this.localPlayer,
          this.localPlayerHealth
        );
        this.endGame("enemyPlayer");
      }
    } else if (playerKey === "enemyPlayer") {
      health = Math.max(0, health - 20);
      this.enemyPlayerHealth = health;
      //this.updateHealthBar(this.player1HealthBar, this.player1, this.enemyPlayerHealth);
      console.log("Enemy Health:", health);
      if (health <= 0) {
        this.updateHealthBar(
          this.enemyHealthBar,
          this.enemyPlayer,
          this.enemyPlayerHealth
        );
        this.endGame("localPlayer");
      }
    }
  }

  endGame(winner) {
    this.gameOver = true;
    console.log(`${winner} wins!`);
    // Lógica adicional para finalizar el juego, mostrar mensajes, reiniciar, etc.
  }
}

// revisar
class Bullet extends Phaser.Physics.Matter.Image {
  constructor(scene, x, y) {
    super(scene.matter.world, x, y, "bullet");
    scene.add.existing(this);

    this.setCircle(5);
    this.setIgnoreGravity(false);

    this.scene = scene;

    this.scene.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
      if (
        (bodyA === this.body && bodyB === this.scene.localPlayer.body) ||
        (bodyB === this.body && bodyA === this.scene.localPlayer.body)
      ) {
        if (this.scene.isPlayer1Turn && this.scene.isPlayer1) {
          return;
        }
      }
      if (
        (bodyA === this.body && bodyB === this.scene.enemyPlayer.body) ||
        (bodyB === this.body && bodyA === this.scene.enemyPlayer.body)
      ) {
        if (this.scene.isPlayer1Turn === false && !this.scene.isPlayer1) {
          return;
        }
      }
    });
  }

  fire(x, y, angle, velocity) {
    this.setPosition(x, y);
    this.setVelocity(Math.cos(angle) * velocity, Math.sin(angle) * velocity);
    this.setActive(true);
    this.setVisible(true);
    console.log("Bullet properties FIRED:", this);
  }

  update() {
    if (this.active && this.y > this.scene.sys.game.config.height) {
      console.log("Bullet out of bounds or touching ground");
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
    }
  }
}


export default TankWarsScene;
