---
title: "Introducing Switch Expressions"
date: 2019-11-01T08:00:00-05:00
draft: false
description: "Switch expressions are a great new language feature to express some
things more concisely than we can today. They are available for preview in JDK 13."
---

# Introduction
Java has released an exciting new language feature in preview mode called switch
expressions ([JEP-354](https://openjdk.java.net/jeps/354)). These are a variation
of switch statements which can be evaluated to a value. This idea is similar to
the ternary operator which allows in line if-else statements to return a value.   

The code you see here can be ran with JDK 13 and the `--enable-preview` flag but,
**be warned**! A preview feature is "fully specified, fully implemented, and
yet impermanent" ([JEP-12](http://openjdk.java.net/jeps/12)). Adding a preview
however, there is a proposal to make switch statements permanent in JDK 14.

# Statements vs Expressions
When we talk about statements in source code, we are talking about a single line
of code that completes some action. Here we see three distinct statements.
``` java
int a = 4*(7+3);
boolean contact = eligible && available;
String name = user.getName();
```
An expression is typically a fragment and will evaluate to some value.
From above, we have the algebraic expression `4*(7+3)` which evaluates to 40.
The second statement has the boolean expression `eligible && available` which
evaluates to either true or false. Finally, the third statement has the expression
`user.getName()` which will evaluate to a String reference.

# The Switch Expression
Switch expressions borrow from the syntax of traditional switch statements but
allow the switch to be evaluated to a value. Because they are expressions, they
can be assigned to variables. For contrast, take a look at how we might assign a
value using a traditional switch statement.

``` java
int errorCode = getError();
String error = null;

switch(errorCode){
    case 404:
        error = "Not Found";
        break;
    case 400:
        error = "Bad Request";
        break;
    case 502:
    case 500:
        error = "Server Error";
        break;
    default:
        error = "Unknown Error";
}
```

There are drawbacks with this traditional switch statement.   

1. The code is error-prone. It is easy to miss a break statement by mistake
allowing execution to fall through to the next case block. Syntax that lends
itself to bugs is syntax we want to avoid.   

2. It doesn't feel natural. Perhaps this is subjective by case and developer, but
we often like to assign values at the variable declaration when possible. If a switch
statement is needed, we are forced to separate assignment from declaration by
limitations of syntax.    

3. Verbosity abounds. Verbosity that takes away from readability is typically a
bad thing. There are cleaner syntax alternatives for expressing this same
concept.   

How do switch expressions solve these problems? Let's rewrite the same code
using Java's new switch expression then talk about it.
``` java
int errorCode = getError();

String error = switch(errorCode){
    case 404 -> "Not Found";
    case 400 -> "Bad Request";
    case 502, 500 -> "Server Error";
    default -> "Unknown Error";
};
```
Here, the switch expression becomes a part of the the variable declaration. The
expression will be evaluated and stored in the local variable `error`. Notice
how we borrow the arrow from lambda syntax for mapping cases to values. There
are a few improvements to consider.

1. We have removed the need for break statements! There is no way to accidentally
fall through because every case yields a value and then exits the switch.
2. The declaration of the variable and its assignment are coupled into one
statement. It is guaranteed by the compiler that the switch will yield a
value (or throw an exception).
3. The code is much more concise. There's no need to explicitly break.
Also, multiple case labels can be combined in an intuitive way.

# Multi-line Case Bodies
Sometimes the body of a case might require more than a single expression. How
can we write switch expressions with more complex case bodies? We will again
borrow from lambda syntax and add braces after the arrow. Since this puts us in
a position to write multiple statements instead of a single expression, we will
need a way to signal the return value. Since `return` is reserved for exiting
the method, we introduce a new keyword, `yield`. Let's look at the code.

``` java
int errorCode = getError();

String error = switch(errorCode){
    case 404 -> "Not Found";
    case 400 -> "Bad Request";
    case 502, 500 -> "Server Error";
    default -> {
        logger.warning("Unknown error code " + errorCode);
        yield "Unknown error";
    }
};
```

In the default case, we were able to open braces after the arrow and enter a block
of statements. When we were ready to return the value for that case, we used
the `yield` keyword which will terminate the switch expression and assign the
value back to variable `error`. It might be worth noting that while we use a
lambda-ish syntax, no lambda functions are being created.

# Allowing Fall Through
Switch expressions do allow for fall through if you need it. However, I recommend
avoiding this syntax as much as possible. When using the arrow notation, every
case will yield a value and break. However, if we use a colon, like traditional switch
statements, we can introduce fall through.
``` java
String error = switch(errorCode){
    case 404:
        yield "Not Found";
    case 400:
        yield "Bad Request";
    case 502:
        logger.error("This will fall through to case 500's body");
    case 500:
        yield "Server Error";
    default:
        logger.warning("Unknown error code " + errorCode);
        yield "Unknown error";
};
```
If `errorCode` was 502, Java will first log the error message and then fall
through to the body of the 500 case. You can use either the colon
syntax or arrows but you cannot mix the two case kinds. If you do, the compiler
will print this error.
```
error: different case kinds used in the switch
```

# Conclusion
Switch expressions are a great new language feature to express something more
concisely than we could before. It was released in preview mode in JDK 13. There
is a ([proposal](https://openjdk.java.net/jeps/361)) to release switch expressions
in JDK 14. Until then, happy coding.   

\- Hunter Anderson   
