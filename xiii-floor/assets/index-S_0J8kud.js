(function() {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload")) return;
    for (const o of document.querySelectorAll('link[rel="modulepreload"]')) s(o);
    new MutationObserver(o => {
        for (const n of o)
            if (n.type === "childList")
                for (const i of n.addedNodes) i.tagName === "LINK" && i.rel === "modulepreload" && s(i)
    }).observe(document, {
        childList: !0,
        subtree: !0
    });

    function t(o) {
        const n = {};
        return o.integrity && (n.integrity = o.integrity), o.referrerPolicy && (n.referrerPolicy = o.referrerPolicy), o.crossOrigin === "use-credentials" ? n.credentials = "include" : o.crossOrigin === "anonymous" ? n.credentials = "omit" : n.credentials = "same-origin", n
    }

    function s(o) {
        if (o.ep) return;
        o.ep = !0;
        const n = t(o);
        fetch(o.href, n)
    }
})();
const Ie = [0, 0, 30, 7],
    Ce = [0, 7, 5, 7],
    Ee = [0, 14, 24, 24],
    Pe = [5, 7, 50, 7],
    Ae = [30, 0, 30, 5],
    Fe = [0, 38, 32, 32],
    Re = [32, 14, 32, 32],
    Te = [24, 14, 7, 7],
    ze = [32, 46, 27, 9],
    Me = [32, 55, 27, 9],
    Oe = [0, 70, 30, 14],
    pe = {
        s: Ie,
        r: Ce,
        p: Ee,
        nb: Pe,
        n: Ae,
        m: Fe,
        f: Re,
        d: Te,
        cb: ze,
        ca: Me,
        b: Oe
    },
    ke = "" + new URL("a-s8ahmZyb.png", import.meta.url).href,
    se = r => new Promise(e => {
        setTimeout(e, r)
    }),
    De = (r, e) => {
        const t = [];
        return {
            free(s) {
                e && e(s), t.push(s)
            },
            alloc() {
                return t.length > 0 ? t.pop() : r()
            },
            getSize() {
                return t.length
            },
            dispose() {
                t.length = 0
            }
        }
    },
    He = (r, e, t) => Math.max(e, Math.min(t, r)),
    Le = r => {
        let e = performance.now();
        const t = (s, o = 60) => {
            requestAnimationFrame(t);
            const n = s - e,
                i = .1,
                a = 1e3 / o;
            n >= a - i && (e = s - n % a, r(s))
        };
        requestAnimationFrame(t)
    },
    We = De(() => document.createElement("canvas"), r => {
        r.getContext("2d").clearRect(0, 0, r.width, r.height)
    }),
    xe = (r, e, t, s, o, n = 0, i = 0) => {
        const a = We.alloc(),
            d = a.getContext("2d");
        return a.width = s, a.height = o, d.drawImage(r, e, t, s, o, n, i, s, o), [a, d]
    },
    Y = (r, e, t = 0, s = t, o = t) => {
        const n = e.getImageData(0, 0, r.width, r.height),
            i = n.data;
        for (let a = 0; a < i.length; a += 4) i[a] === t && i[a + 1] === s && i[a + 2] === o && (i[a + 3] = 0);
        e.putImageData(n, 0, 0)
    },
    U = (r, e, t) => {
        e.fillStyle = t, e.globalCompositeOperation = "source-in", e.fillRect(0, 0, r.width, r.height)
    },
    Ne = (r, e, t, s, o, n) => {
        const i = r.width / 3,
            a = [0, 0, i, i],
            d = [i, 0, i, i],
            h = [i * 2, 0, i, i],
            f = [0, i, i, i],
            p = [i, i, i, i],
            u = [i * 2, i, i, i],
            y = [0, i * 2, i, i],
            x = [i, i * 2, i, i],
            g = [i * 2, i * 2, i, i];
        e.save(), e.translate(t, s), e.drawImage(r, ...a, 0, 0, i, i), e.drawImage(r, ...h, o - i, 0, i, i), e.drawImage(r, ...y, 0, n - i, i, i), e.drawImage(r, ...g, o - i, n - i, i, i), e.drawImage(r, ...d, i, 0, o - 2 * i, i), e.drawImage(r, ...x, i, n - i, o - 2 * i, i), e.drawImage(r, ...f, 0, i, i, n - 2 * i), e.drawImage(r, ...u, o - i, i, i, n - 2 * i), e.drawImage(r, ...p, i, i, o - 2 * i, n - 2 * i), e.restore()
    },
    m = 16,
    Q = m * 2,
    me = ["#EEEEEE", "#F2F2F2", "#CCCCCC", "#A5A5A5", "#7F7F7F", "#595959", "#111111"],
    oe = r => {
        const e = Math.round(r * (me.length - 1));
        return me[e]
    },
    $ = oe(0),
    P = oe(1),
    w = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    Ge = r => new Promise(e => {
        const t = new Image;
        t.src = r, t.onload = () => e(t)
    }),
    Be = async () => {
        const r = await Ge(ke),
            e = {};
        let t;
        for (t in pe) {
            const [s, o, n = m, i = m] = pe[t];
            e[t] = xe(r, s, o, n, i)
        }
        return e
    };

function Ve(...r) {
    l.value += [...r].map(e => typeof e == "object" ? JSON.stringify(e, null, 2) : e).join(" ") + `
`, l.scrollTop = l.scrollHeight
}
class _e {
    constructor() {
        this.tweens = []
    }
    tweenProperty(e, t, s, o, n, i) {
        const {
            tweens: a
        } = this;
        let d = 0;
        const h = () => {
            if (d < e) {
                const f = d / e,
                    p = o(f);
                n(s * p + t * (1 - p)), d += 1
            } else i && i(), a.splice(a.indexOf(h), 1)
        };
        a.push(h)
    }
    update(e) {
        const {
            tweens: t
        } = this;
        if (t.length > 0)
            for (let s, o = t.length - 1; o >= 0; o--) s = t[o], s && s()
    }
}
class Se {
    constructor() {
        this._accepted = !1
    }
    get isAccepted() {
        return this._accepted
    }
    accept() {
        this._accepted = !0
    }
}
class ce extends Se {
    constructor(e, t) {
        super(), this.mouseX = e, this.mouseY = t
    }
}
const ne = (r = 0, e = r) => ({
    x: r,
    y: e
});

function je(r, e, t) {
    const s = r.x,
        o = r.y,
        n = e.x,
        a = (e.y - o) / (n - s),
        d = o - a * s;
    return {
        x: (t - d) / a,
        y: t
    }
}

function qe(r, e, t) {
    const s = e.x - r.x,
        o = e.y - r.y,
        n = Math.max(Math.abs(s), Math.abs(o)),
        i = n === 0 ? 0 : 1 / n,
        a = s * i,
        d = o * i;
    let h = r.x,
        f = r.y;
    for (let p = 0; p <= n; p++, h += a, f += d) t(Math.round(h), Math.round(f))
}
class he {
    constructor(e = 0, t = 0, s = 1) {
        this.isVisible = !0, this.children = [], this.position = {
            x: e,
            y: t
        }, this.scale = ne(s)
    }
    update(e) {
        this.children.forEach(t => {
            t.update(e)
        })
    }
    draw(e) {
        this.isVisible && this.children.forEach(t => {
            e.save(), e.translate(t.position.x, t.position.y), e.scale(t.scale.x, t.scale.y), t.draw(e), e.restore()
        })
    }
    dispatchEvent(e) {
        const {
            children: t,
            position: s
        } = this;
        e instanceof ce && (e.mouseX -= s.x, e.mouseY -= s.y);
        for (let o = 0; o < t.length && (t[o].dispatchEvent(e), !e.isAccepted); o++);
        e.isAccepted || this.handleEvent(e)
    }
    handleEvent(e) {}
}
const Xe = r => r,
    ee = r => Math.sin(r * Math.PI / 2);
class V {
    constructor(e, t, s = 0, o = 0) {
        this.width = e, this.height = t, this.isVisible = !0, this.scale = ne(1), this.position = {
            x: s,
            y: o
        }
    }
    update(e) {}
    draw(e) {}
    dispatchEvent(e) {
        e.isAccepted || this.handleEvent(e)
    }
    handleEvent(e) {}
}
class N extends V {
    constructor([e, t, s = 0, o = 0], n, i = 0) {
        super(e, t, s, o), this.index = i, this.images = [], this.alpha = 1;
        const a = n.width / e,
            d = n.height / t;
        for (let h = 0; h < d; h++)
            for (let f = 0; f < a; f++) {
                const p = f + h * a,
                    [u] = xe(n, f * e, h * t, e, t);
                this.images[p] = u
            }
    }
    draw(e) {
        const {
            images: t,
            index: s,
            alpha: o
        } = this;
        e.globalAlpha = o, e.drawImage(t[s], 0, 0), e.globalAlpha = 1
    }
}
class re extends N {
    constructor([e, t, s = 0, o = 0], n) {
        super([e, t, s, o], n), this.isPlaying = !1, this.frames = [], this.speedDivisor = 10, this.pivot = ne(), this.counter = 0, this.frameNum = 0;
        for (let i = 0; i < this.images.length; i++) this.frames[i] = i
    }
    update(e) {
        const {
            frames: t,
            isPlaying: s,
            speedDivisor: o
        } = this;
        s && (this.counter = (this.counter + 1) % 1e3, this.counter % o === 0 && (this.frameNum = (this.frameNum + 1) % t.length), this.index = t[this.frameNum])
    }
    draw(e) {
        if (!this.isVisible) return;
        const {
            images: t,
            index: s,
            pivot: o,
            width: n,
            height: i
        } = this;
        e.drawImage(t[s], 0, 0, n, i, -n * o.x, -i * o.y, n, i)
    }
    stop() {
        this.isPlaying = !1, this.index = 0
    }
}
class ae extends V {
    constructor(e, t = 0, s = 0) {
        super(e.width, e.height, t, s), this.image = e, this.pivot = ne()
    }
    draw(e) {
        if (!this.isVisible) return;
        const {
            image: t,
            pivot: s
        } = this, {
            width: o,
            height: n
        } = t;
        e.drawImage(t, 0, 0, o, n, -o * s.x, -n * s.y, o, n)
    }
}
var T = (r => (r[r.Title = 0] = "Title", r[r.Game = 1] = "Game", r[r.End = 2] = "End", r))(T || {});
class de {
    update(e) {}
    draw(e) {}
    onClick(e, t) {}
    destroy() {}
}
class ge extends V {
    constructor(e, t, s, o = 0, n = 0) {
        super(t, s, o, n), this.fencePattern = e, this.borderSize = 2
    }
    draw(e) {
        const {
            fencePattern: t,
            width: s,
            height: o,
            borderSize: n
        } = this;
        e.fillStyle = P, e.fillRect(-n, 0, s + n * 2, o), e.fillStyle = t, e.fillRect(0, 0, s, o)
    }
}
class we extends V {
    constructor([e, t, s = 0, o = 0], n) {
        super(e, t, s, o), this.tweener = n, this.chars = [], this.borderHeight = 2, this.doorWidth = 0
    }
    draw(e) {
        const {
            width: t,
            height: s,
            borderHeight: o,
            doorWidth: n
        } = this;
        e.fillStyle = P, e.fillRect(0, 0, t, -s - o), e.fillRect(t / 4, 0, t / 2, -s - o - 1), e.fillRect(t / 2 - 8, 0, 1, -this.position.y), e.fillRect(t / 2 + 9, 0, 1, -this.position.y), e.fillStyle = $, e.fillRect(0, -s, t, s), e.fillStyle = P, e.fillRect(0, 0, n, -s - o), e.fillRect(t - n, 0, n, -s - o), e.fillStyle = $, e.globalAlpha = .4;
        for (let i = n; i < t - n; i++) {
            const a = je({
                x: i,
                y: -s
            }, {
                x: t,
                y: -s - t * 1.5
            }, 0);
            qe(a, {
                x: i,
                y: -s
            }, (d, h) => {
                e.fillRect(d, h, 1, 1)
            })
        }
        e.globalAlpha = 1
    }
    open() {
        const {
            tweener: e,
            width: t,
            chars: s
        } = this;
        return new Promise(o => {
            s.forEach(n => n.isVisible = !0), e.tweenProperty(20, t / 2, 0, ee, n => this.doorWidth = n, () => {
                this.doorWidth = 0, o()
            })
        })
    }
    moveTo(e, t) {
        const {
            tweener: s,
            position: o,
            chars: n
        } = this;
        return new Promise(i => {
            s.tweenProperty(t, o.y, e, ee, a => {
                o.y = a, n.forEach(d => d.position.y = a)
            }, () => {
                o.y = e, n.forEach(a => a.position.y = e), i()
            })
        })
    }
    close() {
        const {
            tweener: e,
            width: t,
            chars: s
        } = this;
        return new Promise(o => {
            e.tweenProperty(20, 0, t / 2, ee, n => this.doorWidth = n, () => {
                this.doorWidth = t / 2, s.forEach(n => n.isVisible = !1), o()
            })
        })
    }
    getCharPlace(e, t) {
        const {
            position: s,
            width: o
        } = this;
        return s.x + o - (e + 1) * (o / (t + 1))
    }
}
var le = (r => (r[r.changeFloor = 0] = "changeFloor", r[r.summonMaster = 1] = "summonMaster", r))(le || {});
class te extends Se {
    constructor(e) {
        super(), this.data = e
    }
}
class Ye {
    constructor({
        numFloors: e,
        startFromFloorNo: t,
        elevators: s,
        peoplePerFloor: o,
        unavailableFloorsIndices: n = [],
        maxSteps: i = 20
    }) {
        this.steps = 0, this.isInputEnabled = !0, this.floors = [];
        for (let a = 0; a < e; a++) this.floors[a] = {
            no: t++,
            isUnavailable: n.includes(a),
            people: o[a] ?? 0
        };
        this.elevators = s, this.steps = i
    }
    get numFloors() {
        return this.floors.length
    }
}
class Ue {
    constructor(e, t, s) {
        this.model = e, this.eventDispatcher = t, this.game = s
    }
    processButtonPress(e, t = !1) {
        const {
            model: s,
            eventDispatcher: o
        } = this;
        if (!(e !== s.elevators[0].floorIndex)) return;
        if (t || s.steps--, s.steps < 0 && this.game.changeScene(T.End, fe.Loose), s.elevators[0].floorIndex = e, s.elevators[1].floorIndex = s.numFloors - 1 - e, s.elevators[1].floorIndex < 0) {
            o.dispatchEvent(new te({
                action: 0,
                isOverweight: t,
                isOut: !0
            }));
            return
        }(s.floors[s.elevators[0].floorIndex].no === 13 || s.floors[s.elevators[1].floorIndex].no === 13) && o.dispatchEvent(new te({
            action: 1,
            isOverweight: !1,
            isOut: !1
        }));
        const {
            elevators: i,
            floors: a
        } = s;
        for (let d = 0; d < i.length; d++) {
            const h = i[d],
                f = s.floors[h.floorIndex];
            if (f)
                if (f.people > 0) {
                    const p = Math.min(h.maxCapacity - h.capacity, f.people);
                    p > 0 && (a[h.floorIndex].people -= p, h.capacity += p)
                } else a[h.floorIndex].people += h.capacity, h.capacity = 0
        }
        o.dispatchEvent(new te({
            action: 0,
            isOverweight: t,
            isOut: !1
        }))
    }
    checkOverweight() {
        const {
            model: {
                elevators: e
            }
        } = this;
        return e[1].capacity - e[0].capacity >= 5 ? (this.processButtonPress(e[0].floorIndex + 1, !0), !0) : !1
    }
    enableInput(e) {
        this.model.isInputEnabled = e
    }
}
class $e extends he {
    constructor(e, t, s, o, n, i) {
        const {
            gameAreaSize: a,
            floorHeight: d,
            wallSize: h
        } = e;
        super(h, h), this.sceneDimensions = e, this.model = t, this.controller = s, this.tweener = o, this.game = i, this.chars = [], this.xiiFloorIndex = -1, this.xiiFloorDarknessAlpha = 1, this.frameCounter = 0, this.showFeedAnimation = !1;
        const [f, p] = n.p;
        Y(f, p), U(f, p, oe(.7));
        const u = c.getContext("2d").createPattern(f, "repeat"),
            y = m * 2,
            x = m * 3 - h,
            g = y * 8,
            z = y * 2,
            Z = new ge(u, z, a, g),
            K = t.elevators[0],
            _ = new we([z, x, g, a - d * K.floorIndex], o),
            j = y * 11,
            G = y * 3,
            M = new ge(u, G, a, j),
            q = t.elevators[1],
            A = new we([G, x, j, a - d * q.floorIndex], o);
        this.elevators = [_, A], this.children.push(Z, _, M, A);
        const [E, O] = n.ca;
        Y(E, O), U(E, O, P);
        const [I, k] = n.cb;
        Y(I, k), U(I, k, P);
        const {
            floors: J
        } = t;
        for (let S = 0; S < J.length; S++) {
            const b = J[S],
                C = [];
            if (b.people > 0) {
                for (let W = 0; W < b.people; W++) {
                    const v = new re([9, 9, g - (W + 1) * Q, a - d * S], Math.random() < .2 ? I : E);
                    v.frames = [0, 1, 0, 2], v.scale.x = v.scale.y = 3, v.pivot.x = .5, v.pivot.y = 1, C.push(v)
                }
                this.children.push(...C)
            }
            this.chars[S] = C
        }
        const [B, D] = n.n;
        Y(B, D), U(B, D, P);
        const H = 4,
            F = 4;
        for (let S = 0; S < t.numFloors; S++) {
            const b = String(t.floors[S].no),
                C = b.length === 2 ? parseInt(b[0]) : 0,
                W = b.length === 2 ? parseInt(b[1]) : parseInt(b[0]),
                v = new N([3, 5, Q * 15, a - (S + 1) * d + h + H], B, C);
            v.scale.x = v.scale.y = F;
            const ie = new N([3, 5, v.position.x + v.width * F + H, v.position.y], B, W);
            ie.scale.x = ie.scale.y = F, this.children.push(v, ie), b === "13" && (this.xiiFloorIndex = S)
        }
        const [X, R] = n.m;
        Y(X, R), U(X, R, "white");
        const L = new ae(X, 0, (this.xiiFloorIndex - 1) * d);
        L.scale.x = L.scale.y = 2, L.isVisible = !1, this.children.push(L), this.master = L
    }
    update(e) {
        super.update(e), this.showFeedAnimation && (this.frameCounter = (this.frameCounter + 1) % 1e3, this.xiiFloorDarknessAlpha = ~~(this.frameCounter / 50) % 3 === 0 ? 1 : 0, this.master.isVisible = this.xiiFloorDarknessAlpha === 1, this.master.isVisible || (this.master.position.x += .2))
    }
    draw(e) {
        const {
            sceneDimensions: t,
            model: s,
            xiiFloorIndex: o,
            xiiFloorDarknessAlpha: n
        } = this, {
            gameAreaSize: i,
            floorHeight: a,
            wallSize: d
        } = t;
        e.fillStyle = oe(.5), e.fillRect(0, 0, i, i), e.fillStyle = P, e.globalAlpha = n, e.fillRect(0, a * o, i, -a), e.globalAlpha = 1, super.draw(e), e.fillStyle = P;
        for (let h = 0; h <= s.numFloors; h++) e.fillRect(0, a * h, i, d)
    }
    async moveElevator(e, t, s, o, n) {
        const {
            sceneDimensions: i,
            elevators: a,
            model: d
        } = this;
        o || await e.close();
        const h = i.gameAreaSize - i.floorHeight * t.floorIndex;
        if (await e.moveTo(h, Math.abs(h - e.position.y) / i.floorHeight * 15), n) return;
        o || await e.open();
        const {
            floorIndex: f
        } = t, p = this.chars[f];
        let u = p.length - s;
        const {
            chars: y
        } = e, x = [];
        if (u > 0) {
            if (y.length > 0)
                for (let g = 0; g < y.length; g++) y[g].position.x = e.getCharPlace(g, t.capacity);
            for (; u > 0;) {
                const g = p.shift();
                x.push(this.moveChar(g, e.getCharPlace(y.length, t.capacity), y.length * 100).then(() => {
                    g.scale.x *= -1
                })), y.push(g), u--
            }
        } else
            for (; u < 0;) {
                const g = y.pop();
                x.push(this.moveChar(g, a[0].position.x - (d.floors[f].people - p.length) * Q, p.length * 100).then(() => {
                    g.scale.x *= -1
                })), p.unshift(g), u++
            }
        x.length > 0 && await Promise.all(x), await Promise.all(p.map((g, z) => this.moveChar(g, a[0].position.x - (z + 1) * Q, z * 100)))
    }
    async moveChar(e, t, s = 0) {
        return s > 0 && await se(s), new Promise(o => {
            e.isPlaying = !0;
            const {
                tweener: n
            } = this, i = Math.abs(t - e.position.x);
            n.tweenProperty(i / e.width * 2, e.position.x, t, Xe, a => e.position.x = a, () => {
                e.stop(), e.position.x = t, o()
            })
        })
    }
    async handleEvent(e) {
        const {
            model: t,
            controller: s,
            elevators: o
        } = this;
        if (e instanceof te) {
            const {
                data: n
            } = e;
            switch (n.action) {
                case le.changeFloor:
                    s.enableInput(!1), await Promise.all(o.map((i, a) => {
                        var f;
                        const d = t.elevators[a],
                            h = ((f = t.floors[d.floorIndex]) == null ? void 0 : f.people) ?? -1;
                        return this.moveElevator(i, d, h, n.isOverweight, n.isOut)
                    })), s.checkOverweight() || s.enableInput(!0);
                    break;
                case le.summonMaster:
                    this.showFeedAnimation = !0, se(6 * 1e3).then(() => {
                        this.game.changeScene(T.End, fe.Win)
                    });
                    break
            }
        }
    }
}
class ye extends V {
    constructor([e, t, s = 0, o = 0], n, i, a) {
        super(e, t, s, o), this.data = n, this.isEnabled = i, this.clickHandler = a
    }
    draw(e) {
        const {
            width: t,
            height: s
        } = this;
        e.fillStyle = "green", e.fillRect(0, 0, t, s)
    }
    handleEvent(e) {
        if (this.isEnabled && e instanceof ce) {
            const {
                position: t,
                width: s,
                height: o,
                clickHandler: n,
                data: i
            } = this;
            e.mouseX >= t.x && e.mouseX <= t.x + s && e.mouseY >= t.y && e.mouseY <= t.y + o && (n(i), e.accept())
        }
    }
}
class Ze extends V {
    constructor(e, t, s, o = 0, n = 0) {
        super(t, s, o, n), this.frame = e
    }
    draw(e) {
        const {
            frame: t,
            width: s,
            height: o
        } = this;
        Ne(t, e, 0, 0, s, o)
    }
}
class Ke extends he {
    constructor([e, t, s = 0, o = 0], n, i, a, d) {
        super(s, o), this.model = i, this.width = e, this.height = t;
        const {
            floors: h
        } = i, [f] = n.f, p = new Ze(f, e, t), u = 3, [y] = n.b, [x] = n.nb, [g] = n.s, [z] = n.r, Z = [], K = [], _ = [], j = h.length;
        for (let I = 0; I < j; I++) {
            const k = h[I];
            if (k.no === 13) continue;
            const J = w ? ~~(I / 2) : I % 2,
                B = w ? I % 2 : j / 2 - 1 - ~~(I / 2),
                D = m * (w ? 5 : 1) + J * (m * 4),
                H = m * (w ? 1 : 5) + B * (m * 4),
                F = new re([15, 14, D, H], y);
            F.scale.x = F.scale.y = u, K.push(F);
            const X = k.isUnavailable ? .4 : 1,
                R = String(k.no),
                L = R.length === 2 ? parseInt(R[0]) : 0,
                S = R.length === 2 ? parseInt(R[1]) : parseInt(R[0]),
                b = new N([5, 7, D + 2 * u, H + 2 * u], x, L);
            b.scale.x = b.scale.y = u;
            const C = new N([5, 7, D + 8 * u, H + 2 * u], x, S);
            C.scale.x = C.scale.y = u, b.alpha = C.alpha = X, _.push(b, C);
            const W = new ye([15 * u, 14 * u, D, H], I, !k.isUnavailable, v => {
                i.isInputEnabled && (F.index = 1, b.position.y += u, C.position.y += u, se(100).then(() => {
                    F.index = 0, b.position.y -= u, C.position.y -= u
                }), a.processButtonPress(v))
            });
            Z.push(W)
        }
        const G = new ye([15 * u, 14 * u, w ? m * 22 : m, w ? m * 5 : m * 21], "R", !0, d),
            M = new re([15, 14, G.position.x, G.position.y], y);
        M.scale.x = M.scale.y = u;
        const q = new ae(z, M.position.x + 5 * u, M.position.y + 2 * u);
        q.scale.x = q.scale.y = u;
        const A = new ae(g, w ? m * 22 : m / 2, m * 2);
        A.scale.x = A.scale.y = u;
        const E = new N([5, 7, A.position.x + A.width * u + 2 * u, A.position.y], x, 0);
        E.scale.x = E.scale.y = u;
        const O = new N([5, 7, E.position.x + E.width * u + 1 * u, E.position.y], x, 0);
        O.scale.x = O.scale.y = u, this.stepsFirstNum = E, this.stepsSecondNum = O, this.children.push(p, ...Z, ...K, ..._, A, E, O, G, M, q)
    }
    draw(e) {
        e.clearRect(0, 0, this.width, this.height), super.draw(e), this.model.isInputEnabled || (e.fillStyle = "rgba(0,0,0,0.3)", e.fillRect(w ? m * 5 : m, w ? m : m * 5, w ? m * 15 : this.width - m * 2, w ? this.width - m * 2 : m * 15));
        const t = String(this.model.steps),
            s = t.length === 2 ? parseInt(t[0]) : 0,
            o = t.length === 2 ? parseInt(t[1]) : parseInt(t[0]);
        this.stepsFirstNum.index = s, this.stepsSecondNum.index = o
    }
}
const ue = r => {
    const s = r * 64,
        o = s + 8 * 2,
        n = 16 * 9;
    return {
        floorHeight: 64,
        wallSize: 8,
        gameAreaSize: s,
        canvasSize: o,
        sidebarSize: n,
        sceneWidth: o + n * +!w,
        sceneHeight: o + n * +w
    }
};
class Je extends de {
    constructor(e) {
        document.querySelector(".cc").style.imageRendering = "pixelated", super(), this.game = e, this.reset()
    }
    reset() {
        const {
            game: e
        } = this, t = new he, s = new Ye({
            numFloors: 8,
            startFromFloorNo: 0,
            elevators: [{
                maxCapacity: 100,
                floorIndex: 2,
                capacity: 0
            }, {
                maxCapacity: 5,
                floorIndex: 5,
                capacity: 0
            }],
            peoplePerFloor: {
                1: 7
            }
        }), o = new Ue(s, t, e), n = ue(s.numFloors), {
            canvasSize: i,
            sidebarSize: a,
            sceneWidth: d,
            sceneHeight: h
        } = n;
        e.resize(d, h);
        const f = new $e(n, s, o, e.tweener, e.assets, e),
            p = new Ke([w ? i : a, w ? a : i, +!w * i, +w * i], e.assets, s, o, this.reset.bind(this));
        t.children.push(f, p), this.root = t, this.sceneDimensions = n
    }
    update(e) {
        this.root.update(e)
    }
    draw(e) {
        const {
            canvasSize: t
        } = this.sceneDimensions;
        e.fillStyle = P, e.fillRect(0, 0, t, t), this.root.draw(e)
    }
    onClick(e, t) {
        this.root.dispatchEvent(new ce(e, t))
    }
}
var fe = (r => (r[r.Win = 0] = "Win", r[r.Loose = 1] = "Loose", r))(fe || {});
class Qe extends de {
    constructor(e, ...t) {
        super(), this.winState = t[0], document.querySelector(".cc").style.imageRendering = "auto";
        const s = ue(8),
            {
                sceneWidth: o,
                sceneHeight: n
            } = s;
        e.resize(o, n), se(500).then(() => {
            onclick = () => {
                onclick = null, e.changeScene(T.Title)
            }
        })
    }
    update(e) {}
    draw(e) {
        const {
            width: t,
            height: s
        } = c;
        e.fillStyle = P, e.fillRect(0, 0, t, s), e.fillStyle = $;
        const o = this.winState === 0 ? "You serve your master well!" : "You failed to feed your master.";
        e.font = "bold 1px Georgia", e.font = `bold ${t*.9/e.measureText(o).width}px Georgia`, e.textAlign = "center", e.fillText(o, t / 2, s / 2), e.font = "24px Arial", e.fillText(this.winState === 0 ? `${w?"tap":"click"} to re-start` : "Try again or IT will feast on you.", t / 2, s * .6)
    }
    destroy() {
        onclick = null
    }
}
const be = "XIII FLOOR";
class ve extends de {
    constructor(e) {
        super(), this.frameCounter = 0;
        const t = 8,
            {
                sceneWidth: s,
                sceneHeight: o
            } = ue(t),
            n = 2;
        e.resize(s * n, o * n), this.doorWidth = c.width / 2, onclick = () => {
            onclick = null, e.tweener.tweenProperty(30, this.doorWidth, 0, ee, i => this.doorWidth = i, () => {
                e.changeScene(T.Game)
            })
        }
    }
    update(e) {
        this.frameCounter = (this.frameCounter + 1) % 1e3
    }
    draw(e) {
        const {
            doorWidth: t,
            frameCounter: s
        } = this, {
            width: o,
            height: n
        } = c;
        e.fillStyle = $, e.fillRect(0, 0, o, n), e.fillStyle = P, e.fillRect(0, 0, t, n), e.fillRect(o - t, 0, t, n), e.fillStyle = $, e.font = "bold 1px Georgia", e.font = `bold ${o*.9/e.measureText(be).width}px Georgia`, e.textAlign = "center", e.fillText(be, o / 2, n / 2), ~~(s / 50) % 2 !== 0 && (e.font = "32px Arial", e.fillText(`${w?"tap":"click"} to start`, o / 2, n * .6))
 
    }
    destroy() {
        onclick = null
    }
}
class et {
    constructor(e) {
        this.assets = e, this.tweener = new _e, this.context = c.getContext("2d", {
            willReadFrequently: !0
        }), this.scene = new ve(this), c.onclick = ({
            clientX: t,
            clientY: s
        }) => {
            const o = c.getBoundingClientRect(),
                n = c.width * c.clientHeight / c.height;
            this.scene.onClick(He(t - (c.clientWidth - n) / 2, 0, n) * c.width / n, (s - o.top) * c.height / c.clientHeight)
        }
    }
    changeScene(e, ...t) {
        const {
            scene: s,
            context: o
        } = this;
        s.destroy(), o.clearRect(0, 0, c.width, c.height);
        let n;
        switch (e) {
            case T.Title:
                n = new ve(this);
                break;
            case T.Game:
                n = new Je(this);
                break;
            case T.End:
                n = new Qe(this, ...t)
        }
        this.scene = n
    }
    update(e) {
        const {
            scene: t,
            tweener: s,
            context: o
        } = this;
        t.update(e), s.update(e), t.draw(o)
    }
    resize(e, t) {
        c.width = e, c.height = t, this.context.imageSmoothingEnabled = !1
    }
    handleRotation() {
        const e = screen.orientation.angle;
        e === 0 || e === 180 ? (c.style.transform = "rotate(0deg)", c.style.width = "100vw") : (e === 90 || e === -90) && (c.style.transform = "rotate(-90deg)", c.style.width = "auto")
    }
}
const tt = async () => {
    const r = await Be(),
        e = new et(r);
    let t, s, o = 0,
        n = !0;
    onfocus = () => n = !0, onblur = () => n = !1, Le(() => {
        n && (t = performance.now(), s = t - o, o = t, e.update(s))
    }), window.addEventListener("orientationchange", e.handleRotation), e.handleRotation()
};
tt();
onerror = r => {
    console.log("[onerror] ::", r)
};
onunhandledrejection = r => {
    Ve("[onunhandledrejection] ::", r.reason.message)
};