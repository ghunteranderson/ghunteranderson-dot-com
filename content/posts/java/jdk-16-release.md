---
title: "JDK 16 Release"
date: 2021-03-16T08:00:00-05:00
draft: false
description: "Today is the JDK 16 general availability release! OpenJDK on Github, pattern matching for instance of, and records are just a few of the new features."
---

# JDK 16 Releases Today
Today is the JDK 16 general availability release! Here's quick summary of a few cool changes that are included.

# [JEP-369](https://openjdk.java.net/jeps/369) GitHub
OpenJDK has moved from Mercurial SCM to GitHub. This is a big deal for OpenJDK. Now all collaboration will happen on the GitHub platform in social Git fashion. In my opinion, this increases the potential for community engagement in the development of OpenJDK. It also makes OpenJDK source more easily available for debuging or casual reading.

You can find the repositories [here](https://github.com/openjdk/)

# [JEP-394](https://openjdk.java.net/jeps/394) Pattern Matching for instanceof
If you have ever used `instanceof` followed by a typecast, you know that the syntax is a bit wordy. Pattern matching for instanceof is a new syntax feature that lets you skip the typecast by declaring a new variable in the instanceof expression. Spoiler alert: this feature will get even more powerful with switch expressions.

**Before**
``` java
Vehicle v = Garage.getVehicle(id);
if(v instanceof Car){
  Car car = (Car) v;
  car.driveTo(location);
}
else if(v instanceof Boat){
  Boat boat = (Boat) v;
  boat.sailTo(location);
}
```
**After**
``` java
Vehicle v = Garage.getVehicle(id);
if(v instanceof Car car){
  car.driveTo(location);
}
else if(v instanceof Boat boat){
  boat.sailTo(location);
}
```

# [JEP-395](https://openjdk.java.net/jeps/395) Records
Before now, you could create classes, enums, interfaces, and annotations. Introducing the newest memember of the family, Java records. Sometimes in Java, we need pass immutable data around. Before JDK 16, the solution was to create a class with all its verbosity. Now there is a quicker and more concise way.

Here is the *before* example provided by JEP-395.
``` java
class Point {
    private final int x;
    private final int y;

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    int x() { return x; }
    int y() { return y; }

    public boolean equals(Object o) {
        if (!(o instanceof Point)) return false;
        Point other = (Point) o;
        return other.x == x && other.y == y;
    }

    public int hashCode() {
        return Objects.hash(x, y);
    }

    public String toString() {
        return String.format("Point[x=%d, y=%d]", x, y);
    }
}
```

This same class could be expressed as a record with
``` java
record Point(int x, int y) {}
```

By using a record, all of these are implicitly added:

* Instance variables (`private final`) for each argument in the header.
* An all-arguments constructor that assigns values to the generated instance variables
* Accessors for the generated instance variables
* An `equals(Object o)` and `hashCode()` method that uses the value of the generated instance variables
* A `toString()` method that includes the type name and value of each generated instance variable.

There's even more to learn about Records but that's all for this post. Checkout the [JEP](https://openjdk.java.net/jeps/395) for more info.

# Overview
The JDK 16 release brings these great features and even more. Head over to the [OpenJDK website](https://openjdk.java.net/projects/jdk/16/) to see what other JEPs were released but wouldn't fit into this short post.

That's all. Bye for now!
