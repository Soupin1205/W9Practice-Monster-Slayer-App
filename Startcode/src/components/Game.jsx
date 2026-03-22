import React, { useState } from "react";
import Entity from "./Entity";
import Log from "./Log";
import GameOver from "./GameOver";

// ----------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------------------------------------

// Generate a random values in the range {min, max}
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Create an attack log
function createLogAttack(isPlayer, damage) {
  return {
    isPlayer: isPlayer,
    isDamage: true,
    text: ` takes ${damage} damages`,
  };
}

// Create a healing log
function createLogHeal(healing) {
  return {
    isPlayer: true,
    isDamage: false,
    text: ` heal ${healing} life points`,
  };
}

function Game() {
  // ----------------------------------------------------------------------------------------------------------
  // STATES & VARIABLES
  // ----------------------------------------------------------------------------------------------------------
  const [playerHealth, setPlayerHealth] = useState(100);
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [currentRound, setCurrentRound] = useState(0);
  const [logs, setLogs] = useState([]);

  // ----------------------------------------------------------------------------------------------------------
  // BUTTONS EVENT FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------
  const specialAvailable = currentRound % 3 === 0;

  let winner = null;
  if (playerHealth <= 0 && monsterHealth <= 0) {
    winner = "Draw";
  } else if (playerHealth <= 0){
    winner = "Monster Wins";
  } else if (monsterHealth <= 0) {
    winner = "Player Wins";
  }
 
  // ----------------------------------------------------------------------------------------------------------
  // JSX FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------
  function addLog(log){
    setLogs((prevLogs) => [log, ...prevLogs]);
  }

  function monsterAttack(){
    const damage = getRandomValue(8, 15);
    setPlayerHealth((prev) => Math.max(prev - damage, 0));
    addLog(createLogAttack(false, damage));
  }

  function attackHandler(){
    setCurrentRound((prev) => prev + 1);
    const damage = getRandomValue(5,12);
    setMonsterHealth((prev) => Math.max(prev - damage, 0));
    addLog(createLogAttack(true, damage));
    monsterAttack();
  }

  function specialAttackHandler(){
    if (!specialAvailable) return;

    setCurrentRound((prev) => prev + 1);

    const damage = getRandomValue(10,25);
    setMonsterHealth((prev) => Math.max(prev - damage, 0));
    addLog(createLogAttack(true, damage));

    monsterAttack();
  }

  function healHandler(){
    setCurrentRound((prev) => prev + 1);
    const heal = getRandomValue(8,20);
    setPlayerHealth((prev) => Math.min(prev + heal, 100));
    addLog(createLogHeal(heal));
    monsterAttack();
  }
  function surrenderHandler(){
    setPlayerHealth(0);
  }
  function restartGame(){
    setPlayerHealth(100);
    setMonsterHealth(100);
    setCurrentRound(0);
    setLogs([]);
  }
  // ----------------------------------------------------------------------------------------------------------
  // MAIN  TEMPLATE
  // ----------------------------------------------------------------------------------------------------------
  return (
    <section>
      <Entity name="Monster" health={monsterHealth} />
      <Entity name="Player" health={playerHealth} />

      {!winner && (
        <section id="controls" className="container">
          <button onClick={attackHandler}>ATTACK</button>
          <button onClick={specialAttackHandler} disabled={!specialAvailable}>
            SPECIAL !
          </button>
          <button onClick={healHandler}>HEAL</button>
          <button onClick={surrenderHandler}>KILL YOURSELF</button>
        </section>
      )}

      {winner && <GameOver title={winner} restartGame={restartGame} />}

      <Log logs={logs} />
    </section>
  );
}

export default Game;
