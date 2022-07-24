class Car {
    constructor(width, height, cX, cY, controlType, color, maxSpeed, id = null) {
        this.width = width;
        this.height = height;
        this.cX = cX;
        this.cY = cY;
        this.controls = new Controls(controlType);
        this.speed = 0;
        this.acceleration = 0.2;
        this.friction = 0.03;
        this.angle = 0;
        this.color = color;
        this.isAI = controlType === "AI";
        this.id = id;
        this.passedTraffic = [];
        this.passedTrafficCount = 0;
        
        if (this.controls.isDummy) {
            this.maxSpeed = maxSpeed;
            this.sensor = [];
        } else {
            this.maxSpeed = maxSpeed;
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount, 15, 4]
            );
        };
        this.isDamaged = false;
    };

    update(roadBorders, traffic) {
        if (!this.isDamaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.isDamaged = this.#assessDamage(roadBorders, traffic);
        };
        if (!this.controls.isDummy) {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(item => item == null ? 0 : 1 - item.offset);
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            if (this.isAI) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            };
        };
    };

    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (isPolysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        };
        for (let i = 0; i < traffic.length; i++) {
            if (isPolysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        };
        return false;
    };

    #createPolygon() {
        const points = [];
        const radius = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            cX: this.cX - Math.sin(this.angle - alpha) * radius,
            cY: this.cY - Math.cos(this.angle - alpha) * radius
        });
        points.push({
            cX: this.cX - Math.sin(this.angle + alpha) * radius,
            cY: this.cY - Math.cos(this.angle + alpha) * radius
        });
        points.push({
            cX: this.cX - Math.sin(Math.PI + this.angle - alpha) * radius,
            cY: this.cY - Math.cos(Math.PI + this.angle - alpha) * radius
        });
        points.push({
            cX: this.cX - Math.sin(Math.PI + this.angle + alpha) * radius,
            cY: this.cY - Math.cos(Math.PI + this.angle + alpha) * radius
        });
        return points;
    };

    #move() {
        this.controls.forward = true;
        if (this.controls.isDummy) {
            this.speed = this.maxSpeed;
        }
        if (this.controls.forward && this.speed < this.maxSpeed) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse && this.speed > -this.maxSpeed / 2) {
            this.speed -= this.acceleration;
        }
        if (this.speed > 0 && !this.controls.forward) {
            this.speed -= this.friction
        }
        if (this.speed < 0 && !this.controls.reverse) {
            this.speed += this.friction
        }
        if (Math.abs(this.speed) < this.friction * 2) {
            this.speed = 0;
        }
        if (this.speed != 0) {

            if (this.controls.left) {
                this.angle += (0.01 / 3 * this.speed);
            }
            if (this.controls.right) {
                this.angle -= (0.01 / 3 * this.speed);
            }
        }
        this.cX -= Math.sin(this.angle) * this.speed;

        this.cY -= Math.cos(this.angle) * this.speed;
    };

    draw(ctx, isBestCar) {
        if (!this.controls.isDummy && isBestCar) {
            this.sensor.draw(ctx);
        };

        if (this.isDamaged) {
            ctx.fillStyle = 'gray';
        } else {
            ctx.fillStyle = this.color;
        };

        ctx.beginPath();
        ctx.moveTo(this.polygon[0].cX, this.polygon[0].cY);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].cX, this.polygon[i].cY);
        }
        ctx.fill();
    };

};
