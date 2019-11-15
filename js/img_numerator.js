// var and function creation

var img = new Image();
var initial_canvas = document.createElement("canvas");
var initial_canvas_ctx = initial_canvas.getContext("2d");
var numerated_canvas = document.createElement("canvas");
var numerated_canvas_ctx = numerated_canvas.getContext("2d");
var stencil_canvas = document.createElement("canvas");
var stencil_canvas_ctx = stencil_canvas.getContext("2d");
var colors_catalog_canvas = document.createElement("canvas");
var colors_catalog_canvas_ctx = colors_catalog_canvas.getContext("2d");
var colors_catalog = [];
var square_size; // tamanho da quadricula em pixeis
var final_canvas_square_size;
var img_width;
var img_height;
var number_of_squares_in_width; // numero de quadriculas no comprimento
var number_of_squares_in_height; // numero de quadriculas na altura
var rgba_tolerance;
var include_white_squares;

/**
 *
 * @param {number} x - coordenada do eixo dos x do pixel
 * @param {number} y - coordenada do eixo dos y do pixel
 *
 * @returns {object} Objeto com os valores de RGBA da cor
 *
 */
function get_square_color(x, y) {
  var center_x = Math.round(x + square_size / 2);
  var center_y = Math.round(y + square_size / 2);
  var raw_data = initial_canvas_ctx.getImageData(center_x, center_y, 1, 1);
  var color = {};
  color.red = raw_data.data[0];
  color.green = raw_data.data[1];
  color.blue = raw_data.data[2];
  color.alpha = raw_data.data[3];
  console.log(
    "> [COLOR GET] Color in pixel (" +
      center_x +
      "," +
      center_y +
      ") is rgba(" +
      color.red +
      "," +
      color.green +
      "," +
      color.blue +
      "," +
      color.alpha +
      ")"
  );
  return color;
}

/**
 *
 * @param {object} color - Objeto com os valores de RGBA da cor
 *
 * @returns {number} Index da cor no catalogo de cores. Se a cor nao tiver no catalogo e adicionada e devolve o index que foi atribuido a cor
 *
 */
function check_color_in_catalog_add_if_not(color) {
  for (var element = 0; element < colors_catalog.length; element++) {
    if (
      color.red <= colors_catalog[element].red + rgba_tolerance &&
      color.red >= colors_catalog[element].red - rgba_tolerance &&
      (color.green <= colors_catalog[element].green + rgba_tolerance &&
        color.green >= colors_catalog[element].green - rgba_tolerance) &&
      (color.blue <= colors_catalog[element].blue + rgba_tolerance &&
        color.blue >= colors_catalog[element].blue - rgba_tolerance) &&
      (color.alpha <= colors_catalog[element].alpha + rgba_tolerance &&
        color.alpha >= colors_catalog[element].alpha - rgba_tolerance)
    ) {
      console.log(
        "> [COLOR CHECK] Color rgba(" +
          color.red +
          "," +
          color.green +
          "," +
          color.blue +
          "," +
          color.alpha +
          ") already in catalog with index " +
          element
      );
      return element;
    }
  }
  colors_catalog.push(color);
  console.log(
    "> [COLOR CHECK] Color rgba(" +
      color.red +
      "," +
      color.green +
      "," +
      color.blue +
      "," +
      color.alpha +
      ") not in catalog. Added with index " +
      colors_catalog.length -
      1
  );
  return colors_catalog.length - 1;
}

/**
 *
 * @param {object} color
 * @param {number} number
 *
 * @returns {void}
 *
 */
function create_new_square_and_stencil_circles(color, number, x, y) {
  var main_color =
    "rgba(" +
    color.red +
    "," +
    color.green +
    "," +
    color.blue +
    "," +
    color.alpha +
    ")";
  var aux_color = document.getElementById("aux_color").value;
  var font_color = document.getElementById("text_color").value;

  // retangulo de fora
  numerated_canvas_ctx.strokeStyle = aux_color;
  numerated_canvas_ctx.lineWidth = 2;
  numerated_canvas_ctx.strokeRect(
    x,
    y,
    final_canvas_square_size,
    final_canvas_square_size
  );
  numerated_canvas_ctx.fillStyle = main_color;
  numerated_canvas_ctx.fillRect(
    x + 1,
    y + 1,
    final_canvas_square_size - 2,
    final_canvas_square_size - 2
  );

  // retangulo de dentro
  numerated_canvas_ctx.fillStyle = aux_color;

  numerated_canvas_ctx.fillRect(
    x + final_canvas_square_size / 2 - final_canvas_square_size / 2 / 2,
    y + final_canvas_square_size / 2 - final_canvas_square_size / 2 / 2,
    final_canvas_square_size / 2,
    final_canvas_square_size / 2
  );

  // número
  numerated_canvas_ctx.fillStyle = font_color;
  numerated_canvas_ctx.font = final_canvas_square_size / 4 + "pt Monospace";
  numerated_canvas_ctx.textAlign = "center";
  numerated_canvas_ctx.fillText(
    ("0" + number).slice(-2),
    x + final_canvas_square_size / 2,
    y + final_canvas_square_size / 2 + final_canvas_square_size / 4 / 2
  );

  // circulos para a img numerada
  numerated_canvas_ctx.fillStyle = aux_color;
  numerated_canvas_ctx.beginPath();
  numerated_canvas_ctx.arc(x, y, final_canvas_square_size / 10, 0, 2 * Math.PI);
  numerated_canvas_ctx.closePath();
  numerated_canvas_ctx.fill();
  numerated_canvas_ctx.beginPath();
  numerated_canvas_ctx.arc(
    x,
    y + final_canvas_square_size,
    final_canvas_square_size / 10,
    0,
    2 * Math.PI
  );
  numerated_canvas_ctx.closePath();
  numerated_canvas_ctx.fill();
  numerated_canvas_ctx.closePath();
  numerated_canvas_ctx.arc(
    x + final_canvas_square_size,
    y,
    final_canvas_square_size / 10,
    0,
    2 * Math.PI
  );
  numerated_canvas_ctx.closePath();
  numerated_canvas_ctx.fill();
  numerated_canvas_ctx.beginPath();
  numerated_canvas_ctx.arc(
    x + final_canvas_square_size,
    y + final_canvas_square_size,
    final_canvas_square_size / 10,
    0,
    2 * Math.PI
  );
  numerated_canvas_ctx.closePath();
  numerated_canvas_ctx.fill();
  console.log(
    "> [NEW SQUARE IN NUMERATED IMAGE] Created square in pixel (" +
      x +
      "," +
      y +
      ") with color rgba(" +
      color.red +
      "," +
      color.green +
      "," +
      color.blue +
      "," +
      color.alpha +
      ") and number " +
      number
  );

  // circulos para o stencil
  stencil_canvas_ctx.fillStyle = aux_color;
  stencil_canvas_ctx.beginPath();
  stencil_canvas_ctx.arc(x, y, final_canvas_square_size / 10, 0, 2 * Math.PI);
  stencil_canvas_ctx.closePath();
  stencil_canvas_ctx.fill();
  stencil_canvas_ctx.beginPath();
  stencil_canvas_ctx.arc(
    x,
    y + final_canvas_square_size,
    final_canvas_square_size / 10,
    0,
    2 * Math.PI
  );
  stencil_canvas_ctx.closePath();
  stencil_canvas_ctx.fill();
  stencil_canvas_ctx.closePath();
  stencil_canvas_ctx.arc(
    x + final_canvas_square_size,
    y,
    final_canvas_square_size / 10,
    0,
    2 * Math.PI
  );
  stencil_canvas_ctx.closePath();
  stencil_canvas_ctx.fill();
  stencil_canvas_ctx.beginPath();
  stencil_canvas_ctx.arc(
    x + final_canvas_square_size,
    y + final_canvas_square_size,
    final_canvas_square_size / 10,
    0,
    2 * Math.PI
  );
  stencil_canvas_ctx.closePath();
  stencil_canvas_ctx.fill();
  console.log(
    "> [NEW SQUARE IN STENCIL] Created square in pixel (" + x + "," + y + ")"
  );
}

/**
 *
 * Criar imagem numerada e stencil
 *
 */
function numerate_all() {
  for (var y = 0; y < number_of_squares_in_height; y++) {
    for (var x = 0; x < number_of_squares_in_width; x++) {
      var current_color = get_square_color(x * square_size, y * square_size);
      if (
        !(
          current_color.red == 255 &&
          current_color.green == 255 &&
          current_color.blue == 255 &&
          !include_white_squares
        )
      ) {
	var number = check_color_in_catalog_add_if_not(current_color);
        create_new_square_and_stencil_circles(
          colors_catalog[number],
          number,
          x * final_canvas_square_size + final_canvas_square_size / 10,
          y * final_canvas_square_size + final_canvas_square_size / 10
        );
      }
    }
  }
  generate_color_catalog_img();

  document.getElementById("img_final").src = numerated_canvas.toDataURL();
  document.getElementById("color_catalog").src = colors_catalog_canvas.toDataURL();
  document.getElementById("stencil").src = stencil_canvas.toDataURL();

  alert("Processamento finalizado.");
}

/**
 *
 * Criar catálogo de cores
 *
 */
function generate_color_catalog_img() {
  colors_catalog_canvas.width =
    10 +
    10 * colors_catalog.length +
    colors_catalog.length * final_canvas_square_size;
  colors_catalog_canvas.height = 40 + 3 * final_canvas_square_size;

  for (var index = 0; index < colors_catalog.length; index++) {
    var x = index * final_canvas_square_size + 10 + index * 10;

    // cor
    colors_catalog_canvas_ctx.fillStyle =
      "rgba(" +
      colors_catalog[index].red +
      "," +
      colors_catalog[index].green +
      "," +
      colors_catalog[index].blue +
      "," +
      colors_catalog[index].alpha +
      ")";
    colors_catalog_canvas_ctx.fillRect(
      x,
      10,
      final_canvas_square_size,
      final_canvas_square_size
    );

    // numero
    colors_catalog_canvas_ctx.fillStyle = "black";
    colors_catalog_canvas_ctx.textAlign = "center";
    colors_catalog_canvas_ctx.font =
      final_canvas_square_size / 2 + "pt Monospace";
    colors_catalog_canvas_ctx.fillText(
      ("0" + index).slice(-2),
      x + final_canvas_square_size / 2,
      20 + final_canvas_square_size + (3 / 4) * final_canvas_square_size
    );

    // la
    colors_catalog_canvas_ctx.lineWidth = 2;
    colors_catalog_canvas_ctx.strokeRect(
      x,
      30 + 2 * final_canvas_square_size,
      final_canvas_square_size,
      final_canvas_square_size
    );
    colors_catalog_canvas_ctx.fillText(
      "Lã",
      x + final_canvas_square_size / 2,
      30 + 2 * final_canvas_square_size + (3 / 4) * final_canvas_square_size
    );
  }
}

// CODE TO RUN
// numerate
document.getElementById("img_upload").addEventListener("submit", function(e) {
  e.preventDefault();

  img.src = URL.createObjectURL(document.getElementById("img").files[0]);
  square_size = parseInt(document.getElementById("square_size").value);
  rgba_tolerance = parseInt(document.getElementById("rgba_tolerance").value);
  final_canvas_square_size = parseInt(
    document.getElementById("final_canvas_square_size").value
  );
  include_white_squares = document.getElementById("include_white_squares")
    .checked;

  img.onload = function() {
    img_width = img.naturalWidth;
    img_height = img.naturalHeight;

    initial_canvas.width = img_width;
    initial_canvas.height = img_height;
    initial_canvas_ctx.drawImage(img, 0, 0);

    number_of_squares_in_width = img_width / square_size;
    number_of_squares_in_height = img_height / square_size;

    var final_canvas_width =
      number_of_squares_in_width * final_canvas_square_size +
      2 * (final_canvas_square_size / 10);
    var final_canvas_height =
      number_of_squares_in_height * final_canvas_square_size +
      2 * (final_canvas_square_size / 10);

    numerated_canvas.width = final_canvas_width;
    numerated_canvas.height = final_canvas_height;

    stencil_canvas.width = final_canvas_width;
    stencil_canvas.height = final_canvas_height;

    if (
      Number.isInteger(number_of_squares_in_width) &&
      Number.isInteger(number_of_squares_in_height)
    ) {
      numerate_all();
    } else if (
      window.confirm(
        "O comprimento ou a largura desta imagem com o tamanho de quadrícula fornecido não irá produzir um número inteiro de quadriculas o que levará a uma imagem não precisa.\nDeseja continuar?"
      )
    ) {
      numerate_all();
    } else {
      alert("Operação cancelada.");
    }
  };
});

// preview img carregada
document.getElementById("img").addEventListener("change", function(e) {
  document.getElementById("img_preview").src = URL.createObjectURL(
    e.target.files[0]
  );
});

// imprimir img
document.getElementById("img_final_view").addEventListener("click", function() {
  var w = window.open("");
  w.document.write(
    "<img style='width: 100%;' src='" + numerated_canvas.toDataURL() + "'/>"
  );
  w.print();
  w.document.close();
});

document
  .getElementById("color_catalog_view")
  .addEventListener("click", function() {
    var w = window.open("");
    w.document.write(
      "<img style='width: 100%;' src='" +
        colors_catalog_canvas.toDataURL() +
        "'/>"
    );
    w.print();
    w.document.close();
  });

document.getElementById("stencil_view").addEventListener("click", function() {
  var w = window.open("");
  w.document.write(
    "<img style='width: 100%;' src='" + stencil_canvas.toDataURL() + "'/>"
  );
  w.print();
  w.document.close();
});
