
## General Code Structure
#####
1. Delegated Backbone Events
2. Private variables / DOM variables
3. Initialize / AttachEvents, DetachEvents, Reset, Render
4. Separated Public Methods
5. Separated Getters / Setters
6. Separated Animation (where applicable)
7. Separated Event Handlers
8. Try to keep things alphabetical (where applicable)]

Separating code looks like:
```

// Public Methods
// ----------------------------------------------------

// Getters / Setters
// ----------------------------------------------------

// Animation
// ----------------------------------------------------

// Event Handlers
// ----------------------------------------------------

```

#### Code Notes
####

* Remember to properly call `attachEvents`, `detachEvents`, and `reset` methods for children and super.

* Do not set class variable to object by default. You must set via a function otherwise it'll be inherited by reference from future extensions. i.e.

```
var myClass = Backbone.View.extend({

    foo: {},     // DO NOT DO THIS
    bar: null,

    initialize: function(options) {

        // DO THIS INSTEAD
        this.bar = {};

    }

})();
```

* Use `Colors`, `Constants`, `Events`, `Pages`, `Stats`, `State`, `URLs` where applicable. Feel free to add more if it makes sense.

* Global namespace is "window.pm"

* "use strict" at top of each class.

* Class constants and aliases to global objects (like State, Constants, etc) are put at the top of each class; above the start of the object.

* Try to do event handler scope bindings in the initialize function as opposed to attach events, using `_.bindAll(this, xxx);`

---
## File Structure
#####
**script/vendor/** - External libraries, Backbone, Moment, etc.

**script/app/** - Home of the application source.

**script/app/lib/** - Similar to vendor, but written by us for this application.

**script/app/page/** - Top level of a particular section. Used for loading child views, communicating with Router, attaching events, delegating child renders / transitions / etc. Generally **not** used to handle *DOM element* interactions. These are all instantiated in **app.js**.

**script/app/view/** - Good example: *View_MainMenu*. These are instantiated by the parent page or a parent view. The parent must bubble attachEvents, detachEvents, render, and reset methods (where required). **app/page/x** is responsible for starting the call.

**script/app/app.js** - This kicks everything off. It instantiates all the pages and various global view elements. It attaches events to global view elements and sets body class of `ready`. It also captures our mouseX mouseY positions and sets them to `State` for global access.

**script/app/assets.js** - Global class to hold any extended content we might require.. including complicated JSON, Swiffy assets, Base64 strings, etc.

**script/app/main.js** - *Covered in more depth below.*

**script/app/router.js** - Connects URLs to transitional page elements. Broadcasts `Events.NAV` events during transition. *incomplete*. Will `reset`, `render`, `attachEvents`, `animateIn`, and call `onAnimatedIn` on **PAGE**. And transitions pages out by: `detachEvents`, `animateOut`, `onAnimatedOut`. The global `State.page` is set to the current page. All unknown URLs are transitioned back to **introduction**.

---

### Page_Base
#####
Pretty basic class, but we may need to extend it in the future for animations or transitional updates.

`attachEvents` also calls `delegateEvents`. delegateEvents is what Backbone uses to set the "events" object. They should remain tied together.

### View_Base
#####

* All views contain an object called `this.views = new namespace.View_Views(this);` It lets you maintan your subviews if you need them.. great for lists or just managing classes by name. I should be using it more than I am.

* `_onAnimateStart`, `_onAnimateIn, `_onAnimateOut`, `animateIn, `animateOut`

* Helpful methods: `hide`, `show` (uses class "hide"), `fadeIn`, `lock`, `unlock`, `reset`, `render`, `setState`, and more.

* `.template(params)` will apply params to $("#template-" + this.templateName)


### View_Views
#####

* `.add(view, name)` Name optional

* `.get(nameOrModel)` Gets a view by name applied or by the model you gave it.

* `.remove(name)` Find by name and remove

* `.first` `.last` `.at(num)` Self explanatory

* `.indexOfElement` - Check for an actual element in the views stack.
```
    this.views.indexOfElement( this.views.at(1) );
```

* `.each` - Allows you to iterate through all views in simple syntax.
```
    this.views.each(function(view) {
        view.render(); // or whatever
    }, this); // scope
```

* `.execAll(methodName, params)` - Applys a method to all views in list by name.
```
    this.views.execAll('render');
```


### Main
#####

* Has a bunch of `Flags` for determining browser type, mobile type, debug, user agent, etc.

* Globalizes many important objects, such as: `Colors`, `Constants`, `Events`, `Flags`, `Keys`, `Pages`, `State`, `Stats`, and `URLs`.

* Also provides easy access to:
    1. namespace.parent
    2. namespace.$document
    3. namespace.$window
    4. namespace.$body
    5. namespace.$main
    ####
* Window Load event exists here which initializes the application, does initial setup, and starts the Router.

* Backbone delegateEvents is overridden to allow for Hammer() touch events.

* Backbone prototype extended to allow **.log(...)** and **.warn(...)**. When using these, it'll look for *{ name: "xxx" }* in your class and prefix your message to it.

```
var myClass = Backbone.View.extend({
    name: "My Class",

    initialize: function(options) {
        this.log("Hey!");
    }
})();

// Outputs:
// [My Class] Hey!
```

* window.requestAnimFrame defined here

* Custom Underscore method: **bindDelay**, will allow you to delay a bound function cleanly.

---

## Super, Prototypes, Extending

Incomplete.