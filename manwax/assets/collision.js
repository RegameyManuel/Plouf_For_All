// Couleurs pour les balles 
const colors = [
    '#FF0000', // Rouge vif
    '#FF4500', // Orange vif
    '#FFD700', // Jaune vif
    '#FFFF00', // Jaune
    '#00FF00', // Vert lime
    '#32CD32', // Vert clair
    '#00FF7F', // Vert printemps
    '#00FFFF', // Cyan vif
    '#1E90FF', // Bleu dodger
    '#0000FF', // Bleu vif
    '#8A2BE2', // Bleu violet
    '#FF1493', // Rose profond
    '#FF69B4', // Rose vif
    '#FF00FF', // Magenta vif
    '#FF6347', // Tomate
    '#FFD700', // Or
    '#FFA500', // Orange
    '#FF4500', // Orange rouge
    '#DA70D6', // Orchidée moyen
    '#BA55D3', // Orchidée moyen foncé
    '#7FFF00', // Chartreuse
    '#FF1493', // Rose profond
    '#DC143C', // Carmin
  ];

class Vector {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  
    add(vector) {
      return new Vector(this.x + vector.x, this.y + vector.y);
    }
  
    subtract(vector) {
      return new Vector(this.x - vector.x, this.y - vector.y);
    }
  
    multiply(scalar) {
      return new Vector(this.x * scalar, this.y * scalar);
    }
  
    dotProduct(vector) {
      return this.x * vector.x + this.y * vector.y;
    }
  
    get magnitude() {
      return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
  
    get direction() {
      return Math.atan2(this.x, this.y);
    }
  }
  
  class Canvas {
    constructor(parent = document.body) {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      parent.appendChild(this.canvas);
  
      // Initialisation de la taille
      this.resize();
      window.addEventListener('resize', () => this.resize());
  
      // Suivi de la position de la souris
      this.mousePosition = new Vector(0, 0);
      this.canvas.addEventListener('mousemove', this.trackMouse.bind(this));
    }
  
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  
    trackMouse(event) {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePosition = new Vector(
        event.clientX - rect.left,
        event.clientY - rect.top
      );
    }
  
    sync(state) {
      this.clearDisplay(state);
      this.drawActors(state.actors);
    }
  
    clearDisplay(state) {
      // Efface le canevas avec le fond sombre
      this.ctx.fillStyle = 'rgba(10, 15, 10, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
      // Effet de flash
      if (state.flash > 0) {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${state.flash})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  
    drawActors(actors) {
      for (let actor of actors) {
        if (actor.type === 'circle') {
          this.drawCircle(actor);
        }
      }
    }
  
    drawCircle(actor) {
      this.ctx.beginPath();
      this.ctx.arc(actor.position.x, actor.position.y, actor.radius, 0, Math.PI * 2);
      this.ctx.closePath();
      this.ctx.fillStyle = actor.color;
      this.ctx.fill();
    }
  }
  
  class State {
    constructor(display, actors, flash = 0) {
      this.display = display;
      this.actors = actors;
      this.flash = flash;
    }
  
    update(time) {
      const updateId = Math.floor(Math.random() * 1000000);
      const actors = this.actors.map(actor => {
        return actor.update(this, time, updateId);
      });
  
      // Détection de collision entre la souris et les balles
      const mousePosition = this.display.mousePosition;
      let flash = this.flash;
  
      for (let actor of actors) {
        if (actor.type === 'circle') {
          const distance = actor.position.subtract(mousePosition).magnitude;
          if (distance <= actor.radius) {
            flash = 1; // Déclenche le flash
            break;
          }
        }
      }
  
      // Réduction progressive du flash
      if (flash > 0) {
        flash -= time * 2; // Ajustez ce multiplicateur pour contrôler la durée du flash
        flash = Math.max(flash, 0);
      }
  
      return new State(this.display, actors, flash);
    }
  }
  
  class Ball {
    constructor(config) {
      Object.assign(this,
        {
          id: Math.floor(Math.random() * 1000000),
          type: 'circle',
          position: new Vector(100, 100),
          velocity: new Vector(5, 3),
          radius: 25,
          color: 'blue',
          collisions: [],
        },
        config
      );
    }
  
    update(state, time, updateId) {
      if (this.collisions.length > 10) {
        this.collisions = this.collisions.slice(this.collisions.length - 3);
      }
  
      for (let actor of state.actors) {
        if (this === actor || this.collisions.includes(actor.id + updateId)) {
          continue;
        }
  
        const distance = this.position.add(this.velocity).subtract(actor.position.add(actor.velocity)).magnitude;
  
        if (distance <= this.radius + actor.radius) {
          const v1 = collisionVector(this, actor);
          const v2 = collisionVector(actor, this);
          this.velocity = v1;
          actor.velocity = v2;
          this.collisions.push(actor.id + updateId);
          actor.collisions.push(this.id + updateId);
        }
      }
  
      const upperLimit = new Vector(state.display.canvas.width - this.radius, state.display.canvas.height - this.radius);
      const lowerLimit = new Vector(0 + this.radius, 0 + this.radius);
  
      if (this.position.x >= upperLimit.x || this.position.x <= lowerLimit.x) {
        this.velocity = new Vector(-this.velocity.x, this.velocity.y);
      }
  
      if (this.position.y >= upperLimit.y || this.position.y <= lowerLimit.y) {
        this.velocity = new Vector(this.velocity.x, -this.velocity.y);
      }
  
      const newX = Math.max(Math.min(this.position.x + this.velocity.x, upperLimit.x), lowerLimit.x);
      const newY = Math.max(Math.min(this.position.y + this.velocity.y, upperLimit.y), lowerLimit.y);
  
      return new Ball({
        ...this,
        position: new Vector(newX, newY),
      });
    }
  
    get area() {
      return Math.PI * this.radius ** 2;
    }
  
    get sphereArea() {
      return 4 * Math.PI * this.radius ** 2;
    }
  }
  
  const collisionVector = (particle1, particle2) => {
    return particle1.velocity
      .subtract(particle1.position
        .subtract(particle2.position)
        .multiply(particle1.velocity
          .subtract(particle2.velocity)
          .dotProduct(particle1.position.subtract(particle2.position))
          / particle1.position.subtract(particle2.position).magnitude ** 2
        )
        .multiply((2 * particle2.sphereArea) / (particle1.sphereArea + particle2.sphereArea))
      );
  };
  
  const runAnimation = animation => {
    let lastTime = null;
    const frame = time => {
      if (lastTime !== null) {
        const timeStep = Math.min(100, time - lastTime) / 1000;
        if (animation(timeStep) === false) {
          return;
        }
      }
      lastTime = time;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  
  const random = (max = 9, min = 0) => {
    return Math.random() * (max - min) + min;
  };
  
  const areBallsOverlapping = (ball1, ball2) => {
    const distance = ball1.position.subtract(ball2.position).magnitude;
    return distance < (ball1.radius + ball2.radius);
  };
  
  const collidingBalls = ({ width = window.innerWidth, height = window.innerHeight, parent = document.body, count = 150 } = {}) => {
    const display = new Canvas(parent, width, height);
    const balls = [];
    for (let i = 0; i < count; i++) {
      let newBall;
      let attempts = 0;
      const maxAttempts = 1000; // Limite pour éviter une boucle infinie
      do {
        const radius = random(28, 5) + Math.random();
        newBall = new Ball({
          radius: radius,
          color: colors[Math.floor(random(colors.length - 1))],
          position: new Vector(
            random(radius, width - radius),
            random(radius, height - radius)
          ),
          velocity: new Vector(random(-3, 3), random(-3, 3)),
        });
        attempts++;
      } while (balls.some(ball => areBallsOverlapping(newBall, ball)) && attempts < maxAttempts);
  
      if (attempts >= maxAttempts) {
        console.warn('Impossible de placer toutes les balles sans chevauchement.');
        break;
      }
      balls.push(newBall);
    }
    let state = new State(display, balls);
    runAnimation(time => {
      state = state.update(time);
      display.sync(state);
    });
  };
  
  // Ici on gère l'appui de la touche F11 pour le plein écran
  document.addEventListener('keydown', (event) => {
    if (event.key === 'F11') {
      event.preventDefault();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  });
  
  // On lance l'animation
  collidingBalls();
  