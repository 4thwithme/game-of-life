const main = document.querySelector("main");
const h1 = document.querySelector("h1");

let cells = [];
let generation = 0;

const rows = 200;
const columns = 200;
const cellsCount = rows * columns;
const cellColorAlive = "#fff";
const cellColorDead = "#0e0e0e";

// 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
// 2. Any live cell with two or three live neighbours lives on to the next generation.
// 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
// 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

//  _____ _____ _____
// |  a  |  b  |  c  |
// |_____|_____|_____|
// |  d  |  *  |  e  |
// |_____|_____|_____|
// |  f  |  g  |  h  |
// |_____|_____|_____|

// 1. Generate seeds
function generateInitialSeeds() {
  for (let i = 0; i < cellsCount; i++) {
    cells.push(getReal0or1());
  }
}

function render() {
  main.innerHTML = "";
  const fragment = new DocumentFragment();
  cells.forEach((isAlive) => {
    const div = document.createElement("div");
    div.style.backgroundColor = isAlive ? cellColorAlive : cellColorDead;
    fragment.append(div);
  });
  h1.innerHTML = generation;
  main.append(fragment);
}

function getIndexIfCloseToBorder(i) {
  if (
    i % columns === 0 ||
    (i >= 0 && i <= columns - 1) ||
    (i >= cellsCount - columns && i <= cellsCount - 1)
  ) {
    return -columns * columns;
  }
  return i;
}

function generateNewGeneration() {
  generation++;
  const newGeneration = [];
  for (let i = 0; i < cellsCount; i++) {
    const isAlive = cells[i];

    let aliveNeighbors = 0;
    let deadNeighbors = 0;

    [
      cells[getIndexIfCloseToBorder(i) - columns - 1] ?? 0,
      cells[getIndexIfCloseToBorder(i) - columns] ?? 0,
      cells[getIndexIfCloseToBorder(i) - columns + 1] ?? 0,
      cells[getIndexIfCloseToBorder(i) - 1] ?? 0,
      cells[getIndexIfCloseToBorder(i) + 1] ?? 0,
      cells[getIndexIfCloseToBorder(i) + columns - 1] ?? 0,
      cells[getIndexIfCloseToBorder(i) + columns] ?? 0,
      cells[getIndexIfCloseToBorder(i) + columns + 1] ?? 0,
    ].forEach((item) => {
      if (item) {
        aliveNeighbors++;
        return;
      }
      deadNeighbors++;
    });

    if (isAlive) {
      // check rule 1
      if (aliveNeighbors < 2) {
        newGeneration.push(0);
      }
      // check rule 2
      if (aliveNeighbors === 2 || aliveNeighbors === 3) {
        newGeneration.push(1);
      }
      // check rule 3
      if (aliveNeighbors > 3) {
        newGeneration.push(0);
      }
    } else {
      // check rule 4
      newGeneration.push(aliveNeighbors === 3 ? 1 : 0);
    }
  }

  cells = newGeneration;
}

async function loop() {
  render();
  generateNewGeneration();
  await delay(50);

  window.requestAnimationFrame(loop);
}

generateInitialSeeds();
loop();

// helpers ---------------

function getReal0or1() {
  const min = 0;
  const max = 1;
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

async function delay(timeDelay) {
  return new Promise((res) => {
    setTimeout(() => res(), timeDelay);
  });
}
// helpers---------------
