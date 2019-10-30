---
title: "JVM Byte Code Method Signatures"
date: 2019-10-28T21:48:06-05:00
draft: true
summary: "JVM byte code stores method signatures very different from how they
look in Java. Check out this brief post if you want to know how to understand
them."
---


JVM byte code stores method signatures very different from how they
look in Java. For example, look at the method below. It's a static method that
takes as parameters a `String` array and `Integer`. It returns a `Double` array
when complete.

``` java
public static Double[] foo(String[] arg1, Integer arg2){
  return null; // TODO: What do you think this method does?
}
```
