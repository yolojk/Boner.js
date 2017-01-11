(function( $ ){

    $.fn.boner = function(options) {

        var defaults = {
            shaftSize:  20,
            streamSize: 30,
            speed:      '50',
            message:    'this is a rocket ship',
            ballStyle:  'enhanced',
            shaftStyle: 'enhanced'
        };

        var options = $.extend(defaults, options);

        this.each(function() {

            var $this = $(this);
            var balls = options.ballStyle == 'legacy' ? '8' : '(_(_)';
            var shaftSegment = options.shaftStyle == 'legacy' ? '=' : ':';
            var tip = 'D';
            var extraSegment = '~';

            function shaft(_state) {
                var state = $.extend(
                    { min: 0, max: 10, state: 'min', output: '' },
                    _state || {}
                );

                if (state.state == 'min') {
                    state.state = 'up';
                    state.output = shaftSegment.repeat(state.min + 1);
                } else if (state.state == 'up') {
                    state.output = shaftSegment.repeat(state.output.length + 1);

                    if (state.output.length == state.max) {
                        state.state = 'max';
                    }
                } else if (state.state == 'max') {
                    state.output = shaftSegment.repeat(state.max - 1);
                    state.state = 'down';
                } else if (state.state == 'down') {
                    state.output = shaftSegment.repeat(state.output.length - 1);
                    if (state.output.length == state.min) {
                        state.state = 'min';
                    }
                }

                return state;
            }

            function fixed(str) {
                return function fixed_inner(_state) {
                    var state = $.extend(
                        { state: 'min' },
                        _state || {},
                        { output: str }
                    );

                    if (state.state == 'min') {
                        state.state = 'max';
                    } else {
                        state.state = 'min';
                    }

                    return state;
                };
            }

            function stream(str, length) {
                length = length || str.length + 2;
                length = length >= str.length + 2 ? length : str.length + 2;

                var left = Math.floor((length - str.length)/2);
                var right = Math.ceil((length - str.length)/2);

                var str = extraSegment.repeat(left)
                        + str
                        + extraSegment.repeat(right);

                return function stream_inner(_state) {
                    var state = $.extend(
                        { output: '', state: 'min', str: 0 },
                        _state || {}
                    );

                    if (state.state == 'min') {
                        state.str += 1;
                    } else if (state.state == 'max') {
                        state.str -= 1;
                    }

                    if (state.str <= 0) {
                        state.state = 'min';
                        state.str = 0;
                    } else if (state.str >= length) {
                        state.state = 'max';
                        state.str = length;
                    }

                    state.output = str.substring(0, state.str);

                    return state;
                };
            }

            var funcs = [
                fixed(balls),
                shaft,
                fixed(tip),
                stream(options.message, options.streamSize)
            ];
            var states = funcs.map(function() { return {};});
            var index = 0;
            var dir = 'up';

            function process() {
                states[index] = funcs[index](states[index]);

                if (dir == 'up' && states[index].state == 'max') {
                    index += 1;
                } else if (dir == 'down' && states[index].state == 'min') {
                    index -= 1;
                }

                if (index == states.length) {
                    index -= 1;
                    dir = 'down';
                } else if (index < 0) {
                    index = 0;
                    dir = 'up';
                }

                var output = '';
                for (var i = 0; i < states.length; ++i) {
                    output += states[i].output || '';
                }

                $this.html(output);
            }

            setInterval(process, options.speed);

        });

    };
})( jQuery );
