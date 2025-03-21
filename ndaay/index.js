(() => {
    "use strict";
    var t = 720,
        i = 1280,
        h = {};

    function s(t, i, s) {
        return t in h || (h[t] = 0), i ? Date.now() - h[t] > s && (h[t] = Date.now(), !0) : i
    }

    function A(t) {
        try {
            ! function(t) {
                var i = navigator.getGamepads().filter((function(t) {
                    return !!t
                }));
                if (0 === i.length) return;
                var h = i[0];
                t.t = !1, t.i = !1, t.h = !1, t.A = !1, t.o = !1, t.u = !1, n(h.buttons[0]) && (t.t = !0);
                n(h.buttons[1]) && (t.i = !0);
                n(h.buttons[12]) && (t.A = !0);
                n(h.buttons[13]) && (t.h = !0);
                n(h.buttons[14]) && (t.o = !0);
                n(h.buttons[15]) && (t.u = !0)
            }(t)
        } catch (t) {}
    }

    function n(t) {
        return "object" == typeof t ? t.pressed : 1 === t
    }
    var e, o = function() {
        function t(t) {
            this.M = t, this.D = []
        }
        return t.prototype.m = function() {
            for (var t = this.D.length; t--;) {
                var i = this.D[t],
                    h = this.M.l.indexOf(i);
                h > -1 && this.M.l.splice(h, 1), this.D.splice(t, 1)
            }
        }, t.prototype.p = function(t) {
            this.D.push(t)
        }, t
    }();
    ! function(t) {
        t[t.v = 0] = "BASIC", t[t.N = 1] = "FAST", t[t.R = 2] = "HEAVY"
    }(e || (e = {}));
    var r = "IDLE",
        a = "MENU",
        c = "STARTED",
        u = "ENDED";
    window.__OPTMIZE_PERFORMANCE = !1;
    var w = function(t, i, h, s) {
        this.x = t, this.y = i, this.U = h, this.F = s, this.C = 0
    };

    function f(t, i, h, s, A, n) {
        var e = t.globalCompositeOperation;
        t.globalCompositeOperation = "lighter";
        var o = 10;
        window.__OPTMIZE_PERFORMANCE && (A /= 2, o = 2);
        for (var r = 0; r < o; r++) {
            var a = new w(i, h, (2 * Math.random() * 1 - 1) / 2, 0 - 2 * Math.random() * 1);
            n.push(a)
        }
        for (r = 0; r < n.length; r++) t.fillStyle = "rgba(" + (260 - 2 * n[r].C) + "," + (2 * n[r].C + 50) + "," + 2 * n[r].C + "," + (A - n[r].C) / A * .4 + ")", t.beginPath(), t.arc(n[r].x, n[r].y, Math.max(0, (A - n[r].C) / A * (s / 2) + s / 2), 0, 2 * Math.PI), t.fill(), n[r].x += n[r].U, n[r].y += n[r].F, n[r].C++, n[r].C >= A && (n.splice(r, 1), r--);
        t.globalCompositeOperation = e
    }
    var M = new Image;
    M.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAnBAMAAADwVwV6AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAnUExURQAAADw8PNSxkMOffOeMytd7umWWoIWyvLVfmr6+vpkxMXo0NP////erPSwAAAABdFJOUwBA5thmAAAAAWJLR0QMgbNRYwAAAAd0SU1FB+gJDQgIB5EXx/AAAACjSURBVBjTlc5BCsIwFATQ5gYNtNDo0pMUUnDbxQdPkN6gWRcU3Gbp0iN4Q2cmYMGNONDwCM383zR7fIvDeXwnCaebPDNRXYxxlHozm/+RqcUgv+ScV0xyo+46aL6i+dxTN7y4/NYmDey7M+wr6gu8y4xmrCmlRTMktSSGCnpRqAElWxWapaIZ7CvGfAs7V33+23d5SgfoJR0pzaACVw2c8ahp30atUnqwfjhDAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI0LTA5LTEzVDA4OjA1OjU2KzAwOjAwtwo06QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNC0wOS0xM1QwODowNTo1NiswMDowMMZXjFUAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjQtMDktMTNUMDg6MDg6MDcrMDA6MDCKKyPqAAAAAElFTkSuQmCC";
    var D = new Image;
    D.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAApBAMAAADKXWQKAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAnUExURQAAADw8PNSxkMOffFKBmThulDBggr6+voWyvGWWoJkxMXo0NP////aesYMAAAABdFJOUwBA5thmAAAAAWJLR0QMgbNRYwAAAAd0SU1FB+gJDQgKG7cg+T0AAACtSURBVBjTnc49CgIxEAXg5AYZ2M2ilt7AGyxk7Rd27ANqv1WuoKWdKT2CN/TNQ1lbfZDwQTI/zi2RgMsLzpbaBeeHICJ+MklKSahGVXuqhcb/pGJRKB/ReR8hOeH1gD18TzXQSLU/KJ8t1q/jjBmaL5bOZlxrrXfOqBab0a+AG5VRECl2WTbgfmqx2ge1hp46pUE3Jv6jWAu5SGX3JT8LILZLKZhWCv6JuPf1yQuL5k6zzHsxgQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNC0wOS0xM1QwODowNTo1NiswMDowMLcKNOkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjQtMDktMTNUMDg6MDU6NTYrMDA6MDDGV4xVAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI0LTA5LTEzVDA4OjEwOjI3KzAwOjAwGle7owAAAABJRU5ErkJggg==";
    var g = new Image;
    g.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAoBAMAAAABAbevAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAnUExURQAAADw8PJkxMTtlri1UmWWWoIWyvCVHg9SxkMOffL6+voWFhf///1zcEGIAAAABdFJOUwBA5thmAAAAAWJLR0QMgbNRYwAAAAd0SU1FB+gJDQgLHt5RPPMAAADMSURBVBjTfZAxDsIwEATPP8CxkcG8woIPWJyUmiL0FKS3iJQ3UFJSpk1Hnc+xZydCSIh1M7J0u7dHpHQWEVVmD1UrImOY+WiELIhBKghwDKRioUiK86gFxXMLnUCp+CXQTfwSSHcykTRcCoXff/8p9qKEjDpHOEmT2PYiadcGElo3WXqphnLKYRDDJS3Oziw0N4pzIytkv6h3HA61kx6ui9yL393JLpsHqafTlXZbkE6j94M0wg18ucFueuFN+BvKKgMpP2bh5J/bL3oDVIpQtHDAeAUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjQtMDktMTNUMDg6MDU6NTYrMDA6MDC3CjTpAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTA5LTEzVDA4OjA1OjU2KzAwOjAwxleMVQAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNC0wOS0xM1QwODoxMTozMCswMDowMPyY7o0AAAAASUVORK5CYII=";
    var m = function() {
            function t(t, i, h) {
                this.I = [], this.M = t;
                this.x = 82.5 + 660 * h / 4, this.y = 40, this.type = i, i == e.v ? (this.speed = 1, this.S = 2, this.totalFrames = 1) : i == e.R ? (this.speed = .75, this.S = 4, this.totalFrames = 1) : i == e.N && (this.speed = 1.5, this.S = 1, this.totalFrames = 1), this.O = 13, this.T = 70, this.k = 160, this.G = 0, this.isActive = !0
            }
            return t.prototype.m = function() {
                if (this.M.state === c) {
                    this.y > 1250 && (this.isActive = !1, this.M.B.p(this), this.M.W.V(100 * this.S), playAudioFx(0)), this.y += 1 * this.speed * this.M.level.J * this.M.pc.Y * this.M.L;
                    var t, i, h, s, A, n, e, o, r = this.M.pc.K(),
                        a = r[0],
                        u = r[1];
                    (t = this.x, i = this.y, h = this.T, s = this.k, A = a, n = u, e = this.M.pc.T, o = this.M.pc.k, !(t + h < A || A + e < t || i + s < n || n + o < i)) && (this.M.X.j(), this.M.B.p(this), playAudioFx(1))
                }
            }, t.prototype.draw = function(t) {
                if (this.isActive) {
                    var i;
                    f(t, this.x, this.y, 10, 10, this.I), f(t, this.x + this.T, this.y, 10, 10, this.I), this.type == e.v ? (i = M, this.G += .2) : this.type == e.N ? (i = D, this.G += .15) : this.type == e.R && (i = g, this.G += .15);
                    var h = Math.floor(0),
                        s = i.width / this.totalFrames,
                        A = i.height;
                    t.drawImage(i, h * s, 0, s, A, this.x - s / 2, this.y - A / 2, 4.5 * s, 4.5 * A), this.G >= this.totalFrames && (this.G = 0), this.M.H && (t.strokeStyle = "rgba(0, 0, 0, 1)", t.strokeRect(this.x, this.y, this.T, this.k))
                }
            }, t
        }(),
        d = function() {
            function t(t) {
                this.M = t, this.Z = 0
            }
            return t.prototype.P = function() {
                this.q(e.v)
            }, t.prototype._ = function() {
                this.$()
            }, t.prototype.m = function() {
                if (this.M.state === c && Date.now() - this.Z > this.tt) {
                    var t = Math.floor(3 * Math.random());
                    this.q(t)
                }
            }, t.prototype.q = function(t) {
                var i = Math.floor(4 * Math.random()),
                    h = new m(this.M, t, i);
                this.M.l.push(h), this.Z = Date.now(), this.$()
            }, t.prototype.$ = function() {
                this.tt = (1e3 + 1e3 * Math.random()) / this.M.level.it
            }, t
        }(),
        l = function() {
            function t(t) {
                this.ht = 0, this.st = 0, this.frameCount = 0, this.At = 0, this.nt = [], this.M = t, this.ht = 0, this.st = Date.now()
            }
            return t.prototype._ = function() {
                this.ht = Date.now()
            }, t.prototype.draw = function(t) {
                Date.now() - this.st > 1e3 ? (this.At = this.frameCount, this.frameCount = 0, this.st = Date.now(), this.et()) : this.frameCount += 1;
                var i = "".concat(this.At).padStart(2, "0") + " FPS";
                t.font = "normal 12px Arial", t.fillStyle = "yellow", t.fillText(i, 660, 30)
            }, t.prototype.et = function() {
                (this.nt.push(this.At), this.nt.length > 60 && this.nt.shift(), this.ht > 0 && Date.now() - this.ht > 1e4) && (this.nt.reduce((function(t, i) {
                    return t + i
                }), 0) / this.nt.length < 30 && (console.log("Reducing particle effect due to low FPS"), window.__OPTMIZE_PERFORMANCE = !0, this.ht = 0))
            }, t
        }(),
        p = function() {
            function t(t) {
                this.ot = "#FFFFFF", this.rt = 0, this.M = t
            }
            return t.prototype.ct = function() {
                this.rt = Date.now(), playAudioFx(2)
            }, t.prototype.ut = function() {
                return this.M.state === u && Date.now() - this.rt > 3e3
            }, t.prototype.wt = function(t) {
                return this.ut() && t.ft
            }, t.prototype.draw = function(t) {
                if (this.M.state === u) {
                    t.fillStyle = "rgba(45, 66, 53, 0.9)", t.fillRect(60, 340, 600, 360);
                    var i = "Better luck next time!";
                    if (t.font = "normal 32px Courier New", t.fillStyle = this.ot, t.fillText(i, 120, 440), this.M.W.Mt >= this.M.W.Dt) {
                        i = "You got the high score though!";
                        t.font = "normal 16px Courier New", t.fillStyle = this.ot, t.fillText(i, 120, 480)
                    }
                    var h = this.M.W.gt();
                    i = "Your Score: ".concat(h);
                    if (t.font = "normal 24px Courier New", t.fillStyle = this.ot, t.fillText(i, 120, 520), this.ut()) {
                        i = "Press [SPACE] / [🎮 A] to continue";
                        t.font = "normal 20px Courier New", t.fillStyle = this.ot, t.fillText(i, 120, 620)
                    }
                }
            }, t
        }(),
        v = function() {
            function t(t) {
                this.ot = "#FFFFFF", this.M = t, this.dt = 1, this.it = 1, this.J = 1
            }
            return t.prototype.m = function() {
                this.M.W.Mt > 1e4 ? (this.dt = 5, this.it = 3, this.J = 3) : this.M.W.Mt > 8e3 ? (this.dt = 4, this.it = 2.2, this.J = 2.2) : this.M.W.Mt > 5e3 ? (this.dt = 3, this.it = 1.8, this.J = 1.8) : this.M.W.Mt > 1e3 ? (this.dt = 2, this.it = 1.4, this.J = 1.4) : (this.dt = 1, this.it = 1, this.J = 1)
            }, t.prototype.draw = function(t) {
                var i = "Level ".concat(this.dt);
                t.font = "bold 20px Courier New", t.fillStyle = this.ot, t.fillText(i, 60, 80)
            }, t
        }(),
        N = function() {
            function t(t) {
                this.M = t, this.lt = 5
            }
            return t.prototype.j = function() {
                this.lt > 0 && (this.lt -= 1), 0 === this.lt && this.M.vt()
            }, t.prototype.draw = function(t) {
                var i = "❤️".repeat(this.lt);
                t.font = "normal 20px Courier New", t.fillStyle = "grey", t.fillText(i, 60, 120)
            }, t
        }(),
        R = function() {
            function t(t) {
                this.ot = "#FFFFFF", this.M = t
            }
            return t.prototype.draw = function(t) {
                var i = 300;
                if (this.M.state === a) {
                    t.fillStyle = "rgba(45, 66, 53, 0.9)", t.fillRect(60, 240, 600, 600);
                    var h = "13th September 2024. Helsinki, Finland.";
                    t.font = "normal 16px Courier New", t.fillStyle = this.ot, t.fillText(h, 80, i), i += 60;
                    h = "You were supposed to give a speech at the National Accident";
                    t.font = "normal 16px Courier New", t.fillStyle = this.ot, t.fillText(h, 80, i), i += 30;
                    h = "Day Awareness event, but you are very very late. You need";
                    t.font = "normal 16px Courier New", t.fillStyle = this.ot, t.fillText(h, 80, i), i += 30;
                    h = "to make it there on time, but the traffic is horrible.";
                    t.font = "normal 16px Courier New", t.fillStyle = this.ot, t.fillText(h, 80, i), i += 60;
                    h = "Navigate through the traffic and avoid accidents to make";
                    t.font = "normal 16px Courier New", t.fillStyle = this.ot, t.fillText(h, 80, i), i += 30;
                    h = "it to the venue on time.";
                    t.font = "normal 16px Courier New", t.fillStyle = this.ot, t.fillText(h, 80, i), i += 80;
                    h = "National Accident Day";
                    t.font = "normal 32px Courier New", t.fillStyle = this.ot, t.fillText(h, 80, i), i += 50;
                    h = "Press [SPACE] / [🎮 A] to get started";
                    t.font = "normal 20px Courier New", t.fillStyle = this.ot, t.fillText(h, 80, i), i += 100;
                    h = "Credits";
                    t.font = "normal 20px Courier New", t.fillStyle = this.ot, t.fillText(h, 80, i), i += 30;
                    h = "Developer: Akshar Pandey";
                    t.font = "normal 20px Courier New", t.fillStyle = this.ot, t.fillText(h, 80, i), i += 30;
                    h = "Music: Unknown";
                    t.font = "normal 20px Courier New", t.fillStyle = this.ot, t.fillText(h, 80, i), i += 30
                }
            }, t
        }();
    const U = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAoBAMAAAABAbevAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAtUExURQAAADw8PNSxkMOffKS/ioagbWmDUIWyvGWWoIZoS5kxMXo0NIWFhb6+vv///8KSJDQAAAABdFJOUwBA5thmAAAAAWJLR0QOb70wTwAAAAd0SU1FB+gJDQgNIElqht4AAACrSURBVBjTpY8xDsIwDEWdGzQSbRGwcQNyAqSUPVLNHgmyMzGzcYWOPQJH6EG4C/4OgoaVJ0V6sn8ch8hWRGSsnK0Fu4pMt/De73tYzczhx5qUUoSx3mCxcJIbh1rMniV3lKkmqjVFLaghFxKARZ2CXHsFF9gdwJZqtyKXMrK5zcj2nMFkLZVvzOzbHZxzw7+19wZiI/e+45XYQ3+5RlffRXfS2EbsmZlv/+EFb3FJQN3DvqEAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjQtMDktMTNUMDg6MDU6NTYrMDA6MDC3CjTpAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTA5LTEzVDA4OjA1OjU2KzAwOjAwxleMVQAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNC0wOS0xM1QwODoxMzozMiswMDowMG/yL5kAAAAASUVORK5CYII=";
    var x;
    ! function(t) {
        t[t.IDLE = 0] = "IDLE", t[t.Nt = 1] = "MOVING_RIGHT", t[t.Rt = 2] = "MOVING_LEFT", t[t.Ut = 3] = "SHOOTING"
    }(x || (x = {}));
    var F = new Image;
    F.src = U;
    var C = new Image;
    C.src = U;
    var I = new Image;
    I.src = U;
    var S = function() {
            function t(t) {
                this.I = [], this.xt = 0, this.Ft = 0, this.Ct = 40, this.It = 40, this.St = 580, this.yt = 20, this.bt = 0, this.Ot = 980, this.Y = 1, this.Tt = 20, this.M = t, this.state = x.IDLE, this.kt = 0, this.Et = 1, this.Gt = 0, this.Bt = 1, this.Vt = 0, this.Wt = 1, this.O = 50, this.T = 70, this.k = 160
            }
            return t.prototype.K = function() {
                return [this.Ct + this.xt, this.yt + this.Ft]
            }, t.prototype.initialize = function() {
                this.xt = (this.St + this.bt) / 4 + 60, this.Ft = this.Ot
            }, t.prototype.m = function(t) {
                this.M.state === c && (t.left && this.xt > this.It && (this.xt -= this.Tt * this.Y * this.M.level.J), t.right && this.xt < this.St && (this.xt += this.Tt * this.Y * this.M.level.J), t.Qt ? this.Y = .5 : t.Jt ? this.Y = 1.3 : this.Y = 1, t.left || t.right || this.state == x.Ut || (this.state = x.IDLE), t.left && (this.state = x.Rt), t.right && (this.state = x.Nt))
            }, t.prototype.draw = function(t) {
                var i, h, s = this.K(),
                    A = s[0],
                    n = s[1];
                this.state == x.IDLE ? (i = F, this.kt += .3, this.kt >= this.Et && (this.kt = 0), this.kt, h = this.Et) : this.state == x.Rt || this.state == x.Nt ? (i = C, this.Gt += .25, this.Gt >= this.Bt && (this.Gt = 0), this.Gt, h = this.Bt, this.state == x.Rt && (i = function(t) {
                    var i = document.createElement("canvas"),
                        h = i.getContext("2d");
                    if (!h) return console.error("Could not create 2D context"), t;
                    i.width = t.width, i.height = t.height, h.translate(i.width, 0), h.scale(-1, 1), h.drawImage(t, 0, 0);
                    var s = new Image;
                    return s.src = i.toDataURL(), s
                }(i))) : this.state == x.Ut && (i = I, this.Vt += .2, this.Vt >= this.Wt && (this.Vt = 0, this.state = x.IDLE), this.Vt, h = this.Wt);
                var e = Math.floor(0),
                    o = i.width / h,
                    r = i.height;
                if (t.drawImage(i, e * o, 0, o, r, A - o / 2, n - r / 2, 4.5 * o, 4.5 * r), this.M.X.lt < 5) {
                    var a = this.K(),
                        c = a[0],
                        u = a[1],
                        w = 3 + 1.2 * (5 - this.M.X.lt);
                    f(t, c + this.T / 2, u + this.k / 2, w, 100, this.I)
                }
                if (this.M.H) {
                    t.strokeStyle = "rgba(0, 0, 0, 1)";
                    var M = this.K(),
                        D = M[0],
                        g = M[1];
                    t.strokeRect(D, g, this.T, this.k)
                }
            }, t.prototype.x = function(t, i, h, s) {
                throw new Error("Method not implemented.")
            }, t.prototype.y = function(t, i, h, s) {
                throw new Error("Method not implemented.")
            }, t
        }(),
        y = function() {
            function t(t) {
                this.M = t, this.Yt = -40, this.Lt = [{
                    x: 10,
                    y: 100,
                    width: 20,
                    height: 15
                }, {
                    x: 15,
                    y: 250,
                    width: 15,
                    height: 12
                }, {
                    x: 20,
                    y: 400,
                    width: 18,
                    height: 14
                }, {
                    x: 690,
                    y: 150,
                    width: 22,
                    height: 16
                }, {
                    x: 685,
                    y: 300,
                    width: 16,
                    height: 13
                }, {
                    x: 695,
                    y: 450,
                    width: 19,
                    height: 15
                }]
            }
            return t.prototype.m = function() {
                this.M.state === c && (this.Yt += this.M.level.J * this.M.L * this.M.pc.Y, this.Yt >= 0 && (this.Yt = -40))
            }, t.prototype.draw = function(t) {
                var h = 40;
                t.fillStyle = "#808080", t.fillRect(h, this.Yt, 640, i - this.Yt);
                t.lineWidth = 5;
                for (var s = 1; s < 4; s++) {
                    t.strokeStyle = 2 == s ? "#FFD700" : "white";
                    var A = h + 160 * s;
                    t.setLineDash([20, 20]), t.beginPath(), t.moveTo(A, this.Yt), t.lineTo(A, i), t.stroke()
                }
                t.strokeStyle = "yellow", t.setLineDash([]), t.beginPath(), t.moveTo(h, this.Yt), t.lineTo(h, i), t.stroke(), t.beginPath(), t.moveTo(680, this.Yt), t.lineTo(680, i), t.stroke(), t.setLineDash([])
            }, t
        }(),
        b = function() {
            function t(t) {
                this.ot = "#FFFFFF", this.M = t, this.Mt = 0, this.Dt = 0
            }
            return t.prototype.initialize = function() {
                this.Dt = this.Kt()
            }, t.prototype.V = function(t) {
                this.Mt += t, this.Mt > this.Dt && (this.Dt = this.Mt, this.jt())
            }, t.prototype.draw = function(t) {
                var i = "HIGHSCORE " + "".concat(this.Dt).padStart(8, "00000000");
                t.font = "normal 14px Courier New", t.fillStyle = this.ot, t.fillText(i, 60, 56);
                i = "SCORE " + this.gt();
                t.font = "bold 20px Courier New", t.fillStyle = this.ot, t.fillText(i, 60, 36)
            }, t.prototype.gt = function() {
                return "".concat(this.Mt).padStart(8, "00000000")
            }, t.prototype.Kt = function() {
                return parseInt(localStorage.getItem("--nat-acc-day--high-score")) || 0
            }, t.prototype.jt = function() {
                localStorage.setItem("--nat-acc-day--high-score", "".concat(this.Dt))
            }, t
        }(),
        O = function() {
            function h() {
                this.state = r, this.H = !1, this.L = 10
            }
            return h.prototype.initialize = function() {
                this.Xt(), this.zt = new l(this), this.Ht = new d(this), this.Zt = new y(this), this.pc = new S(this), this.W = new b(this), this.B = new o(this), this.X = new N(this), this.Pt = new R(this), this.qt = new p(this), this.level = new v(this), this.l = [], this.W.initialize(), this.pc.initialize()
            }, h.prototype._t = function() {
                this.state = a, this.Ht.P()
            }, h.prototype.$t = function() {
                this.state = c, this.Ht._(), this.zt._()
            }, h.prototype.m = function(t) {
                this.state === a && t.ft && (this.$t(), t.ft = !1), this.qt.wt(t) ? this.ti() : (this.level.m(), this.Zt.m(), this.pc.m(t), this.Ht.m(), this.l.forEach((function(t) {
                    t.m()
                })), this.B.m())
            }, h.prototype.draw = function(h) {
                h.clearRect(0, 0, t, i), this.Zt.draw(h), this.l.forEach((function(t) {
                    t.draw(h)
                })), this.Pt.draw(h), this.qt.draw(h), this.level.draw(h), this.pc.draw(h), this.W.draw(h), this.X.draw(h), this.zt.draw(h)
            }, h.prototype.Xt = function() {
                this.time = Date.now()
            }, h.prototype.vt = function() {
                this.state = u, this.qt.ct()
            }, h.prototype.ii = function(t) {
                this.ti = t
            }, h
        }(),
        T = document.createElement("canvas"),
        k = T.getContext("2d");
    T.id = "gameCanvas", T.width = t, T.height = i, T.style.maxWidth = "100vw", T.style.maxHeight = "100vh", document.createElement("div").appendChild(T), document.body.appendChild(T);
    var E, G = {
            left: !1,
            right: !1,
            Jt: !1,
            Qt: !1,
            ft: !1,
            f: !1
        },
        B = {
            left: !1,
            right: !1,
            Jt: !1,
            Qt: !1,
            ft: !1,
            f: !1
        },
        V = {
            A: !1,
            h: !1,
            o: !1,
            u: !1,
            t: !1,
            i: !1
        };
    ! function(t) {
        window.addEventListener("keydown", (function(i) {
            switch (i.key) {
                case "ArrowLeft":
                    t.left = !0;
                    break;
                case "ArrowRight":
                    t.right = !0;
                    break;
                case "ArrowUp":
                    t.Jt = !0;
                    break;
                case "ArrowDown":
                    t.Qt = !0;
                    break;
                case "F":
                case "f":
                    t.f = !0;
                    break;
                case "Spacebar":
                case " ":
                    t.ft = !0
            }
        })), window.addEventListener("keyup", (function(i) {
            switch (i.key) {
                case "ArrowLeft":
                    t.left = !1;
                    break;
                case "ArrowRight":
                    t.right = !1;
                    break;
                case "ArrowUp":
                    t.Jt = !1;
                    break;
                case "ArrowDown":
                    t.Qt = !1;
                    break;
                case "F":
                case "f":
                    t.f = !1;
                    break;
                case "Spacebar":
                case " ":
                    t.ft = !1
            }
        }))
    }(B),
    function t() {
        (E = new O).initialize(), E._t(), E.ii((function() {
            t()
        }))
    }(), requestAnimationFrame((function t(i) {
        A(V),
            function(t, i, h) {
                t.Jt = i.Jt || h.A, t.Qt = i.Qt || h.h, t.left = i.left || h.o, t.right = i.right || h.u, t.ft = i.ft || h.t, t.f = i.f || h.i, t.ft = s("SPACE", t.ft, 300), t.f = s("F", t.f, 300)
            }(G, B, V), E.m(G), E.draw(k), requestAnimationFrame(t)
    }))
})();