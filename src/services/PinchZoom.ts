export default class PinchZoom {
  evCache: PointerEvent[];
  prevDiff = -1;
  callback: Function;
  constructor(element: HTMLElement, callback: Function) {
    // this.init(element);
    this.evCache = [];
    this.callback = callback;
    // Install event handlers for the pointer target
    // var el=document.getElementById("target");
    // scroll event handler
    element.addEventListener('wheel',(event) => {
      this.callback(event.deltaY * -0.001);
      event.preventDefault();
    }, false);

    element.addEventListener("pointerdown", (event: PointerEvent) => {
      this.pointerdown_handler(event);
    });
    // element.onpointerdown = this.pointerdown_handler;
    // element.onpointermove = this.pointermove_handler;
    element.addEventListener("pointermove", (event: PointerEvent) => {
      this.pointermove_handler(event);
    });
   
    // Use same handler for pointer{up,cancel,out,leave} events since
    // the semantics for these events - in this app - are the same.
    // element.onpointerup = this.pointerup_handler;
    element.addEventListener("pointerup", (event: PointerEvent) => {
      this.pointerup_handler(event);
    });
    // element.onpointercancel = this.pointerup_handler;
    element.addEventListener("pointercancel", (event: PointerEvent) => {
      this.pointerup_handler(event);
    });
    // element.onpointerout = this.pointerup_handler;
    element.addEventListener("pointerout", (event: PointerEvent) => {
      this.pointerup_handler(event);
    });
    // element.onpointerleave = this.pointerup_handler;
    element.addEventListener("pointerleave", (event: PointerEvent) => {
      this.pointerup_handler(event);
    });
  }
  remove_event(ev: PointerEvent) {
    // Remove this event from the target's cache
    for (var i = 0; i < this.evCache.length; i++) {
      if (this.evCache[i].pointerId == ev.pointerId) {
        this.evCache.splice(i, 1);
        break;
      }
    }
  }
  pointerdown_handler(ev: PointerEvent) {
    // The pointerdown event signals the start of a touch interaction.
    // This event is cached to support 2-finger gestures
    this.evCache.push(ev);
    // log("pointerDown", ev);
  }
  pointermove_handler(ev: PointerEvent) {
     ev.preventDefault();
    // This function implements a 2-pointer horizontal pinch/zoom gesture. 
    //
    // If the distance between the two pointers has increased (zoom in), 
    // the target element's background is changed to "pink" and if the 
    // distance is decreasing (zoom out), the color is changed to "lightblue".
    //
    // This function sets the target element's border to "dashed" to visually
    // indicate the pointer's target received a move event.
    // log("pointerMove", ev);
    // ev.target.style.border = "dashed";
    // Find this event in the cache and update its record with this event
    for (var i = 0; i < this.evCache.length; i++) {
      if (ev.pointerId == this.evCache[i].pointerId) {
         this.evCache[i] = ev;
      break;
      }
    }
   
    // If two pointers are down, check for pinch gestures
    if (this.evCache.length == 2) {
      // Calculate the distance between the two pointers
      var curDiff = Math.abs(this.evCache[0].clientX - this.evCache[1].clientX);
   
      if (this.prevDiff > 0) {
        if (curDiff > this.prevDiff) {
          // The distance between the two pointers has increased
          // log("Pinch moving OUT -> Zoom in", ev);
          // ev.target.style.background = "pink";
          // console.log("in");
          this.callback(curDiff + this.prevDiff);
        }
        if (curDiff < this.prevDiff) {
          // The distance between the two pointers has decreased
          // log("Pinch moving IN -> Zoom out",ev);
          // ev.target.style.background = "lightblue";
          // console.log("out");
          this.callback(curDiff + this.prevDiff);
        }
      }
   
      // Cache the distance for the next move event 
      this.prevDiff = curDiff;
    }
   }
   pointerup_handler(ev: PointerEvent) {
    this.remove_event(ev);
  
    // If the number of pointers down is less than two then reset diff tracker
    if (this.evCache.length < 2) {
      this.prevDiff = -1;
    }
  }
}
