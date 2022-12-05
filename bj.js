var suits = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];

var isPlayerTurn = false;
var handSplit = false;

class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }
    
    get desc() {
        var rank_str;
        if (this.rank == 1) 
            rank_str = "Ace";
        else if (this.rank == 11) 
            rank_str = "Jack";
        else if (this.rank == 12) 
            rank_str = "Queen";
        else if (this.rank == 13)
            rank_str = "King";
        else 
            rank_str = this.rank;
        
        return rank_str + " of " + suits[this.suit];
    }
    
    get image() {
        var rank_str;
        if (this.rank == 1) 
            rank_str = "A";
        else if (this.rank == 11) 
            rank_str = "J";
        else if (this.rank == 12) 
            rank_str = "Q";
        else if (this.rank == 13)
            rank_str = "K";
        else 
            rank_str = this.rank;
        
        return rank_str + suits[this.suit].charAt(0) + ".png";
    }
};

class Deck {
    constructor() {
        //Genertates all 52 cards in a deck
        this.deck = [];
        for(var suit = 0; suit < 4; suit++) //
        {
            for(var rank = 1; rank <= 13; rank++)
            {
                var card = new Card(suit, rank);  
                this.deck[this.deck.length] = card;
            }
        }
        
        this.currentTopCardIndex = 0;   //
    }
    
    shuffle() {
        for (var i = this.deck.length - 1; i > 0; i--)
        {

            // Pick a random index from 0 to i inclusive
            let j = Math.floor(Math.random() * (i + 1));

            // Swap arr[i] with the element
            // at random index
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    
    deal() {
        var topCard = this.currentTopCardIndex;
        this.currentTopCardIndex += 1;
        if(this.currentTopCardIndex >= this.deck.length) {
            console.log("Reset the deck...")
            this.shuffle();
            this.currentTopCardIndex = 0;
        }
        return this.deck[topCard];
    }
    
    
}

var addCardLi = function(cards, elementN) {   
    var img = cards[cards.length - 1].image;
    $(elementN).append('<li><img src="cards/PNG/' + img + '"><\li>');

}

// only show first card in dealer deck
var hideOne = function() {
    $("#foe li:first-child img").attr('src', "cards/PNG/purple_back.png");
}



var showCards = function(cards, elementN) {
    if(elementN == "ul#foe") { 
        [cards[1], cards[cards.length - 1]] = [cards[cards.length - 1], cards[1]];
    }
    
    
    $(elementN).empty();
    for(var i=0; i<cards.length; i++) {
        $(elementN).append('<li><img src="cards/PNG/' + cards[i].image + '"><\li>');
    }
}

var showCardsConsole = function(cards){
     for(var i=0; i<cards.length; i++)  {
        console.log(cards[i].desc);
    }
    console.log("===========================");
}

var isBlackJack = function(cards) {
    //You must only have two cards.
    if(cards.length == 2) {
        //The total points are 21
        if(sum(cards) == 21) {
            return true;
        } else {
            return false;
        }
    } else {
       return false; 
    }
    
}

var sum = function(cards) {
    
    var total = 0;
    var numOfAces = 0;
    
    for(var i=0; i<cards.length; i++) {
        var rank = cards[i].rank;
        var point = 0;
        if(rank == 1) {
            point = 11;
            numOfAces += 1;
        }
        else if(rank == 11 || rank == 12 || rank == 13) {
            point = 10;
        } else {
            point = rank;
        }
        
        total += point;
    }
    
    
    for(var i=0; i<numOfAces; i++) {
        if(total<=21){break;}
        total -= 10;
    }
    return total;
}

var showTotal = function(total, elementN){
    if(elementN == "#dpoints") {
        var name = "dealer. ";
    }
    else {
        var name = "player. ";
    }
    
    $(elementN).text( name + total);
}

var playerRound = function(cards, pointsloc, scards) {
    console.log(cards[0].rank);
    showTotal(sum(cards), pointsloc);
    if(isBlackJack(cards)) {
        $("#gamealert").text("you've got a black jack! you win!");
        isPlayerTurn=false;
        return;
    }
    else if(sum(cards) > 21 && scards.length ==0) {
        $("#gamealert").text("you burst! you lose!");
        isPlayerTurn=false;
        return;
    }
    else if (sum(cards) > 21 && scards.length > 0) {
        cards.length = 0;
        $("#gamealert").text("you bust. press stand to move on.");
        return;
    }
    else if (scards.length == 0 && cards[0].rank == cards[1].rank){
        $("#gamealert").text("you could split here.");
        return;
    }
    else if (scards.length == 1){
        $("#gamealert").text("let's settle the first hand.");
        return;
    }
    else if (scards.length > 1) {
        $("#gamealert").text("moving on to the second hand.");
        return;
    }
    else {
        $("#gamealert").text("need a hit?");
        return;
    }
    

    
}

$(document).ready(function() {
    //Create the deck
    var deckObj = new Deck();
    var playerCards = [];
    var dealerCards = [];
    var splitCards = [];
    
    deckObj.shuffle();
    
    // DEAL IN FUNCTION. STARTS GAME. 
    // SWITCHES PLAYER TURN ON.
    $("#dealin").click(function(){
        if (isPlayerTurn== true ) {
            $("#gamealert").text("finish this game first.");
        }
        else {
            isPlayerTurn = true;
            if (splitCards.length != 0){
                $("#div.cardbox#split").remove();
            }
            dealerCards.length = 0;
            playerCards.length = 0;
            splitCards.length = 0;
            $("ul#you li").replaceAll("<p>&nbsp;</p>");    
            $("ul#foe").empty();
            showTotal("00", "#ppoints");
            showTotal("00", "#dpoints");

            dealerCards[dealerCards.length] = deckObj.deal();
            addCardLi(dealerCards, "ul#foe")
            hideOne();
            dealerCards[dealerCards.length] = deckObj.deal();
            addCardLi(dealerCards, "ul#foe")

            //The dealer deals two cards to the player
            playerCards[playerCards.length] = deckObj.deal();
            addCardLi(playerCards, "ul#you");
            playerCards[playerCards.length] = deckObj.deal();
            addCardLi(playerCards, "ul#you");
            
            showTotal(sum(playerCards), "#ppoints");
            console.log("===========================");
            console.log("cards/PNG/" + dealerCards[1].image);
            
            playerRound(playerCards, "#ppoints", splitCards);
        }
    });
    
    // HIT FUNCTION. ACTIVE ON PLAYER TURN  
    $("#hit").click(function(){
        if(isPlayerTurn && splitCards.length < 2) {
            playerCards[playerCards.length] = deckObj.deal();
            addCardLi(playerCards, "ul#you")
            playerRound(playerCards, "#ppoints", splitCards);
        
        }else if (isPlayerTurn == true && splitCards.length > 1) { 
            splitCards[splitCards.length] = deckObj.deal();
            addCardLi(splitCards, "ul#split");
            playerRound(splitCards, "#spoints", splitCards);
        }
        else {
            $("#gamealert").text("press deal to start a new round.");
        }
    });
    
    // STAND FUNCTION. SWITCHES PLAYERTURN OFF.
    // ACTIVATES DEALER TURN
    // THEN ACTIVATES FINAL CALC
    $("#stand").click(function(){
        if (isPlayerTurn == false){
            $("#gamealert").text("you need to deal first.");
            return;
        } 
        else if (isPlayerTurn == true && handSplit == true && splitCards.length ==1){
            $("#gamealert").text("moving on to the second hand.");
            splitCards[splitCards.length] = deckObj.deal();
            addCardLi(splitCards, "ul#split");
            playerRound(splitCards, "spoints", splitCards);
            return;
        } else if (dealerCards.length == 0){
            $("#gamealert").text("press deal to start the game.");
            console.log("0 length");
            return;
        }
        else if ( playerCards.length == 0 && splitCards.length == 0) {
            $("#gamealert").text("you bust on both hands? double loss.");
            return;
        }
        isPlayerTurn = false;
        
        var getMoreCard = true;
        if(isBlackJack(dealerCards)) {
            $("#gamealert").text("dealer's got a black jack- you lose!");
            showCards(dealerCards, "ul#foe")

            showTotal(sum(dealerCards, "#dpoints"));
            return;
        }
        var totalPointsOfDealer = sum(dealerCards);
        while(getMoreCard) {

            if(totalPointsOfDealer >= 16) {
                getMoreCard = false;
                console.log("stop hit");
            } else {
                showCardsConsole(dealerCards);
                console.log("pulling now")
                dealerCards[dealerCards.length] = deckObj.deal();
                addCardLi(dealerCards, "ul#foe");
            
                showCardsConsole(dealerCards);

                totalPointsOfDealer = sum(dealerCards);
                if(totalPointsOfDealer > 21) {
                    showTotal(totalPointsOfDealer, "dpoints");
                    $("#gamealert").text("dealer bursts! you win!");
                    showCards(dealerCards, "ul#foe");
                    return;
                }
            }
        }
        showCards(dealerCards, "ul#foe")

        showTotal(totalPointsOfDealer, "#dpoints");
        // FINAL CALC VVV
        if(sum(playerCards) < sum(splitCards)) {
            playerCount = sum(splitCards);
        }
        else { playerCount = sum(playerCards)}

        dealerCount = sum(dealerCards);
        
        if( playerCount > dealerCount) {
            $("#gamealert").text( playerCount + " vs. " + dealerCount + " - you win!");
        } else if(playerCount < dealerCount) {
            $("#gamealert").text( playerCount + " vs. " + dealerCount + " - you lose.");
        } else {
            $("#gamealert").text( playerCount + " vs. " + dealerCount + " - draw. good game!");
        }
        dealerCards.length = 0;
        playerCards.length = 0;
        return;
        
    });
    
    $("#splitit").click(function(){
        console.log("split here")
        
        // checking conditions
        if (handSplit == true) {
            $("#gamealert").text("you can only split once.");
        }
        if (playerCards.length == 2){
            if (playerCards[1].rank != playerCards[0].rank) {
                $("#gamealert").text("two cards need to match for a split.");
                return;
            }
            $("#gamealert").text("you need two cards to split. ");
        }
        
        handSplit = true;
        
        $("div#player.cardbox").after(
            "<div class=\"cardbox\" id=\"split\"><div class=\"label3\"><h2 id=\"spoints\">split. 00</h2></div><ul class=\"hand\" id=\"split\"></ul></div>"
        );
        splitCards = [ playerCards[1] ];
        playerCards.length = 1;
        addCardLi(splitCards, "ul#split")
    
        
        $("#gamealert").text("let's settle the first hand.");
        playerCards[playerCards.length] = deckObj.deal();
        showCards(playerCards, "ul#you");
        playerRound(playerCards, "#ppoints", splitCards);
        
        
        
    });

    
});