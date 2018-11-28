"use strict"

/***
 * random functions, used somewhere, maybe, don't know.
 ***/
function mseq(x, y) {
  x = (x + y) + 1;
  return x*(x-1)/2+(y+1);
}

function mseql(n) {
  var q = Math.round(Math.sqrt(2*n)),
      y = n - (q*(q-1))/2;

  return {
    x: (q - (y - 1)) - 1,
    y: y - 1
  };
}

/***
 * functions for multiplication triangle
 ***/
function fsqrt(n) {
  return Math.floor(Math.sqrt(n));
}

function query_n(n, exp) {
  var sq, sqr, sqrsq;
  var i;

  for(i=1; i<= 4; i++) {
    sq = fsqrt(i*n);
    if(sq*sq == n || sq*(sq+1) == n) return sq;

    sqr = sq*(sq+1) - n;
    sqrsq = fsqrt(sqr);
    if((sq-sqrsq)*(sq+sqrsq+1) == n) {
      return sq;
    }

    if(i == 1)
      sq += 1;

    sqr = sq*sq - n;
    sqrsq = fsqrt(sqr);
    if((sq-sqrsq)*(sq+sqrsq) == n) {
      return sq;
    }
  }

  if((n % 2) == 0) {
    sq = (n / 2) + 1;
    return (sq + (sq % 2)) / 2;
  } else {
    var g = (1.0 + Math.sqrt(5.0))/2;
    sq = fsqrt(g*n);
    sqr = sq*sq - n;
    sqrsq = fsqrt(sqr);

    if((sq-sqrsq)*(sq+sqrsq) == n) {
      return sq;
    }
  }
  return 0;
}

function generate_table(max, refactor) {
  var a, b, table = $('<div></div>').addClass('mt');

  table.css('width', 100*max);
  table.css('height', 72*max);
  table.attr('data-mt-row-limit', max);
  table.attr('data-mt-refactor', refactor);

  $('#mt-panel').clone().removeAttr('id')
    .addClass('mt-panel').removeClass('page-content')
    .appendTo(table);
  $('#mt-popups').clone().removeAttr('id')
    .addClass('mt-popups').removeClass('page-content')
    .appendTo(table);
  
  table.find('.mt-popups')
    .attr('unselectable', 'on')
    .css('user-select', 'none')
    .on('selectstart', false)
    .find('.number-panel .row-number .number-display')
    .attr('data-n', max);

  table.find('.refactor-option .checkbox').attr('data-checked', refactor);

  mt_bind_table_events(table);

  for(a = 1; a <= max; a++) {
    var row = $('<div></div>').addClass('w');

    for(b = 1; b <= a; b++) {
      var n = b * (a - (b - 1));
      var s = Math.floor(Math.sqrt(n));
      var r = n - s*s;
      var s1 = s + ((n/b) == b ? 0 : 1);
      var r1 = s1*s1 - n;
      var k = a*(a-1)/2+b;
      var q = (a+(a%2))/2;
      var i = (a%2)*Math.abs(q - b) + 
              (1-(a%2))*Math.abs(q+(q < b ? 1 : 0) - b);
      var qB = b;
      var qA = (a - (b - 1));
      
      function g(r,c) {
        if((r%2) == 0) {
          if(c > r/2) {
            c = r-c+1;
          }
          return (r/2)*(r/2)+c;
        }
        
        if((c > r/2)) {
          c = r-c+1;
        }
        return (r*r-1)/4+c;
      }

      var col = $('#entry').clone().removeAttr('id').addClass('b');
      mt_bind_cell_events(col);

      col.attr('data-mt-row', a);
      col.attr('data-mt-col', b);
      col.attr('data-mt-sqrt', s);
      col.attr('data-mt-sqrtr', r);
      col.attr('data-mt-sqrtp1', s1);
      col.attr('data-mt-sqrtp1r', r1);
      col.attr('data-mt-square-idx', i);
      col.attr('data-mt-tree-idx', k);
      col.attr('data-mt-htree-idx', g(a,b));
      col.attr('data-mt-add-offset', a - 2*(b-1));
      col.attr('data-mt-subtract-offset', 2*i-1);
      col.attr('data-mt-n', n);
      col.attr('data-mt-a', qA);
      col.attr('data-mt-b', qB);
      col.attr('data-mt-term-sum', a+1);
      col.attr('data-mt-form-row', String(a) + '*' + b + ' - ' + (b-1) + '*' + b);

      var form = String(q);
      if((a % 2) > 0) {
        form += '&sup2; - ' + i + '&sup2;';
      } else {
        form += '*' + (q+1) + ' - ' + i + '*' + (i+1);
      }
      col.attr('data-mt-form-square', form);

      if(refactor > 0) {
        var sq = query_n(n);
        if(sq > 0) {
          if(sq == (a+(a%2))/2) {
            col.addClass('highlight');
          } else {
            col.addClass('highlight2');
          }
        }
      }
      col.appendTo(row);
    }
    row.appendTo(table);
  }

  table.find('[data-mt-var]').each(function() {
    $(this).html(
        $(this).parents('.b').data(
          $(this).data('mt-var')));
  });

  return table.addClass('triangle-table');
}

$.fn.within = function(e) {
  return (
      $(this).hasClass(e) == true ||
      $(this).parents('.' + e).length > 0
    );
}

function txtbox_focus(table, focus) {
  var cursor = table.find('.number-panel .row-number .cursor');

  if(focus) {
    cursor.addClass('blink');
  } else {
    cursor.removeClass('blink');
  }
}

function tmr_change_row_limit(display, direction, hard_limit) {
  var now = Math.round((new Date()).getTime() / 1000);
  var n = display.data('n');
  var s = display.data('stamp');
  var i = 1 + 10 * Math.floor((now-s)/2);
  
  n += i * direction;
  if(n > hard_limit) { n = hard_limit; }
  else if(n < 0) { n = 0; }

  display.data('n', n);
  display.html(display.data('n'));
}

function change_row_limit(display, direction)
{
  display.data('stamp', Math.round((new Date()).getTime() / 1000));

  tmr_change_row_limit(display, direction, 250);

  return setInterval(tmr_change_row_limit, 100, display, direction, 250);
}

function button_press(obj, focus, dir, timer) {
  var button = $(obj).find('span');
  var dsp = $(obj).parent().find('.row-number .number-display');

  if(focus) {
    if(!timer) {
      timer = change_row_limit(dsp, dir);
      button.addClass('pressed');
    } else {
      clearInterval(timer);
      timer = change_row_limit(dsp, dir);
    }
  } else {
    clearInterval(timer);
    button.removeClass('pressed');
    timer = null;
  }
  return timer;
}

function mt_bind_table_events(table) {
  var np = table.find('.mt-popup-dialog .number-panel');
  var bg = table.find('.mt-popups');
  var dlg = bg.find('.mt-popup-dialog');
  var rn = np.find('.row-number');
  var inc = np.find('.increase');
  var dec = np.find('.decrease');
  var txt = rn.find('.number-display');
  var timer = null;
  var refactor = table.find('.refactor-option .checkbox');
  var close = dlg.find('.close');
  var ok = dlg.find('.button');

  bg.on('click', function(e) {
    if($(e.target).within('row-number') == false) {
      txtbox_focus(table, false);
    }
  });

  rn.on('click', function(e) {
    txtbox_focus(table, true);
  });

  inc.on('mousedown', function(e) {
    txtbox_focus(table, false);
    timer = button_press(this, true, e.which, timer);
  }).on('mouseup mouseleave', function(e) {
    timer = button_press(this, false, 0, timer);
  }).on('contextmenu', function(e) {
    e.preventDefault();
  });

  dec.on('mousedown', function(e) {
    txtbox_focus(table, false);
    timer = button_press(this, true, -e.which, timer);
  }).on('mouseup mouseleave', function(e) {
    timer = button_press(this, false, 0, timer);
  }).on('contextmenu', function(e) {
    e.preventDefault();
  });

  close.on('click', function(e) {
    $(this).parents('.mt-popups').css('display', 'none');
  });

  ok.on('click', function(e) {
    var newmax, refactor;

    newmax = $(this)
                .parents('.mt-popups')
                .find('.row-number .number-display')
                .data('n');

    refactor = $(this)
                .parents('.mt-popups')
                .find('.refactor-option .checkbox')
                .data('checked');

    $(this).parents('.mt-popups').css('display', 'none');

    $('#main').html('');
    generate_table(newmax, refactor).appendTo('#main');
  });

  table.attr('tabindex', '1');
  table.bind('keydown', function(e) {
    if(e.which == 67) {
      var ndsp = $(this).find('.number-panel .row-number .number-display');

      ndsp.html(ndsp.data('n'));

      $(this).find('.mt-popups').css('display', 'block');
    }
  });

  rn.attr('tabindex', 1);
  rn.bind('keydown', function(e) {
    var ndsp = $(this).find('.number-display');
    var n = ndsp.data('n');
    var s = String(n);

    if($(this).find('.cursor.blink').length < 1) {
      if(e.which == 8) {
        e.preventDefault();
      }
      return true;
    }

    switch(e.which) {
      case 8: /*backspace*/
        s = s.slice(0, -1);
        e.preventDefault();
        break;

      case 13: /*enter*/
        break;

      case 27: /*escape*/
        txtbox_focus(table, false);
        break;

      default: /*numbers. maybe*/
        if(e.which >= 48 && e.which <= 57) {
          var tmp = s.concat(e.which - 48);

          if(parseInt(tmp) <= 250) {
            s = tmp;
          }
        } else {
          return true;
        }
    }

    n = parseInt(s);
    if(isNaN(n)) {
      n = 0;
    }

    ndsp.data('n', n);
    ndsp.html(n);
  });

  if(refactor.data('checked') > 0) {
    refactor.find('.checkmark').css({'visibility': 'visible'});
  }
  refactor.on('click', function(e) {
    var mark = $(this).find('.checkmark');
    var checked = $(this).data('checked');

    mark.css('visibility', checked > 0 ? 'hidden' : 'visible');
    refactor.data('checked', 1 - checked);
  });
}

function mt_bind_cell_events(cell) {
  cell.on('contextmenu', function(e) {
    e.preventDefault();
  });
}

/***
 * Functions for pool diagram
 ***/
var POOL_TABLE_DRAG_POINTS = {
  left: 45,
  top: 45,
  right: 865,
  bottom: 454,
};
var POOL_BALL_HOLDER_DRAG_POINTS = {
  left: 920,
  top: 10,
  right: 1080,
  bottom: 180,
};
var POOL_TABLE_RAIL_POINTS = [
  /* left rail */
  { left: 0, top: 76, right: 45, bottom: 424, snap: 'x' },

  /* right rail */
  { left: 866, top: 76, right: 910, bottom: 424, snap: 'x' },

  /* top left & right rail */
  { left: 76, top: 0, right: 432, bottom: 45, snap: 'y' },
  { left: 478, top: 0, right: 835, bottom: 45, snap: 'y' },

  /* bottom left & right rail */
  { left: 76, top: 455, right: 432, bottom: 500, snap: 'y' },
  { left: 478, top: 455, right: 835, bottom: 500, snap: 'y' }, 
];

var table_state = {
  lines: {
    current: 0,
    x: 0, y: 0,

    quadratic: null,
  },
  line_mode: false,
  table_mode: 'ball-mode',
};

function check_points(layer, point) {
  return (
    layer.x > point.left && 
    layer.x < point.right &&
    layer.y > point.top &&
    layer.y < point.bottom
  );
}

function pool_gui_button(table, props) {
  var START_X = 963, START_Y = 250, BLUR_RATE = 4;
  var selected = props.selected ? 4 : 0;
  var visible = props.selected ? true : false;
  var data = { selected: visible, mode: props.mode };
  var x, y;

  x = START_X + props.col*(64+12);
  y = START_Y + props.row*(64+12);
  table.drawImage({
    layer: true,
    name: props.mode + '-img',
    groups: [ 'button-image', 'button-surface' ],
    source: 'images/' + props.mode + '.png',
    x: x, y: y,
    strokeDash: [],

    mouseover: function(layer) {
      table.animateLayer(props.mode + '-selected', {
        visible: true,
      }, 0);
    },
  });

  function style(layer) {
    return $(this).createGradient({
      x1: 0, y1: layer.y - layer.height,
      x2: 0, y2: layer.y + layer.height,
      c1: 'rgba(151, 156, 50, 0.7)',
      c2: 'rgba(171, 177, 56, 0.9)',
      c3: 'rgba(97, 100, 32, 1.0)',
      c4: 'rgba(171, 177, 56, 0.9)',
      c5: 'rgba(151, 156, 50, 0.7)',
    });
  }

  table.drawRect({
    strokeStyle: style,
    strokeWidth: 2,
    shadowColor: '#03f',
    shadowBlur: BLUR_RATE,
    groups: [ 'button-surface', 'buttons' ],
    data: data,
    layer: true,
    name: props.mode + '-selected',
    x: x, y: y,
    width: 64, height: 64,
    cornerRadius: 24,
    bringToFront: true,
    visible: visible,

    mouseover: function(layer) {
      table.css('cursor', 'pointer');
      /*play_sound('hover');*/
    },
    mouseout: function(layer) {
      table.css('cursor', 'default');
      if(!layer.data.selected) {
        $(this).animateLayer(layer, {
          visible: false,
        }, 0);
      }
    },
    mouseup: function(layer) {
      var buttons = table.getLayerGroup('buttons');
      var length = buttons.length;
      var i;

      for(i = 0; i < length; i++) {
        if(buttons[i].data.selected) {
          buttons[i].data.selected = false;
          $(this).animateLayer(buttons[i], {
            visible: false,
          }, 0);
        }
      }
      layer.data.selected = true;
      props.trigger(table, layer);
    }
  });
}

function play_sound(e) {
  var ctx = new AudioContext();
  var o = ctx.createOscillator();
  var g = ctx.createGain();

  g.gain.value = 0.1;

  o.type = 'sawtooth';
  o.frequency.value = 900;
  o.connect(g);

  g.connect(ctx.destination);
  o.start(0);

  setTimeout(function(osc) {
    osc.stop();
    ctx.close();
  }, 50, o);
}

function pool_parse_query(table, params) {
  var props = {
    balls: [],
    lines: [],
  }

  for(var p in params.params) {
    var k = p, v = params.params[k];
    var g, m, re = new RegExp('b(\\d+)');
    var b = {}
    var l = {}

    if((m = re.exec(k)) != null) {
      b.ball = parseInt(m[1]);
      b.layer = 'ball' + b.ball;
      b.cxy = parseInt(v);

      b = $.extend({}, b, mseql(b.cxy));
      props.balls.push(b);
    }

    /* i know this could be done in one, but i'm being lazy
     * and this is easier right now */
    re = new RegExp('l(\\d+)');
    if((m = re.exec(k)) != null) {
      l.line = parseInt(m[1]);
      l.layer = 'line' + l.line;
      
      re = new RegExp('s;(\\d+)');
      if((g = re.exec(v)) != null) {
        var xy12 = mseql(parseInt(g[2])),
            xy1 = mseql(xy12.x),
            xy2 = mseql(xy12.y);

        l.x1 = xy1.x; l.y1 = xy1.y;
        l.x2 = xy2.x; l.y2 = xy2.y;

        props.lines.push(l);
      } else {
        re = new RegExp('c;(\\d+)\\+(\\d+)');
        if((g = re.exec(v)) == null) {
          continue;
        }

        var xy12 = mseql(parseInt(g[1]));
        var xy1 = mseql(xy12.x);
        var xy2 = mseql(xy12.y);
        var cx12 = mseql(parseInt(g[2]));

        l.x1 = xy1.x; l.y1 = xy1.y;
        l.x2 = xy2.x; l.y2 = xy2.y;
        l.cx1 = cx12.x; l.cy1 = cx12.y;

        props.lines.push(l);
      }
    }
  }

  pool_draw_from_link(table, props);
}

function pool_draw_from_link(table, props) {
  var i, m = 0;

  for(i = 0; i < props.balls.length; i++) {
    table.animateLayer(props.balls[i].layer, {
      x: props.balls[i].x, y: props.balls[i].y,
    }, 750, function(layer) {
      table.addLayerToGroup(layer, 'balls-in-play');
    });
  }

  for(i = 0; i < props.lines.length; i++) {
    table_state.lines.current = props.lines[i].line;
    if(m < table_state.lines.current) {
      m = table_state.lines.current
    }

    if(props.lines[i].cx1 !== undefined) {
      pool_draw_curve_line(table, {
        x1: props.lines[i].x1, y1: props.lines[i].y1,
        x2: props.lines[i].x2, y2: props.lines[i].y2,
        cx1: props.lines[i].cx1, cy1: props.lines[i].cy1,
        ipx: props.lines[i].cx1, ipy: props.lines[i].cy1,
        name: props.lines[i].layer, commit: true,
      });
    } else {
      pool_draw_straight_line(table, false,
        props.lines[i].x1, props.lines[i].y1,
        props.lines[i].x2, props.lines[i].y2)
    }
  }

  if(m > 0) {
    table_state.lines.current = m + 1;
  }
}

function pool_create_link(table) {
  var i;
  var balls = table.getLayerGroup('balls-in-play');
  var lines = table.getLayerGroup('lines');
  var query = [];

  if(balls !== undefined) {
    for(i = 0; i < balls.length; i++) {
      query.push('b' + balls[i].data.ball + '=' +
                 mseq(balls[i].x, balls[i].y));
    }
  }

  if(lines !== undefined) {
    for(i = 0; i < lines.length; i++) {
      var xy1 = mseq(lines[i].x1, lines[i].y1),
          xy2 = mseq(lines[i].x2, lines[i].y2),
          s = 'l' + i + '=' + lines[i].data.type.substring(0,1) +
              ';' + mseq(xy1, xy2);

      if(lines[i].data.type == 'curve') {
        s += '+' + mseq(lines[i].cx1, lines[i].cy1);
      }
      
      query.push(s);
    }
  }

  console.log('?pd&' + query.join('&'));
}

function pool_gui_workspace(table, props) {
  table.drawRect({
    layer: true,
    name: 'ball-holder',
    fillStyle: function(layer) {
      return $(this).createGradient({
        x1: 0, y1: 0,
        x2: 0, y2: layer.height,
        c1: 'rgba(48, 52, 84, 1.0)', s1: 0.314,
        c2: 'rgba(204, 204, 204, 0.3)',
        c3: 'rgba(71, 49, 99, 1.0)',
      });
    },
    x: 920, y: 10,
    width: 160, height: 170,
    fromCenter: false,
    cornerRadius: 35,
    shadowBlur: 5,
    shadowColor: '#fff',
  });
  table.moveLayer('ball-holder', 1).drawLayers();

  table.drawRect({
    layer: true,
    name: 'tool-panel',
    fillStyle: function(layer) {
      return $(this).createGradient({
        x1: 0, y1: layer.y - layer.height,
        x2: 0, y2: layer.y + layer.height,
        c1: 'rgba(71, 49, 99, 1.0)', s1: 0.514,
        c2: 'rgba(204, 204, 204, 0.3)',
        c3: 'rgba(48, 52, 84, 1.0)',
      });
    },
    x: 920, y: 200,
    width: 160, height: 275,
    fromCenter: false,
    cornerRadius: 10,
    shadowBlur: 5,
    shadowColor: '#fff',
  });

  function switch_mode(table, layer) {
    var drag = false;

    table_state.table_mode = layer.data.mode;

    if(table_state.table_mode == 'ball-mode') {
      drag = true;
    }

    table.animateLayerGroup('balls', { draggable: drag }, 0);
    pool_create_link(table);
  }

  pool_gui_button(table, {
    mode: 'ball-mode',
    row: 0, col: 0,
    selected: true,
    trigger: switch_mode,
  });

  pool_gui_button(table, {
    mode: 'line-mode',
    row: 0, col: 1,
    trigger: switch_mode,
  });
}

/* assumes 1100x500 canvas size */
function pool_reset_balls(table, t) {
  for(var i = 0; i <= 15; i++) {
    var y = 40 + 36 * (Math.floor(i / 4));
    var x = 947 + 36 * (i % 4);

    table.animateLayer('ball' + i, { y: y, x: x }, t);
  }
}

function pool_draw_curve_line(table, props) {
  if(props.name === undefined) {
    props = $.extend({}, table_state.quadratic, props);
    table.removeLayer(props.name);
  } else {
    table_state.quadratic = props;
  }

  var style = '#f00',
      dash = [5, 7];
  
  if(props.commit !== undefined) {
    table_state.quadratic = null;
    style = 'rgba(0,0,0,0.5)';
    dash = [];
  }

  if(props.fallback) {
    props.cx1 = props.ipx;
    props.cy1 = props.ipy;
  }

  table.drawQuadratic({
    layer: true,
    name: props.name,
    groups: [ 'lines' ],
    strokeStyle: style,
    strokeWidth: 5,
    strokeDash: dash, 
    bringToFront: true,
    x1: props.x1, y1: props.y1,
    cx1: props.cx1, cy1: props.cy1,
    x2: props.x2, y2: props.y2,
    data: {
      type: 'curve',
    },
    mouseover: function(layer) {
      if(table_state.table_mode != 'ball-mode') {
        table.css('cursor', 'pointer');
      }
    },
    mousemove: function(layer) {
      pool_gui_mousemove(table, layer, 0);
    },
    mousedown: function(layer) {
      if(layer.event.which == 1 &&
          table_state.table_mode != 'ball-mode') {
        pool_begin_curve(table, layer);
      } else if(layer.event.which == 3 &&
          table_state.table_mode != 'ball-mode') {
        table.removeLayer(layer);
      }
    }
  });
}

function pool_begin_curve(table, layer) {
  if(table_state.table_mode != 'ball-mode') {
    table.removeLayer(layer);

    pool_draw_curve_line(table, {
      x1: layer.x1, y1: layer.y1,
      x2: layer.x2, y2: layer.y2,
      cx1: layer.eventX, cy1: layer.eventY,
      ipx: layer.eventX, ipy: layer.eventY,
      name: layer.name,
    });
    table_state.line_mode = true;
    table.css('cursor', 'move');
  }
}

function pool_end_curve(table, layer) {
  if(table_state.quadratic) {
    pool_draw_curve_line(table, {
      cx1: layer.eventX,
      cy1: layer.eventY,
      commit: true,
      fallback: layer.event.which == 1 ? false : true,
    });
    
    table_state.line_mode = false;
    table_state.quadratic = null;
    table.css('cursor', 'default');
  }
}

function pool_draw_straight_line(table, dashed, x1, y1, x2, y2) {
  table.removeLayer('line' + table_state.lines.current);

  function draw(table, dashes, handler) {
    table.drawLine({
      layer: true,
      groups: [ 'lines' ],
      name: 'line' + table_state.lines.current,
      strokeStyle: dashes.length > 0 ? '#f00' : 'rgba(0,0,0,0.5)',
      strokeWidth: 5,
      strokeDash: dashes,
      x1: x1, y1: y1,
      x2: x2, y2: y2,
      data: {
        type: 'straight',
        index: table_state.lines.current,
      },
      mousedown: function(layer) {
        return handler(table, layer);
      },
      mousemove: function(layer) {
        pool_gui_mousemove(table, layer, 12);
      },
      mouseover: dashes.length > 0 ? null : function(layer) {
        if(table_state.table_mode != 'ball-mode') {
          table.css('cursor', 'pointer');
        }
      },
    });
  }

  function smart_click(table, layer) {
    if(layer.event.which == 1) {
      pool_begin_curve(table, layer);
    } else if(layer.event.which == 3) {
      table.removeLayer(layer);
    }
  }

  function click(table, layer) {
    var mousebtn = layer.event.which;

    if(!table_state.line_mode) {
      return false;
    } else if(mousebtn == 3) {
      table.removeLayer(layer);
      table_state.line_mode = false;
    } else if(mousebtn == 1) {
      var point = { x: layer.eventX, y: layer.eventY };

      if(check_points(point, POOL_TABLE_DRAG_POINTS)) {
        table.removeLayer(layer);
        draw(table, [], smart_click);
        table_state.line_mode = false;

        return false;
      }
    }
  }

  return dashed ?
          draw(table, [5,7], click) :
          draw(table, [], smart_click);
}

function pool_gui_mousemove(table, layer, offset) {
  if(table_state.line_mode) {
    if(!table_state.quadratic) {
      pool_draw_straight_line(table, true,
                              table_state.lines.x, table_state.lines.y,
                              layer.eventX + offset, layer.eventY + offset);
    } else {
      pool_draw_curve_line(table, {
        cx1: layer.eventX, cy1: layer.eventY,
      });
    }
  }
}

function pool_gui_rail_box(table, rail, name) {
  function snap(r, x, y) {
    var q, p = { x: x, y: y };

    if(r.snap == 'x') {
      q = table.width() / 2;
      p.x = (r.right < q ? r.right : r.left);
    } else if(r.snap == 'y') {
      q = table.height() / 2;
      p.y = (r.top > q ? r.top : r.bottom);
    }
    return p;
  }

  table.drawRect({
    layer: true,
    name: 'rail' + name,
    groups: [ 'rails' ],
    fillStyle: 'transparent',
    strokeStyle: 'transparent',
    strokeWidth: 2,
    x: rail.left, y: rail.top,
    width: rail.right - rail.left,
    height: rail.bottom - rail.top,
    visible: true,
    bringToFront: true,
    fromCenter: false,
    data: {
      rail: rail,
    },
    mouseover: function(layer) {
      if(table_state.line_mode) {
        table.css('cursor', 'pointer');
      }
    },
    mouseup: function(layer) {
      if(table_state.line_mode) {
        var p = snap(layer.data.rail,
                     layer.eventX, layer.eventY);

        pool_draw_straight_line(table, false,
                                table_state.lines.x,
                                table_state.lines.y,
                                p.x, p.y);
        table_state.lines.current++;
        table_state.lines.x = p.x;
        table_state.lines.y = p.y;
      }
    },
    mousemove: function(layer) {
      return pool_gui_mousemove(table, layer, 12);
    },
  });
}

function pool_gui_ball(table, i) {
  table.drawImage({
    layer: true,
    name: 'ball' + i,
    groups: [ 'balls' ],
    source: 'images/' + i + '.png',
    x: 947, y: -10,
    draggable: true,
    bringToFront: true,
    data: {
      ball: i,
    },

    mouseover: function(layer) {
      if(table.table_locked) {
        return false;
      }

      if(table_state.table_mode == 'ball-mode') {
        table.css('cursor', 'grab');
      } else if(check_points({x: layer.eventX,
                              y: layer.eventY },
                              POOL_TABLE_DRAG_POINTS)) {
        table.css('cursor', 'pointer');
      }
    },
    dragstart: function(layer) {
      layer.orig_x = layer.x;
      layer.orig_y = layer.y;
      table.css('cursor', 'grabbing')
    },
    dragstop: function(layer) {
      if(!check_points(layer, POOL_TABLE_DRAG_POINTS))  {
        var xgo = layer.orig_x, ygo = layer.orig_y;

        if(check_points(layer, POOL_BALL_HOLDER_DRAG_POINTS)) {
          var re = new RegExp('ball(\\d+)');
          var m = re.exec(layer.name);

          if(m != null) {
            var b = parseInt(m[1]);
            xgo = 947 + 36 * (b % 4);
            ygo = 40 + 36 * (Math.floor(b / 4));
          }

          $(this).removeLayerFromGroup(layer, 'balls-in-play');
        }
        $(this).animateLayer(layer, { x: xgo, y: ygo }, 150);
      } else {
        $(this).removeLayerFromGroup(layer, 'balls-in-play');
        $(this).addLayerToGroup(layer, 'balls-in-play');
      }
      table.css('cursor', 'grab');
    },
    dragcancel: function(layer) {
      $(this).animateLayer(layer, { x: layer.orig_x, y: layer.orig_y });
    },
    click: function(layer) {
      if(table_state.table_mode == 'ball-mode') {
        return false;
      } else if(check_points(layer, POOL_TABLE_DRAG_POINTS)) {
        if(!table_state.line_mode) {
          table_state.lines.current = 0;
          table.removeLayerGroup('lines');
        } else {
          if(table_state.table_mode == 'line-mode') {
            pool_draw_straight_line(table, false,
                                    table_state.lines.x,
                                    table_state.lines.y,
                                    layer.x, layer.y);
            table_state.lines.current++;
          }
        }

        table_state.line_mode = true;
        table_state.lines.x = layer.x;
        table_state.lines.y = layer.y;
      }
    },
    mousemove: function(layer) {
      pool_gui_mousemove(table, layer, 12);
    },
  });
}

function pool_gui_images(table) {
  table.draw({
    layer: true,
    type: 'rectangle',
    fillStyle: '#303454',
    width: table.width(), height: table.height(),
    fromCenter: false,
  });

  table.drawImage({
    layer: true,
    name: 'table',
    source: 'images/table.png',
    fromCenter: false,

    mousemove: function(layer) {
      pool_gui_mousemove(table, layer, 0);
    },
    mousedown: function(layer) {
      if(table_state.line_mode && table_state.quadratic) {
        pool_end_curve(table, layer);
      }
    },
  });

  for(var i = 0; i <= 15; i++) {
    pool_gui_ball(table, i);
  }

  pool_reset_balls(table, 750);
}

function pool_gui_rails(table) {
  var rails = POOL_TABLE_RAIL_POINTS;
  var i;

  for(i = 0; i < rails.length; i++) {
    pool_gui_rail_box(table, rails[i], i);
  }
}

function init_pool_table(table) {
  pool_gui_images(table);
  pool_gui_workspace(table);
  pool_gui_rails(table);

  table.on('contextmenu', function(e) {
    e.preventDefault();
  });
}

/***
 * Portal functions
 ***/
function portalto(portal, section) {
  var sect = portal.parent().find('[data-section="' + section + '"]');

  if(sect.length > 0) {
    portal.hide('slide', { direction: 'left' }, 1000);
    sect.show('slide', { direction: 'right' }, 1000);
  }
}

function portalfrom(section) {
  section.hide('slide', { direction: 'right' }, 1000);
  $('.portal').show('slide', { direction: 'left' }, 1000);
}

function portal_query(portal, params) {
  if(params !== undefined && params.section !== undefined) {
    portalto(portal, params.section);
  }
}

/***
 * General functions
 ***/
function change_page(new_page, params) {
  var l = $('[data-content="' + new_page + '"]');

  $('#main').html('');
  if(l.length > 0) {
    $(new_page).clone(true)
      .removeAttr('id')
      .removeClass('page-content')
      .appendTo('#main')
    $(window).scrollTop(0);
  }

  new Function('self', l.data('onload'))('#main');
  new Function('self', 'p', l.data('onquery'))('#main', params);
}


function check_site_parameters() {
  var p, params = document.location.search;
  var m, re = new RegExp('\\?(.+?)(?=&|$)(.*)');
  var view;

  m = re.exec(params);
  if(m == null) {
    change_page('#home-content', {});
    return false;
  }

  view = m[1].toLowerCase();
  params = m[2];
  p = {};

  re = new RegExp('(?:&)(.+?)(?=&|=|$)(=|&)?(.+?)?(?=&|$)', 'g');
  while((m = re.exec(params)) != null) {
    var k = m[1], v = m[3];
    p[k] = v;
  }

  var pg = '#' + view + '-content';
  if($(pg).length == 0) {
    pg = '#help-content';
  }

  change_page(pg, {raw: params, params: p});
}

function bind_site_events() {
  $('li[data-content]').on('click', function(e) {
    change_page($(this).data('content'), '#main');
  }).attr('tabindex', 1);

  $('li[data-link-section]').on('click', function(e) {
    portalto($(this).parents('.portal'),
             $(this).data('link-section'));
  }).attr('tabindex', 1);

  $('#link-mult-triangle').on('click', function(e) {
    $('#main').html('');
    generate_table(25, 1).appendTo('#main');
  });

  $('.back-to-portal').on('click', function(e) {
    portalfrom($(this).parents('.subsection'));
  });
}

function build_site_gui() {
  $('#section-topnav')
    .clone()
    .removeAttr('id')
    .prependTo($('div[data-section]'));

  $('.portal ul>li').each(function() {
    $(this).attr('data-title', $(this).find('span').text());
  });

  /*
   * this is an ugly hack because tsort() was
   * combining my ul's (maybe, it's jquery's
   * implementation, or I'm doing something wrong.
   * either way- This work around fixes the
   * issue.)
   */
  $('.portal ul[data-topic]').each(function(i) {
    var t = $(this).attr('data-topic');
    $('.portal ul[data-topic='+t+']>li').tsort({attr: 'data-title'});
  });

  $('li[data-link-section]').each(function(i) {
    var k = $(this).data('link-section');
    var s = 'div[data-section="'+k+'"]';
    
    if($(s).length == 0) {
      $(this).find('span').wrapInner('<del></del>').append('<ins>TODO</ins>');
    }
  });

  $('li[data-show-popup]').on('click', function(e) {
    $(this).find('.description').toggle();
    $(this).find('.inline-content').toggle();
  }).attr('tabindex', '1');

  $('li[data-show-popup] code.prompt').each(function(i) {
    var text = $(this).text().split(/\n/);
    var newtext = [];

    $.each(text, function(i) {
      var t = this.replace(/^\s+/, '').replace(/\s/g, '&nbsp;');

      t = t.replace(/^(?!\\)/, '<span class="PS1"></span>').replace(/^\\/, '');
      t = t.replace(/(#.*)/, '<span class="comment">$1</span>');

      newtext.push(t);
    });

    $(this).html(newtext.splice(1, newtext.length-2).join('<br>\n'));
  });

  $('.pseudo-code').each(function(i) {
    var text = $(this).text().split(/\n/);
    var newtext = [];
    var space = '&nbsp;'.repeat(2);
    var spcnt = 0;

    $.each(text, function(i) {
      var t = this.replace(/^\s+/g, space.repeat(spcnt));

      if(t.search(/->$/) > -1) {
        spcnt++;
      } else if(t.search(/;;$/) > -1) {
        spcnt = Math.max(0, spcnt-1);
        t = t.replace(space, '');
      }

      newtext.push(t);
    });
    newtext = newtext.splice(1);

    newtext = newtext.join("<br>\n");
    $(this).html(newtext);
  });
}
