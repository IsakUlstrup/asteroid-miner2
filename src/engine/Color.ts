import colorConvert from "color-convert";

export default class Color {
  private state = {
    r: 0,
    g: 0,
    b: 0,
  };
  constructor(r = 255, g = 0, b = 0) {
    this.state = { r, g, b };
  }

  // set color
  public rgb(r: number, g: number, b: number) {
    this.state = { r, g, b };
    return this;
  }
  public cmyk(c: number, m: number, y: number, k: number) {
    const newColor = colorConvert.cmyk.rgb(c, m, y, k);
    this.state = {
      r: newColor[0],
      g: newColor[1],
      b: newColor[2],
    };
    return this;
  }
  public hsv(h: number, s: number, v: number) {
    const newColor = colorConvert.hsv.rgb(h, s, v);
    this.state = {
      r: newColor[0],
      g: newColor[1],
      b: newColor[2],
    };
    return this;
  }

  // modify color
  public hueRotate(amount: number) {
    const hslColor = colorConvert.rgb.hsl(
      this.state.r,
      this.state.g,
      this.state.b
    );
    const rotatedRGB = colorConvert.hsl.rgb(
      hslColor[0] + amount,
      hslColor[1],
      hslColor[2]
    );
    this.state = {
      r: rotatedRGB[0],
      g: rotatedRGB[1],
      b: rotatedRGB[2],
    };
    return this;
  }
  public darken(amount: number) {
    this.state = {
      r: this.state.r - amount > 0 ? this.state.r - amount : 0,
      g: this.state.g - amount > 0 ? this.state.g - amount : 0,
      b: this.state.b - amount > 0 ? this.state.b - amount : 0,
    };
    return this;
  }

  // getters
  get rgbString() {
    return `rgb(${Math.round(this.state.r)}, ${Math.round(
      this.state.g
    )}, ${Math.round(this.state.b)})`;
  }
  get cmykString() {
    const cmykColor = colorConvert.rgb.cmyk(
      this.state.r,
      this.state.g,
      this.state.b
    );
    return `cmyk(${cmykColor[0]}, ${cmykColor[1]}, ${cmykColor[2]}, ${cmykColor[3]})`;
  }
}
