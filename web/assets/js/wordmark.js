// Static Kenkobo wordmark renderer for the site header.
// Re-uses the segment system from index.html. Draws three stacked strokes per
// segment — outer halo, main red body, bright pink core — so the static
// lockup matches the layered look of the intro animation's final frame.
(() => {
  const WORD = 'KENKOBO';
  const SW = 52, SH = 84, LW = 4.2, INS = 5;
  const VIS_GAP = 16;

  function segPts(s) {
    const w = SW, h = SH, m = h / 2, n = INS;
    return {
      a:   [[n, 0],     [w - n, 0]],
      b:   [[w, n],     [w, m - n]],
      c:   [[w, m + n], [w, h - n]],
      d:   [[n, h],     [w - n, h]],
      e:   [[0, m + n], [0, h - n]],
      f:   [[0, n],     [0, m - n]],
      g1:  [[n, m],     [w / 2 - 2, m]],
      g2:  [[w / 2 + 2, m], [w - n, m]],
      g:   [[n, m],     [w - n, m]],                  // full middle bar (B)
      n1a: [[0, n + 1], [w / 2 - 3, m - 4]],          // N upper-left half
      n1b: [[w / 2 + 3, m + 4], [w, h - n - 1]],      // N lower-right half
      k1:  [[0, m],     [w - n, 0]],
      k2:  [[0, m],     [w - n, h]],
    }[s];
  }

  const CM = {
    K: ['f', 'e', 'k1', 'k2'],
    E: ['a', 'f', 'e', 'g1', 'g2', 'd'],
    N: ['f', 'e', 'b', 'c', 'n1a', 'n1b'],
    O: ['a', 'b', 'c', 'd', 'e', 'f'],
    B: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  };

  const BOUNDS = {
    K: [0, SW - INS],
    E: [0, SW - INS],
    N: [0, SW],
    O: [0, SW],
    B: [0, SW],
  };

  const KERN_PAIRS = { 'KE': -2, 'NK': -2 };

  // Same layered palette as the intro animation final frame.
  const LAYERS = [
    { stroke: 'rgba(255, 80, 60, 0.32)',   width: LW + 4,    blur: 12 },  // outer halo (+ glow)
    { stroke: 'rgb(255, 45, 35)',          width: LW,        blur: 0 },   // main red body
    { stroke: 'rgba(255, 220, 210, 0.85)', width: LW * 0.32, blur: 0 },   // bright core
  ];

  function layout() {
    const positions = [];
    let cursor = 0;
    for (let ci = 0; ci < WORD.length; ci++) {
      const ch = WORD[ci];
      const b = BOUNDS[ch] || [0, SW];
      if (ci === 0) {
        cursor = -b[0];
      } else {
        const prevCh = WORD[ci - 1];
        const prevB = BOUNDS[prevCh] || [0, SW];
        const kern = KERN_PAIRS[prevCh + ch] || 0;
        cursor = positions[ci - 1] + prevB[1] + VIS_GAP + kern - b[0];
      }
      positions.push(cursor);
    }
    const lastB = BOUNDS[WORD[WORD.length - 1]];
    const firstB = BOUNDS[WORD[0]];
    const totalVis = positions[WORD.length - 1] + lastB[1] - (positions[0] + firstB[0]);
    const firstVisLeft = positions[0] + firstB[0];
    return { positions, totalVis, firstVisLeft };
  }

  function render(cvs, options) {
    const opts = options || {};
    const scale = opts.scale || 0.5;
    const padX = opts.padX != null ? opts.padX : 10;
    const padY = opts.padY != null ? opts.padY : 10;

    const { positions, totalVis, firstVisLeft } = layout();
    const DPR = window.devicePixelRatio || 1;

    const W = Math.ceil(totalVis * scale) + padX * 2;
    const H = Math.ceil(SH * scale) + padY * 2;

    cvs.style.width = W + 'px';
    cvs.style.height = H + 'px';
    cvs.width = W * DPR;
    cvs.height = H * DPR;

    const ctx = cvs.getContext('2d');
    ctx.setTransform(DPR * scale, 0, 0, DPR * scale, DPR * padX, DPR * padY);
    ctx.clearRect(-padX / scale, -padY / scale, W / scale + padX * 2, H / scale + padY * 2);

    ctx.lineCap = 'butt';

    const offsetX = -firstVisLeft;

    for (const layer of LAYERS) {
      ctx.save();
      ctx.strokeStyle = layer.stroke;
      ctx.lineWidth = layer.width;
      if (layer.blur > 0) {
        ctx.shadowColor = 'rgba(255, 70, 50, 0.55)';
        ctx.shadowBlur = layer.blur;
      }
      for (let ci = 0; ci < WORD.length; ci++) {
        const segs = CM[WORD[ci]] || [];
        const cx = positions[ci] + offsetX;
        for (const s of segs) {
          const p = segPts(s);
          ctx.beginPath();
          ctx.moveTo(p[0][0] + cx, p[0][1]);
          ctx.lineTo(p[1][0] + cx, p[1][1]);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
  }

  window.KenkoboWordmark = { render };
})();
