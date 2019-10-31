---
title: "JVM Byte Code Layout"
date: 2019-10-28T21:48:06-05:00
draft: true
summary: "Ever wonder what Java looks like after it's compiled? In this article
we will take a high level look at the different components of JVM byte including
the constant pool, fields, methods, meta data, instructions and more."
---

# 1. Introduction
Ever wonder what Java looks like after it's compiled? In this article
we will take a look at the different sections of JVM byte code. There
is a lot to unpack when digesting JVM byte code for the first time so we will
start with a high level view and drill down to understand the purpose of each
section and what data they store. We can divide the class file into six
sections; file metadata, constant pool, class metadata, fields, methods, and
class attributes.

![High level class file layout](/images/jvm/class-file-high-level.svg)

# 2. File Metadata
![High level class file metadata layout](/images/jvm/file-metadata-high-level.svg)

## 2.1 Magic Number
The first four bytes of every class file is `0xCAFEBABE` intentionally spelling
out "cafe babe". The magic number is used to identify the file as a JVM class
file.

## 2.2 Major and Minor Version
These four bytes denote the class file format version. Over time the class file
has evolved and changed. Placing this early in the file allows the interpreter
to know what it should expect when reading the remainder of the class.   

Here, we JDK versions and which class file major version they create.

| JDK     |     | Class File             |
|---------|-----|------------------------|
|  Java 14  |  --->   | Major Version 58 |
|  Java 13  |  --->   | Major Version 57 |
|  Java 12  |  --->   | Major Version 56 |
|  Java 11  |  --->   | Major Version 55 |
|  Java 10  |  --->   | Major Version 54 |
|  Java 9   |  --->   | Major Version 53 |
|  Java 8   |  --->   | Major Version 52 |
|  Java 7   |  --->   | Major Version 51 |
|  Java 6   |  --->   | Major Version 50 |
|  Java 5   |  --->   | Major Version 49 |

# 3. Constant Pool
The constant pool holds constants that can be shared across the class.
To interpret different types of constants, each entry type is assigned a numerical
tag. For examples, UTF-8 entries start with 0x01 but a class reference entry begins
with 0x07. This tag that helps the JVM know what kind of data is to follow
and, how many bytes long it will be. Constant pool entries also have an index
which is how they will be referenced by instructions or other constant pool entries.

![High level class file constant pool layout](/images/jvm/constant-pool-high-level.svg)

# 3.1 Number Constants
When your code has numbers in it, those numbers must be stored in the compiled
code. If they are small enough, they might be stored in the instruction set.
However larger numbers like integers, longs, floats, and doubles may be stored
in the constant pool. The can be pushed onto the stack with an instruction like
`ldc_w` and `ldc2_w`.

# 3.2 UTF-8 Constants
UTF-8 constant pool entries are a variable width text. The entry starts with 1
byte for the constant tag 0x01. The next 2 bytes are the length of the text
in bytes. This tells the JVM how far to read the value and where the next
constant pool entry will begin. Finally, the UTF-8 text value follows. The
constant isn't quite a Java String yet but is close. This constant could also
represent the name of a class, method, or field. The text could event represent
a method signature.

# 3.3 String Refs
String ref constants can be used for `java.lang.String` instances. Structurally,
they contain the constant tag `0x08` followed by two bytes for the index of a
UTF-8 constant with the Strings value.

# 3.4 Class Refs
Class ref constants are structured the same as String refs but point to a
qualified class name. In Java we write fully qualified class names as a dot
separated name. However, in class files, we will use a forward slash For example,
`java.lang.Integer` would be stored in the UTF-8 constant as `java/lang/Integer`.

# 3.6 NameAndType Constants
Before we can talk about method and field refs, we need to look at
the NameAndType constant. This is an entry that contains two references.
The first reference (name) points to a UTF-8 constant with the unqualified name
of a field or method ("&lt;init&gt;" in the case of a constructor). The second
reference, type, points to a UTF-8 constant with a field or method descriptor.   

# 3.7 Field Descriptors
Field descriptors are stored in UTF-8 constants. They are text describing the
field's type. However, the JVM expects a slightly different notation than Java.
For example:
``` Java
class Player {
  // Consider this field
  Integer[] scores;
  // It would generate the field descriptor
  // [Ljava.lang.Integer;
}
```
The left bracket signals an array of the following type and we represent classes
with `L{class name};`. There are also special characters assigned to the
primitive data types. To learn more about this syntax, check out the
[field descriptor specification](https://docs.oracle.com/javase/specs/jvms/se13/html/jvms-4.html#jvms-4.3.2).

# 3.8 Method Descriptors
Like field descriptors, method descriptors are stored in UTF-8 constants but they
represent the method signature. They follow a notation that extends field
descriptor grammar.
``` Java
// Consider this method
Double[] mathIt(long a, Integer b) {...}
// It generates descriptor
// (JLjava.lang.Integer;)[Ljava.lang.Double;
```
First, in parenthesis, we have the arguments. `J` represents a primitive long.
Next, the `L` signals a class will follow and be terminated by a semicolon. This
is the second argument. After the parenthesis close, we have the return type.
We're returning `java.lang.Double[]` which generates the type descriptor
`[Ljava.lang.Double;`. If the method returns void, we would see a `V` placed
after the closing parenthesis. The formal specification on
[method descriptors](https://docs.oracle.com/javase/specs/jvms/se13/html/jvms-4.html#jvms-4.3.3)
goes into more detail than we'll spend time on here.

# Method and Field Refs
Finally we get to method and field ref entries. Both are structured the same and
differ only in what they describe and where they can be used. First, there is a
reference to the owning class ref. This is the class where the method or field
can be found. Second, there is another reference to a NameAndType constant. This
describes the methods name and either the field descriptor or method descriptor,
whichever is appropriate. We will use these method and field ref constants in
the instruction sets to invoke methods or access fields.

# 4. Class Metadata
![High level class metadata layout](/images/jvm/class-metadata-high-level.svg)

## 4.1 Access Flags
These two bytes describe the access flags and modifiers applied at the class
level. This controls things like if the class is public, final, an interface,
an enum, an attribute, abstract, or synthetic.

## 4.2 Class Name
Sometimes referred to as "this class", these 2 bytes reference a constant pool
entry of type class reference. The entry represents the name of the class we are
defining.

## 4.3 Super Class
Similar to class name in 4.2, this sets the super class by referencing a constant
pool entry of type class reference. If the source code doesn't explicitly inherit
from a class, this will point to `java.lang.Object`.

## 4.4 Interface List
Interfaces on a class are optional and (somewhat) limitless. Here we find a variable
length array of constant pool indexes for class ref entries; one per interface
the class implements.

# 5. Fields
![High level class fields layout](/images/jvm/fields-high-level.svg)

# 5.1 Field Access Flags
The first 2 bytes of a field describe the field's access and modifier flags. This
controls if the field is public, private, protected, final, static, volatile,
transient, synthetic, or an enum element.

# 5.2 Field Name
These 2 bytes reference a UTF-8 constant index with the field's name.

# 5.3 Field Descriptor
These 2 bytes reference a UTF-8 constant index with the field descriptor.

# 6. Methods
![High level class methods layout](/images/jvm/methods-high-level.svg)

# 6.1 Method Access Flags
The first 2 bytes of a method describe the method's access and modifier flags.
This includes if the method is public, private, protected, static, final,
synchronized, synthetic, abstract, native, and more.

# 6.2 Method Name
These 2 bytes reference a UTF-8 constant index with the method's name.

# 6.3 Method Descriptor
These 2 bytes reference a UTF-8 constant index with the method descriptor.

# 6.4 Instructions
Stored in the attributes section of a method are the instruction.

# 7. Attributes
The class file can have several attributes attached at the end. The class file
is designed so that if a JVM does not recognize an attribute, it can skip over it
and ignore it.
![High level class attributes layout](/images/jvm/class-attributes-high-level.svg)
# 7.1 Source File
# 7.2 Annotations

# 8. Conclusion
