---
title: "Helpful NullPointerExceptions"
date: 2019-11-05T08:00:00-05:00
draft: false
description: "Helpful NullPointerException messages to the rescue! This JVM
enhancement will add more detail to null pointer exceptions helping developers
debug code faster."
---

# Introduction
My professor once said "null pointer exceptions are the bane of Java
programmers existence" and that never resonated quite as well as with enterprise
application development. When the exception message offers no more than a line
number, it can be difficult to identify the null reference and how to fix it.

Helpful NullPointerException messages to the rescue! This enhancement
[proposal](https://openjdk.java.net/jeps/358) will
add more detail to null pointer exceptions helping developers debug code faster.
It is scheduled to be released with JDK 14 in March 2020 and can be enabled with JVM flag `-XX:+ShowCodeDetailsInExceptionMessages`.
Currently, early access builds of JDK 14 are [available](https://jdk.java.net/14/).

# Method Invocation
We often chain methods in Java and when chaining throws a null
pointer exception, it can be difficult to know where it came from. Suppose your code
throws a NullPointerException with this line at the root cause.
``` java
String name = human.getDog().getName().toFullName().toUpperCase();
/* Exception in thread "main" java.lang.NullPointerException */
```
Where is the problem? There are 4 ways this code can throw a null pointer
exception. With helpful null pointer exceptions enabled, the message
would read: `Cannot invoke "Name.toFullName()" because the return value of
"Dog.getName()" is null`. With the additional information provided by the JVM,
we know this exception was caused by a dog that does not have a name. This knowledge
jump starts the debugging process for the developer and saves time.

# Fields
Attempting to read or assign a field when the parent object is null will result
in a null pointer exception. Let's look at how Java is improving those messages too.
Below we try to read then assign field `dog` but local variable `human` is
null. The exception messages for each scenario are below the code.
``` java
Dog dog = human.dog;
/* Exception in thread "main" java.lang.NullPointerException:
       Cannot read field "dog" because "human" is null */
```
``` java
human.dog = new Dog();
/* Exception in thread "main" java.lang.NullPointerException:
       Cannot assign field "dog" because "human" is null */
```

# Arrays
In this sample, we try to read from an array that is null. Without improved exception
messages, it would be difficult to know which of the three array lookups threw
the NullPointerException.
``` java
int val = myArrays[i][j][k];
/* Exception in thread "main" java.lang.NullPointerException:
       Cannot load from int array because "myArrays[i][j]" is null */
```
Similarly, we cannot store a value into the index of a null array.
``` java
myArray[i] = 10;
/* Exception in thread "main" java.lang.NullPointerException:
       Cannot store to int array because "myArray" is null */
```
Finally, the JVM handles accessing an array's length a little different than
other fields and the exception message is different as well.
``` java
int length = myArray.length;
/* Exception in thread "main" java.lang.NullPointerException:
       Cannot read the array length because "myArray" is null */
```

# Other Null Pointer Exceptions
A less common null pointer exception is when a null exception is thrown.
``` java
throw getException();
/* Exception in thread "main" java.lang.NullPointerException:
       Cannot throw exception because the return value of "this.getException()" is null */
```
Perhaps even less common is the null pointer exception thrown by opening a synchronized
block over a null object.
``` java
synchronized(lock){
    System.out.println("Variable 'lock' is null :(");
}
/* Exception in thread "main" java.lang.NullPointerException:
      Cannot enter synchronized block because "lock" is null */
```

# Limitations with Local Variables
Class files will include the names of all classes, methods, and fields used. That's
not always the case for local variables. Because the JVM does not need to know
what local variables are called to execute the instructions, the compiler will
only include them if requested. To include local variable names, the code should
be compiled with the `-g` flag for additional debug information.
Below is a sample exception message from code compiled without local variable
names included in the class file.

``` java
Object obj = null;
obj.toString();
/* Exception in thread "main" java.lang.NullPointerException:
       Cannot invoke "Object.toString()" because "<local1>" is null */
```
Without variable names included in the class file, the JVM provides all it knows
about the variable. The number in `<local1>` is the local variable's index assigned by the compiler.
It is the ordinality of the variable's declaration within the method but ignoring
any variables that are no longer in scope. That's a pretty dense sentence, so here's
an example of how javac might assign indexes.
``` java
Object a = new Object(); // local1
Object b = new Object(); // local2

if(condition1){
    Object c = new Object(); // local3
}
else {
    Object d = new Object(); // local3
    if(condition2){
        Object e = new Object(); // local4
    }
}
Object f = null; // local3
f.toString();
/* Exception in thread "main" java.lang.NullPointerException:
       Cannot invoke "Object.toString()" because "<local3>" is null */

```
The JVM wants to use as few indexes as possible since each index reserves a memory
address. A smaller max index means a smaller memory footprint on the call stack.
When declaring variables `a`, `b`, and `c`, we assigning them the indexes 1, 2,
and 3 based on the order they are declared. This pattern will continue with one
caveat. When we declare variable `d`, there are only 2 variables in scope; that is
variable `c` has left scope and its memory is no longer needed. For this reason
we can assign `d` the index 3. When we get to the declaration of `f`, both `d`
and `e` have left scope freeing their memory addresses. The next free index at
this point is 3, so `f` becomes local3. While it may be a little tedious, we can
deterministically know what any `<local#>` variable is given the original source
code. Including debug information of original variable names is helpful but results
in larger class files.

# Conclusion
Improved null pointer exception messages help developers debug code faster by
including more details about the source code that caused the exception. It is
available in JDK 14 but must be enabled with VM argument
`-XX:+ShowCodeDetailsInExceptionMessages`. However, there is a proposal to
enable the feature by default in JDK 15 pending feedback from JDK 14.

Happy Coding,   
- G. Hunter Anderson
