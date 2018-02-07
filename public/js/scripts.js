(function () {
  var App;
  App = {};
  const process = {
    env: {
      IP: '127.0.0.1:4444'
    }
  }
  /*
  	Init 
  */
  App.init = function () {
    App.canvas = document.createElement('canvas')
    App.canvas.height = 520
    App.canvas.width = 1000
    App.canvas.id = 'canvas'
    document.getElementsByTagName('article')[0].appendChild(App.canvas)
    App.ctx = App.canvas.getContext("2d")
    App.ctx.fillStyle = "solid"
    App.ctx.strokeStyle = "#22F333"
    App.ctx.lineWidth = 5
    App.ctx.lineCap = "round"
    App.socket = io.connect(process.env.IP)
    App.socket.on('draw', function (data) {
      return App.draw(data.x, data.y, data.type)
    });
    App.draw = function (x, y, type) {
      if (type === "mousedown") {
        App.ctx.beginPath()
        return App.ctx.moveTo(x, y)
      } else if (type === "mousemove") {
        App.ctx.lineTo(x, y)
        return App.ctx.stroke()
      } else {
        return App.ctx.closePath()
      }
    }
  }

  App.init();

  /*
  	Draw Events
  */
  var dragging = false;
  $('#canvas').on('mousemove mousedown mouseup', function (e) {
    var offset, type, x, y;
    type = e.handleObj.type;
    offset = $(this).offset();
    if (type == "mousedown") {
      dragging = true
    } else if (type == "mouseup") {
      dragging = false
    }
    e.offsetX = e.originalEvent.layerX - offset.left;
    e.offsetY = e.originalEvent.layerY - offset.top;
    x = e.originalEvent.offsetX;
    y = e.originalEvent.offsetY;
    if (dragging) {
      App.draw(x, y, type);
      App.socket.emit('drawClick', {
        x: x,
        y: y,
        type: type,
        color: App.ctx.strokeStyle
      })
    }

    if (type == 'mouseup') {
      var canvas = $('#canvas').get(0);
      var dataURL = canvas.toDataURL();
      var title = $('#title').val()
      App.socket.emit('drawBase64', {
        dataURL: dataURL,
        user: 'yolo',
        title: title
      })
    }
  });

}).call(this);