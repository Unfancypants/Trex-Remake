var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex,trexIa, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;

var imgFimDeJogo,imgReiniciar
var somSalto , somCheckPoint, somMorte


function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
    
  imgReiniciar = loadImage("restart.png")
  imgFimDeJogo = loadImage("gameOver.png")
  imgJumpBtn = loadImage("jumpBtn.png")
  
  somSalto = loadSound("jump.mp3")
  somMorte = loadSound("die.mp3")
  somCheckPoint = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  width1 =windowWidth 
  height1 =windowHeight
  
  jumpBtn = createSprite(windowWidth/2,windowHeight-100)
  jumpBtn.addImage(imgJumpBtn)
  
  trexIa = createSprite(0,0,100,80)
  
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided" ,trex_colidiu);
  trex.scale = 0.5;
  
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
    
  fimDeJogo = createSprite(windowWidth/2,100);
  fimDeJogo.addImage(imgFimDeJogo);
  
  reiniciar = createSprite(windowWidth/2,140);
  reiniciar.addImage(imgReiniciar);
  
  fimDeJogo.scale = 0.5;
  reiniciar.scale = 0.5;
    
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
   
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
   
  trex.setCollider("circle",0,0,40);
  pontuacao = 0;
  
  ia = false;
  
}

function draw() {
  
  
  
  if (width1 != windowWidth || height1 != windowHeight) {
    
    createCanvas(windowWidth, windowHeight);
     
    width1 =windowWidth 
    height1 =windowHeight
    
  }
  
  background(180);
  //exibindo pontuação
  text("Points: "+ pontuacao, 500,50);
  
  
  if(estadoJogo === JOGAR){
    fimDeJogo.visible = false
    reiniciar.visible = false
    //move o solo  
    solo.velocityX = -4;
    //marcando pontuação
    pontuacao = pontuacao + Math.round(frameCount/60);
    if (pontuacao % 100 == 0 && frameCount >= 400) {
      
      somCheckPoint.play();
      
    }
    
    if (solo.x < 0){
      solo.x = solo.width/2;
   } 
    
    //saltar quando a tecla de espaço é pressionada
    if(((keyDown("space") || (mousePressedOver(jumpBtn) && touches.length > 0))&& trex.velocityY == 0 && !ia) || (ia &&  trexIa.isTouching(grupodeobstaculos)&& trex.velocityY == 0 ))  {
       trex.velocityY = -12;
       somSalto.play()
       touches = [];
    }
    
    //Fazer a I.A.
    trexIa.visible = false;
    trexIa.x = trex.x;
    trexIa.y = trex.y;
    
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
   
    //gerar as nuvens
    gerarNuvens();
  
    //gerar obstáculos no solo
    gerarObstaculos();
    
    if(grupodeobstaculos.isTouching(trex)){
       estadoJogo = "ENCERRA";   
    }
  }
    
     else if (estadoJogo === "ENCERRA") {
       
      somMorte.play();
      estadoJogo = ENCERRAR;
       
       
     }
  
  
     else if (estadoJogo === ENCERRAR) {
      
       
       
      fimDeJogo.visible = true;
      reiniciar.visible = true;
     
      solo.velocityX = 0;
      trex.velocityY = 0
       
      //altera a animação do Trex
      trex.changeAnimation("collided", trex_colidiu);
     
      //define o tempo de vida dos objetos do jogo para que nunca sejam destruídos
    grupodeobstaculos.setLifetimeEach(-1);
    grupodenuvens.setLifetimeEach(-1);
     
     grupodeobstaculos.setVelocityXEach(0);
     grupodenuvens.setVelocityXEach(0);   
     }
  
  
  //evita que o Trex caia no solo
  trex.collide(soloinvisivel);

  if (mousePressedOver(reiniciar)) {
    
    reset();
    
  }
  
  drawSprites();
}

function gerarObstaculos(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(windowWidth+50,165,10,40);
  obstaculo.velocityX = -6;
      
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
   
    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(windowWidth+50,100,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 134; 
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adiciondo nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
}

function reset () {
  
  grupodeobstaculos.destroyEach();  
  grupodenuvens.destroyEach();
  
  trex.changeAnimation("running",trex_correndo)
  
  pontuacao = 0;
  
  estadoJogo = JOGAR
  
}
