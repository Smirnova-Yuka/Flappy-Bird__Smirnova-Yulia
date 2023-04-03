const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
    
// объекты изображения, которые будем
// использовать для создания анимаций

const bird = new Image();
const bg = new Image(); 
const fg = new Image(); 
const pipeUp = new Image(); 
const pipeBottom = new Image(); 
 

bird.src = "img/bird.png"; // изображение птицы
bg.src = "img/bg.png"; // изображение фона
fg.src = "img/fg.png"; // изображение переднего фона
pipeUp.src = "img/pipeUp.png"; // изображение трубы
pipeBottom.src = "img/pipeBottom.png"; // изображение трубы


let gapPipe = 100;//переменная для размера зазора между трубами

let gameScore = 0;//счёт игры
let gameRecord; //рекорд в игре
localStorage.getItem("Record")> 0 ? gameRecord = localStorage.getItem("Record") : gameRecord = 0;

//переменные для позиции птички
let xPosition = 10; 
let yPosition = 150;
let gravity = 1;//сила гравитации


//БЛОКИ
let pipe = [];
//создаём первый объект в массиве
pipe[0] = {
  x: canvas.width, //за экраном
  y: 0,
}


//ПРИ НАЖАТИИ НА КНОПКУ птичка должна подлетать вверх
document.addEventListener("keydown", birdUp);
function birdUp (){
  yPosition -= 25;
}

//РИСОВАНИЕ
function draw() {
  ctx.drawImage(bg, 0, 0); //рисуем на канве с помощью метода drawImage

  //рисование БЛОКОВ c трубами проходит в цикле
  for (let i=0; i < pipe.length; i++) {
    ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y); //положение верхней трубы
    //нижняя труба позиция по х, по у прибавляем высоту верхней трубы + переменную с зазором для птицы
    ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gapPipe); 
    pipe[i].x -= 1;//добавляем движение по х

    //добавляем новые блоки труб
      if(pipe[i].x == 50) {
        pipe.push({
          x : canvas.width,
          y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height,
        });
      }
    //условие для проигрыша - птичка дотронулась до труб и переднего фона
      if(xPosition + bird.width >= pipe[i].x
        && xPosition <= pipe[i].x + pipeUp.width
        && (yPosition <= pipe[i].y + pipeUp.height
        || yPosition + bird.height >= pipe[i].y + pipeUp.height + gapPipe) 
        || yPosition + bird.height >= canvas.height - fg.height) {
      location.reload(); // Перезагрузка страницы
      }
      
      //подсчёт очков
      if(pipe[i].x == 1) {
        gameScore++;
        if(gameScore > localStorage.getItem("Record")){
          // если счёт больше рекорда, то записываем в память
          localStorage.setItem("Record", gameScore);
        }
      }
  }
  


  //положение птички, используем заданные переменные для х и у
  ctx.drawImage(bird, xPosition, yPosition);
  yPosition += gravity //к позиции по у будем прибавлять гравитацию


  //положение переднего фоны,вычитаем из высоты канвы, чтобы расположить снизу по у
  ctx.drawImage(fg, 0, canvas.height - fg.height);

  //табло со счётом
  ctx.fillStyle = "#5cb114";
  ctx.font = "30px Arial";
  ctx.fillText("Очки: " + gameScore, 10, canvas.height - 70);

  //табло с рекордом
  ctx.fillStyle = "#5cb114";
  ctx.font = "20px Arial";
  ctx.fillText("Рекорд: " + gameRecord, 10, canvas.height - 30);

  
  requestAnimationFrame(draw); // метод requestAnimationFrame будет вызывать функцию draw постоянно

}
 
const button = document.querySelector(".button");
button.addEventListener('click', deleteRecord);
function deleteRecord (){
  localStorage.clear();
  gameRecord = 0;
}

 pipeBottom.onload = draw(); // Вызов функции из вне после того как загрузится последняя картинка







