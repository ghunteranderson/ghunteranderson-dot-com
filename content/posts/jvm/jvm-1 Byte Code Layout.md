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
we will take a high level look at the different sections of JVM byte code. There
is a lot to unpack when digesting JVM byte code for the first time so we will
start with a higher level view and drill down to understand the purpose of each
section and what data they store. We will divide the class file into six
sections; file metadata, constant pool, class metadata, fields, methods, and
class attributes.

# 2. File Metadata
![High level JVM byte code file layout](/images/jvm/file-metadata-high-level.png)

## 2.1 Magic Number
The first four bytes of every Java file is `0xCAFEBABE`, intentionally spelling
out "cafe babe". The magic number is used to identify the file is intended to be
a valid JVM class file.

## 2.2 Major and Minor Version
These four bytes denote the class file format version. Over time the class file
has evolved and changed. Placing this early in the file allows the interpreter
to know what it should expect when reading the remainder of the file.

# 3. Constant Pool


# 4. Class Metadata

# 4.2 Access Flags
These two bytes describe the access flags and modifiers applied at the class
level.

# 4.1 Class Name
Sometimes referred to as "this class",
