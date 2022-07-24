class Road {
    constructor(width, cX, lanes = 3, length = 1000000) {
        this.width = width;
        this.cX = cX;
        this.lanes = lanes;
        this.length = length;

        this.left = cX - width / 2;
        this.right = cX + width / 2;

        this.top = -this.length;
        this.bottom = this.length;

        const topLeft = { cX: this.left, cY: this.top };
        const topRight = { cX: this.right, cY: this.top };
        const bottomLeft = { cX: this.left, cY: this.bottom };
        const bottomRight = { cX: this.right, cY: this.bottom };
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];

    };

    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.lanes;
        return (this.left + laneWidth / 2 + Math.min(laneIndex, this.lanes - 1) * laneWidth);
    };

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'white';

        for (let i = 1; i <= this.lanes - 1; i++) {
            const cX = lerp(
                this.left,
                this.right,
                i / this.lanes
            )
            ctx.setLineDash([40, 20])
            ctx.beginPath();
            ctx.moveTo(cX, this.top);
            ctx.lineTo(cX, this.bottom);
            ctx.stroke();
        };

        ctx.setLineDash([]);
        this.borders.forEach((border) => {
            ctx.beginPath();
            ctx.moveTo(border[0].cX, border[0].cY)
            ctx.lineTo(border[1].cX, border[1].cY)
            ctx.stroke();
        });
    };
};
