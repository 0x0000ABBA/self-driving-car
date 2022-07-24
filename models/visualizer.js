class Visualizer {
    static drawNetwork(ctx, network) {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;

        const levelHeight = height / network.levels.length;

        for (let i = network.levels.length - 1; i >= 0; i--) {
            const levelTop = top + lerp(
                height - levelHeight,
                0,
                network.levels.length === 1 ? 0.5 : i / (network.levels.length - 1)
            );
            ctx.setLineDash([6, 4]);
            Visualizer.drawLevel(
                ctx,
                network.levels[i],
                left,
                levelTop,
                width,
                levelHeight,
                i === network.levels.length - 1 ? ['🠉', '🠈', '🠊', '🠋'] : []
            );
        };
    };
    static drawLevel(ctx, level, left, top, width, height, outputLabels) {
        const right = left + width;
        const bottom = top + height;
        const nodeRadius = 20;
        const { inputs, outputs, weights, biases } = level;
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.moveTo(
                    Visualizer.#getNodeX(inputs, i, left, right),
                    bottom
                );
                ctx.lineTo(
                    Visualizer.#getNodeX(outputs, j, left, right),
                    top
                );
                const value = weights[i][j];
                ctx.strokeStyle = getRGBA(value);
                ctx.stroke();
            }
        };
        for (let i = 0; i < inputs.length; i++) {
            const cX = Visualizer.#getNodeX(inputs, i, left, right)
            ctx.beginPath();
            ctx.arc(cX, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
        };
        for (let i = 0; i < outputs.length; i++) {
            const cX = Visualizer.#getNodeX(outputs, i, left, right)
            ctx.beginPath();
            ctx.arc(cX, top, nodeRadius * 1.4, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cX, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.arc(cX, top, nodeRadius * 1.4, 0, Math.PI * 2);
            ctx.stroke();

            if (outputLabels[i]) {
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "white";
                ctx.strokeStyle = "black";
                ctx.font = (nodeRadius * 1.5) + "px Arial";
                ctx.fillText(outputLabels[i], cX, top + nodeRadius * 0.1);
                ctx.lineWidth = 1;
                ctx.strokeText(outputLabels[i], cX, top + nodeRadius * 0.1)
            }
        };
    };

    static #getNodeX(nodes, index, left, right) {
        return lerp(
            left,
            right,
            nodes.length === 1 ? 0.5 : index / (nodes.length - 1)
        );
    }
};
