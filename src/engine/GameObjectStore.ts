import type Game from "../classes/Game";
import type GameObject from "./GameObject";

const _store: GameObject[] = [];

export default class GameObjectStore {
  add(object: GameObject) {
    _store.push(object);
  }
  remove(object: GameObject) {
    const index = _store.indexOf(object);
    if (index) _store.splice(index, 1);
  }

  get store() {
    return _store;
  }
}
