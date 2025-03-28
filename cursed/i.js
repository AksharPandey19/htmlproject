pxtex = (t, i, s, e, h = 10, n = 10, o = 10, r = t.getContext`2d`, l, W, a = Math.random) => {
    for (t.width = n, t.height = o, l = n; l--;)
        for (W = o; W--;) r.fillStyle = `hsl(${i+(a()-.5)*h},${s+(a()-.5)*h}%,${e+(a()-.5)*h}%)`, r.fillRect(l, W, 1, 1)
}, W = {
    o: {},
    reset: i => {
        W.canvas = i, W.objs = 0, W.current = {}, W.next = {}, W.l = {}, W.W = !1, W.gl = i.getContext("webgl2"), W.gl.blendFunc(770, 771), W.gl.activeTexture(33984), W.program = W.gl.createProgram(), W.gl.enable(2884), W.gl.shaderSource(t = W.gl.createShader(35633), "#version 300 es\nprecision highp float;in vec4 pos, col, uv;uniform mat4 pv, eye, m, im;uniform vec4 bb;out vec4 v_pos, v_col, v_uv;void main() {v_pos = m * pos;gl_Position = pv * v_pos;v_col = col;v_uv = uv;}"), W.gl.compileShader(t), W.gl.attachShader(W.program, t), W.gl.shaderSource(t = W.gl.createShader(35632), "#version 300 es\nprecision highp float;const lowp float floatMax = float(uint(-1));in vec4 v_pos, v_col, v_uv;uniform vec4 light;uniform vec4 o;uniform sampler2D sampler;uniform uvec2 s;out vec4 c;highp uint rand(highp uint seed) {seed = seed ^ (seed << 13u);seed = seed ^ (seed >> 7u);seed = seed ^ (seed << 17u);return seed;}void main() {float ambient = o.z;vec3 light_dir = normalize(light.xyz - v_pos.xyz);vec3 normal = normalize(cross(dFdx(v_pos.xyz), dFdy(v_pos.xyz)));float lambert = light.w * max(0., dot(light_dir, normal)) * 0.7;float specular = 0.;if(o.x > 0.) {vec3 R = reflect(-light_dir, normal);vec3 V = normalize(-v_pos.xyz);float specAngle = max(dot(R, V), 0.);specular = light.w * pow(specAngle, o.x) * 0.3;}c = mix(texture(sampler, v_uv.xy), v_col, o.w);float f = o.y > 0. ? ambient + lambert + specular : 1.;c = vec4(c.rgb * f, c.a);lowp float relX = (v_pos.x + 1.0) * 0.5;lowp float relY = (v_pos.y + 1.0) * 0.5;uint pxRows = uint(ceil(relY * float(s.y)));highp uint index = pxRows * s.x + uint(relX * float(s.x));highp uint seed1 = rand(index);highp uint seed2 = rand(seed1);highp uint seed3 = rand(seed2);lowp vec3 rnd = vec3(0.0);rnd.x += float(seed1) / floatMax;rnd.y += float(seed2) / floatMax;rnd.z += float(seed3) / floatMax;rnd /= 255.0;c.xyz += rnd;}"), W.gl.compileShader(t), W.gl.attachShader(W.program, t), W.gl.linkProgram(W.program), W.gl.useProgram(W.program), W.gl.clearColor(1, 1, 1, 1), W.clearColor = t => W.gl.clearColor(...W.u(t)), W.clearColor("fff"), W.gl.enable(2929), W.light({
            y: 1,
            i: 1
        }), W.camera({
            fov: 30
        }), setTimeout(W.draw, 16)
    },
    _: (t, i, s, e, h = [], n, o, r, l, a, d, c, u) => {
        if (t.n ||= "o" + W.objs++, t.size && (t.w = t.h = t.d = t.size), t.t?.width && !W.l[t.t.id] && (s = W.gl.createTexture(), W.gl.pixelStorei(37441, !0), W.gl.bindTexture(3553, s), W.gl.pixelStorei(37440, 1), W.gl.texImage2D(3553, 0, 6408, 6408, 5121, t.t), W.gl.generateMipmap(3553), W.l[t.t.id] = s), t.fov) {
            const i = 1 / Math.tan(t.fov * Math.PI / 180),
                s = .1,
                e = 80,
                h = e - s;
            W.projection = new DOMMatrix([i / (W.canvas.width / W.canvas.height), 0, 0, 0, 0, i, 0, 0, 0, 0, -(e + s) / h, -1, 0, 0, -2 * e * s / h, 0])
        }
        t = {
            type: i,
            ...W.current[t.n] = W.next[t.n] || {
                w: 1,
                h: 1,
                d: 1,
                x: 0,
                y: 0,
                z: 0,
                rx: 0,
                ry: 0,
                rz: 0,
                b: "888",
                mix: 0
            },
            ...t,
            f: 0
        }, W.o[t.type]?.vertices && !W.o?.[t.type].verticesBuffer && (W.gl.bindBuffer(34962, W.o[t.type].verticesBuffer = W.gl.createBuffer()), W.gl.bufferData(34962, new Float32Array(W.o[t.type].vertices), 35044), W.o[t.type].p || W.smooth(t), W.o[t.type].p && (W.gl.bindBuffer(34962, W.o[t.type].normalsBuffer = W.gl.createBuffer()), W.gl.bufferData(34962, new Float32Array(W.o[t.type].p.flat()), 35044))), W.o[t.type]?.uv && !W.o[t.type].uvBuffer && (W.gl.bindBuffer(34962, W.o[t.type].uvBuffer = W.gl.createBuffer()), W.gl.bufferData(34962, new Float32Array(W.o[t.type].uv), 35044)), W.o[t.type]?.indices && !W.o[t.type].indicesBuffer && (W.gl.bindBuffer(34963, W.o[t.type].indicesBuffer = W.gl.createBuffer()), W.gl.bufferData(34963, new Uint16Array(W.o[t.type].indices), 35044)), t.t ? t.t && !t.mix && (t.mix = 0) : t.mix = 1, W.next[t.n] = t
    },
    draw: (t, i, s, e, h = []) => {
        if (i = t - W.lastFrame, W.lastFrame = t, requestAnimationFrame(W.draw), W.W) W.onDraw(t);
        else {
            for (e in W.next.camera.g && W.m(W.next[W.next.camera.g], i, 1), s = W.animation("camera"), W.next?.camera?.g && s.preMultiplySelf(W.next[W.next.camera.g].v), W.gl.uniformMatrix4fv(W.gl.getUniformLocation(W.program, "eye"), !1, s.toFloat32Array()), s.invertSelf(), s.preMultiplySelf(W.projection), W.gl.uniformMatrix4fv(W.gl.getUniformLocation(W.program, "pv"), !1, s.toFloat32Array()), W.gl.uniform2ui(W.gl.getUniformLocation(W.program, "s"), W.canvas.width, W.canvas.height), W.gl.clear(16640), W.next) {
                const t = W.next[e];
                t.t || 1 != W.u(t.b)[3] ? h.push(t) : W.m(t, i)
            }
            for (e of (h.sort(((t, i) => W.M(i) - W.M(t))), W.gl.enable(3042), h)) "plane" == e.type && W.gl.depthMask(0), W.m(e, i), W.gl.depthMask(1);
            W.gl.disable(3042), W.gl.uniform4f(W.gl.getUniformLocation(W.program, "light"), W.k("light", "x"), W.k("light", "y"), W.k("light", "z"), W.k("light", "i")), W.onDraw(t)
        }
    },
    m: (t, i, s = ["camera", "light", "group"].includes(t.type), e) => {
        t.t && (W.gl.bindTexture(3553, W.l[t.t.id]), W.gl.uniform1i(W.gl.getUniformLocation(W.program, "sampler"), 0)), t.f >= t.a ? (t.onAnimDone?.(), delete t.a, delete t.onAnimDone) : t.f < t.a && (t.f += i), t.f > t.a && (t.f = t.a), W.next[t.n].v = W.animation(t.n), W.next[t.g] && W.next[t.n].v.preMultiplySelf(W.next[t.g].v), W.gl.uniformMatrix4fv(W.gl.getUniformLocation(W.program, "m"), !1, W.next[t.n].v.toFloat32Array()), W.gl.uniformMatrix4fv(W.gl.getUniformLocation(W.program, "im"), !1, DOMMatrix.fromMatrix(W.next[t.n].v).invertSelf().toFloat32Array()), s || (W.gl.bindBuffer(34962, W.o[t.type].verticesBuffer), W.gl.vertexAttribPointer(e = W.gl.getAttribLocation(W.program, "pos"), 3, 5126, !1, 0, 0), W.gl.enableVertexAttribArray(e), W.o[t.type].uvBuffer && (W.gl.bindBuffer(34962, W.o[t.type].uvBuffer), W.gl.vertexAttribPointer(e = W.gl.getAttribLocation(W.program, "uv"), 2, 5126, !1, 0, 0), W.gl.enableVertexAttribArray(e)), W.gl.uniform4f(W.gl.getUniformLocation(W.program, "o"), t.s, t.ns ? 0 : 1, W.ambientLight || .2, t.mix), W.gl.uniform4f(W.gl.getUniformLocation(W.program, "bb"), t.w, t.h, 0, 0), W.o[t.type].indicesBuffer && W.gl.bindBuffer(34963, W.o[t.type].indicesBuffer), W.gl.vertexAttrib4fv(W.gl.getAttribLocation(W.program, "col"), W.u(t.b)), W.o[t.type].indicesBuffer ? W.gl.drawElements(4, W.o[t.type].indices.length, 5123, 0) : W.gl.drawArrays(4, 0, W.o[t.type].vertices.length / 3))
    },
    k: (t, i) => {
        const s = W.next[t];
        if (!s?.a) return s[i];
        const e = W.current[t];
        return e[i] + (s[i] - e[i]) * (s.f / s.a)
    },
    animation: (t, i = new DOMMatrix) => W.next[t] ? i.translateSelf(W.k(t, "x"), W.k(t, "y"), W.k(t, "z")).rotateSelf(W.k(t, "rx"), W.k(t, "ry"), W.k(t, "rz")).scaleSelf(W.k(t, "w"), W.k(t, "h"), W.k(t, "d")) : i,
    M: (t, i = W.next.camera) => t?.v && i?.v ? (i.v.m41 - t.v.m41) ** 2 + (i.v.m42 - t.v.m42) ** 2 + (i.v.m43 - t.v.m43) ** 2 : 0,
    T: t => W.ambientLight = t,
    u: t => [...t.match(t.length < 5 ? /./g : /../g).map((i => ("0x" + i) / (t.length < 5 ? 15 : 255))), 1],
    add: (t, i) => {
        W.o[t] = i, i.p && (W.o[t].customNormals = 1), W[t] = i => W._(i, t)
    },
    group: t => W._(t, "group"),
    move: t => {
        t = Array.isArray(t) ? t : [t], setTimeout((() => t.forEach((t => W._(t)))), 1)
    },
    delete: t => {
        t = Array.isArray(t) ? t : [t], setTimeout((() => t.forEach((t => delete W.next[t]))), 1)
    },
    camera: t => setTimeout((() => W._(t, t.n = "camera")), 1),
    light: t => W._(t, t.n = "light")
}, W.smooth = (t, i = {}, s = [], e, h, n, o, r, l, a, d, c, u, f) => {
    for (W.o[t.type].p = [], n = 0; n < W.o[t.type].vertices.length; n += 3) s.push(W.o[t.type].vertices.slice(n, n + 3));
    for ((e = W.o[t.type].indices) ? h = 1 : (e = s, h = 0), n = 0; n < 2 * e.length; n += 3) {
        o = n % e.length, r = s[d = h ? W.o[t.type].indices[o] : o], l = s[c = h ? W.o[t.type].indices[o + 1] : o + 1], a = s[u = h ? W.o[t.type].indices[o + 2] : o + 2], AB = [l[0] - r[0], l[1] - r[1], l[2] - r[2]], BC = [a[0] - l[0], a[1] - l[1], a[2] - l[2]], f = n > o ? [0, 0, 0] : [AB[1] * BC[2] - AB[2] * BC[1], AB[2] * BC[0] - AB[0] * BC[2], AB[0] * BC[1] - AB[1] * BC[0]];
        const _ = r[0] + "_" + r[1] + "_" + r[2],
            x = l[0] + "_" + l[1] + "_" + l[2],
            y = a[0] + "_" + a[1] + "_" + a[2];
        i[_] ||= [0, 0, 0], i[x] ||= [0, 0, 0], i[y] ||= [0, 0, 0], W.o[t.type].p[d] = i[_] = i[_].map(((t, i) => t + f[i])), W.o[t.type].p[c] = i[x] = i[x].map(((t, i) => t + f[i])), W.o[t.type].p[u] = i[y] = i[y].map(((t, i) => t + f[i]))
    }
}, W.add("plane", {
    vertices: [.5, .5, 0, -.5, .5, 0, -.5, -.5, 0, .5, .5, 0, -.5, -.5, 0, .5, -.5, 0],
    uv: [1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0]
}), W.add("cube", {
    vertices: [.5, .5, .5, -.5, .5, .5, -.5, -.5, .5, .5, .5, .5, -.5, -.5, .5, .5, -.5, .5, .5, .5, -.5, .5, .5, .5, .5, -.5, .5, .5, .5, -.5, .5, -.5, .5, .5, -.5, -.5, .5, .5, -.5, -.5, .5, -.5, -.5, .5, .5, .5, .5, -.5, -.5, .5, .5, .5, .5, .5, -.5, .5, .5, -.5, .5, -.5, -.5, -.5, -.5, -.5, .5, .5, -.5, -.5, -.5, -.5, -.5, .5, -.5, .5, -.5, .5, .5, -.5, .5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, .5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, -.5, .5, -.5, -.5],
    uv: [1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0]
}), W.cube = t => W._(t, "cube");
let i = new AudioContext;
"use strict";
const s = {
    A: '"Courier New", monospace',
    O: "Arial, sans-serif",
    N: '"Times New Roman", serif',
    D: 30,
    R: 60,
    S: "Cursed Elevator",
    I(t) {
        if (!t.g) return t;
        const i = W.next[t.g];
        return {
            x: i.x + t.x,
            y: i.y + t.y,
            z: i.z + t.z,
            w: t.w,
            h: t.h
        }
    },
    init() {
        s.F.C((() => {
            s.L.init(), s.P.init()
        }))
    },
    B() {
        const t = localStorage.getItem("2024_sd_elevator.save");
        return t ? JSON.parse(t) : null
    },
    K(t) {
        localStorage.setItem("2024_sd_elevator.save", JSON.stringify({
            level: t
        }))
    }
};
window.addEventListener("load", (() => s.init())), s.F = {
    U: {
        s_note1: ["I'm leaving this note for whoever gets lost", "here as well. Stuck in this cursed elevator!", "", "Don't worry, I'm going to leave you some", "tips as I figure this situation out!"],
        s_note2: ["Everything went black and now I'm on", "floor 1 again. My note is also gone.", "", "There is a fellow on floor 3, seems harmless."],
        s_note3: ["Back again, and last note gone again.", "", "Floor 9 is now available. Progress?"],
        s_note4: ["Found a note book with torn pages. I guess", "this is from that note writer.", "", "Rest in peace.", "Lets continue the tradition.", "", "Here's a survival tip: You can close the doors.", 'Just hit the "><" button.'],
        s_note5a: new Array(22).fill("NO MORE REPEATS NO MORE REPEATS"),
        s_note5b: ["SICK OF PAIN! NO MORE BITING!", "", "STAY HERE, KEEP THE DOORS CLOSED", "FOREVER?", "", "OR CAN I HIDE BETTER IN THE DARK?"],
        s_note5c: ["WHERE IS THE BUTTON?!"],
        s_note6: ["Lost my note book", "Is 01 finally the way out?", "Hope"],
        blue1: ["Please go. Leave me alone."],
        blue2: ["Go! Don't let it find me."],
        blue3: ["not...alone"],
        blue4: ["It won't find me here, right? Why come back?", "Oh, it smells rotten... Please go. Leave me alone."],
        pink1: ["Join us? Safe together. Step out the elevator.", "Let us huddle together."],
        pink2: ["Offer still stands. Always welcome."]
    },
    l: {},
    G() {
        for (let t = 0; t < 14; t++) {
            const i = "s_lbl_btn" + t,
                e = 0 == t ? "><" : String(t).padStart(2, "0"),
                [h, n] = s.P.H(100, 70, i);
            n.font = "600 32px " + s.O, n.textBaseline = "middle", n.fillStyle = "#444", n.fillText(e, 50, 37), this.l[i] = h
        }
    },
    V() {
        const t = Math.round(70.7),
            i = s.P.H(50, t, "paper")[0];
        pxtex(i, 0, 0, 95, 3, 50, t), this.l.J = i
    },
    $() {
        const t = s.P.H(200, 300, "wall")[0];
        pxtex(t, 0, 0, 20, 3, 200, 300), this.l.Y = t;
        const i = s.P.H(200, 200, "ceil")[0];
        pxtex(i, 0, 0, 60, 3, 200, 200), this.l.ceil = i;
        const e = s.P.H(200, 200, "floor")[0];
        pxtex(e, 0, 0, 10, 1, 200, 200), this.l.floor = e;
        const h = s.P.H(40, 300, "fs")[0];
        pxtex(h, 0, 0, 20, 3, 40, 300), this.l.X = h;
        const n = s.P.H(200, 75, "ft")[0];
        pxtex(n, 0, 0, 20, 3, 200, 75), this.l.j = n;
        const [o, r] = s.P.H(100, 100, "blood");
        r.fillStyle = "#500", r.beginPath(), r.ellipse(50, 50, 50, 50, 0, 0, 2 * Math.PI), r.fill(), this.l.q = o;
        for (let t = 2; t < 7; t++) {
            const [i, e] = s.P.H(100, 50, "counter" + t);
            e.fillStyle = "#999", e.strokeStyle = "#999", e.fillRect(10, 0, 5, 50), e.fillRect(20, 0, 5, 50), t > 2 && e.fillRect(30, 0, 5, 50), t > 3 && e.fillRect(40, 0, 5, 50), t > 4 && (e.lineWidth = 5, e.beginPath(), e.moveTo(0, 30), e.lineTo(55, 20), e.stroke()), t > 5 && e.fillRect(60, 0, 5, 50), this.l[i.id] = i
        }
    },
    Z() {
        const [t, i] = s.P.H(800, 160, "title");
        i.fillStyle = "#f00", i.font = "600 72px " + s.N, i.fillText(s.S, 400, 80), this.l.title = t
    },
    tt(t, i) {
        const e = "audio:" + t + i;
        if (this.l[e]) return this.l[e];
        const [h, n] = s.P.H(400, 200, e);
        return n.fillStyle = "#" + i, n.font = "64px " + s.O, n.textBaseline = "middle", n.fillText(String(t), 200, 106), this.l[e] = h, h
    },
    it(t) {
        const i = "dis:" + t;
        if (this.l[i]) return this.l[i];
        const e = 200,
            [h, n] = s.P.H(e, 100, i);
        return n.fillStyle = "#d00", n.fillRect(0, 0, e, 100), n.fillStyle = "#fff", n.font = "64px " + s.O, n.textAlign = "left", n.textBaseline = "middle", n.fillText(String(t).padStart(2, "0"), 64, 56), this.l[i] = h, h
    },
    st(t, i) {
        const e = "eyes:" + t + i;
        if (this.l[e]) return this.l[e];
        const [h, n] = s.P.H(200, 50, e);
        return n.fillStyle = "#" + i, n.font = "600 42px " + s.A, n.textBaseline = "middle", n.fillText(String(t), 100, 25), this.l[e] = h, h
    },
    et(t, i) {
        const e = "note:" + t;
        if (this.l[e]) return this.l[e];
        const h = this.U[t],
            [n, o] = s.P.H(200, 282.8, e);
        o.drawImage(this.l.J, 0, 0, 200, 282.8), o.fillStyle = i || "#000", o.font = "9px " + s.O, o.textAlign = "left", o.textBaseline = "top";
        for (let t = 0; t < h.length; t++) o.fillText(h[t], 10, 10 + 12 * t);
        return this.l[e] = n, n
    },
    C(t) {
        this.Z(), this.G(), this.$(), this.V(), t()
    }
}, s.Audio = {
    ht: [.3, 0, 626, , .01, .01, , 2.2, , , , , , , , .1, .01, .79, .02],
    nt: [.8, 0, 783.99, .07, , 1.6, 1, 2, , , , , , , , , , .3, .15],
    ot: [.4, 0, 164.8138, .2, 1.1, .2, 3, 4, , , , , , , , .1, , , .5, , -562],
    rt: [.1, 0, 146.8324, .2, 2, .3, 1, 2, , , , , , 3],
    ERROR: [.3, 0, 71, , .02, .05, 3, .2, , 68, , , , , , , .01, .96, .02, , 389],
    lt: [.2, 0, 453, , .07, .008, 4, 1.6, -6, -2, , , , .4, , .4, .02, .55, .04, , 1424],
    Wt: [.5, 0, 427, .01, .02, .02, 1, 3.7, , 12, 138, .03, , .1, 180, 1, , .97, .01],
    dt: [2.1, 0, 453, .03, .03, .16, 4, 3.7, -1, , , , , .2, 1.3, .2, .1, .52, .07],
    play(t, s, e) {
        t = t.slice(), s && (t[4] = s - (t[3] || 0) - (t[5] || 0) - (t[18] || 0)), e && (t[0] = e), ((t = 1, s = .05, e = 220, h = 0, n = 0, o = .1, r = 0, l = 1, W = 0, a = 0, d = 0, c = 0, u = 0, f = 0, _ = 0, x = 0, y = 0, p = 1, g = 0, m = 0, b = 0) => {
            let w = Math,
                z = 2 * w.PI,
                v = 44100,
                M = W *= 500 * z / v / v,
                k = e *= (1 - s + 2 * s * w.random(s = [])) * z / v,
                T = 0,
                A = 0,
                E = 0,
                O = 1,
                N = 0,
                D = 0,
                R = 0,
                S = b < 0 ? -1 : 1,
                I = z * S * b * 2 / v,
                C = w.cos(I),
                F = w.sin,
                L = F(I) / 4,
                P = 1 + L,
                B = -2 * C / P,
                K = (1 - L) / P,
                U = (1 + S * C) / 2 / P,
                G = -(S + C) / P,
                H = U,
                V = 0,
                J = 0,
                $ = 0,
                Y = 0;
            for (a *= 500 * z / v ** 3, _ *= z / v, d *= z / v, c *= v, u = v * u | 0, t *= .3, S = (h = v * h + 9) + (g *= v) + (n *= v) + (o *= v) + (y *= v) | 0; E < S; s[E++] = R * t) ++D % (100 * x | 0) || (R = r ? 1 < r ? 2 < r ? 3 < r ? F(T ** 3) : w.max(w.min(w.tan(T), 1), -1) : 1 - (2 * T / z % 2 + 2) % 2 : 1 - 4 * w.abs(w.round(T / z) - T / z) : F(T), R = (u ? 1 - m + m * F(z * E / u) : 1) * (R < 0 ? -1 : 1) * w.abs(R) ** l * (E < h ? E / h : E < h + g ? 1 - (E - h) / g * (1 - p) : E < h + g + n ? p : E < S - y ? (S - E - y) / o * p : 0), R = y ? R / 2 + (y > E ? 0 : (E < S - y ? 1 : (S - E) / y) * s[E - y | 0] / 2 / t) : R, b && (R = Y = H * V + G * (V = J) + U * (J = R) - K * $ - B * ($ = Y))), I = (e += W += a) * w.cos(_ * A++), T += I + I * f * F(E ** 5), O && ++O > c && (e += d, k += d, O = 0), !u || ++N % u || (e = k, W = M, O = O || 1);
            (t = i.createBuffer(1, S, v)).getChannelData(0).set(s), (e = i.createBufferSource()).buffer = t, e.connect(i.destination), e.start()
        })(...t)
    },
    text(t, i, e, h) {
        const n = s.F.tt(t, i),
            o = .01 * e;
        W.plane({
            n: n.id,
            g: h.g,
            x: h.x,
            y: h.y + .05,
            z: h.z + .08,
            w: .4,
            h: .2,
            t: n,
            ns: 1
        }), W.move({
            n: n.id,
            y: h.y + .05 + o,
            a: 1e3 * e,
            onAnimDone: () => W.delete(n.id)
        })
    }
}, s.L = {
    ct: {
        ut: 1,
        ft: 2,
        _t: 3,
        xt: 10,
        yt: 11,
        gt: 12,
        bt: 13
    },
    wt: {},
    zt: {},
    vt: {},
    Mt: {},
    kt() {
        this.Tt = {
            [this.ct.ut]: {
                keyboard: ["Escape", "Digit1"]
            },
            [this.ct.yt]: {
                keyboard: ["ArrowUp", "KeyW", "KeyZ", "KeyY"]
            },
            [this.ct.xt]: {
                keyboard: ["ArrowLeft", "KeyA", "KeyQ"]
            },
            [this.ct.bt]: {
                keyboard: ["ArrowDown", "KeyS"]
            },
            [this.ct.gt]: {
                keyboard: ["ArrowRight", "KeyD"]
            },
            [this.ct.ft]: {
                keyboard: ["KeyE", "Enter"]
            }
        }
    },
    At() {
        let t = 0,
            i = 0;
        return this.Et(this.ct.xt) ? t = -1 : this.Et(this.ct.gt) && (t = 1), this.Et(this.ct.yt) ? i = -1 : this.Et(this.ct.bt) && (i = 1), {
            x: t,
            y: i
        }
    },
    Ot(t) {
        return this.Tt[t]
    },
    init() {
        this.kt(), this.Nt()
    },
    Et(t, i) {
        const s = this.Ot(t);
        for (const t of s.keyboard)
            if (this.Dt(t, i)) return !0;
        return !1
    },
    Dt(t, i) {
        const s = this.Mt[t];
        return !(!s || !s.time) && (i && (s.time = 0, s.Rt = !0), !0)
    },
    St(t, i) {
        const s = this.zt[t] || [];
        s.push(i), this.zt[t] = s
    },
    It(t, i) {
        const s = this.vt[t] || [];
        s.push(i), this.vt[t] = s
    },
    Nt() {
        document.body.onkeydown = t => {
            const i = this.Mt[t.code];
            i && i.Rt || (this.Mt[t.code] = {
                time: Date.now()
            }, this.zt[t.code] && this.zt[t.code].forEach((t => t())))
        }, document.body.onkeyup = t => {
            this.Mt[t.code] = {
                time: 0
            }, this.vt[t.code] && this.vt[t.code].forEach((t => t()))
        }
    }
}, s.P = {
    camera: {
        rx: 0,
        ry: 0
    },
    Ct: !1,
    Ft: null,
    Lt: null,
    Pt: null,
    Bt: null,
    Kt: new DOMPoint(0, 0, -1),
    Ut: 0,
    Gt() {
        let t = [];
        const i = this.Ht(),
            s = {
                min: [],
                max: []
            };
        for (const e in W.next) {
            if (!e.startsWith("s_")) continue;
            const h = W.next[e];
            let n = 0;
            if ("plane" != h.type && (n = h.d), s.min[0] = h.x - h.w / 2, s.min[1] = h.y - h.h / 2, s.min[2] = h.z - n / 2, h.g) {
                const t = W.next[h.g];
                s.min[0] += t.x, s.min[1] += t.y, s.min[2] += t.z
            }
            s.max[0] = s.min[0] + h.w, s.max[1] = s.min[1] + h.h, s.max[2] = s.min[2] + n, 90 != h.ry && -90 != h.ry || (s.min[0] -= h.w / 2, s.max[0] += h.w / 2, s.min[2] -= h.w / 2, s.max[2] += h.w / 2);
            const o = this.Vt(i, s);
            o && t.push([h, o])
        }
        const e = this.Jt(i.origin, t);
        return !e?.n.startsWith("s__") && e
    },
    $t(t, i) {
        const e = Math.round(Math.min(735.28, window.innerHeight - 40)),
            h = (this.Lt.width - 520) / 2,
            n = (this.Lt.height - e) / 2;
        this.Bt.drawImage(s.F.l.J, h, n, 520, e), this.Bt.fillStyle = i || "#000", this.Bt.font = "24px " + s.O, this.Bt.textAlign = "left", this.Bt.textBaseline = "top";
        for (let i = 0; i < t.length; i++) this.Bt.fillText(t[i], h + 20, n + 20 + 32 * i)
    },
    Yt() {
        this.Bt.fillStyle = "#00000070", this.Bt.fillRect(0, 0, this.Lt.width, this.Lt.height), this.Bt.fillStyle = "#fff", this.Bt.font = "96px " + s.N, this.Bt.textAlign = "center", this.Bt.textBaseline = "middle", this.Bt.fillText("PAUSED", this.Lt.width / 2, this.Lt.height / 2)
    },
    Jt(t, i) {
        if (1 == i.length) return i[0][0];
        let s = null,
            e = 1 / 0;
        for (let h = 0; h < i.length; h++) {
            const n = i[h][1],
                o = [n[0] - t[0], n[1] - t[1], n[2] - t[2]],
                r = Math.sqrt(o[0] * o[0] + o[1] * o[1] + o[2] * o[2]);
            r < e && (s = i[h][0], e = r)
        }
        return s
    },
    H(t, i, s) {
        const e = document.createElement("canvas");
        e.width = t, e.height = i, s && (e.id = s);
        const h = e.getContext("2d", {
            alpha: !0
        });
        return h.imageSmoothingEnabled = !1, h.textAlign = "center", [e, h]
    },
    Ht() {
        const t = W.next.camera,
            i = (new DOMMatrix).rotateSelf(t.rx, t.ry, t.rz),
            s = {
                origin: [t.x, t.y, t.z],
                dir: this.Kt.matrixTransform(i)
            };
        return s.dir = [s.dir.x, s.dir.y, s.dir.z], s
    },
    init() {
        this.Ft = document.getElementById("c"), this.Lt = document.getElementById("ui"), this.Bt = this.Lt.getContext("2d", {
            alpha: !0
        }), this.Bt.imageSmoothingEnabled = !1, this.resize(), W.onDraw = this.update.bind(this), W.reset(this.Ft), W.clearColor("000"), W.T(.2), this.Nt(), this.level = new s.Xt
    },
    Vt(t, i) {
        let s = !0,
            e = [],
            h = [],
            n = [],
            o = [];
        for (let h = 0; h < 3; h++) t.origin[h] < i.min[h] ? (e[h] = 1, n[h] = i.min[h], s = !1) : t.origin[h] > i.max[h] ? (e[h] = 0, n[h] = i.max[h], s = !1) : e[h] = 2;
        if (s) return t.origin;
        for (let i = 0; i < 3; i++) 2 != e[i] && 0 != t.dir[i] ? h[i] = (n[i] - t.origin[i]) / t.dir[i] : h[i] = -1;
        let r = 0;
        for (let t = 1; t < 3; t++) h[r] < h[t] && (r = t);
        if (h[r] < 0) return null;
        for (let s = 0; s < 3; s++)
            if (r != s) {
                if (o[s] = t.origin[s] + h[r] * t.dir[s], o[s] < i.min[s] || o[s] > i.max[s]) return null
            } else o[s] = n[s];
        return o
    },
    pause() {
        this.W = !0, document.body.classList.add("p"), W.W = !0
    },
    Nt() {
        this.jt = null, this.qt = null;
        const t = .4;
        let i = !1;
        window.addEventListener("resize", (t => this.resize()));
        const e = s.L.Ot(s.L.ct.ut),
            h = () => {
                this.Qt(), this.jt = null, this.qt = null
            };
        e.keyboard.forEach((t => s.L.It(t, h))), this.Ft.addEventListener("mousedown", (t => {
            0 === t.button && this.level && this.level.Zt()
        })), this.Ft.addEventListener("mouseenter", (t => {
            this.level && !this.Ct && (this.jt = t.clientX, this.qt = t.clientY)
        })), this.Ft.addEventListener("mousemove", (s => {
            if (this.level && !this.W && !this.Ct) {
                if (i) this.camera.rx -= s.movementY * t, this.camera.ry -= s.movementX * t;
                else {
                    if (null === this.jt) return this.jt = s.clientX, void(this.qt = s.clientY);
                    this.camera.rx -= (s.clientY - this.qt) * t, this.camera.ry -= (s.clientX - this.jt) * t
                }
                this.camera.rx = Math.min(80, Math.max(-60, this.camera.rx)), this.camera.ry = this.camera.ry % 360, W.camera(this.camera), this.jt = s.clientX, this.qt = s.clientY
            }
        })), document.addEventListener("pointerlockchange", (() => {
            i = !!document.pointerLockElement
        })), s.L.It("KeyP", (() => {
            i ? (i = !1, document.exitPointerLock()) : this.Ft.requestPointerLock()
        })), s.L.It("KeyR", (() => {
            this.Ct || (this.camera.rx = 0, this.camera.ry = 0, W.camera(this.camera))
        }))
    },
    resize() {
        const t = 4 / 3;
        let i = window.innerWidth,
            s = window.innerHeight;
        i > s ? (s -= 40, i = Math.round(Math.min(i, s * t))) : i < s && (i -= 40, s = Math.round(Math.min(s, i * t))), this.Ft.width = i, this.Ft.height = s, this.Lt.width = i, this.Lt.height = s, W.next?.camera && (W.camera({
            fov: W.next.camera.fov
        }), W.gl.viewport(0, 0, i, s))
    },
    Qt() {
        this.W ? this.unpause() : this.pause()
    },
    unpause() {
        this.W = !1, document.body.classList.remove("p"), W.W = !1
    },
    update(t = 0) {
        if (t && this.ti) {
            const i = (t - this.ti) / (1e3 / s.R);
            if (this.Bt.clearRect(0, 0, this.Lt.width, this.Lt.height), this.Bt.imageSmoothingEnabled = !1, this.W) return void this.Yt();
            if (this.Ut += i, this.level.update(i), !this.Ct) {
                const t = .3;
                s.L.Et(s.L.ct.yt) ? this.camera.rx += t : s.L.Et(s.L.ct.bt) && (this.camera.rx -= t), s.L.Et(s.L.ct.xt) ? this.camera.ry += t : s.L.Et(s.L.ct.gt) && (this.camera.ry -= t), this.camera.rx = Math.min(80, Math.max(-60, this.camera.rx)), this.camera.ry = this.camera.ry % 360, W.camera(this.camera)
            }
        }
        this.ti = t
    }
}, s.ii = {
    si: 0,
    S: 1,
    ei: 2,
    hi: 3,
    ni: 4,
    oi: 5,
    ri: 6
}, s.li = {
    OPEN: 1,
    OPENING: 2,
    CLOSED: 3,
    CLOSING: 4,
    IDLE: 5,
    Wi: 6
}, s.Xt = class {
    constructor() {
        this.ai = 0, this.di = !0, this.ci = [], this.Ut = 0, this.ui = [], this.fi = s.li.OPEN, this._i = s.li.IDLE, this.xi = 1, this.yi = this.xi, this.pi = [], this.gi = 1, this.loop = 1, this.mi = 2.5, this.bi = 3, this.wi = 2, W.light({
            y: this.bi / 2 - .2
        }), W.plane({
            n: "title",
            x: .02,
            z: -2,
            w: 1.5,
            h: .3,
            b: "f00",
            t: s.F.l.title
        }), W.group({
            n: "ev"
        }), this.zi(), this.Mi(), this.ki(), this.Ti(), this.Ai(), this.Ei(), this.Oi(), this.Ni(this.xi), this.Di(this.loop), this.Ri(this.xi), this.Si(s.ii.S)
    }
    ki() {
        const t = .25,
            i = this.bi / 2 - t - .15,
            s = -this.wi / 2 + .06;
        W.plane({
            n: "dis",
            y: i,
            z: s,
            w: .5,
            h: t,
            b: "f00"
        }), W.cube({
            x: -.25,
            y: i,
            z: s,
            w: .05,
            h: t,
            d: .01,
            b: "766",
            s: 30
        }), W.cube({
            x: .25,
            y: i,
            z: s,
            w: .05,
            h: t,
            d: .01,
            b: "766",
            s: 30
        })
    }
    Mi() {
        const t = this.mi / 2,
            i = .05;
        this.Ii = t / 2 + .002, this.Ci = this.Ii + this.mi / 2 - this.mi / 3.5, W.group({
            n: "dlg",
            g: "ev",
            x: -this.Ci,
            z: -this.wi / 2
        }), W.cube({
            g: "dlg",
            w: t,
            h: this.bi,
            d: i,
            b: "aaa",
            s: 20
        }), W.group({
            n: "drg",
            g: "ev",
            x: this.Ci,
            z: -this.wi / 2
        }), W.cube({
            g: "drg",
            w: t,
            h: this.bi,
            d: i,
            b: "aaa",
            s: 20
        }), this.Fi = t / 4, W.plane({
            n: "s_note1",
            g: "drg",
            x: (this.Fi - t) / 2 + .1,
            y: -.1,
            z: .025 + .001,
            w: this.Fi,
            h: 1.414 * this.Fi,
            rz: -10,
            t: s.F.et("s_note1")
        })
    }
    Ti() {
        const t = "pad";
        W.group({
            n: t,
            g: "ev",
            x: this.mi / 2 - .3,
            y: -.175,
            z: -this.wi / 2 + .051
        }), W.plane({
            g: t,
            w: .3,
            h: .7,
            b: "bbb",
            s: 20
        });
        const i = .02,
            e = .1,
            h = .07,
            n = (e + i) / 2;
        for (let o = 0; o < 14; o++) {
            const r = "btn" + o,
                l = o % 2 * (i + e) - n,
                a = ~~(o / 2) * (i + h) - .27,
                d = s.F.l["s_lbl_" + r];
            W.cube({
                g: t,
                n: r,
                x: l,
                y: a,
                w: e,
                h,
                d: .02,
                b: "ddd"
            }), W.plane({
                g: t,
                n: "s_lbl_" + r,
                x: l,
                y: a,
                z: .011,
                w: e,
                h,
                t: d
            }), 13 == o && (this.Li = JSON.parse(JSON.stringify(W.next[r])), this.Li.b = "aaa", this.Pi = JSON.parse(JSON.stringify(W.next["s_lbl_" + r])), this.Pi.t = d)
        }
        delete this.Li.v, delete this.Pi.v
    }
    zi() {
        const t = "ev";
        W.group({
            n: t,
            g: "ev"
        }), W.plane({
            g: t,
            y: -this.bi / 2,
            w: this.mi,
            h: this.wi,
            rx: -90,
            b: "555",
            t: s.F.l.floor,
            mix: .3
        }), W.plane({
            g: t,
            y: this.bi / 2,
            w: this.mi,
            h: this.wi,
            rx: 90,
            b: "999",
            t: s.F.l.ceil,
            s: 30,
            mix: .4
        }), W.cube({
            g: t,
            x: -this.mi / 2,
            y: -this.bi / 2,
            w: .02,
            h: .1,
            d: this.wi,
            b: "777"
        }), W.cube({
            g: t,
            x: this.mi / 2,
            y: -this.bi / 2,
            w: .02,
            h: .1,
            d: this.wi,
            b: "777"
        }), W.cube({
            g: t,
            y: -this.bi / 2,
            z: this.wi / 2,
            w: this.mi,
            h: .1,
            d: .02,
            b: "777"
        }), W.cube({
            g: t,
            x: -this.mi / 2,
            y: -this.bi / 2,
            z: -this.wi / 2 + .05,
            w: this.mi / 2.25,
            h: .1,
            d: .02,
            b: "777"
        }), W.cube({
            g: t,
            x: this.mi / 2,
            y: -this.bi / 2,
            z: -this.wi / 2 + .05,
            w: this.mi / 2.25,
            h: .1,
            d: .02,
            b: "777"
        }), W.plane({
            g: t,
            x: -this.mi / 2,
            ry: 90,
            w: this.wi,
            h: this.bi,
            b: "999",
            t: s.F.l.Y,
            s: 30,
            mix: .4
        }), W.plane({
            g: t,
            x: this.mi / 2,
            ry: -90,
            w: this.wi,
            h: this.bi,
            b: "999",
            t: s.F.l.Y,
            s: 30,
            mix: .4
        }), W.plane({
            g: t,
            z: this.wi / 2,
            ry: 180,
            w: this.mi,
            h: this.bi,
            b: "999",
            t: s.F.l.Y,
            s: 30,
            mix: .4
        }), W.cube({
            g: t,
            x: -this.mi / 2 + .02,
            y: -this.bi / 5,
            z: .025,
            w: .04,
            h: .15,
            d: this.wi - .15,
            b: "aaa",
            s: 30
        }), W.cube({
            g: t,
            x: this.mi / 2 - .02,
            y: -this.bi / 5,
            z: .025,
            w: .04,
            h: .15,
            d: this.wi - .15,
            b: "aaa",
            s: 30
        }), W.cube({
            g: t,
            y: -this.bi / 5,
            z: this.wi / 2 - .02,
            w: this.mi - .15,
            h: .15,
            d: .04,
            b: "aaa",
            s: 30
        }), W.cube({
            g: t,
            n: "s__fl",
            x: -(this.mi - this.mi / 4.5) / 2,
            z: -this.wi / 2,
            w: this.mi / 4.5,
            h: this.bi,
            d: .1,
            b: "999",
            t: s.F.l.X,
            s: 30,
            mix: .4
        }), W.cube({
            g: t,
            n: "s__fr",
            x: (this.mi - this.mi / 4.5) / 2,
            z: -this.wi / 2,
            w: this.mi / 4.5,
            h: this.bi,
            d: .1,
            b: "999",
            t: s.F.l.X,
            s: 30,
            mix: .4
        }), W.cube({
            g: t,
            y: (this.bi - this.bi / 4) / 2,
            z: -this.wi / 2,
            w: this.mi,
            h: this.bi / 4,
            d: .1,
            b: "999",
            t: s.F.l.j,
            s: 30,
            mix: .4
        })
    }
    Ai() {
        W.plane({
            n: "plane",
            y: -this.bi / 2 - .002,
            z: -this.wi / 2 - 10,
            w: 30,
            h: 20,
            rx: 90,
            rz: 180,
            b: "111"
        }), W.plane({
            n: "e_red",
            y: .8,
            z: 100,
            w: .5,
            h: .125,
            t: s.F.st("•   •", "f00"),
            ns: 1
        }), W.plane({
            n: "e_blue",
            x: .6,
            y: -.4,
            z: 100,
            w: .5,
            h: .125,
            rx: 30,
            ry: -45,
            t: s.F.st("•  •", "77f"),
            ns: 1
        }), W.group({
            n: "e_pink_all",
            z: 100
        }), W.plane({
            g: "e_pink_all",
            n: "e_pink1",
            x: .4,
            y: .6,
            w: .7,
            h: .175,
            t: s.F.st("•   •", "f2c"),
            ns: 1
        }), W.plane({
            g: "e_pink_all",
            n: "e_pink2",
            x: .7,
            y: .2,
            w: .5,
            h: .125,
            ry: 20,
            t: s.F.st("•  •", "f2c")
        }), W.plane({
            g: "e_pink_all",
            n: "e_pink3",
            x: .9,
            y: -.1,
            w: .5,
            h: .125,
            ry: 20,
            t: s.F.st("•   •", "f2c")
        }), W.plane({
            g: "e_pink_all",
            n: "e_pink4",
            x: 1.3,
            y: .1,
            w: .4,
            h: .1,
            ry: 20,
            rx: -10,
            t: s.F.st("•  •", "f2c")
        }), W.plane({
            g: "e_pink_all",
            n: "e_pink10",
            x: 1.1,
            y: .4,
            w: .5,
            h: .125,
            ry: 20,
            rx: -10,
            t: s.F.st("•  •", "f2c")
        }), W.plane({
            g: "e_pink_all",
            n: "e_pink11",
            x: .2,
            y: -.05,
            w: .4,
            h: .1,
            ry: 20,
            t: s.F.st("•   •", "f2c")
        }), W.plane({
            g: "e_pink_all",
            n: "e_pink5",
            x: -.5,
            y: .3,
            w: .5,
            h: .125,
            ry: -20,
            t: s.F.st("•  •", "f2c")
        }), W.plane({
            g: "e_pink_all",
            n: "e_pink6",
            x: -.8,
            w: .4,
            h: .1,
            ry: -20,
            t: s.F.st("•   •", "f2c")
        }), W.plane({
            g: "e_pink_all",
            n: "e_pink7",
            x: -1.2,
            y: .2,
            w: .6,
            h: .15,
            ry: -20,
            t: s.F.st("•  •", "f2c")
        }), W.plane({
            g: "e_pink_all",
            n: "e_pink8",
            x: -1.4,
            y: -.2,
            w: .5,
            h: .125,
            ry: -20,
            t: s.F.st("•   •", "f2c")
        }), W.plane({
            g: "e_pink_all",
            n: "e_pink9",
            x: -1.3,
            y: .6,
            w: .5,
            h: .125,
            ry: -20,
            t: s.F.st("•   •", "f2c")
        })
    }
    Oi() {
        const t = "fff",
            i = .005;
        W.group({
            n: "hl"
        }), W.cube({
            n: "hl_t",
            g: "hl",
            size: i,
            b: t,
            ns: 1
        }), W.cube({
            n: "hl_r",
            g: "hl",
            size: i,
            b: t,
            ns: 1
        }), W.cube({
            n: "hl_b",
            g: "hl",
            size: i,
            b: t,
            ns: 1
        }), W.cube({
            n: "hl_l",
            g: "hl",
            size: i,
            b: t,
            ns: 1
        })
    }
    Ei() {
        W.plane({
            n: "loops",
            g: "drg",
            x: -.48,
            y: .4,
            z: 100,
            w: .18,
            h: .09,
            rz: 5,
            t: s.F.l.Bi,
            mix: 0
        })
    }
    Ki() {
        if (this.Ut - this.ai > .05 * s.R) {
            this.ai = this.Ut;
            const t = s.P.Gt();
            if (t && t.n != this.Gi?.Ui) {
                let i = t.n;
                i.startsWith("s_lbl_btn") && (i = i.substring(6));
                W.next[i] && (this.Gi = {
                    Ui: t.n,
                    n: i
                })
            } else !t && this.Gi && (this.Gi = null)
        }
        if (this.Hi(this.Gi), this.Gi) {
            if (this.Vi(this.Gi.n) || "btn13" == this.Gi.n && !this.Ji) {
                const t = s.P.Lt,
                    i = s.P.Bt;
                i.fillStyle = "#fff7", i.font = "18px " + s.O, i.textAlign = "center", i.fillText("[E] / LEFT-CLICK TO INTERACT", t.width / 2, t.height - 42)
            }
            s.L.Et(s.L.ct.ft, !0) && this.$i()
        }
    }
    Zt() {
        this.note ? this.note = null : this.$i()
    }
    Yi(t) {
        const i = this.loop,
            e = this.ui.includes(13);
        let h = s.ii.si;
        if (1 == i) 13 == t && (h = s.ii.ni);
        else if (2 == i) e || this.Xi(13), 3 == t ? W.move({
            n: "e_blue",
            rx: 0,
            ry: 0,
            a: 500,
            onAnimDone: () => {
                this.ci.push({
                    duration: 2,
                    ji: t => (this.qi(s.F.U.blue1, W.next.e_blue, "77f", t), t > 2 || 3 != this.xi)
                }), W.move({
                    n: "e_blue",
                    rx: 30,
                    ry: -45,
                    a: 2e3
                })
            }
        }) : 13 == t && (h = s.ii.ni);
        else if (3 == i)
            if (!e && this.Qi([3, 9]) && this.Xi(13), 3 == t) {
                const t = {
                    x: W.next.e_blue.x,
                    y: W.next.e_blue.y,
                    z: W.next.e_blue.z,
                    h: W.next.e_blue.h
                };
                this.ci.push({
                    duration: 2,
                    ji: i => (this.qi(s.F.U.blue2, t, "77f", i), this._i == s.li.Wi)
                })
            } else if (9 == t) {
            const t = W.next.e_pink1.y;
            let i = 0,
                e = 0,
                h = 0;
            this.ci.push({
                duration: 5,
                ji: t => (this.qi(s.F.U.pink1, W.next.e_pink1, "f2c", t), t > 1)
            }, {
                duration: 10,
                ji: i => {
                    const e = (Math.sin(10 * Math.PI * i) + 1) / 2;
                    return W.move({
                        n: "e_pink1",
                        y: t - .025 * e,
                        rx: 40 * e
                    }), i > 1 || this._i == s.li.Wi
                }
            }, {
                duration: 1,
                ji: t => {
                    const n = Math.round(5 * t);
                    if (h >= n) return;
                    if (h = n, i && W.move({
                            n: "e_pink" + i,
                            z: e
                        }), Math.random() < .8) return void(i = 0);
                    const o = n % 10 + 2;
                    return i = o, e = W.next["e_pink" + o].z, W.move({
                        n: "e_pink" + o,
                        z: 100
                    }), this._i == s.li.Wi
                }
            })
        } else 13 == t && (h = s.ii.ni);
        else if (4 == i)
            if (!e && this.Qi([3, 6, 9]) && this.Xi(13), 3 == t) this.ci.push({
                duration: 2,
                ji: t => (this.qi(s.F.U.blue3, W.next.e_blue, "77f", t), t > 1)
            });
            else if (9 == t) {
            let t = 0,
                i = 0,
                e = 0;
            this.ci.push({
                duration: 2,
                ji: t => (this.qi(s.F.U.pink2, W.next.e_pink1, "f2c", t), t > 1)
            }, {
                duration: 1,
                ji: h => {
                    const n = Math.round(5 * h);
                    if (e >= n) return;
                    if (e = n, t && W.move({
                            n: "e_pink" + t,
                            z: i
                        }), Math.random() < .8) return void(t = 0);
                    const o = n % 10 + 2;
                    return t = o, i = W.next["e_pink" + o].z, W.move({
                        n: "e_pink" + o,
                        z: 100
                    }), this._i == s.li.Wi
                }
            })
        } else 13 == t && (h = s.ii.ni);
        else if (5 == i)
            if (!e && this.Qi([3, 9]) && this.Ji && this.Xi(13), 3 == t) this.ci.push({
                duration: 7,
                ji: t => (t > .1 && this.qi(s.F.U.blue4, W.next.e_blue, "3b7", t - .1), t > 1.1)
            });
            else if (9 == t) {
            if (-3 == W.next.e_red.z) {
                const {
                    x: t,
                    y: i,
                    z: s
                } = W.next.e_red;
                W.move({
                    n: "e_red",
                    rx: 0,
                    ry: 0,
                    rz: 0,
                    a: 600,
                    onAnimDone: () => {
                        setTimeout((() => this.Zi(t, i, s)), 1e3)
                    }
                })
            }
        } else 13 == t ? h = s.ii.ni : this.pi.includes(9) && -3 == W.next.e_red.z && setTimeout((() => this.Zi(0, .5, -3)), 100);
        else 6 == i && 1 == t && (h = s.ii.ri);
        this.Si(h)
    }
    ts(t) {
        if (3 == this.loop) {
            if (3 == t) {
                const t = {
                    x: W.next.e_blue.x,
                    y: W.next.e_blue.y,
                    z: W.next.e_blue.z,
                    h: W.next.e_blue.h
                };
                this.ci.push({
                    duration: 2,
                    ji: i => (W.move({
                        n: "e_blue",
                        x: t.x + (Math.random() - .5) / 60,
                        y: t.y + (Math.random() - .5) / 100
                    }), 3 != this.xi)
                })
            }
        } else if (5 == this.loop && 9 == t) {
            const t = [5, 6, 8].map((t => {
                const i = "e_pink" + t;
                return {
                    n: i,
                    x: W.next[i].x,
                    y: W.next[i].y
                }
            }));
            this.ci.push({
                duration: 2,
                ji: i => {
                    const s = [];
                    return t.forEach((t => {
                        s.push({
                            n: t.n,
                            x: t.x + (Math.random() - .5) / 60,
                            y: t.y + (Math.random() - .5) / 100
                        })
                    })), W.move(s), 9 != this.xi
                }
            })
        }
    }
    ss() {
        return [s.li.CLOSING, s.li.OPENING].includes(this.fi)
    }
    es(t) {
        this.fi == s.li.CLOSED || this.ss() ? t?.() : (this.fi = s.li.CLOSING, s.Audio.play(s.Audio.ot), W.move({
            n: "dlg",
            x: -this.Ii,
            a: 2e3
        }), W.move({
            n: "drg",
            x: this.Ii,
            a: 2e3,
            onAnimDone: () => {
                this.fi = s.li.CLOSED, setTimeout((() => t?.()), 800)
            }
        }))
    }
    hs(t) {
        this.fi == s.li.OPEN || this.ss() ? t?.() : (this.fi = s.li.OPENING, setTimeout((() => {
            s.Audio.play(s.Audio.ot), W.move({
                n: "dlg",
                x: -this.Ci,
                a: 2e3
            }), W.move({
                n: "drg",
                x: this.Ci,
                a: 2e3,
                onAnimDone: () => {
                    this.fi = s.li.OPEN, t?.()
                }
            })
        }), 800))
    }
    Xi(t) {
        this.ui.push(t), W.move({
            n: "btn" + t,
            b: "ddd"
        })
    }
    os(t) {
        if (this.fi == s.li.CLOSED) {
            s.Audio.play(s.Audio.dt), s.Audio.text("*thud*", "f00", 3, {
                x: 0,
                y: .1,
                z: -1
            });
            const t = {
                x: W.next.camera.x,
                y: W.next.camera.y,
                z: W.next.camera.z
            };
            return this.ci.push({
                duration: .7,
                ji: i => (W.camera({
                    x: t.x + (2 * Math.random() - 1) / 300,
                    y: t.y + (2 * Math.random() - 1) / 300,
                    z: t.z + (2 * Math.random() - 1) / 300
                }), i > 1)
            }), W.move({
                n: "e_red",
                z: 100
            }), !0
        }
        return t > 1 && this.fi != s.li.CLOSING && (this.Si(s.ii.oi), !0)
    }
    rs(t) {
        if (t)
            if (t.n.startsWith("s_note")) this.note = t.n;
            else if (t.n.startsWith("btn")) {
            if (!this.Vi(t.n) && 5 == this.loop && "btn13" == t.n && !this.Ji) return this.Ji = !0, W.move({
                n: "btn13",
                x: W.next.btn13.x - .2,
                y: W.next.btn13.y + .8,
                z: W.next.btn13.z + .7,
                rx: 0,
                ry: 0,
                rz: 0,
                a: 500,
                onAnimDone: () => {
                    setTimeout((() => {
                        this.Li.a = 1e3, this.Li.onAnimDone = () => {
                            this.Qi([3, 9]) && this.Xi(13)
                        }, this.Pi.a = 1e3, W.move([this.Li, this.Pi])
                    }), 200)
                }
            }), void W.move({
                n: "s_lbl_btn13",
                x: W.next.s_lbl_btn13.x - .2,
                y: W.next.s_lbl_btn13.y + .8,
                z: W.next.s_lbl_btn13.z + .72,
                rx: 0,
                ry: 0,
                rz: 0,
                a: 500
            });
            if (this._i == s.li.IDLE) {
                if (!this.Vi(t.n)) return void s.Audio.play(s.Audio.ERROR);
                s.Audio.play(s.Audio.ht), s.Audio.text("*beep*", "ff0", 1, t);
                const i = Number(t.n.substring(3));
                if (0 == i) return void this.es();
                if (this.xi == i) return void(this.fi == s.li.OPEN ? this.es() : this.hs());
                this.yi = i, this._i = s.li.Wi, this.es((() => this.Si(s.ii.hi)))
            }
        }
    }
    Qi(t) {
        for (let i = 0; i < t.length; i++)
            if (!this.pi.includes(t[i])) return !1;
        return !0
    }
    Hi(t) {
        if ((!t || !this.Vi(t.n)) && (!t || 5 != this.loop || "btn13" != t.n || this.Ji)) return void W.move({
            n: "hl",
            z: 100
        });
        const i = W.next[t.n],
            e = s.I(i),
            h = .005;
        W.move([{
            n: "hl",
            x: e.x,
            y: e.y,
            z: e.z + (i.ry ? 0 : .01),
            rx: i.rx,
            ry: i.ry,
            rz: i.rz
        }, {
            n: "hl_t",
            y: e.h / 2,
            w: e.w,
            h
        }, {
            n: "hl_r",
            x: e.w / 2,
            h: e.h,
            w: h
        }, {
            n: "hl_b",
            y: -e.h / 2,
            w: e.w,
            h
        }, {
            n: "hl_l",
            x: -e.w / 2,
            h: e.h,
            w: h
        }])
    }
    Vi(t) {
        return !t.startsWith("btn") || this.ui.includes(Number(t.replace("btn", "")))
    }
    ls() {
        return this.Ws == s.ii.S || (2 == this.loop && 13 == this.xi || (3 == this.loop && 13 == this.xi || (4 == this.loop && 9 == this.xi || 5 == this.loop)))
    }
    ds(t) {
        W.camera({
            x: 0,
            y: 0,
            z: 0
        }), W.light({
            i: 1
        }), this.loop != t ? this.pi = [] : 5 == this.loop && (this.pi = this.pi.filter((t => 9 != t))), this.loop = t, this.xi = 6 == this.loop ? 13 : 1, this.yi = this.xi, this.Ni(this.xi), this.Di(t), this.Ri(this.xi), this.Gi = null
    }
    Ri(t) {
        const i = this.loop,
            s = [],
            e = {
                n: "e_red",
                y: .8,
                z: 100
            },
            h = {
                n: "e_blue",
                y: 0,
                z: 100,
                rx: 0
            },
            n = {
                n: "e_pink_all",
                z: 100
            };
        if (W.next.dialog && s.push({
                n: "dialog",
                z: 100
            }), this.cs = 0, 1 == i) 13 == t && (e.z = -8);
        else if (2 == i) 3 == t ? h.z = -3.5 : 13 == t && (e.z = -4.5);
        else if (3 == i) 3 == t ? h.z = -3.5 : 9 == t ? n.z = -3 : 13 == t && (e.z = -2.5);
        else if (4 == i) {
            const i = {
                    n: "s_note4",
                    z: 100
                },
                o = {
                    n: "blood6",
                    z: 100
                };
            3 == t ? (h.y = -1, h.z = -3.5, h.rx = -90) : 6 == t ? (i.z = -1.8, o.z = -2.5) : 9 == t && (n.z = -3, e.x = W.next.e_pink7.x, e.y = W.next.e_pink7.y, e.z = -3, s.push({
                n: "e_pink7",
                z: 100
            })), s.push(i, o)
        } else if (5 == i) {
            let i = 100;
            3 == t ? h.z = -3 : 9 == t ? (n.z = -3, s.push({
                n: "e_pink5",
                x: -.5,
                y: .2,
                z: 0,
                ry: -30
            }), s.push({
                n: "e_pink6",
                y: -.1,
                z: 0,
                ry: -30
            }), s.push({
                n: "e_pink8",
                x: -1.1,
                y: .1,
                z: 0,
                ry: -30
            }), this.pi.includes(9) || (e.x = .7, e.z = -3, e.ry = 30)) : 8 == t && (i = -.22), ![3, 9, 13].includes(t) && this.pi.includes(9) && Math.random() < .4 && (e.x = 0, e.y = .5, e.z = -3), this.Ji || (s.push({
                n: "btn13",
                x: -.7,
                y: -1.2,
                z: i,
                rx: -90,
                ry: 10
            }), s.push({
                n: "s_lbl_btn13",
                x: -.7,
                y: -1.189,
                z: i,
                rx: -90,
                ry: 10
            }))
        } else 6 == i && 1 == t && W.clearColor("eee");
        s.push(e), s.push(h), s.push(n), W.move(s)
    }
    Di(t) {
        const i = [],
            e = [];
        this.ui = [
            [0, 13],
            [0, 3],
            [0, 3, 9],
            [0, 3, 6, 9],
            [0, 3, 4, 7, 8, 9, 10, 12],
            [1]
        ][t - 1];
        for (let t = 0; t < 14; t++) i.push({
            n: "btn" + t,
            b: this.ui.includes(t) ? "ddd" : "aaa"
        });
        if (this.us(t), 2 == t) W.plane({
            n: "s_note2",
            g: "dlg",
            x: .3,
            y: -.3,
            z: .0251,
            w: this.Fi,
            h: 1.414 * this.Fi,
            rz: 20,
            t: s.F.et("s_note2")
        });
        else if (3 == t) W.plane({
            n: "s_note3",
            x: this.mi / 2 - .03,
            y: -.2,
            z: -.1,
            w: this.Fi,
            h: 1.414 * this.Fi,
            ry: -90,
            t: s.F.et("s_note3")
        });
        else if (4 == t) this.gi = .9, W.plane({
            n: "s_note4",
            x: -.1,
            y: -this.bi / 2,
            w: this.Fi,
            h: 1.414 * this.Fi,
            rx: -90,
            ry: 5,
            t: s.F.et("s_note4", "#185"),
            b: "000",
            mix: .7
        }), W.group({
            n: "blood6",
            y: -this.bi / 2,
            rx: -90
        }), W.plane({
            g: "blood6",
            w: .2,
            h: .2,
            t: s.F.l.q
        }), W.plane({
            g: "blood6",
            x: -.1,
            y: .3,
            w: .1,
            h: .1,
            t: s.F.l.q
        }), W.plane({
            g: "blood6",
            x: .01,
            y: .5,
            w: .08,
            h: .08,
            t: s.F.l.q
        });
        else if (5 == t) this.Ji = !1, this.gi = .8, W.plane({
            n: "s_note5c",
            x: this.mi / 2 - .03,
            y: -.2,
            z: -.1,
            w: this.Fi,
            h: 1.414 * this.Fi,
            ry: -90,
            t: s.F.et("s_note5c", "#185")
        }), W.plane({
            n: "s_note5b",
            x: this.mi / 2 - .031,
            y: -.1,
            z: .18,
            w: this.Fi,
            h: 1.414 * this.Fi,
            ry: -90,
            t: s.F.et("s_note5b", "#185")
        }), W.plane({
            n: "s_note5a",
            x: -this.mi / 2 + .031,
            w: this.Fi,
            h: 1.414 * this.Fi,
            ry: 90,
            t: s.F.et("s_note5a", "#185")
        }), i.push({
            n: "btn13",
            z: 100
        }, {
            n: "s_lbl_btn13",
            z: 100
        }, {
            n: "e_blue",
            x: -1,
            y: -.4,
            ry: -45,
            t: s.F.st("•  •", "3b7")
        });
        else if (6 == t) {
            this.gi = 1;
            const [t, i] = s.P.H(600, 200, "note6");
            i.font = "italic 32px " + s.fs, i.fillStyle = "#444", i.textBaseline = "top";
            const h = s.F.U.s_note6;
            for (let t = 0; t < h.length; t++) i.fillText(h[t], 300, 20 + 40 * t);
            W.plane({
                n: "note6",
                y: -.1,
                z: .99,
                w: .6,
                h: .2,
                ry: 180,
                t
            }), e.push("plane", "dsl", "dsr")
        }
        t > 1 && (i.push({
            n: "loops",
            z: .0251
        }), e.push("s_note1")), t > 2 && e.push("s_note2"), t > 3 && e.push("s_note3"), t > 4 && e.push("s_note4", "e_pink1", "e_pink2", "e_pink3", "e_pink4", "e_pink7", "e_pink9", "e_pink10", "e_pink11"), t > 5 && e.push("s_note5a", "s_note5b", "s_note5c"), W.move(i), W.delete(e)
    }
    Zi(t, i, e) {
        let h = 0;
        this.ci.push({
            duration: 6,
            ji: n => {
                if (this.os(n)) return 1;
                if (8 * n - h < 1 || n >= 1) return;
                h = 8 * n;
                let o = (1 - n) * t,
                    r = (1 - n) * i,
                    l = (1 - n) * (e + .7) - .7;
                o += Math.round(h) % 2 ? .07 : -.07, s.Audio.play(s.Audio.lt, 0, .1 + .1 * h), s.Audio.text("*thump*", "f00", .5, {
                    x: o,
                    y: -.5,
                    z: l
                }), W.move({
                    n: "e_red",
                    x: o,
                    y: r,
                    z: l
                })
            }
        })
    }
    _s() {
        const t = [];
        for (let i = 0; i < this.ci.length; i++) {
            const e = this.ci[i];
            e.start ??= this.Ut;
            const h = (this.Ut - e.start) / (e.duration * s.R);
            e.ji(h) && t.push(e)
        }
        this.ci = this.ci.filter((i => !t.includes(i)))
    }
    $i() {
        if (this.Gi) {
            const t = W.next[this.Gi.n];
            this.rs(t)
        }
    }
    Ni(t) {
        W.move({
            n: "dis",
            t: s.F.it(t),
            s: 30,
            mix: .25
        })
    }
    Si(t, i) {
        if (this.Ws == t) return;
        this.Ws = t, this.di = !0;
        const e = this.loop,
            h = {};
        if (t == s.ii.hi) {
            W.next.dialog && W.move({
                n: "dialog",
                z: 100
            });
            const t = {
                    x: W.next.camera.x,
                    y: W.next.camera.y,
                    z: W.next.camera.z
                },
                i = this.yi - this.xi;
            h.duration = Math.min(4.5, 1.1 * Math.abs(i)), s.Audio.play(s.Audio.rt, h.duration), h.ji = e => {
                if (this.Ni(this.xi + Math.round(e * i)), e > 1) return this.Ri(this.yi), W.camera(t), s.Audio.play(s.Audio.nt), s.Audio.text("*ding*", "ff0", 3, W.next.dis), this.xi = this.yi, this.pi.push(this.xi), setTimeout((() => this.ts(this.xi)), 1), this.hs((() => {
                    this._i = s.li.IDLE, this.Si(s.ii.si), setTimeout((() => this.Yi(this.xi)), 1)
                })), 1;
                W.camera({
                    x: t.x + (2 * Math.random() - 1) / 300,
                    y: t.y + (2 * Math.random() - 1) / 300,
                    z: t.z + (2 * Math.random() - 1) / 300
                })
            }
        } else if (t == s.ii.ni) this.di = !1, s.P.Ct = !0, W.camera({
            rx: 0,
            ry: 0,
            a: 500,
            onAnimDone: () => {
                const t = W.next.e_red.z;
                this.ci.push({
                    duration: 3,
                    ji: i => {
                        if (s.P.Bt.fillStyle = `rgba(0,0,0,${Math.min(1,i)})`, s.P.Bt.fillRect(0, 0, s.P.Lt.width, s.P.Lt.height), i > 1) return W.move({
                            n: "e_red",
                            z: 100
                        }), this.ds(e + 1), setTimeout((() => this.Si(s.ii.ei, 1)), 1), 1;
                        const h = -.5 * i;
                        W.camera({
                            z: h
                        }), W.move({
                            n: "e_red",
                            z: t + h
                        })
                    }
                })
            }
        });
        else if (t == s.ii.oi) this.di = !1, h.duration = 3, h.ji = t => {
            s.P.Ct = !0;
            const i = s.P.Lt.width,
                h = s.P.Lt.height;
            if (s.P.Bt.fillStyle = "#a00", s.P.Bt.fillRect(0, 0, i, h), s.P.Bt.fillStyle = `rgba(0,0,0,${Math.min(1,t)})`, s.P.Bt.fillRect(0, 0, i, h), t > 1) return this.ds(e), setTimeout((() => this.Si(s.ii.ei, 1)), 1), 1
        };
        else if (t == s.ii.ei) this.di = !1, this.es(), h.duration = 4, h.ji = t => {
            s.P.Ct = !0;
            const e = {
                z: 0,
                rx: 0,
                ry: 0
            };
            if (t > 1) return W.camera(e), s.P.Ct = !1, s.P.camera.rx = 0, s.P.camera.ry = 0, s.P.jt = null, document.getElementById("p").hidden = !1, W.delete("title"), setTimeout((() => this.Si(s.ii.si)), 1), 1;
            1 == i && (s.P.Bt.fillStyle = `rgba(0,0,0,${1-t})`, s.P.Bt.fillRect(0, 0, s.P.Lt.width, s.P.Lt.height)), e.z = -.5 * (1 - Math.sin(t * Math.PI / 2)), W.camera(e)
        };
        else if (t == s.ii.S) {
            document.getElementById("p").hidden = !0, document.body.classList.add("p"), this.di = !1, s.P.Ct = !0, W.camera({
                z: -.5,
                rx: 0,
                ry: 0
            });
            const t = document.getElementById("b");
            t.onclick = () => {
                t.remove(), document.body.classList.remove("p"), this.ci.push({
                    duration: .7,
                    ji: t => (t > 1 && setTimeout((() => this.Si(s.ii.ei)), 1), t > 1)
                })
            }
        } else t == s.ii.ri && (document.getElementById("p").hidden = !0, this.di = !1, s.P.Ct = !0, W.camera({
            rx: 0,
            ry: 0,
            a: 1e3,
            onAnimDone: () => {
                h.duration = 5, h.ji = t => {
                    if (t < .2) return;
                    t -= .2, W.camera({
                        z: -2 * t
                    });
                    const i = Math.min(t, 1),
                        e = s.P.Lt.width,
                        h = s.P.Lt.height;
                    s.P.Bt.fillStyle = `rgba(238,238,238,${i})`, s.P.Bt.fillRect(0, 0, e, h), s.P.Bt.font = "96px " + s.N, s.P.Bt.textAlign = "center", s.P.Bt.textBaseline = "middle", s.P.Bt.fillStyle = `rgba(110,110,110,${i})`, s.P.Bt.fillText("OUT", e / 2, h / 2)
                }, this.ci.push(h)
            }
        }));
        h.ji && this.ci.push(h)
    }
    qi(t, i, e, h) {
        W.next.dialog || ([this.xs, this.ys] = s.P.H(2, 2, "dialog"), W.plane({
            n: "dialog",
            ns: 1,
            t: this.xs
        })), h = Math.min(h, 1);
        let n = 0,
            o = 0;
        for (let i = 0; i < t.length; i++) {
            const s = t[i];
            n += s.length, o = Math.max(o, s.length)
        }
        this.xs.width = 14 * o, this.xs.height = 30 * t.length, this.ys.clearRect(0, 0, this.xs.width, this.xs.height), this.ys.font = "600 24px " + s.O, this.ys.textAlign = "center", this.ys.textBaseline = "top", this.ys.fillStyle = "#" + e;
        const r = Math.round(h * n);
        let l = 0,
            a = t.length,
            d = "";
        for (let i = 0; i < t.length; i++) {
            const s = t[i].substring(0, r - l);
            if (l += s.length, a--, d = s[s.length - 1], this.ys.fillText(s, this.xs.width / 2, 30 * i), l >= r) break
        }
        W.gl.deleteTexture(W.l.dialog), delete W.l.dialog;
        const c = s.I(i),
            u = .075 * a;
        W.move({
            n: "dialog",
            x: c.x,
            y: c.y + c.h / 2 + .1 - u,
            z: c.z,
            w: this.xs.width / 400,
            h: this.xs.height / 400,
            t: this.xs
        }), (this.cs || 0) < r && (this.cs = r, " " != d && "." != d && s.Audio.play(s.Audio.Wt))
    }
    update(t) {
        if (this.Ut += t, this._s(), this.ps || (this.ls() && Math.random() < .02 * t ? (this.ps = !0, W.light({
                i: .6,
                a: 100,
                onAnimDone: () => this.ps = !1
            })) : W.next.light.i != this.gi && W.light({
                i: this.gi
            })), this.note) {
            const t = s.F.U[this.note],
                i = ["s_note4", "s_note5a", "s_note5b", "s_note5c"].includes(this.note) && "#185";
            s.P.$t(t, i), s.L.Et(s.L.ct.ft, !0) && (this.note = null)
        } else this.di && this._i == s.li.IDLE && this.Ki()
    }
    us(t) {
        W.move({
            n: "loops",
            t: s.F.l["counter" + t],
            mix: 0
        })
    }
};