function getIntersection(A, B, C, D) {
    const tTop = (D.cX - C.cX) * (A.cY - C.cY) - (D.cY - C.cY) * (A.cX - C.cX);
    const uTop = (C.cY - A.cY) * (A.cX - B.cX) - (C.cX - A.cX) * (A.cY - B.cY);
    const bottom = (D.cY - C.cY) * (B.cX - A.cX) - (D.cX - C.cX) * (B.cY - A.cY);
    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                cX: lerp(A.cX, B.cX, t),
                cY: lerp(A.cY, B.cY, t),
                offset: t
            }
        };
    };
    return null;
};
