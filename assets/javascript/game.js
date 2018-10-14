$(document).ready(function() {

var characters = {
    Morgana: {
      name: "Morgana",
      health: 560,
      attack: 2,
      imageUrl: "assets/images/morgana.png",
      enemyAttackBack: 15,
    
    },
  
    LeeSin: {
      name: "Lee Sin",
      health: 570,
      attack: 4,
      imageURL: "assets/images/leesin.png",
      enemyAttackBack: 5,
      
    },
  
    Orianna: {
      name: "Orianna",
      health: 530,
      attack: 1,
      enemyAttackBack: 20,
      imageURL: "assets/images/orianna.png"
    },
  
    Teemo: {
      name: "Teemo",
      health: 528,
      attack: 1,
      enemyAttackBack: 25,
      imageURL: "assets/images/teemo.png"
    },
  };
 
  console.log(characters);
  
  var currSelectedCharacter;
  var currDefender;
  var combatants = [];
  var indexofSelChar;
  var attackResult;
  var turnCounter = 1;
  var killCount = 0;
  
  
  var renderOne = function(character, renderArea, makeChar) {
      
      var charDiv = $("<div class='character' data-name='" + character.name + "'>");
      var charName = $("<div class='character-name'>").text(character.name);
      var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
      var charHealth = $("<div class='character-health'>").text(character.health);
      charDiv.append(charName).append(charImage).append(charHealth);
      $(renderArea).append(charDiv);
    
      if (makeChar == 'enemy') {
        $(charDiv).addClass('enemy');
      } else if (makeChar == 'defender') {
        currDefender = character;
        $(charDiv).addClass('target-enemy');
      }
    };
  
  
    var renderMessage = function(message) {
      var gameMesageSet = $("#gameMessage");
      var newMessage = $("<div>").text(message);
      gameMesageSet.append(newMessage);
  
      if (message == 'clearMessage') {
        gameMesageSet.text('');
      }
    };
  
    var renderCharacters = function(charObj, areaRender) {
     
      if (areaRender == '#characters-section') {
        $(areaRender).empty();
        for (var key in charObj) {
          if (charObj.hasOwnProperty(key)) {
            renderOne(charObj[key], areaRender, '');
          }
        }
      }
     
      if (areaRender == '#selected-character') {
        $('#selected-character').prepend("Your Character");       
        renderOne(charObj, areaRender, '');
        $('#attack-button').css('visibility', 'visible');
      }
     
      if (areaRender == '#available-to-attack-section') {
          $('#available-to-attack-section').prepend("Choose Your Next Opponent");      
        for (var i = 0; i < charObj.length; i++) {
  
          renderOne(charObj[i], areaRender, 'enemy');
        }
    
        $(document).on('click', '.enemy', function() {
          
          name = ($(this).data('name'));
         
          if ($('#defender').children().length === 0) {
            renderCharacters(name, '#defender');
            $(this).hide();
            renderMessage("clearMessage");
          }
        });
      }
      
      if (areaRender == '#defender') {
        $(areaRender).empty();
        for (var i = 0; i < combatants.length; i++) {
         
          if (combatants[i].name == charObj) {
            $('#defender').append("Your selected opponent")
            renderOne(combatants[i], areaRender, 'defender');
          }
        }
      }
      
      if (areaRender == 'playerDamage') {
        $('#defender').empty();
        $('#defender').append("Your selected opponent")
        renderOne(charObj, '#defender', 'defender');
        
      }
     
      if (areaRender == 'enemyDamage') {
        $('#selected-character').empty();
        renderOne(charObj, '#selected-character', '');
      }
      
      if (areaRender == 'enemyDefeated') {
        $('#defender').empty();
        var gameStateMessage = "You have defated " + charObj.name + ", you can choose to fight another enemy.";
        renderMessage(gameStateMessage);
      
      }
    };
    
    renderCharacters(characters, '#characters-section');
    $(document).on('click', '.character', function() {
      name = $(this).data('name');
     
      if (!currSelectedCharacter) {
        currSelectedCharacter = characters[name];
        for (var key in characters) {
          if (key != name) {
            combatants.push(characters[key]);
          }
        }
        $("#characters-section").hide();
        renderCharacters(currSelectedCharacter, '#selected-character');
        
        renderCharacters(combatants, '#available-to-attack-section');
      }
    });
  
    
    $("#attack-button").on("click", function() {
   
      if ($('#defender').children().length !== 0) {
        
        var attackMessage = "You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
        renderMessage("clearMessage");
    
        currDefender.health = currDefender.health - (currSelectedCharacter.attack * turnCounter);
  
      
        if (currDefender.health > 0) {
   
          renderCharacters(currDefender, 'playerDamage');
         
          var counterAttackMessage = currDefender.name + " attacked you back for " + currDefender.enemyAttackBack + " damage.";
          renderMessage(attackMessage);
          renderMessage(counterAttackMessage);
  
          currSelectedCharacter.health = currSelectedCharacter.health - currDefender.enemyAttackBack;
          renderCharacters(currSelectedCharacter, 'enemyDamage');
          if (currSelectedCharacter.health <= 0) {
            renderMessage("clearMessage");
            restartGame("Defeated");
           
            $("#attack-button").unbind("click");
          }
        } else {
          renderCharacters(currDefender, 'enemyDefeated');
          killCount++;
          if (killCount >= 3) {
            
            restartGame("You Win");
           
  
          }
        }
        turnCounter++;
      } else {
        
        renderMessage("No one here");
        rtwoo.play();
      }
    });
  

    var restartGame = function(inputEndGame) {
    
      var restart = $('<button class="btn">Restart</button>').click(function() {
        location.reload();
      });
      var gameState = $("<div>").text(inputEndGame);
      $("#gameMessage").append(gameState);
      $("#gameMessage").append(restart);
    };
  
  });