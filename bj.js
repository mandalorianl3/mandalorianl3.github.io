// global vars for game control
var suits = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
var isPlayerTurn = false;
var handSplit = false;

// class for each individual card
class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }
    // vv builds rank string based on this card objects value
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
    // vv builds image string based on this card objects value
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
// class for the entire deck of 52 cards
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
    // shuffles deck randomly
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
    // returns top card val, then moves down. 
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


// HTML INTERACTION FUNCTIONS BELOW

// append the image that matches the passed cards image string to the LI element 
// use after initial deal 
var addCardLi = function(cards, elementN) {   
    var img = cards[cards.length - 1].image;
    $(elementN).append('<li><img src="cards/PNG/' + img + '"><\li>');
    // append the image that matches the passed cards image string to the LI element 
}

// only show first card in dealer deck
var hideOne = function() {
    $("#foe li:first-child img").attr('src', "cards/PNG/purple_back.png");
}

// for showing multiple cards at once
var showCards = function(cards, elementN) {
    if(elementN == "ul#foe") { 
        [cards[1], cards[cards.length - 1]] = [cards[cards.length - 1], cards[1]];
    }
    
    $(elementN).empty();
    for(var i=0; i<cards.length; i++) {
        $(elementN).append('<li><img src="cards/PNG/' + cards[i].image + '"><\li>');
    }
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

// for early testing purposes - before ui was built
var showCardsConsole = function(cards){
     for(var i=0; i<cards.length; i++)  {
        console.log(cards[i].desc);
    }
    console.log("===========================");
}

// GAME FUNCTIONS BELOW

// testing to see if a hand has blackjack
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

// adding the ranks of a single hand's cards together for the hand total
var sum = function(cards) {
    
    var total = 0;
    var numOfAces = 0;
    
    // for loop for iterating through hand
    for(var i=0; i<cards.length; i++) {
        var rank = cards[i].rank;
        var point = 0;
        if(rank == 1) {
            point = 11;
            numOfAces += 1;
        }
        // if a face card, set its worth to 10
        else if(rank == 11 || rank == 12 || rank == 13) {
            point = 10;
        } else {
            point = rank;
        }
        
        total += point;
    }
    
    // for loop for iterating through aces.
    // checks to make sure hand total does not go over 21
    // if it does, change the value of that ace to 1 by subtracting ten from total. 
    for(var i=0; i<numOfAces; i++) {
        if(total<=21){break;}
        total -= 10;
    }
    return total;
}

// game logic for running through player round.
// activated right after deal click is triggered
var playerRound = function(cards, pointsloc, scards) {
    console.log(cards[0].rank);
    showTotal(sum(cards), pointsloc);
    // determines if player has automatically won through blackjack
    if(isBlackJack(cards)) {
        $("#gamealert").text("you've got a black jack! you win!");
        isPlayerTurn=false; // turns off player turn since game is over
        return;
    }
    // if you're over 21 and you haven't split, lose
    else if(sum(cards) > 21 && scards.length ==0) {
        $("#gamealert").text("you burst! you lose!");
        isPlayerTurn=false; // turns off player turn since game is over
        return;
    }
    // if you're over 21 and have split, alert player of bust and disqualify hand
    else if (sum(cards) > 21 && scards.length > 0) {
        cards.length = 0;
        $("#gamealert").text("you bust. press stand to move on.");
        return;
    }
    // if you have only two cards in your hand and they match, alert player of split
    else if (scards.length == 0 && cards[0].rank == cards[1].rank){
        $("#gamealert").text("you could split here.");
        return;
    }
    // message after pressing split
    else if (scards.length == 1){
        $("#gamealert").text("let's settle the first hand.");
        return;
    }
    // split - player has pressed stand for the first hand
    else if (scards.length > 1) {
        $("#gamealert").text("moving on to the second hand.");
        return;
    }
    // default game alert
    else {
        $("#gamealert").text("need a hit?"); // prompts hit click
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
            // user error handling - do nothing
            $("#gamealert").text("finish this game first.");
        }
        else {
            // only activates if it is NOT currently player turn
            isPlayerTurn = true;
            if (handSplit == true){
                // if the hand was split last round, remove the box for the second hand and turn off handSplit
                $("#div.cardbox#split").remove();
                handSplit = false;
            }
            // resets hands, visual elements, and scores
            dealerCards.length = 0;
            playerCards.length = 0;
            splitCards.length = 0;
            $("ul#you li").replaceAll("<p>&nbsp;</p>");    
            $("ul#foe").empty();
            showTotal("00", "#ppoints");
            showTotal("00", "#dpoints");
            
            // deal in dealer and hide one card
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
            
            // show player total
            showTotal(sum(playerCards), "#ppoints");
            console.log("===========================");
            console.log("cards/PNG/" + dealerCards[1].image);
            
            // enter playerRound function to determine game alert response
            playerRound(playerCards, "#ppoints", splitCards);
        }
    });
    
    // HIT FUNCTION. ACTIVE ON PLAYER TURN  
    // indicates that player wants another card dealt to them
    $("#hit").click(function(){
        // add cards to first player hand of cards
        // logic: once split hand is active, it will automatically have two cards. 
        // thus, if it has UNDER two cards, it's not active or does not exist, and cards will be dealt to original player hand
        if(isPlayerTurn && splitCards.length < 2) {
            playerCards[playerCards.length] = deckObj.deal(); // grab new card from deck
            addCardLi(playerCards, "ul#you"); // add the corresponding image to the ul
            playerRound(playerCards, "#ppoints", splitCards); // determines game alerts
        }
        // if split hand is applicable and active, add cards to it instead of first hand
        else if (isPlayerTurn == true && splitCards.length > 1) { 
            splitCards[splitCards.length] = deckObj.deal(); 
            addCardLi(splitCards, "ul#split");
            playerRound(splitCards, "#spoints", splitCards);
        }
        // user error handling - do nothing
        else {
            $("#gamealert").text("press deal to start a new round.");
        }
    });
    
    // STAND FUNCTION. ACTIVE ON PLAYER TURN
    // activates splithand player turn if applicable 
    // then turns player turn off and activates dealer turn, then activates final calc.
    $("#stand").click(function(){
        if (isPlayerTurn == false){
            // user error handling - you have to have a hand to stand. do nothing.
            $("#gamealert").text("you need to deal first.");
            return;
        } 
        // stand after settling first hand and split hand is applicable. 
        // automatically gives split hand first card to activate it
        else if (isPlayerTurn == true && handSplit == true && splitCards.length ==1){
            $("#gamealert").text("moving on to the second hand."); // alerts player of second hand activation
            splitCards[splitCards.length] = deckObj.deal(); // deals second card to split hand
            addCardLi(splitCards, "ul#split"); // adds card image li to ul
            playerRound(splitCards, "spoints", splitCards); // find next game alert
            return;
        }
        // user error - need cards in hand to stand. do nothing
        else if (dealerCards.length == 0){
            $("#gamealert").text("press deal to start the game.");
            console.log("0 length");
            return;
        }
        // alert player of bust in both hands. 
        else if ( playerCards.length == 0 && splitCards.length == 0) {
            $("#gamealert").text("you bust on both hands? double loss.");
            return;
        }
        // if the if/else statements did not activate, player turn is over, set bool to false.
        isPlayerTurn = false;
        
        // DEALER TURN
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
        showCards(dealerCards, "ul#foe") // show dealers cards and total
        showTotal(totalPointsOfDealer, "#dpoints");
        
        // FINAL CALC
        if(sum(playerCards) < sum(splitCards)) {
            // picks which playerhand is more favorable
            playerCount = sum(splitCards); 
        }
        else { playerCount = sum(playerCards)}

        dealerCount = sum(dealerCards);
        
        // game end message picked based on comparing final scores
        if( playerCount > dealerCount) {
            $("#gamealert").text( playerCount + " vs. " + dealerCount + " - you win!");
        } else if(playerCount < dealerCount) {
            $("#gamealert").text( playerCount + " vs. " + dealerCount + " - you lose.");
        } else {
            $("#gamealert").text( playerCount + " vs. " + dealerCount + " - draw. good game!");
        }
        // empty hands
        dealerCards.length = 0;
        playerCards.length = 0;
        return;
        
    });
    
    // SPLIT BUTTON OF DOOM
    $("#splitit").click(function(){
        console.log("split here")
        
        // checking conditions
        if (handSplit == true) {
            // if there's already a split hand, do nothing
            $("#gamealert").text("you can only split once.");
            return;
        }
        if (playerCards.length != 2){
            // if theres more than two cards, do nothing
            $("#gamealert").text("you can split only with the first two cards. ");
            return;
        }  
        if (playerCards.length == 2){
            // if you have only two cards, but they don't match
            if (playerCards[1].rank != playerCards[0].rank) {
                $("#gamealert").text("two cards need to match for a split.");
                return;
            }
        }
        // turn handsplit on
        handSplit = true;
        
        // add split card box
        $("div#player.cardbox").after(
            "<div class=\"cardbox\" id=\"split\"><div class=\"label3\"><h2 id=\"spoints\">split. 00</h2></div><ul class=\"hand\" id=\"split\"></ul></div>"
        );
        splitCards = [ playerCards[1] ]; // add card copy to second hand
        playerCards.length = 1; // remove original card from first hand
        addCardLi(splitCards, "ul#split"); // add card image li to ul
    
        
        $("#gamealert").text("let's settle the first hand."); // alert player that first hand still must be settled
        playerCards[playerCards.length] = deckObj.deal(); 
        showCards(playerCards, "ul#you");
        playerRound(playerCards, "#ppoints", splitCards);
        
        
        
    });

    
});
