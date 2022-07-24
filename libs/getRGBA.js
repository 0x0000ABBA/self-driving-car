const getRGBA = (value) => {
    const R = value > 0 ? 255 : 0;
    const G = R;
    const B = value < 0 ? 255 : 0;
    const A = Math.abs(value);
    return "rgba(" + R + "," + G + "," + B + "," + A + ")";
};
