class Sensor {
    constructor(car, rayCount = 15, rayLength = 250, raySpread = Math.PI*1.8) {
        this.car = car;
        this.rayCount = rayCount;
        this.rayLength = rayLength;
        this.raySpread = raySpread;
        this.rays = [];
        this.readings = [];
    }

    update(roadBorders, traffic) {
        this.#castRays();
        this.readings = [];
        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.#getReading(
                    this.rays[i],
                    roadBorders,
                    traffic
                )
            )
        }
    }

    #getReading(rays, roadBorders, traffic) {
        let touches = [];
        for (let i = 0; i < roadBorders.length; i++) {
            const touch = getIntersection(
                rays[0],
                rays[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );
            if (touch) {
                touches.push(touch);
            };
        }
        for (let i = 0; i < traffic.length; i++) {
            const polygon = traffic[i].polygon;
            for (let j = 0; j < polygon.length; j++) {
                const touch = getIntersection(
                    rays[0],
                    rays[1],
                    polygon[j],
                    polygon[(j + 1) % polygon.length]
                )
                if (touch) {
                    touches.push(touch);
                };
            };
        };
        if (touches.length === 0) {
            return null;
        } else {
            const offsets = touches.map((elem) => elem.offset);
            const minOffset = Math.min(...offsets);
            return touches.find((elem) => elem.offset === minOffset);
        };
    };

    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;
            const rayStart = {
                cX: this.car.cX,
                cY: this.car.cY
            };
            const rayEnd = {
                cX: this.car.cX - Math.sin(rayAngle) * this.rayLength,
                cY: this.car.cY - Math.cos(rayAngle) * this.rayLength
            };
            this.rays.push([rayStart, rayEnd]);
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.rayCount; i++) {
            let end = this.rays[i][1];
            if (this.readings[i]) {
                end = this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'yellow';
            ctx.moveTo(
                this.rays[i][0].cX,
                this.rays[i][0].cY
            );
            ctx.lineTo(
                end.cX,
                end.cY
            );
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'gray';
            ctx.moveTo(
                this.rays[i][1].cX,
                this.rays[i][1].cY
            );
            ctx.lineTo(
                end.cX,
                end.cY
            );
            ctx.stroke();
        }
    };
}
