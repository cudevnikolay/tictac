// Object for tracking the game
function TicTac() {
    // object variables
    this.boardTable = document.getElementById('board');
    this.botButton = document.getElementById('bot_game');
    
    this.botGame = false;
    this.botMove = false;
    this.emptyStroke;
    
    this.support = new Support;
    this.lastMove = true;
    this.inProcess = true;
    this.size = 3;
    
    // object methods
    this.setSettings = function() {
        this.size = document.querySelector('input[name=size]:checked').value;  
    }, 
    this.drawBoard = function() {
        var ready = this.buildTable();
        this.inProcess = true;
        this.lastMove == true;
        if (ready && this.botGame && this.botMove) {
            this.boardTable.querySelector('td[item="' + (Math.ceil(this.size * this.size / 2)) + '"]').click();    
        }
    },
    this.buildTable = function() {
        // Build the HTML table to be inserted into the table id=board
        var fields = '',
            fieldCounter = 1;

        this.setSettings();
        this.setBotLevel();
            
        this.emptyStroke = [];
        for (var intRow = 0; intRow < this.size; intRow++) {
           fields += "<tr>";
           for (var intCell = 1; intCell <= this.size; intCell++) {
              fields += "<td item='" + fieldCounter + "'></td>";
              this.emptyStroke.push(fieldCounter);
              fieldCounter++;
           }   
           fields += "</tr>";
        }

        this.boardTable.innerHTML = fields;
        return true;
    },
    this.setBotLevel = function() {
        this.botGame = parseInt(document.querySelector('input[name=level]:checked').value);
    }, 
    this.checkWinner = function(xCount, oCount) {
        // Process results of the scan for a winner.
        if (this.size == oCount || this.size == xCount) { 
            this.inProcess = false;
            winner = this.lastMove ? "O" : "X";
            countHits = this.boardTable.getElementsByClassName(winner).length;
            countHits += (countHits > 4) ? ' ходов' : ' хода';
            if (confirm(winner +"-man выграл за " + countHits + "! Продолжить?")) this.drawBoard();
           
            return true;
        }
        return false;
    },
    this.checkGame = function() {
        // Tests all the directions for a winner.
        var xCount = 0, oCount = 0, total = 0,
            el = document.all.board;
        // Check horizontal direction.
        for (var intRows = 0; intRows < this.size; intRows++) {
           xCount = 0, oCount = 0;
           for (var intCells = 0; intCells < this.size; intCells++) {
              var strCell = el.rows[intRows].cells[intCells];
              if ("X" == strCell.innerText) xCount++;
              if ("O" == strCell.innerText) oCount++;
           }
           if (this.checkWinner(xCount, oCount)) return;
           total += xCount + oCount;
        }
        // Check vertical direction.
        for (var intCells = 0; intCells < this.size; intCells++)  {
           xCount = 0, oCount = 0;
           for (var intRows = 0; intRows < this.size; intRows++) {
              var strCell = el.rows[intRows].cells[intCells];
              if ("X" == strCell.innerText) xCount++;
              if ("O" == strCell.innerText) oCount++;
           }
           if (this.checkWinner(xCount, oCount)) return;
        }

        // Check diagonal (upper left to lower right).
        xCount = 0, oCount = 0;
        for (var intRows = 0; intRows < this.size; intRows++) {
           var strCell = el.rows[intRows].cells[intRows];
           if ("X" == strCell.innerText) xCount++;
           if ("O" == strCell.innerText) oCount++;
        }
        if (this.checkWinner(xCount, oCount)) return;

        // Check diagonal (lower left to upper right).
        xCount = 0, oCount = 0;
        for (var intRows = 0; intRows < this.size; intRows++) {
           var strCell = el.rows[this.size - intRows - 1].cells[intRows];
           if ("X" == strCell.innerText) xCount++;
           if ("O" == strCell.innerText) oCount++;
        }
        if (this.checkWinner(xCount, oCount)) return;
        
        if (total == this.size * this.size) {
           alert("Ничья!");
           this.inProcess = false;
           return;
        }
        
        return true;
    },
    this.doBoardClick = function(event) {
        if (this.inProcess) {
           if ("TD" == event.target.tagName) {
              var strCell = event.target;
              // Check whether the cell is available.
              if ("" == strCell.innerHTML) {
                 strCell.innerText = (this.lastMove ? "X" : "O");
                 strCell.className = (this.lastMove ? "X" : "O");
                 this.lastMove = !this.lastMove;
                 
                 if (!this.checkGame()) return;
                 
                 if (this.botGame) {
                     var item = strCell.getAttribute('item');
                     this.emptyStroke = this.emptyStroke.filter(function(value) { 
                        return item != value
                     });
                     this.botMove = !this.botMove;
                     if (this.botMove) {  
                        this.findBotStroke();
                     }
                 }
              }
           }
        }
    },
    this.findBotStroke = function() {
        var index = this.support.getRandomInt(0, this.emptyStroke.length);
        this.boardTable.querySelector('td[item="' + this.emptyStroke[index] + '"]').click();
    }
}

function Support() {
    this.getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
}

// Init game
var game = new TicTac;
game.buildTable();
