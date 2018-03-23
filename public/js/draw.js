(function () {
  let App;
  App = {};
  const process = {
    env: {
      IP: 'http://127.0.0.1:4444'
    }
  }
  /*
  	Init 
  */
  App.init = function () {
    $('#colorpicker').colorpicker({
      color: '#ffaa00',
      container: true,
      inline: true
    }).on('colorpickerChange colorpickerCreate', (e) => {
      App.ctx.strokeStyle = e.color.toRgbString()
    })
    App.canvas = document.createElement('canvas')
    App.canvas.height = 520
    App.canvas.width = 1000
    App.canvas.id = 'canvas'
    document.getElementsByTagName('article')[0].appendChild(App.canvas)
    App.ctx = App.canvas.getContext("2d")
    App.ctx.fillStyle = "solid"
    App.ctx.lineWidth = 5
    App.ctx.lineCap = "round"
    App.socket = io.connect(process.env.IP)
    App.socket.on('draw', function (data) {
      App.draw(data.x, data.y, data.type, data.color)
    });
    App.draw = function (x, y, type, color) {
      const tempColor = App.ctx.strokeStyle
      if (color != null)
        App.ctx.strokeStyle = color

      if (type === "mousedown") {
        App.ctx.beginPath()
        App.ctx.moveTo(x, y)
      } else if (type === "mousemove") {
        App.ctx.lineTo(x, y)
        App.ctx.stroke()
      } else {
        App.ctx.closePath()
      }

      App.ctx.strokeStyle = tempColor
    }

    App.loadSnapshot = (snapshotId) => {
      const req = 'http://' + process.env.IP + '/snapshot/' + snapshotId
      $.getJSON(req, (res) => {
        const image = new Image()
        image.onload = () => {
          App.ctx.drawImage(image, 0, 0)
        }
        image.src = res.dataURL
      });
    }
  }

  App.init();

  /*
  	Draw Events
  */
  let dragging = false;
  $('#canvas').on('mousemove mousedown mouseup', function (e) {
    let offset, type, x, y;
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
      const canvas = $('#canvas').get(0);
      const dataURL = canvas.toDataURL();
      const title = $('#title').val()
      App.socket.emit('drawBase64', {
        dataURL: dataURL,
        user: 'yolo',
        title: title
      })
    }
  });

}).call(this);