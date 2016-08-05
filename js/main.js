/**
 * Created by gaoqikai on 8/5/16.
 */
(function () {
    window.game = {
        init: function () {
            this.model.init();
            this.controller.init();
            this.view.init();
            console.log('hello');
        }
    };
    window.game.model = {
        pan: null,
        init: function () {
            this.pan = [];
        }
    }

    window.game.view = {
        oBlocks: null,
        oGameInfo: null,
        oAgain: null,
        onmove: function (event) {
            if(window.game.view.oBlocks.indexOf(event.target) != -1){
                window.game.controller.onmove(event.target.index);
            }
        },
        init: function () {
            this.removeAllChess();
            this.oBlocks = document.querySelectorAll('.game__pan__block').toArray();
            this.oGameInfo = document.querySelector('.game__info');
            this.oAgain = document.querySelector('.game__again');

            this.oAgain.onlick = function (event) {
                event.preventDefault();
                window.game.init();
            }

            for (var i = 0; i < this.oBlocks.length; i++) {
                (function (index) {
                    window.game.view.oBlocks[i]['index'] = index;
                    window.game.view.oBlocks[i].onclick = window.game.view.onmove;
                })(i)
            }
        },
        repaint: function (pan) {
            console.log(pan);
            for (var i = 0; i < pan.length; i++) {
                if (pan[i] != undefined) {
                    (function () {
                        var oChess = document.createElement('div');
                        oChess.setAttribute('class', 'game__pan__chess--' + (pan[i] ? 'white' : 'black'));
                        if (window.game.view.oBlocks[i].childNodes.length === 0) {
                            window.game.view.oBlocks[i].appendChild(oChess);
                        }
                    })(i);
                }
            }
        },
        updateInfo: function (info) {
            this.oGameInfo.innerHTML = info;
        },
        uninstallCallbacks: function () {
            for (var i = 0; i < this.oBlocks.length; i++) {
                window.game.view.oBlocks[i].onclick = null;
            }
        },
        showAgain: function () {
            this.oAgain.style.visibility = 'visible';
        },
        removeAllChess: function () {
            var oBlackChess = document.querySelectorAll('.game__pan__chess--black');
            var oWhiteChess = document.querySelectorAll('.game__pan__chess--white');

            for (var i = 0; i < oBlackChess.length; i++) {
                document.body.removeChild(oBlackChess[i]);
            }

            for (var i = 0; i < oWhiteChess.length; i++) {
                document.body.removeChild(oWhiteChess[i]);
            }
        }
    }

    window.game.controller = {
        now: null,
        model: null,
        view: null,
        init: function () {
            this.now = 0;//0 for black and 1 for white
            window.game.model.init();
            this.model = window.game.model;
            window.game.view.init();
            this.view = window.game.view;
            this.view.updateInfo((this.now ? '白棋' : '黑棋') + '请落子');
        },
        onmove: function (index) {
            if (this.model.pan[index] != undefined) {
                return false;
            } else {
                this.model.pan[index] = this.now;
                this.view.repaint(this.model.pan);
                this.now = 1 - this.now;
                if (!this.checkWin()) {
                    this.view.updateInfo((this.now ? '白棋' : '黑棋') + '请落子');
                }
            }
        },
        checkWin: function () {
            var pan = this.model.pan;
            var somebodyWon = false;

            for (var i = 0; i < pan.length; i++) {
                if (pan[i] != undefined) {
                    var type = pan[i];
                    var x = i % 8, y = Math.floor(i / 8);

                    checkHorizontal:
                        for (var horizontalDelta = 0;
                             horizontalDelta < 5 && ((x + horizontalDelta) % 8 != 0 || x % 8 === 0); horizontalDelta++) {
                            if (pan[i + horizontalDelta] != undefined && pan[i + horizontalDelta] === type) {
                                if (horizontalDelta === 4) {
                                    this.win(pan[i]);
                                    somebodyWon = true;
                                }
                            } else {
                                break checkHorizontal;
                            }
                        }
                    checkVertical:
                        for (var verticalDelta = 0; verticalDelta < 5 && (y + verticalDelta % 8 != 0 || y != 0); verticalDelta++) {
                            if (pan[i + verticalDelta * 8] != undefined && pan[i + verticalDelta * 8] === type) {
                                if (verticalDelta === 4) {
                                    this.win(pan[i]);
                                    somebodyWon = true;
                                }
                            } else {
                                break checkVertical;
                            }
                        }
                    checkDiagonalR:
                        for (var diagonalDelta = 0;
                             diagonalDelta < 5 && (y + diagonalDelta % 8 != 0 || y != 0) && ((x + diagonalDelta) % 8 != 0 || x % 8 === 0);
                             diagonalDelta++) {
                            if (pan[i + diagonalDelta * 8 + diagonalDelta] != undefined && pan[i + diagonalDelta * 8 + diagonalDelta] === type) {
                                if (diagonalDelta === 4) {
                                    this.win(pan[i]);
                                    somebodyWon = true;
                                }
                            } else {
                                break checkDiagonalR;
                            }
                        }
                    checkDiagonalL:
                        for (var diagonalDelta = 0;
                             diagonalDelta < 5 && (y + diagonalDelta % 8 != 0 || y != 0) && ((x - diagonalDelta) % 8 != 0 || x % 8 === 0);
                             diagonalDelta++) {
                            var target = pan[i + diagonalDelta * 8 - diagonalDelta];
                            if (target != undefined && target === type) {
                                if (diagonalDelta === 4) {
                                    this.win(pan[i]);
                                    somebodyWon = true;
                                }
                            } else {
                                break checkDiagonalL;
                            }
                        }
                }
            }
            return somebodyWon;
        },
        win: function (who) {
            console.log(who + 'wins');
            this.view.updateInfo((who ? '白棋' : '黑棋' ) + '赢了!');
            this.view.uninstallCallbacks();
            this.view.showAgain();
        }
    }

    NodeList.prototype.toArray = function () {
        var arr = [];
        for (var i = 0; i < this.length; i++) {
            arr.push(this[i]);
        }
        return arr;
    }

    window.game.init();
})();