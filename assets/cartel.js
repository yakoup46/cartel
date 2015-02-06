var ini, rect;

$(function(){
    ini = $.cartel();
});

(function($,f){

    if(!$) return false; //no jQuery

    var Cartel = function(){

        var _ = this;

        this.w = 800;
        this.h = 800;
        this.cd = 112;
        this.pw = 64;
        this.colors = {
            'purple' : '#9b59b6',
            'blue' : '#3498db',
            'pink' : '#ff0099',
            'orange' : '#ff9900',
            'red' : '#c0392b',
            'yellow' : '#f1c40f',
            'green' : '#27ae60',
            'darkblue' : '#2c3e50',
            'black' : '#444'
        }
        this.board = new createjs.Stage('cartel');
        this.font = {
            color: '#000',
            type: '14px FontAwesome'
        };
        this.players = [];

        this.mappings = {};

        this.init = function(el, opts){
            this.board.enableMouseOver();
            this.drawBoard();
            this.drawPlayers();

            return this;
        }

        this.drawBoard = function(){
            rect = new createjs.Shape();
            var g = rect.graphics;

            g.s('#000')
                .ss(2, 1)
                .dr(_.cd, _.cd, 576, 576)
                .dr(1, 1, 798, 798);

            _.drawPieces = function(){
                var corner = 0;
                var x = y = b = 1;

                var w = 64;
                var h = _.cd;
                var j = 0;

                for(var i = 0; i < spaces.length; i++){
                    var cur = spaces[i];
                    var type = cur.type;

                    if(i > 0 && i % 10 == 0){
                        corner++;
                        b ^= 1;

                        if(corner % 2 == 1){
                            x ^= 1;
                            w = _.cd;
                            h = 64;
                        } else  {
                            y ^= 1;
                            w = 64;
                            h = _.cd;
                        }

                        j = 0;
                    }

                    // draw pieces
                    switch(type){
                        case 'corner':
                            var icon = new createjs.Text(cur.icon, '36px FontAwesome', _.font.color);

                            icon.set({
                                'textBaseline' : 'top',
                                'textAlign' : 'center',
                                'x' : 688 * x + (_.cd / 2),
                                'y' : 688 * y + (_.cd / 2) - icon.getBounds().width / 2
                            });


                            var text = new createjs.Text(cur.name, '14px Raleway', _.font.color);

                            text.x = (688 * x) + (_.cd - text.getBounds().width) / 2;
                            text.y = 688 * y + 85;

                            drawHelpers.addToBoard(icon, text);
                        break;

                        case 'transport':
                        case 'property':
                        case 'pickup':
                        case 'tax':
                        case 'utility':
                            var property = new createjs.Shape();
                            var g = property.graphics;
                            var mX = Math.abs(((Math.abs(b - corner + 1)) / 2) * (_.w - w) - (_.cd * b) - (((j-1) * w) * b));
                            var mY = Math.abs(((((b^1) - corner) + 2) / 2) * (_.w - h) - (_.cd * (b^1)) - (((j-1) * h) * (b^1)));

                            var drawRect = $.inArray(type, ['transport', 'property']) >= 0;

                            if(drawRect){
                                // colored box
                                g.s('#000')
                                    .ss(2, 1)
                                    .f(_.colors[cur.color])
                                    .dr(mX + (corner == 1 ? (w - 30) : 0), mY + (corner == 2 ? (h - 30) : 0), b ? w : 30, b ? 30 : h)
                                    .ef();
                            }
                                                        
                            g.s('#000').ss(2, 1).dr(mX, mY, w, h);

                            _.mappings[property.id] = cur;

                            property.on("mouseover", function(evt){
                                $('body').css('cursor','pointer');
                            });

                            property.on("mouseout", function(){
                                $('body').css('cursor','default');
                            });

                            var text = new createjs.Text(cur.name, '9px Raleway-Bold', _.font.color);
                            var wset = (w - text.getBounds().width) / 2;
                            var hset = (h - text.getBounds().width) / 2;

                            var pickup = type === 'pickup';
                            
                            text.set({
                                'x' : mX + (wset * b) + (corner == 3 ? (w - 15) : (15 * (b^1))),
                                'y' : mY + ((h - 15) * b) + (hset * (b^1)) + (corner == 2 ? - (w + 15) : 0),
                                'textAlign' : corner > 1 ? 'right' : 'left',
                                'maxWidth' : _.pw - 6,
                                'rotation' : 90 * corner
                            });

                            if(typeof cur.icon !== 'undefined'){
                                var icon = new createjs.Text(cur.icon, '36px FontAwesome', _.font.color);
                                var wset = (w - icon.getBounds().width) / 2;
                                var hset = (h - icon.getBounds().width) / 2;

                                icon.set({
                                    'textBaseline' : 'bottom',
                                    'textAlign' : corner > 1 ? 'right' : 'left',
                                    'maxWidth' : _.pw - 6,
                                    'x' : mX + (wset * b) + (corner == 3 ? (w - 20) : (20 * (b^1))),
                                    'y' : mY + ((h - 20) * b) + (hset * (b^1)) + (corner == 2 ? - (w + 5) : 0),
                                    'color' : '#333',
                                    'outline' : 2,
                                    'rotation' : 90 * corner
                                });
                            }

                            drawHelpers.addToBoard(property, text, icon);
                        break;
                    }

                    j++;
                }
            }();

            drawHelpers.addToBoard(rect);
        }

        this.drawPlayers = function(){
            var circle = new createjs.Shape();
            var g = circle.graphics;

            g.ss(1).s('#000').f('#f90').dc(0, 0, 10);

            circle.shadow = new createjs.Shadow('#000', 2, 2, 10);
            circle.name = this.players.length;
            circle.x = circle.y = 725;

            circle.on('movepiece', function(evt){
                var target = evt.currentTarget;
                var location = _.players[target.name].location;
                console.log(evt);
                var x = _.cd + 64 * location;
                var y = 725;
                
                evt.currentTarget.x = x;
                evt.currentTarget.y = y;

                _.board.update();
            });

            _.board.update();

            drawHelpers.addToBoard(circle);

            this.players.push({
                'location' : 0,
                'shape' : circle
            });
        };

        var drawHelpers = {
            addToBoard: function(){
                for(var i = 0; i < arguments.length; i++){
                    _.board.addChild(arguments[i]);
                }

                _.board.update();
            },
            rotateBoard: function(degrees){
                _.board.regX = _.board.regY = _.w / 2;
                _.board.x = _.board.y = _.w / 2;
                _.board.rotation = degrees;
                _.board.update();
            }
        };
    }

    $.cartel = function(o) {
        var instance = (new Cartel).init(this, o);
        return instance;
    }

})(window.jQuery, false);
