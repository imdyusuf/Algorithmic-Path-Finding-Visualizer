# Pathfinding Visualizer

**Explore algorithms. Visualize the search. Discover the shortest path.**

Pathfinding Visualizer is an interactive application that brings pathfinding algorithms to life. It allows you to create grids, place obstacles, generate mazes, and watch different algorithms explore the environment to find a route from a starting point to a destination.

Instead of treating pathfinding as an abstract programming problem, the application makes every search easier to understand through real-time visual feedback. Observe how algorithms explore nodes, navigate around obstacles, discover routes, and differ in their efficiency and path selection.

Whether you are learning data structures and algorithms, preparing for technical interviews, or simply curious about how pathfinding works, this project provides a hands-on way to explore the concepts.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Pathfinding Algorithms](#pathfinding-algorithms)
- [Maze Generation](#maze-generation)
- [Understanding the Visualization](#understanding-the-visualization)
- [Getting Started](#getting-started)
- [How to Use](#how-to-use)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Algorithm Comparison](#algorithm-comparison)
- [Educational Value](#educational-value)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Pathfinding is the process of finding a route between two locations while respecting the constraints of an environment. In a grid-based world, these constraints include movement rules, blocked cells, and the position of the destination.

Different algorithms approach this problem in different ways. Some systematically explore nearby locations, some follow a branch as deeply as possible, and others use cost estimates to guide their search toward the target.

Pathfinding Visualizer lets you experiment with these strategies in an interactive grid environment.

You can:

- Select a pathfinding algorithm and watch it search.
- Draw and erase obstacles directly on the grid.
- Move the starting point and destination.
- Generate different maze patterns.
- Adjust the visualization speed.
- Pause, resume, or stop an active visualization.
- Compare multiple algorithms using exploration counts, path lengths, and execution times.

The result is an interactive learning experience that connects algorithmic theory with observable behavior.

## Key Features

### Multiple Pathfinding Algorithms

Explore five classic search algorithms, each with a distinct strategy for navigating the grid.

### Interactive Grid Editing

Customize the search environment by drawing walls, removing obstacles, and moving the start and target nodes.

### Procedural Maze Generation

Generate different obstacle patterns and maze structures to create new pathfinding challenges without manually designing every grid.

### Adjustable Visualization Speed

Choose how quickly the search unfolds. Slow the animation to examine individual exploration steps or switch to instant mode to see the final result.

### Playback Controls

Start, pause, resume, and stop visualizations to explore the search process at your own pace.

### Algorithm Comparison

Run all five algorithms against the same grid and compare their results, including the number of explored nodes, path length, and execution time.

### Live Search Feedback

Watch the grid change as the algorithm discovers nodes, explores new areas, and reconstructs the final route.

### Search Statistics

Examine key metrics after a run to better understand how the algorithm performed on the selected environment.

### Responsive Grid

Work with a grid that adapts to the available display area, making it easier to experiment across different screen sizes.

### Keyboard Shortcuts

Use convenient keyboard controls to manage visualizations and reset the environment without relying entirely on the mouse.

---

## Pathfinding Algorithms

The application includes five algorithms that demonstrate different approaches to graph traversal and pathfinding.

| Algorithm | Search Strategy | Guarantees a Shortest Path? | Best For |
|---|---|---|---|
| Breadth-First Search (BFS) | Explores nodes level by level | Yes, on an unweighted grid | Understanding shortest-path search |
| Depth-First Search (DFS) | Explores deeply before backtracking | No | Understanding depth-first exploration |
| Dijkstra's Algorithm | Prioritizes the lowest known path cost | Yes, with nonnegative edge costs | Understanding cost-based pathfinding |
| A* Search | Combines the cost already traveled with an estimated remaining cost | Yes, under the appropriate heuristic and cost conditions | Goal-directed shortest-path search |
| Greedy Best-First Search | Prioritizes the estimated distance to the target | No | Understanding heuristic-guided exploration |

### 1. Breadth-First Search (BFS)

BFS explores the grid outward from the starting point, processing nearby nodes before moving to more distant ones.

Because it explores an unweighted grid in order of increasing distance from the start, it guarantees a path with the minimum number of moves when a path exists.

**What to observe:** How the search expands in layers and reaches the target through the shortest route.

### 2. Depth-First Search (DFS)

DFS follows one branch as far as possible before backtracking to explore alternative branches.

Its exploration pattern depends on the order in which neighboring nodes are considered. It can find a valid route, but that route is not necessarily the shortest.

**What to observe:** How a search can travel deeply into one region before considering closer alternatives.

### 3. Dijkstra's Algorithm

Dijkstra's algorithm prioritizes the node with the lowest known cost from the starting point.

It guarantees a minimum-cost path when edge costs are nonnegative. In the current grid, each legal move has a cost of one, so the algorithm finds a shortest path in terms of moves.

**What to observe:** How cost-based exploration progresses and how its behavior compares with BFS.

### 4. A* Search

A* combines the cost of reaching a node with an estimate of the remaining distance to the target.

The application uses Manhattan distance as its heuristic, which is suitable for the current four-directional grid with uniform movement costs.

By considering both the route already traveled and the estimated remaining distance, A* can direct its search toward promising areas of the grid.

**What to observe:** How goal-directed exploration can reduce unnecessary searching while preserving shortest-path guarantees under the appropriate conditions.

### 5. Greedy Best-First Search

Greedy Best-First Search prioritizes nodes that appear closest to the target according to a heuristic.

This can lead to quick discoveries when the estimated direction is helpful. However, it does not account for the full cost of the route already traveled and may produce a longer path.

**What to observe:** How following an apparently promising direction can be efficient in some environments but misleading in others.

---

## Maze Generation

A pathfinding algorithm is only as interesting as the environment it must navigate. The application includes four maze and obstacle generators to help you explore different search scenarios.

| Generator | Description |
|---|---|
| Random Obstacles | Creates randomly positioned wall segments with varying lengths and orientations. |
| Random Walls | Distributes walls throughout the grid to create an irregular obstacle layout. |
| Recursive Division | Repeatedly divides regions with walls and openings to form a structured maze. |
| Randomized DFS | Creates winding corridors through randomized depth-first traversal. |

### Random Obstacles

Introduces scattered obstacles that force algorithms to navigate around blocked areas.

### Random Walls

Creates a grid with randomly distributed walls. This is useful for exploring how different algorithms respond to irregular obstacle patterns.

### Recursive Division

Builds a structured maze by dividing regions with walls and leaving openings for movement between sections.

### Randomized DFS

Carves winding corridors through the grid, creating maze-like routes that can require substantial exploration.

### Experiment with Different Environments

Try solving the same maze with all five algorithms, then generate another maze and repeat the experiment.

You can investigate questions such as:

- Which algorithms explore the most nodes?
- Which algorithms find the shortest route?
- How do long corridors affect search behavior?
- What happens when the target is separated from the start by several obstacles?
- How does the structure of a maze influence algorithm performance?

---

## Understanding the Visualization

The grid uses distinct visual states to communicate what is happening during a search.

| Visual State | Meaning |
|---|---|
| Start Node | The location where the search begins. |
| Target Node | The destination the algorithm attempts to reach. |
| Wall | An obstacle that cannot be crossed. |
| Visited Node | A node that has been explored by the algorithm. |
| Frontier Node | A discovered node waiting to be explored. |
| Current Node | The node currently highlighted by the visualization. |
| Final Path | A node belonging to the route found by the algorithm. |
| Unvisited Node | A node that has not yet been explored. |

The exact appearance of these states is determined by the application's visual styling.

### What Happens During a Search?

A typical visualization follows this sequence:

1. The selected algorithm begins at the starting node.
2. It examines neighboring nodes according to its search strategy.
3. Newly discovered nodes enter the frontier.
4. Nodes are explored in the order determined by the algorithm.
5. The process continues until the target is reached or no reachable nodes remain.
6. If a route is found, the application reconstructs and highlights the final path.
7. The resulting statistics summarize the search.

If the target cannot be reached, the application reports that no path was found.

The visualization makes it possible to observe the algorithm's decisions rather than seeing only the final route.

---

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Before starting, make sure you have:

- [Node.js](https://nodejs.org/) installed.
- npm available in your terminal.
- A modern web browser.

### Installation

**1. Clone the repository**

 ```bash
    git clone https://github.com/imdyusuf/Algorithmic-Path-Finding-Visualizer.git
 ```

**2. Navigate to the project directory**

```bash
cd build-pathfinding-visualizer-application
```

If your extracted or cloned directory has a different name, use that directory name instead.

**3. Install the dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

Open the local address displayed in the terminal to access the application.

### Build for Production

To create a production build, run:

```bash
npm run build
```

To preview the generated production build locally, run:

```bash
npm run preview
```

---

## How to Use

### Step 1: Explore the Grid

Open the application and familiarize yourself with the start node, target node, and available controls.

The grid is your environment. Each cell represents a location the algorithm may or may not be able to visit.

### Step 2: Select an Algorithm

Choose one of the five available algorithms:

- BFS
- DFS
- Dijkstra
- A*
- Greedy Best-First Search

Start with BFS or A* if you want to observe shortest-path behavior on a simple grid.

### Step 3: Create Obstacles

Click or drag across grid cells to draw walls.

To erase obstacles, begin dragging on an existing wall.

Walls prevent the algorithms from passing through those cells.

### Step 4: Position the Start and Target

Move the starting point and destination to create different search problems.

Try placing them close together, far apart, or on opposite sides of a maze.

### Step 5: Generate a Maze

Select a maze-generation option to create a new environment automatically.

Each generator creates a different obstacle pattern, giving you new scenarios to investigate.

### Step 6: Adjust the Speed

Choose the visualization speed that suits your needs.

- **Slow:** Examine the search process carefully.
- **Normal:** Watch the search at a comfortable pace.
- **Fast:** Observe the overall exploration more quickly.
- **Instant:** Display the completed result without the usual frame-by-frame playback.

### Step 7: Start the Visualization

Start the selected algorithm and watch the grid change as the search progresses.

Pay attention to how the frontier spreads, how nodes become visited, and how the algorithm approaches the target.

### Step 8: Pause or Resume

Pause the visualization whenever you want to inspect the current state.

Resume when you are ready to continue.

You can also stop the visualization and modify the environment before trying again.

### Step 9: Review the Results

Once the search finishes, inspect the highlighted path and available statistics.

Compare the path length and number of explored nodes with the behavior you observed during the search.

### Step 10: Compare Algorithms

Run the comparison feature to evaluate all five algorithms on the same grid.

Observe how their search strategies affect the results.

For a fair comparison, keep the grid and the start and target positions unchanged between experiments.

---

## Keyboard Shortcuts

The following shortcuts are available for common actions.

| Shortcut | Action |
|---|---|
| `Space` | Start the visualization or pause/resume it. |
| `R` | Reset the grid. |
| `C` | Clear the path and search markings. |
| `W` | Clear walls. |
| `M` | Generate a maze. |
| `Esc` | Stop the visualization. |

Keyboard shortcuts are ignored when typing in standard input fields, text areas, selection controls, or editable elements.

---

## Algorithm Comparison

The comparison feature runs all five algorithms against the same grid and presents their results together.

It is designed to help you investigate how different search strategies affect performance and path quality.

### Metrics

**Nodes Explored**

The number of nodes processed by the algorithm. This helps illustrate how much of the grid the search examined.

**Path Length**

The number of moves in the returned route. On the current grid, each legal move has a cost of one.

**Execution Time**

The measured time required for the algorithm's synchronous search operation during comparison.

**Path Found**

Indicates whether the algorithm successfully reached the target.

### What Can You Learn?

Comparing the algorithms can help you understand several important differences:

- BFS and Dijkstra guarantee shortest paths under the current movement rules.
- A* uses a heuristic to guide exploration toward the target while retaining shortest-path guarantees under the appropriate conditions.
- DFS may find a valid route without finding the shortest one.
- Greedy Best-First Search can prioritize promising directions but may return a longer route.
- An algorithm that explores fewer nodes is not necessarily the one that returns the shortest path.

Actual results depend on the grid layout, obstacle placement, neighbor ordering, and algorithm behavior.

Execution-time measurements can also vary between runs. Treat small differences as indicative rather than definitive performance rankings.

---

## Educational Value

Pathfinding Visualizer is designed to make core computer science concepts easier to understand through experimentation.

### Learn Graph Traversal

See how a grid can be modeled as a graph and how algorithms move between connected nodes.

### Understand Data Structures

Observe the behavioral differences between queue-based, stack-based, and priority-based exploration.

### Explore Shortest-Path Algorithms

Compare algorithms that guarantee shortest paths with strategies that prioritize exploration speed or directional guidance.

### Understand Heuristics

See how an estimate of the remaining distance can influence the search process.

### Investigate Algorithm Complexity

Use exploration counts and execution times to investigate how different search strategies behave as the environment changes.

### Learn Through Experimentation

Create your own obstacles, generate mazes, move the endpoints, and compare the outcomes.

Rather than relying solely on textbook descriptions, you can develop an intuitive understanding of algorithm behavior by observing it directly.

---

## Project Structure

The project is organized into directories that separate the user interface, pathfinding logic, grid management, maze generation, and supporting utilities.

```text
src/
├── algorithms/
│   ├── bfs.ts
│   ├── dfs.ts
│   ├── dijkstra.ts
│   ├── astar.ts
│   ├── greedyBestFirst.ts
│   ├── definitions.ts
│   └── __tests__/
│
├── components/
│   ├── Header.tsx
│   ├── Grid.tsx
│   ├── GridNode.tsx
│   ├── ControlPanel.tsx
│   ├── StatisticsPanel.tsx
│   ├── AlgorithmInfo.tsx
│   ├── ComparisonPanel.tsx
│   ├── CompletionBanner.tsx
│   ├── Legend.tsx
│   └── KeyboardShortcuts.tsx
│
├── hooks/
│   ├── useGrid.ts
│   └── useVisualizer.ts
│
├── dataStructures/
│   ├── Queue.ts
│   ├── Stack.ts
│   └── MinHeap.ts
│
├── maze/
│   ├── definitions.ts
│   ├── randomWalls.ts
│   ├── randomizedDfs.ts
│   └── recursiveDivision.ts
│
├── types/
│   ├── grid.ts
│   └── algorithm.ts
│
└── utils/
    ├── grid.ts
    ├── heuristics.ts
    └── cn.ts
```

### Main Areas

| Directory or File | Responsibility |
|---|---|
| `algorithms/` | Contains the pathfinding algorithms and their definitions. |
| `components/` | Contains the visual elements and interactive controls. |
| `hooks/` | Manages grid interactions and visualization behavior. |
| `dataStructures/` | Provides the queue, stack, and min-heap used during searches. |
| `maze/` | Contains the maze and obstacle generation routines. |
| `types/` | Defines the core grid and algorithm data structures. |
| `utils/` | Provides reusable grid operations, heuristics, and utility functions. |
| `App.tsx` | Coordinates the main application and its components. |

---

## Testing

The project includes tests for the pathfinding algorithms.

To run the existing test suite, execute:

```bash
sh run-tests.sh
```

Alternatively, run:

```bash
npx vitest run
```

Make sure the dependencies have been installed before running either command.

### Recommended Test Scenarios

When extending the application, consider testing:

- Paths through an unobstructed grid.
- Routes that must navigate around walls.
- Unreachable targets.
- Adjacent start and target positions.
- Different grid dimensions.
- Shortest-path correctness for BFS, Dijkstra, and A*.
- Path validity for DFS and Greedy Best-First Search.
- Maze generation and grid-reset behavior.
- Visualization pause, resume, and stop behavior.

These scenarios help ensure that new features do not break existing behavior.

---

## Future Improvements

The project provides a foundation for exploring additional pathfinding concepts and more advanced search environments.

Potential future enhancements include:

- **Weighted Terrain:** Introduce different movement costs for roads, mud, water, and other terrain types.
- **Additional Algorithms:** Add Bidirectional BFS, Jump Point Search, Bellman-Ford, or D* Lite.
- **Diagonal Movement:** Allow movement in eight directions with appropriate movement costs and heuristics.
- **Step-by-Step Execution:** Advance an algorithm one search operation at a time rather than computing all visualization frames before playback.
- **Enhanced Statistics:** Track peak frontier size, total path cost, and additional performance metrics.
- **Improved Benchmarking:** Run repeated trials and report median execution times for more reliable comparisons.
- **Interactive Tutorials:** Provide guided experiments explaining each algorithm's behavior.
- **Custom Grid Sizes:** Allow users to choose explicit grid dimensions.
- **Additional Maze Patterns:** Introduce more obstacle-generation strategies and configurable maze density.
- **Accessibility Improvements:** Provide clearer non-color indicators and improved keyboard navigation.

These are possible directions for future development, not claims about existing functionality.

---

## Contributing

Contributions, suggestions, and bug reports are welcome.

If you would like to improve the project:

1. Fork the repository.
2. Create a branch for your changes.
3. Implement your improvement.
4. Run the existing tests.
5. Submit a pull request describing your changes.

When contributing new algorithms, include appropriate correctness tests and document whether the algorithm guarantees a shortest path under the supported movement and cost conditions.

For interface changes, verify that existing grid interactions, keyboard shortcuts, and visualization controls continue to work as expected.

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Final Thoughts

Pathfinding Visualizer turns an abstract algorithmic problem into an interactive experience.

By combining editable grids, procedural mazes, five pathfinding strategies, playback controls, and comparative statistics, it provides a practical way to explore how algorithms search, how data structures influence their behavior, and why different strategies produce different results.

**Build a maze. Choose an algorithm. Watch the search unfold. Discover how pathfinding works.**
