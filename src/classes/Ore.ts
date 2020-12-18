import RigidBody from "../engine/RigidBody";
// import type { OreType } from "../types/ore";

class Ore extends RigidBody {
  type: Ore.Type;
  constructor(transform: Vector2, type: Ore.Type) {
    let color = {
      r: 0,
      g: 0,
      b: 0,
    };

    switch (type) {
      case Ore.Type.cyan:
        color = { r: 0, g: 255, b: 255 };
        break;
      case Ore.Type.magenta:
        color = { r: 255, g: 0, b: 255 };
        break;
      case Ore.Type.yellow:
        color = { r: 255, g: 255, b: 0 };
        break;
      case Ore.Type.black:
        color = { r: 0, g: 0, b: 0 };
        break;
      case Ore.Type.white:
        color = { r: 255, g: 255, b: 255 };
        break;

      default:
        break;
    }
    super(transform, 16, color);
    this.type = type;
    this.mass = 0.1;
  }
}

// eslint-disable-next-line no-redeclare
module Ore {
  export enum Type {
    cyan,
    magenta,
    yellow,
    black,
    white,
  }
}

export default Ore;
