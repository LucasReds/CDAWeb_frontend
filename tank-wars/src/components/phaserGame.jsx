import React, { useRef, useEffect } from "react";
import Phaser from "phaser";

class Example extends Phaser.Scene {
  constructor() {
    super({ key: "Example" });
    this.gameOver = false;
    this.score = 0;
    this.cursors = null;
    this.player1 = null;
    this.player2 = null;
    this.turret1 = null;
    this.turret2 = null;
    this.bullets = null;
    this.fireButton = null;
    this.turret1Angle = 0;
    this.turret2Angle = 0;
    this.terrainGraphics = null;
    this.terrainCollider = null;
    this.path = null;
    this.verts = null;
    this.isPlayer1Turn = true;
    this.lastFired = 0;
    this.moveGuide = null;
    this.isMoving = true;
    this.isShooting = false;
    this.healthPlayer1 = 100;
    this.healthPlayer2 = 100;
    this.player1HealthBar = null;
    this.player2HealthBar = null;
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
    this.matter.world.setBounds(
      0,
      0,
      this.sys.game.config.width,
      this.sys.game.config.height
    );

    this.path = this.generateRandomPathString();
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
          (gameObjectA instanceof Bullet && gameObjectB === this.player1) ||
          (gameObjectB instanceof Bullet && gameObjectA === this.player1)
        ) {
          this.handleTankHit(this.player1, "player1", this.healthPlayer1);
        }

        if (
          (gameObjectA instanceof Bullet && gameObjectB === this.player2) ||
          (gameObjectB instanceof Bullet && gameObjectA === this.player2)
        ) {
          this.handleTankHit(this.player2, "player2", this.healthPlayer2);
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

    this.player1 = this.matter.add.image(100, 100, null);
    this.player1.setBounce(0.2);
    this.player1.setFrictionAir(0.0002);
    this.player1.setRectangle(10);
    this.player1.setFriction(1);

    this.player2 = this.matter.add.image(900, 100, null);
    this.player2.setBounce(0.2);
    this.player2.setFrictionAir(0.0002);
    this.player2.setRectangle(10);
    this.player2.setFriction(1);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.fireButton = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.turret1 = this.add.image(this.player1.x, this.player1.y, null);
    this.turret1.setOrigin(0.5, 1);

    this.turret2 = this.add.image(this.player2.x, this.player2.y, null);
    this.turret2.setOrigin(0.5, 1);

    this.player1HealthBar = this.add.graphics();
    //console.log('Player 1 Health:', this.healthPlayer1);
    //console.log('Type of player1Health:', typeof this.healthPlayer1);
    //this.player1HealthBar.fillStyle(0x00ff00, 1);
    //this.player1HealthBar.fillRect(10, 10, this.healthPlayer1 * 2, 20);

    this.player2HealthBar = this.add.graphics();
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

    // if (this.isPlayer1Turn && this.host) {
    //   this.scene.pause();
    // }
    //console.log('Player 1 Health:', this.healthPlayer1);

    this.turret1.x = this.player1.x;
    this.turret1.y = this.player1.y - 20;
    this.turret1.rotation = this.turret1Angle;

    this.turret2.x = this.player2.x;
    this.turret2.y = this.player2.y - 20;
    this.turret2.rotation = this.turret2Angle * -1;

    this.updateHealthBar(
      this.player1HealthBar,
      this.player1,
      this.healthPlayer1
    );
    this.updateHealthBar(
      this.player2HealthBar,
      this.player2,
      this.healthPlayer2
    );

    // verify is buy stage

    // verify is move stage

    // etc...

    if (this.isPlayer1Turn) {
      if (this.cursors.up.isDown) {
        this.turret1Angle -= 0.05;
      } else if (this.cursors.down.isDown) {
        this.turret1Angle += 0.05;
      }

      if (this.fireButton.isDown && time > this.lastFired) {
        this.fireBullet(this.player1, this.turret1, this.turret1Angle);
        this.lastFired = time + 500;
        this.isPlayer1Turn = false;
      }
    } else {
      // wait for data
      if (this.cursors.up.isDown) {
        this.turret2Angle -= 0.05;
      } else if (this.cursors.down.isDown) {
        this.turret2Angle += 0.05;
      }

      if (this.fireButton.isDown && time > this.lastFired) {
        this.fireBullet(this.player2, this.turret2, this.turret2.rotation);
        this.lastFired = time + 500;
        this.isPlayer1Turn = true;
      }
    }
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
      const targetPlayer = this.isPlayer1Turn ? this.player1 : this.player2;
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
        if (player === this.player1) {
          this.turret1.x = player.x;
          this.turret1.y = player.y - 20;
        } else {
          this.turret2.x = player.x;
          this.turret2.y = player.y - 20;
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
      if (player === this.player2) {
        angle = Phaser.Math.DegToRad(180) + turretAngle; // Invierte el ángulo
      }

      bullet.fire(turret.x, turret.y, angle, velocity);
    }
  }

  generateRandomPathString() {
    const numPoints = Phaser.Math.Between(20, 30);
    const minY = 300;
    const maxY = this.sys.game.config.height;

    let path = `0 ${maxY} `;

    let lastY = 0;

    for (let i = 1; i < numPoints; i++) {
      const x = (this.sys.game.config.width / numPoints) * i;
      if (i % 2 === 0) {
        const y = lastY;
        path += `${x} ${y} `;
      } else {
        const y = Phaser.Math.Between(minY, maxY);
        path += `${x} ${y} `;
        lastY = y;
      }
    }

    path += `${this.sys.game.config.width} ${maxY}`;

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

  /* Chat */

  applyExplosionDamage(x, y, radius, maxDamage) {
    const players = [this.player1, this.player2];
    players.forEach((player) => {
      const distance = Phaser.Math.Distance.Between(x, y, player.x, player.y);
      if (distance <= radius) {
        const damage = maxDamage * (1 - distance / radius);
        if (player === this.player1) {
          this.healthPlayer1 = Math.max(0, this.healthPlayer1 - damage);
          console.log("Player 1 Health:", this.healthPlayer1);
          this.updateHealthBar(
            this.player1HealthBar,
            this.player1,
            this.healthPlayer1
          );
          if (this.healthPlayer1 <= 0) {
            this.endGame("Player 2");
          }
        } else if (player === this.player2) {
          this.healthPlayer2 = Math.max(0, this.healthPlayer2 - damage);
          console.log("Player 2 Health:", this.healthPlayer2);
          this.updateHealthBar(
            this.player2HealthBar,
            this.player2,
            this.healthPlayer2
          );
          if (this.healthPlayer2 <= 0) {
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
    if (playerKey === "player1") {
      //console.log('Before collision - Player 1 Health:', this.player1Health);
      //this.player1Health -= 10;
      health = Math.max(0, health - 20);
      console.log("After collision - Player 1 Health:", health); // Reduce la salud del jugador 1 en 10
      this.healthPlayer1 = health;
      //this.updateHealthBar(this.player1HealthBar, this.player1, this.healthPlayer1);
      if (health <= 0) {
        this.updateHealthBar(
          this.player1HealthBar,
          this.player1,
          this.healthPlayer1
        );
        this.endGame("Player 2");
      }
    } else if (playerKey === "player2") {
      health = Math.max(0, health - 20);
      this.healthPlayer2 = health;
      //this.updateHealthBar(this.player1HealthBar, this.player1, this.healthPlayer2);
      console.log("Player 2 Health:", health);
      if (health <= 0) {
        this.updateHealthBar(
          this.player2HealthBar,
          this.player2,
          this.healthPlayer2
        );
        this.endGame("Player 1");
      }
    }
  }

  endGame(winner) {
    this.gameOver = true;
    console.log(`${winner} wins!`);
    // Lógica adicional para finalizar el juego, mostrar mensajes, reiniciar, etc.
  }
}

class Bullet extends Phaser.Physics.Matter.Image {
  constructor(scene, x, y) {
    super(scene.matter.world, x, y, "bullet");
    scene.add.existing(this);

    this.setCircle(5);
    this.setIgnoreGravity(false);

    this.scene = scene;

    this.scene.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
      if (
        (bodyA === this.body && bodyB === this.scene.player1.body) ||
        (bodyB === this.body && bodyA === this.scene.player1.body)
      ) {
        if (this.scene.isPlayer1Turn) {
          return;
        }
      }
      if (
        (bodyA === this.body && bodyB === this.scene.player2.body) ||
        (bodyB === this.body && bodyA === this.scene.player2.body)
      ) {
        if (this.scene.isPlayer1Turn === false) {
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

const PhaserGame = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    if (!gameRef.current) {
      const gameConfig = {
        type: Phaser.AUTO,
        width: 1000,
        height: 800,
        physics: {
          default: "matter",
          matter: {
            debug: false,
            enableSleeping: true,
          },
        },
        scene: Example,
      };

      gameRef.current = new Phaser.Game(gameConfig);
    }

    return () => {
      // Clean up Phaser game instance when component unmounts
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div id="phaser-container" />;
};

export default PhaserGame;
