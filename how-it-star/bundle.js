(() => {
    "use strict";
    var t;
    ! function(t) {
        t.PROGRESS = "progress", t.LORE = "lore"
    }(t || (t = {}));
    class s {
        static NAMASPACE = "howItStarted_";
        static SET_DATA(t, e) {
            window.localStorage.setItem(s.NAMASPACE + t, e)
        }
        static GET_DATA(t) {
            return window.localStorage.getItem(s.NAMASPACE + t)
        }
    }
    class e {
        canvas;
        ctx;
        finishCallback;
        constructor(t, s, e) {
            this.canvas = t, this.ctx = s, this.finishCallback = e
        }
        init() {
            this.setEvents()
        }
        setEvents() {}
        deleteEvents() {}
        staticUpdate() {
            this.setMask(), this.ctx.textAlign = "center", this.ctx.textBaseline = "middle", this.setBG()
        }
        setMask() {}
        setBG() {
            this.ctx.fillStyle = "#FFFFFA", this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        }
        update(t) {
            this.setBG()
        }
    }
    class i extends e {
        size = 36;
        title = ["Thanks for playing the game!", "Hope you had fun :).", "Good luck!"];
        staticUpdate() {
            super.staticUpdate()
        }
        init() {
            setTimeout((() => {
                this.finishCallback()
            }), 1e4)
        }
        update(t) {
            super.update(t), this.ctx.font = `bold ${this.size}px Courier New`;
            const s = this.canvas.width / 2;
            this.ctx.fillStyle = "#008080", this.title.forEach(((t, e) => {
                this.ctx.fillText(t, s, this.canvas.height / 3 + e * this.size * 2)
            }))
        }
    }
    const h = (t, s) => new Path2D(`M${t},${s} h75 m0,50 h-75 m7.5,0 v-50 m15,0 v50 m15,0 v-50 m15,0 v50 m15,0 v-50`);
    async function o(t) {
        return new Promise((s => {
            setTimeout((() => {
                s()
            }), t)
        }))
    }

    function a(t, s) {
        const e = Math.ceil(t),
            i = Math.floor(s);
        return Math.floor(Math.random() * (i - e + 1) + e)
    }

    function n() {
        return [1, -1][a(0, 1)]
    }

    function r(t, s, e, i, h) {
        const o = t.measureText(s),
            a = i - o.alphabeticBaseline,
            n = o.ideographicBaseline - h / 12;
        return {
            left: e - o.width / 2 + h / 12,
            top: a + n,
            width: o.width - h / 6,
            height: -n
        }
    }

    function c(t, s) {
        const e = t.x < s.x ? 1 : -1,
            i = t.y < s.y ? 1 : -1,
            h = Math.abs(t.x - s.x),
            o = Math.abs(t.y - s.y),
            a = {
                x: 1,
                y: 1
            };
        return h > o ? a.y = o / h : a.x = h / o, a.x *= e, a.y *= i, a
    }

    function l(t, s, e) {
        return Math.abs(t.x - s.x) <= e && Math.abs(t.y - s.y) <= e
    }
    class d {
        ctx;
        x;
        y;
        width;
        height;
        constructor(t, s, e, i, h) {
            this.ctx = t, this.x = s, this.y = e, this.width = i, this.height = h
        }
        getPositionCenter() {
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            }
        }
        isCollisionWithObject(t) {
            return this.x + this.width >= t.x && this.x <= t.x + t.width && this.y + this.height >= t.y && this.y <= t.y + t.height
        }
    }
    class x extends d {
        content;
        constructor(t, s, e, i, h, o) {
            super(t, s, e, i, h), this.content = o
        }
        setFontStyle() {
            this.ctx.font = `bold ${this.width}px Courier New`
        }
        getHitArea() {
            return this.setFontStyle(), r(this.ctx, this.content, this.x, this.y, this.width)
        }
    }
    class p extends x {
        isBombDropped = !1;
        bombVelocity = 13;
        texts = ["A journey starts with one step", "Don't forget to be awesome", "You've never let me down", "You Matter", "Don't give up, you can do this", "You're making a big change", "You're so brave", "Small progress is still progress", "One step at a time, you're almost there", "Good Luck", "Your advertisement can be here", "This is a Easter Egg"];
        gameObjects = [];
        callback;
        init(t, s) {
            if (this.callback = t, s) return this.x = s.x, void(this.y = s.y);
            const e = a(300, this.ctx.canvas.width - 300),
                i = a(100, this.ctx.canvas.height - 100);
            this.x = e, this.y = i
        }
        showInteractHint() {
            if (+this.content > 1 || this.isProgressFinished) return;
            const {
                height: t
            } = this.getHitArea(), s = this.y - 1.4 * t, e = "#008080";
            this.ctx.save(), this.ctx.font = "bold 36px Courier New", this.ctx.fillStyle = e, this.ctx.strokeStyle = e, this.ctx.beginPath(), this.ctx.arc(this.x, s, 18, 0, 2 * Math.PI), this.ctx.lineWidth = 2, this.ctx.stroke(), this.ctx.fillText("E", this.x, s), this.ctx.restore()
        }
        prisonBarsDelta = 0;
        isDead = !1;
        draw() {
            this.ctx.save(), this.ctx.fillStyle = "#36454F", this.ctx.font = `bold ${this.width}px Courier New`, this.ctx.fillText(String(this.content), this.x, this.y);
            const {
                left: t,
                top: s
            } = this.getHitArea();
            let e = t;
            this.isProgressFinished && (e -= this.prisonBarsDelta);
            const i = h(e, s);
            if (this.ctx.lineWidth = 2, this.ctx.stroke(i), this.isProgressFinished || this.drawProgressBar(), this.isDead) {
                this.ctx.strokeStyle = "#CA2C92";
                const {
                    left: t,
                    top: s,
                    width: e,
                    height: i
                } = r(this.ctx, "12", this.x, this.y, this.width), h = new Path2D(`M${t},${s} l${e},${i} m0,${-i} l${-e},${i}`);
                this.ctx.lineWidth = 4, this.ctx.stroke(h)
            }
            this.ctx.restore()
        }
        openPrisonBars() {
            this.prisonBarsDelta += 2;
            const {
                width: t,
                height: s
            } = this.getHitArea();
            this.prisonBarsDelta >= t && (this.gameObjects = [], this.gameObjects.push((() => {
                this.ctx.save(), this.ctx.font = "bold 24px Courier New", this.ctx.fillStyle = "#36454F", this.ctx.fillText(this.texts[+this.content - 1], this.x, this.y - s), this.ctx.restore()
            })), this.callback())
        }
        progress = 100;
        drawProgressBar() {
            const t = this.prisonBarsMetrics.width / 2,
                s = this.x - t / 2,
                e = this.y - this.prisonBarsMetrics.height / 2 - 15;
            this.ctx.strokeRect(s, e, t, 10), this.ctx.fillRect(s, e, this.progress * t / 100, 10)
        }
        isProgressFinished = !1;
        doProgress() {
            this.isProgressFinished || (this.progress--, this.progress <= 0 && (this.isProgressFinished = !0, this.gameObjects.push((() => {
                this.openPrisonBars()
            }))))
        }
        prisonBarsMetrics = {
            width: 75,
            height: 50
        };
        getHitArea() {
            return {
                left: this.x - this.prisonBarsMetrics.width / 2,
                top: this.y - this.prisonBarsMetrics.height / 2,
                width: this.prisonBarsMetrics.width,
                height: this.prisonBarsMetrics.height
            }
        }
        render() {
            this.gameObjects.forEach((t => t())), this.draw()
        }
    }
    class u extends e {
        gameObjects = [];
        gameObjectIndexesForSave = [];
        positiveEmojis = ["(* ^ ω ^)", "(*￣▽￣)b", "ヽ(・∀・)ﾉ", "╰(▔∀▔)╯", "(─‿‿─)", "<(￣︶￣)>", "☆*:.｡.o(≧▽≦)o.｡.:*☆", "٩(◕‿◕｡)۶", "(￣ω￣)", "( • ⩊ • )", "(≧◡≦)", "\\(★ω★)/", "°˖✧◝(⁰▿⁰)◜✧˖°", "٩(｡•́‿•̀｡)۶", "⸜( *ˊᵕˋ* )⸝", "(￣▽￣*)ゞ", "(ง ื▿ ื)ว"];
        negativeEmojis = ["┌∩┐(◣_◢)┌∩┐", "Σ(▼□▼メ", "٩(╬ʘ益ʘ╬)۶", "(ﾉಥ益ಥ)ﾉ", "(｡•́︿•̀｡)", "(っ˘̩╭╮˘̩)っ", "(︶︹︺)", "←~(Ψ▼ｰ▼)∈", "ヾ(`ヘ´)ﾉﾞ", "(・`ω´・)", "(҂ `з´ )", "↑_(ΦwΦ)Ψ", "୧((#Φ益Φ#))୨", "ψ( ` ∇ ´ )ψ", "(ಥ﹏ಥ)", "＼(º □ º l|l)/", "(っ•﹏•)っ ✴==≡눈٩(`皿´҂)ง"];
        init() {
            super.init(), this.steps[this.currentStep]()
        }
        setEvents() {
            this.keydownHandler = this.keydownHandler.bind(this), document.addEventListener("keydown", this.keydownHandler)
        }
        deleteEvents() {
            document.removeEventListener("keydown", this.keydownHandler)
        }
        isAllowSkipAll;
        keydownHandler(t) {
            if ("Escape" === t.code && this.isAllowSkipAll && this.finish(), "Enter" === t.code || "Space" === t.code) {
                if (!this.isSkip) return;
                if (this.isSkip = !1, this.isLastStep()) return void this.finish();
                const t = [];
                this.gameObjectIndexesForSave.forEach((s => {
                    t.push(this.gameObjects[s])
                })), this.gameObjects = [...t], this.gameObjectIndexesForSave = [];
                for (let s = 0; s < t.length; s++) this.gameObjectIndexesForSave.push(s);
                this.currentStep++, this.steps[this.currentStep]()
            }
        }
        finish() {
            this.deleteEvents(), this.finishCallback()
        }
        isLastStep() {
            return this.currentStep === this.steps.length - 1
        }
        setMask() {
            this.ctx.clip(new Path2D(`M0,50 h${this.canvas.width} v${this.canvas.height-100} h-${this.canvas.width} z`))
        }
        currentStep = 0;
        async waitSkip(t) {
            await o(t), this.isSkip = !0
        }
        getCenterPos() {
            return {
                cX: this.canvas.width / 2,
                cY: this.canvas.height / 2.5
            }
        }
        steps = [];
        setStoryText(t) {
            this.ctx.font = "bold 24px Courier New", this.ctx.fillStyle = "#36454F", this.ctx.fillText(t, this.canvas.width / 2, this.canvas.height - this.canvas.height / 4), this.setSkipText()
        }
        isSkip = !1;
        setSkipText() {
            this.isSkip && (this.ctx.font = "bold 24px Courier New", this.ctx.fillStyle = "#e6b800", this.ctx.fillText("[Press Space or Enter to skip]", this.canvas.width / 2, this.canvas.height - this.canvas.height / 4 + 48)), this.setSkipAllText()
        }
        setSkipAllText() {
            this.isAllowSkipAll = !0, this.ctx.font = "bold 24px Courier New", this.ctx.fillStyle = "#008080", this.ctx.fillText("[Press ESC to skip all]", this.canvas.width / 2, this.canvas.height - this.canvas.height / 4 + 96)
        }
        update(t) {
            super.update(t), this.gameObjects.forEach((t => t()))
        }
    }
    class y extends u {
        prisioner;
        fontSize = 100;
        steps = [async () => {
            this.gameObjects.push((() => this.setStoryText(""))), this.prisioner = new p(this.ctx, void 0, void 0, this.fontSize / 2, this.fontSize / 2, "12"), this.prisioner.texts[11] = "I believed in you", this.gameObjects.push((() => {
                this.prisioner.init((() => {}), {
                    x: this.ctx.canvas.width / 2,
                    y: this.ctx.canvas.height / 3
                }), this.prisioner.render()
            })), this.gameObjectIndexesForSave.push(this.gameObjects.length - 1), this.waitSkip(500)
        }, async () => {
            this.gameObjects.push((() => {
                this.ctx.fillStyle = "#36454F", this.ctx.font = "bold 100px Courier New";
                const {
                    top: t,
                    height: s
                } = r(this.ctx, "0", this.prisioner.x, this.prisioner.y, 100);
                this.ctx.fillText("0", this.prisioner.x, this.prisioner.y + 1.5 * s), this.prisioner.doProgress()
            })), this.gameObjectIndexesForSave.push(this.gameObjects.length - 1), await o(3e3), this.gameObjects.push((() => this.setStoryText("0 saved all the members of the round table and now can face 13"))), this.waitSkip(1e3)
        }, async () => {
            this.prisioner.texts[11] = "", this.gameObjects.push((() => {
                this.setStoryText("however, at the most unexpected moment, 13 appeared")
            })), this.gameObjects.push((() => {
                const {
                    cX: t,
                    cY: s
                } = this.getCenterPos();
                this.ctx.font = "bold 100px Courier New", this.ctx.fillStyle = "#CA2C92", this.ctx.fillText("13", t + this.canvas.width / 4, s)
            })), this.waitSkip(1e3)
        }, async () => {
            let t = !0;
            this.gameObjects.push((() => {
                this.ctx.font = "bold 100px Courier New", this.ctx.fillStyle = "#CA2C92";
                const s = t ? a(-4, 4) : 0,
                    e = t ? a(-4, 4) : 0;
                this.ctx.fillText("13", this.prisioner.x + 1.5 * this.prisioner.getHitArea().width + s, this.prisioner.y + e)
            })), this.gameObjectIndexesForSave.push(this.gameObjects.length - 1), await o(1e3), t = !1, this.prisioner.isDead = !0, this.gameObjects.push((() => {
                this.setStoryText("and destroyed 12 before their union with the round table")
            })), this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("is it over?")
            })), this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("13 won?")
            })), this.waitSkip(1e3)
        }, async () => {
            o(500).then((() => {
                this.gameObjects.push((() => {
                    this.setStoryText("when it seemed there was no hope, they came")
                }))
            }));
            const t = [],
                s = [56, 72, 84, 49, 26, 15, 31, 64, -5, -21, 35, 44, -89, 156, 99];
            for (let e = 0; e < s.length; e++) {
                const i = a(100, this.ctx.canvas.width / 2 - 100) * n(),
                    h = a(100, this.ctx.canvas.height / 2 - 200) * n();
                let o = 0,
                    r = 0;
                const d = a(3, 5);
                let x = !0;
                t.push(new Promise((t => {
                    setTimeout((() => {
                        this.gameObjects.push((() => {
                            if (!x) return;
                            const {
                                cX: a,
                                cY: n
                            } = this.getCenterPos();
                            let p = a + i,
                                u = n + h;
                            if (this.isMoveTo12) {
                                const s = c({
                                    x: p,
                                    y: u
                                }, {
                                    x: this.prisioner.x,
                                    y: this.prisioner.y
                                });
                                o += s.x * d, r += s.y * d, p += o, u += r, l({
                                    x: p,
                                    y: u
                                }, {
                                    x: this.prisioner.x,
                                    y: this.prisioner.y
                                }, d) && (x = !1, p = this.prisioner.x, u = this.prisioner.y, t())
                            }
                            this.ctx.font = "bold 24px Courier New", this.ctx.fillStyle = "#36454F", this.ctx.fillText(String(s[e]), p, u)
                        })), this.gameObjectIndexesForSave.push(this.gameObjects.length - 1)
                    }), 100 * e)
                })))
            }
            Promise.all(t).then((() => {
                this.isMoveTo12 = !1, this.prisioner.isDead = !1
            })), this.waitSkip(2e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("they did not have the power of the members of the round table")
            })), this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("and could not replace 12")
            })), this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("12 was the youngest member of the round table")
            })), this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("he was cheerful, kind and happy to everyone")
            })), this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("so when 12 needed help, they didn't care about power 13, they wanted to save 12")
            })), this.waitSkip(1e3)
        }, async () => {
            this.isMoveTo12 = !0, o(500).then((() => {
                this.gameObjects.push((() => {
                    this.setStoryText("they united with him and gave hope")
                }))
            })), this.waitSkip(3e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("and the round table with all its members united with 0")
            })), this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("the final battle began")
            })), this.waitSkip(1e3)
        }];
        isMoveTo12 = !1;
        setSkipAllText() {
            +s.GET_DATA(t.LORE) > 1 && super.setSkipAllText()
        }
    }
    class m extends u {
        bgGameObjects = [];
        fly = !1;
        step = 0;
        offsetVisibleZone = 200;
        isNotVisible(t, s) {
            return t <= -this.offsetVisibleZone || t >= this.canvas.width + this.offsetVisibleZone || s <= -this.offsetVisibleZone || s >= this.canvas.height + this.offsetVisibleZone
        }
        steps = [async () => {
            this.gameObjects.push((() => this.setStoryText("From the beginning there was nothing"))), this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("and then it took shape")
            })), this.gameObjects.push((() => {
                const {
                    cX: t,
                    cY: s
                } = this.getCenterPos();
                this.ctx.fillStyle = "#36454F", this.ctx.font = "bold 100px Courier New", this.ctx.fillText("0", t, s)
            })), this.gameObjectIndexesForSave.push(this.gameObjects.length - 1), this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("everything appeared")
            })), await o(500), this.gameObjects.push((() => {
                const {
                    cX: t,
                    cY: s
                } = this.getCenterPos();
                this.ctx.save(), this.ctx.translate(t + 15, s - 75), this.ctx.rotate(-Math.PI / 2);
                const e = new Path2D("M0,0 v80 h15 v-80 h-15 m0,0 h-5 v-10 h25 v10 h-5 m5,-5 h10 v5 h10 v-30 h-10 v25 m0,-20 h-45 v-5 h-10 v30 h10 v-25 m0,20 h10");
                this.ctx.lineWidth = 2, this.ctx.stroke(e), this.ctx.restore()
            })), await o(500), await new Promise((t => {
                for (let s = 1; s <= 21; s++) setTimeout((() => {
                    this.gameObjects.push((() => {
                        const {
                            cX: t,
                            cY: e
                        } = this.getCenterPos();
                        this.ctx.font = "bold 24px Courier New", this.ctx.fillStyle = "#36454F";
                        const i = this.ctx.measureText(String(10 * s)),
                            h = s >= 10 ? 9 * (~~i.width - ~~this.ctx.measureText("10").width) : 0;
                        this.ctx.fillText(String(s).replace("21", "..."), t + 15 + s * i.width - h, e), this.ctx.fillText(String(-s).replace("-21", "..."), t - 15 - s * i.width + h, e)
                    })), 21 === s && t()
                }), 100 * s)
            })), this.waitSkip(500)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("0 shared his power from 1st to 12th and they formed a round table led by 0")
            })), await new Promise((t => {
                for (let s = 1, e = 210; s <= 12; s++, e += 30) setTimeout((() => {
                    let i = -e * (Math.PI / 180);
                    this.gameObjects.push((() => {
                        const {
                            cX: t,
                            cY: e
                        } = this.getCenterPos();
                        this.ctx.fillStyle = "#36454F", this.ctx.font = "bold 50px Courier New";
                        const h = this.fly ? this.step : 0,
                            o = t + (150 + h * s) * Math.sin(i),
                            a = e + (150 + h * s) * Math.cos(i);
                        this.isNotVisible(o, a) || this.ctx.fillText(String(s), o, a)
                    })), this.gameObjectIndexesForSave.push(this.gameObjects.length - 1), 12 === s && setTimeout((() => {
                        this.gameObjects.push((() => {
                            const {
                                cX: t,
                                cY: s
                            } = this.getCenterPos();
                            this.ctx.beginPath(), this.ctx.arc(t, s, 150 - this.ctx.measureText("1").width, 0, 2 * Math.PI), this.ctx.lineWidth = 2, this.ctx.stroke()
                        })), this.gameObjectIndexesForSave.push(this.gameObjects.length - 1), t()
                    }), 150)
                }), 150 * s)
            })), this.waitSkip(500)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("everything was in harmony")
            }));
            for (let t = 0; t < this.positiveEmojis.length; t++) {
                const s = 16,
                    e = a(s, this.canvas.width - s),
                    i = a(s + 50, this.canvas.height - s - 50);
                this.bgGameObjects.push((() => {
                    this.ctx.fillStyle = "#36454F", this.ctx.font = `bold ${s}px Courier New`, this.ctx.fillText(this.positiveEmojis[t], e, i)
                }))
            }
            this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("until 13 envied the power of twelve")
            }));
            let t = !0;
            this.gameObjects.push((() => {
                const {
                    cX: s,
                    cY: e
                } = this.getCenterPos();
                this.ctx.font = "bold 50px Courier New", this.ctx.fillStyle = "#CA2C92";
                const i = t ? a(-4, 4) : 0,
                    h = t ? a(-4, 4) : 0;
                this.ctx.fillText("13", s + this.canvas.width / 4 + i, e + h)
            })), this.gameObjectIndexesForSave.push(this.gameObjects.length - 1), this.waitSkip(1e3), await o(1e3), t = !1
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("and then tricked and imprisoned the members of the round table")
            })), await o(500), await new Promise((t => {
                for (let s = 1, e = 210; s <= 12; s++, e += 30) setTimeout((() => {
                    this.gameObjects.push((() => {
                        const {
                            cX: t,
                            cY: i
                        } = this.getCenterPos();
                        let o = -e * (Math.PI / 180);
                        const a = this.fly ? this.step * s : 0,
                            n = t + (150 + a) * Math.sin(o) - 37.5,
                            r = i + (150 + a) * Math.cos(o) - 25;
                        if (this.isNotVisible(n, r)) return;
                        const c = h(n, r);
                        this.ctx.lineWidth = 2, this.ctx.stroke(c)
                    })), this.gameObjectIndexesForSave.push(this.gameObjects.length - 1), 12 === s && t()
                }), 150 * s)
            })), this.waitSkip(500)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("and separated them")
            })), this.fly = !0, await o(3e3), this.waitSkip(0)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("0 lost his power and was unable to stop 13")
            })), this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("there was only hope for unification with all the members of the round table")
            })), this.gameObjectIndexesForSave.splice(0, 1), this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("so 0 disappeared in their search")
            })), this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("and chaos began, led by 13")
            })), this.bgGameObjects = [];
            for (let t = 0; t < this.negativeEmojis.length; t++) {
                const s = 16,
                    e = a(s, this.canvas.width - s),
                    i = a(s + 50, this.canvas.height - s - 50);
                this.bgGameObjects.push((() => {
                    this.ctx.fillStyle = "#36454F", this.ctx.font = `bold ${s}px Courier New`, this.ctx.fillText(this.negativeEmojis[t], e, i)
                })), this.gameObjectIndexesForSave.push(this.gameObjects.length - 1)
            }
            this.waitSkip(1e3)
        }];
        update(t) {
            super.update(t), this.bgGameObjects.forEach((t => t())), this.gameObjects.forEach((t => t())), this.fly && this.step <= 1e3 && (this.step += 3)
        }
        setSkipAllText() {
            +s.GET_DATA(t.LORE) > 0 && super.setSkipAllText()
        }
    }
    class b extends u {
        steps = [async () => {
            this.gameObjects.push((() => {
                this.setStoryText("In the confrontation between 0 and 13 - 0 got the victory")
            })), this.gameObjects.push((() => {
                const {
                    cX: t,
                    cY: s
                } = this.getCenterPos();
                this.ctx.fillStyle = "#36454F", this.ctx.font = "bold 100px Courier New", this.ctx.fillText("0", t, s)
            })), this.gameObjectIndexesForSave.push(this.gameObjects.length - 1), this.gameObjects.push((() => {
                const {
                    cX: t,
                    cY: s
                } = this.getCenterPos();
                this.ctx.font = "bold 50px Courier New", this.ctx.fillStyle = "#CA2C92", this.ctx.fillText("13", t + this.canvas.width / 4, s)
            })), this.gameObjectIndexesForSave.push(this.gameObjects.length - 1), this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("although 13 did a lot of damage")
            })), this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("0 did not leave him")
            })), this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("moreover, he invited him to the round table")
            })), this.waitSkip(1e3), this.gameObjectIndexesForSave.splice(1, 1)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("now there are 13 of them")
            }));
            const t = 360 / 13;
            await new Promise((s => {
                for (let e = 1, i = 7 * t; e <= 13; e++, i += t) setTimeout((() => {
                    let t = -i * (Math.PI / 180);
                    this.gameObjects.push((() => {
                        const {
                            cX: s,
                            cY: i
                        } = this.getCenterPos();
                        this.ctx.fillStyle = "#36454F", this.ctx.font = "bold 50px Courier New";
                        const h = s + 150 * Math.sin(t),
                            o = i + 150 * Math.cos(t);
                        this.ctx.fillText(String(e), h, o)
                    })), this.gameObjectIndexesForSave.push(this.gameObjects.length - 1), 13 === e && setTimeout((() => {
                        this.gameObjects.push((() => {
                            const {
                                cX: t,
                                cY: s
                            } = this.getCenterPos();
                            this.ctx.beginPath(), this.ctx.arc(t, s, 150 - this.ctx.measureText("1").width, 0, 2 * Math.PI), this.ctx.lineWidth = 2, this.ctx.stroke()
                        })), this.gameObjectIndexesForSave.push(this.gameObjects.length - 1), s()
                    }), 150)
                }), 150 * e)
            })), this.waitSkip(500), this.waitSkip(1e4)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("everything was in harmony again")
            }));
            for (let t = 0; t < this.positiveEmojis.length; t++) {
                const s = 16,
                    e = a(s, this.canvas.width - s),
                    i = a(s + 50, this.canvas.height - s - 50);
                this.gameObjects.push((() => {
                    this.ctx.fillStyle = "#36454F", this.ctx.font = `bold ${s}px Courier New`, this.ctx.fillText(this.positiveEmojis[t], e, i)
                })), this.gameObjectIndexesForSave.push(this.gameObjects.length - 1)
            }
            this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("wait a minute...")
            })), this.waitSkip(1e3)
        }, async () => {
            this.gameObjects.push((() => {
                this.setStoryText("WTF?")
            }));
            let t = !0;
            this.gameObjects.push((() => {
                const {
                    cX: s,
                    cY: e
                } = this.getCenterPos();
                this.ctx.font = "bold 50px Courier New", this.ctx.fillStyle = "#CA2C92";
                const i = t ? a(-4, 4) : 0,
                    h = t ? a(-4, 4) : 0;
                this.ctx.fillText("14", s + this.canvas.width / 4 + i, e + h)
            })), this.gameObjectIndexesForSave.push(this.gameObjects.length - 1), this.waitSkip(1e3), await o(2e3), t = !1
        }];
        setSkipAllText() {
            +s.GET_DATA(t.LORE) > 2 && super.setSkipAllText()
        }
    }
    class g extends e {
        data;
        constructor(t, s, e, i) {
            super(t, s, e), this.data = i, this.colors = new Array(this.data.items.length).fill(this.baseColor)
        }
        hitAreas = [];
        baseColor = "#36454F";
        hoverColor = "#CA2C92";
        colors;
        size = 36;
        setEvents() {
            this.mouseMoveHandler = this.mouseMoveHandler.bind(this), this.mouseDownHandler = this.mouseDownHandler.bind(this), document.addEventListener("mousemove", this.mouseMoveHandler), document.addEventListener("mousedown", this.mouseDownHandler)
        }
        deleteEvents() {
            document.removeEventListener("mousemove", this.mouseMoveHandler), document.removeEventListener("mousedown", this.mouseDownHandler)
        }
        mouseMoveHandler(t) {
            t.button || (this.canvas.style.cursor = "", this.hitAreas.forEach(((s, e) => {
                this.data.interactive[e] && (this.colors[e] = this.baseColor, this.isPointInArea({
                    x: t.clientX,
                    y: t.clientY
                }, s) && (this.canvas.style.cursor = "pointer", this.colors[e] = this.hoverColor))
            })))
        }
        mouseDownHandler(t) {
            t.button || this.hitAreas.forEach(((s, e) => {
                this.data.interactive[e] && this.isPointInArea({
                    x: t.clientX,
                    y: t.clientY
                }, s) && (this.canvas.style.cursor = "", this.deleteEvents(), this.finishCallback(), this.data.callbacks[e]())
            }))
        }
        isPointInArea(t, s) {
            const {
                left: e,
                top: i,
                width: h,
                height: o
            } = s;
            return t.x >= e && t.x <= e + h && t.y >= i && t.y <= i + o
        }
        update(t) {
            super.update(t), this.ctx.font = `bold ${this.size}px Courier New`;
            const s = this.canvas.width / 2;
            this.data.title && (this.ctx.fillStyle = "#008080", this.data.title.forEach(((t, e) => {
                this.ctx.fillText(t, s, this.canvas.height / 3 + 48 * e)
            }))), this.hitAreas = [], this.data.items.forEach(((t, e) => {
                this.data.interactive[e] || (this.ctx.globalAlpha = .5), this.ctx.fillStyle = this.colors[e];
                const i = this.canvas.height / (this.data.title ? 2 : 3) + 72 * e;
                this.ctx.fillText(t, s, i), this.ctx.globalAlpha = 1, this.hitAreas.push(r(this.ctx, t, s, i, this.size))
            }))
        }
    }
    class w extends e {
        popup;
        staticUpdate() {
            super.staticUpdate(), this.popup?.staticUpdate()
        }
        init() {
            const e = +s.GET_DATA(t.PROGRESS),
                i = {
                    items: [`Continue (${Math.round(e/13*100)}%)`, "Start new game", "Options"],
                    interactive: [!!s.GET_DATA(t.PROGRESS), !0, !0],
                    callbacks: [() => {
                        this.finishCallback(E.WORLD)
                    }, () => {
                        s.SET_DATA(t.PROGRESS, ""), this.finishCallback()
                    }, () => {
                        this.finishCallback(E.OPTIONS)
                    }]
                };
            this.popup = new g(this.ctx.canvas, this.ctx, (() => {}), i), this.staticUpdate(), this.popup.init()
        }
        update(t) {
            super.update(t), this.popup?.update(t)
        }
    }
    class S extends e {
        setEvents() {
            this.keydownHandler = this.keydownHandler.bind(this), document.addEventListener("keydown", this.keydownHandler)
        }
        deleteEvents() {
            document.removeEventListener("keydown", this.keydownHandler)
        }
        keydownHandler(t) {
            "Enter" !== t.code && "Space" !== t.code || (this.deleteEvents(), this.finishCallback())
        }
        size = 36;
        title = ["Movement - [WASD / Arrow Keys]", "Interaction - [E]", "Attack - [LMB (left mouse button)]", "Skip - [Space / Enter]", "Skip all - [ESC]"];
        update(t) {
            super.update(t), this.ctx.font = `bold ${this.size}px Courier New`;
            const s = this.canvas.width / 2;
            this.ctx.fillStyle = "#008080", this.title.forEach(((t, e) => {
                this.ctx.fillText(t, s, this.canvas.height / 6 + e * this.size * 2)
            })), this.ctx.font = "bold 24px Courier New", this.ctx.fillStyle = "#e6b800", this.ctx.fillText("[Press Space or Enter to skip]", this.canvas.width / 2, this.canvas.height - this.canvas.height / 4 + 48)
        }
    }
    class v extends d {
        isBombDropped = !1;
        bombVelocity = 13;
        gameObjects = [];
        callback;
        isSkipRender = !1;
        isDamage;
        moveTo;
        init(t, s) {
            this.moveTo = t, this.callback = s
        }
        isMove = !0;
        async move() {
            if (!this.isMove) return;
            const t = c({
                x: this.x,
                y: this.y
            }, this.moveTo);
            this.x += t.x * this.bombVelocity, this.y += t.y * this.bombVelocity, l({
                x: this.x,
                y: this.y
            }, this.moveTo, this.bombVelocity) && (this.x = this.moveTo.x, this.y = this.moveTo.y, this.isMove = !1, await this.preExplode(), await this.explode(), await this.explosionParticles(40), setTimeout((() => {
                this.isSkipRender = !0, this.callback()
            }), 0))
        }
        async preExplode() {
            this.gameObjects.push((() => {
                const t = [];
                for (let s = 0; s < 2; s++) t.push(a(-2, 2));
                this.x += t[0], this.y += t[1]
            })), await o(a(750, 2200)), this.gameObjects.pop()
        }
        explodeVelocity = 50;
        explodeRadius = 0;
        maxR = 130;
        async explode() {
            return new Promise((t => {
                this.gameObjects.push((() => {
                    this.explodeRadius += this.explodeVelocity, Math.abs(this.maxR - this.explodeRadius) <= this.explodeVelocity && (this.explodeRadius = this.maxR, t()), this.ctx.save(), this.ctx.fillStyle = "#36454F", this.ctx.strokeStyle = "#36454F", this.ctx.globalAlpha = .05, this.ctx.fillRect(this.x - this.explodeRadius, this.y - this.explodeRadius, 2 * this.explodeRadius, 2 * this.explodeRadius), this.ctx.globalAlpha = 1, this.ctx.strokeRect(this.x - this.explodeRadius, this.y - this.explodeRadius, 2 * this.explodeRadius, 2 * this.explodeRadius), this.ctx.restore()
                }))
            }))
        }
        explosionParticles(t) {
            const s = [];
            for (let e = 0; e < t; e++) s.push(new Promise((t => {
                let s = this.x,
                    e = this.y;
                const i = a(5, 15),
                    h = a(5, 15);
                let o = !0;
                const r = a(15, 25),
                    d = {
                        x: s + a(0, this.explodeRadius) * n(),
                        y: e + a(0, this.explodeRadius) * n()
                    },
                    x = a(1, 9) / 10;
                this.gameObjects.push((() => {
                    if (this.ctx.save(), this.ctx.fillStyle = "#36454F", this.ctx.globalAlpha = x, this.ctx.fillRect(s - i / 2, e - h / 2, i, h), this.ctx.globalAlpha = 1, this.ctx.restore(), !o) return;
                    const a = c({
                        x: s,
                        y: e
                    }, d);
                    s += a.x * r, e += a.y * r, l({
                        x: s,
                        y: e
                    }, d, r) && (s = d.x, e = d.y, o = !1, t())
                }))
            })));
            return s.push(new Promise((t => {
                this.gameObjects.push((() => {
                    this.shakeWorld()
                })), o(250).then((() => {
                    this.clearShakeWorld(), t()
                }))
            }))), Promise.all(s)
        }
        draw() {
            this.ctx.lineWidth = 2, this.ctx.strokeStyle = "#36454F";
            const t = ((t, s) => {
                const e = new Path2D(`M${t},${s-20+2} m-10,0 v-10 h20 v10 m-10,-10 q0,-15 30,-15 l-5,-5 l5,5 v-5 v5 h5 h-5 l5,5 l-5,-5 v5 v-5 l-5,5`);
                return e.moveTo(t + 20, s), e.arc(t, s, 20, 0, 2 * Math.PI), e.moveTo(t + 10, s), e.arc(t, s, 10, 0, 2 * Math.PI), e
            })(this.x, this.y);
            this.ctx.stroke(t)
        }
        getHitArea() {
            const t = {
                left: this.x - this.explodeRadius,
                top: this.y - this.explodeRadius,
                width: 2 * this.explodeRadius,
                height: 2 * this.explodeRadius
            };
            return this.isSkipRender && (t.width = 0), t
        }
        render() {
            this.isSkipRender || (this.gameObjects.forEach((t => t())), this.draw(), this.move())
        }
        isSkake = !0;
        shakeWorld() {
            if (!this.isSkake) return;
            const t = a(-8, 8),
                s = a(-8, 8);
            this.ctx.translate(t, s)
        }
        clearShakeWorld() {
            this.isSkake = !1, this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        }
    }
    class f extends x {
        velocity = 16;
        moveTo;
        bombs = [];
        isBossMode;
        setBerserkMode() {
            this.bombCount = a(4, 8), this.bombRadius = 400
        }
        isStopRender;
        init(t) {
            this.isBossMode = t, this.setMoveTo()
        }
        render(t) {
            this.isStopRender || this.move(), this.draw(), this.bombs.forEach((t => t.render()))
        }
        isDead;
        draw() {
            if (this.ctx.fillStyle = "#CA2C92", this.setFontStyle(), this.ctx.fillText(this.content, this.x, this.y), this.isDead) {
                this.ctx.save(), this.ctx.strokeStyle = "#36454F";
                const {
                    left: t,
                    top: s,
                    width: e,
                    height: i
                } = this.getHitArea(), h = new Path2D(`M${t},${s} l${e},${i} m0,${-i} l${-e},${i}`);
                this.ctx.lineWidth = 4, this.ctx.stroke(h), this.ctx.restore()
            }
        }
        isMoveStop = !0;
        move() {
            if (this.isMoveStop) return;
            if (this.x === this.moveTo.x && this.y === this.moveTo.y) return this.isMoveStop = !0, void setTimeout((() => {
                this.setMoveTo(), this.isDropBombs = !1
            }), 500);
            const t = Math.abs(this.x - this.moveTo.x),
                s = Math.abs(this.y - this.moveTo.y);
            let e, i;
            if (t < this.velocity) e = t;
            else {
                const s = Math.abs(this.startMovePos.x - this.moveTo.x);
                t > s / 3 && t < 2 * s / 3 ? (e = this.velocity / 5, this.dropBombs()) : e = this.velocity
            }
            if (s < this.velocity) i = s;
            else {
                const t = Math.abs(this.startMovePos.y - this.moveTo.y);
                s > t / 3 && s < 2 * t / 3 ? (i = this.velocity / 5, this.dropBombs()) : i = this.velocity
            }
            const h = c({
                x: this.x,
                y: this.y
            }, this.moveTo);
            this.x += h.x * e, this.y += h.y * i
        }
        startMovePos;
        setMoveTo() {
            const {
                width: t,
                height: s
            } = this.getHitArea();
            this.startMovePos = {
                x: this.x,
                y: this.y
            }, this.moveTo = {
                x: a(t / 2, this.ctx.canvas.width - t / 2),
                y: a(s / 2 + s / 12, this.ctx.canvas.height - s / 2 + s / 12)
            }, this.isMoveStop = !1
        }
        bombCount = 2;
        bombRadius = 150;
        isDropBombs = !1;
        async dropBombs() {
            if (!this.isBossMode) return;
            if (this.isDropBombs) return;
            this.isDropBombs = !0;
            const t = [];
            for (let s = 0; s < this.bombCount; s++) await o(100 * s), t.push(new Promise((t => {
                const s = new v(this.ctx, this.x, this.y, 0, 0);
                this.bombs.push(s), s.init({
                    x: a(this.x - this.bombRadius, this.x + this.bombRadius),
                    y: a(this.y - this.bombRadius, this.y + this.bombRadius)
                }, (() => {
                    t()
                }))
            })));
            await Promise.all(t), this.bombs = this.bombs.filter((t => !t.isSkipRender))
        }
    }
    class O extends d {
        getHitArea() {
            return {
                left: this.x - this.width,
                top: this.y - this.height,
                width: 2 * this.width,
                height: 2 * this.height
            }
        }
        positionMovement;
        step;
        velocity;
        id;
        isDamage;
        color;
        constructor(t, s, e, i, h, o = 5) {
            const {
                x: a,
                y: n
            } = s.start;
            super(t, a, n, o, o), this.id = e, this.color = h, this.positionMovement = this.correctPositionMovement(s), this.x = s.start.x, this.y = s.start.y, this.step = c(this.positionMovement.start, this.positionMovement.end), this.velocity = i
        }
        correctPositionMovement({
            start: t,
            end: s
        }) {
            return {
                start: t,
                end: {
                    x: s.x - this.width / 2,
                    y: s.y - this.height / 2
                }
            }
        }
        render() {
            this.draw(), this.move()
        }
        draw() {
            this.ctx.save(), this.ctx.beginPath(), this.ctx.fillStyle = this.color, this.ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI), this.ctx.fill(), this.ctx.restore()
        }
        move() {
            this.x += this.step.x * this.velocity, this.y += this.step.y * this.velocity
        }
    }
    class T extends x {
        velocity = 8;
        isBossMode;
        init(t) {
            this.isBossMode = t, t && (this.isShowInteractHint = !0), this.setEvents()
        }
        isStopRender;
        setEvents() {
            this.keydownHandler = this.keydownHandler.bind(this), this.keyupHandler = this.keyupHandler.bind(this), this.mousedownHandler = this.mousedownHandler.bind(this), document.addEventListener("keydown", this.keydownHandler), document.addEventListener("keyup", this.keyupHandler), document.addEventListener("mousedown", this.mousedownHandler)
        }
        deleteEvents() {
            document.removeEventListener("keydown", this.keydownHandler), document.removeEventListener("keyup", this.keyupHandler), document.removeEventListener("mousedown", this.mousedownHandler)
        }
        keysPressed = [];
        keydownHandler(t) {
            this.isStopRender || (this.keysPressed.push(t.code), this.keysPressed = [...new Set(this.keysPressed)])
        }
        keyupHandler(t) {
            this.isStopRender || this.deletePressedKey(t.code)
        }
        mousedownHandler(t) {
            if (!this.isStopRender && !t.button && this.isBossMode) {
                this.isShowInteractHint = !1;
                const {
                    top: s,
                    height: e
                } = this.getHitArea();
                this.attack({
                    x: this.x,
                    y: s + e / 2
                }, {
                    x: t.clientX,
                    y: t.clientY
                }, 16)
            }
        }
        deletePressedKey(t) {
            const s = this.keysPressed.findIndex((s => s === t));
            s > -1 && this.keysPressed.splice(s, 1)
        }
        bulletObjects = [];
        attack(t, s, e) {
            const i = new O(this.ctx, {
                start: t,
                end: s
            }, this.bulletObjects.length, e, "#36454F");
            this.bulletObjects.push(i)
        }
        destroyBulletObject(t) {
            this.bulletObjects.splice(this.bulletObjects.findIndex((s => s.id === t)), 1)
        }
        render(t) {
            this.isStopRender || this.move(), this.bulletObjects.forEach((t => t.render())), this.draw()
        }
        isDead;
        draw() {
            if (this.ctx.fillStyle = "#36454F", this.setFontStyle(), this.ctx.fillText(this.content, this.x, this.y), this.isDead) {
                this.ctx.save(), this.ctx.strokeStyle = "#CA2C92";
                const {
                    left: t,
                    top: s,
                    width: e,
                    height: i
                } = this.getHitArea(), h = new Path2D(`M${t},${s} l${e},${i} m0,${-i} l${-e},${i}`);
                this.ctx.lineWidth = 4, this.ctx.stroke(h), this.ctx.restore()
            }
            this.showInteractHint()
        }
        move() {
            let t = 0,
                s = 0;
            this.keysPressed.forEach((e => {
                "ArrowUp" !== e && "KeyW" !== e || s--, "ArrowRight" !== e && "KeyD" !== e || t++, "ArrowDown" !== e && "KeyS" !== e || s++, "ArrowLeft" !== e && "KeyA" !== e || t--
            }));
            const e = t * this.velocity * 1,
                i = s * this.velocity * 1,
                h = {
                    x: this.x + e,
                    y: this.y + i
                };
            this.isWorldCollision({
                x: h.x,
                y: this.y
            }) || (this.x = h.x), this.isWorldCollision({
                x: this.x,
                y: h.y
            }) || (this.y = h.y)
        }
        isInteraction() {
            return this.keysPressed.includes("KeyE")
        }
        isShowInteractHint;
        showInteractHint() {
            if (!this.isShowInteractHint) return;
            const {
                height: t
            } = this.getHitArea(), s = this.y - 1.4 * t, e = "#008080";
            this.ctx.save(), this.ctx.font = "bold 24px Courier New", this.ctx.fillStyle = e, this.ctx.strokeStyle = e, this.ctx.beginPath(), this.ctx.arc(this.x, s, 24, 0, 2 * Math.PI), this.ctx.lineWidth = 2, this.ctx.stroke(), this.ctx.fillText("Click", this.x, s), this.ctx.restore()
        }
        isWorldCollision(t) {
            this.setFontStyle();
            const {
                left: s,
                top: e,
                width: i,
                height: h
            } = r(this.ctx, this.content, t.x, t.y, this.width);
            return s < 0 || e < 0 || s + i > this.ctx.canvas.width || e + h > this.ctx.canvas.height
        }
        isCollisionWithObject(t, s = this) {
            const {
                left: e,
                top: i,
                width: h,
                height: o
            } = s.getHitArea();
            let a = t.getHitArea();
            return !(t instanceof v && (!a.width || !a.height)) && e + h >= a.left && e <= a.left + a.width && i + o >= a.top && i <= a.top + a.height
        }
    }
    class k extends d {
        color;
        constructor(t, s, e, i, h, o) {
            super(t, s, e, i, h), this.color = o
        }
        getHitArea() {
            throw new Error("Method not implemented.")
        }
        render() {
            this.draw()
        }
        progress = 100;
        draw() {
            this.ctx.save(), this.ctx.fillStyle = this.color, this.ctx.strokeStyle = this.color, this.ctx.strokeRect(this.x, this.y, this.width, this.height), this.ctx.fillRect(this.x, this.y, this.progress * this.width / 100, this.height), this.ctx.restore()
        }
        isProgressFinished = !1;
        doProgress(t) {
            this.isProgressFinished || (this.progress -= t, this.progress <= 0 && (this.isProgressFinished = !0))
        }
    }
    class j extends e {
        fontSize = 100;
        gameObjects = [];
        player;
        enemy;
        prisionerObjects = [];
        progressBarObjects = [];
        isBossLevel;
        init() {
            super.init();
            const e = +s.GET_DATA(t.PROGRESS);
            e && (this.prisionersStatus.current = e + 1, e >= this.prisionersStatus.max && (this.isBossLevel = !0)), this.player = new T(this.ctx, this.canvas.width / 2, this.canvas.height / 2, this.fontSize, this.fontSize, "0"), this.player.init(this.isBossLevel), this.enemy = new f(this.ctx, 2 * this.player.x, 2 * this.player.y, this.fontSize, this.fontSize, "13"), this.enemy.init(this.isBossLevel), this.isBossLevel ? this.progressBarObjects.push(new k(this.ctx, 20, 50, 250, 20, "#008080"), new k(this.ctx, this.canvas.width - 274, 50, 250, 20, "#008080")) : this.showPrisoner()
        }
        prisionersStatus = {
            current: 1,
            max: 12
        };
        showPrisoner() {
            setTimeout((() => {
                const e = new p(this.ctx, void 0, void 0, this.fontSize / 2, this.fontSize / 2, String(this.prisionersStatus.current));
                e.init((() => {
                    this.prisionersStatus.current + 1 > this.prisionersStatus.max && (this.isStopRender = !0, this.player.isStopRender = !0, this.enemy.isStopRender = !0), s.SET_DATA(t.PROGRESS, String(this.prisionersStatus.current)), setTimeout((() => {
                        this.prisionerObjects = [], this.prisionersStatus.current++, this.prisionersStatus.current <= this.prisionersStatus.max ? setTimeout((() => {
                            this.showPrisoner()
                        }), 2e3) : this.finishCallback()
                    }), 3e3)
                })), this.prisionerObjects.push(e)
            }), 0)
        }
        isStopRender = !1;
        popup;
        async setResult(e = !1) {
            if (this.isStopRender = !0, this.player.isStopRender = !0, this.player.isDead = !e, this.enemy.isDead = e, this.enemy.isStopRender = !0, await o(2e3), e) this.battleFinishAnimation(), s.SET_DATA(t.PROGRESS, "13"), this.finishCallback(E.OUTRO);
            else {
                const t = {
                    title: ["Everything was a little different,", "let me show you how it really was"],
                    items: ["Repeat", "Back to menu"],
                    interactive: [!0, !0],
                    callbacks: [() => {
                        this.finishCallback(E.WORLD)
                    }, () => {
                        this.finishCallback(E.MENU)
                    }]
                };
                this.popup = new g(this.ctx.canvas, this.ctx, (() => {}), t), this.popup.staticUpdate(), this.popup.init()
            }
        }
        battleFinishAnimation() {}
        update(t) {
            super.update(t), this.draw(), this.prisionerObjects.forEach((t => t.render())), this.progressBarObjects.forEach(((t, s) => {
                s && (t.x = this.canvas.width - 274), t.render()
            })), this.player.render(), this.enemy.render(), this.popup?.update(t), this.isStopRender || this.detectCollisions(), this.gameObjects.forEach((t => t()))
        }
        draw() {
            this.isBossLevel ? this.progressBarObjects.forEach(((t, s) => {
                this.drawBossStatus(s)
            })) : this.drawStatus()
        }
        drawStatus() {
            this.ctx.save(), this.ctx.font = "bold 24px Courier New", this.ctx.fillStyle = "#008080";
            const {
                current: t,
                max: s
            } = this.prisionersStatus, e = `Rescued: ${t-1}/${s}`, {
                left: i,
                width: h,
                height: o
            } = r(this.ctx, e, 0, 0, 24);
            this.ctx.fillText(e, i + h + 24, o + 24), this.ctx.restore()
        }
        drawBossStatus(t) {
            let s;
            this.ctx.save(), this.ctx.font = "bold 24px Courier New", this.ctx.fillStyle = "#008080", s = t ? `Thirteen: ${this.progressBarObjects[t].progress}/100` : `Zero:\t\t\t\t\t${this.progressBarObjects[t].progress}/100`;
            const {
                left: e,
                width: i,
                height: h
            } = r(this.ctx, s, 0, 0, 24);
            let o = e + i + 24;
            t && (o = this.canvas.width - 150), this.ctx.fillText(s, o, h + 24), this.ctx.restore()
        }
        detectCollisions() {
            this.player.isCollisionWithObject(this.enemy) && (this.isBossLevel || this.setResult(!1));
            for (let t = 0; t < this.player.bulletObjects.length; t++)
                if (this.player.isCollisionWithObject(this.enemy, this.player.bulletObjects[t]) && !this.player.bulletObjects[t].isDamage) {
                    let s;
                    this.player.bulletObjects[t].isDamage = !0, this.player.destroyBulletObject(this.player.bulletObjects[t].id), this.progressBarObjects[1].progress <= 50 ? (this.enemy.setBerserkMode(), s = 1) : s = 5, this.progressBarObjects[1].doProgress(s), this.progressBarObjects[1].progress <= 0 && this.setResult(!0)
                } for (let t = 0; t < this.enemy.bombs.length; t++) this.player.isCollisionWithObject(this.enemy.bombs[t]) && (this.enemy.bombs[t].isDamage || (this.enemy.bombs[t].isDamage = !0, this.progressBarObjects[0].doProgress(25), this.progressBarObjects[0].progress <= 0 && this.setResult(!1)));
            for (let t = 0; t < this.prisionerObjects.length; t++)
                if (this.player.isCollisionWithObject(this.prisionerObjects[t])) {
                    this.prisionerObjects[t].showInteractHint(), this.player.isInteraction() && this.prisionerObjects[t].doProgress();
                    break
                }
        }
    }
    var E;
    ! function(t) {
        t[t.MENU = 0] = "MENU", t[t.INTRO = 1] = "INTRO", t[t.WORLD = 2] = "WORLD", t[t.CULMINATION = 3] = "CULMINATION", t[t.OUTRO = 4] = "OUTRO", t[t.GRATITUDE = 5] = "GRATITUDE", t[t.OPTIONS = 6] = "OPTIONS"
    }(E || (E = {})), new class {
        canvas;
        ctx;
        scenes = [];
        activeSceneIndex = -1;
        constructor(e) {
            this.canvas = e, this.ctx = e.getContext("2d", {
                willReadFrequently: !1,
                alpha: !1
            }), s.GET_DATA(t.PROGRESS) ?? s.SET_DATA(t.PROGRESS, ""), this.nextScene(), this.resize(), this.setEvents(), this.render(0)
        }
        nextScene(t) {
            this.scenes.splice(this.activeSceneIndex, 1), this.activeSceneIndex = t ?? this.activeSceneIndex + 1, this.scenes = [], this.scenes = [this.sceneFactory()], this.resize(), this.scenes[0].init()
        }
        sceneFactory() {
            switch (this.activeSceneIndex) {
                case E.MENU:
                    return new w(this.canvas, this.ctx, (t => {
                        this.nextScene(t)
                    }));
                case E.INTRO:
                    return new m(this.canvas, this.ctx, (() => {
                        s.GET_DATA(t.LORE) ?? s.SET_DATA(t.LORE, "1"), this.nextScene()
                    }));
                case E.WORLD:
                    return new j(this.canvas, this.ctx, (t => {
                        this.nextScene(t)
                    }));
                case E.CULMINATION:
                    return new y(this.canvas, this.ctx, (() => {
                        +s.GET_DATA(t.LORE) < 2 && s.SET_DATA(t.LORE, "2"), this.nextScene(E.WORLD)
                    }));
                case E.OUTRO:
                    return new b(this.canvas, this.ctx, (() => {
                        +s.GET_DATA(t.LORE) < 3 && s.SET_DATA(t.LORE, "3"), this.nextScene()
                    }));
                case E.GRATITUDE:
                    return new i(this.canvas, this.ctx, (() => {
                        this.nextScene(E.MENU)
                    }));
                case E.OPTIONS:
                    return new S(this.canvas, this.ctx, (() => {
                        this.nextScene(E.MENU)
                    }))
            }
        }
        setEvents() {
            window.addEventListener("resize", this.resize.bind(this)), window.addEventListener("contextmenu", (t => t.preventDefault()))
        }
        resize() {
            this.canvas.width = window.innerWidth, this.canvas.height = window.innerHeight, this.scenes.forEach((t => t.staticUpdate()))
        }
        render(t) {
            requestAnimationFrame(this.render.bind(this)), this.scenes.forEach((s => s.update(t)))
        }
    }(document.getElementById("root"))
})();