import Phaser from "phaser";

class TankWarsScene extends Phaser.Scene {
  constructor(gameParams) {
    super({ key: "TankWarsScene" });
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
    this.registerNewPosition = gameParams.registerNewPosition; // usar para cambiar posicion en la bdd.
    // game generic attributes
    this.gameOver = false;
    this.score = 0;
    this.stage = "buy"; // "move" o "shoot"
    this.cursors = null;
    this.localPlayer = null;
    this.enemyPlayer = null;
    this.localTurret = null;
    this.enemyTurret = null;
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
    this.localFuel = 1000;
    this.power = 12;
    this.enemyPower = 12;

    this.turnStage = "buy"; // Possible values: 'buy', 'move', 'shoot'
    this.gettingData = false;
  }

  preload() {
    this.load.image("tank", "../src/assets/TankBody.png");
    this.load.image("turret", "../src/assets/TankTurret.png");
    this.load.image("bullet", "../src/assets/TankBullet.png");
  }

  create() {
    console.log("game created");
    // socket config for game duration
    console.log("store open:", this.isOpen);

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
      this.localPlayer = this.matter.add.image(400, 100, "tank");
      this.enemyPlayer = this.matter.add.image(900, 100, "tank");
      console.log(
        "1 player 1 checking initialization",
        this.localPlayer,
        this.enemyPlayer
      );
    } else {
      this.localPlayer = this.matter.add.image(900, 100, "tank");
      this.enemyPlayer = this.matter.add.image(400, 100, "tank");
      console.log(
        "2 player 1 checking initialization",
        this.localPlayer,
        this.enemyPlayer
      );
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
      "turret"
    );
    this.localTurret.setOrigin(0.5, 0.5);

    this.enemyTurret = this.add.image(
      this.enemyPlayer.x,
      this.enemyPlayer.y,
      "turret"
    );
    this.enemyTurret.setOrigin(0.5, 0.5);

    this.localHealthBar = this.add.graphics();
    //console.log('Player 1 Health:', this.healthPlayer1);
    //console.log('Type of player1Health:', typeof this.healthPlayer1);
    //this.player1HealthBar.fillStyle(0x00ff00, 1);
    //this.player1HealthBar.fillRect(10, 10, this.healthPlayer1 * 2, 20);

    this.enemyHealthBar = this.add.graphics();
    //console.log('Player 2 Health:', this.healthPlayer2);
    //this.player2HealthBar.fillStyle(0x00ff00, 1);
    //this.player2HealthBar.fillRect(790, 10, this.healthPlayer2 * 2, 20);

    this.lastFired = 0;
    //this.updateHealthBar(this.player1HealthBar, this.player1, this.healthPlayer1);
    //this.updateHealthBar(this.player2HealthBar, this.player2, this.healthPlayer2);

    window.addEventListener('store-closed', () => {
      this.isStoreOpen = false;
      console.log("turnStage = move")
      this.turnStage = "move";
    });

    window.addEventListener('store-opened', () => {
      this.isStoreOpen = true;
      //this.turnStage = "move";
    });

    //console.log('Player 1 Health:', this.healthPlayer1);

    // Add a circle graphics for the move guide
    this.moveGuide = this.add.graphics();

    // Add stats legend text
    this.hpIndicator = this.add.text(20, 60, `hp: ${this.localPlayerHealth}`, {
      fill: "#0f0",
    });
    this.fuelIndicator = this.add.text(
      20,
      80,
      `current fuel: ${this.localFuel}`,
      { fill: "#0f0" }
    );
    this.angleIndicator = this.add.text(
      20,
      100,
      `angle: ${this.localTurretAngle}`,
      { fill: "#0f0" }
    );
    this.powerIndicator = this.add.text(
      20,
      120,
      `power: ${Math.round(((this.power - 5) / 30) * 100)}`,
      {
        fill: "#0f0",
      }
    );

    this.socket.on("enemy-move-shoot", (data) => {
      this.makeEnemyShoot(data);
    });
    this.socket.on("enemy-move", (data) => {
      this.makeEnemyMove(data);
    });
    this.socket.on("enemy-rotate-turret", (data) => {
      console.log(data);
      this.enemyTurretAngle = data.angle;
    });
  }

  update(time, delta) {
    if (this.gettingData) return;
    if (this.gameOver) {
      return;
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
    this.enemyTurret.rotation = this.enemyTurretAngle;

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

    if (
      (this.isPlayer1Turn && this.isPlayer1) ||
      (!this.isPlayer1Turn && !this.isPlayer1)
    ) {
      console.log("your turn in stage", this.turnStage);
      window.dispatchEvent(new CustomEvent('turnStageChanged', { detail: this.turnStage }));

      switch (this.turnStage) {
        case "buy":
          //this.input.on("pointermove", null, this);
          if (this.isOpen) {
            //console.log("store is opened, buy stage confirmed")
            this.input.keyboard.enabled = false;
          } else {
            this.input.keyboard.enable = true
          }
          
        case "move":
          this.input.keyboard.enabled = true;
          this.input.on("pointermove", this.updateMoveGuide, this);
          if (this.input.activePointer.isDown) {
            console.log("pointer down");
            console.log("x, y:", this.localPlayer.x, this.localPlayer.y);
            const x = this.input.activePointer.x;
            const y = this.input.activePointer.y;

            if (this.isValidMove(x, y)) {
              // this.gettingData = true;
              this.registerNewPosition(
                this.local_player_id,
                this.partida_id,
                x,
                y
              ).then((checkingFuel) => {
                console.log("checking fuel", checkingFuel);
                if (checkingFuel.result) {
                  this.localFuel = checkingFuel.newGas;
                  this.updateLegend();
                  const targetPlayer = "local"; // siempre se mueve el local en esa parte
                  this.movePlayerTo(targetPlayer, x, y);

                  setTimeout(() => {
                    this.socket.emit("make-move", {
                      partida_id: this.partida_id,
                      player_id: this.local_player_id,
                      x: x, // la nueva posicion x de local player
                      y: y, // la nueva posicion y de local player
                    });
                  }, 500);
                  this.turnStage = "shoot";
                } else if (
                  !checkingFuel.result &&
                  checkingFuel.message === "Not enough gas!"
                ) {
                  console.log("Not enough gas!");
                  this.fuelWarning = this.add.text(
                    20,
                    160,
                    checkingFuel.message,
                    { fill: "#0f0" }
                  );
                }
              });
              // this.gettingData = false
            }
          }
          break;
        case "shoot":
          if (this.cursors.left.isDown) {
            this.power = this.power - 0.2 > 5 ? this.power - 0.2 : 5;
            this.updateLegend();
          }

          if (this.cursors.right.isDown) {
            this.power = this.power + 0.2 < 35 ? this.power + 0.2 : 35;
            this.updateLegend();
          }

          if (this.cursors.up.isDown) {
            this.localTurretAngle -= 0.05;
            this.updateLegend();
            this.socket.emit("rotate-turret", {
              partida_id: this.partida_id,
              angle: this.localTurretAngle,
            });
          } else if (this.cursors.down.isDown) {
            this.localTurretAngle += 0.05;
            this.updateLegend();
            this.socket.emit("rotate-turret", {
              partida_id: this.partida_id,
              angle: this.localTurretAngle,
            });
          }
          if (this.fireButton.isDown && time > this.lastFired) {
            this.socket.emit("make-move-shoot", {
              partida_id: this.partida_id,
              player_id: this.local_player_id,
              angle: this.localTurretAngle,
              power: this.power,
            });
            this.fireBullet(
              this.localPlayer,
              this.localTurret,
              this.localTurretAngle,
              this.power
            );
            this.lastFired = time + 500;
            this.isPlayer1Turn = !this.isPlayer1Turn;
            console.log("turnStage = buy y tunro otro jugador")
            this.turnStage = "buy";
          }
          break;
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


  updateLegend() {
    this.hpIndicator.setText(`hp: ${Math.round(this.localPlayerHealth)}`);
    this.fuelIndicator.setText(`current fuel: ${this.localFuel}`);
    this.angleIndicator.setText(
      `angle: ${Math.round(this.localTurretAngle * 100)}`
    );
    this.powerIndicator.setText(
      `power: ${Math.round(((this.power - 5) / 30) * 100)}%`
    );
    if (this.fuelWarning) {
      this.fuelWarning.destroy();
    }
  }

  handleBuyStage() {
    // Disable movement and shooting while buying
    this.input.keyboard.enabled = false;
    this.input.on("pointerdown", this.purchaseItem, this);

    // Ensure the store opens only once and remains open until purchase is complete
    if (this.isOpen) {
      return;
    }

    // Need UI?
    if (!this.isOpen) {
      this.openStore();
    }
  }

  makeEnemyShoot(data) {
    console.log("HERE");
    this.enemyTurretAngle = data.angle;
    this.enemyPower = data.power;
    console.log("firing bullet");
    console.log(
      "enemy player loca data",
      this.enemyPlayer,
      this.enemyTurret,
      this.enemyTurretAngle
    );
    this.fireBullet(
      this.enemyPlayer,
      this.enemyTurret,
      this.enemyTurretAngle,
      this.enemyPower
    );
    this.isPlayer1Turn = !this.isPlayer1Turn;
  }
  makeEnemyMove(data) {
    this.movePlayerTo("enemy", data.x, data.y);
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
    if (player === this.localPlayer) {
      this.updateLegend();
    }
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
      this.socket.emit("make-move", {
        partida_id: this.partida_id,
        player_id: this.local_player_id,
        x: this.localPlayer.x,
        y: this.localPlayer.y,
      });
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
    const target = player === "local" ? this.localPlayer : this.enemyPlayer;
    this.tweens.add({
      targets: target,
      x: x,
      y: y - 10,
      duration: 1000,
      ease: "Power2",
      onComplete: () => {
        if (target === this.localPlayer) {
          this.localTurret.x = player.x;
          this.localTurret.y = player.y - 20;
        } else {
          this.enemyTurret.x = player.x;
          this.enemyTurret.y = player.y - 20;
        }
      },
    });
  }

  fireBullet(player, turret, turretAngle, power) {
    console.log(
      "fireBullet called. Player:",
      player,
      "Turret:",
      turret,
      "TurretAngle:",
      turretAngle
    );
    const bullet = new Bullet(this, 0, 0, "bullet"); // Ensure 'this' (the scene) is passed correctly
    this.add.existing(bullet);

    if (bullet) {
      let angle = turretAngle;
      let velocity = power;

      // Si el jugador es player2, invertimos el ángulo y la velocidad para disparar hacia la izquierda
      if (
        (player === this.localPlayer && !this.isPlayer1) ||
        (player === this.enemyPlayer && this.isPlayer1)
      ) {
        // angle = Phaser.Math.DegToRad(180) + turretAngle; // Invierte el ángulo
      }
      console.log("Bullet will be fired. Angle:", angle, "Velocity:", velocity);
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

  showDamage(player, damage) {
    this.damageTag = this.add.text(
      player.x,
      player.y - 50,
      `-${Math.round(damage)}`,
      {
        fill: "#f00",
      }
    );
    this.time.delayedCall(
      1000,
      () => {
        this.damageTag.destroy();
      },
      [],
      this
    );
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
          this.showDamage(player, damage);
          if (this.localPlayerHealth <= 0) {
            this.endGame("Enemy Player");
          }
        } else if (player === this.enemyPlayer) {
          this.enemyPlayerHealth = Math.max(0, this.enemyPlayerHealth - damage);
          console.log("Enemy Health:", this.enemyPlayerHealth);
          this.updateHealthBar(
            this.enemyHealthBar,
            this.enemyPlayer,
            this.enemyPlayerHealth
          );
          this.showDamage(player, damage);
          if (this.enemyPlayerHealth <= 0) {
            this.endGame("YOU");
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
      this.explosionEffect(this.localPlayer.x, this.localPlayer.y);
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
        this.showDamage(this.localPlayer, damage);
        this.endGame("Enemy Player");
      }
    } else if (playerKey === "enemyPlayer") {
      this.explosionEffect(this.enemyPlayer.x, this.enemyPlayer.y);
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
        this.showDamage(this.enemyPlayer, damage);
        this.endGame("YOU");
      }
    }
  }

  endGame(winner) {
    window.dispatchEvent(new CustomEvent('winner', { detail: winner }));
    setTimeout(() => {
      this.gameOver = true;
      console.log(`${winner} wins!`);
    }, 2000);
    // Lógica adicional para finalizar el juego, mostrar mensajes, reiniciar, etc.
  }
}

// revisar
class Bullet extends Phaser.Physics.Matter.Image {
  constructor(scene, x, y, texture) {
    super(scene.matter.world, x, y, texture);
    this.scene = scene; // Set the scene reference here
    scene.add.existing(this);

    this.setCircle(5);
    this.setIgnoreGravity(false);

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
  }

  update() {
    if (this.active && this.y > this.scene.sys.game.config.height) {
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
    }
  }
}

export default TankWarsScene;
