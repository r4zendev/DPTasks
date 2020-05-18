const launch = (matrixRange) => {
  function* rowGen() {
    for (let i = 0; i < matrixRange; i++) yield Math.ceil(Math.random() * 10);
  }

  const matrix = new Array(matrixRange);
  for (let i = 0; i < matrixRange; i++) {
    matrix[i] = [...rowGen()];
  }

  let middle = Math.floor(matrixRange / 2);
  let moveLimit = 2;
  console.log(matrix);

  let moves = { left: -1, right: 0, down: 0, up: 1 };

  const partialPrint = () => {
    if (
      Object.values(moves).every((value) => {
        return value === moveLimit;
      })
    ) {
      moveLimit += 2;
      moves = { left: -1, right: 0, down: 0, up: 1 };
      nextMove = "";
    }

    switch (nextMove) {
      case "left":
        if (moves.left < moveLimit) {
          moves.left++;
          current.n--;
          nextMove = "left";
          return matrix[current.m][current.n];
        } else {
          nextMove = "up";
          return;
        }
      case "right":
        if (moves.right < moveLimit) {
          moves.right++;
          current.n++;
          nextMove = "right";
          return matrix[current.m][current.n];
        } else {
          nextMove = "down";
          return;
        }
      case "down":
        if (moves.down < moveLimit) {
          moves.down++;
          current.m++;
          nextMove = "down";
          return matrix[current.m][current.n];
        } else {
          nextMove = "left";
          return;
        }
      case "up":
        if (moves.up < moveLimit) {
          current.m--;
          moves.up++;
          return matrix[current.m][current.n];
        } else {
          nextMove = "right";
          return;
        }
      default:
        current.n--;
        moves.left++;
        nextMove = "up";
        return matrix[current.m][current.n];
    }
  };
  let nextMove = "",
    current = { m: middle, n: middle },
    i = 0;
  while (true) {
    try {
      const currentValue = partialPrint();
      if (currentValue) {
        process.stdout.write(currentValue.toString() + " ");
      }
    } catch (TypeError) {
      break;
    }
  }
};

launch(1001);
