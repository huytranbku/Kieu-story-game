var debug = false;
var mode = "start";
var poemArray = false;
var score = 0;
var life = 5;
var ans1 = [];
var ans2 = [];
var changeQuestion = false;

var util = {
  randomBetween: function(min, max){
    return Math.floor(Math.random() * (max - min + 1 )) + min;
  },
  createSpanFromText: function(text, className, style, more){
    return "<span class='"+className+"' style='"+style+"' "+more+">" + text + "</span>";
  },
  shuffle: function(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
  },
  compareArray: function (array1, array2) {
    if (!array2)
        return false;
    if (array1.length != array2.length)
        return false;

    for (var i = 0, l=array1.length; i < l; i++) {
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            if (!util.compareArray(array1[i],array2[i]))
                return false;
        }
        else if (array1[i] != array2[i]) {
            return false;
        }
    }
    return true;
  }
}

// for (var i = 0; i < 100; i++) {
//   console.log(util.randomBetween(0,999));
// }


var sceneAction = {
  start: function(){

  },
  play: function(){
    showAQuestion();
  },
  end: function(){
    $(".h3Score").html(score);
  },
  right: function(){

  },
  wrong: function(){

  },
}

function showAQuestion(){
  var generatedResult = getACoupleSentences();
  if (!generatedResult) return;
  var sent1 = generatedResult[2].split(" ");
  var sent2 = generatedResult[3].split(" ");
  if (sent1.length!= 6 || sent2.length!=8){
    console.log("Error:");
    console.log(sent1);
    console.log(sent2);
    showAQuestion();
    return;
  }
  var orders1 = [0,1,2,3,4,5];
  var orders2 = [0,1,2,3,4,5,6,7];
  util.shuffle(orders1);
  util.shuffle(orders2);

  var htmlSent1 = [];
  var htmlSent2 = [];

  var htmlQuesSent1 = [];
  var htmlQuesSent2 = [];

  var htmlAns1 = [];
  var htmlAns2 = [];

  for (var i = 0; i < sent1.length; i++) {
    htmlSent1.push(util.createSpanFromText(sent1[i],"s s1 s1-"+i,""," data-position='"+i+"'"));
    htmlAns1.push(util.createSpanFromText("???","s sunk","",""));
  }

  for (var i = 0; i < sent2.length; i++) {
    htmlSent2.push(util.createSpanFromText(sent2[i],"s s2 s2-"+i,""," data-position='"+i+"'"));
    htmlAns2.push(util.createSpanFromText("???","s sunk ","",""));
  }

  for (var i = 0; i < sent1.length; i++) {
    htmlQuesSent1.push(htmlSent1[orders1[i]]);
  }

  for (var i = 0; i < sent2.length; i++) {
    htmlQuesSent2.push(htmlSent2[orders2[i]]);
  }
  var content = ("<div class='status'>Số mạng: #life &nbsp;&nbsp; Số điểm: #score</div>").replace("#life", life).replace("#score", score);
  content += ""
  + "<div class='readmore'>" + generatedResult[0] + "<br>" + generatedResult[1] + "</div>"
  + "<div class='ques'>" + htmlQuesSent1.join(" ") + "</div>"
  + "<div class='ques'>" + htmlQuesSent2.join(" ") + "</div>"
  + "<div class='ans ans1'>" + htmlAns1.join(" ") + "</div>"
  + "<div class='ans ans2'>" + htmlAns2.join(" ") + "</div>"
  + "</div>";
  // content += "<div class='btn-submit'>Nộp bài</div>"
  $(".play-scene .container").html(content);
  $(".r1").html(htmlSent1.join(" "));
  $(".r2").html(htmlSent2.join(" "));
  ans1 = [];
  ans2 = [];
  var countingAddedWords = 0;
  $(".ques .s1").click(function(){
    if ($(this).hasClass("added")) return;
    var pos = $(this).data("position");
    $(this).addClass("added");
    ans1.push(pos);
    htmlAns1 = [" "];
    for (var i = 0; i < sent1.length; i++) {
      if(i < ans1.length) {
        htmlAns1.push(htmlSent1[ans1[i]]);
      } else {
        htmlAns1.push(util.createSpanFromText("???","s sunk","",""));
      }
    }
    countingAddedWords += 1;
    if (countingAddedWords == 14) submitAns();
    $(".ans1").html(htmlAns1.join(" "));
  });

  $(".ques .s2").click(function(){
    if ($(this).hasClass("added")) return;
    var pos = $(this).data("position");
    $(this).addClass("added");
    ans2.push(pos);
    htmlAns2 = [" "];
    for (var i = 0; i < sent2.length; i++) {
      if(i < ans2.length) {
        htmlAns2.push(htmlSent2[ans2[i]]);
      } else {
        htmlAns2.push(util.createSpanFromText("???","s sunk","",""));
      }
    }
    countingAddedWords += 1;
    if (countingAddedWords == 14) submitAns();
    $(".ans2").html(htmlAns2.join(" "));
  });

  function submitAns(){
    setTimeout(function(){
      if (util.compareArray(ans1,[0,1,2,3,4,5]) && util.compareArray(ans2,[0,1,2,3,4,5,6,7])){
        app.increaseScore();
      } else {
        app.decreaseLife();
      }
    }, 1000);
  }
  //
  // if (!changeQuestion){
  //   changeQuestion = setTimeout(function(){
  //     submitAns();
  //   }, 30000);
  // } else {
  //   clearTimeout(changeQuestion);
  //   changeQuestion = false;
  // }

}

function getACoupleSentences(){
  var len = poemArray.length;
  var halfLen = Math.round(len / 2);
  var rnd = util.randomBetween(0, halfLen - 1 - 1);
  return [poemArray[rnd*2], poemArray[rnd*2+1], poemArray[rnd*2+2], poemArray[rnd*2+3]]
}

var app = {
  changeScene: function(name){
    mode = name;
    $(".scene").fadeOut();
    $("." + name + "-scene").fadeIn();
    sceneAction[name]();
  },
  getData: function (cb){
    var file = "./kieu.html";
    if (debug){
      file = "./kieu-short.html";
      life = 1;
    }
    $.get(file, function(res){
      poemArray = res.split("\n");
      if (cb) cb();
    });
  },
  init: function (){
    this.getData(()=>{
      this.changeScene(mode);
      if(debug){
        this.changeScene("play");
      }
    });

  },
  increaseScore(){
    score = score + 1;
    this.changeScene("right");
    setTimeout(function(){
      app.changeScene("play");
    }, 5000);
  },
  decreaseLife(){
    life = life - 1;
    if (life == 0){
      this.changeScene("end");
    } else {
      this.changeScene("wrong");
      setTimeout(function(){
        app.changeScene("play");
      }, 5000);
    }
  }
}


$(document).ready(function(){
  app.init();

});
