"use strict";

/**
 * Name: Larry Jing
 * Date: April 20 - Spring 2022
 * Section: CSE 154 Section AD - Dylan McKone & Abdul Itani
 * This is the index.js page for my Creative Project 2 website.
 * It uses event listeners to control the functionality of the game.
 */

(function() {
  window.addEventListener('load', init);

  const CENTS_PER_DOLLAR = 100;
  const DECIMAL_BASE = 10;
  const MONEY_A_SIZE = 20;
  const MONEY_B_SIZE = 45;
  const MONEY_C_SIZE = 65;
  const EGG_COUNT = 14;

  /**
   * Initial function to delegates bomb target and enables eggs to be clicked.
   */
  function init() {
    let eggs = qsa("#egg-container img");
    const bomb = Math.floor(Math.random() * eggs.length);
    for (let i = 0; i < eggs.length; i++) {
      if (i === bomb) {
        eggs[i].classList.add("bomb");
      }
      eggs[i].addEventListener("click", eggCrack);
    }
  }

  /**
   * Handles when user cracks a selected egg, updates game accordingly.
   */
  function eggCrack() {
    this.removeEventListener("click", eggCrack);

    // Only respond to unclicked elements (state remains unchanged after click)
    if (!this.classList.contains("clicked")) {
      this.classList.add("clicked");
      if (this.classList.contains("bomb")) {

        // The following image was created by myself
        this.src = "img/egg-bomb.png";
        this.alt = "An egg with three bombs inside of it";
        handleExplosion(id("money-count").textContent);
        resetGame();
      } else {
        updateEgg(this);
      }
    }
  }

  /**
   * Handles situation when a money-filled egg is cracked. Assigns egg a random
   * monetary value, giving it that cracks a selected egg and handles it accordingly.
   * @param {object} egg - DOM object representing the clicked egg.
   */
  function updateEgg(egg) {
    // Generate random monetary value of egg, use it to determine new image source
    const dollars = Math.floor(Math.random() * MONEY_C_SIZE);
    const cents = Math.floor(Math.random() * CENTS_PER_DOLLAR);

    // The following three images were created by myself
    if (dollars < MONEY_A_SIZE) {
      egg.src = "img/egg-money-1.png";
      egg.alt = "An egg with a small amount of money inside of it";
    } else if (dollars < MONEY_B_SIZE) {
      egg.src = "img/egg-money-2.png";
      egg.alt = "An egg with a medium amount of money inside of it";
    } else {
      egg.src = "img/egg-money-3.png";
      egg.alt = "An egg with a large amount of money inside of it";
    }

    // Handle current count of eggs and total money so far
    let eggCount = id("egg-count");
    const eggNum = parseInt(eggCount.textContent) + 1;
    if (eggNum === 1) {
      eggCount.textContent = eggNum + " egg";
    } else {
      eggCount.textContent = eggNum + " eggs";
    }
    let moneyCount = id("money-count");
    const total = incrementMoney(moneyCount.textContent, dollars, cents);

    // If all non-bomb eggs have been clicked, game terminates
    if (eggNum === EGG_COUNT) {
      qs("#game p").textContent = "Hooray! You made a total of $" + total + "!";
      qs(".bomb").removeEventListener("click", eggCrack);
      resetGame();
    } else {
      moneyCount.textContent = total;
    }
  }

  /**
   * Processes the value of the money text when adding an additional number
   * of dollars and cents, finding the new text value of the money.
   * @param {string} moneyStr - string representing the current amount of collected money.
   * @param {number} dollars - number representing the number of dollars to add.
   * @param {number} cents - number representing the number of cents to add.
   * @returns {string} - string representing the new amount of collected money.
   */
  function incrementMoney(moneyStr, dollars, cents) {
    moneyStr = moneyStr.split(".");
    const centTotal = parseInt(moneyStr[1]) + cents;
    const dollTotal = parseInt(moneyStr[0]) + dollars + Math.floor(centTotal / CENTS_PER_DOLLAR);
    let centFormat = centTotal % CENTS_PER_DOLLAR;
    if (centFormat === 0) {
      centFormat = "00";
    } else if (centFormat < DECIMAL_BASE) {
      centFormat = "0" + centFormat;
    }
    return dollTotal + "." + centFormat;
  }

  /**
   * Handles situation when a bomb-filled egg is cracked, updates text accordingly.
   * @param {string} total - string representing final amount of collected money.
   */
  function handleExplosion(total) {
    let eggs = qsa("#egg-container img");
    for (let i = 0; i < eggs.length; i++) {
      let egg = eggs[i];
      if (!egg.classList.contains("clicked")) {

        // Explosion image sourced from http://clker.com
        egg.src = "img/explosion.png";
        egg.alt = "An explosion";
        egg.removeEventListener("click", eggCrack);
      }
    }
    qs("#game p").textContent = "You have blown up.";

    // Display final score and add to DOM
    let finScore = gen("p");
    finScore.textContent = "Final Score: $" + total;
    qs("#game").appendChild(finScore);
  }

  /**
   * Displays button to play again when game terminates.
   */
  function resetGame() {
    let button = gen("button");
    button.innerText = "Play Again!";
    button.addEventListener('click', () => {
      location.reload();
    });
    qs("#game").appendChild(button);
  }

  /* --- CSE 154 HELPER FUNCTIONS --- */
  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated with selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns an array of elements matching the given query.
   * @param {string} query - CSS query selector.
   * @returns {array} - Array of DOM objects matching the given query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * Returns a new element of the given tag.
   * @param {string} tagName - Tag name of the element.
   * @returns {object} - DOM object matching given tag name.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

})();
