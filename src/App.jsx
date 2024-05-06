import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import sound from './assets/sound.wav'
import './App.css'

const App = ({width= 12, height= 12 }) => {
  // let initialMaze = [
  //   ["wall", "wall", "wall", "wall"],
  //   ["start", "path", "path", "wall"],
  //   ["wall", "wall", "path", "wall"],
  //   ["wall", "wall", "path", "end"],
  //   ["wall", "wall", "wall", "wall"],
  // ];

  const [maze, setMaze] = useState([]);
  // const [width, setWidth] = useState(initialMaze[0].length);
  // const [height, setHeight] = useState(initialMaze.length);
  const [timeoutid, setTimeoutid] = useState([]);

  useEffect((() => {generateMaze(width, height)}), [width, height] );

  const moveSound = new Audio(sound);

  const playSound = (audioFile) => {
    audioFile.play().catch(error => console.log(`Failed to play sound: ${error}`));
  };

  const bfs = (startNode) => {
    let queue = [startNode];
    let visited =  new Set(`${startNode[0]},${startNode[1]}`);

    const visitCell = ([x,y]) => {
      console.log('visited', [x,y]);

      setMaze((prevMaze) => prevMaze.map((row, rowIndex) => 
        row.map((cell, cellIndex) => {
          if (rowIndex === y && cellIndex === x){
            return cell === "end" ? "end" : "visited";
          }
          return cell;
        }
      )
      

      ))
      if (maze[y][x] === 'end' ){
        console.log('path found!');
        return true;
      } 
      return false
      
    }

    const step = () => {
      if (queue.length === 0 ){
        return; 
      }
      const [x,y] = queue.shift();

      // Play move sound
      playSound(moveSound);

      const dirs = [
        [0,1], 
        [1,0], 
        [0, -1], 
        [-1, 0] 
      ];

      for ( const [dx, dy] of dirs ) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >=0 && nx < width && ny >= 0 && ny < height && !visited.has(`${nx}, ${ny}`) ){
          visited.add(`${nx}, ${ny}`);
          if (maze[ny][nx] === 'path' || maze[ny][nx] === 'end'){
            if (visitCell([nx, ny])){
              return true
            }
            queue.push([nx, ny]);
          }
        }
      }
      console.log('step called again')
      const timeoutid = setTimeout(step, 100);
      setTimeoutid((previousTimeoutids) => [...previousTimeoutids, timeoutid]);
    }



    step();
    return false;

  }

  const dfs = (startNode) => {
    let stack = [startNode];
    let visited = new Set(`${startNode[0]},${startNode[1]}`);

    const visitCell = ([x,y]) => {
      console.log('visited', [y,x]);
      setMaze((prevMaze) => prevMaze.map((row, rowIndex) => 
        row.map((cell, cellIndex) => {
          if (rowIndex === y && cellIndex === x){
            return cell === "end" ? "end" : "visited";
          }
          return cell;
        }
      )
      ))
      

      if (maze[y][x] === 'end' ){
        console.log('path found!');
        return true;
      } 
      return false
      
    }

    const step = () => {
      if (stack.length === 0 ){
        return; 
      }
      const [x,y] = stack.pop();
      console.log('new step');
      const dirs = [
        [0,1], 
        [1,0], 
        [0, -1], 
        [-1, 0] 
      ];

      for ( const [dx, dy] of dirs ) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >=0 && nx < width && ny >= 0 && ny < height && !visited.has(`${nx}, ${ny}`) ){
          visited.add(`${nx}, ${ny}`);
          if (maze[ny][nx] === 'path' || maze[ny][nx] === 'end'){
            if (visitCell([nx, ny])){
              return true
            }
            stack.push([nx, ny]);
          }
        }
      }
      const timeoutid = setTimeout(step, 100);
      setTimeoutid((previousTimeoutids) => [...previousTimeoutids, timeoutid]);
    }



    step();
    return false;

  }
  
  
  const generateMaze = (height, width) => {
    let matrix = [];

    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < width; j++){
        let cell = Math.random();
        row.push("wall");
      }
      matrix.push(row);
    }
   

    const isCellValid = (x, y ) => {
      return y>= 0 && x>=0 && y< height && x< width && matrix[y][x] === 'wall';
    }
    
    const dirs = [[0,1], [1,0], [0, -1], [-1, 0] ];
   
    
    const carvePath = (x,y) => {
      matrix[y][x] = "path";
      const directions = dirs.sort(() => Math.random() - 0.5);

      for (let [dx, dy] of directions) {
        //Both explanations are the same , i just said it in different ways
         const nx = x + dx * 2;  //Randomize the x direction , mulitply by 2 and add the x length needed according to the given direction(but 2 cells long due to the times 2)
         const ny = y + dy * 2;  //Randomize the y direction and multiply it by 2 to create a path that is 2 cells long,then include the actual y corrdinate value length. 
        if (isCellValid(nx, ny)) {
          matrix[y +dy][x +dx] = "path";
          carvePath(nx, ny);
        }
      }
    }

    carvePath(1,1);
    // Set start and end positions within visible circular bounds
  // For a circular maze, place them on the vertical center line towards the top and bottom
  

    matrix[1][0] = "start";
    matrix[height -2][width -1] = "end";
   
    setMaze(matrix);
    }
  
  

  



    const refreshMaze = () => {
      timeoutid.forEach(clearTimeout);
      setTimeoutid([]);
      generateMaze(12,12);
    }
 


  return (
    <>
    <div className="maze-grid">
        <div className='controls'>
          <button onClick={() => refreshMaze()} className="maze-button">Refresh maze</button>
          <button onClick={() => dfs([1,0])} className="maze-button">Depth first Search</button>
          <button onClick={() => bfs([1,0])} className="maze-button">Breath first Search</button>
        </div>
        <div className="maze" >
          {maze.map((row, rowIndex) => (
            <div className="row" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <div key={cellIndex} className={`cell ${cell}`}></div>
              ))}
            </div>
          ))}
        </div>
      </div>  
    </>
  );
}

export default App



//Building the maze 
//First make sure a path exists between the start and end
//Ensure that a cycle isnt created , ie. no backtracking to the path . 
//Once we start moving on the path , we need to make sure we get to the end . 