# gpgpu-flocking

This project is a gpu accelerated implementation of the classic boid flocking algorithm.

## About

The [boid algorithm][reynolds-boids] was proposed by Craig Reynolds. A boid is a bird-like agent reacting to other nearby boids based on simple rules. In short each boid tries to move close to its neighbours, align itself with its neighbours and avoid collisions. Through these rules boids can display complex emergent flocking behaviour.

The main time-complexity of the algorithm is the need for each boid to find the other boids in their neighbourhood, especially as the number of boids grow. As each boid operates independently the algorithm can be parallelized and support much larger numbers of boids.

## License

Distributed under the GNU GPLv3 License. See `LICENSE` for more information.

## Acknowledgements

- [WebGL Fundamentals][webgl-fundamentals]  
  Excellent resource for learning webgl
- [TWGL](twgl)  
  Helper matrix operations used in this project

[webgl-fundamentals]: https://webglfundamentals.org/
[reynolds-boids]: https://www.red3d.com/cwr/boids/
[twgl]: https://twgljs.org/
